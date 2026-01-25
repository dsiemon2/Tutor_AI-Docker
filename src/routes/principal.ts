// TutorAI Principal Portal Routes
// School leadership administration: teachers, students, classes, analytics

import { Router } from 'express';
import { prisma } from '../config/database';
import { config } from '../config';
import { requireAuth, requireSchoolLeadership } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// Apply authentication and role check (Principal, Vice Principal, or higher)
router.use(requireAuth);
router.use(requireSchoolLeadership());

// Helper to get branding
async function getBranding() {
  const branding = await prisma.branding.findFirst({ where: { id: 'default' } });
  return branding || {
    primaryColor: '#059669',
    secondaryColor: '#047857',
    accentColor: '#10b981'
  };
}

// Principal Dashboard
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

    // Recent tutoring sessions in the school
    const recentSessions = await prisma.tutoringSession.findMany({
      where: {
        student: { schoolId }
      },
      include: {
        student: { select: { firstName: true, lastName: true } },
        subject: { select: { name: true } }
      },
      orderBy: { startedAt: 'desc' },
      take: 10
    });

    res.render('principal/dashboard', {
      title: 'Principal Portal - TutorAI',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      school,
      stats: { totalTeachers, totalStudents, totalClasses, totalSessions },
      recentSessions
    });

  } catch (error) {
    logger.error('Principal dashboard error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Teachers List
router.get('/teachers', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();

    const teachers = await prisma.user.findMany({
      where: {
        schoolId,
        role: { in: ['TEACHER', 'DEPARTMENT_HEAD'] }
      },
      include: {
        classesAsTeacher: {
          include: {
            class: {
              include: {
                subject: true,
                students: true
              }
            }
          }
        }
      },
      orderBy: { lastName: 'asc' }
    });

    res.render('principal/teachers', {
      title: 'Teachers - Principal Portal',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      teachers,
      activePage: 'teachers',
      pageTitle: 'Teachers'
    });

  } catch (error) {
    logger.error('Principal teachers error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Teacher Detail
router.get('/teachers/:id', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const teacherId = req.params.id;
    const branding = await getBranding();

    const teacher = await prisma.user.findFirst({
      where: {
        id: teacherId,
        schoolId,
        role: { in: ['TEACHER', 'DEPARTMENT_HEAD'] }
      },
      include: {
        classesAsTeacher: {
          include: {
            class: {
              include: {
                subject: true,
                students: {
                  include: {
                    student: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        gradeLevel: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!teacher) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Teacher Not Found'
      });
    }

    res.render('principal/teacher-detail', {
      title: `${teacher.firstName} ${teacher.lastName} - Principal Portal`,
      branding,
      basePath: config.basePath,
      user: req.session.user,
      teacher,
      activePage: 'teachers',
      pageTitle: `${teacher.firstName} ${teacher.lastName}`
    });

  } catch (error) {
    logger.error('Principal teacher detail error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Students List
router.get('/students', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();

    const students = await prisma.user.findMany({
      where: { schoolId, role: 'STUDENT' },
      include: {
        classesAsStudent: {
          include: {
            class: {
              include: {
                subject: true
              }
            }
          }
        },
        progress: {
          include: {
            topic: true
          }
        }
      },
      orderBy: { lastName: 'asc' }
    });

    res.render('principal/students', {
      title: 'Students - Principal Portal',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      students,
      activePage: 'students',
      pageTitle: 'Students'
    });

  } catch (error) {
    logger.error('Principal students error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Student Detail
router.get('/students/:id', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const studentId = req.params.id;
    const branding = await getBranding();

    const student = await prisma.user.findFirst({
      where: {
        id: studentId,
        schoolId,
        role: 'STUDENT'
      },
      include: {
        classesAsStudent: {
          include: {
            class: {
              include: {
                subject: true,
                teachers: {
                  include: {
                    teacher: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        progress: {
          include: {
            topic: {
              include: {
                subject: true
              }
            }
          }
        },
        tutoringSessionsAsStudent: {
          include: {
            subject: true
          },
          orderBy: { startedAt: 'desc' },
          take: 10
        }
      }
    });

    if (!student) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Student Not Found'
      });
    }

    res.render('principal/student-detail', {
      title: `${student.firstName} ${student.lastName} - Principal Portal`,
      branding,
      basePath: config.basePath,
      user: req.session.user,
      student,
      activePage: 'students',
      pageTitle: `${student.firstName} ${student.lastName}`
    });

  } catch (error) {
    logger.error('Principal student detail error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Classes List
router.get('/classes', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();

    const classes = await prisma.class.findMany({
      where: { schoolId },
      include: {
        subject: true,
        teachers: {
          include: {
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        students: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.render('principal/classes', {
      title: 'Classes - Principal Portal',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      classes,
      activePage: 'classes',
      pageTitle: 'Classes'
    });

  } catch (error) {
    logger.error('Principal classes error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Class Detail
router.get('/classes/:id', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const classId = req.params.id;
    const branding = await getBranding();

    const classData = await prisma.class.findFirst({
      where: {
        id: classId,
        schoolId
      },
      include: {
        subject: true,
        teachers: {
          include: {
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        students: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                gradeLevel: true
              }
            }
          }
        }
      }
    });

    if (!classData) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Class Not Found'
      });
    }

    res.render('principal/class-detail', {
      title: `${classData.name} - Principal Portal`,
      branding,
      basePath: config.basePath,
      user: req.session.user,
      classData,
      activePage: 'classes',
      pageTitle: classData.name
    });

  } catch (error) {
    logger.error('Principal class detail error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// School Analytics
router.get('/analytics', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();

    // Get analytics data
    const [
      totalSessions,
      activeSessions,
      totalMessages,
      subjectStats,
      gradeStats
    ] = await Promise.all([
      // Total tutoring sessions
      prisma.tutoringSession.count({
        where: { student: { schoolId } }
      }),
      // Active sessions (last 7 days)
      prisma.tutoringSession.count({
        where: {
          student: { schoolId },
          startedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Total messages
      prisma.sessionMessage.count({
        where: {
          session: { student: { schoolId } }
        }
      }),
      // Sessions by subject
      prisma.tutoringSession.groupBy({
        by: ['subjectId'],
        where: { student: { schoolId } },
        _count: { id: true }
      }),
      // Students by grade level
      prisma.user.groupBy({
        by: ['gradeLevel'],
        where: { schoolId, role: 'STUDENT' },
        _count: { id: true }
      })
    ]);

    // Get subject names for stats
    const subjectIds = subjectStats.map(s => s.subjectId).filter(Boolean) as string[];
    const subjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds } },
      select: { id: true, name: true }
    });

    const subjectStatsWithNames = subjectStats.map(stat => ({
      ...stat,
      subjectName: subjects.find(s => s.id === stat.subjectId)?.name || 'Unknown'
    }));

    res.render('principal/analytics', {
      title: 'Analytics - Principal Portal',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      analytics: {
        totalSessions,
        activeSessions,
        totalMessages,
        subjectStats: subjectStatsWithNames,
        gradeStats
      },
      activePage: 'analytics',
      pageTitle: 'School Analytics'
    });

  } catch (error) {
    logger.error('Principal analytics error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// School Settings
router.get('/settings', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();

    const school = schoolId ? await prisma.school.findUnique({
      where: { id: schoolId }
    }) : null;

    res.render('principal/settings', {
      title: 'Settings - Principal Portal',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      school,
      activePage: 'settings',
      pageTitle: 'School Settings'
    });

  } catch (error) {
    logger.error('Principal settings error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

export default router;
