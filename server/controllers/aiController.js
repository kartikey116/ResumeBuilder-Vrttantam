import { createRequire } from 'module';
import { aiQueue } from '../queue/aiQueue.js';
import Resume from '../models/Resume.js';
import crypto from 'crypto';
import { redisClient } from '../config/redisClient.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

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
            return res.status(200).json({ success: false, status: state, error: job.failedReason });
        }

        return res.status(200).json({ success: true, status: state }); // waiting, active, delayed
    } catch (error) {
        console.error('Error fetching job status:', error);
        res.status(500).json({ success: false, message: 'Error checking job status' });
    }
};

export const parseResumeToJSON = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a PDF file' });

        // Synchronous PDF parsing. (Usually fast enough <50ms)
        const pdfData = await pdfParse(req.file.buffer);
        
        // Caching layer for PDF -> JSON extraction
        const textHash = crypto.createHash('sha256').update(pdfData.text).digest('hex');
        const cachedParse = await redisClient.get(`cache:parseResume:${textHash}`);
        
        if (cachedParse) {
            console.log('[Cache] Hit! Skipping AI PDF string extraction.');
            return res.status(200).json({ success: true, result: JSON.parse(cachedParse), cached: true });
        }
        
        // Enqueue the heavy job
        const job = await aiQueue.add('analyze', {
            type: 'parse-resume',
            payload: { resumeText: pdfData.text, cacheHash: textHash }
        });

        // Immediately return 202 Accepted
        res.status(202).json({ success: true, message: 'Parse started', jobId: job.id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
        });

        res.status(202).json({ success: true, message: 'Import job queued', jobId: job.id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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

        // --- EXTREMELY FAST CACHING LAYER ---
        const cachePayload = JSON.stringify(resumeContext) + jobDescription;
        const cacheHash = crypto.createHash('sha256').update(cachePayload).digest('hex');

        const cachedReport = await redisClient.get(`cache:atsScore:${cacheHash}`);
        if (cachedReport) {
            console.log('[Cache] Hit! Skipping ATS AI generation.');
            return res.status(200).json({ success: true, analysis: JSON.parse(cachedReport), cached: true });
        }
        // ------------------------------------

        const job = await aiQueue.add('analyze', {
            type: 'ats-score',
            payload: { resumeContext, jobDescription, resumeId, cacheHash }
        });

        res.status(202).json({ success: true, message: 'ATS Score job queued', jobId: job.id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
        });

        res.status(202).json({ success: true, message: 'Publishing job queued', jobId: job.id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const enhanceBulletPoint = async (req, res) => {
    try {
        const { bulletPoint, roleTarget } = req.body;

        const job = await aiQueue.add('analyze', {
            type: 'enhance-bullet',
            payload: { bulletPoint, roleTarget }
        });

        res.status(202).json({ success: true, message: 'Enhance bullet job queued', jobId: job.id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
