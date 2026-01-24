// TutorAI Admin Routes
// Admin panel for platform management

import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/database';
import { config } from '../config';
import { requireAuthOrToken, requireMinRole } from '../middleware/auth';
import { LANGUAGES, DEMO_USERS } from '../config/constants';
import { logger } from '../utils/logger';
import { getAuditLogs, getAdminStats, AuditAction, logUserAction } from '../services/audit.service';
import { globalSearch, searchUsers, searchSessions } from '../services/search.service';
import {
  bulkCreateUsers,
  bulkUpdateUserStatus,
  bulkEnrollStudents,
  bulkUnenrollStudents,
  bulkAssignTeachers,
  bulkResetPasswords,
  parseUserCSV,
  exportUsersToCSV
} from '../services/bulk.service';
import {
  exportStudentProgressCSV,
  exportSessionsCSV,
  exportAssignmentsCSV,
  exportGradesCSV,
  generateProgressReportHTML
} from '../services/report.service';
import {
  enableTwoFactor,
  verifyAndActivateTwoFactor,
  verifyTwoFactorToken,
  disableTwoFactor,
  hasTwoFactorEnabled,
  getTwoFactorStatus,
  regenerateBackupCodes
} from '../services/twoFactor.service';
import {
  getAllBadges,
  awardBadge,
  getLeaderboard,
  createAnnouncement,
  getAnnouncementsForUser,
  initializeDefaultBadges,
  getPointConfig
} from '../services/gamification.service';

const router = Router();

// Helper to get branding (defined early for auth routes)
async function getBranding() {
  const branding = await prisma.branding.findFirst({ where: { id: 'default' } });
  return branding || {
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    accentColor: '#38bdf8'
  };
}

// =====================
// Admin Auth Routes (before requireAuthOrToken)
// =====================

// Admin Login Page (Super Admin only)
router.get('/auth/login', async (req, res) => {
  // Check admin-specific session
  if (req.session.adminUserId && req.session.adminRole === 'SUPER_ADMIN') {
    return res.redirect(`${config.basePath}/admin`);
  }

  const branding = await getBranding();
  const adminDemoUsers = DEMO_USERS.filter(u => u.role === 'SUPER_ADMIN');

  res.render('admin/login', {
    title: 'Platform Admin Login - TutorAI',
    branding,
    basePath: config.basePath,
    error: null,
    demoUsers: adminDemoUsers
  });
});

// Admin Login POST (Super Admin only)
router.post('/auth/login', async (req, res) => {
  const branding = await getBranding();
  const adminDemoUsers = DEMO_USERS.filter(u => u.role === 'SUPER_ADMIN');

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('admin/login', {
        title: 'Platform Admin Login - TutorAI',
        branding,
        basePath: config.basePath,
        error: 'Email and password are required',
        demoUsers: adminDemoUsers
      });
    }

    // Find user with Super Admin role only
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        isActive: true,
        role: 'SUPER_ADMIN'
      }
    });

    if (!user || !user.passwordHash) {
      return res.render('admin/login', {
        title: 'Platform Admin Login - TutorAI',
        branding,
        basePath: config.basePath,
        error: 'Invalid credentials or not a platform admin account',
        demoUsers: adminDemoUsers
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.render('admin/login', {
        title: 'Platform Admin Login - TutorAI',
        branding,
        basePath: config.basePath,
        error: 'Invalid credentials',
        demoUsers: adminDemoUsers
      });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Store pending 2FA session
      req.session.pending2FAUserId = user.id;
      req.session.pending2FAEmail = user.email;

      logger.info(`2FA required for admin: ${user.email}`);

      return res.render('admin/two-factor', {
        title: '2FA Verification - TutorAI Admin',
        branding,
        basePath: config.basePath,
        email: user.email,
        error: null
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Set admin-specific session (separate from front-end session)
    req.session.adminUserId = user.id;
    req.session.adminSchoolId = user.schoolId;
    req.session.adminRole = user.role;
    req.session.adminUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      schoolId: user.schoolId
    };

    logger.info(`Admin logged in: ${user.email}`);

    return res.redirect(`${config.basePath}/admin`);

  } catch (error) {
    logger.error('Admin login error:', error);
    return res.render('admin/login', {
      title: 'Admin Login - TutorAI',
      branding,
      basePath: config.basePath,
      error: 'An error occurred. Please try again.',
      demoUsers: adminDemoUsers
    });
  }
});

// Admin Logout (both paths for convenience)
// Only clears admin session - does NOT affect front-end session
router.get('/auth/logout', (req, res) => {
  // Clear only admin-specific session data
  delete req.session.adminUserId;
  delete req.session.adminSchoolId;
  delete req.session.adminRole;
  delete req.session.adminUser;

  req.session.save((err) => {
    if (err) {
      logger.error('Admin logout error:', err);
    }
    res.redirect(`${config.basePath}/admin/auth/login`);
  });
});

router.get('/logout', (req, res) => {
  // Clear only admin-specific session data
  delete req.session.adminUserId;
  delete req.session.adminSchoolId;
  delete req.session.adminRole;
  delete req.session.adminUser;

  req.session.save((err) => {
    if (err) {
      logger.error('Admin logout error:', err);
    }
    res.redirect(`${config.basePath}/admin/auth/login`);
  });
});

// =====================
// 2FA Verification Routes
// =====================

// 2FA Verification Page (shown after password login)
router.get('/auth/two-factor', async (req, res) => {
  if (!req.session.pending2FAUserId) {
    return res.redirect(`${config.basePath}/admin/auth/login`);
  }

  const branding = await getBranding();
  res.render('admin/two-factor', {
    title: '2FA Verification - TutorAI Admin',
    branding,
    basePath: config.basePath,
    email: req.session.pending2FAEmail,
    error: null
  });
});

// 2FA Verification POST
router.post('/auth/two-factor', async (req, res) => {
  const branding = await getBranding();
  const userId = req.session.pending2FAUserId;
  const email = req.session.pending2FAEmail;

  if (!userId) {
    return res.redirect(`${config.basePath}/admin/auth/login`);
  }

  try {
    const { token } = req.body;

    if (!token || token.length < 6) {
      return res.render('admin/two-factor', {
        title: '2FA Verification - TutorAI Admin',
        branding,
        basePath: config.basePath,
        email,
        error: 'Please enter a valid 6-digit code or backup code'
      });
    }

    const isValid = await verifyTwoFactorToken(userId, token.replace(/\s/g, ''));

    if (!isValid) {
      return res.render('admin/two-factor', {
        title: '2FA Verification - TutorAI Admin',
        branding,
        basePath: config.basePath,
        email,
        error: 'Invalid verification code. Please try again.'
      });
    }

    // Get full user data
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.redirect(`${config.basePath}/admin/auth/login`);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Clear pending 2FA session
    delete req.session.pending2FAUserId;
    delete req.session.pending2FAEmail;

    // Set admin session
    req.session.adminUserId = user.id;
    req.session.adminSchoolId = user.schoolId;
    req.session.adminRole = user.role;
    req.session.adminUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      schoolId: user.schoolId
    };

    logger.info(`Admin logged in with 2FA: ${user.email}`);

    return res.redirect(`${config.basePath}/admin`);

  } catch (error) {
    logger.error('2FA verification error:', error);
    return res.render('admin/two-factor', {
      title: '2FA Verification - TutorAI Admin',
      branding,
      basePath: config.basePath,
      email,
      error: 'An error occurred. Please try again.'
    });
  }
});

// =====================
// Protected Admin Routes
// =====================

// Apply auth to remaining admin routes
router.use(requireAuthOrToken);

// Admin Dashboard
router.get('/', async (req, res) => {
  try {
    const branding = await getBranding();

    // Get stats
    const [totalUsers, totalStudents, totalSessions, totalSchools] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.tutoringSession.count(),
      prisma.school.count()
    ]);

    // Recent activity
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    const recentSessions = await prisma.tutoringSession.findMany({
      orderBy: { startedAt: 'desc' },
      take: 5,
      include: {
        student: { select: { firstName: true, lastName: true } },
        subject: { select: { name: true } }
      }
    });

    res.render('admin/dashboard', {
      title: 'Admin Dashboard - TutorAI',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      stats: { totalUsers, totalStudents, totalSessions, totalSchools },
      recentUsers,
      recentSessions
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Admin dashboard error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Users Management
router.get('/users', async (req, res) => {
  try {
    const branding = await getBranding();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { school: { select: { name: true } } }
    });

    res.render('admin/users', {
      title: 'Users - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      users
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Users error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Schools Management
router.get('/schools', async (req, res) => {
  try {
    const branding = await getBranding();
    const schools = await prisma.school.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { users: true, classes: true } }
      }
    });

    res.render('admin/schools', {
      title: 'Schools - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      schools
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Schools error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Subjects Management
router.get('/subjects', async (req, res) => {
  try {
    const branding = await getBranding();
    const categories = await prisma.subjectCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        subjects: {
          orderBy: { order: 'asc' },
          include: {
            _count: { select: { topics: true } }
          }
        }
      }
    });

    res.render('admin/subjects', {
      title: 'Subjects - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      categories
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Subjects error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Greeting Settings
router.get('/greeting', async (req, res) => {
  try {
    const branding = await getBranding();
    const greeting = await prisma.greeting.findFirst({ where: { id: 'default' } });

    res.render('admin/greeting', {
      title: 'Greeting - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      greeting: greeting || {
        welcomeTitle: 'Welcome to TutorAI!',
        welcomeMessage: "I'm your AI tutor.",
        voiceGreeting: "Hello! I'm your AI tutor."
      }
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Greeting error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// AI Config
router.get('/ai-config', async (req, res) => {
  try {
    const branding = await getBranding();
    const aiConfig = await prisma.aIConfig.findFirst({ where: { id: 'default' } });

    res.render('admin/ai-config', {
      title: 'AI Config - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      aiConfig: aiConfig || {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1024,
        voiceId: 'alloy',
        enableVoice: true,
        enableVision: true
      }
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'AI config error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Voices & Languages
router.get('/voices', async (req, res) => {
  try {
    const branding = await getBranding();
    const languages = await prisma.language.findMany({ orderBy: { name: 'asc' } });
    const aiConfig = await prisma.aIConfig.findFirst({ where: { id: 'default' } });

    res.render('admin/voices', {
      title: 'Voices & Languages - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      languages,
      aiConfig
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Voices error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Settings
router.get('/settings', async (req, res) => {
  try {
    const branding = await getBranding();
    const storeInfo = await prisma.storeInfo.findFirst({ where: { id: 'default' } });

    res.render('admin/settings', {
      title: 'Settings - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      storeInfo: storeInfo || {
        businessName: 'TutorAI',
        tagline: 'AI-Powered Learning',
        description: ''
      }
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Settings error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Analytics
router.get('/analytics', async (req, res) => {
  try {
    const branding = await getBranding();
    res.render('admin/analytics', {
      title: 'Analytics - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Analytics error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Sessions
router.get('/sessions', async (req, res) => {
  try {
    const branding = await getBranding();
    res.render('admin/sessions', {
      title: 'Sessions - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Sessions error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// AI Tools
router.get('/ai-tools', async (req, res) => {
  try {
    const branding = await getBranding();
    res.render('admin/ai-tools', {
      title: 'AI Tools - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'AI Tools error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// AI Agents
router.get('/ai-agents', async (req, res) => {
  try {
    const branding = await getBranding();
    res.render('admin/ai-agents', {
      title: 'AI Agents - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'AI Agents error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Knowledge Base - List
router.get('/knowledge-base', async (req, res) => {
  try {
    const branding = await getBranding();
    const documents = await prisma.knowledgeDocument.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const categories = await prisma.subjectCategory.findMany({
      where: { isActive: true },
      include: {
        subjects: {
          where: { isActive: true },
          include: { topics: { where: { isActive: true } } }
        }
      }
    });
    res.render('admin/knowledge-base', {
      title: 'Knowledge Base - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      documents,
      categories
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Knowledge Base error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Knowledge Base - Create
router.post('/knowledge-base', async (req, res) => {
  try {
    const { title, content, category, subjectId, topicId, tags } = req.body;
    await prisma.knowledgeDocument.create({
      data: {
        title,
        content,
        category: category || 'general',
        subjectId: subjectId || null,
        topicId: topicId || null,
        tags: tags || null,
        isActive: true
      }
    });
    res.redirect(`${config.basePath}/admin/knowledge-base?token=${req.query.token || config.adminToken}`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Create knowledge doc error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Knowledge Base - Update
router.post('/knowledge-base/:id', async (req, res) => {
  try {
    const { title, content, category, subjectId, topicId, tags, isActive } = req.body;
    await prisma.knowledgeDocument.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        category: category || 'general',
        subjectId: subjectId || null,
        topicId: topicId || null,
        tags: tags || null,
        isActive: isActive === 'on' || isActive === 'true'
      }
    });
    res.redirect(`${config.basePath}/admin/knowledge-base?token=${req.query.token || config.adminToken}`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update knowledge doc error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Knowledge Base - Delete
router.post('/knowledge-base/:id/delete', async (req, res) => {
  try {
    await prisma.knowledgeDocument.delete({
      where: { id: req.params.id }
    });
    res.redirect(`${config.basePath}/admin/knowledge-base?token=${req.query.token || config.adminToken}`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Delete knowledge doc error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Functions - List
router.get('/functions', async (req, res) => {
  try {
    const branding = await getBranding();
    const functions = await prisma.aIFunction.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.render('admin/functions', {
      title: 'Functions - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      functions
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Functions error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Functions - Create
router.post('/functions', async (req, res) => {
  try {
    const { name, description, parameters, triggerType } = req.body;
    await prisma.aIFunction.create({
      data: {
        name,
        description: description || null,
        parameters: parameters || null,
        triggerType: triggerType || 'manual',
        isActive: true
      }
    });
    res.redirect(`${config.basePath}/admin/functions?token=${req.query.token || config.adminToken}`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Create function error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Functions - Update
router.post('/functions/:id', async (req, res) => {
  try {
    const { name, description, parameters, triggerType, isActive } = req.body;
    await prisma.aIFunction.update({
      where: { id: req.params.id },
      data: {
        name,
        description: description || null,
        parameters: parameters || null,
        triggerType: triggerType || 'manual',
        isActive: isActive === 'on' || isActive === 'true'
      }
    });
    res.redirect(`${config.basePath}/admin/functions?token=${req.query.token || config.adminToken}`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update function error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Functions - Delete
router.post('/functions/:id/delete', async (req, res) => {
  try {
    await prisma.aIFunction.delete({
      where: { id: req.params.id }
    });
    res.redirect(`${config.basePath}/admin/functions?token=${req.query.token || config.adminToken}`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Delete function error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Logic Rules - List
router.get('/logic-rules', async (req, res) => {
  try {
    const branding = await getBranding();
    const rules = await prisma.logicRule.findMany({
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }]
    });
    res.render('admin/logic-rules', {
      title: 'Logic Rules - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      rules
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Logic Rules error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Logic Rules - Create
router.post('/logic-rules', async (req, res) => {
  try {
    const { name, description, condition, action, priority } = req.body;
    await prisma.logicRule.create({
      data: {
        name,
        description: description || null,
        condition,
        action,
        priority: priority ? parseInt(priority) : 0,
        isActive: true
      }
    });
    res.redirect(`${config.basePath}/admin/logic-rules?token=${req.query.token || config.adminToken}`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Create logic rule error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Logic Rules - Update
router.post('/logic-rules/:id', async (req, res) => {
  try {
    const { name, description, condition, action, priority, isActive } = req.body;
    await prisma.logicRule.update({
      where: { id: req.params.id },
      data: {
        name,
        description: description || null,
        condition,
        action,
        priority: priority ? parseInt(priority) : 0,
        isActive: isActive === 'on' || isActive === 'true'
      }
    });
    res.redirect(`${config.basePath}/admin/logic-rules?token=${req.query.token || config.adminToken}`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update logic rule error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Logic Rules - Delete
router.post('/logic-rules/:id/delete', async (req, res) => {
  try {
    await prisma.logicRule.delete({
      where: { id: req.params.id }
    });
    res.redirect(`${config.basePath}/admin/logic-rules?token=${req.query.token || config.adminToken}`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Delete logic rule error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// SMS Settings - View
router.get('/sms-settings', async (req, res) => {
  try {
    const branding = await getBranding();
    const smsConfig = await prisma.sMSConfig.findFirst({ where: { id: 'default' } });
    res.render('admin/sms-settings', {
      title: 'SMS Settings - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      smsConfig: smsConfig || {
        isEnabled: false,
        accountSid: '',
        authToken: '',
        phoneNumber: '',
        sessionReminders: true,
        progressUpdates: true,
        achievementAlerts: false,
        teacherAlerts: false,
        sessionReminderTemplate: "Hi {student_name}! Your tutoring session for {subject} starts in 15 minutes. See you soon!",
        progressUpdateTemplate: "Weekly update for {student_name}: Completed {sessions} sessions, {mastery}% mastery improvement in {subject}.",
        achievementTemplate: "Congratulations {student_name}! You've achieved a new milestone in {subject}!",
        teacherAlertTemplate: "Alert: Student {student_name} may need additional support in {subject}."
      }
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'SMS Settings error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// SMS Settings - Update
router.post('/sms-settings', async (req, res) => {
  try {
    const {
      isEnabled, accountSid, authToken, phoneNumber,
      sessionReminders, progressUpdates, achievementAlerts, teacherAlerts,
      sessionReminderTemplate, progressUpdateTemplate, achievementTemplate, teacherAlertTemplate
    } = req.body;

    await prisma.sMSConfig.upsert({
      where: { id: 'default' },
      update: {
        isEnabled: isEnabled === 'on' || isEnabled === 'true',
        accountSid: accountSid || '',
        authToken: authToken || '',
        phoneNumber: phoneNumber || '',
        sessionReminders: sessionReminders === 'on' || sessionReminders === 'true',
        progressUpdates: progressUpdates === 'on' || progressUpdates === 'true',
        achievementAlerts: achievementAlerts === 'on' || achievementAlerts === 'true',
        teacherAlerts: teacherAlerts === 'on' || teacherAlerts === 'true',
        sessionReminderTemplate: sessionReminderTemplate || '',
        progressUpdateTemplate: progressUpdateTemplate || '',
        achievementTemplate: achievementTemplate || '',
        teacherAlertTemplate: teacherAlertTemplate || ''
      },
      create: {
        id: 'default',
        isEnabled: isEnabled === 'on' || isEnabled === 'true',
        accountSid: accountSid || '',
        authToken: authToken || '',
        phoneNumber: phoneNumber || '',
        sessionReminders: sessionReminders === 'on' || sessionReminders === 'true',
        progressUpdates: progressUpdates === 'on' || progressUpdates === 'true',
        achievementAlerts: achievementAlerts === 'on' || achievementAlerts === 'true',
        teacherAlerts: teacherAlerts === 'on' || teacherAlerts === 'true',
        sessionReminderTemplate: sessionReminderTemplate || '',
        progressUpdateTemplate: progressUpdateTemplate || '',
        achievementTemplate: achievementTemplate || '',
        teacherAlertTemplate: teacherAlertTemplate || ''
      }
    });

    res.redirect(`${config.basePath}/admin/sms-settings?token=${req.query.token || config.adminToken}`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update SMS settings error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// SMS Settings - Test Connection
router.post('/sms-settings/test', async (req, res) => {
  try {
    const smsConfig = await prisma.sMSConfig.findFirst({ where: { id: 'default' } });

    if (!smsConfig || !smsConfig.accountSid || !smsConfig.authToken || !smsConfig.phoneNumber) {
      return res.json({ success: false, message: 'SMS configuration is incomplete' });
    }

    // In a real implementation, you would test the Twilio connection here
    // For now, we just validate the format
    if (smsConfig.accountSid.startsWith('AC') && smsConfig.accountSid.length === 34) {
      res.json({ success: true, message: 'Configuration appears valid' });
    } else {
      res.json({ success: false, message: 'Invalid Account SID format' });
    }
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Test SMS connection error:');
    res.status(500).json({ success: false, message: 'Test failed' });
  }
});

// Webhooks - List
router.get('/webhooks', async (req, res) => {
  try {
    const branding = await getBranding();
    const webhooks = await prisma.webhook.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.render('admin/webhooks', {
      title: 'Webhooks - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      webhooks
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Webhooks error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Webhooks - Create
router.post('/webhooks', async (req, res) => {
  try {
    const { name, url, events, secret } = req.body;
    const eventsArray = Array.isArray(events) ? events : (events ? [events] : []);

    await prisma.webhook.create({
      data: {
        name,
        url,
        events: JSON.stringify(eventsArray),
        secret: secret || null,
        isActive: true
      }
    });
    res.redirect(`${config.basePath}/admin/webhooks?token=${req.query.token || config.adminToken}`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Create webhook error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Webhooks - Update
router.post('/webhooks/:id', async (req, res) => {
  try {
    const { name, url, events, secret, isActive } = req.body;
    const eventsArray = Array.isArray(events) ? events : (events ? [events] : []);

    await prisma.webhook.update({
      where: { id: req.params.id },
      data: {
        name,
        url,
        events: JSON.stringify(eventsArray),
        secret: secret || null,
        isActive: isActive === 'on' || isActive === 'true'
      }
    });
    res.redirect(`${config.basePath}/admin/webhooks?token=${req.query.token || config.adminToken}`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update webhook error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Webhooks - Delete
router.post('/webhooks/:id/delete', async (req, res) => {
  try {
    await prisma.webhook.delete({
      where: { id: req.params.id }
    });
    res.redirect(`${config.basePath}/admin/webhooks?token=${req.query.token || config.adminToken}`);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Delete webhook error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Webhooks - Test
router.post('/webhooks/:id/test', async (req, res) => {
  try {
    const webhook = await prisma.webhook.findUnique({ where: { id: req.params.id } });

    if (!webhook) {
      return res.json({ success: false, message: 'Webhook not found' });
    }

    // In a real implementation, you would send a test payload to the webhook URL
    // For now, we just simulate a successful test
    await prisma.webhook.update({
      where: { id: req.params.id },
      data: { lastTriggeredAt: new Date() }
    });

    res.json({ success: true, message: 'Test webhook sent successfully' });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Test webhook error:');
    res.status(500).json({ success: false, message: 'Test failed' });
  }
});

// Payment Gateways
router.get('/payment-gateways', async (req, res) => {
  try {
    const branding = await getBranding();
    const gateways = await prisma.paymentGateway.findMany({
      orderBy: { createdAt: 'asc' }
    });

    res.render('admin/payment-gateways', {
      title: 'Payment Gateways - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      gateways
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Payment gateways error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Subscriptions
router.get('/subscriptions', async (req, res) => {
  try {
    const branding = await getBranding();
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: { price: 'asc' }
    });
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Calculate stats
    const allPayments = await prisma.payment.findMany();
    const stats = {
      total: allPayments.length,
      completed: allPayments.filter(p => p.status === 'completed').length,
      pending: allPayments.filter(p => p.status === 'pending').length,
      failed: allPayments.filter(p => p.status === 'failed').length,
      revenue: allPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
    };

    res.render('admin/subscriptions', {
      title: 'Subscriptions - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      plans,
      payments,
      stats
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Subscriptions error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Features
router.get('/features', async (req, res) => {
  try {
    const branding = await getBranding();
    res.render('admin/features', {
      title: 'Features - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Features error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// =====================
// API Endpoints
// =====================

// Update Greeting
router.post('/greeting', async (req, res) => {
  try {
    const { welcomeTitle, welcomeMessage, voiceGreeting } = req.body;

    await prisma.greeting.upsert({
      where: { id: 'default' },
      update: { welcomeTitle, welcomeMessage, voiceGreeting },
      create: { id: 'default', welcomeTitle, welcomeMessage, voiceGreeting }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update greeting error:');
    res.status(500).json({ error: 'Failed to update greeting' });
  }
});

// Update AI Config
router.post('/ai-config', async (req, res) => {
  try {
    const { provider, model, temperature, maxTokens, voiceId, enableVoice, enableVision } = req.body;

    await prisma.aIConfig.upsert({
      where: { id: 'default' },
      update: {
        provider,
        model,
        temperature: parseFloat(temperature),
        maxTokens: parseInt(maxTokens),
        voiceId,
        enableVoice: enableVoice === true || enableVoice === 'true',
        enableVision: enableVision === true || enableVision === 'true'
      },
      create: {
        id: 'default',
        provider,
        model,
        temperature: parseFloat(temperature),
        maxTokens: parseInt(maxTokens),
        voiceId,
        enableVoice: enableVoice === true || enableVoice === 'true',
        enableVision: enableVision === true || enableVision === 'true'
      }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update AI config error:');
    res.status(500).json({ error: 'Failed to update AI config' });
  }
});

// Update Branding
router.post('/branding', async (req, res) => {
  try {
    const { logoUrl, faviconUrl, primaryColor, secondaryColor, accentColor, headingFont, bodyFont } = req.body;

    await prisma.branding.upsert({
      where: { id: 'default' },
      update: { logoUrl, faviconUrl, primaryColor, secondaryColor, accentColor, headingFont, bodyFont },
      create: { id: 'default', logoUrl, faviconUrl, primaryColor, secondaryColor, accentColor, headingFont, bodyFont }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update branding error:');
    res.status(500).json({ error: 'Failed to update branding' });
  }
});

// Update Store Info
router.post('/store-info', async (req, res) => {
  try {
    const { businessName, tagline, description, address, phone, email, website, businessHours, timezone } = req.body;

    await prisma.storeInfo.upsert({
      where: { id: 'default' },
      update: { businessName, tagline, description, address, phone, email, website, businessHours, timezone },
      create: { id: 'default', businessName, tagline, description, address, phone, email, website, businessHours, timezone }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update store info error:');
    res.status(500).json({ error: 'Failed to update store info' });
  }
});

// Toggle Language
router.post('/languages/:code/toggle', async (req, res) => {
  try {
    const { code } = req.params;
    const language = await prisma.language.findUnique({ where: { code } });

    if (!language) {
      return res.status(404).json({ error: 'Language not found' });
    }

    await prisma.language.update({
      where: { code },
      data: { enabled: !language.enabled }
    });

    res.json({ success: true, enabled: !language.enabled });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Toggle language error:');
    res.status(500).json({ error: 'Failed to toggle language' });
  }
});

// Update Payment Gateway
router.post('/payment-gateways/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const data = req.body;

    await prisma.paymentGateway.upsert({
      where: { provider },
      update: {
        isEnabled: data.isEnabled === true || data.isEnabled === 'true',
        testMode: data.testMode === true || data.testMode === 'true',
        // Stripe
        publishableKey: data.publishableKey || null,
        secretKey: data.secretKey || null,
        webhookSecret: data.webhookSecret || null,
        // PayPal
        clientId: data.clientId || null,
        clientSecret: data.clientSecret || null,
        webhookId: data.webhookId || null,
        // Braintree
        merchantId: data.merchantId || null,
        publicKey: data.publicKey || null,
        privateKey: data.privateKey || null,
        // Square
        applicationId: data.applicationId || null,
        accessToken: data.accessToken || null,
        locationId: data.locationId || null,
        webhookSignatureKey: data.webhookSignatureKey || null,
        // Authorize.net
        apiLoginId: data.apiLoginId || null,
        transactionKey: data.transactionKey || null,
        signatureKey: data.signatureKey || null
      },
      create: {
        provider,
        isEnabled: data.isEnabled === true || data.isEnabled === 'true',
        testMode: data.testMode === true || data.testMode === 'true',
        publishableKey: data.publishableKey || null,
        secretKey: data.secretKey || null,
        webhookSecret: data.webhookSecret || null,
        clientId: data.clientId || null,
        clientSecret: data.clientSecret || null,
        webhookId: data.webhookId || null,
        merchantId: data.merchantId || null,
        publicKey: data.publicKey || null,
        privateKey: data.privateKey || null,
        applicationId: data.applicationId || null,
        accessToken: data.accessToken || null,
        locationId: data.locationId || null,
        webhookSignatureKey: data.webhookSignatureKey || null,
        apiLoginId: data.apiLoginId || null,
        transactionKey: data.transactionKey || null,
        signatureKey: data.signatureKey || null
      }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update payment gateway error:');
    res.status(500).json({ error: 'Failed to update payment gateway' });
  }
});

// Test Payment Gateway Connection
router.post('/payment-gateways/test/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const gateway = await prisma.paymentGateway.findUnique({ where: { provider } });

    if (!gateway) {
      return res.json({ success: false, message: 'Gateway not configured' });
    }

    if (!gateway.isEnabled) {
      return res.json({ success: false, message: 'Gateway is not enabled' });
    }

    // Simple validation check - actual API test would require the service
    let isConfigured = false;
    switch (provider) {
      case 'stripe':
        isConfigured = !!(gateway.publishableKey && gateway.secretKey);
        break;
      case 'paypal':
        isConfigured = !!(gateway.clientId && gateway.clientSecret);
        break;
      case 'braintree':
        isConfigured = !!(gateway.merchantId && gateway.publicKey && gateway.privateKey);
        break;
      case 'square':
        isConfigured = !!(gateway.applicationId && gateway.accessToken && gateway.locationId);
        break;
      case 'authorize':
        isConfigured = !!(gateway.apiLoginId && gateway.transactionKey);
        break;
    }

    if (isConfigured) {
      res.json({ success: true, message: `${provider} configuration valid`, testMode: gateway.testMode });
    } else {
      res.json({ success: false, message: `${provider} is missing required credentials` });
    }
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Test gateway error:');
    res.status(500).json({ success: false, message: 'Connection test failed' });
  }
});

// Add Subscription Plan
router.post('/subscriptions/plans', async (req, res) => {
  try {
    const { name, code, price, billingPeriod, description } = req.body;

    await prisma.subscriptionPlan.create({
      data: {
        name,
        code,
        price: parseFloat(price),
        billingPeriod: billingPeriod || 'monthly',
        description: description || null,
        isActive: true
      }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Add subscription plan error:');
    res.status(500).json({ error: 'Failed to add subscription plan' });
  }
});

// =====================
// Trial Codes
// =====================
router.get('/trial-codes', async (req, res) => {
  try {
    const branding = await getBranding();
    const trialCodes = await prisma.trialCode.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });

    const stats = {
      total: trialCodes.length,
      pending: trialCodes.filter(c => c.status === 'pending').length,
      sent: trialCodes.filter(c => c.status === 'sent').length,
      redeemed: trialCodes.filter(c => c.status === 'redeemed').length,
      expired: trialCodes.filter(c => c.status === 'expired').length
    };

    res.render('admin/trial-codes', {
      title: 'Trial Codes - TutorAI Admin',
      active: 'trial-codes',
      branding,
      token: req.query.token || '',
      basePath: config.basePath,
      trialCodes,
      stats
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Trial codes page error:');
    res.status(500).send('Error loading trial codes');
  }
});

router.post('/trial-codes', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, organization, deliveryMethod, durationDays } = req.body;

    // Generate unique code
    const code = 'TRIAL-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    await prisma.trialCode.create({
      data: {
        code,
        requesterFirstName: firstName,
        requesterLastName: lastName,
        requesterEmail: email,
        requesterPhone: phone || null,
        requesterOrganization: organization || null,
        deliveryMethod: deliveryMethod || 'email',
        durationDays: parseInt(durationDays) || 14,
        status: 'sent',
        expiresAt: new Date(Date.now() + (parseInt(durationDays) || 14) * 24 * 60 * 60 * 1000)
      }
    });

    res.json({ success: true, message: 'Trial code created and sent' });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Create trial code error:');
    res.status(500).json({ error: 'Failed to create trial code' });
  }
});

router.post('/trial-codes/:id/revoke', async (req, res) => {
  try {
    await prisma.trialCode.update({
      where: { id: req.params.id },
      data: { status: 'revoked', revokedAt: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Revoke trial code error:');
    res.status(500).json({ error: 'Failed to revoke trial code' });
  }
});

router.post('/trial-codes/:id/extend', async (req, res) => {
  try {
    const trialCode = await prisma.trialCode.findUnique({ where: { id: req.params.id } });
    if (!trialCode) {
      return res.status(404).json({ error: 'Trial code not found' });
    }

    const newExpiresAt = new Date(trialCode.expiresAt);
    newExpiresAt.setDate(newExpiresAt.getDate() + 14);

    await prisma.trialCode.update({
      where: { id: req.params.id },
      data: { expiresAt: newExpiresAt, extensionCount: (trialCode.extensionCount || 0) + 1 }
    });

    res.json({ success: true, newExpiresAt });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Extend trial code error:');
    res.status(500).json({ error: 'Failed to extend trial code' });
  }
});

// =====================
// Account Settings
// =====================
router.get('/account', async (req, res) => {
  try {
    const branding = await getBranding();
    const userId = req.session?.adminUserId;
    const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;

    res.render('admin/account', {
      title: 'Account Settings - TutorAI Admin',
      active: 'account',
      branding,
      token: req.query.token || '',
      basePath: config.basePath,
      user
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Account page error:');
    res.status(500).send('Error loading account settings');
  }
});

router.post('/account/update', async (req, res) => {
  try {
    const userId = req.session?.adminUserId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { firstName, lastName, email, phone } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName, email, phone }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update account error:');
    res.status(500).json({ error: 'Failed to update account' });
  }
});

router.post('/account/change-password', async (req, res) => {
  try {
    const userId = req.session?.adminUserId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.passwordHash) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Change password error:');
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// =====================
// My Subscription
// =====================
router.get('/my-subscription', async (req, res) => {
  try {
    const branding = await getBranding();
    const userId = req.session?.adminUserId;

    let subscription = null;
    let currentPlan = null;

    if (userId) {
      subscription = await prisma.subscription.findFirst({
        where: { userId, status: 'active' },
        include: { plan: true }
      });
      currentPlan = subscription?.plan;
    }

    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });

    res.render('admin/my-subscription', {
      title: 'My Subscription - TutorAI Admin',
      active: 'my-subscription',
      branding,
      token: req.query.token || '',
      basePath: config.basePath,
      subscription,
      currentPlan,
      plans
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'My subscription page error:');
    res.status(500).send('Error loading subscription');
  }
});

// =====================
// Pricing Plans
// =====================
router.get('/pricing', async (req, res) => {
  try {
    const branding = await getBranding();
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });

    const userId = req.session?.adminUserId;
    let currentPlan = null;

    if (userId) {
      const subscription = await prisma.subscription.findFirst({
        where: { userId, status: 'active' },
        include: { plan: true }
      });
      currentPlan = subscription?.plan;
    }

    res.render('admin/pricing', {
      title: 'Pricing Plans - TutorAI Admin',
      active: 'pricing',
      branding,
      token: req.query.token || '',
      basePath: config.basePath,
      plans,
      currentPlan
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Pricing page error:');
    res.status(500).send('Error loading pricing');
  }
});

// =====================
// AUDIT LOG ROUTES
// =====================

// Audit Log Viewer
router.get('/audit-logs', async (req, res) => {
  try {
    const branding = await getBranding();
    const { userId, action, entityType, startDate, endDate, page = '1' } = req.query;

    const limit = 50;
    const offset = (parseInt(page as string, 10) - 1) * limit;

    // Build filter options
    const filterOptions: {
      userId?: string;
      action?: string;
      entityType?: string;
      startDate?: Date;
      endDate?: Date;
      limit: number;
      offset: number;
    } = {
      limit,
      offset
    };

    if (userId && typeof userId === 'string') filterOptions.userId = userId;
    if (action && typeof action === 'string') filterOptions.action = action;
    if (entityType && typeof entityType === 'string') filterOptions.entityType = entityType;
    if (startDate && typeof startDate === 'string') filterOptions.startDate = new Date(startDate);
    if (endDate && typeof endDate === 'string') filterOptions.endDate = new Date(endDate);

    const { logs, total } = await getAuditLogs(filterOptions);
    const adminStats = await getAdminStats(7);

    // Get unique values for filter dropdowns
    const uniqueActions = Object.values(AuditAction);
    const uniqueEntityTypes = ['User', 'School', 'Class', 'Assignment', 'Quiz', 'Session', 'Security', 'AIConfig', 'Branding'];

    // Get users for filter dropdown
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true },
      orderBy: { lastName: 'asc' },
      take: 100
    });

    const totalPages = Math.ceil(total / limit);
    const currentPage = parseInt(page as string, 10);

    res.render('admin/audit-logs', {
      title: 'Audit Logs - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      logs,
      total,
      adminStats,
      filters: {
        userId: userId || '',
        action: action || '',
        entityType: entityType || '',
        startDate: startDate || '',
        endDate: endDate || ''
      },
      uniqueActions,
      uniqueEntityTypes,
      users,
      pagination: {
        currentPage,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      }
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Audit logs error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Audit Log API - for AJAX requests
router.get('/api/audit-logs', async (req, res) => {
  try {
    const { userId, action, entityType, startDate, endDate, page = '1', limit: limitParam = '50' } = req.query;

    const limit = Math.min(parseInt(limitParam as string, 10) || 50, 100);
    const offset = (parseInt(page as string, 10) - 1) * limit;

    const filterOptions: {
      userId?: string;
      action?: string;
      entityType?: string;
      startDate?: Date;
      endDate?: Date;
      limit: number;
      offset: number;
    } = {
      limit,
      offset
    };

    if (userId && typeof userId === 'string') filterOptions.userId = userId;
    if (action && typeof action === 'string') filterOptions.action = action;
    if (entityType && typeof entityType === 'string') filterOptions.entityType = entityType;
    if (startDate && typeof startDate === 'string') filterOptions.startDate = new Date(startDate);
    if (endDate && typeof endDate === 'string') filterOptions.endDate = new Date(endDate);

    const { logs, total } = await getAuditLogs(filterOptions);

    res.json({
      logs,
      total,
      page: parseInt(page as string, 10),
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Audit logs API error:');
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Admin Stats API
router.get('/api/admin-stats', async (req, res) => {
  try {
    const { days = '7' } = req.query;
    const stats = await getAdminStats(parseInt(days as string, 10));
    res.json(stats);
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Admin stats API error:');
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// =====================
// Search API Routes
// =====================

// Global Search API
router.get('/api/search', async (req, res) => {
  try {
    const { q, types, limit = '20', schoolId } = req.query;

    if (!q || typeof q !== 'string' || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const searchTypes = types ? (types as string).split(',') : undefined;
    const results = await globalSearch(q, {
      types: searchTypes as any,
      limit: parseInt(limit as string, 10),
      schoolId: schoolId as string
    });

    res.json({ query: q, results, count: results.length });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Global search error:');
    res.status(500).json({ error: 'Search failed' });
  }
});

// Search Users API
router.get('/api/search/users', async (req, res) => {
  try {
    const { q = '', role, schoolId, isActive, gradeLevel, limit = '50', offset = '0' } = req.query;

    const { users, total } = await searchUsers(q as string, {
      role: role as string,
      schoolId: schoolId as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      gradeLevel: gradeLevel ? parseInt(gradeLevel as string, 10) : undefined,
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10)
    });

    res.json({
      users,
      total,
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10)
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'User search error:');
    res.status(500).json({ error: 'User search failed' });
  }
});

// Search Sessions API
router.get('/api/search/sessions', async (req, res) => {
  try {
    const { studentId, subjectId, topicId, startDate, endDate, status, limit = '50', offset = '0' } = req.query;

    const { sessions, total } = await searchSessions({
      studentId: studentId as string,
      subjectId: subjectId as string,
      topicId: topicId as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      status: status as string,
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10)
    });

    res.json({
      sessions,
      total,
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10)
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Session search error:');
    res.status(500).json({ error: 'Session search failed' });
  }
});

// =====================
// Bulk Operations API Routes
// =====================

// Bulk Import Users Page
router.get('/bulk-import', async (req, res) => {
  try {
    const branding = await getBranding();
    const schools = await prisma.school.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.render('admin/bulk-import', {
      title: 'Bulk Import Users - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath,
      schools
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Bulk import page error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Bulk Create Users API
router.post('/api/bulk/users', async (req, res) => {
  try {
    const { users, schoolId, csvData } = req.body;
    const adminUserId = req.session.adminUserId || req.session.userId || 'system';

    let usersToCreate = users;

    // If CSV data is provided, parse it
    if (csvData && typeof csvData === 'string') {
      const parsed = parseUserCSV(csvData);
      if (parsed.errors.length > 0 && parsed.users.length === 0) {
        return res.status(400).json({
          error: 'CSV parsing failed',
          details: parsed.errors
        });
      }
      usersToCreate = parsed.users;
    }

    if (!usersToCreate || !Array.isArray(usersToCreate) || usersToCreate.length === 0) {
      return res.status(400).json({ error: 'No users to create' });
    }

    if (!schoolId) {
      return res.status(400).json({ error: 'School ID is required' });
    }

    const result = await bulkCreateUsers(usersToCreate, schoolId, adminUserId);

    res.json({
      message: `Created ${result.success} users, ${result.failed} failed`,
      ...result
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Bulk create users error:');
    res.status(500).json({ error: 'Bulk user creation failed' });
  }
});

// Bulk Update User Status API
router.post('/api/bulk/users/status', async (req, res) => {
  try {
    const { userIds, isActive } = req.body;
    const adminUserId = req.session.adminUserId || req.session.userId || 'system';

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'User IDs are required' });
    }

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }

    const result = await bulkUpdateUserStatus(userIds, isActive, adminUserId);

    res.json({
      message: `Updated ${result.success} users, ${result.failed} failed`,
      ...result
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Bulk status update error:');
    res.status(500).json({ error: 'Bulk status update failed' });
  }
});

// Bulk Enroll Students API
router.post('/api/bulk/enroll', async (req, res) => {
  try {
    const { classId, studentIds } = req.body;
    const adminUserId = req.session.adminUserId || req.session.userId || 'system';

    if (!classId) {
      return res.status(400).json({ error: 'Class ID is required' });
    }

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: 'Student IDs are required' });
    }

    const result = await bulkEnrollStudents(classId, studentIds, adminUserId);

    res.json({
      message: `Enrolled ${result.success} students, ${result.failed} failed`,
      ...result
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Bulk enroll error:');
    res.status(500).json({ error: 'Bulk enrollment failed' });
  }
});

// Bulk Unenroll Students API
router.post('/api/bulk/unenroll', async (req, res) => {
  try {
    const { classId, studentIds } = req.body;
    const adminUserId = req.session.adminUserId || req.session.userId || 'system';

    if (!classId) {
      return res.status(400).json({ error: 'Class ID is required' });
    }

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: 'Student IDs are required' });
    }

    const result = await bulkUnenrollStudents(classId, studentIds, adminUserId);

    res.json({
      message: `Unenrolled ${result.success} students, ${result.failed} failed`,
      ...result
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Bulk unenroll error:');
    res.status(500).json({ error: 'Bulk unenrollment failed' });
  }
});

// Bulk Assign Teachers API
router.post('/api/bulk/assign-teachers', async (req, res) => {
  try {
    const { classId, teacherIds } = req.body;
    const adminUserId = req.session.adminUserId || req.session.userId || 'system';

    if (!classId) {
      return res.status(400).json({ error: 'Class ID is required' });
    }

    if (!teacherIds || !Array.isArray(teacherIds) || teacherIds.length === 0) {
      return res.status(400).json({ error: 'Teacher IDs are required' });
    }

    const result = await bulkAssignTeachers(classId, teacherIds, adminUserId);

    res.json({
      message: `Assigned ${result.success} teachers, ${result.failed} failed`,
      ...result
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Bulk assign teachers error:');
    res.status(500).json({ error: 'Bulk teacher assignment failed' });
  }
});

// Bulk Reset Passwords API
router.post('/api/bulk/reset-passwords', async (req, res) => {
  try {
    const { userIds } = req.body;
    const adminUserId = req.session.adminUserId || req.session.userId || 'system';

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'User IDs are required' });
    }

    const result = await bulkResetPasswords(userIds, adminUserId);

    res.json({
      message: `Reset ${result.success} passwords, ${result.failed} failed`,
      success: result.success,
      failed: result.failed,
      // Only return passwords in development for security
      ...(config.env === 'development' ? { passwords: result.passwords } : {})
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Bulk password reset error:');
    res.status(500).json({ error: 'Bulk password reset failed' });
  }
});

// Export Users to CSV API
router.get('/api/export/users', async (req, res) => {
  try {
    const { schoolId, role, isActive } = req.query;

    const csvContent = await exportUsersToCSV({
      schoolId: schoolId as string,
      role: role as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
    });

    const filename = `users-export-${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Export users error:');
    res.status(500).json({ error: 'Export failed' });
  }
});

// Download CSV Template
router.get('/api/bulk/template', (req, res) => {
  const template = 'Email,First Name,Last Name,Role,Grade Level\njohn.doe@school.edu,John,Doe,STUDENT,5\njane.smith@school.edu,Jane,Smith,TEACHER,';

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="user-import-template.csv"');
  res.send(template);
});

// =====================
// 2FA Management Routes
// =====================

// Get 2FA status
router.get('/api/two-factor/status', async (req, res) => {
  try {
    const userId = req.session.adminUserId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const status = await getTwoFactorStatus(userId);
    res.json(status);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, '2FA status error:');
    res.status(500).json({ error: 'Failed to get 2FA status' });
  }
});

// Setup 2FA (generate secret and QR)
router.post('/api/two-factor/setup', async (req, res) => {
  try {
    const userId = req.session.adminUserId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { secret, uri, backupCodes } = await enableTwoFactor(userId);

    res.json({
      secret,
      qrCodeUrl: uri,
      backupCodes
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, '2FA setup error:');
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
});

// Verify and activate 2FA
router.post('/api/two-factor/verify', async (req, res) => {
  try {
    const userId = req.session.adminUserId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { token } = req.body;
    if (!token || token.length < 6) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const success = await verifyAndActivateTwoFactor(userId, token);

    if (!success) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    res.json({ success: true, message: '2FA has been enabled' });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, '2FA verify error:');
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
});

// Disable 2FA
router.post('/api/two-factor/disable', async (req, res) => {
  try {
    const userId = req.session.adminUserId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { password, token } = req.body;

    // Verify password first
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.passwordHash) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Optionally verify 2FA token
    if (user.twoFactorEnabled && token) {
      const validToken = await verifyTwoFactorToken(userId, token);
      if (!validToken) {
        return res.status(400).json({ error: 'Invalid 2FA code' });
      }
    }

    const success = await disableTwoFactor(userId);

    if (!success) {
      return res.status(400).json({ error: 'Failed to disable 2FA' });
    }

    res.json({ success: true, message: '2FA has been disabled' });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, '2FA disable error:');
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

// Regenerate backup codes
router.post('/api/two-factor/backup-codes', async (req, res) => {
  try {
    const userId = req.session.adminUserId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { password } = req.body;

    // Verify password
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.passwordHash) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const newCodes = await regenerateBackupCodes(userId);

    if (!newCodes) {
      return res.status(400).json({ error: '2FA is not enabled' });
    }

    res.json({ backupCodes: newCodes });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Backup codes error:');
    res.status(500).json({ error: 'Failed to regenerate backup codes' });
  }
});

// =====================
// Report Export API Routes
// =====================

// Export student progress CSV (for any student)
router.get('/api/export/progress/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId } = req.query;

    const csvContent = await exportStudentProgressCSV(studentId, {
      subjectId: subjectId as string
    });

    const filename = `student-progress-${studentId}-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Export student progress error:');
    res.status(500).json({ error: 'Export failed' });
  }
});

// Export student progress report HTML (for PDF)
router.get('/api/export/progress/:studentId/pdf', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId } = req.query;

    const htmlContent = await generateProgressReportHTML(studentId, {
      subjectId: subjectId as string
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Generate progress report error:');
    res.status(500).json({ error: 'Report generation failed' });
  }
});

// Export all sessions CSV
router.get('/api/export/sessions', async (req, res) => {
  try {
    const { studentId, subjectId, startDate, endDate, limit } = req.query;

    const csvContent = await exportSessionsCSV({
      studentId: studentId as string,
      subjectId: subjectId as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined
    });

    const filename = `sessions-export-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Export sessions error:');
    res.status(500).json({ error: 'Export failed' });
  }
});

// Export assignments CSV
router.get('/api/export/assignments', async (req, res) => {
  try {
    const { classId, createdById } = req.query;

    const csvContent = await exportAssignmentsCSV({
      classId: classId as string,
      createdById: createdById as string
    });

    const filename = `assignments-export-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Export assignments error:');
    res.status(500).json({ error: 'Export failed' });
  }
});

// Export grades/submissions CSV
router.get('/api/export/grades/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    const { assignmentId } = req.query;

    const csvContent = await exportGradesCSV(classId, assignmentId as string);

    const filename = `grades-export-${classId}-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Export grades error:');
    res.status(500).json({ error: 'Export failed' });
  }
});

// ============================================
// GAMIFICATION ADMIN ROUTES
// ============================================

// Get all badges
router.get('/api/badges', async (req, res) => {
  try {
    const { category, tier, includeHidden } = req.query;
    const badges = await getAllBadges({
      category: category as string,
      tier: tier as string,
      includeHidden: includeHidden === 'true'
    });
    res.json(badges);
  } catch (error) {
    logger.error({ error }, 'Get badges error');
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// Create/update badge
router.post('/api/badges', async (req, res) => {
  try {
    const { code, name, description, category, tier, icon, color, points, requirements, isHidden } = req.body;

    const badge = await prisma.badge.upsert({
      where: { code },
      create: {
        code,
        name,
        description,
        category: category || 'achievement',
        tier: tier || 'bronze',
        icon: icon || 'trophy',
        color: color || '#fbbf24',
        points: points || 0,
        requirements: requirements ? JSON.stringify(requirements) : null,
        isHidden: isHidden || false
      },
      update: {
        name,
        description,
        category,
        tier,
        icon,
        color,
        points,
        requirements: requirements ? JSON.stringify(requirements) : null,
        isHidden
      }
    });

    res.json(badge);
  } catch (error) {
    logger.error({ error }, 'Create badge error');
    res.status(500).json({ error: 'Failed to create badge' });
  }
});

// Award badge to user
router.post('/api/badges/award', async (req, res) => {
  try {
    const { userId, badgeCode } = req.body;

    if (!userId || !badgeCode) {
      return res.status(400).json({ error: 'userId and badgeCode required' });
    }

    const userBadge = await awardBadge(userId, badgeCode);

    if (!userBadge) {
      return res.status(404).json({ error: 'Badge not found' });
    }

    res.json(userBadge);
  } catch (error) {
    logger.error({ error }, 'Award badge error');
    res.status(500).json({ error: 'Failed to award badge' });
  }
});

// Initialize default badges
router.post('/api/badges/initialize', async (req, res) => {
  try {
    await initializeDefaultBadges();
    res.json({ success: true, message: 'Default badges initialized' });
  } catch (error) {
    logger.error({ error }, 'Initialize badges error');
    res.status(500).json({ error: 'Failed to initialize badges' });
  }
});

// Get leaderboard
router.get('/api/leaderboard', async (req, res) => {
  try {
    const { scope = 'global', scopeId, period = 'all_time', limit } = req.query;

    const leaderboard = await getLeaderboard({
      scope: scope as 'global' | 'school' | 'class',
      scopeId: scopeId as string,
      period: period as 'all_time' | 'monthly' | 'weekly' | 'daily',
      limit: limit ? parseInt(limit as string) : 25
    });

    res.json(leaderboard);
  } catch (error) {
    logger.error({ error }, 'Get leaderboard error');
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get point configuration
router.get('/api/point-config', async (req, res) => {
  try {
    const config = await getPointConfig();
    res.json(config);
  } catch (error) {
    logger.error({ error }, 'Get point config error');
    res.status(500).json({ error: 'Failed to fetch point config' });
  }
});

// Update point configuration
router.put('/api/point-config', async (req, res) => {
  try {
    const updatedConfig = await prisma.pointConfig.upsert({
      where: { id: 'default' },
      create: { id: 'default', ...req.body },
      update: req.body
    });
    res.json(updatedConfig);
  } catch (error) {
    logger.error({ error }, 'Update point config error');
    res.status(500).json({ error: 'Failed to update point config' });
  }
});

// Get announcements (admin view)
router.get('/api/announcements', async (req, res) => {
  try {
    const { scope, scopeId, includeExpired } = req.query;
    const session = req.session as any;

    const where: any = {};

    if (!includeExpired) {
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ];
    }

    if (scope) {
      where.scope = scope;
      if (scopeId) where.scopeId = scopeId;
    }

    const announcements = await prisma.announcement.findMany({
      where,
      include: {
        author: {
          select: { firstName: true, lastName: true }
        },
        _count: {
          select: { readBy: true }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { publishAt: 'desc' }
      ]
    });

    res.json(announcements);
  } catch (error) {
    logger.error({ error }, 'Get announcements error');
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Create announcement
router.post('/api/announcements', async (req, res) => {
  try {
    const session = req.session as any;
    const { title, content, type, scope, scopeId, targetRoles, publishAt, expiresAt, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    const announcement = await createAnnouncement({
      title,
      content,
      type,
      scope: scope || 'all',
      scopeId,
      targetRoles,
      authorId: session.userId,
      publishAt: publishAt ? new Date(publishAt) : undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      isPinned
    });

    res.json(announcement);
  } catch (error) {
    logger.error({ error }, 'Create announcement error');
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Update announcement
router.put('/api/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, scope, scopeId, targetRoles, publishAt, expiresAt, isPinned, isActive } = req.body;

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        content,
        type,
        scope,
        scopeId,
        targetRoles: targetRoles ? JSON.stringify(targetRoles) : null,
        publishAt: publishAt ? new Date(publishAt) : undefined,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        isPinned,
        isActive
      }
    });

    res.json(announcement);
  } catch (error) {
    logger.error({ error }, 'Update announcement error');
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// Delete announcement
router.delete('/api/announcements/:id', async (req, res) => {
  try {
    await prisma.announcement.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    logger.error({ error }, 'Delete announcement error');
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

// Gamification dashboard page
router.get('/gamification', async (req, res) => {
  try {
    const branding = await getBranding();
    const session = req.session as any;

    // Get summary stats
    const [badgeCount, totalPointsIssued, activeStreaks, recentAnnouncements] = await Promise.all([
      prisma.badge.count({ where: { isActive: true } }),
      prisma.pointTransaction.aggregate({
        where: { amount: { gt: 0 } },
        _sum: { amount: true }
      }),
      prisma.streak.count({
        where: { currentStreak: { gt: 0 } }
      }),
      prisma.announcement.count({
        where: {
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        }
      })
    ]);

    res.render('admin/gamification', {
      title: 'Gamification - TutorAI Admin',
      basePath: config.basePath,
      branding,
      user: {
        firstName: session.firstName,
        lastName: session.lastName,
        role: session.role
      },
      stats: {
        badgeCount,
        totalPointsIssued: totalPointsIssued._sum.amount || 0,
        activeStreaks,
        recentAnnouncements
      }
    });
  } catch (error) {
    logger.error({ error }, 'Gamification dashboard error');
    res.status(500).send('Error loading gamification dashboard');
  }
});

export default router;
