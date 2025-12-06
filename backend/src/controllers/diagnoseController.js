import Diagnosis from '../models/Diagnose.js';
import mlService from '../services/mlService.js';
import fs from 'fs';

// SAVE REAL DIAGNOSIS TO DATABASE
// ... imports

export const diagnoseDisease = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload an image' });

    const imageBuffer = fs.readFileSync(req.file.path);
    // Remove default 'tomato' to enforce explicit selection
    const cropType = req.body.cropType;

    if (!cropType) {
      return res.status(400).json({ success: false, message: 'Please select a crop type' });
    }

    // List of crops NOT supported by the current model (to avoid hallucinations)
    const UNSUPPORTED_CROPS = ['wheat', 'rice', 'sugarcane', 'cotton'];
    if (UNSUPPORTED_CROPS.includes(cropType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Disease diagnosis for ${cropType} is currently not supported. Our model covers: Apple, Corn, Grape, Potato, Tomato, and more.`
      });
    }

    // Call ML Service
    const mlResult = await mlService.predictDisease(imageBuffer, cropType);

    // ✅ FIX: Save using underscore field names
    const diagnosis = await Diagnosis.create({
      userId: req.user.id,
      imageUrl: `/uploads/${req.file.filename}`,
      cropType: cropType,

      prediction_disease: mlResult.disease,
      prediction_confidence: mlResult.confidence,
      prediction_scientificName: mlResult.scientific_name || 'Unknown',
      prediction_commonName: mlResult.common_name || mlResult.disease,

      severity: mlResult.confidence > 0.8 ? 'high' : mlResult.confidence > 0.6 ? 'medium' : 'low',
      status: 'processed',
      notes: req.body.notes
    });

    res.status(200).json({ success: true, data: diagnosis });
  } catch (error) {
    console.error('Diagnosis Error:', error);
    res.status(500).json({ success: false, message: 'Error processing diagnosis: ' + error.message });
  }
};

// GET REAL DIAGNOSIS HISTORY FROM DATABASE
export const getDiagnosisHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;
    const { count, rows: diagnoses } = await Diagnosis.findAndCountAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: diagnoses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get Diagnosis History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching diagnosis history'
    });
  }
};

// GET SINGLE DIAGNOSIS
export const getDiagnosis = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findByPk(req.params.id);

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: 'Diagnosis not found'
      });
    }

    // Check ownership
    if (diagnosis.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this diagnosis'
      });
    }

    res.status(200).json({
      success: true,
      data: diagnosis
    });
  } catch (error) {
    console.error('Get Diagnosis Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching diagnosis'
    });
  }
};