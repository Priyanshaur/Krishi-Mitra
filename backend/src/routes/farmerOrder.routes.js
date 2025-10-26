import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getFarmerOrders,
  getFarmerOrder,
  updateOrderStatus
} from '../controllers/farmerOrderController.js';

const router = express.Router();

// Apply protection middleware to all routes
router.use(protect);

// Farmer order routes
router.get('/orders', getFarmerOrders);
router.get('/orders/:id', getFarmerOrder);
router.put('/orders/:id/status', updateOrderStatus);

export default router;