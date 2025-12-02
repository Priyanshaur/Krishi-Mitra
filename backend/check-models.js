import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function checkAvailableModels() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Error: GEMINI_API_KEY is missing in .env file");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    console.log("🔍 Connecting to Google AI to fetch available models...");
    // This connects to the API and asks "What models can I use?"
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API Request Failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("\n✅ AVAILABLE MODELS (Copy one of these exactly):");
    console.log("------------------------------------------------");
    data.models.forEach(model => {
      // We only care about models that support 'generateContent'
      if (model.supportedGenerationMethods.includes("generateContent")) {
        console.log(`Model Name: ${model.name.replace("models/", "")}`);
      }
    });
    console.log("------------------------------------------------\n");

  } catch (error) {
    console.error("❌ Failed to list models. Your API Key might be invalid or from Vertex AI.");
    console.error("Error details:", error.message);
  }
}

checkAvailableModels();