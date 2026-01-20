// TutorAI Admin Routes
// Admin panel for platform management

import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/database';
import { config } from '../config';
import { requireAuthOrToken, requireMinRole } from '../middleware/auth';
import { LANGUAGES, DEMO_USERS } from '../config/constants';
import { logger } from '../utils/logger';

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

// Knowledge Base
router.get('/knowledge-base', async (req, res) => {
  try {
    const branding = await getBranding();
    res.render('admin/knowledge-base', {
      title: 'Knowledge Base - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Knowledge Base error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Functions
router.get('/functions', async (req, res) => {
  try {
    const branding = await getBranding();
    res.render('admin/functions', {
      title: 'Functions - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Functions error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Logic Rules
router.get('/logic-rules', async (req, res) => {
  try {
    const branding = await getBranding();
    res.render('admin/logic-rules', {
      title: 'Logic Rules - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Logic Rules error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// SMS Settings
router.get('/sms-settings', async (req, res) => {
  try {
    const branding = await getBranding();
    res.render('admin/sms-settings', {
      title: 'SMS Settings - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'SMS Settings error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
  }
});

// Webhooks
router.get('/webhooks', async (req, res) => {
  try {
    const branding = await getBranding();
    res.render('admin/webhooks', {
      title: 'Webhooks - TutorAI Admin',
      branding,
      token: req.query.token || config.adminToken,
      basePath: config.basePath
    });
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Webhooks error:');
    res.status(500).render('errors/500', { basePath: config.basePath, title: 'Error' });
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

export default router;
