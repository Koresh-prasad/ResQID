import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { comparePassword, createUser, findUserByEmail, findUserByResetToken, sanitizeUser, updatePassword, updateUser } from '../services/userService.js';
import { validate } from '../middleware/validate.js';

const signToken = (user) =>
  jwt.sign({ id: user.id || user._id, role: user.role }, process.env.JWT_SECRET || 'development-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

export const registerValidators = [
  body('name').trim().isLength({ min: 2 }).withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('mobile').trim().isLength({ min: 8 }).withMessage('Mobile number is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
  validate
];

export const loginValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate
];

export const register = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json({ user, token: signToken(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await findUserByEmail(req.body.email);
  if (!user || !(await comparePassword(user, req.body.password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  const safeUser = sanitizeUser(user);
  res.json({ user: safeUser, token: signToken(safeUser) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await findUserByEmail(req.body.email || '');
  if (!user) return res.json({ message: 'If the account exists, a reset token has been generated.' });
  const resetToken = crypto.randomBytes(24).toString('hex');
  await updateUser(String(user._id || user.id), { resetToken, resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000) });
  res.json({
    message: 'Password reset token generated.',
    resetToken: process.env.NODE_ENV === 'production' ? undefined : resetToken
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const user = await findUserByResetToken(req.body.token);
  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.statusCode = 401;
    throw error;
  }
  await updatePassword(String(user._id || user.id), req.body.password);
  res.json({ message: 'Password reset successful. You can now log in.' });
});
