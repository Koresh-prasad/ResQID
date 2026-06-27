import { Router } from 'express';
import { generateQr } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/generate', protect, generateQr);

export default router;
