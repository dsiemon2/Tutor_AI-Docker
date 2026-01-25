// TutorAI District Admin Routes
// District-level administration: schools, users, analytics, settings

import { Router } from 'express';
import { prisma } from '../config/database';
import { config } from '../config';
import { requireAuth, requireRole } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// Apply authentication and role check
router.use(requireAuth);
router.use(requireRole('DISTRICT_ADMIN', 'SUPER_ADMIN'));

// Helper to get branding
async function getBranding() {
  const branding = await prisma.branding.findFirst({ where: { id: 'default' } });
  return branding || {
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    accentColor: '#38bdf8'
  };
}

// Helper to get district for current user
async function getDistrictForUser(user: { id: string; role: string; districtId?: string | null }) {
  // Super admin can see all districts - return the first one or null
  if (user.role === 'SUPER_ADMIN') {
    return await prisma.district.findFirst({ where: { isActive: true } });
  }

  // District admin sees their assigned district
  if (user.districtId) {
    return await prisma.district.findUnique({ where: { id: user.districtId } });
  }

  return null;
}

// District Admin Dashboard
router.get('/', async (req, res) => {
  try {
    const branding = await getBranding();
    const user = req.session.user;
    const district = await getDistrictForUser(user);

    if (!district) {
      return res.status(403).render('errors/403', {
        basePath: config.basePath,
        title: 'Access Denied',
        message: 'No district assigned to your account.'
      });
    }

    // Get all schools in this district
    const schools = await prisma.school.findMany({
      where: {
        districtId: district.id,
        isActive: true
      },
      include: {
        _count: {
          select: {
            users: true,
            classes: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Get school IDs for aggregate queries
    const schoolIds = schools.map(s => s.id);

    // Get aggregate stats
    const [totalStudents, totalTeachers, totalClasses, totalSessions] = await Promise.all([
      prisma.user.count({
        where: { schoolId: { in: schoolIds }, role: 'STUDENT', isActive: true }
      }),
      prisma.user.count({
        where: { schoolId: { in: schoolIds }, role: 'TEACHER', isActive: true }
      }),
      prisma.class.count({
        where: { schoolId: { in: schoolIds }, isActive: true }
      }),
      prisma.tutoringSession.count({
        where: {
          student: { schoolId: { in: schoolIds } }
        }
      })
    ]);

    // Get school-level stats for the table
    const schoolsWithStats = await Promise.all(schools.map(async (school) => {
      const [studentCount, teacherCount, sessionCount] = await Promise.all([
        prisma.user.count({
          where: { schoolId: school.id, role: 'STUDENT', isActive: true }
        }),
        prisma.user.count({
          where: { schoolId: school.id, role: 'TEACHER', isActive: true }
        }),
        prisma.tutoringSession.count({
          where: { student: { schoolId: school.id } }
        })
      ]);

      return {
        ...school,
        studentCount,
        teacherCount,
        sessionCount
      };
    }));

    // Recent activity across district
    const recentSessions = await prisma.tutoringSession.findMany({
      where: {
        student: { schoolId: { in: schoolIds } }
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            school: { select: { name: true } }
          }
        },
        subject: { select: { name: true } }
      },
      orderBy: { startedAt: 'desc' },
      take: 10
    });

    res.render('district/dashboard', {
      title: 'District Admin - TutorAI',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      district,
      schools: schoolsWithStats,
      stats: {
        totalSchools: schools.length,
        totalStudents,
        totalTeachers,
        totalClasses,
        totalSessions
      },
      recentSessions
    });

  } catch (error) {
    logger.error('District admin dashboard error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Schools List
router.get('/schools', async (req, res) => {
  try {
    const branding = await getBranding();
    const user = req.session.user;
    const district = await getDistrictForUser(user);

    if (!district) {
      return res.status(403).render('errors/403', {
        basePath: config.basePath,
        title: 'Access Denied',
        message: 'No district assigned to your account.'
      });
    }

    const schools = await prisma.school.findMany({
      where: {
        districtId: district.id,
        isActive: true
      },
      orderBy: { name: 'asc' }
    });

    // Get stats for each school
    const schoolsWithStats = await Promise.all(schools.map(async (school) => {
      const [studentCount, teacherCount, classCount, sessionCount] = await Promise.all([
        prisma.user.count({
          where: { schoolId: school.id, role: 'STUDENT', isActive: true }
        }),
        prisma.user.count({
          where: { schoolId: school.id, role: 'TEACHER', isActive: true }
        }),
        prisma.class.count({
          where: { schoolId: school.id, isActive: true }
        }),
        prisma.tutoringSession.count({
          where: { student: { schoolId: school.id } }
        })
      ]);

      return {
        ...school,
        studentCount,
        teacherCount,
        classCount,
        sessionCount
      };
    }));

    res.render('district/schools', {
      title: 'Schools - District Admin',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      district,
      schools: schoolsWithStats
    });

  } catch (error) {
    logger.error('District schools error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// School Detail
router.get('/schools/:id', async (req, res) => {
  try {
    const branding = await getBranding();
    const user = req.session.user;
    const district = await getDistrictForUser(user);

    if (!district) {
      return res.status(403).render('errors/403', {
        basePath: config.basePath,
        title: 'Access Denied',
        message: 'No district assigned to your account.'
      });
    }

    const school = await prisma.school.findFirst({
      where: {
        id: req.params.id,
        districtId: district.id
      }
    });

    if (!school) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'School Not Found'
      });
    }

    // Get school stats
    const [students, teachers, classes, sessions] = await Promise.all([
      prisma.user.findMany({
        where: { schoolId: school.id, role: 'STUDENT', isActive: true },
        orderBy: { lastName: 'asc' },
        take: 20
      }),
      prisma.user.findMany({
        where: { schoolId: school.id, role: 'TEACHER', isActive: true },
        orderBy: { lastName: 'asc' }
      }),
      prisma.class.findMany({
        where: { schoolId: school.id, isActive: true },
        include: {
          subject: true,
          _count: {
            select: { students: true, teachers: true }
          }
        },
        orderBy: { name: 'asc' }
      }),
      prisma.tutoringSession.findMany({
        where: { student: { schoolId: school.id } },
        include: {
          student: { select: { firstName: true, lastName: true } },
          subject: { select: { name: true } }
        },
        orderBy: { startedAt: 'desc' },
        take: 10
      })
    ]);

    // Get counts
    const [studentCount, teacherCount, classCount, sessionCount] = await Promise.all([
      prisma.user.count({ where: { schoolId: school.id, role: 'STUDENT', isActive: true } }),
      prisma.user.count({ where: { schoolId: school.id, role: 'TEACHER', isActive: true } }),
      prisma.class.count({ where: { schoolId: school.id, isActive: true } }),
      prisma.tutoringSession.count({ where: { student: { schoolId: school.id } } })
    ]);

    res.render('district/school-detail', {
      title: `${school.name} - District Admin`,
      branding,
      basePath: config.basePath,
      user: req.session.user,
      district,
      school,
      students,
      teachers,
      classes,
      sessions,
      stats: { studentCount, teacherCount, classCount, sessionCount }
    });

  } catch (error) {
    logger.error('District school detail error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// District Analytics
router.get('/analytics', async (req, res) => {
  try {
    const branding = await getBranding();
    const user = req.session.user;
    const district = await getDistrictForUser(user);

    if (!district) {
      return res.status(403).render('errors/403', {
        basePath: config.basePath,
        title: 'Access Denied',
        message: 'No district assigned to your account.'
      });
    }

    // Get schools in district
    const schools = await prisma.school.findMany({
      where: { districtId: district.id, isActive: true }
    });
    const schoolIds = schools.map(s => s.id);

    // Get session data for the past 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalSessions, recentSessions, averageSessionDuration, topSubjects] = await Promise.all([
      prisma.tutoringSession.count({
        where: { student: { schoolId: { in: schoolIds } } }
      }),
      prisma.tutoringSession.count({
        where: {
          student: { schoolId: { in: schoolIds } },
          startedAt: { gte: thirtyDaysAgo }
        }
      }),
      prisma.tutoringSession.aggregate({
        where: {
          student: { schoolId: { in: schoolIds } },
          duration: { not: null }
        },
        _avg: { duration: true }
      }),
      prisma.tutoringSession.groupBy({
        by: ['subjectId'],
        where: {
          student: { schoolId: { in: schoolIds } },
          subjectId: { not: null }
        },
        _count: { subjectId: true },
        orderBy: { _count: { subjectId: 'desc' } },
        take: 5
      })
    ]);

    // Get subject names for top subjects
    const subjectIds = topSubjects.map(s => s.subjectId).filter((id): id is string => id !== null);
    const subjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds } },
      select: { id: true, name: true }
    });
    const subjectMap = new Map(subjects.map(s => [s.id, s.name]));

    const topSubjectsWithNames = topSubjects.map(s => ({
      name: s.subjectId ? subjectMap.get(s.subjectId) || 'Unknown' : 'Unknown',
      count: s._count.subjectId
    }));

    res.render('district/analytics', {
      title: 'Analytics - District Admin',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      district,
      schools,
      analytics: {
        totalSessions,
        recentSessions,
        averageSessionDuration: averageSessionDuration._avg.duration || 0,
        topSubjects: topSubjectsWithNames
      }
    });

  } catch (error) {
    logger.error('District analytics error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// District Users
router.get('/users', async (req, res) => {
  try {
    const branding = await getBranding();
    const user = req.session.user;
    const district = await getDistrictForUser(user);

    if (!district) {
      return res.status(403).render('errors/403', {
        basePath: config.basePath,
        title: 'Access Denied',
        message: 'No district assigned to your account.'
      });
    }

    // Get schools in district
    const schools = await prisma.school.findMany({
      where: { districtId: district.id, isActive: true }
    });
    const schoolIds = schools.map(s => s.id);

    // Get role filter from query
    const roleFilter = req.query.role as string | undefined;
    const schoolFilter = req.query.school as string | undefined;

    const whereClause: any = {
      schoolId: { in: schoolIds },
      isActive: true
    };

    if (roleFilter && roleFilter !== 'all') {
      whereClause.role = roleFilter;
    }

    if (schoolFilter && schoolFilter !== 'all') {
      whereClause.schoolId = schoolFilter;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        school: { select: { name: true } }
      },
      orderBy: [
        { role: 'asc' },
        { lastName: 'asc' }
      ],
      take: 100
    });

    // Get user counts by role
    const roleCounts = await prisma.user.groupBy({
      by: ['role'],
      where: { schoolId: { in: schoolIds }, isActive: true },
      _count: { role: true }
    });

    res.render('district/users', {
      title: 'Users - District Admin',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      district,
      users,
      schools,
      roleCounts,
      filters: {
        role: roleFilter || 'all',
        school: schoolFilter || 'all'
      }
    });

  } catch (error) {
    logger.error('District users error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// District Settings
router.get('/settings', async (req, res) => {
  try {
    const branding = await getBranding();
    const user = req.session.user;
    const district = await getDistrictForUser(user);

    if (!district) {
      return res.status(403).render('errors/403', {
        basePath: config.basePath,
        title: 'Access Denied',
        message: 'No district assigned to your account.'
      });
    }

    res.render('district/settings', {
      title: 'Settings - District Admin',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      district
    });

  } catch (error) {
    logger.error('District settings error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

export default router;
