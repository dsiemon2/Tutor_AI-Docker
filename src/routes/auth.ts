// TutorAI Auth Routes
// Login, register, logout, password reset, email verification

import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { config } from '../config';
import { DEMO_USERS } from '../config/constants';
import { logger } from '../utils/logger';
import {
  sendPasswordResetEmail,
  sendEmailVerificationEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail
} from '../services/email.service';
import { body, validationResult } from 'express-validator';
import { strictLimiter } from '../middleware/security';
import { logUserAction, logSecurityEvent, AuditAction } from '../services/audit.service';

const router = Router();

// Note: SessionData type is defined in middleware/auth.ts with all fields

// Helper to get branding
async function getBranding() {
  const branding = await prisma.branding.findFirst({ where: { id: 'default' } });
  return branding || {
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    accentColor: '#38bdf8'
  };
}

// Generate secure random token
function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Login page
router.get('/login', async (req, res) => {
  if (req.session.userId) {
    return res.redirect(`${config.basePath}/student`);
  }

  const branding = await getBranding();

  res.render('auth/login', {
    title: 'Login - TutorAI',
    branding,
    error: null,
    demoUsers: DEMO_USERS
  });
});

// Login POST - with input validation
router.post('/login',
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 1 }).withMessage('Password is required')
  ],
  async (req, res) => {
  const branding = await getBranding();

  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/login', {
        title: 'Login - TutorAI',
        branding,
        error: errors.array()[0].msg,
        demoUsers: DEMO_USERS
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('auth/login', {
        title: 'Login - TutorAI',
        branding,
        error: 'Email and password are required',
        demoUsers: DEMO_USERS
      });
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), isActive: true }
    });

    if (!user || !user.passwordHash) {
      // Log failed login attempt
      await logSecurityEvent(req, AuditAction.LOGIN_FAILED, {
        email: email.toLowerCase(),
        reason: 'User not found or no password'
      });

      return res.render('auth/login', {
        title: 'Login - TutorAI',
        branding,
        error: 'Invalid email or password',
        demoUsers: DEMO_USERS
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      // Log failed login attempt
      await logSecurityEvent(req, AuditAction.LOGIN_FAILED, {
        email: email.toLowerCase(),
        reason: 'Invalid password'
      });

      return res.render('auth/login', {
        title: 'Login - TutorAI',
        branding,
        error: 'Invalid email or password',
        demoUsers: DEMO_USERS
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Set session
    req.session.userId = user.id;
    req.session.schoolId = user.schoolId;
    req.session.role = user.role;
    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      schoolId: user.schoolId
    };

    logger.info(`User logged in: ${user.email}`);

    // Log successful login
    await logUserAction(req, AuditAction.LOGIN, 'User', user.id, { role: user.role });

    // Redirect based on role
    switch (user.role) {
      case 'SUPER_ADMIN':
        return res.redirect(`${config.basePath}/admin`);
      case 'DISTRICT_ADMIN':
        return res.redirect(`${config.basePath}/district`);
      case 'PRINCIPAL':
        return res.redirect(`${config.basePath}/principal`);
      case 'VICE_PRINCIPAL':
        return res.redirect(`${config.basePath}/vp`);
      case 'DEPARTMENT_HEAD':
        return res.redirect(`${config.basePath}/depthead`);
      case 'SCHOOL_ADMIN':
        return res.redirect(`${config.basePath}/schooladmin`);
      case 'TEACHER':
        return res.redirect(`${config.basePath}/teacher`);
      case 'STUDENT':
      default:
        return res.redirect(`${config.basePath}/student`);
    }

  } catch (error) {
    logger.error('Login error:', error);
    return res.render('auth/login', {
      title: 'Login - TutorAI',
      branding,
      error: 'An error occurred. Please try again.',
      demoUsers: DEMO_USERS
    });
  }
});

// Register page
router.get('/register', async (req, res) => {
  if (req.session.userId) {
    return res.redirect(`${config.basePath}/student`);
  }

  const branding = await getBranding();
  const schools = await prisma.school.findMany({
    where: { isActive: true },
    select: { id: true, name: true }
  });

  res.render('auth/register', {
    title: 'Register - TutorAI',
    branding,
    schools,
    error: null
  });
});

// Register POST - with input validation
router.post('/register',
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('firstName').trim().isLength({ min: 1, max: 100 }).withMessage('First name is required'),
    body('lastName').trim().isLength({ min: 1, max: 100 }).withMessage('Last name is required')
  ],
  async (req, res) => {
  const branding = await getBranding();
  const schools = await prisma.school.findMany({
    where: { isActive: true },
    select: { id: true, name: true }
  });

  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/register', {
        title: 'Register - TutorAI',
        branding,
        schools,
        error: errors.array()[0].msg
      });
    }

    const { email, password, confirmPassword, firstName, lastName, schoolId, gradeLevel } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.render('auth/register', {
        title: 'Register - TutorAI',
        branding,
        schools,
        error: 'All fields are required'
      });
    }

    if (password !== confirmPassword) {
      return res.render('auth/register', {
        title: 'Register - TutorAI',
        branding,
        schools,
        error: 'Passwords do not match'
      });
    }

    if (password.length < 8) {
      return res.render('auth/register', {
        title: 'Register - TutorAI',
        branding,
        schools,
        error: 'Password must be at least 8 characters'
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.render('auth/register', {
        title: 'Register - TutorAI',
        branding,
        schools,
        error: 'An account with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        role: 'STUDENT',
        schoolId: schoolId || null,
        gradeLevel: gradeLevel ? parseInt(gradeLevel, 10) : null,
        emailVerified: false // Require email verification
      }
    });

    logger.info(`New user registered: ${user.email}`);

    // Log registration
    await logUserAction(req, AuditAction.REGISTER, 'User', user.id, { role: user.role });

    // Generate email verification token
    const verificationToken = generateSecureToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: verificationExpires
      }
    });

    // Send verification email
    await sendEmailVerificationEmail(user.email, user.firstName, verificationToken);

    // Set session (allow access but show verification reminder)
    req.session.userId = user.id;
    req.session.schoolId = user.schoolId;
    req.session.role = user.role;
    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      schoolId: user.schoolId
    };

    // Redirect to a page that tells them to verify their email
    return res.redirect(`${config.basePath}/auth/check-email?email=${encodeURIComponent(user.email)}`);

  } catch (error) {
    logger.error('Registration error:', error);
    return res.render('auth/register', {
      title: 'Register - TutorAI',
      branding,
      schools,
      error: 'An error occurred. Please try again.'
    });
  }
});

// Logout (front-end only - does NOT affect admin session)
router.get('/logout', async (req, res) => {
  // Log logout before clearing session
  if (req.session.userId) {
    await logUserAction(req, AuditAction.LOGOUT, 'User', req.session.userId);
  }

  // Clear only front-end session data
  delete req.session.userId;
  delete req.session.schoolId;
  delete req.session.role;
  delete req.session.gradeLevel;
  delete req.session.user;

  req.session.save((err) => {
    if (err) {
      logger.error('Logout error:', err);
    }
    res.redirect(`${config.basePath}/`);
  });
});

router.post('/logout', async (req, res) => {
  // Log logout before clearing session
  if (req.session.userId) {
    await logUserAction(req, AuditAction.LOGOUT, 'User', req.session.userId);
  }

  // Clear only front-end session data
  delete req.session.userId;
  delete req.session.schoolId;
  delete req.session.role;
  delete req.session.gradeLevel;
  delete req.session.user;

  req.session.save((err) => {
    if (err) {
      logger.error('Logout error:', err);
    }
    res.redirect(`${config.basePath}/`);
  });
});

// ============================================
// CHECK EMAIL (after registration)
// ============================================

router.get('/check-email', async (req, res) => {
  const branding = await getBranding();
  const email = req.query.email as string || '';

  res.render('auth/check-email', {
    title: 'Check Your Email - TutorAI',
    branding,
    email
  });
});

// ============================================
// FORGOT PASSWORD
// ============================================

// Forgot password page
router.get('/forgot-password', async (req, res) => {
  if (req.session.userId) {
    return res.redirect(`${config.basePath}/student`);
  }

  const branding = await getBranding();

  res.render('auth/forgot-password', {
    title: 'Forgot Password - TutorAI',
    branding,
    error: null,
    success: null
  });
});

// Forgot password POST - send reset email (with strict rate limiting)
router.post('/forgot-password',
  strictLimiter, // Only 5 requests per hour
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('Please enter a valid email')
  ],
  async (req, res) => {
  const branding = await getBranding();

  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/forgot-password', {
        title: 'Forgot Password - TutorAI',
        branding,
        error: errors.array()[0].msg,
        success: null
      });
    }

    const { email } = req.body;

    if (!email) {
      return res.render('auth/forgot-password', {
        title: 'Forgot Password - TutorAI',
        branding,
        error: 'Email address is required',
        success: null
      });
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), isActive: true }
    });

    // Always show success message to prevent email enumeration
    const successMessage = 'If an account exists with this email, you will receive a password reset link shortly.';

    if (!user) {
      logger.info(`Password reset requested for non-existent email: ${email}`);
      return res.render('auth/forgot-password', {
        title: 'Forgot Password - TutorAI',
        branding,
        error: null,
        success: successMessage
      });
    }

    // Check for recent reset requests (rate limiting - 1 per 5 minutes)
    const recentToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        createdAt: { gt: new Date(Date.now() - 5 * 60 * 1000) },
        usedAt: null
      }
    });

    if (recentToken) {
      logger.info(`Rate limited password reset for: ${email}`);
      return res.render('auth/forgot-password', {
        title: 'Forgot Password - TutorAI',
        branding,
        error: null,
        success: successMessage
      });
    }

    // Generate reset token
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to database
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    // Send reset email
    const emailSent = await sendPasswordResetEmail(
      user.email,
      user.firstName,
      token
    );

    if (emailSent) {
      logger.info(`Password reset email sent to: ${email}`);
      // Log password reset request
      await logUserAction(req, AuditAction.PASSWORD_RESET_REQUESTED, 'User', user.id);
    } else {
      logger.error(`Failed to send password reset email to: ${email}`);
    }

    res.render('auth/forgot-password', {
      title: 'Forgot Password - TutorAI',
      branding,
      error: null,
      success: successMessage
    });

  } catch (error) {
    logger.error('Forgot password error:', error);
    res.render('auth/forgot-password', {
      title: 'Forgot Password - TutorAI',
      branding,
      error: 'An error occurred. Please try again.',
      success: null
    });
  }
});

// ============================================
// RESET PASSWORD
// ============================================

// Reset password page
router.get('/reset-password', async (req, res) => {
  const branding = await getBranding();
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.render('auth/reset-password', {
      title: 'Reset Password - TutorAI',
      branding,
      error: 'Invalid or missing reset token.',
      success: null,
      token: null,
      expired: true
    });
  }

  // Verify token exists and is not expired
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      token,
      usedAt: null,
      expiresAt: { gt: new Date() }
    }
  });

  if (!resetToken) {
    return res.render('auth/reset-password', {
      title: 'Reset Password - TutorAI',
      branding,
      error: 'This password reset link has expired or is invalid. Please request a new one.',
      success: null,
      token: null,
      expired: true
    });
  }

  res.render('auth/reset-password', {
    title: 'Reset Password - TutorAI',
    branding,
    error: null,
    success: null,
    token,
    expired: false
  });
});

// Reset password POST - change password
router.post('/reset-password', async (req, res) => {
  const branding = await getBranding();

  try {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
      return res.render('auth/reset-password', {
        title: 'Reset Password - TutorAI',
        branding,
        error: 'Reset token is missing.',
        success: null,
        token: null,
        expired: true
      });
    }

    // Validate password
    if (!password || password.length < 8) {
      return res.render('auth/reset-password', {
        title: 'Reset Password - TutorAI',
        branding,
        error: 'Password must be at least 8 characters.',
        success: null,
        token,
        expired: false
      });
    }

    if (password !== confirmPassword) {
      return res.render('auth/reset-password', {
        title: 'Reset Password - TutorAI',
        branding,
        error: 'Passwords do not match.',
        success: null,
        token,
        expired: false
      });
    }

    // Verify token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        usedAt: null,
        expiresAt: { gt: new Date() }
      }
    });

    if (!resetToken) {
      return res.render('auth/reset-password', {
        title: 'Reset Password - TutorAI',
        branding,
        error: 'This password reset link has expired or is invalid. Please request a new one.',
        success: null,
        token: null,
        expired: true
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: resetToken.userId }
    });

    if (!user) {
      return res.render('auth/reset-password', {
        title: 'Reset Password - TutorAI',
        branding,
        error: 'User not found.',
        success: null,
        token: null,
        expired: true
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash }
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() }
      })
    ]);

    // Send confirmation email
    await sendPasswordChangedEmail(user.email, user.firstName);

    // Log password change
    await logUserAction(req, AuditAction.PASSWORD_CHANGED, 'User', user.id, { method: 'reset' });

    logger.info(`Password reset successful for: ${user.email}`);

    res.render('auth/reset-password', {
      title: 'Reset Password - TutorAI',
      branding,
      error: null,
      success: 'Your password has been reset successfully. You can now log in with your new password.',
      token: null,
      expired: false
    });

  } catch (error) {
    logger.error('Reset password error:', error);
    res.render('auth/reset-password', {
      title: 'Reset Password - TutorAI',
      branding,
      error: 'An error occurred. Please try again.',
      success: null,
      token: req.body.token,
      expired: false
    });
  }
});

// ============================================
// EMAIL VERIFICATION
// ============================================

// Verify email page
router.get('/verify-email', async (req, res) => {
  const branding = await getBranding();
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.render('auth/verify-email', {
      title: 'Verify Email - TutorAI',
      branding,
      error: 'Invalid or missing verification token.',
      success: null
    });
  }

  try {
    // Verify token exists and is not expired
    const verifyToken = await prisma.emailVerificationToken.findFirst({
      where: {
        token,
        verifiedAt: null,
        expiresAt: { gt: new Date() }
      }
    });

    if (!verifyToken) {
      return res.render('auth/verify-email', {
        title: 'Verify Email - TutorAI',
        branding,
        error: 'This verification link has expired or is invalid. Please request a new one.',
        success: null
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: verifyToken.userId }
    });

    if (!user) {
      return res.render('auth/verify-email', {
        title: 'Verify Email - TutorAI',
        branding,
        error: 'User not found.',
        success: null
      });
    }

    // Mark email as verified
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true }
      }),
      prisma.emailVerificationToken.update({
        where: { id: verifyToken.id },
        data: { verifiedAt: new Date() }
      })
    ]);

    // Send welcome email
    await sendWelcomeEmail(user.email, user.firstName);

    // Log email verification
    await logUserAction(req, AuditAction.EMAIL_VERIFIED, 'User', user.id);

    logger.info(`Email verified for: ${user.email}`);

    res.render('auth/verify-email', {
      title: 'Verify Email - TutorAI',
      branding,
      error: null,
      success: 'Your email has been verified successfully! You can now log in to your account.'
    });

  } catch (error) {
    logger.error('Email verification error:', error);
    res.render('auth/verify-email', {
      title: 'Verify Email - TutorAI',
      branding,
      error: 'An error occurred during verification. Please try again.',
      success: null
    });
  }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), isActive: true }
    });

    // Always return success to prevent email enumeration
    if (!user || user.emailVerified) {
      return res.json({ success: true, message: 'If your email is registered and unverified, you will receive a verification link.' });
    }

    // Check for recent verification requests (rate limiting - 1 per 2 minutes)
    const recentToken = await prisma.emailVerificationToken.findFirst({
      where: {
        userId: user.id,
        createdAt: { gt: new Date(Date.now() - 2 * 60 * 1000) },
        verifiedAt: null
      }
    });

    if (recentToken) {
      return res.json({ success: true, message: 'If your email is registered and unverified, you will receive a verification link.' });
    }

    // Generate verification token
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    // Send verification email
    await sendEmailVerificationEmail(user.email, user.firstName, token);

    logger.info(`Verification email resent to: ${email}`);

    res.json({ success: true, message: 'Verification email sent. Please check your inbox.' });

  } catch (error) {
    logger.error('Resend verification error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// API login (for AJAX)
router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), isActive: true }
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const signOptions: SignOptions = { expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'] };
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId
      },
      config.jwtSecret,
      signOptions
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Set session
    req.session.userId = user.id;
    req.session.schoolId = user.schoolId;
    req.session.role = user.role;
    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      schoolId: user.schoolId
    };

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

  } catch (error) {
    logger.error('API login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
