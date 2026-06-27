import { Router } from 'express';
import { getMyProfile, profileValidators, saveMyProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.get('/', getMyProfile);
router.put('/', profileValidators, saveMyProfile);

export default router;
