import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getFarmerStats,
  getBuyerStats,
  getRecentActivity,
  getCropHealth,
  getRecommendedFarmers
} from '../controllers/dashboardController.js';

const router = express.Router();

router.use(protect);

router.get('/farmer/stats', getFarmerStats);
router.get('/buyer/stats', getBuyerStats);
router.get('/activity', getRecentActivity);
router.get('/crop-health', getCropHealth);
router.get('/recommended-farmers', getRecommendedFarmers);

export default router;