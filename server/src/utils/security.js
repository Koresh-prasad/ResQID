import crypto from 'crypto';

const algorithm = 'aes-256-gcm';

function getKey() {
  return crypto.createHash('sha256').update(process.env.ENCRYPTION_SECRET || 'resqid-development-secret').digest();
}

export function encryptText(value = '') {
  if (!value) return '';
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptText(payload = '') {
  if (!payload || !payload.includes(':')) return payload || '';
  const [ivHex, tagHex, encryptedHex] = payload.split(':');
  const decipher = crypto.createDecipheriv(algorithm, getKey(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedHex, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
}

export function maskPhone(mobile = '') {
  const cleaned = String(mobile).replace(/\D/g, '');
  if (cleaned.length <= 3) return '*******';
  return `${'*'.repeat(Math.max(7, cleaned.length - 3))}${cleaned.slice(-3)}`;
}

export function normalizePhone(mobile = '') {
  return String(mobile).replace(/[^\d+]/g, '');
}
