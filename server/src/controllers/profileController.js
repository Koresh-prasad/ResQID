import QRCode from 'qrcode';
import { body } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { fullEmergencyView, generateQrForUser, getProfileByUser, getScanHistory, upsertProfile } from '../services/profileService.js';

export const profileValidators = [
  body('fullName').optional({ checkFalsy: true }).trim().isLength({ min: 2 }),
  body('bloodGroup').optional({ checkFalsy: true }).trim().isLength({ max: 8 }),
  body('contacts').optional().isArray({ max: 2 }),
  validate
];

export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await getProfileByUser(req.user);
  const scans = await getScanHistory(profile?.qrUniqueId);
  res.json({ profile: fullEmergencyView(profile), scans });
});

export const saveMyProfile = asyncHandler(async (req, res) => {
  const profile = await upsertProfile(req.user, req.body);
  res.json({ profile: fullEmergencyView(profile) });
});

export const generateQr = asyncHandler(async (req, res) => {
  const profile = await generateQrForUser(req.user);
  const appOrigin = process.env.PUBLIC_APP_URL || req.get('origin') || `${req.protocol}://${req.get('host')}`;
  const emergencyUrl = `${appOrigin.replace(/\/$/, '')}/emergency/${profile.qrUniqueId}`;
  const qrDataUrl = await QRCode.toDataURL(emergencyUrl, { margin: 2, width: 720, color: { dark: '#0f4fd8', light: '#ffffff' } });
  res.json({ qrUniqueId: profile.qrUniqueId, emergencyUrl, qrDataUrl, profile });
});
