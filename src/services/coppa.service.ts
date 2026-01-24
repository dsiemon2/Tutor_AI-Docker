/**
 * COPPA Compliance Service
 * Handles parental consent for children under 13
 */

import crypto from 'crypto';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { sendEmail } from './email.service';

const APP_URL = process.env.APP_URL || 'http://localhost:8091';
const BASE_PATH = process.env.BASE_PATH || '/TutorAI';

// COPPA requires consent for children under 13
const COPPA_AGE_THRESHOLD = 13;

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Check if a user requires parental consent
 */
export function requiresParentalConsent(dateOfBirth: Date): boolean {
  return calculateAge(dateOfBirth) < COPPA_AGE_THRESHOLD;
}

/**
 * Generate a secure consent token
 */
export function generateConsentToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a parental consent request
 */
export async function createConsentRequest(params: {
  studentId: string;
  childDateOfBirth: Date;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone?: string;
  relationship: string;
}): Promise<{
  success: boolean;
  consentId?: string;
  error?: string;
}> {
  try {
    const age = calculateAge(params.childDateOfBirth);

    // Generate consent token
    const consentToken = generateConsentToken();

    // Consent request expires in 7 days
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Create consent record
    const consent = await prisma.parentalConsent.create({
      data: {
        studentId: params.studentId,
        childDateOfBirth: params.childDateOfBirth,
        childAge: age,
        parentFirstName: params.parentFirstName,
        parentLastName: params.parentLastName,
        parentEmail: params.parentEmail.toLowerCase(),
        parentPhone: params.parentPhone,
        relationship: params.relationship,
        consentToken,
        consentStatus: 'pending',
        expiresAt
      }
    });

    // Send consent request email to parent
    await sendConsentRequestEmail(
      params.parentEmail,
      params.parentFirstName,
      consentToken
    );

    logger.info(`COPPA consent request created for student ${params.studentId}`);

    return {
      success: true,
      consentId: consent.id
    };

  } catch (error) {
    logger.error('Failed to create consent request:', error);
    return {
      success: false,
      error: 'Failed to create consent request'
    };
  }
}

/**
 * Verify parental consent
 */
export async function verifyConsent(
  consentToken: string,
  verificationIp: string
): Promise<{
  success: boolean;
  studentId?: string;
  error?: string;
}> {
  try {
    // Find consent request
    const consent = await prisma.parentalConsent.findFirst({
      where: {
        consentToken,
        consentStatus: 'pending',
        expiresAt: { gt: new Date() }
      }
    });

    if (!consent) {
      return {
        success: false,
        error: 'Invalid or expired consent link'
      };
    }

    // Update consent status
    await prisma.parentalConsent.update({
      where: { id: consent.id },
      data: {
        consentStatus: 'verified',
        verifiedAt: new Date(),
        verificationIp
      }
    });

    // Create age verification record
    await prisma.ageVerification.upsert({
      where: { userId: consent.studentId },
      update: {
        verificationMethod: 'parent_verified',
        verifiedAt: new Date()
      },
      create: {
        userId: consent.studentId,
        dateOfBirth: consent.childDateOfBirth,
        ageAtRegistration: consent.childAge,
        isUnder13: true,
        verificationMethod: 'parent_verified'
      }
    });

    logger.info(`COPPA consent verified for student ${consent.studentId}`);

    return {
      success: true,
      studentId: consent.studentId
    };

  } catch (error) {
    logger.error('Failed to verify consent:', error);
    return {
      success: false,
      error: 'Failed to verify consent'
    };
  }
}

/**
 * Reject parental consent
 */
export async function rejectConsent(
  consentToken: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const consent = await prisma.parentalConsent.findFirst({
      where: {
        consentToken,
        consentStatus: 'pending'
      }
    });

    if (!consent) {
      return {
        success: false,
        error: 'Invalid consent link'
      };
    }

    await prisma.parentalConsent.update({
      where: { id: consent.id },
      data: {
        consentStatus: 'rejected',
        revokedReason: reason || 'Parent declined consent'
      }
    });

    // Deactivate student account
    await prisma.user.update({
      where: { id: consent.studentId },
      data: { isActive: false }
    });

    logger.info(`COPPA consent rejected for student ${consent.studentId}`);

    return { success: true };

  } catch (error) {
    logger.error('Failed to reject consent:', error);
    return {
      success: false,
      error: 'Failed to process rejection'
    };
  }
}

/**
 * Revoke parental consent
 */
export async function revokeConsent(
  studentId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find active consent
    const consent = await prisma.parentalConsent.findFirst({
      where: {
        studentId,
        consentStatus: 'verified'
      }
    });

    if (!consent) {
      return {
        success: false,
        error: 'No active consent found'
      };
    }

    // Revoke consent
    await prisma.parentalConsent.update({
      where: { id: consent.id },
      data: {
        consentStatus: 'revoked',
        revokedAt: new Date(),
        revokedReason: reason
      }
    });

    // Deactivate student account
    await prisma.user.update({
      where: { id: studentId },
      data: { isActive: false }
    });

    logger.info(`COPPA consent revoked for student ${studentId}: ${reason}`);

    return { success: true };

  } catch (error) {
    logger.error('Failed to revoke consent:', error);
    return {
      success: false,
      error: 'Failed to revoke consent'
    };
  }
}

/**
 * Check if student has valid parental consent
 */
export async function hasValidConsent(studentId: string): Promise<boolean> {
  const consent = await prisma.parentalConsent.findFirst({
    where: {
      studentId,
      consentStatus: 'verified',
      revokedAt: null
    }
  });

  return !!consent;
}

/**
 * Check if user is under 13 and needs consent
 */
export async function checkCoppaStatus(userId: string): Promise<{
  requiresConsent: boolean;
  hasConsent: boolean;
  status: 'not_required' | 'pending' | 'verified' | 'rejected' | 'revoked' | 'missing';
}> {
  // Check age verification
  const ageVerification = await prisma.ageVerification.findUnique({
    where: { userId }
  });

  if (!ageVerification || !ageVerification.isUnder13) {
    return {
      requiresConsent: false,
      hasConsent: false,
      status: 'not_required'
    };
  }

  // Check consent status
  const consent = await prisma.parentalConsent.findFirst({
    where: { studentId: userId },
    orderBy: { requestedAt: 'desc' }
  });

  if (!consent) {
    return {
      requiresConsent: true,
      hasConsent: false,
      status: 'missing'
    };
  }

  return {
    requiresConsent: true,
    hasConsent: consent.consentStatus === 'verified' && !consent.revokedAt,
    status: consent.consentStatus as any
  };
}

/**
 * Send consent request email to parent
 */
async function sendConsentRequestEmail(
  parentEmail: string,
  parentFirstName: string,
  consentToken: string
): Promise<boolean> {
  const verifyUrl = `${APP_URL}${BASE_PATH}/coppa/verify?token=${consentToken}`;
  const rejectUrl = `${APP_URL}${BASE_PATH}/coppa/reject?token=${consentToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parental Consent Required</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px; }
    .btn { display: inline-block; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 5px; }
    .btn-approve { background: #10b981; color: white; }
    .btn-decline { background: #ef4444; color: white; }
    .info-box { background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .warning-box { background: #fef3c7; border: 1px solid #fcd34d; padding: 20px; border-radius: 10px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Parental Consent Required</h1>
    </div>
    <div class="content">
      <p>Dear ${parentFirstName},</p>

      <p>Your child has requested to create an account on <strong>TutorAI</strong>, our educational AI tutoring platform. Because your child is under 13 years old, we are required by the Children's Online Privacy Protection Act (COPPA) to obtain your consent before we can allow them to use our service.</p>

      <div class="info-box">
        <strong>What TutorAI Does:</strong>
        <ul>
          <li>Provides AI-powered tutoring in 74+ subjects</li>
          <li>Tracks learning progress and performance</li>
          <li>Allows interaction with AI tutors via text and voice</li>
          <li>Stores session history and quiz results</li>
        </ul>
      </div>

      <div class="warning-box">
        <strong>Data We Collect:</strong>
        <ul>
          <li>Name and email address</li>
          <li>Learning progress and session history</li>
          <li>Quiz answers and grades</li>
          <li>Messages sent to AI tutors</li>
        </ul>
        <p>We do NOT sell personal information or share it with third parties for marketing purposes.</p>
      </div>

      <p>Please review and make your choice:</p>

      <p style="text-align: center;">
        <a href="${verifyUrl}" class="btn btn-approve">I Give Consent</a>
        <a href="${rejectUrl}" class="btn btn-decline">I Do Not Consent</a>
      </p>

      <p><small>This consent request will expire in 7 days. If you have questions, please contact us.</small></p>
    </div>
    <div class="footer">
      <p>This is a COPPA compliance notification from TutorAI.</p>
      <p>&copy; ${new Date().getFullYear()} TutorAI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    // Using the email service sendEmail function
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'TutorAI <noreply@tutorai.com>',
      to: parentEmail,
      subject: 'Parental Consent Required - TutorAI',
      html
    });

    return true;
  } catch (error) {
    logger.error('Failed to send consent email:', error);
    return false;
  }
}

export default {
  calculateAge,
  requiresParentalConsent,
  generateConsentToken,
  createConsentRequest,
  verifyConsent,
  rejectConsent,
  revokeConsent,
  hasValidConsent,
  checkCoppaStatus
};
