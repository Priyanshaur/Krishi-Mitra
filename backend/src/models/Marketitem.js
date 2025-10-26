import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const MarketItem = sequelize.define(
  "MarketItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 1000]
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    unit: {
      type: DataTypes.ENUM('kg', 'quintal', 'ton', 'bag', 'piece'),
      allowNull: false,
      defaultValue: 'kg'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    category: {
      type: DataTypes.ENUM('cereals', 'pulses', 'vegetables', 'fruits', 'spices', 'others'),
      allowNull: false
    },
    qualityGrade: {
      type: DataTypes.ENUM('premium', 'grade-a', 'grade-b', 'standard'),
      defaultValue: 'standard'
    },
    organic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    harvestDate: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM('active', 'sold', 'inactive'),
      defaultValue: 'active'
    },
    "location.city": {
      type: DataTypes.STRING
    },
    "location.state": {
      type: DataTypes.STRING
    },
    "location.pincode": {
      type: DataTypes.STRING
    },
    tags: {
      type: DataTypes.JSON
    },
    images: {
      type: DataTypes.JSON
    }
  },
  {
    tableName: "market_items",
    timestamps: true,
    indexes: [
      {
        fields: ['sellerId', 'status']
      },
      {
        fields: ['category', 'status']
      }
    ]
  }
);

// Associations
MarketItem.associate = (models) => {
  MarketItem.belongsTo(User, {
    foreignKey: 'sellerId',
    as: 'seller'
  });
};

export default MarketItem;