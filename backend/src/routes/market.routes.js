import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getMarketItems,
  getMarketItem,
  createMarketItem,
  updateMarketItem,
  deleteMarketItem,
  getUserMarketItems
} from '../controllers/marketController.js';

const router = express.Router();

// Public routes
router.get('/', getMarketItems);
router.get('/:id', getMarketItem);

// Protected routes
router.use(protect);

router.get('/items/my', getUserMarketItems);
router.post('/items', createMarketItem);
router.put('/items/:id', updateMarketItem);
router.delete('/items/:id', deleteMarketItem);

export default router;