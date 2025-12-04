import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        response: "⚠️ API Key missing. I can only give basic advice right now."
      });
    }

    // ✅ Correct model from your list
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      You are 'Krishi Mitra', an expert agricultural AI assistant for Indian farmers.
      Answer this user question in simple, helpful English (or Hindi/Marathi if asked).
      Keep answers concise (under 3-4 sentences if possible).
      User Question: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text
    });

  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      success: false,
      message: 'Error processing chat message'
    });
  }
};