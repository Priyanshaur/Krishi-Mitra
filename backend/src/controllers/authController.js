import User from "../models/User.js";
import chalk from "chalk";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    console.log("🟢 Register request received:", req.body);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log("⚠️ Email already registered:", email);
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Create user - password hashing will be handled by the model hook
    const user = await User.create({
      name,
      email,
      password,
      role: role || "farmer",
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    console.log("✅ User registered successfully:", user.email);

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("🔥 Register error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};
console.log(chalk.green("✅ User registered successfully"));

export const loginUser = async (req, res) => {
  try {
    console.log("🟢 Login attempt received:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials (user not found)" });
    }

    console.log("🔒 Comparing passwords...");
    // Using the model's comparePassword method
    const isMatch = await user.comparePassword(password);
    console.log("🔑 Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials (wrong password)" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    console.log("✅ Login success for:", user.email);

    res.status(200).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("🔥 Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("🟢 Update profile request received:", req.body);

    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update email if provided (and check if it's not already taken)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already registered" });
      }
      user.email = email;
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: "Current password is required to change password" });
      }
      
      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }
      
      user.password = newPassword; // Will be hashed by the model hook
    }

    // Save updated user
    await user.save();

    console.log("✅ Profile updated successfully for:", user.email);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("🔥 Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error during profile update" });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    console.log("🟢 Update preferences request received:", req.body);

    const { darkMode, language } = req.body;
    const userId = req.user.id;

    // In a real app, you would store these preferences in the database
    // For now, we'll just return success as the frontend will handle these settings
    console.log("✅ Preferences updated successfully for user:", userId);

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      preferences: { darkMode, language }
    });
  } catch (error) {
    console.error("🔥 Update preferences error:", error);
    res.status(500).json({ success: false, message: "Server error during preferences update" });
  }
};