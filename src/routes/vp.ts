// TutorAI Vice Principal Routes
// Student oversight, session monitoring, alerts, class oversight, analytics

import { Router } from 'express';
import { prisma } from '../config/database';
import { config } from '../config';
import { requireAuth, requireMinRole } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// Apply authentication and role check - VICE_PRINCIPAL (75) or higher
router.use(requireAuth);
router.use(requireMinRole('VICE_PRINCIPAL'));

// Helper to get branding
async function getBranding() {
  const branding = await prisma.branding.findFirst({ where: { id: 'default' } });
  return branding || {
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    accentColor: '#38bdf8'
  };
}

// Helper to get struggling students (low progress or low accuracy)
async function getStrugglingStudents(schoolId: string, limit: number = 10) {
  // Get students with low mastery levels
  const strugglingProgress = await prisma.studentProgress.findMany({
    where: {
      student: { schoolId },
      masteryLevel: { lt: 50 }
    },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          gradeLevel: true
        }
      },
      topic: {
        include: {
          subject: true
        }
      }
    },
    orderBy: [
      { masteryLevel: 'asc' }
    ],
    take: limit
  });

  // Add wrongAttempts calculation (questionsAttempted - questionsCorrect)
  return strugglingProgress.map(p => ({
    ...p,
    wrongAttempts: p.questionsAttempted - p.questionsCorrect
  }));
}

// Vice Principal Dashboard
router.get('/', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();

    // Get school info
    const school = schoolId ? await prisma.school.findUnique({
      where: { id: schoolId }
    }) : null;

    // Get stats for this school
    const [totalStudents, activeSessions, totalClasses, totalSessions] = await Promise.all([
      prisma.user.count({
        where: { schoolId, role: 'STUDENT' }
      }),
      prisma.tutoringSession.count({
        where: {
          student: { schoolId },
          endedAt: null // Sessions that haven't ended
        }
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

    // Get average progress across all students
    const progressStats = await prisma.studentProgress.aggregate({
      where: {
        student: { schoolId }
      },
      _avg: {
        masteryLevel: true
      }
    });
    const avgProgress = Math.round(progressStats._avg.masteryLevel || 0);

    // Get struggling students (alerts)
    const strugglingStudents = await getStrugglingStudents(schoolId || '', 5);
    const alertCount = strugglingStudents.length;

    // Recent sessions
    const recentSessions = await prisma.tutoringSession.findMany({
      where: {
        student: { schoolId }
      },
      include: {
        student: { select: { firstName: true, lastName: true, gradeLevel: true } },
        subject: { select: { name: true } },
        topic: { select: { name: true } }
      },
      orderBy: { startedAt: 'desc' },
      take: 10
    });

    res.render('vp/dashboard', {
      title: 'Vice Principal Dashboard - TutorAI',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      school,
      stats: { totalStudents, activeSessions, alertCount, avgProgress, totalClasses, totalSessions },
      strugglingStudents,
      recentSessions
    });

  } catch (error) {
    logger.error('VP dashboard error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// All Students in School
router.get('/students', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();
    const { grade, search } = req.query;

    // Build where clause
    const where: any = { schoolId, role: 'STUDENT' };
    if (grade && grade !== 'all') {
      where.gradeLevel = parseInt(grade as string);
    }
    if (search) {
      where.OR = [
        { firstName: { contains: search as string } },
        { lastName: { contains: search as string } },
        { email: { contains: search as string } }
      ];
    }

    const students = await prisma.user.findMany({
      where,
      include: {
        progress: {
          include: {
            topic: {
              include: { subject: true }
            }
          }
        },
        tutoringSessionsAsStudent: {
          orderBy: { startedAt: 'desc' },
          take: 1
        },
        classesAsStudent: {
          include: {
            class: true
          }
        }
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }]
    });

    // Calculate average mastery for each student
    const studentsWithStats = students.map(student => {
      const avgMastery = student.progress.length > 0
        ? Math.round(student.progress.reduce((sum, p) => sum + (p.masteryLevel || 0), 0) / student.progress.length)
        : 0;
      const lastSession = student.tutoringSessionsAsStudent[0];
      const totalSessions = student.tutoringSessionsAsStudent.length;
      return {
        ...student,
        avgMastery,
        lastSession,
        totalSessions,
        classCount: student.classesAsStudent.length
      };
    });

    res.render('vp/students', {
      title: 'Students - Vice Principal',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      students: studentsWithStats,
      filters: { grade, search }
    });

  } catch (error) {
    logger.error('VP students error:', { error: error instanceof Error ? error.message : String(error) });
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
    const branding = await getBranding();

    const student = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        schoolId,
        role: 'STUDENT'
      },
      include: {
        progress: {
          include: {
            topic: {
              include: {
                subject: { include: { category: true } }
              }
            }
          }
        },
        tutoringSessionsAsStudent: {
          include: {
            subject: true,
            topic: true,
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 5
            }
          },
          orderBy: { startedAt: 'desc' },
          take: 20
        },
        classesAsStudent: {
          include: {
            class: {
              include: {
                subject: true,
                teachers: {
                  include: { teacher: true }
                }
              }
            }
          }
        },
        submissions: {
          include: {
            assignment: true
          },
          orderBy: { submittedAt: 'desc' },
          take: 10
        },
        quizAttempts: {
          include: {
            quiz: true
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

    // Calculate overall stats
    const avgMastery = student.progress.length > 0
      ? Math.round(student.progress.reduce((sum, p) => sum + (p.masteryLevel || 0), 0) / student.progress.length)
      : 0;
    const totalSessions = student.tutoringSessionsAsStudent.length;
    const totalTime = student.tutoringSessionsAsStudent.reduce((sum, s) => sum + (s.duration || 0), 0);

    res.render('vp/student-detail', {
      title: `${student.firstName} ${student.lastName} - Vice Principal`,
      branding,
      basePath: config.basePath,
      user: req.session.user,
      student,
      stats: { avgMastery, totalSessions, totalTime }
    });

  } catch (error) {
    logger.error('VP student detail error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// All Tutoring Sessions
router.get('/sessions', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();
    const { status, date, subject } = req.query;

    // Build where clause
    const where: any = {
      student: { schoolId }
    };

    if (status === 'active') {
      where.endedAt = null;
    } else if (status === 'completed') {
      where.endedAt = { not: null };
    }

    if (date) {
      const startOfDay = new Date(date as string);
      const endOfDay = new Date(date as string);
      endOfDay.setDate(endOfDay.getDate() + 1);
      where.startedAt = {
        gte: startOfDay,
        lt: endOfDay
      };
    }

    if (subject && subject !== 'all') {
      where.subjectId = subject as string;
    }

    const sessions = await prisma.tutoringSession.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gradeLevel: true,
            email: true
          }
        },
        subject: { select: { name: true } },
        topic: { select: { name: true } },
        messages: {
          select: { id: true }
        }
      },
      orderBy: { startedAt: 'desc' },
      take: 100
    });

    // Get subjects for filter dropdown
    const subjects = await prisma.subject.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.render('vp/sessions', {
      title: 'Tutoring Sessions - Vice Principal',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      sessions,
      subjects,
      filters: { status, date, subject }
    });

  } catch (error) {
    logger.error('VP sessions error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Session Detail
router.get('/sessions/:id', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();

    const session = await prisma.tutoringSession.findFirst({
      where: {
        id: req.params.id,
        student: { schoolId }
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gradeLevel: true,
            email: true
          }
        },
        subject: { include: { category: true } },
        topic: true,
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!session) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Session Not Found'
      });
    }

    res.render('vp/session-detail', {
      title: `Session Details - Vice Principal`,
      branding,
      basePath: config.basePath,
      user: req.session.user,
      session
    });

  } catch (error) {
    logger.error('VP session detail error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Alerts - Students Needing Attention
router.get('/alerts', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();
    const { severity } = req.query;

    // Get all struggling students
    const strugglingStudents = await getStrugglingStudents(schoolId || '', 50);

    // Categorize by severity
    const critical = strugglingStudents.filter(p => p.masteryLevel < 20 || p.wrongAttempts >= 10);
    const warning = strugglingStudents.filter(p =>
      (p.masteryLevel >= 20 && p.masteryLevel < 30) || (p.wrongAttempts >= 5 && p.wrongAttempts < 10)
    );
    const lowProgress = strugglingStudents.filter(p =>
      p.masteryLevel >= 30 && p.masteryLevel < 50 && p.wrongAttempts < 5
    );

    // Get students with no recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const inactiveStudents = await prisma.user.findMany({
      where: {
        schoolId,
        role: 'STUDENT',
        tutoringSessionsAsStudent: {
          none: {
            startedAt: { gte: sevenDaysAgo }
          }
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        gradeLevel: true,
        tutoringSessionsAsStudent: {
          orderBy: { startedAt: 'desc' },
          take: 1
        }
      },
      take: 20
    });

    // Filter based on severity query param
    let displayAlerts = strugglingStudents;
    if (severity === 'critical') {
      displayAlerts = critical;
    } else if (severity === 'warning') {
      displayAlerts = warning;
    } else if (severity === 'low') {
      displayAlerts = lowProgress;
    }

    res.render('vp/alerts', {
      title: 'Student Alerts - Vice Principal',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      alerts: displayAlerts,
      inactiveStudents,
      stats: {
        critical: critical.length,
        warning: warning.length,
        lowProgress: lowProgress.length,
        inactive: inactiveStudents.length,
        total: strugglingStudents.length
      },
      filters: { severity }
    });

  } catch (error) {
    logger.error('VP alerts error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Classes Overview
router.get('/classes', async (req, res) => {
  try {
    const schoolId = req.session.schoolId;
    const branding = await getBranding();

    const classes = await prisma.class.findMany({
      where: { schoolId },
      include: {
        subject: { include: { category: true } },
        teachers: {
          include: {
            teacher: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          }
        },
        students: {
          include: {
            student: {
              select: { id: true, firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Add stats for each class
    const classesWithStats = await Promise.all(classes.map(async (cls) => {
      const studentIds = cls.students.map(s => s.studentId);

      // Get session count for this class's subject
      const sessionCount = await prisma.tutoringSession.count({
        where: {
          studentId: { in: studentIds },
          subjectId: cls.subjectId || undefined
        }
      });

      // Get average progress for students in this class
      const progressStats = await prisma.studentProgress.aggregate({
        where: {
          studentId: { in: studentIds }
        },
        _avg: { masteryLevel: true }
      });

      return {
        ...cls,
        sessionCount,
        avgProgress: Math.round(progressStats._avg.masteryLevel || 0)
      };
    }));

    res.render('vp/classes', {
      title: 'Classes - Vice Principal',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      classes: classesWithStats
    });

  } catch (error) {
    logger.error('VP classes error:', { error: error instanceof Error ? error.message : String(error) });
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

    // Get date range (default: last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Sessions over time
    const sessionsOverTime = await prisma.tutoringSession.groupBy({
      by: ['startedAt'],
      where: {
        student: { schoolId },
        startedAt: { gte: thirtyDaysAgo }
      },
      _count: { id: true }
    });

    // Sessions by subject
    const sessionsBySubject = await prisma.tutoringSession.groupBy({
      by: ['subjectId'],
      where: {
        student: { schoolId },
        startedAt: { gte: thirtyDaysAgo }
      },
      _count: { id: true }
    });

    // Get subject names
    const subjectIds = sessionsBySubject.map(s => s.subjectId).filter(Boolean) as string[];
    const subjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds } }
    });
    const subjectMap = new Map(subjects.map(s => [s.id, s.name]));

    // Progress distribution
    const progressDistribution = await prisma.studentProgress.groupBy({
      by: ['masteryLevel'],
      where: {
        student: { schoolId }
      },
      _count: { id: true }
    });

    // Students by grade level
    const studentsByGrade = await prisma.user.groupBy({
      by: ['gradeLevel'],
      where: { schoolId, role: 'STUDENT' },
      _count: { id: true }
    });

    // Top performing students
    const topStudents = await prisma.user.findMany({
      where: { schoolId, role: 'STUDENT' },
      include: {
        progress: true
      },
      take: 50
    });

    const topStudentsWithAvg = topStudents.map(s => ({
      ...s,
      avgMastery: s.progress.length > 0
        ? Math.round(s.progress.reduce((sum, p) => sum + (p.masteryLevel || 0), 0) / s.progress.length)
        : 0
    })).sort((a, b) => b.avgMastery - a.avgMastery).slice(0, 10);

    // Summary stats
    const totalSessions = await prisma.tutoringSession.count({
      where: {
        student: { schoolId },
        startedAt: { gte: thirtyDaysAgo }
      }
    });

    const avgSessionDuration = await prisma.tutoringSession.aggregate({
      where: {
        student: { schoolId },
        startedAt: { gte: thirtyDaysAgo },
        duration: { not: null }
      },
      _avg: { duration: true }
    });

    res.render('vp/analytics', {
      title: 'Analytics - Vice Principal',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      sessionsOverTime,
      sessionsBySubject: sessionsBySubject.map(s => ({
        ...s,
        subjectName: s.subjectId ? subjectMap.get(s.subjectId) || 'Unknown' : 'General'
      })),
      progressDistribution,
      studentsByGrade,
      topStudents: topStudentsWithAvg,
      summary: {
        totalSessions,
        avgSessionDuration: Math.round(avgSessionDuration._avg.duration || 0)
      }
    });

  } catch (error) {
    logger.error('VP analytics error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

export default router;
