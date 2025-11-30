import Diagnosis from '../models/Diagnose.js';
import mlService from '../services/mlService.js';
import fs from 'fs';

// SAVE REAL DIAGNOSIS TO DATABASE
export const diagnoseDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    // Read the uploaded image file
    const imageBuffer = fs.readFileSync(req.file.path);
    const cropType = req.body.cropType || 'tomato';

    // Call the ML service to get disease prediction
    const mlResult = await mlService.predictDisease(imageBuffer, cropType);
    
    // Create diagnosis record in database with real ML results
    const diagnosis = await Diagnosis.create({
      userId: req.user.id,
      imageUrl: `/uploads/${req.file.filename}`,
      cropType: cropType,
      'prediction.disease': mlResult.disease,
      'prediction.confidence': mlResult.confidence,
      'prediction.scientificName': mlResult.scientific_name || 'Unknown',
      'prediction.commonName': mlResult.common_name || mlResult.disease,
      severity: mlResult.confidence > 0.8 ? 'high' : mlResult.confidence > 0.6 ? 'medium' : 'low',
      status: 'processed',
      notes: req.body.notes
    });

    res.status(200).json({
      success: true,
      data: diagnosis
    });
  } catch (error) {
    console.error('Diagnosis Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing diagnosis: ' + error.message
    });
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