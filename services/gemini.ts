import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real environment, always access API_KEY from process.env
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const GeminiService = {
  generateEventDescription: async (title: string, category: string, organizer: string): Promise<string> => {
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key missing");
      return "AI generation unavailable. Please check your API key.";
    }

    try {
      const model = 'gemini-2.5-flash';
      const prompt = `Write an engaging, professional, and exciting description for a college event.
      
      Event Title: ${title}
      Category: ${category}
      Organizer: ${organizer}
      
      The description should be about 2-3 paragraphs. Include a call to action at the end. Make it sound appealing to university students.`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      return response.text || "Could not generate description.";
    } catch (error) {
      console.error("Gemini AI Error:", error);
      return "Error generating description. Please try again.";
    }
  }
};