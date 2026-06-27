import jwt from 'jsonwebtoken';
import { findUserById } from '../services/userService.js';

export async function protect(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-secret');
    const user = await findUserById(decoded.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
}

export function adminOnly(req, _res, next) {
  if (req.user?.role === 'admin') return next();
  const error = new Error('Admin access required');
  error.statusCode = 403;
  next(error);
}
