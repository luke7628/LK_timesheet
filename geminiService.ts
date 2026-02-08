
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initialize Gemini API client using the environment variable directly as required by guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeLogs = async (logs: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following work logs in one concise sentence: ${logs}`,
      config: {
        systemInstruction: "You are a professional contract manager. Keep summaries brief and informative.",
      },
    });
    return response.text || "No summary available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate summary.";
  }
};

export const parseVoiceCommand = async (command: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract contract details from this voice command: "${command}". 
      Return JSON with clientName, durationInHours, and workDescription.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clientName: { type: Type.STRING },
            durationInHours: { type: Type.NUMBER },
            workDescription: { type: Type.STRING },
          },
          required: ["clientName", "durationInHours", "workDescription"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
