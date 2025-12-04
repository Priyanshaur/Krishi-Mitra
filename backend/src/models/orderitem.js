import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import MarketItem from './MarketItem.js';

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  itemId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'market_items',
      key: 'id'
    }
  },
  title: DataTypes.STRING,
  price: DataTypes.DECIMAL(10, 2),
  quantity: DataTypes.INTEGER,
  unit: DataTypes.STRING
}, {
  tableName: 'order_items',
  timestamps: false // The SQL script doesn't have createdAt/updatedAt for items, which is fine
});

// Association (Optional but helpful)
OrderItem.belongsTo(MarketItem, { foreignKey: 'itemId' });

export default OrderItem;