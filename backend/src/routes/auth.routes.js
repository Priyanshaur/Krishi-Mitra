import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  register, 
  login, 
  googleLogin, 
  getMe, 
  updateProfile, 
  updatePreferences, 
  logout 
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/preferences', protect, updatePreferences);

export default router;