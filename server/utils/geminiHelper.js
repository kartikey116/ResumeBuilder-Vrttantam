import { GoogleGenAI } from '@google/genai';

const GEMINI_MODEL = 'gemini-2.5-flash';

const getAiClient = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set in environment variables.');
    }
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export const extractJson = (rawText) => {
    if (!rawText) throw new Error('Empty response from AI engine');
    let clean = String(rawText);
    clean = clean.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

    try {
        return JSON.parse(clean);
    } catch (e) {
        console.warn('First JSON parse attempt failed, trying fallback search...', e.message);
        const jsonStart = clean.search(/[{[]/);
        if (jsonStart !== -1) {
            try {
                return JSON.parse(clean.substring(jsonStart));
            } catch (inner) {
                throw new Error(`AI returned invalid JSON structure: ${clean.slice(0, 200)}...`);
            }
        }
        throw new Error(`AI returned non-JSON content type: ${clean.slice(0, 200)}...`);
    }
};

export const callGemini = async (prompt, expectJson = true) => {
    try {
        const ai = getAiClient();
        console.log(`[AI] Calling model: ${GEMINI_MODEL}`);

        const config = expectJson ? { responseMimeType: 'application/json' } : {};
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config
        });

        const text = (typeof response.text === 'function') ? await response.text() : response.text;

        if (!text) {
            throw new Error('Empty response from AI model.');
        }

        return expectJson ? extractJson(text) : text;
    } catch (error) {
        console.error('[AI] Gemini API Error:', error.message);
        throw error;
    }
};
