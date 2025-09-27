import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  cropType: {
    type: String,
    required: true
  },
  prediction: {
    disease: String,
    confidence: Number,
    scientificName: String,
    commonName: String
  },
  recommendations: [{
    treatment: String,
    prevention: String,
    organicRemedies: [String],
    chemicalTreatments: [String]
  }],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'error'],
    default: 'pending'
  },
  location: {
    coordinates: {
      lat: Number,
      lng: Number
    },
    address: String
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

diagnosisSchema.index({ userId: 1, createdAt: -1 });
diagnosisSchema.index({ 'prediction.disease': 1 });

export default mongoose.model('Diagnosis', diagnosisSchema);