import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { dbState } from '../config/database.js';
import { memoryStore } from './memoryStore.js';

const publicUser = (user) => {
  if (!user) return null;
  const plain = user.toObject ? user.toObject() : user;
  const { password, resetToken, resetTokenExpiry, ...safe } = plain;
  safe.id = String(plain._id || plain.id);
  return safe;
};

export async function createUser({ name, email, mobile, password, role = 'user' }) {
  const normalizedEmail = email.toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS || 12));

  if (dbState.mode === 'mongo') {
    const user = await User.create({ name, email: normalizedEmail, mobile, password: hash, role });
    return publicUser(user);
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email: normalizedEmail,
    mobile,
    password: hash,
    role,
    profilePicture: '',
    settings: { darkMode: false, language: 'en', notifications: true },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  memoryStore.users.push(user);
  return publicUser(user);
}

export async function findUserByEmail(email) {
  if (dbState.mode === 'mongo') return User.findOne({ email: email.toLowerCase() });
  return memoryStore.users.find((user) => user.email === email.toLowerCase()) || null;
}

export async function findUserById(id) {
  if (dbState.mode === 'mongo') return User.findById(id);
  return memoryStore.users.find((user) => user.id === id || user._id === id) || null;
}

export async function comparePassword(user, password) {
  return bcrypt.compare(password, user.password);
}

export function sanitizeUser(user) {
  return publicUser(user);
}

export async function updateUser(id, updates) {
  if (dbState.mode === 'mongo') {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    return publicUser(user);
  }

  const user = memoryStore.users.find((item) => item.id === id);
  if (!user) return null;
  Object.assign(user, updates, { updatedAt: new Date() });
  return publicUser(user);
}

export async function findUserByResetToken(token) {
  const now = new Date();
  if (dbState.mode === 'mongo') return User.findOne({ resetToken: token, resetTokenExpiry: { $gt: now } });
  return memoryStore.users.find((user) => user.resetToken === token && user.resetTokenExpiry > now) || null;
}

export async function updatePassword(id, password) {
  const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS || 12));
  return updateUser(id, { password: hash, resetToken: undefined, resetTokenExpiry: undefined });
}

export async function listUsers() {
  if (dbState.mode === 'mongo') {
    const users = await User.find().sort({ createdAt: -1 }).limit(100);
    return users.map(publicUser);
  }
  return memoryStore.users.map(publicUser);
}
