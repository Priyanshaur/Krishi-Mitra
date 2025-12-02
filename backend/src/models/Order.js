import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import OrderItem from './OrderItem.js'; // Ensure you created this file in previous steps

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  buyerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  sellerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  // Flattened Shipping Address
  shipping_street: DataTypes.STRING,
  shipping_city: DataTypes.STRING,
  shipping_state: DataTypes.STRING,
  shipping_pincode: DataTypes.STRING,
  shipping_contactNumber: DataTypes.STRING,
  
  notes: DataTypes.TEXT
}, {
  tableName: 'orders',
  timestamps: true
});

// ✅ Define Associations
Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
Order.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });

export default Order;