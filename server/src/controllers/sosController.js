import crypto from 'crypto';
import { body } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { memoryStore } from '../services/memoryStore.js';
import { getProfileByUser } from '../services/profileService.js';
import { sendSosAlerts } from '../services/notificationService.js';

export const sosValidators = [
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
  body('message').optional().trim().isLength({ max: 240 }),
  validate
];

export const triggerSos = asyncHandler(async (req, res) => {
  const profile = await getProfileByUser(req.user);
  const timestamp = new Date();
  const location = {
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    mapsUrl: `https://www.google.com/maps?q=${req.body.latitude},${req.body.longitude}`
  };
  const message = req.body.message || `${profile?.fullName || req.user.name} triggered a ResQID emergency SOS alert.`;
  const alerts = await sendSosAlerts({ contacts: profile?.contacts || [], location, message, timestamp });
  const alert = { id: crypto.randomUUID(), userId: String(req.user._id || req.user.id), location, message, timestamp, alerts };
  memoryStore.sosAlerts.push(alert);
  res.status(201).json({ alert });
});
