import { body, param } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { findUserById } from '../services/userService.js';
import { createOtp, verifyOtp } from '../services/otpService.js';
import { sendOtp } from '../services/notificationService.js';
import { fullEmergencyView, getProfileByQr, publicEmergencyView, recordScan } from '../services/profileService.js';

export const emergencyParam = [param('qrUniqueId').trim().notEmpty(), validate];

export const getPublicEmergency = asyncHandler(async (req, res) => {
  const profile = await getProfileByQr(req.params.qrUniqueId);
  if (!profile) {
    const error = new Error('Emergency profile not found');
    error.statusCode = 404;
    throw error;
  }
  await recordScan(req.params.qrUniqueId, req);
  res.json({ profile: publicEmergencyView(profile) });
});

export const requestFullInfo = asyncHandler(async (req, res) => {
  const profile = await getProfileByQr(req.params.qrUniqueId);
  if (!profile) {
    const error = new Error('Emergency profile not found');
    error.statusCode = 404;
    throw error;
  }
  const user = await findUserById(profile.userId);
  const { otp, expiryTime } = await createOtp(profile.userId);
  await sendOtp({ mobile: user?.mobile, otp });
  res.json({
    message: 'OTP sent to registered mobile number.',
    expiryTime,
    demoOtp: process.env.NODE_ENV === 'production' ? undefined : otp
  });
});

export const verifyFullInfoValidators = [body('otp').trim().isLength({ min: 6, max: 6 }), validate];

export const verifyFullInfo = asyncHandler(async (req, res) => {
  const profile = await getProfileByQr(req.params.qrUniqueId);
  if (!profile) {
    const error = new Error('Emergency profile not found');
    error.statusCode = 404;
    throw error;
  }
  const ok = await verifyOtp(profile.userId, req.body.otp);
  if (!ok) {
    const error = new Error('Invalid or expired OTP');
    error.statusCode = 401;
    throw error;
  }
  res.json({ profile: fullEmergencyView(profile) });
});

export const callContact = asyncHandler(async (req, res) => {
  const profile = await getProfileByQr(req.params.qrUniqueId);
  const contact = profile?.contacts?.[0];
  if (!contact?.mobile) {
    const error = new Error('Emergency contact unavailable');
    error.statusCode = 404;
    throw error;
  }
  res.redirect(302, `tel:${contact.mobile}`);
});
