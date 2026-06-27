import crypto from 'crypto';
import OTP from '../models/OTP.js';
import { dbState } from '../config/database.js';
import { memoryStore } from './memoryStore.js';

function userIdOf(userOrId) {
  return String(userOrId?._id || userOrId?.id || userOrId);
}

export async function createOtp(userOrId, purpose = 'full-profile') {
  const userId = userIdOf(userOrId);
  const otp = String(crypto.randomInt(100000, 999999));
  const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

  if (dbState.mode === 'mongo') {
    await OTP.deleteMany({ userId, purpose });
    await OTP.create({ userId, otp, expiryTime, purpose });
  } else {
    memoryStore.otps = memoryStore.otps.filter((item) => !(item.userId === userId && item.purpose === purpose));
    memoryStore.otps.push({ id: crypto.randomUUID(), userId, otp, expiryTime, purpose, verified: false });
  }

  return { otp, expiryTime };
}

export async function verifyOtp(userOrId, otp, purpose = 'full-profile') {
  const userId = userIdOf(userOrId);
  const now = new Date();

  if (dbState.mode === 'mongo') {
    const entry = await OTP.findOne({ userId, otp, purpose, expiryTime: { $gt: now } });
    if (!entry) return false;
    entry.verified = true;
    await entry.save();
    return true;
  }

  const entry = memoryStore.otps.find((item) => item.userId === userId && item.otp === otp && item.purpose === purpose);
  if (!entry || entry.expiryTime <= now) return false;
  entry.verified = true;
  return true;
}
