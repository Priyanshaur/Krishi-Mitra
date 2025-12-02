import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: { isEmail: true }
  },
  password: { type: DataTypes.STRING, allowNull: true }, // Can be null for Google
  googleId: { type: DataTypes.STRING, allowNull: true, unique: true },
  role: { type: DataTypes.STRING, defaultValue: "farmer" },
  profile: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  rating: { type: DataTypes.FLOAT, defaultValue: 5.0 }
}, {
  tableName: "users",
  timestamps: true,
});

// ✅ Hooks to Hash Password
User.addHook('beforeCreate', async (user) => {
  if (user.password) { 
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.addHook('beforeUpdate', async (user) => {
  if (user.changed("password") && user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// ✅ Method to Check Password
User.prototype.comparePassword = async function (enteredPassword) {
  if (!this.password) return false; // Google users have no password
  return await bcrypt.compare(enteredPassword, this.password);
};

export default User;