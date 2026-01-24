// TutorAI Parent Portal Routes
// Dashboard, progress viewing, consent management for parents

import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { config } from '../config';
import { logger } from '../utils/logger';
import { body, validationResult } from 'express-validator';
import { logUserAction, AuditAction } from '../services/audit.service';

const router = Router();

// Extend Express Session for parent
declare module 'express-session' {
  interface SessionData {
    parentId?: string;
    parentEmail?: string;
    parent?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
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

// Middleware: Require parent authentication
function requireParentAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.parentId) {
    return res.redirect(`${config.basePath}/parent/login`);
  }
  next();
}

// Generate secure token
function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ============================================
// PARENT AUTH ROUTES
// ============================================

// Parent Login Page
router.get('/login', async (req, res) => {
  if (req.session.parentId) {
    return res.redirect(`${config.basePath}/parent`);
  }

  const branding = await getBranding();
  res.render('parent/login', {
    title: 'Parent Login - TutorAI',
    branding,
    error: null,
    success: req.query.registered ? 'Account created! Please log in.' : null
  });
});

// Parent Login POST
router.post('/login',
  [
    body('email').trim().isEmail().normalizeEmail(),
    body('password').isLength({ min: 1 })
  ],
  async (req, res) => {
    const branding = await getBranding();

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('parent/login', {
          title: 'Parent Login - TutorAI',
          branding,
          error: 'Please enter a valid email and password',
          success: null
        });
      }

      const { email, password } = req.body;

      const parent = await prisma.parentAccount.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!parent || !parent.passwordHash) {
        return res.render('parent/login', {
          title: 'Parent Login - TutorAI',
          branding,
          error: 'Invalid email or password',
          success: null
        });
      }

      if (!parent.isActive) {
        return res.render('parent/login', {
          title: 'Parent Login - TutorAI',
          branding,
          error: 'This account has been deactivated',
          success: null
        });
      }

      const validPassword = await bcrypt.compare(password, parent.passwordHash);
      if (!validPassword) {
        return res.render('parent/login', {
          title: 'Parent Login - TutorAI',
          branding,
          error: 'Invalid email or password',
          success: null
        });
      }

      // Update last login
      await prisma.parentAccount.update({
        where: { id: parent.id },
        data: { lastLoginAt: new Date() }
      });

      // Set session
      req.session.parentId = parent.id;
      req.session.parentEmail = parent.email;
      req.session.parent = {
        id: parent.id,
        email: parent.email,
        firstName: parent.firstName,
        lastName: parent.lastName
      };

      logger.info(`Parent logged in: ${parent.email}`);

      return res.redirect(`${config.basePath}/parent`);

    } catch (error) {
      logger.error('Parent login error:', error);
      return res.render('parent/login', {
        title: 'Parent Login - TutorAI',
        branding,
        error: 'An error occurred. Please try again.',
        success: null
      });
    }
  });

// Parent Register Page
router.get('/register', async (req, res) => {
  if (req.session.parentId) {
    return res.redirect(`${config.basePath}/parent`);
  }

  const branding = await getBranding();
  const { token } = req.query;

  // Check if registering via consent link
  let consentInfo = null;
  if (token) {
    const consent = await prisma.parentalConsent.findUnique({
      where: { consentToken: token as string }
    });
    if (consent && consent.consentStatus === 'pending') {
      consentInfo = {
        email: consent.parentEmail,
        firstName: consent.parentFirstName,
        lastName: consent.parentLastName,
        token: token
      };
    }
  }

  res.render('parent/register', {
    title: 'Parent Registration - TutorAI',
    branding,
    error: null,
    consentInfo
  });
});

// Parent Register POST
router.post('/register',
  [
    body('email').trim().isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('firstName').trim().isLength({ min: 1, max: 100 }),
    body('lastName').trim().isLength({ min: 1, max: 100 })
  ],
  async (req, res) => {
    const branding = await getBranding();

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('parent/register', {
          title: 'Parent Registration - TutorAI',
          branding,
          error: errors.array()[0].msg,
          consentInfo: null
        });
      }

      const { email, password, firstName, lastName, phone, consentToken } = req.body;

      // Check if account exists
      const existingParent = await prisma.parentAccount.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (existingParent) {
        return res.render('parent/register', {
          title: 'Parent Registration - TutorAI',
          branding,
          error: 'An account with this email already exists',
          consentInfo: null
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create parent account
      const parent = await prisma.parentAccount.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          firstName,
          lastName,
          phone: phone || null
        }
      });

      // If registering via consent link, link the student
      if (consentToken) {
        const consent = await prisma.parentalConsent.findUnique({
          where: { consentToken }
        });

        if (consent && consent.consentStatus === 'pending') {
          // Create parent-student link
          await prisma.parentStudent.create({
            data: {
              parentId: parent.id,
              studentId: consent.studentId,
              relationship: consent.relationship,
              consentId: consent.id,
              isPrimary: true
            }
          });

          // Verify consent
          await prisma.parentalConsent.update({
            where: { id: consent.id },
            data: {
              consentStatus: 'verified',
              verifiedAt: new Date()
            }
          });
        }
      }

      logger.info(`Parent registered: ${parent.email}`);

      return res.redirect(`${config.basePath}/parent/login?registered=true`);

    } catch (error) {
      logger.error('Parent registration error:', error);
      return res.render('parent/register', {
        title: 'Parent Registration - TutorAI',
        branding,
        error: 'An error occurred. Please try again.',
        consentInfo: null
      });
    }
  });

// Parent Logout
router.get('/logout', (req, res) => {
  delete req.session.parentId;
  delete req.session.parentEmail;
  delete req.session.parent;

  req.session.save((err) => {
    if (err) {
      logger.error('Parent logout error:', err);
    }
    res.redirect(`${config.basePath}/parent/login`);
  });
});

// ============================================
// PROTECTED PARENT ROUTES
// ============================================

router.use(requireParentAuth);

// Parent Dashboard
router.get('/', async (req, res) => {
  try {
    const branding = await getBranding();
    const parentId = req.session.parentId!;

    const parent = await prisma.parentAccount.findUnique({
      where: { id: parentId },
      include: {
        children: {
          include: {
            // We need to get student data manually since User is not linked directly
          }
        }
      }
    });

    if (!parent) {
      delete req.session.parentId;
      return res.redirect(`${config.basePath}/parent/login`);
    }

    // Get linked children
    const parentStudents = await prisma.parentStudent.findMany({
      where: { parentId }
    });

    const studentIds = parentStudents.map(ps => ps.studentId);

    // Get student details
    const children = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      include: {
        school: { select: { name: true } }
      }
    });

    // Get recent activity for all children
    const recentSessions = await prisma.tutoringSession.findMany({
      where: { studentId: { in: studentIds } },
      include: {
        subject: { include: { category: true } },
        topic: true,
        student: { select: { firstName: true, lastName: true } }
      },
      orderBy: { startedAt: 'desc' },
      take: 10
    });

    // Get progress summary for all children
    const progressSummary = await prisma.studentProgress.findMany({
      where: { studentId: { in: studentIds } },
      include: {
        topic: { include: { subject: true } },
        student: { select: { firstName: true, lastName: true } }
      },
      orderBy: { lastActivityAt: 'desc' },
      take: 10
    });

    res.render('parent/dashboard', {
      title: 'Parent Dashboard - TutorAI',
      branding,
      parent,
      children: children.map(child => {
        const link = parentStudents.find(ps => ps.studentId === child.id);
        return {
          ...child,
          relationship: link?.relationship || 'parent',
          isPrimary: link?.isPrimary || false
        };
      }),
      recentSessions,
      progressSummary
    });

  } catch (error) {
    logger.error('Parent dashboard error:', error);
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// View Child Progress
router.get('/child/:studentId', async (req, res) => {
  try {
    const branding = await getBranding();
    const parentId = req.session.parentId!;
    const { studentId } = req.params;

    // Verify parent has access to this student
    const link = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: { parentId, studentId }
      }
    });

    if (!link || !link.canViewProgress) {
      return res.status(403).render('errors/403', {
        basePath: config.basePath,
        title: 'Access Denied'
      });
    }

    const child = await prisma.user.findUnique({
      where: { id: studentId },
      include: { school: true }
    });

    if (!child) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Student Not Found'
      });
    }

    // Get progress
    const progress = await prisma.studentProgress.findMany({
      where: { studentId },
      include: {
        topic: {
          include: {
            subject: { include: { category: true } }
          }
        }
      },
      orderBy: { lastActivityAt: 'desc' }
    });

    // Get recent sessions
    const sessions = await prisma.tutoringSession.findMany({
      where: { studentId },
      include: {
        subject: { include: { category: true } },
        topic: true
      },
      orderBy: { startedAt: 'desc' },
      take: 20
    });

    // Get session stats
    const sessionStats = await prisma.tutoringSession.aggregate({
      where: { studentId },
      _count: { id: true },
      _sum: { duration: true }
    });

    // Group progress by subject
    const progressBySubject: Record<string, typeof progress> = {};
    progress.forEach(p => {
      const subjectName = p.topic.subject.name;
      if (!progressBySubject[subjectName]) {
        progressBySubject[subjectName] = [];
      }
      progressBySubject[subjectName].push(p);
    });

    res.render('parent/child-progress', {
      title: `${child.firstName}'s Progress - TutorAI`,
      branding,
      parent: req.session.parent,
      child,
      progress,
      progressBySubject,
      sessions,
      sessionStats: {
        totalSessions: sessionStats._count.id,
        totalMinutes: Math.floor((sessionStats._sum.duration || 0) / 60)
      }
    });

  } catch (error) {
    logger.error('Child progress error:', error);
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// View Child's Session Detail
router.get('/child/:studentId/session/:sessionId', async (req, res) => {
  try {
    const branding = await getBranding();
    const parentId = req.session.parentId!;
    const { studentId, sessionId } = req.params;

    // Verify parent has access
    const link = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: { parentId, studentId }
      }
    });

    if (!link || !link.canViewSessions) {
      return res.status(403).render('errors/403', {
        basePath: config.basePath,
        title: 'Access Denied'
      });
    }

    const session = await prisma.tutoringSession.findFirst({
      where: { id: sessionId, studentId },
      include: {
        subject: { include: { category: true } },
        topic: true,
        student: true,
        messages: { orderBy: { createdAt: 'asc' } }
      }
    });

    if (!session) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Session Not Found'
      });
    }

    res.render('parent/session-detail', {
      title: 'Session Detail - TutorAI',
      branding,
      parent: req.session.parent,
      session
    });

  } catch (error) {
    logger.error('Session detail error:', error);
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Parent Settings
router.get('/settings', async (req, res) => {
  try {
    const branding = await getBranding();
    const parentId = req.session.parentId!;

    const parent = await prisma.parentAccount.findUnique({
      where: { id: parentId }
    });

    if (!parent) {
      return res.redirect(`${config.basePath}/parent/login`);
    }

    // Get linked children
    const parentStudents = await prisma.parentStudent.findMany({
      where: { parentId }
    });

    const studentIds = parentStudents.map(ps => ps.studentId);
    const children = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, firstName: true, lastName: true, email: true }
    });

    res.render('parent/settings', {
      title: 'Settings - TutorAI',
      branding,
      parent,
      children: children.map(child => {
        const link = parentStudents.find(ps => ps.studentId === child.id);
        return { ...child, link };
      })
    });

  } catch (error) {
    logger.error('Parent settings error:', error);
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Update Notification Preferences
router.post('/settings/notifications', async (req, res) => {
  try {
    const parentId = req.session.parentId!;
    const {
      notifyProgress,
      notifyGrades,
      notifyAttendance,
      notifyMessages,
      notifyWeeklyDigest
    } = req.body;

    await prisma.parentAccount.update({
      where: { id: parentId },
      data: {
        notifyProgress: notifyProgress === 'on',
        notifyGrades: notifyGrades === 'on',
        notifyAttendance: notifyAttendance === 'on',
        notifyMessages: notifyMessages === 'on',
        notifyWeeklyDigest: notifyWeeklyDigest === 'on'
      }
    });

    res.redirect(`${config.basePath}/parent/settings?saved=notifications`);

  } catch (error) {
    logger.error('Update notifications error:', error);
    res.redirect(`${config.basePath}/parent/settings?error=notifications`);
  }
});

// Link Additional Child
router.post('/link-child', async (req, res) => {
  try {
    const parentId = req.session.parentId!;
    const { studentEmail, relationship } = req.body;

    // Find student by email
    const student = await prisma.user.findFirst({
      where: {
        email: studentEmail.toLowerCase(),
        role: 'STUDENT',
        isActive: true
      }
    });

    if (!student) {
      return res.redirect(`${config.basePath}/parent/settings?error=student_not_found`);
    }

    // Check if already linked
    const existingLink = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: { parentId, studentId: student.id }
      }
    });

    if (existingLink) {
      return res.redirect(`${config.basePath}/parent/settings?error=already_linked`);
    }

    // Create link (pending verification by school)
    await prisma.parentStudent.create({
      data: {
        parentId,
        studentId: student.id,
        relationship: relationship || 'parent',
        isVerified: false
      }
    });

    res.redirect(`${config.basePath}/parent/settings?success=link_requested`);

  } catch (error) {
    logger.error('Link child error:', error);
    res.redirect(`${config.basePath}/parent/settings?error=link_failed`);
  }
});

// Consent Management
router.get('/consent', async (req, res) => {
  try {
    const branding = await getBranding();
    const parentId = req.session.parentId!;

    const parent = await prisma.parentAccount.findUnique({
      where: { id: parentId }
    });

    // Get all consent records for this parent's email
    const consents = await prisma.parentalConsent.findMany({
      where: { parentEmail: parent?.email }
    });

    // Get student info for each consent
    const studentIds = consents.map(c => c.studentId);
    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, firstName: true, lastName: true }
    });

    const consentsWithStudents = consents.map(consent => {
      const student = students.find(s => s.id === consent.studentId);
      return { ...consent, student };
    });

    res.render('parent/consent', {
      title: 'Consent Management - TutorAI',
      branding,
      parent,
      consents: consentsWithStudents
    });

  } catch (error) {
    logger.error('Consent page error:', error);
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Revoke Consent
router.post('/consent/:consentId/revoke', async (req, res) => {
  try {
    const parentId = req.session.parentId!;
    const { consentId } = req.params;
    const { reason } = req.body;

    const parent = await prisma.parentAccount.findUnique({
      where: { id: parentId }
    });

    // Verify this consent belongs to this parent
    const consent = await prisma.parentalConsent.findFirst({
      where: {
        id: consentId,
        parentEmail: parent?.email,
        consentStatus: 'verified'
      }
    });

    if (!consent) {
      return res.status(404).json({ error: 'Consent not found' });
    }

    // Revoke consent
    await prisma.parentalConsent.update({
      where: { id: consentId },
      data: {
        consentStatus: 'revoked',
        revokedAt: new Date(),
        revokedReason: reason || 'Parent request'
      }
    });

    res.redirect(`${config.basePath}/parent/consent?revoked=true`);

  } catch (error) {
    logger.error('Revoke consent error:', error);
    res.status(500).json({ error: 'Failed to revoke consent' });
  }
});

export default router;
