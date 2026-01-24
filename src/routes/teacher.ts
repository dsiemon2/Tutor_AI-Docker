// TutorAI Teacher Routes
// Teacher dashboard, class management, student monitoring

import { Router } from 'express';
import { prisma } from '../config/database';
import { config } from '../config';
import { requireAuth, requireRole } from '../middleware/auth';
import { logger } from '../utils/logger';
import {
  getTeacherAlerts,
  acknowledgeAlert,
  resolveAlert,
  dismissAlert,
  getAlertStats,
  getTeacherAlertPrefs,
  updateTeacherAlertPrefs
} from '../services/socratic.service';
import {
  getGradeCategories,
  createGradeCategory,
  updateGradeCategory,
  deleteGradeCategory,
  initializeDefaultCategories,
  getClassGradebook,
  recalculateClassGrades,
  updateGradebookEntry,
  calculateStudentGrade,
  getClassStatistics,
  getGradebookSettings
} from '../services/gradebook.service';

const router = Router();

// Apply authentication and role check to all teacher routes
router.use(requireAuth);
router.use(requireRole('TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN'));

// Helper to get branding
async function getBranding() {
  const branding = await prisma.branding.findFirst({ where: { id: 'default' } });
  return branding || {
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    accentColor: '#38bdf8'
  };
}

// Teacher Dashboard
router.get('/', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    // Get teacher's classes
    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId: userId },
      include: {
        class: {
          include: {
            subject: true,
            students: { include: { student: true } }
          }
        }
      }
    });

    // Get recent student sessions from teacher's classes
    const classIds = teacherClasses.map(tc => tc.classId);
    const studentIds = teacherClasses.flatMap(tc =>
      tc.class.students.map(s => s.studentId)
    );

    const recentSessions = await prisma.tutoringSession.findMany({
      where: { studentId: { in: studentIds } },
      include: {
        student: true,
        subject: true,
        topic: true
      },
      orderBy: { startedAt: 'desc' },
      take: 10
    });

    // Get stats
    const totalStudents = new Set(studentIds).size;
    const totalSessions = await prisma.tutoringSession.count({
      where: { studentId: { in: studentIds } }
    });

    res.render('teacher/dashboard', {
      title: 'Teacher Dashboard - TutorAI',
      branding,
      user: req.session.user,
      classes: teacherClasses.map(tc => tc.class),
      recentSessions,
      stats: {
        totalClasses: teacherClasses.length,
        totalStudents,
        totalSessions
      }
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Teacher dashboard error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Classes
router.get('/classes', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId: userId },
      include: {
        class: {
          include: {
            subject: { include: { category: true } },
            students: { include: { student: true } },
            school: true
          }
        }
      }
    });

    res.render('teacher/classes', {
      title: 'My Classes - TutorAI',
      branding,
      user: req.session.user,
      classes: teacherClasses.map(tc => tc.class)
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Classes error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Class Detail
router.get('/classes/:id', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    // Verify teacher has access to this class
    const teacherClass = await prisma.classTeacher.findFirst({
      where: {
        classId: req.params.id,
        teacherId: userId
      },
      include: {
        class: {
          include: {
            subject: { include: { category: true } },
            students: {
              include: {
                student: {
                  include: {
                    tutoringSessionsAsStudent: {
                      orderBy: { startedAt: 'desc' },
                      take: 5
                    }
                  }
                }
              }
            },
            school: true
          }
        }
      }
    });

    if (!teacherClass) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Class Not Found'
      });
    }

    res.render('teacher/class-detail', {
      title: `${teacherClass.class.name} - TutorAI`,
      branding,
      user: req.session.user,
      class: teacherClass.class
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Class detail error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Students
router.get('/students', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    // Get all students from teacher's classes
    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId: userId },
      include: {
        class: {
          include: {
            students: {
              include: {
                student: true
              }
            }
          }
        }
      }
    });

    // Deduplicate students
    const studentMap = new Map();
    teacherClasses.forEach(tc => {
      tc.class.students.forEach(cs => {
        if (!studentMap.has(cs.studentId)) {
          studentMap.set(cs.studentId, {
            ...cs.student,
            classes: [tc.class.name]
          });
        } else {
          studentMap.get(cs.studentId).classes.push(tc.class.name);
        }
      });
    });

    const students = Array.from(studentMap.values());

    res.render('teacher/students', {
      title: 'Students - TutorAI',
      branding,
      user: req.session.user,
      students
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Students error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Student Detail
router.get('/students/:id', async (req, res) => {
  try {
    const branding = await getBranding();

    const student = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        tutoringSessionsAsStudent: {
          include: {
            subject: true,
            topic: true
          },
          orderBy: { startedAt: 'desc' },
          take: 20
        },
        progress: {
          include: {
            topic: {
              include: {
                subject: true
              }
            }
          }
        }
      }
    });

    if (!student || student.role !== 'STUDENT') {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Student Not Found'
      });
    }

    res.render('teacher/student-detail', {
      title: `${student.firstName} ${student.lastName} - TutorAI`,
      branding,
      user: req.session.user,
      student
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Student detail error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Analytics
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    // Get teacher's students
    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId: userId },
      include: {
        class: {
          include: {
            students: true
          }
        }
      }
    });

    const studentIds = teacherClasses.flatMap(tc =>
      tc.class.students.map(s => s.studentId)
    );

    // Session stats over time
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessionsByDay = await prisma.tutoringSession.groupBy({
      by: ['startedAt'],
      where: {
        studentId: { in: studentIds },
        startedAt: { gte: thirtyDaysAgo }
      },
      _count: { id: true }
    });

    // Subject breakdown
    const sessionsBySubject = await prisma.tutoringSession.groupBy({
      by: ['subjectId'],
      where: { studentId: { in: studentIds } },
      _count: { id: true }
    });

    res.render('teacher/analytics', {
      title: 'Analytics - TutorAI',
      branding,
      user: req.session.user,
      sessionsByDay,
      sessionsBySubject
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Analytics error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// ============================================
// LESSON MANAGEMENT
// ============================================

// List Lessons
router.get('/lessons', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    // Get lessons created by this teacher
    const lessons = await prisma.lesson.findMany({
      where: { createdById: userId },
      include: {
        topic: {
          include: { subject: { include: { category: true } } }
        },
        class: true,
        assignments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.render('teacher/lessons', {
      title: 'Lessons - TutorAI',
      branding,
      user: req.session.user,
      lessons
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Lessons error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Create Lesson Form
router.get('/lessons/create', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    // Get subjects and topics for dropdown
    const categories = await prisma.subjectCategory.findMany({
      where: { isActive: true },
      include: {
        subjects: {
          where: { isActive: true },
          include: {
            topics: { where: { isActive: true } }
          }
        }
      }
    });

    // Get teacher's classes
    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId: userId },
      include: { class: true }
    });

    res.render('teacher/lesson-form', {
      title: 'Create Lesson - TutorAI',
      branding,
      user: req.session.user,
      lesson: null,
      categories,
      classes: teacherClasses.map(tc => tc.class),
      isEdit: false
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Create lesson form error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Save New Lesson
router.post('/lessons', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { title, description, content, topicId, classId, gradeLevel, duration } = req.body;

    // Generate unique code
    const code = `lesson-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    await prisma.lesson.create({
      data: {
        code,
        title,
        description: description || null,
        content,
        topicId,
        classId: classId || null,
        gradeLevel: gradeLevel ? parseInt(gradeLevel) : null,
        duration: duration ? parseInt(duration) : null,
        createdById: userId
      }
    });

    res.redirect(`${config.basePath}/teacher/lessons`);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Create lesson error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// View Lesson
router.get('/lessons/:id', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const lesson = await prisma.lesson.findFirst({
      where: { id: req.params.id, createdById: userId },
      include: {
        topic: { include: { subject: { include: { category: true } } } },
        class: true,
        assignments: {
          include: {
            submissions: { include: { student: true } }
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Lesson Not Found'
      });
    }

    res.render('teacher/lesson-detail', {
      title: `${lesson.title} - TutorAI`,
      branding,
      user: req.session.user,
      lesson
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Lesson detail error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Edit Lesson Form
router.get('/lessons/:id/edit', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const lesson = await prisma.lesson.findFirst({
      where: { id: req.params.id, createdById: userId },
      include: {
        topic: { include: { subject: true } },
        class: true
      }
    });

    if (!lesson) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Lesson Not Found'
      });
    }

    const categories = await prisma.subjectCategory.findMany({
      where: { isActive: true },
      include: {
        subjects: {
          where: { isActive: true },
          include: { topics: { where: { isActive: true } } }
        }
      }
    });

    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId: userId },
      include: { class: true }
    });

    res.render('teacher/lesson-form', {
      title: `Edit ${lesson.title} - TutorAI`,
      branding,
      user: req.session.user,
      lesson,
      categories,
      classes: teacherClasses.map(tc => tc.class),
      isEdit: true
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Edit lesson form error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Update Lesson
router.post('/lessons/:id', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { title, description, content, topicId, classId, gradeLevel, duration } = req.body;

    await prisma.lesson.updateMany({
      where: { id: req.params.id, createdById: userId },
      data: {
        title,
        description: description || null,
        content,
        topicId,
        classId: classId || null,
        gradeLevel: gradeLevel ? parseInt(gradeLevel) : null,
        duration: duration ? parseInt(duration) : null
      }
    });

    res.redirect(`${config.basePath}/teacher/lessons/${req.params.id}`);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update lesson error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Delete Lesson
router.post('/lessons/:id/delete', async (req, res) => {
  try {
    const userId = req.session.userId!;

    await prisma.lesson.deleteMany({
      where: { id: req.params.id, createdById: userId }
    });

    res.redirect(`${config.basePath}/teacher/lessons`);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Delete lesson error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// ============================================
// ASSIGNMENT MANAGEMENT
// ============================================

// List Assignments
router.get('/assignments', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const assignments = await prisma.assignment.findMany({
      where: { createdById: userId },
      include: {
        topic: { include: { subject: true } },
        class: true,
        student: true,
        lesson: true,
        submissions: { include: { student: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.render('teacher/assignments', {
      title: 'Assignments - TutorAI',
      branding,
      user: req.session.user,
      assignments
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Assignments error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Create Assignment Form
router.get('/assignments/create', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();
    const { lessonId } = req.query;

    // Get categories with subjects and topics
    const categories = await prisma.subjectCategory.findMany({
      where: { isActive: true },
      include: {
        subjects: {
          where: { isActive: true },
          include: { topics: { where: { isActive: true } } }
        }
      }
    });

    // Get teacher's classes
    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId: userId },
      include: {
        class: {
          include: {
            students: { include: { student: true } }
          }
        }
      }
    });

    // Get teacher's lessons
    const lessons = await prisma.lesson.findMany({
      where: { createdById: userId },
      orderBy: { title: 'asc' }
    });

    // Pre-selected lesson if provided
    let preselectedLesson = null;
    if (lessonId) {
      preselectedLesson = await prisma.lesson.findUnique({
        where: { id: lessonId as string }
      });
    }

    res.render('teacher/assignment-form', {
      title: 'Create Assignment - TutorAI',
      branding,
      user: req.session.user,
      assignment: null,
      categories,
      classes: teacherClasses.map(tc => tc.class),
      lessons,
      preselectedLesson,
      isEdit: false
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Create assignment form error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Save New Assignment
router.post('/assignments', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { title, instructions, topicId, lessonId, classId, studentId, type, dueDate, maxPoints, allowLate } = req.body;

    const code = `assign-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    await prisma.assignment.create({
      data: {
        code,
        title,
        instructions,
        topicId,
        lessonId: lessonId || null,
        classId: classId || null,
        studentId: studentId || null,
        type: type || 'homework',
        dueDate: dueDate ? new Date(dueDate) : null,
        maxPoints: maxPoints ? parseInt(maxPoints) : 100,
        allowLate: allowLate === 'on' || allowLate === 'true',
        createdById: userId
      }
    });

    res.redirect(`${config.basePath}/teacher/assignments`);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Create assignment error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// View Assignment with Submissions
router.get('/assignments/:id', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const assignment = await prisma.assignment.findFirst({
      where: { id: req.params.id, createdById: userId },
      include: {
        topic: { include: { subject: { include: { category: true } } } },
        class: { include: { students: { include: { student: true } } } },
        student: true,
        lesson: true,
        submissions: {
          include: {
            student: true,
            gradedBy: true
          },
          orderBy: { submittedAt: 'desc' }
        }
      }
    });

    if (!assignment) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Assignment Not Found'
      });
    }

    // Get list of students who should submit
    let expectedStudents: any[] = [];
    if (assignment.studentId) {
      expectedStudents = [assignment.student];
    } else if (assignment.class) {
      expectedStudents = assignment.class.students.map(cs => cs.student);
    }

    res.render('teacher/assignment-detail', {
      title: `${assignment.title} - TutorAI`,
      branding,
      user: req.session.user,
      assignment,
      expectedStudents
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Assignment detail error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Edit Assignment Form
router.get('/assignments/:id/edit', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const assignment = await prisma.assignment.findFirst({
      where: { id: req.params.id, createdById: userId },
      include: {
        topic: { include: { subject: true } },
        class: true,
        student: true,
        lesson: true
      }
    });

    if (!assignment) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Assignment Not Found'
      });
    }

    const categories = await prisma.subjectCategory.findMany({
      where: { isActive: true },
      include: {
        subjects: {
          where: { isActive: true },
          include: { topics: { where: { isActive: true } } }
        }
      }
    });

    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId: userId },
      include: {
        class: { include: { students: { include: { student: true } } } }
      }
    });

    const lessons = await prisma.lesson.findMany({
      where: { createdById: userId },
      orderBy: { title: 'asc' }
    });

    res.render('teacher/assignment-form', {
      title: `Edit ${assignment.title} - TutorAI`,
      branding,
      user: req.session.user,
      assignment,
      categories,
      classes: teacherClasses.map(tc => tc.class),
      lessons,
      preselectedLesson: null,
      isEdit: true
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Edit assignment form error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Update Assignment
router.post('/assignments/:id', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { title, instructions, topicId, lessonId, classId, studentId, type, dueDate, maxPoints, allowLate } = req.body;

    await prisma.assignment.updateMany({
      where: { id: req.params.id, createdById: userId },
      data: {
        title,
        instructions,
        topicId,
        lessonId: lessonId || null,
        classId: classId || null,
        studentId: studentId || null,
        type: type || 'homework',
        dueDate: dueDate ? new Date(dueDate) : null,
        maxPoints: maxPoints ? parseInt(maxPoints) : 100,
        allowLate: allowLate === 'on' || allowLate === 'true'
      }
    });

    res.redirect(`${config.basePath}/teacher/assignments/${req.params.id}`);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update assignment error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Delete Assignment
router.post('/assignments/:id/delete', async (req, res) => {
  try {
    const userId = req.session.userId!;

    await prisma.assignment.deleteMany({
      where: { id: req.params.id, createdById: userId }
    });

    res.redirect(`${config.basePath}/teacher/assignments`);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Delete assignment error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Grade Submission
router.post('/assignments/:id/grade/:submissionId', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { grade, feedback } = req.body;

    // Verify teacher owns the assignment
    const assignment = await prisma.assignment.findFirst({
      where: { id: req.params.id, createdById: userId }
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await prisma.submission.update({
      where: { id: req.params.submissionId },
      data: {
        grade: grade ? parseInt(grade) : null,
        feedback: feedback || null,
        gradedAt: new Date(),
        gradedById: userId,
        status: 'graded'
      }
    });

    res.redirect(`${config.basePath}/teacher/assignments/${req.params.id}`);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Grade submission error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// ============================================
// QUIZ MANAGEMENT
// ============================================

// List Quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const quizzes = await prisma.quiz.findMany({
      where: { createdById: userId },
      include: {
        topic: { include: { subject: true } },
        class: true,
        questions: true,
        attempts: { include: { student: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.render('teacher/quizzes', {
      title: 'Quizzes - TutorAI',
      branding,
      user: req.session.user,
      quizzes
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Quizzes error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Create Quiz Form
router.get('/quizzes/create', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const categories = await prisma.subjectCategory.findMany({
      where: { isActive: true },
      include: {
        subjects: {
          where: { isActive: true },
          include: { topics: { where: { isActive: true } } }
        }
      }
    });

    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId: userId },
      include: { class: true }
    });

    res.render('teacher/quiz-form', {
      title: 'Create Quiz - TutorAI',
      branding,
      user: req.session.user,
      quiz: null,
      categories,
      classes: teacherClasses.map(tc => tc.class),
      isEdit: false
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Create quiz form error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Save New Quiz
router.post('/quizzes', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { title, description, topicId, classId, timeLimit, passingScore, maxAttempts, randomize, showAnswers, questions } = req.body;

    const code = `quiz-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const quiz = await prisma.quiz.create({
      data: {
        code,
        title,
        description: description || null,
        topicId,
        classId: classId || null,
        timeLimit: timeLimit ? parseInt(timeLimit) : null,
        passingScore: passingScore ? parseInt(passingScore) : 70,
        maxAttempts: maxAttempts ? parseInt(maxAttempts) : 3,
        randomize: randomize === 'on',
        showAnswers: showAnswers !== 'off',
        createdById: userId
      }
    });

    // Create questions if provided
    if (questions && Array.isArray(questions)) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (q.questionText) {
          await prisma.quizQuestion.create({
            data: {
              quizId: quiz.id,
              questionNum: i + 1,
              questionText: q.questionText,
              questionType: q.questionType || 'multiple_choice',
              options: q.options ? JSON.stringify(q.options) : null,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation || null,
              points: q.points ? parseInt(q.points) : 1
            }
          });
        }
      }
    }

    res.redirect(`${config.basePath}/teacher/quizzes/${quiz.id}`);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Create quiz error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// View Quiz with Results
router.get('/quizzes/:id', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const quiz = await prisma.quiz.findFirst({
      where: { id: req.params.id, createdById: userId },
      include: {
        topic: { include: { subject: { include: { category: true } } } },
        class: true,
        questions: { orderBy: { questionNum: 'asc' } },
        attempts: {
          include: {
            student: true,
            answers: true
          },
          orderBy: { startedAt: 'desc' }
        }
      }
    });

    if (!quiz) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Quiz Not Found'
      });
    }

    res.render('teacher/quiz-detail', {
      title: `${quiz.title} - TutorAI`,
      branding,
      user: req.session.user,
      quiz
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Quiz detail error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Edit Quiz Form
router.get('/quizzes/:id/edit', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const quiz = await prisma.quiz.findFirst({
      where: { id: req.params.id, createdById: userId },
      include: {
        topic: { include: { subject: { include: { category: true } } } },
        class: true,
        questions: { orderBy: { questionNum: 'asc' } }
      }
    });

    if (!quiz) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Quiz Not Found'
      });
    }

    const categories = await prisma.subjectCategory.findMany({
      where: { isActive: true },
      include: {
        subjects: {
          where: { isActive: true },
          include: { topics: { where: { isActive: true } } }
        }
      }
    });

    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId: userId },
      include: { class: true }
    });

    res.render('teacher/quiz-form', {
      title: `Edit Quiz - ${quiz.title} - TutorAI`,
      branding,
      user: req.session.user,
      quiz,
      categories,
      classes: teacherClasses.map(tc => tc.class),
      isEdit: true
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Edit quiz form error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Update Quiz
router.post('/quizzes/:id', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { title, description, topicId, classId, timeLimit, passingScore, maxAttempts, randomize, showAnswers, questions } = req.body;

    // Verify ownership
    const existingQuiz = await prisma.quiz.findFirst({
      where: { id: req.params.id, createdById: userId }
    });

    if (!existingQuiz) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Quiz Not Found'
      });
    }

    // Update quiz
    await prisma.quiz.update({
      where: { id: req.params.id },
      data: {
        title,
        description: description || null,
        topicId,
        classId: classId || null,
        timeLimit: timeLimit ? parseInt(timeLimit) : null,
        passingScore: passingScore ? parseInt(passingScore) : 70,
        maxAttempts: maxAttempts ? parseInt(maxAttempts) : 3,
        randomize: randomize === 'on',
        showAnswers: showAnswers !== 'off'
      }
    });

    // Delete existing questions and recreate
    await prisma.quizQuestion.deleteMany({
      where: { quizId: req.params.id }
    });

    // Create new questions if provided
    if (questions && Array.isArray(questions)) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (q.questionText) {
          await prisma.quizQuestion.create({
            data: {
              quizId: req.params.id,
              questionNum: i + 1,
              questionText: q.questionText,
              questionType: q.questionType || 'multiple_choice',
              options: q.options ? JSON.stringify(q.options) : null,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation || null,
              points: q.points ? parseInt(q.points) : 1
            }
          });
        }
      }
    }

    res.redirect(`${config.basePath}/teacher/quizzes/${req.params.id}`);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update quiz error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Delete Quiz
router.post('/quizzes/:id/delete', async (req, res) => {
  try {
    const userId = req.session.userId!;

    await prisma.quiz.deleteMany({
      where: { id: req.params.id, createdById: userId }
    });

    res.redirect(`${config.basePath}/teacher/quizzes`);

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Delete quiz error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// ============================================
// STUDENT ALERTS (Struggling Detection)
// ============================================

// View Student Alerts Dashboard
router.get('/alerts', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();
    const { status, severity } = req.query;

    // Get alerts for teacher's students
    const alerts = await getTeacherAlerts(userId, {
      status: status as string | undefined,
      severity: severity as string | undefined,
      limit: 50
    });

    // Get alert statistics
    const stats = await getAlertStats(userId);

    // Get teacher's alert preferences
    const prefs = await getTeacherAlertPrefs(userId);

    res.render('teacher/alerts', {
      title: 'Student Alerts - TutorAI',
      branding,
      user: req.session.user,
      alerts,
      stats,
      prefs,
      filters: { status, severity }
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Teacher alerts error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Get alerts as JSON (for AJAX refresh)
router.get('/alerts/json', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { status, severity } = req.query;

    const alerts = await getTeacherAlerts(userId, {
      status: status as string | undefined,
      severity: severity as string | undefined,
      limit: 50
    });

    const stats = await getAlertStats(userId);

    res.json({ success: true, alerts, stats });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Get alerts JSON error:');
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

// Acknowledge an alert
router.post('/alerts/:id/acknowledge', async (req, res) => {
  try {
    const userId = req.session.userId!;

    await acknowledgeAlert(req.params.id, userId);

    // Check if AJAX request
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true });
    } else {
      res.redirect(`${config.basePath}/teacher/alerts`);
    }

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Acknowledge alert error:');
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({ error: 'Failed to acknowledge alert' });
    } else {
      res.redirect(`${config.basePath}/teacher/alerts`);
    }
  }
});

// Resolve an alert
router.post('/alerts/:id/resolve', async (req, res) => {
  try {
    const { resolution } = req.body;

    await resolveAlert(req.params.id, resolution || 'Resolved by teacher');

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true });
    } else {
      res.redirect(`${config.basePath}/teacher/alerts`);
    }

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Resolve alert error:');
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({ error: 'Failed to resolve alert' });
    } else {
      res.redirect(`${config.basePath}/teacher/alerts`);
    }
  }
});

// Dismiss an alert
router.post('/alerts/:id/dismiss', async (req, res) => {
  try {
    await dismissAlert(req.params.id);

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true });
    } else {
      res.redirect(`${config.basePath}/teacher/alerts`);
    }

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Dismiss alert error:');
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({ error: 'Failed to dismiss alert' });
    } else {
      res.redirect(`${config.basePath}/teacher/alerts`);
    }
  }
});

// Update alert preferences
router.post('/alerts/preferences', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const {
      receiveStrugglingAlerts,
      receiveLowScoreAlerts,
      receiveInactivityAlerts,
      receiveHelpRequests,
      alertInApp,
      alertEmail,
      alertSms,
      strugglingThreshold,
      inactivityMinutes,
      lowScoreThreshold
    } = req.body;

    await updateTeacherAlertPrefs(userId, {
      receiveStrugglingAlerts: receiveStrugglingAlerts === 'on' || receiveStrugglingAlerts === 'true',
      receiveLowScoreAlerts: receiveLowScoreAlerts === 'on' || receiveLowScoreAlerts === 'true',
      receiveInactivityAlerts: receiveInactivityAlerts === 'on' || receiveInactivityAlerts === 'true',
      receiveHelpRequests: receiveHelpRequests === 'on' || receiveHelpRequests === 'true',
      alertInApp: alertInApp === 'on' || alertInApp === 'true',
      alertEmail: alertEmail === 'on' || alertEmail === 'true',
      alertSms: alertSms === 'on' || alertSms === 'true',
      strugglingThreshold: strugglingThreshold ? parseInt(strugglingThreshold) : 3,
      inactivityMinutes: inactivityMinutes ? parseInt(inactivityMinutes) : 10,
      lowScoreThreshold: lowScoreThreshold ? parseInt(lowScoreThreshold) : 50
    });

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true });
    } else {
      res.redirect(`${config.basePath}/teacher/alerts`);
    }

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update alert prefs error:');
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({ error: 'Failed to update preferences' });
    } else {
      res.redirect(`${config.basePath}/teacher/alerts`);
    }
  }
});

// ============================================
// GRADEBOOK
// ============================================

// Class Gradebook View
router.get('/classes/:classId/gradebook', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();
    const { classId } = req.params;

    // Verify teacher has access to this class
    const teacherClass = await prisma.classTeacher.findFirst({
      where: { teacherId: userId, classId },
      include: {
        class: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!teacherClass) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Class Not Found'
      });
    }

    // Initialize default categories if none exist
    await initializeDefaultCategories(classId);

    // Get gradebook data
    const gradebook = await getClassGradebook(classId);
    const categories = await getGradeCategories(classId);
    const statistics = await getClassStatistics(classId);
    const settings = await getGradebookSettings();

    res.render('teacher/gradebook', {
      title: `Gradebook - ${teacherClass.class.name} - TutorAI`,
      branding,
      user: req.session.user,
      classData: teacherClass.class,
      gradebook,
      categories,
      statistics,
      settings
    });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Gradebook error:');
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Get gradebook JSON (for AJAX)
router.get('/classes/:classId/gradebook/json', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { classId } = req.params;

    // Verify access
    const teacherClass = await prisma.classTeacher.findFirst({
      where: { teacherId: userId, classId }
    });

    if (!teacherClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const gradebook = await getClassGradebook(classId);
    const statistics = await getClassStatistics(classId);

    res.json({ success: true, gradebook, statistics });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Get gradebook JSON error:');
    res.status(500).json({ error: 'Failed to get gradebook' });
  }
});

// Recalculate all grades for a class
router.post('/classes/:classId/gradebook/recalculate', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { classId } = req.params;

    // Verify access
    const teacherClass = await prisma.classTeacher.findFirst({
      where: { teacherId: userId, classId }
    });

    if (!teacherClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    await recalculateClassGrades(classId);

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true });
    } else {
      res.redirect(`${config.basePath}/teacher/classes/${classId}/gradebook`);
    }

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Recalculate grades error:');
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({ error: 'Failed to recalculate grades' });
    } else {
      res.redirect(`${config.basePath}/teacher/classes/${req.params.classId}/gradebook`);
    }
  }
});

// Calculate individual student grade
router.post('/classes/:classId/gradebook/student/:studentId/calculate', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { classId, studentId } = req.params;

    // Verify access
    const teacherClass = await prisma.classTeacher.findFirst({
      where: { teacherId: userId, classId }
    });

    if (!teacherClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    await updateGradebookEntry(studentId, classId);
    const grade = await calculateStudentGrade(studentId, classId);

    res.json({ success: true, grade });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Calculate student grade error:');
    res.status(500).json({ error: 'Failed to calculate grade' });
  }
});

// ============================================
// GRADE CATEGORIES MANAGEMENT
// ============================================

// Get categories for a class
router.get('/classes/:classId/gradebook/categories', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { classId } = req.params;

    const teacherClass = await prisma.classTeacher.findFirst({
      where: { teacherId: userId, classId }
    });

    if (!teacherClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const categories = await getGradeCategories(classId);
    res.json({ success: true, categories });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Get categories error:');
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Create a grade category
router.post('/classes/:classId/gradebook/categories', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { classId } = req.params;
    const { name, weight, dropLowest, color, order } = req.body;

    const teacherClass = await prisma.classTeacher.findFirst({
      where: { teacherId: userId, classId }
    });

    if (!teacherClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const category = await createGradeCategory({
      classId,
      name,
      weight: parseFloat(weight) || 1.0,
      dropLowest: dropLowest ? parseInt(dropLowest) : 0,
      color,
      order: order ? parseInt(order) : 0
    });

    res.json({ success: true, category });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Create category error:');
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update a grade category
router.put('/classes/:classId/gradebook/categories/:categoryId', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { classId, categoryId } = req.params;
    const { name, weight, dropLowest, color, order } = req.body;

    const teacherClass = await prisma.classTeacher.findFirst({
      where: { teacherId: userId, classId }
    });

    if (!teacherClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const category = await updateGradeCategory(categoryId, {
      name,
      weight: weight !== undefined ? parseFloat(weight) : undefined,
      dropLowest: dropLowest !== undefined ? parseInt(dropLowest) : undefined,
      color,
      order: order !== undefined ? parseInt(order) : undefined
    });

    res.json({ success: true, category });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Update category error:');
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete a grade category
router.delete('/classes/:classId/gradebook/categories/:categoryId', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { classId, categoryId } = req.params;

    const teacherClass = await prisma.classTeacher.findFirst({
      where: { teacherId: userId, classId }
    });

    if (!teacherClass) {
      return res.status(404).json({ error: 'Class not found' });
    }

    await deleteGradeCategory(categoryId);

    res.json({ success: true });

  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Delete category error:');
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
