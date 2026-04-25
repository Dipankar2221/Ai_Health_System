import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// ✅ Initialize
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ===============================
// 🔧 CLEAN FUNCTION (REMOVE *, -, •)
// ===============================
const cleanText = (text) => {
  return text
    .replace(/[*\-•]/g, "") // remove symbols
    .replace(/\n\s*\n/g, "\n") // remove extra empty lines
    .trim();
};

// ===============================
// 🔹 RECOMMENDATION
// ===============================
export const generateRecommendation = async (type, prediction, formData) => {
  try {
    const prompt = `
You are a professional doctor.

Patient Data:
${JSON.stringify(formData)}

Prediction Result:
${JSON.stringify(prediction)}

Task:
Give ${type} recommendations.

Rules:
- Use numbered points (1, 2, 3...)
- Max 5 points
- Simple language
- Do NOT use *, -, or bullet symbols
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return cleanText(response.text);

  } catch (error) {
    console.error("Gemini Error:", error.message);
    return "AI service unavailable";
  }
};

// ===============================
// 🔹 AI REPORT
// ===============================
export const generateReport = async (prediction, formData) => {
  try {
    const prompt = `
You are an expert doctor AI.

Patient Details:
${JSON.stringify(formData)}

Prediction Result:
${JSON.stringify(prediction)}

Generate a structured health report with:

1. Risk Summary
2. Recommended Medicines
3. Blood Tests / Medical Examinations
4. Diet Plan
5. Exercise Plan
6. Lifestyle Advice
7. Prevention Tips

Rules:
- Each section must have numbered points (1, 2, 3...)
- Max 5 per section
- No *, -, or bullet symbols
- Simple language
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return cleanText(response.text);

  } catch (error) {
    console.error("Gemini Report Error:", error.message);
    return "Report generation failed";
  }
};

// ===============================
// 🔹 CHATBOT (STRICT JSON)
// ===============================
export const generateChatBot = async (message) => {
  try {
    const prompt = `
You are an AI doctor assistant.

IMPORTANT RULES:
- Respond ONLY in valid JSON
- reply MUST be a STRING
- Do NOT include questions
- Do NOT include isFinal
- No markdown, no extra text

Format:
{
  "reply": "Advice + simple medicine"
}

TASK:
- Identify possible cause
- Give simple advice
- Suggest common 2 to 3 medicine (safe)
- Keep response short and clear

User: ${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    let text = response.text;

    // ===============================
    // 🔧 SAFE JSON PARSE
    // ===============================
    const parseJSON = (raw) => {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    };

    let parsed = parseJSON(text);

    if (!parsed) {
      const fixed = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsed = parseJSON(fixed);
    }

    // fallback if still invalid
    if (!parsed) {
      return {
        reply: text.substring(0, 150),
      };
    }

    // ✅ FIX nested object
    if (typeof parsed.reply === "object") {
      parsed = parsed.reply;
    }

    return {
      reply:
        typeof parsed.reply === "string"
          ? parsed.reply
          : "No response",
    };

  } catch (error) {
    console.error("Chatbot Error:", error.message);

    return {
      reply: "AI service error",
    };
  }
};