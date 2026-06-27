import crypto from 'crypto';
import { nanoid } from 'nanoid';
import EmergencyProfile from '../models/EmergencyProfile.js';
import ScanHistory from '../models/ScanHistory.js';
import { dbState } from '../config/database.js';
import { memoryStore } from './memoryStore.js';
import { decryptText, encryptText, maskPhone, normalizePhone } from '../utils/security.js';

const encryptedFields = ['address', 'insuranceDetails'];

function profileId(profile) {
  return String(profile?._id || profile?.id || '');
}

function userIdOf(userOrId) {
  return String(userOrId?._id || userOrId?.id || userOrId);
}

function decryptProfile(profile) {
  if (!profile) return null;
  const plain = profile.toObject ? profile.toObject() : { ...profile };
  for (const field of encryptedFields) plain[field] = decryptText(plain[field]);
  plain.id = profileId(plain);
  plain.userId = String(plain.userId);
  return plain;
}

function encryptProfileInput(input) {
  const payload = { ...input };
  for (const field of encryptedFields) {
    if (payload[field] !== undefined) payload[field] = encryptText(payload[field]);
  }
  if (Array.isArray(payload.contacts)) {
    payload.contacts = payload.contacts.slice(0, 2).map((contact) => ({
      name: contact.name || '',
      relationship: contact.relationship || '',
      mobile: normalizePhone(contact.mobile || '')
    }));
  }
  payload.lastUpdated = new Date();
  return payload;
}

export async function getProfileByUser(userOrId) {
  const userId = userIdOf(userOrId);
  if (dbState.mode === 'mongo') {
    return decryptProfile(await EmergencyProfile.findOne({ userId }));
  }
  return decryptProfile(memoryStore.profiles.find((profile) => profile.userId === userId));
}

export async function upsertProfile(userOrId, input) {
  const userId = userIdOf(userOrId);
  const payload = encryptProfileInput({ ...input, userId });

  if (dbState.mode === 'mongo') {
    const profile = await EmergencyProfile.findOneAndUpdate({ userId }, payload, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    });
    return decryptProfile(profile);
  }

  let profile = memoryStore.profiles.find((item) => item.userId === userId);
  if (!profile) {
    profile = { id: crypto.randomUUID(), userId, createdAt: new Date() };
    memoryStore.profiles.push(profile);
  }
  Object.assign(profile, payload, { updatedAt: new Date() });
  return decryptProfile(profile);
}

export async function generateQrForUser(userOrId) {
  const userId = userIdOf(userOrId);
  const qrUniqueId = `rq-${nanoid(16)}`;
  const update = { qrUniqueId, qrUpdatedAt: new Date(), lastUpdated: new Date() };

  if (dbState.mode === 'mongo') {
    const profile = await EmergencyProfile.findOneAndUpdate({ userId }, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    });
    return decryptProfile(profile);
  }

  let profile = memoryStore.profiles.find((item) => item.userId === userId);
  if (!profile) {
    profile = { id: crypto.randomUUID(), userId, createdAt: new Date() };
    memoryStore.profiles.push(profile);
  }
  Object.assign(profile, update, { updatedAt: new Date() });
  return decryptProfile(profile);
}

export async function getProfileByQr(qrUniqueId) {
  if (dbState.mode === 'mongo') {
    return decryptProfile(await EmergencyProfile.findOne({ qrUniqueId }));
  }
  return decryptProfile(memoryStore.profiles.find((profile) => profile.qrUniqueId === qrUniqueId));
}

export async function recordScan(qrUniqueId, req) {
  const payload = { qrUniqueId, ip: req.ip, userAgent: req.headers['user-agent'] || '', createdAt: new Date() };
  if (dbState.mode === 'mongo') return ScanHistory.create(payload);
  memoryStore.scans.push({ id: crypto.randomUUID(), ...payload });
  return payload;
}

export async function getScanHistory(qrUniqueId) {
  if (!qrUniqueId) return [];
  if (dbState.mode === 'mongo') return ScanHistory.find({ qrUniqueId }).sort({ createdAt: -1 }).limit(50);
  return memoryStore.scans.filter((scan) => scan.qrUniqueId === qrUniqueId).sort((a, b) => b.createdAt - a.createdAt);
}

export function publicEmergencyView(profile) {
  if (!profile) return null;
  const contacts = (profile.contacts || []).map((contact) => ({
    name: contact.name,
    relationship: contact.relationship,
    mobileMasked: maskPhone(contact.mobile),
    callToken: Buffer.from(`${profile.qrUniqueId}:${contact.mobile}`).toString('base64url')
  }));

  return {
    qrUniqueId: profile.qrUniqueId,
    fullName: profile.fullName,
    bloodGroup: profile.bloodGroup,
    allergies: profile.allergies,
    diseases: profile.diseases,
    organDonor: profile.organDonor,
    contacts,
    lastUpdated: profile.lastUpdated || profile.updatedAt
  };
}

export function fullEmergencyView(profile) {
  if (!profile) return null;
  return {
    ...profile,
    contacts: profile.contacts || []
  };
}
