import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import Diagnosis from '../models/Diagnose.js'; 

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ SIMULATE IOT SENSOR DATA (Dynamic Values)
const getIoTSensorData = () => {
  const temp = (25 + Math.random() * 5).toFixed(1); // 25-30°C
  const moisture = (45 + Math.random() * 20).toFixed(0); // 45-65%
  const humidity = (50 + Math.random() * 15).toFixed(0); // 50-65%
  
  return {
    temperature: `${temp}°C`,
    soilMoisture: `${moisture}%`,
    humidity: `${humidity}%`,
    nitrogenLevel: Math.random() > 0.5 ? "Optimal" : "Low",
    soilPH: (6.0 + Math.random() * 1.0).toFixed(1)
  };
};

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("💬 Chat Request from User ID:", req.user?.id);

    // 1. Get Live IoT Data
    const sensorData = getIoTSensorData();
    console.log("📡 IoT Data Generated:", sensorData);

    // 2. Fetch User's Latest Diagnosis (with Error Handling)
    let diagnosisContext = "No recent disease scan found.";
    
    if (req.user && req.user.id) {
      try {
        const latestDiagnosis = await Diagnosis.findOne({
          where: { userId: req.user.id },
          order: [['createdAt', 'DESC']],
          attributes: ['cropType', 'prediction_disease', 'prediction_confidence', 'createdAt']
        });

        if (latestDiagnosis) {
          const date = new Date(latestDiagnosis.createdAt).toLocaleDateString();
          diagnosisContext = `
            - Last Scan Date: ${date}
            - Crop: ${latestDiagnosis.cropType}
            - Detected Disease: ${latestDiagnosis.prediction_disease}
            - Confidence: ${(latestDiagnosis.prediction_confidence * 100).toFixed(1)}%
          `;
        }
      } catch (dbError) {
        console.error("❌ Diagnosis Fetch Error:", dbError.message);
      }
    }

    // 3. Construct Context-Aware Prompt
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });    
    
    const prompt = `
      You are 'Krishi Mitra', an expert agricultural AI assistant.
      
      [LIVE FARM SENSOR DATA]
      - Temperature: ${sensorData.temperature}
      - Soil Moisture: ${sensorData.soilMoisture} (Warn if < 30%)
      - Humidity: ${sensorData.humidity}
      - Soil pH: ${sensorData.soilPH}
      
      [LATEST CROP DIAGNOSIS]
      ${diagnosisContext}

      [USER QUESTION]
      ${message}

      [INSTRUCTIONS]
      1. Use the sensor data to give specific advice.
      2. If the user asks about "the disease", refer to the [LATEST CROP DIAGNOSIS].
      3. Suggest a cure (organic/chemical) if a disease is listed.
      4. Keep the response concise and helpful.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({
      success: true,
      response: text,
      data: { sensorData } // Send data back for UI display
    });

  } catch (error) {
    console.error("❌ AI Chat Critical Error:", error);
    res.status(500).json({
      success: false,
      message: 'Error processing chat message'
    });
  }
};