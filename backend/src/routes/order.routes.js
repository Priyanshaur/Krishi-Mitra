import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getUserOrders
} from '../controllers/orderController.js';

const router = express.Router();

router.use(protect);

router.get('/', getOrders);
router.get('/my', getUserOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus);

export default router;