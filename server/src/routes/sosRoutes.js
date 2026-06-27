import { Router } from 'express';
import { sosValidators, triggerSos } from '../controllers/sosController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, sosValidators, triggerSos);

export default router;
