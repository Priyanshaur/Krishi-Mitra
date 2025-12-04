import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Diagnosis = sequelize.define('Diagnosis', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  cropType: { type: DataTypes.STRING, allowNull: false },
  
  // ✅ FIX: Use underscores to match database
  prediction_disease: { type: DataTypes.STRING },
  prediction_confidence: { type: DataTypes.FLOAT },
  prediction_scientificName: { type: DataTypes.STRING },
  prediction_commonName: { type: DataTypes.STRING },
  
  severity: { type: DataTypes.STRING, defaultValue: 'low' },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  notes: { type: DataTypes.TEXT }
}, {
  tableName: 'diagnoses',
  timestamps: true
});

Diagnosis.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Diagnosis;