import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  diagnoseDisease,
  getDiagnosisHistory,
  getDiagnosis
} from '../controllers/diagnoseController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/', upload.single('image'), diagnoseDisease);
router.get('/history', getDiagnosisHistory);
router.get('/:id', getDiagnosis);

export default router;