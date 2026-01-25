/**
 * Email Service
 * Handles sending emails for password reset, email verification, etc.
 * Uses Nodemailer with configurable SMTP provider
 */

import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

// Email configuration from environment variables
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587', 10);
const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true';
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'TutorAI <noreply@tutorai.com>';
const APP_URL = process.env.APP_URL || 'http://localhost:8091';
const BASE_PATH = process.env.BASE_PATH || '/TutorAI';

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize the email transporter
 */
function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    // If no email credentials, use a preview/test mode
    if (!EMAIL_USER || !EMAIL_PASS) {
      logger.warn('Email credentials not configured. Using ethereal test account.');
      // Create a test account for development
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'ethereal.user@ethereal.email',
          pass: 'ethereal_pass'
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: EMAIL_SECURE,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }
      });
    }
  }
  return transporter;
}

/**
 * Send an email
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  try {
    const transport = getTransporter();

    const info = await transport.sendMail({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, '')
    });

    logger.info(`Email sent: ${info.messageId} to ${options.to}`);

    // If using ethereal, log preview URL
    if (info.messageId && EMAIL_HOST === 'smtp.ethereal.email') {
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return true;
  } catch (error) {
    logger.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  firstName: string,
  resetToken: string
): Promise<boolean> {
  const resetUrl = `${APP_URL}${BASE_PATH}/auth/reset-password?token=${resetToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px; }
    .btn { display: inline-block; background: #0ea5e9; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .btn:hover { background: #0284c7; }
    .warning { background: #fef3c7; border: 1px solid #fcd34d; padding: 15px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hi ${firstName},</p>
      <p>We received a request to reset the password for your TutorAI account. Click the button below to create a new password:</p>

      <p style="text-align: center;">
        <a href="${resetUrl}" class="btn">Reset My Password</a>
      </p>

      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #0ea5e9;">${resetUrl}</p>

      <div class="warning">
        <strong>This link will expire in 1 hour.</strong><br>
        If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
      </div>

      <p>Happy learning!</p>
      <p><strong>The TutorAI Team</strong></p>
    </div>
    <div class="footer">
      <p>This is an automated message from TutorAI. Please do not reply to this email.</p>
      <p>&copy; ${new Date().getFullYear()} TutorAI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Your TutorAI Password',
    html
  });
}

/**
 * Send email verification email
 */
export async function sendEmailVerificationEmail(
  email: string,
  firstName: string,
  verificationToken: string
): Promise<boolean> {
  const verifyUrl = `${APP_URL}${BASE_PATH}/auth/verify-email?token=${verificationToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px; }
    .btn { display: inline-block; background: #10b981; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .btn:hover { background: #059669; }
    .features { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .features ul { margin: 10px 0; padding-left: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to TutorAI!</h1>
    </div>
    <div class="content">
      <p>Hi ${firstName},</p>
      <p>Thank you for creating a TutorAI account! Please verify your email address by clicking the button below:</p>

      <p style="text-align: center;">
        <a href="${verifyUrl}" class="btn">Verify My Email</a>
      </p>

      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #0ea5e9;">${verifyUrl}</p>

      <div class="features">
        <strong>With TutorAI, you can:</strong>
        <ul>
          <li>Get personalized AI tutoring in any subject</li>
          <li>Track your learning progress</li>
          <li>Complete assignments and quizzes</li>
          <li>Learn at your own pace</li>
        </ul>
      </div>

      <p>This verification link will expire in 24 hours.</p>

      <p>Welcome aboard!</p>
      <p><strong>The TutorAI Team</strong></p>
    </div>
    <div class="footer">
      <p>This is an automated message from TutorAI. Please do not reply to this email.</p>
      <p>&copy; ${new Date().getFullYear()} TutorAI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify Your TutorAI Email Address',
    html
  });
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(
  email: string,
  firstName: string
): Promise<boolean> {
  const loginUrl = `${APP_URL}${BASE_PATH}/auth/login`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to TutorAI</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px; }
    .btn { display: inline-block; background: #0ea5e9; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .steps { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .step { display: flex; align-items: flex-start; margin: 15px 0; }
    .step-num { background: #0ea5e9; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You're All Set!</h1>
    </div>
    <div class="content">
      <p>Hi ${firstName},</p>
      <p>Your email has been verified and your TutorAI account is now active. You're ready to start your personalized learning journey!</p>

      <div class="steps">
        <strong>Getting Started:</strong>
        <div class="step">
          <div class="step-num">1</div>
          <div><strong>Log In</strong> - Access your account with your email and password</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div><strong>Choose a Subject</strong> - Browse our 74+ subjects across all grade levels</div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div><strong>Start Learning</strong> - Chat with your AI tutor anytime!</div>
        </div>
      </div>

      <p style="text-align: center;">
        <a href="${loginUrl}" class="btn">Start Learning Now</a>
      </p>

      <p>If you have any questions, we're here to help!</p>
      <p><strong>The TutorAI Team</strong></p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} TutorAI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to TutorAI - Your Account is Ready!',
    html
  });
}

/**
 * Send password changed confirmation email
 */
export async function sendPasswordChangedEmail(
  email: string,
  firstName: string
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px; }
    .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; color: #991b1b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Changed Successfully</h1>
    </div>
    <div class="content">
      <p>Hi ${firstName},</p>
      <p>Your TutorAI password was successfully changed on ${new Date().toLocaleString()}.</p>

      <div class="warning">
        <strong>Didn't make this change?</strong><br>
        If you didn't change your password, please contact our support team immediately as your account may have been compromised.
      </div>

      <p>Keep your password safe and never share it with anyone.</p>

      <p><strong>The TutorAI Team</strong></p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} TutorAI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject: 'Your TutorAI Password Has Been Changed',
    html
  });
}

// Default export
export default {
  sendEmail,
  sendPasswordResetEmail,
  sendEmailVerificationEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail
};
