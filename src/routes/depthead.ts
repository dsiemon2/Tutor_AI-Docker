// TutorAI Department Head Routes
// Department-level curriculum management and teacher support

import { Router } from 'express';
import { prisma } from '../config/database';
import { config } from '../config';
import { requireAuth, requireMinRole } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// Apply authentication and role check - DEPARTMENT_HEAD (65) or higher
router.use(requireAuth);
router.use(requireMinRole('DEPARTMENT_HEAD'));

// Helper to get branding
async function getBranding() {
  const branding = await prisma.branding.findFirst({ where: { id: 'default' } });
  return branding || {
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    accentColor: '#38bdf8'
  };
}

// Helper to get department info for the current user
async function getDepartmentInfo(schoolId: string | null, departmentCode: string | null) {
  if (!schoolId || !departmentCode) return null;

  return prisma.department.findFirst({
    where: {
      schoolId,
      code: departmentCode,
      isActive: true
    }
  });
}

// Helper to get category for department
async function getDepartmentCategory(departmentCode: string | null) {
  if (!departmentCode) return null;

  // Department code maps to SubjectCategory.code
  return prisma.subjectCategory.findFirst({
    where: {
      code: departmentCode,
      isActive: true
    }
  });
}

// Department Head Dashboard
router.get('/', async (req, res) => {
  try {
    const schoolId = req.session.schoolId || null;
    const departmentCode = req.session.departmentCode || null;
    const branding = await getBranding();

    // Get department and category info
    const department = await getDepartmentInfo(schoolId, departmentCode);
    const category = await getDepartmentCategory(departmentCode);

    // Get subjects in department
    const subjects = category ? await prisma.subject.findMany({
      where: {
        categoryId: category.id,
        isActive: true
      },
      include: {
        topics: { where: { isActive: true } },
        classes: {
          where: { schoolId: schoolId || undefined },
          include: {
            teachers: { include: { teacher: true } },
            students: true
          }
        }
      },
      orderBy: { order: 'asc' }
    }) : [];

    // Get teachers in department (teachers who teach subjects in this category)
    const departmentTeachers = schoolId && category ? await prisma.user.findMany({
      where: {
        schoolId,
        role: 'TEACHER',
        isActive: true,
        classesAsTeacher: {
          some: {
            class: {
              subject: {
                categoryId: category.id
              }
            }
          }
        }
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
      }
    }) : [];

    // Calculate stats
    const totalTeachers = departmentTeachers.length;
    const totalSubjects = subjects.length;
    const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0);

    // Get total lessons in department subjects
    const topicIds = subjects.flatMap(s => s.topics.map(t => t.id));
    const totalLessons = await prisma.lesson.count({
      where: {
        topicId: { in: topicIds },
        isActive: true
      }
    });

    // Get recent tutoring sessions in department subjects
    const subjectIds = subjects.map(s => s.id);
    const recentSessions = await prisma.tutoringSession.findMany({
      where: {
        subjectId: { in: subjectIds },
        student: { schoolId: schoolId || undefined }
      },
      include: {
        student: { select: { firstName: true, lastName: true, gradeLevel: true } },
        subject: { select: { name: true } },
        topic: { select: { name: true } }
      },
      orderBy: { startedAt: 'desc' },
      take: 10
    });

    // Get total sessions count
    const totalSessions = await prisma.tutoringSession.count({
      where: {
        subjectId: { in: subjectIds },
        student: { schoolId: schoolId || undefined }
      }
    });

    res.render('depthead/dashboard', {
      title: 'Department Head - TutorAI',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      department,
      category,
      subjects,
      teachers: departmentTeachers,
      recentSessions,
      stats: {
        totalTeachers,
        totalSubjects,
        totalTopics,
        totalLessons,
        totalSessions
      }
    });

  } catch (error) {
    logger.error('Department head dashboard error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Teachers in Department
router.get('/teachers', async (req, res) => {
  try {
    const schoolId = req.session.schoolId || null;
    const departmentCode = req.session.departmentCode || null;
    const branding = await getBranding();

    const department = await getDepartmentInfo(schoolId, departmentCode);
    const category = await getDepartmentCategory(departmentCode);

    // Get teachers in department
    const teachers = schoolId && category ? await prisma.user.findMany({
      where: {
        schoolId,
        role: 'TEACHER',
        isActive: true,
        classesAsTeacher: {
          some: {
            class: {
              subject: {
                categoryId: category.id
              }
            }
          }
        }
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
    }) : [];

    res.render('depthead/teachers', {
      title: 'Teachers - Department Head',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      department,
      category,
      teachers
    });

  } catch (error) {
    logger.error('Department teachers error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Teacher Detail
router.get('/teachers/:id', async (req, res) => {
  try {
    const schoolId = req.session.schoolId || null;
    const departmentCode = req.session.departmentCode || null;
    const branding = await getBranding();

    const department = await getDepartmentInfo(schoolId, departmentCode);
    const category = await getDepartmentCategory(departmentCode);

    const teacher = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        schoolId: schoolId || undefined,
        role: 'TEACHER',
        isActive: true
      },
      include: {
        classesAsTeacher: {
          include: {
            class: {
              include: {
                subject: { include: { category: true } },
                students: { include: { student: true } },
                lessons: true,
                assignments: { include: { submissions: true } },
                quizzes: { include: { attempts: true } }
              }
            }
          }
        },
        lessonsCreated: {
          where: { isActive: true },
          include: { topic: { include: { subject: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!teacher) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Teacher Not Found'
      });
    }

    // Filter classes to department subjects only if category exists
    const departmentClasses = category
      ? teacher.classesAsTeacher.filter(tc => tc.class.subject?.categoryId === category.id)
      : teacher.classesAsTeacher;

    res.render('depthead/teacher-detail', {
      title: `${teacher.firstName} ${teacher.lastName} - Department Head`,
      branding,
      basePath: config.basePath,
      user: req.session.user,
      department,
      category,
      teacher,
      departmentClasses
    });

  } catch (error) {
    logger.error('Teacher detail error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Subjects in Department
router.get('/subjects', async (req, res) => {
  try {
    const schoolId = req.session.schoolId || null;
    const departmentCode = req.session.departmentCode || null;
    const branding = await getBranding();

    const department = await getDepartmentInfo(schoolId, departmentCode);
    const category = await getDepartmentCategory(departmentCode);

    const subjects = category ? await prisma.subject.findMany({
      where: {
        categoryId: category.id,
        isActive: true
      },
      include: {
        topics: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        classes: {
          where: { schoolId: schoolId || undefined, isActive: true },
          include: {
            teachers: { include: { teacher: true } },
            students: true
          }
        },
        sessions: {
          where: {
            student: { schoolId: schoolId || undefined }
          }
        }
      },
      orderBy: { order: 'asc' }
    }) : [];

    res.render('depthead/subjects', {
      title: 'Subjects - Department Head',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      department,
      category,
      subjects
    });

  } catch (error) {
    logger.error('Department subjects error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Curriculum Oversight (Lessons and Topics)
router.get('/curriculum', async (req, res) => {
  try {
    const schoolId = req.session.schoolId || null;
    const departmentCode = req.session.departmentCode || null;
    const branding = await getBranding();

    const department = await getDepartmentInfo(schoolId, departmentCode);
    const category = await getDepartmentCategory(departmentCode);

    // Get subjects with topics and lessons
    const subjects = category ? await prisma.subject.findMany({
      where: {
        categoryId: category.id,
        isActive: true
      },
      include: {
        topics: {
          where: { isActive: true },
          include: {
            lessons: {
              where: { isActive: true },
              include: {
                createdBy: { select: { firstName: true, lastName: true } }
              },
              orderBy: { order: 'asc' }
            },
            assignments: {
              where: { isActive: true },
              include: {
                createdBy: { select: { firstName: true, lastName: true } }
              }
            },
            quizzes: {
              where: { isActive: true },
              include: {
                createdBy: { select: { firstName: true, lastName: true } }
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    }) : [];

    // Calculate curriculum stats
    let totalLessons = 0;
    let totalAssignments = 0;
    let totalQuizzes = 0;
    subjects.forEach(s => {
      s.topics.forEach(t => {
        totalLessons += t.lessons.length;
        totalAssignments += t.assignments.length;
        totalQuizzes += t.quizzes.length;
      });
    });

    res.render('depthead/curriculum', {
      title: 'Curriculum - Department Head',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      department,
      category,
      subjects,
      stats: {
        totalLessons,
        totalAssignments,
        totalQuizzes
      }
    });

  } catch (error) {
    logger.error('Curriculum error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Students taking Department Subjects
router.get('/students', async (req, res) => {
  try {
    const schoolId = req.session.schoolId || null;
    const departmentCode = req.session.departmentCode || null;
    const branding = await getBranding();

    const department = await getDepartmentInfo(schoolId, departmentCode);
    const category = await getDepartmentCategory(departmentCode);

    // Get students enrolled in department subject classes
    const students = schoolId && category ? await prisma.user.findMany({
      where: {
        schoolId,
        role: 'STUDENT',
        isActive: true,
        classesAsStudent: {
          some: {
            class: {
              subject: {
                categoryId: category.id
              }
            }
          }
        }
      },
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
            topic: {
              include: {
                subject: {
                  include: { category: true }
                }
              }
            }
          }
        },
        tutoringSessionsAsStudent: {
          where: {
            subject: {
              categoryId: category.id
            }
          },
          orderBy: { startedAt: 'desc' },
          take: 5
        }
      },
      orderBy: [{ gradeLevel: 'asc' }, { lastName: 'asc' }]
    }) : [];

    res.render('depthead/students', {
      title: 'Students - Department Head',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      department,
      category,
      students
    });

  } catch (error) {
    logger.error('Department students error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Department Analytics
router.get('/analytics', async (req, res) => {
  try {
    const schoolId = req.session.schoolId || null;
    const departmentCode = req.session.departmentCode || null;
    const branding = await getBranding();

    const department = await getDepartmentInfo(schoolId, departmentCode);
    const category = await getDepartmentCategory(departmentCode);

    // Get subjects for analytics
    const subjects = category ? await prisma.subject.findMany({
      where: {
        categoryId: category.id,
        isActive: true
      },
      include: {
        topics: { where: { isActive: true } }
      }
    }) : [];

    const subjectIds = subjects.map(s => s.id);
    const topicIds = subjects.flatMap(s => s.topics.map(t => t.id));

    // Sessions by subject
    const sessionsBySubject = await prisma.tutoringSession.groupBy({
      by: ['subjectId'],
      where: {
        subjectId: { in: subjectIds },
        student: { schoolId: schoolId || undefined }
      },
      _count: { id: true }
    });

    // Sessions over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSessions = await prisma.tutoringSession.findMany({
      where: {
        subjectId: { in: subjectIds },
        student: { schoolId: schoolId || undefined },
        startedAt: { gte: thirtyDaysAgo }
      },
      select: {
        id: true,
        startedAt: true,
        duration: true
      }
    });

    // Student progress in department topics
    const progressData = await prisma.studentProgress.findMany({
      where: {
        topicId: { in: topicIds },
        student: { schoolId: schoolId || undefined }
      },
      include: {
        topic: { include: { subject: true } },
        student: { select: { gradeLevel: true } }
      }
    });

    // Calculate average mastery by subject
    const masteryBySubject: Record<string, { total: number; count: number }> = {};
    progressData.forEach(p => {
      const subjectName = p.topic.subject.name;
      if (!masteryBySubject[subjectName]) {
        masteryBySubject[subjectName] = { total: 0, count: 0 };
      }
      masteryBySubject[subjectName].total += p.masteryLevel;
      masteryBySubject[subjectName].count++;
    });

    res.render('depthead/analytics', {
      title: 'Analytics - Department Head',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      department,
      category,
      subjects,
      sessionsBySubject,
      recentSessions,
      masteryBySubject
    });

  } catch (error) {
    logger.error('Department analytics error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Department Settings
router.get('/settings', async (req, res) => {
  try {
    const schoolId = req.session.schoolId || null;
    const departmentCode = req.session.departmentCode || null;
    const branding = await getBranding();

    const department = await getDepartmentInfo(schoolId, departmentCode);
    const category = await getDepartmentCategory(departmentCode);

    // Get school info
    const school = schoolId ? await prisma.school.findUnique({
      where: { id: schoolId }
    }) : null;

    res.render('depthead/settings', {
      title: 'Settings - Department Head',
      branding,
      basePath: config.basePath,
      user: req.session.user,
      department,
      category,
      school
    });

  } catch (error) {
    logger.error('Department settings error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

export default router;
