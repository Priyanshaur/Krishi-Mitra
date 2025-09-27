import Diagnosis from '../models/Diagnose.js';
import mlService from '../services/mlService.js';
import { validationResult } from 'express-validator';

// Upload image and get diagnosis
export const diagnoseDisease = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const { cropType, notes, location } = req.body;

    // Call ML service for prediction
    const prediction = await mlService.predictDisease(req.file.buffer, cropType);

    // Create diagnosis record
    const diagnosis = await Diagnosis.create({
      userId: req.user.id,
      imageUrl: `/uploads/${req.file.filename}`,
      cropType,
      prediction: {
        disease: prediction.disease,
        confidence: prediction.confidence,
        scientificName: prediction.scientific_name,
        commonName: prediction.common_name
      },
      recommendations: await mlService.getRecommendations(prediction.disease, cropType),
      severity: prediction.severity || 'medium',
      status: 'processed',
      location: location ? JSON.parse(location) : undefined,
      notes
    });

    res.status(200).json({
      success: true,
      data: diagnosis
    });
  } catch (error) {
    // Create error diagnosis record
    if (req.file) {
      await Diagnosis.create({
        userId: req.user.id,
        imageUrl: `/uploads/${req.file.filename}`,
        cropType: req.body.cropType,
        status: 'error',
        notes: req.body.notes
      });
    }

    next(error);
  }
};

// Get user's diagnosis history
export const getDiagnosisHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const diagnoses = await Diagnosis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Diagnosis.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      data: diagnoses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single diagnosis
export const getDiagnosis = async (req, res, next) => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id);

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: 'Diagnosis not found'
      });
    }

    // Check ownership
    if (diagnosis.userId.toString() !== req.user.id) {
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
    next(error);
  }
};