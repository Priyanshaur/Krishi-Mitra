import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. REGISTER
export const register = async (req, res) => {
  console.log("📝 Register Request:", req.body); // Debug Log
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });
    console.log("✅ User Created:", user.id);

    res.status(201).json({
      success: true,
      token: generateToken(user.id),
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// 2. LOGIN
export const login = async (req, res) => {
  console.log("🔑 Login Request:", req.body.email); // Debug Log
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is Google-only
    if (!user.password) {
      console.log("⚠️ Google user tried to login with password");
      return res.status(400).json({ message: 'Please login with Google' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("✅ Login Successful");
    res.json({
      success: true,
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. GOOGLE LOGIN
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("🌐 Google Login Attempt");

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { name, email, picture, sub: googleId } = ticket.getPayload();
    console.log("✅ Verified Google User:", email);

    let user = await User.findOne({ where: { email } });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.profile) user.profile = picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        profile: picture,
        role: 'farmer',
        password: null // No password
      });
    }

    res.json({
      success: true,
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('❌ Google Auth Error:', error.message);
    res.status(400).json({ success: false, message: 'Google authentication failed' });
  }
};

// ... Include getMe, updateProfile, etc. from previous steps
export const getMe = async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
  if (user) res.json({ success: true, user });
  else res.status(404).json({ message: 'User not found' });
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      const { name, phone, location, bio } = req.body;
      if(name) user.name = name;
      if(phone) user.phone = phone;
      if(location) user.location = location;
      if(bio) user.bio = bio;
      await user.save();
      res.json({ success: true, user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch(e) { res.status(500).json({message: e.message}) }
};

export const logout = (req, res) => res.json({ success: true });
export const updatePreferences = (req, res) => res.json({ success: true });