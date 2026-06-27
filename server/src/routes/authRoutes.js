import { Router } from 'express';
import { body } from 'express-validator';
import { forgotPassword, login, loginValidators, me, register, registerValidators, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);
router.get('/me', protect, me);
router.post('/forgot-password', [body('email').isEmail().normalizeEmail(), validate], forgotPassword);
router.post(
  '/reset-password',
  [body('token').trim().notEmpty(), body('password').isLength({ min: 8 }), validate],
  resetPassword
);

export default router;
