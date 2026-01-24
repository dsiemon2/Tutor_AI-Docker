// TutorAI Two-Factor Authentication Service
// TOTP-based 2FA for admin accounts

import crypto from 'crypto';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';

// TOTP Configuration
const TOTP_STEP = 30; // 30-second time step
const TOTP_DIGITS = 6;
const BACKUP_CODES_COUNT = 10;

/**
 * Generate a random base32 secret for TOTP
 */
export function generateSecret(): string {
  const buffer = crypto.randomBytes(20);
  return base32Encode(buffer);
}

/**
 * Generate TOTP URI for QR code
 */
export function generateTotpUri(secret: string, email: string, issuer: string = 'TutorAI'): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=${TOTP_DIGITS}&period=${TOTP_STEP}`;
}

/**
 * Generate current TOTP code
 */
export function generateTotp(secret: string): string {
  const counter = Math.floor(Date.now() / 1000 / TOTP_STEP);
  return generateHotp(secret, counter);
}

/**
 * Verify a TOTP code (with time window tolerance)
 */
export function verifyTotp(secret: string, token: string, window: number = 1): boolean {
  const currentCounter = Math.floor(Date.now() / 1000 / TOTP_STEP);

  // Check current time and one step before/after
  for (let i = -window; i <= window; i++) {
    const expectedToken = generateHotp(secret, currentCounter + i);
    if (timingSafeEqual(token, expectedToken)) {
      return true;
    }
  }

  return false;
}

/**
 * Generate HOTP (HMAC-based One-Time Password)
 */
function generateHotp(secret: string, counter: number): string {
  const decodedSecret = base32Decode(secret);
  const buffer = Buffer.alloc(8);

  // Write counter as big-endian 64-bit
  for (let i = 0; i < 8; i++) {
    buffer[7 - i] = counter & 0xff;
    counter = Math.floor(counter / 256);
  }

  // Generate HMAC-SHA1
  const hmac = crypto.createHmac('sha1', decodedSecret);
  hmac.update(buffer);
  const hash = hmac.digest();

  // Dynamic truncation
  const offset = hash[hash.length - 1] & 0x0f;
  const code = (
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)
  ) % Math.pow(10, TOTP_DIGITS);

  return code.toString().padStart(TOTP_DIGITS, '0');
}

/**
 * Base32 encode
 */
function base32Encode(buffer: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  let bits = 0;
  let value = 0;

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      result += alphabet[(value >>> (bits - 5)) & 0x1f];
      bits -= 5;
    }
  }

  if (bits > 0) {
    result += alphabet[(value << (5 - bits)) & 0x1f];
  }

  return result;
}

/**
 * Base32 decode
 */
function base32Decode(str: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleanStr = str.toUpperCase().replace(/[^A-Z2-7]/g, '');

  const bytes: number[] = [];
  let bits = 0;
  let value = 0;

  for (const char of cleanStr) {
    const idx = alphabet.indexOf(char);
    if (idx === -1) continue;

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Timing-safe string comparison
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Generate backup codes
 */
export function generateBackupCodes(): string[] {
  const codes: string[] = [];

  for (let i = 0; i < BACKUP_CODES_COUNT; i++) {
    // Generate 8-character alphanumeric code
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
  }

  return codes;
}

/**
 * Hash backup codes for storage
 */
export async function hashBackupCodes(codes: string[]): Promise<string[]> {
  const hashed = await Promise.all(
    codes.map(code => bcrypt.hash(code.replace('-', ''), 10))
  );
  return hashed;
}

/**
 * Verify a backup code
 */
export async function verifyBackupCode(code: string, hashedCodes: string[]): Promise<{ valid: boolean; index: number }> {
  const normalizedCode = code.replace('-', '').toUpperCase();

  for (let i = 0; i < hashedCodes.length; i++) {
    const match = await bcrypt.compare(normalizedCode, hashedCodes[i]);
    if (match) {
      return { valid: true, index: i };
    }
  }

  return { valid: false, index: -1 };
}

// ============================================
// DATABASE OPERATIONS
// ============================================

/**
 * Enable 2FA for a user
 */
export async function enableTwoFactor(
  userId: string
): Promise<{ secret: string; uri: string; backupCodes: string[] }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const secret = generateSecret();
  const uri = generateTotpUri(secret, user.email);
  const backupCodes = generateBackupCodes();
  const hashedBackupCodes = await hashBackupCodes(backupCodes);

  // Store secret and backup codes (not enabled yet - needs verification)
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: secret,
      twoFactorBackupCodes: JSON.stringify(hashedBackupCodes),
      twoFactorEnabled: false // Will be enabled after verification
    }
  });

  logger.info(`2FA setup initiated for user: ${user.email}`);

  return { secret, uri, backupCodes };
}

/**
 * Verify and activate 2FA
 */
export async function verifyAndActivateTwoFactor(
  userId: string,
  token: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true, email: true }
  });

  if (!user || !user.twoFactorSecret) {
    return false;
  }

  if (!verifyTotp(user.twoFactorSecret, token)) {
    return false;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true }
  });

  logger.info(`2FA activated for user: ${user.email}`);

  return true;
}

/**
 * Verify 2FA token during login
 */
export async function verifyTwoFactorToken(
  userId: string,
  token: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true, twoFactorBackupCodes: true, twoFactorEnabled: true }
  });

  if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
    return false;
  }

  // Try TOTP first
  if (verifyTotp(user.twoFactorSecret, token)) {
    return true;
  }

  // Try backup codes
  if (user.twoFactorBackupCodes) {
    const hashedCodes = JSON.parse(user.twoFactorBackupCodes) as string[];
    const { valid, index } = await verifyBackupCode(token, hashedCodes);

    if (valid) {
      // Remove used backup code
      hashedCodes.splice(index, 1);
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorBackupCodes: JSON.stringify(hashedCodes) }
      });

      logger.info(`Backup code used for 2FA (remaining: ${hashedCodes.length})`);
      return true;
    }
  }

  return false;
}

/**
 * Disable 2FA for a user
 */
export async function disableTwoFactor(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true }
  });

  if (!user) {
    return false;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: null
    }
  });

  logger.info(`2FA disabled for user: ${user.email}`);

  return true;
}

/**
 * Check if user has 2FA enabled
 */
export async function hasTwoFactorEnabled(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true }
  });

  return user?.twoFactorEnabled ?? false;
}

/**
 * Get 2FA status for a user
 */
export async function getTwoFactorStatus(userId: string): Promise<{
  enabled: boolean;
  backupCodesRemaining: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true, twoFactorBackupCodes: true }
  });

  if (!user) {
    return { enabled: false, backupCodesRemaining: 0 };
  }

  let backupCodesRemaining = 0;
  if (user.twoFactorBackupCodes) {
    try {
      const codes = JSON.parse(user.twoFactorBackupCodes) as string[];
      backupCodesRemaining = codes.length;
    } catch {
      backupCodesRemaining = 0;
    }
  }

  return {
    enabled: user.twoFactorEnabled,
    backupCodesRemaining
  };
}

/**
 * Regenerate backup codes
 */
export async function regenerateBackupCodes(userId: string): Promise<string[] | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true, email: true }
  });

  if (!user || !user.twoFactorEnabled) {
    return null;
  }

  const newCodes = generateBackupCodes();
  const hashedCodes = await hashBackupCodes(newCodes);

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorBackupCodes: JSON.stringify(hashedCodes) }
  });

  logger.info(`Backup codes regenerated for user: ${user.email}`);

  return newCodes;
}

export default {
  generateSecret,
  generateTotpUri,
  generateTotp,
  verifyTotp,
  generateBackupCodes,
  hashBackupCodes,
  verifyBackupCode,
  enableTwoFactor,
  verifyAndActivateTwoFactor,
  verifyTwoFactorToken,
  disableTwoFactor,
  hasTwoFactorEnabled,
  getTwoFactorStatus,
  regenerateBackupCodes
};
