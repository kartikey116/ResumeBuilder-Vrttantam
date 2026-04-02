import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: "AIzaSyAo-aH9EeYxhVBppbfwWE7JteG3Ym6aqoY" });

const jobDescription = "We need a React developer with NodeJS and MongoDB.";
const targetResumeData = { summary: "Software engineer" };

const prompt = `You are a strict, top-tier Applicant Tracking System (ATS) simulating a 6-second recruiter scan. Analyze the Candidate Resume JSON against the Job Description. Provide a strict JSON response containing explicitly:
        1. "score": Match percentage (0-100).
        2. "missingKeywords": Array of missing important strings.
        3. "feedback": Array of 3 short, actionable suggestions.
        4. "experienceMatch": String explaining fit.
        5. "timeline": Array of exactly 9 objects mapping a recruiter's attention timeline. Each object MUST have "name" (string, e.g., "Start", "Peak Risk", "High-intention", "Cold zone") and "attention" (number 0-100 indicating focus).
        6. "hotspots": Array of 3 objects containing string "text" (a fragment of resume text that shines) and number "score" (0-100 match relevance).
        7. "coldspots": Array of 2 strings (weak resume fragments to rewrite).

        Job Description:
        ${jobDescription}

        Candidate Resume JSON:
        ${JSON.stringify(targetResumeData)}
        `;

async function run() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        console.log("RAW RESPONSE:", response.text);
        const obj = JSON.parse(response.text);
        console.log("PARSED OBJ:", obj);
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}
run();
