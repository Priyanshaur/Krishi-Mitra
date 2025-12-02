import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const MarketItem = sequelize.define("MarketItem", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    unit: { type: DataTypes.STRING, defaultValue: 'kg' },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    qualityGrade: { type: DataTypes.STRING, defaultValue: 'standard' },
    organic: { type: DataTypes.BOOLEAN, defaultValue: false },
    harvestDate: DataTypes.DATE,
    status: { type: DataTypes.STRING, defaultValue: 'active' },
    
    // ✅ FIX: Use underscores to match database
    location_city: { type: DataTypes.STRING },
    location_state: { type: DataTypes.STRING },
    location_pincode: { type: DataTypes.STRING },
    
    tags: DataTypes.JSON,
    images: DataTypes.JSON
  },
  {
    tableName: "market_items",
    timestamps: true
  }
);

MarketItem.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

export default MarketItem;