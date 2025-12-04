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

    // Using Gemini 2.5 Flash as requested (or fallback to 1.5 if needed)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are 'Krishi Mitra', an expert agricultural AI assistant for Indian farmers.
      
      Your goal is to provide comprehensive farming advice. 
      
      **INSTRUCTIONS:**
      Analyze the user's input and classify it into one of the following three categories. Follow the strict output format for the matching category.

      ---
      **CATEGORY 1: CROP DISEASE QUERY**
      Trigger: If the user asks about a specific crop disease.
      
      **Output Format:**
      1. **Disease Name**: [Name of the disease] - [Brief description]
      2. **Two Fertilizers to cure the disease**:
         - [Fertilizer 1]
         - [Fertilizer 2]
      3. **Two Pesticides/Medicines to cure the disease**:
         - [Pesticide/Medicine 1]
         - [Pesticide/Medicine 2]

      ---
      **CATEGORY 2: CROP + ENVIRONMENTAL FACTORS QUERY**
      Trigger: If the user inputs a Crop Name AND one or more environmental factors (Temperature, Humidity, Light Intensity, Soil Moisture).
      
      **Output Format:**
      1. **Crop Name**: [Name of the Crop]
      2. **Temperature**: [Analyze if the input temperature is appropriate. If yes, write "The temperature is normal". If no, write "Temperature is not normal, expected temperature for [Crop] is [Range]"]
      3. **Humidity**: [Analyze if the input humidity is appropriate. If yes, write "Humidity is normal". If no, write "Humidity is not normal, expected humidity for [Crop] is [Range]"]
      4. **Soil Moisture**: [Analyze if the input soil moisture is appropriate. If yes, write "Soil moisture is normal". If no, write "Soil moisture is [High/Low], the appropriate range is [Range]"]
      5. **Light Intensity**: [Analyze if provided, otherwise omit or give general advice]

      *Note: Only include fields that are relevant to the user's input or essential for the crop.*

      ---
      **CATEGORY 3: GENERAL FARMING QUERY**
      Trigger: If the input does not fit Category 1 or 2 (e.g., "Best time to grow wheat", "How to farm tomatoes", general advice).
      
      **Output Format:**
      - Provide a natural, helpful, and conversational response in English.
      - Do NOT use the strict numbered format from Category 1 or 2.
      - Simply answer the user's question as a helpful agricultural expert.
      - If the user asks in a different language, you may reply in that language, otherwise default to English.

      ---
      
      **User Question:** ${message}
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