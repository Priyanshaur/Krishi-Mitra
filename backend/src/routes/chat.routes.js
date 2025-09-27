import express from 'express';
import { protect } from '../middleware/auth.js';
import { chatWithAI } from '../controllers/chatController.js';

const router = express.Router();

router.use(protect);

router.post('/', chatWithAI);

export default router;