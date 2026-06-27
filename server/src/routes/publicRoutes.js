import { Router } from 'express';
import {
  callContact,
  emergencyParam,
  getPublicEmergency,
  requestFullInfo,
  verifyFullInfo,
  verifyFullInfoValidators
} from '../controllers/publicController.js';

const router = Router();

router.get('/:qrUniqueId', emergencyParam, getPublicEmergency);
router.post('/:qrUniqueId/request-full', emergencyParam, requestFullInfo);
router.post('/:qrUniqueId/verify-otp', emergencyParam, verifyFullInfoValidators, verifyFullInfo);
router.get('/:qrUniqueId/call', emergencyParam, callContact);
router.post('/:qrUniqueId/call', emergencyParam, callContact);

export default router;
