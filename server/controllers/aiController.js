import { GoogleGenAI } from '@google/genai';
import { createRequire } from 'module';
import Resume from '../models/Resume.js';
import PublicTemplate from '../models/PublicTemplate.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// ✅ Correct model name for @google/genai v1.x
const GEMINI_MODEL = 'gemini-2.5-flash';

// Initialize Gemini Client dynamically
const getAiClient = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set in environment variables.');
    }
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

// ✅ Robust JSON extractor — handles plain JSON and markdown-wrapped JSON
const extractJson = (rawText) => {
    if (!rawText) throw new Error('Empty response from Gemini');
    // Strip markdown code fences if present
    const clean = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
    try {
        return JSON.parse(clean);
    } catch (e) {
        // Last resort: find the first { or [ and parse from there
        const jsonStart = clean.search(/[{[]/);
        if (jsonStart !== -1) {
            return JSON.parse(clean.substring(jsonStart));
        }
        throw new Error(`Gemini returned non-JSON: ${clean.slice(0, 200)}`);
    }
};

// Helper to call Gemini and get JSON response
const callGemini = async (prompt) => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    return extractJson(response.text);
};

// --- Parse PDF to generic JSON (no auth required, for ATS scanner) ---
export const parseResumeToJSON = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
        }

        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        const prompt = `Extract the following resume text into a strict JSON object with properties: personalInfo (name, email, phone, location), summary, experience (array of objects with: company, role, startDate, endDate, description), education (array of objects with: degree, institution, startDate, endDate), skills (array of strings), projects (array of objects with: title, description). Do NOT include code formatting blocks or markdown. Output pure JSON ONLY.\n\nResume text:\n\n${resumeText}`;

        const parsedJson = await callGemini(prompt);
        res.status(200).json({ success: true, parsed: parsedJson });
    } catch (error) {
        console.error('Error parsing resume:', error);
        res.status(500).json({ success: false, message: 'Failed to process the uploaded resume.', error: error.message });
    }
};

// --- Phase 1: Import PDF directly to user's dashboard (requires auth) ---
export const importResumeToDashboard = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
        }

        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        const prompt = `You are a resume parser. Extract the resume text below into a STRICT JSON object matching this EXACT schema. Do not add extra fields. Output pure JSON only, no markdown.

Schema:
{
  "title": "(Job Title or 'My Imported Resume')",
  "profileInfo": {
    "fullName": "",
    "designation": "(current or most recent job title)",
    "summary": ""
  },
  "contactInfo": {
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "website": ""
  },
  "workExperience": [{ "company": "", "role": "", "startDate": "", "endDate": "", "description": "", "isCurrentlyWorking": false }],
  "education": [{ "degree": "", "institution": "", "startDate": "", "endDate": "" }],
  "skills": [{ "name": "", "progress": 80 }],
  "projects": [{ "title": "", "description": "", "github": "", "liveDemo": "" }],
  "certifications": [{ "title": "", "issuer": "", "year": "" }],
  "languages": [{ "name": "", "progress": 80 }],
  "interests": []
}

Resume text:
${resumeText}`;

        const aiJson = await callGemini(prompt);

        // Read template settings sent from the frontend template picker
        const templateTheme = req.body.templateTheme || '01';
        const colorPalette = req.body.colorPalette ? JSON.parse(req.body.colorPalette) : [];
        const fontFamily = req.body.fontFamily || 'Inter, sans-serif';

        const newResume = await Resume.create({
            userId: req.user._id,
            title: aiJson.title || 'Imported Resume',
            template: {
                theme: templateTheme,
                colorPalette: colorPalette,
                fontFamily: fontFamily,
            },
            profileInfo: aiJson.profileInfo || {},
            contactInfo: aiJson.contactInfo || {},
            workExperience: aiJson.workExperience || [],
            education: aiJson.education || [],
            skills: aiJson.skills || [],
            projects: aiJson.projects || [],
            certifications: aiJson.certifications || [],
            languages: aiJson.languages || [],
            interests: aiJson.interests || [],
        });

        res.status(201).json({
            success: true,
            message: 'Resume imported successfully! You can find it on your Dashboard.',
            resumeId: newResume._id,
        });
    } catch (error) {
        console.error('Error importing resume:', error);
        res.status(500).json({ success: false, message: 'Failed to import the resume.', error: error.message });
    }
};

// --- ATS Score Analysis ---
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

        //         const prompt = `You are a brutally strict, enterprise-grade Applicant Tracking System (ATS) performing a resume scan. Compare the Candidate Resume JSON against the Job Description. You must be extremely critical. Most resumes should score between 40-65%.

        // Scoring Rules:
        // - Penalize heavily if the candidate uses generic phrasing instead of quantifiable achievements.
        // - Penalize heavily if core technical or hard skills from the Job Description are missing.
        // - Penalize for fluff or buzzwords without context.

        // Provide a strict JSON response with:
        // 1. "score": Match percentage (0-100). Be brutal.
        // 2. "missingKeywords": Array of required keywords missing in the resume.
        // 3. "feedback": Array of 3 highly critical, actionable suggestions.
        // 4. "experienceMatch": Brutally honest string evaluating the experience level match.
        // 5. "timeline": Array of exactly 9 objects, each with "name" (string) and "attention" (number 0-100).
        // 6. "hotspots": Array of 3 objects with "text" (fragment) and "score" (0-100).
        // 7. "coldspots": Array of 2 strings (weak phrases to rewrite).

        // Job Description: ${jobDescription}
        // Candidate Resume JSON: ${JSON.stringify(targetResumeData)}`;


        const prompt = `You are an enterprise-grade ATS engine calibrated to real hiring systems. Be brutally honest — most resumes score 40–65%.

Analyze the Candidate Resume JSON against this Job Description and return STRICT JSON with these exact fields:

{
  "score": <0-100, integer>,
  "experienceMatch": "<2-3 sentence honest evaluation of experience level fit — mention years, specific technologies, and any seniority gap>",
  "missingKeywords": ["<required term missing from resume>", ...],  // 5-10 items
  "dimensions": [
    {"name": "Keyword match", "score": <0-100>},
    {"name": "Skills alignment", "score": <0-100>},
    {"name": "Experience level", "score": <0-100>},
    {"name": "Impact & metrics", "score": <0-100>},
    {"name": "Formatting quality", "score": <0-100>}
  ],
  "timeline": [
    {"name": "Contact info", "attention": <0-100>},
    {"name": "Professional summary", "attention": <0-100>},
    {"name": "Work experience", "attention": <0-100>},
    {"name": "Skills section", "attention": <0-100>},
    {"name": "Education", "attention": <0-100>},
    {"name": "Projects", "attention": <0-100>},
    {"name": "Certifications", "attention": <0-100>},
    {"name": "Keywords density", "attention": <0-100>},
    {"name": "Formatting / ATS parse", "attention": <0-100>}
  ],
  "hotspots": [
    {"text": "<strong phrase from resume>", "score": <50-100>},
    {"text": "...", "score": ...},
    {"text": "...", "score": ...}
  ],
  "coldspots": [
    "<exact weak phrase to rewrite>",
    "<exact weak phrase to rewrite>"
  ],
  "feedback": [
    "<specific, actionable fix #1 — reference the actual resume content>",
    "<specific, actionable fix #2>",
    "<specific, actionable fix #3>"
  ]
}

Scoring rules:
- Penalize heavily for generic phrasing ("responsible for", "worked on", "involved in") — no quantified impact.
- Penalize if core hard skills from the JD are absent from experience bullets (not just the skills list).
- Penalize for mismatched seniority (e.g. JD asks 5+ years, candidate has 2).
- "attention" in timeline means how much a recruiter/ATS will focus there — high = needs the most improvement.

Job Description:
${jobDescription}

Candidate Resume JSON:
${JSON.stringify(targetResumeData)}`;

        const resultJson = await callGemini(prompt);

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

// --- Phase 2: AI Anonymization Publisher ---
export const anonymizeAndPublish = async (req, res) => {
    try {
        const { resumeId, creatorName, tags } = req.body;

        if (!resumeId) {
            return res.status(400).json({ success: false, message: 'resumeId is required.' });
        }

        const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found or you do not have permission.' });
        }

        const prompt = `You are a privacy protection AI. Take the candidate's resume JSON below and return a new JSON object with the EXACT same data structure and array lengths — but replace ALL text content with hyper-realistic, professional dummy data.

Rules:
- Replace all names with realistic fictional names (e.g., "Alex Carter")
- Replace all emails with fictional ones (e.g., "alex.carter@email.com")
- Replace all phone numbers with fake numbers
- Replace all company names with fictional companies (e.g., "Nexus Technologies", "Orion Labs")
- Replace all job titles and bullet points with realistic but fictional equivalents
- Maintain the exact same schema with ALL the same keys
- Do NOT include any real PII. NOT A SINGLE PIECE.
- Output pure JSON only, no markdown.

Original Resume JSON:
${JSON.stringify(resume.toObject())}`;

        const anonymizedData = await callGemini(prompt);

        const publicTemplate = await PublicTemplate.create({
            userId: req.user._id,
            creatorName: creatorName || req.user.name,
            templateConfig: {
                theme: resume.template?.theme || '',
                colorPalette: resume.template?.colorPalette || [],
                fontFamily: resume.template?.fontFamily || '',
            },
            anonymizedData,
            tags: tags || [],
        });

        res.status(201).json({
            success: true,
            message: 'Your template has been published to the Community Gallery!',
            templateId: publicTemplate._id,
        });
    } catch (error) {
        console.error('Error anonymizing and publishing template:', error);
        res.status(500).json({ success: false, message: 'Failed to publish template.', error: error.message });
    }
};

// --- Enhance Bullet Point ---
export const enhanceBulletPoint = async (req, res) => {
    try {
        const { bulletPoint, roleTarget } = req.body;

        const prompt = `Rewrite the following resume bullet point to make it sound highly professional, action-oriented, and quantified (if possible) for a ${roleTarget || 'Professional'} role. Do not invent numbers, but use placeholder [X] if you suggest impact metrics.
Original: ${bulletPoint}`;

        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
        });

        res.status(200).json({ success: true, enhanced: response.text });
    } catch (error) {
        console.error('Error enhancing bullet:', error);
        res.status(500).json({ success: false, message: 'Failed to enhance bullet.' });
    }
};
