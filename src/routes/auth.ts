// TutorAI Auth Routes
// Login, register, logout, password reset

import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { config } from '../config';
import { DEMO_USERS } from '../config/constants';
import { logger } from '../utils/logger';

const router = Router();

// Extend Express Session
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    schoolId?: string | null;
    role?: string;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      schoolId: string | null;
    };
  }
}

// Helper to get branding
async function getBranding() {
  const branding = await prisma.branding.findFirst({ where: { id: 'default' } });
  return branding || {
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    accentColor: '#38bdf8'
  };
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

// Login POST
router.post('/login', async (req, res) => {
  const branding = await getBranding();

  try {
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

    // Redirect based on role
    switch (user.role) {
      case 'SUPER_ADMIN':
        return res.redirect(`${config.basePath}/admin`);
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

// Register POST
router.post('/register', async (req, res) => {
  const branding = await getBranding();
  const schools = await prisma.school.findMany({
    where: { isActive: true },
    select: { id: true, name: true }
  });

  try {
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
        gradeLevel: gradeLevel ? parseInt(gradeLevel, 10) : null
      }
    });

    logger.info(`New user registered: ${user.email}`);

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

    return res.redirect(`${config.basePath}/student`);

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
router.get('/logout', (req, res) => {
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

router.post('/logout', (req, res) => {
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
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
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
