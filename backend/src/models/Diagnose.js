import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Diagnosis = sequelize.define('Diagnosis', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cropType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  'prediction.disease': {
    type: DataTypes.STRING
  },
  'prediction.confidence': {
    type: DataTypes.FLOAT
  },
  'prediction.scientificName': {
    type: DataTypes.STRING
  },
  'prediction.commonName': {
    type: DataTypes.STRING
  },
  severity: {
    type: DataTypes.STRING, // Changed from ENUM to STRING
    defaultValue: 'low'
  },
  status: {
    type: DataTypes.STRING, // Changed from ENUM to STRING
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'diagnoses',
  timestamps: true
});

export default Diagnosis;