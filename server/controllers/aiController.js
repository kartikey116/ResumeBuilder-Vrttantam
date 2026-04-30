import { createRequire } from 'module';
import { aiQueue } from '../queue/aiQueue.js';
import Resume from '../models/Resume.js';
import crypto from 'crypto';
import { redisClient } from '../config/redisClient.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const JOB_OPTIONS = {
    attempts: 3,
    backoff: { type: 'exponential', delay: 3000 }
};

const handleAiQueueError = (error, res) => {
    console.error('[AI Controller Error]:', error.message);
    if (error.message.includes('ECONNREFUSED') || error.message.includes('OOM') || error.message.includes('Redis') || error.message.includes('socket')) {
        return res.status(503).json({ success: false, message: 'Our background service is currently experiencing high load or offline. Please try again in a few minutes.' });
    }
    return res.status(500).json({ success: false, message: 'Failed to process request. Please try again.' });
};

export const getAiJobStatus = async (req, res) => {
    try {
        const job = await aiQueue.getJob(req.params.jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found.' });
        }

        const state = await job.getState();
        if (state === 'completed') {
            return res.status(200).json({ success: true, status: state, result: job.returnvalue });
        }
        if (state === 'failed') {
            let userFriendlyError = 'An error occurred during AI processing.';
            if (job.failedReason) {
                if (job.failedReason.includes('AI_RATE_LIMIT_EXCEEDED')) {
                    userFriendlyError = 'AI Engine is currently overloaded with requests. Please try again in a moment.';
                } else if (job.failedReason.includes('AI_QUOTA_EXHAUSTED')) {
                    userFriendlyError = 'AI service quota exhausted. Please contact support or try again later.';
                } else if (job.failedReason.includes('invalid JSON') || job.failedReason.includes('parse attempt failed')) {
                    userFriendlyError = 'AI returned an unexpected format. Please try again.';
                } else {
                    userFriendlyError = `Processing failed: ${job.failedReason.replace('Error: ', '')}`;
                }
            }
            return res.status(200).json({ success: false, status: state, error: userFriendlyError });
        }

        return res.status(200).json({ success: true, status: state }); // waiting, active, delayed
    } catch (error) {
        handleAiQueueError(error, res);
    }
};

export const parseResumeToJSON = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a PDF file' });

        const pdfData = await pdfParse(req.file.buffer);
        const textHash = crypto.createHash('sha256').update(pdfData.text).digest('hex');
        
        try {
            const cachedParse = await redisClient.get(`cache:parseResume:${textHash}`);
            if (cachedParse) {
                console.log('[Cache] Hit! Skipping AI PDF string extraction.');
                return res.status(200).json({ success: true, result: JSON.parse(cachedParse), cached: true });
            }
        } catch (cacheErr) {
            console.warn('[Cache Warning] Failed to read from Redis cache:', cacheErr.message);
            // Continue execution even if cache fails
        }
        
        const job = await aiQueue.add('analyze', {
            type: 'parse-resume',
            payload: { resumeText: pdfData.text, cacheHash: textHash }
        }, JOB_OPTIONS);

        res.status(202).json({ success: true, message: 'Parse started', jobId: job.id });
    } catch (error) {
        handleAiQueueError(error, res);
    }
};

export const importResumeToDashboard = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a PDF file' });

        const pdfData = await pdfParse(req.file.buffer);
        
        const templateTheme = req.body.templateTheme || '01';
        const colorPalette = req.body.colorPalette ? JSON.parse(req.body.colorPalette) : [];
        const fontFamily = req.body.fontFamily || 'Inter, sans-serif';

        const job = await aiQueue.add('analyze', {
            type: 'import-resume',
            payload: { 
                resumeText: pdfData.text,
                userId: req.user._id,
                templateTheme,
                colorPalette,
                fontFamily
            }
        }, JOB_OPTIONS);

        res.status(202).json({ success: true, message: 'Import job queued', jobId: job.id });
    } catch (error) {
        handleAiQueueError(error, res);
    }
};

export const atsScore = async (req, res) => {
    try {
        const { resumeId, resumeDataJson, jobDescription } = req.body;
        let targetResumeData = resumeDataJson;
        
        if (resumeId && !targetResumeData) {
            const resumeDoc = await Resume.findById(resumeId);
            if (resumeDoc) targetResumeData = resumeDoc;
        }

        if (!targetResumeData || !jobDescription) {
            return res.status(400).json({ success: false, message: 'Both resume JSON and target Job Description are required.' });
        }

        const resumeContext = (typeof targetResumeData.toObject === 'function') ? targetResumeData.toObject() : targetResumeData;

        const cachePayload = JSON.stringify(resumeContext) + jobDescription;
        const cacheHash = crypto.createHash('sha256').update(cachePayload).digest('hex');

        try {
            const cachedReport = await redisClient.get(`cache:atsScore:${cacheHash}`);
            if (cachedReport) {
                console.log('[Cache] Hit! Skipping ATS AI generation.');
                return res.status(200).json({ success: true, analysis: JSON.parse(cachedReport), cached: true });
            }
        } catch (cacheErr) {
            console.warn('[Cache Warning] Failed to read from Redis cache:', cacheErr.message);
        }

        const job = await aiQueue.add('analyze', {
            type: 'ats-score',
            payload: { resumeContext, jobDescription, resumeId, cacheHash }
        }, JOB_OPTIONS);

        res.status(202).json({ success: true, message: 'ATS Score job queued', jobId: job.id });
    } catch (error) {
        handleAiQueueError(error, res);
    }
};

export const anonymizeAndPublish = async (req, res) => {
    try {
        const { resumeId, creatorName, tags } = req.body;
        if (!resumeId) return res.status(400).json({ success: false, message: 'resumeId is required.' });

        const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
        if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

        const job = await aiQueue.add('analyze', {
            type: 'anonymize-publish',
            payload: { 
                resumeObj: resume.toObject(),
                userId: req.user._id,
                creatorName: creatorName || req.user.name,
                tags: tags || [] 
            }
        }, JOB_OPTIONS);

        res.status(202).json({ success: true, message: 'Publishing job queued', jobId: job.id });
    } catch (error) {
        handleAiQueueError(error, res);
    }
};

export const enhanceBulletPoint = async (req, res) => {
    try {
        const { bulletPoint, roleTarget } = req.body;

        const job = await aiQueue.add('analyze', {
            type: 'enhance-bullet',
            payload: { bulletPoint, roleTarget }
        }, JOB_OPTIONS);

        res.status(202).json({ success: true, message: 'Enhance bullet job queued', jobId: job.id });
    } catch (error) {
        handleAiQueueError(error, res);
    }
};
