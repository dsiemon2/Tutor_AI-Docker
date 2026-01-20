// TutorAI School Admin Routes
// School-level administration: users, classes, settings

import { Router } from 'express';
import { prisma } from '../config/database';
import { config } from '../config';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Apply authentication and role check
router.use(requireAuth);
router.use(requireRole('SCHOOL_ADMIN', 'SUPER_ADMIN'));

// Helper to get branding
async function getBranding() {
  const branding = await prisma.branding.findFirst({ where: { id: 'default' } });
  return branding || {
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    accentColor: '#38bdf8'
  };
}

// School Admin Dashboard
router.get('/', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();

    // Get school info
    const school = schoolId ? await prisma.school.findUnique({
      where: { id: schoolId }
    }) : null;

    // Get stats for this school
    const [totalTeachers, totalStudents, totalClasses, totalSessions] = await Promise.all([
      prisma.user.count({
        where: { schoolId, role: 'TEACHER' }
      }),
      prisma.user.count({
        where: { schoolId, role: 'STUDENT' }
      }),
      prisma.class.count({
        where: { schoolId }
      }),
      prisma.tutoringSession.count({
        where: {
          student: { schoolId }
        }
      })
    ]);

    // Recent activity
    const recentUsers = await prisma.user.findMany({
      where: { schoolId },
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
      where: {
        student: { schoolId }
      },
      include: {
        student: { select: { firstName: true, lastName: true } },
        subject: { select: { name: true } }
      },
      orderBy: { startedAt: 'desc' },
      take: 5
    });

    res.render('schooladmin/dashboard', {
      title: 'School Admin - TutorAI',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      school,
      stats: { totalTeachers, totalStudents, totalClasses, totalSessions },
      recentUsers,
      recentSessions
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'School admin dashboard error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Users Management
router.get('/users', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();

    const users = await prisma.user.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' }
    });

    res.render('schooladmin/users', {
      title: 'Users - School Admin',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      users
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'School users error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Classes Management
router.get('/classes', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();

    const classes = await prisma.class.findMany({
      where: { schoolId },
      include: {
        subject: true,
        teachers: { include: { teacher: true } },
        students: { include: { student: true } }
      },
      orderBy: { name: 'asc' }
    });

    res.render('schooladmin/classes', {
      title: 'Classes - School Admin',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      classes
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'School classes error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Analytics
router.get('/analytics', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();

    res.render('schooladmin/analytics', {
      title: 'Analytics - School Admin',
      branding,
      basePath: config.basePath,
      user: req.session.user
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'School analytics error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Settings
router.get('/settings', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();

    const school = schoolId ? await prisma.school.findUnique({
      where: { id: schoolId }
    }) : null;

    res.render('schooladmin/settings', {
      title: 'Settings - School Admin',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      school
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'School settings error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

export default router;
