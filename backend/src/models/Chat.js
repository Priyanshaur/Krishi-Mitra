import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'chats',
  timestamps: true
});

export default Chat;