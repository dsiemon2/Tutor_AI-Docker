/**
 * COPPA Compliance Routes
 * Handles parental consent verification for children under 13
 */

import { Router } from 'express';
import { prisma } from '../config/database';
import { config } from '../config';
import { logger } from '../utils/logger';
import {
  verifyConsent,
  rejectConsent,
  checkCoppaStatus,
  createConsentRequest,
  revokeConsent
} from '../services/coppa.service';

const router = Router();

// Helper to get branding
async function getBranding() {
  const branding = await prisma.branding.findFirst({ where: { id: 'default' } });
  return branding || {
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    accentColor: '#38bdf8'
  };
}

/**
 * Parental consent verification page
 * GET /coppa/verify?token=xxx
 */
router.get('/verify', async (req, res) => {
  const branding = await getBranding();
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.render('coppa/error', {
      title: 'Invalid Link - TutorAI',
      branding,
      error: 'This link is invalid or missing required information.'
    });
  }

  try {
    // Find consent request
    const consent = await prisma.parentalConsent.findFirst({
      where: { consentToken: token }
    });

    if (!consent) {
      return res.render('coppa/error', {
        title: 'Invalid Link - TutorAI',
        branding,
        error: 'This consent request was not found.'
      });
    }

    if (consent.consentStatus === 'verified') {
      return res.render('coppa/already-verified', {
        title: 'Already Verified - TutorAI',
        branding
      });
    }

    if (consent.consentStatus === 'rejected') {
      return res.render('coppa/rejected', {
        title: 'Consent Declined - TutorAI',
        branding
      });
    }

    if (consent.expiresAt < new Date()) {
      return res.render('coppa/expired', {
        title: 'Link Expired - TutorAI',
        branding
      });
    }

    // Get student info
    const student = await prisma.user.findUnique({
      where: { id: consent.studentId },
      select: { firstName: true, lastName: true, email: true }
    });

    res.render('coppa/verify', {
      title: 'Parental Consent - TutorAI',
      branding,
      consent,
      student,
      token
    });

  } catch (error) {
    logger.error('COPPA verify page error:', error);
    res.render('coppa/error', {
      title: 'Error - TutorAI',
      branding,
      error: 'An error occurred. Please try again.'
    });
  }
});

/**
 * Process consent approval
 * POST /coppa/verify
 */
router.post('/verify', async (req, res) => {
  const branding = await getBranding();

  try {
    const { token, agree } = req.body;

    if (!token) {
      return res.render('coppa/error', {
        title: 'Error - TutorAI',
        branding,
        error: 'Missing consent token.'
      });
    }

    if (!agree) {
      return res.redirect(`${config.basePath}/coppa/verify?token=${token}&error=agree`);
    }

    const verificationIp = req.ip || req.socket.remoteAddress || 'unknown';
    const result = await verifyConsent(token, verificationIp);

    if (!result.success) {
      return res.render('coppa/error', {
        title: 'Error - TutorAI',
        branding,
        error: result.error
      });
    }

    logger.info(`COPPA consent approved for token: ${token.substring(0, 8)}...`);

    res.render('coppa/success', {
      title: 'Consent Approved - TutorAI',
      branding
    });

  } catch (error) {
    logger.error('COPPA verify error:', error);
    res.render('coppa/error', {
      title: 'Error - TutorAI',
      branding,
      error: 'Failed to process consent. Please try again.'
    });
  }
});

/**
 * Consent rejection page
 * GET /coppa/reject?token=xxx
 */
router.get('/reject', async (req, res) => {
  const branding = await getBranding();
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.render('coppa/error', {
      title: 'Invalid Link - TutorAI',
      branding,
      error: 'This link is invalid.'
    });
  }

  res.render('coppa/reject', {
    title: 'Decline Consent - TutorAI',
    branding,
    token
  });
});

/**
 * Process consent rejection
 * POST /coppa/reject
 */
router.post('/reject', async (req, res) => {
  const branding = await getBranding();

  try {
    const { token, reason } = req.body;

    if (!token) {
      return res.render('coppa/error', {
        title: 'Error - TutorAI',
        branding,
        error: 'Missing consent token.'
      });
    }

    const result = await rejectConsent(token, reason);

    if (!result.success) {
      return res.render('coppa/error', {
        title: 'Error - TutorAI',
        branding,
        error: result.error
      });
    }

    logger.info(`COPPA consent rejected for token: ${token.substring(0, 8)}...`);

    res.render('coppa/rejected', {
      title: 'Consent Declined - TutorAI',
      branding
    });

  } catch (error) {
    logger.error('COPPA reject error:', error);
    res.render('coppa/error', {
      title: 'Error - TutorAI',
      branding,
      error: 'Failed to process. Please try again.'
    });
  }
});

/**
 * COPPA consent pending page (shown to child when waiting for parent)
 * GET /coppa/pending
 */
router.get('/pending', async (req, res) => {
  const branding = await getBranding();

  if (!req.session.userId) {
    return res.redirect(`${config.basePath}/auth/login`);
  }

  const status = await checkCoppaStatus(req.session.userId);

  if (!status.requiresConsent) {
    return res.redirect(`${config.basePath}/student`);
  }

  if (status.hasConsent) {
    return res.redirect(`${config.basePath}/student`);
  }

  // Get consent request info
  const consent = await prisma.parentalConsent.findFirst({
    where: { studentId: req.session.userId },
    orderBy: { requestedAt: 'desc' }
  });

  res.render('coppa/pending', {
    title: 'Waiting for Parent - TutorAI',
    branding,
    consent,
    status: status.status
  });
});

/**
 * Resend consent request email
 * POST /coppa/resend
 */
router.post('/resend', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const consent = await prisma.parentalConsent.findFirst({
      where: {
        studentId: req.session.userId,
        consentStatus: 'pending'
      },
      orderBy: { requestedAt: 'desc' }
    });

    if (!consent) {
      return res.status(400).json({ error: 'No pending consent request found' });
    }

    // Rate limit: only allow resend after 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (consent.requestedAt > fiveMinutesAgo) {
      return res.status(429).json({ error: 'Please wait before requesting again' });
    }

    // Create a new consent request with same details
    const result = await createConsentRequest({
      studentId: consent.studentId,
      childDateOfBirth: consent.childDateOfBirth,
      parentFirstName: consent.parentFirstName,
      parentLastName: consent.parentLastName,
      parentEmail: consent.parentEmail,
      parentPhone: consent.parentPhone || undefined,
      relationship: consent.relationship
    });

    if (result.success) {
      res.json({ success: true, message: 'New consent request sent to parent' });
    } else {
      res.status(500).json({ error: result.error });
    }

  } catch (error) {
    logger.error('Resend consent error:', error);
    res.status(500).json({ error: 'Failed to resend consent request' });
  }
});

/**
 * Parent dashboard to manage consent (for authenticated parents)
 * GET /coppa/manage
 */
router.get('/manage', async (req, res) => {
  const branding = await getBranding();

  // This would require parent authentication
  // For now, show info page
  res.render('coppa/manage-info', {
    title: 'Manage Consent - TutorAI',
    branding
  });
});

export default router;
