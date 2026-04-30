import { Worker } from 'bullmq';
import { callGemini } from '../utils/geminiHelper.js';
import Resume from '../models/Resume.js';
import PublicTemplate from '../models/PublicTemplate.js';
import { redisClient } from '../config/redisClient.js';
export const aiWorker = new Worker('ai-tasks', async (job) => {
  const { type, payload } = job.data;
  console.log(`[Worker] Processing Job ID: ${job.id} | Type: ${type}`);

  try {
    if (type === 'parse-resume') {
      const { resumeText, cacheHash } = payload;
      const prompt = `Extract the following resume text into a strict JSON object with properties: personalInfo (name, email, phone, location), summary, experience (array of objects with: company, role, startDate, endDate, description), education (array of objects with: degree, institution, startDate, endDate), skills (array of strings), projects (array of objects with: title, description). Do NOT include code formatting blocks or markdown. Output pure JSON ONLY.\n\nResume text:\n\n${resumeText}`;

      const resultJson = await callGemini(prompt);

      if (cacheHash) {
        // Save JSON parse to Redis for 30 days
        await redisClient.setex(`cache:parseResume:${cacheHash}`, 30 * 24 * 60 * 60, JSON.stringify(resultJson));
        console.log(`[Cache] Saved Parse report for hash: ${cacheHash}`);
      }

      return resultJson;
    }

    if (type === 'import-resume') {
      const { resumeText, userId, templateTheme, colorPalette, fontFamily } = payload;
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

      const newResume = await Resume.create({
        userId,
        title: aiJson.title || 'Imported Resume',
        template: { theme: templateTheme, colorPalette, fontFamily },
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
      return { resumeId: newResume._id };
    }

    if (type === 'ats-score') {
      const { resumeContext, jobDescription, resumeId, cacheHash } = payload;
      const prompt = `You are an enterprise-grade ATS engine calibrated to real hiring systems. Be brutally honest — most resumes score 40–65%.

Analyze the Candidate Resume JSON against this Job Description and return STRICT JSON with these exact fields:

{
  "score": <0-100, integer>,
  "experienceMatch": "<2-3 sentence honest evaluation of experience level fit — mention years, specific technologies, and any seniority gap>",
  "missingKeywords": ["<required term missing from resume>", ...],  
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
    {"text": "...", "score": 90},
    {"text": "...", "score": 85}
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

Scoring rules (apply strictly, no exceptions):
- **Experience level dimension**: Score this based ONLY on formal work experience entries (internships, part-time jobs, full-time jobs). Projects, personal work, or open source contributions do NOT count as work experience. If the work experience section is EMPTY or MISSING, this dimension score MUST be between 0–30 (depending on whether the JD explicitly allows fresh graduates/interns). NEVER give this dimension above 50 if there are zero formal experience entries.
- Penalize heavily for generic phrasing ("responsible for", "worked on", "involved in") — no quantified impact.
- Penalize if core hard skills from the JD are absent from experience bullets (not just the skills list).
- Penalize for mismatched seniority (e.g. JD asks 5+ years, candidate has 2).
- Penalize if the professional summary section is missing — a missing summary should give "Professional summary" an attention score of 80+.
- "attention" in timeline means how much a recruiter/ATS will focus there — high = needs the most improvement. If work experience is empty, "Work experience" attention must be 80+.
- The overall score should reflect all dimensions honestly. An empty experience section MUST drag the overall score down significantly.

Job Description:
${jobDescription}

Candidate Resume JSON:
${JSON.stringify(resumeContext)}`;
      const resultJson = await callGemini(prompt);

      if (resumeId && resultJson.score !== undefined) {
        const numericScore = parseInt(resultJson.score, 10);
        if (!isNaN(numericScore)) {
          await Resume.findByIdAndUpdate(resumeId, { atsScore: numericScore });
        }
      }

      if (cacheHash) {
        // Save report inside Redis for 30 days
        await redisClient.setex(`cache:atsScore:${cacheHash}`, 30 * 24 * 60 * 60, JSON.stringify(resultJson));
        console.log(`[Cache] Saved ATS report for hash: ${cacheHash}`);
      }

      return resultJson;
    }

    if (type === 'anonymize-publish') {
      const { resumeObj, userId, creatorName, tags } = payload;
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
${JSON.stringify(resumeObj)}`;
      const anonymizedData = await callGemini(prompt);

      const publicTemplate = await PublicTemplate.create({
        userId,
        creatorName,
        templateConfig: resumeObj.template || {},
        anonymizedData,
        tags,
      });
      return { templateId: publicTemplate._id };
    }

    if (type === 'enhance-bullet') {
      const { bulletPoint, roleTarget } = payload;
      const prompt = `Rewrite the following resume bullet point to make it sound highly professional, action-oriented, and quantified (if possible) for a ${roleTarget || 'Professional'} role. Do not invent numbers, but use placeholder [X] if you suggest impact metrics.\nOriginal: ${bulletPoint}`;
      return await callGemini(prompt, false); // false for raw text, not JSON
    }

    throw new Error(`Unknown job type: ${type}`);
  } catch (error) {
    console.error(`[Worker] Job ${job.id} failed:`, error.message);
    throw error;
  }
}, {
  connection: redisClient,
  concurrency: 2 // Max 2 parallel Gemini requests to prevent 429 Too Many Requests
});

aiWorker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} has completed!`);
});

aiWorker.on('failed', (job, err) => {
  console.log(`[Worker] Job ${job.id} has failed with ${err.message}`);
});
