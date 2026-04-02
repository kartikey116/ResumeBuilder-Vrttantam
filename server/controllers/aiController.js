import { GoogleGenAI } from '@google/genai';
import { createRequire } from 'module';
import Resume from '../models/Resume.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// Initialize Gemini Client dynamically to prevent startup crash if .env is missing
const getAiClient = () => {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not found in .env. AI features will fail.");
    }
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
};

export const parseResumeToJSON = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
        }

        const dataBuffer = req.file.buffer; // We need multer to use MemoryStorage for parsing before S3, or parse from S3 stream.
        const pdfData = await pdfParse(dataBuffer);
        const resumeText = pdfData.text;

        const prompt = `Extract the following resume text into a strict JSON object with properties: personalInfo (name, email, phone, location), summary, experience (array of objects), education (array of objects), skills (array of strings), projects (array of objects). Do NOT include code formatting blocks or markdown formatting. Output pure JSON ONLY. \n\n Resume text: \n\n ${resumeText}`;

        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                // strict json response format
                responseMimeType: "application/json",
            }
        });

        const cleanJsonText = response.text.replace(/```json\n?|\n?```/g, '').trim();
        const parsedJson = JSON.parse(cleanJsonText);

        res.status(200).json({ success: true, parsed: parsedJson });
    } catch (error) {
        console.error('Error parsing resume:', error);
        res.status(500).json({ success: false, message: 'Failed to process the uploaded resume.', error: error.message, stack: error.stack });
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

        const prompt = `You are a brutally strict, enterprise-grade Applicant Tracking System (ATS) (like Workday or Taleo) performing a resume scan.
        Compare the Candidate Resume JSON against the Job Description. You must be extremely critical. Most resumes should score between 40-65%. Do not give a score above 75% unless the resume is a near-perfect match with hard, quantified metrics and exact keyword overlap.

        Scoring Rules:
        - Penalize heavily if the candidate uses generic phrasing instead of quantifiable achievements (numbers, percentages).
        - Penalize heavily if core technical or hard skills from the Job Description are missing.
        - Penalize for fluff or buzzwords without context.

        Provide a strict JSON response containing explicitly:
        1. "score": Match percentage (0-100). Be brutal.
        2. "missingKeywords": Array of explicitly required keywords or skills from the Job Description that are missing in the resume.
        3. "feedback": Array of 3 highly critical, actionable suggestions (e.g., "Quantify your impact in the recent role", "Missing critical skill X").
        4. "experienceMatch": Brutally honest string evaluating if their years of experience and level match the JD.
        5. "timeline": Array of exactly 9 objects mapping a recruiter's 6-second attention timeline. Each MUST have "name" (string, e.g., "Header", "Summary", "Recent Role", "Education") and "attention" (number 0-100). Drop attention to 0-20% if a section is boring or irrelevant.
        6. "hotspots": Array of 3 objects with string "text" (a fragment of resume text that is actually impressive/quantified) and number "score" (0-100 relevance).
        7. "coldspots": Array of 2 strings (weak, fluffy, or irrelevant phrases in the resume that must be rewritten).

        Return ONLY a raw JSON object string matching exactly this format:
        {
           "score": 45,
           "missingKeywords": ["GraphQL", "AWS"],
           "feedback": ["Quantify frontend performance improvements"],
           "experienceMatch": "Candidate lacks senior-level architectural experience required.",
           "timeline": [{"name": "Start", "attention": 80}],
           "hotspots": [{"text": "Increased conversion by 20%", "score": 90}],
           "coldspots": ["Worked well in a team"]
        }

        Job Description:
        ${jobDescription}

        Candidate Resume JSON:
        ${JSON.stringify(targetResumeData)}
        `;

        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        // Strip any potential markdown formatting block
        const cleanJsonText = response.text.replace(/```json\n?|\n?```/g, '').trim();
        const resultJson = JSON.parse(cleanJsonText);

        if (resumeId && resultJson.score !== undefined) {
             const numericScore = parseInt(resultJson.score, 10);
             if (!isNaN(numericScore)) {
                 await Resume.findByIdAndUpdate(resumeId, { atsScore: numericScore });
             }
        }

        res.status(200).json({ success: true, analysis: resultJson });
    } catch (error) {
        console.error('Error in ATS check:', error);
        res.status(500).json({ success: false, message: 'Failed to complete ATS Analysis.' });
    }
};

export const enhanceBulletPoint = async (req, res) => {
    try {
        const { bulletPoint, roleTarget } = req.body;

        const prompt = `Rewrite the following resume bullet point to make it sound highly professional, action-oriented, and quantified (if possible) for a ${roleTarget || 'Professional'} role. Do not invent numbers, but use placeholder [X] if you suggest impact metrics. 
        Original: ${bulletPoint}`;

        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.status(200).json({ success: true, enhanced: response.text });
    } catch (error) {
        console.error('Error enhancing bullet:', error);
        res.status(500).json({ success: false, message: 'Failed to enhance bullet.' });
    }
};
