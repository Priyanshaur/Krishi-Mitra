export let latestSensorData = {
  temperature: 0,
  humidity: 0,
  soil: 4095, // Default raw value (Dry)
  soilPercentage: 0,
  light: 0,
  timestamp: null
};

// POST /api/iot/data
// Receives data from ESP32/Postman
export const receiveData = async (req, res) => {
  try {
    const data = req.body;
    
    // Basic validation
    if (!data) {
      return res.status(400).json({ status: 'error', message: 'No data provided' });
    }

    console.log("📡 Received IoT Data:", data);

    // Logic: Convert Soil Moisture Raw (4095-0) to Percentage (0-100%)
    // 4095 is Dry (0%), 0 is Wet (100%)
    let soilPercentage = 0;
    if (data.soil !== undefined) {
      soilPercentage = Math.round(((4095 - data.soil) / 4095) * 100);
      // Ensure it stays between 0-100
      soilPercentage = Math.max(0, Math.min(100, soilPercentage));
    }

    // Update the global variable
    latestSensorData = {
      ...data,
      soilPercentage, // Store the calculated percentage
      timestamp: new Date()
    };

    res.json({ status: "ok", received: latestSensorData });
  } catch (error) {
    console.error("IoT Receiver Error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /api/iot/data
// Used by Frontend to display the gauge cards
export const getSensorData = async (req, res) => {
  res.json(latestSensorData);
};