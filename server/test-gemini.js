import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: "AIzaSyAo-aH9EeYxhVBppbfwWE7JteG3Ym6aqoY" });

const prompt = `Return a strict JSON object with {"status": "ok"}`;

async function run() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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
