import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token with better error handling
      token = req.headers.authorization.split(' ')[1];
      
      // Log token info for debugging (remove in production)
      console.log('🔍 Token extraction debug:');
      console.log('   Full auth header:', req.headers.authorization);
      console.log('   Extracted token:', token ? `${token.substring(0, 20)}...` : 'null');
      console.log('   Token length:', token ? token.length : 'null');
      console.log('   Token type:', typeof token);
      
      // Check for common token issues
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }
      
      if (typeof token !== 'string') {
        return res.status(401).json({ success: false, message: 'Invalid token format' });
      }
      
      // Check for malformed tokens
      if (token.includes(' ') || token.includes('\n') || token.includes('\r')) {
        return res.status(401).json({ success: false, message: 'Malformed token' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fix: Use decoded.id instead of decoded.userId
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.name, error.message);
      console.error('   Token that caused error:', token);
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    next();
  };
};