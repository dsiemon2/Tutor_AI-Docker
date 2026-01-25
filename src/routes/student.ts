// TutorAI Student Routes
// Student dashboard, subjects, tutoring interface

import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { config } from '../config';
import { logger } from '../utils/logger';
import { requireAuth, requireRole, requireMinRole } from '../middleware/auth';
import { SUBJECT_CATEGORIES, GRADE_LEVELS, ROLE_HIERARCHY } from '../config/constants';
import { exportUserData, requestAccountDeletion, cancelDeletionRequest, getDeletionStatus } from '../services/gdpr.service';
import { logUserAction, AuditAction } from '../services/audit.service';
import {
  exportStudentProgressCSV,
  exportSessionsCSV,
  generateProgressReportHTML,
  generateSessionTranscriptHTML,
  generateAssignmentsIcal,
  generateSessionsIcal
} from '../services/report.service';
import {
  getUserBadges,
  getEarnedBadges,
  getAllBadges,
  getStreak,
  updateStreak,
  getPointBalance,
  getPointHistory,
  getLeaderboard,
  getUserRank,
  getUserActivity,
  getPublicActivity,
  getAnnouncementsForUser,
  markAnnouncementRead,
  getUnreadAnnouncementCount
} from '../services/gamification.service';
import {
  getDiagnosticTests,
  getDiagnosticTest,
  startDiagnosticAttempt,
  getNextQuestion,
  submitAnswer,
  completeAttempt,
  getStudentDiagnosticHistory,
  getStudentSkillGaps,
  getPlacementRecommendation
} from '../services/diagnostic.service';
import {
  startPracticeSession,
  submitPracticeAnswer,
  endPracticeSession,
  getPracticeItem,
  getPracticeStats,
  getDueItems,
  DEFAULT_PRACTICE_SETTINGS,
  type PracticeSession,
  type PracticeItem
} from '../services/practice.service';
import {
  getAllLearningPaths,
  getLearningPathsBySubject,
  getStudentMastery,
  getStudentPathProgress,
  getStudentDashboardData,
  calculatePathProgress,
  getAvailableNodes,
  getNextRecommendedNode,
  recommendPaths,
  formatMasteryLevel,
  getMasteryColor,
  getMasteryBadge,
  MASTERY_THRESHOLDS,
  type LearningPath
} from '../services/learningPath.service';

const router = Router();

// Apply authentication to all student routes
router.use(requireAuth);

// Helper to get branding
async function getBranding() {
  const branding = await prisma.branding.findFirst({ where: { id: 'default' } });
  return branding || {
    primaryColor: '#0ea5e9',
    secondaryColor: '#0284c7',
    accentColor: '#38bdf8'
  };
}

// Helper: Get grade level label for display
function getGradeLabel(gradeLevel: number | null | undefined): string {
  if (gradeLevel === null || gradeLevel === undefined) return 'Not Set';
  if (gradeLevel === -2) return 'Pre-K 3';
  if (gradeLevel === -1) return 'Pre-K 4';
  if (gradeLevel === 0) return 'Kindergarten';
  return `Grade ${gradeLevel}`;
}

// Helper: Get role display label
function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    'SUPER_ADMIN': 'Super Admin',
    'DISTRICT_ADMIN': 'District Admin',
    'PRINCIPAL': 'Principal',
    'VICE_PRINCIPAL': 'Vice Principal',
    'DEPARTMENT_HEAD': 'Department Head',
    'TEACHER': 'Teacher',
    'STUDENT': 'Student'
  };
  return labels[role] || role;
}

// Helper: Check if user can use "View As Student" feature
function canViewAsStudent(role: string): boolean {
  const adminRoles = ['SUPER_ADMIN', 'DISTRICT_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'DEPARTMENT_HEAD', 'TEACHER'];
  return adminRoles.includes(role);
}

// Helper: Get effective student ID (view-as or logged-in user)
function getEffectiveStudentId(session: any): string | null {
  // If viewing as a student, use that student's ID
  if (session.viewAsStudentId) {
    return session.viewAsStudentId;
  }
  // If the logged-in user is a student, use their ID
  if (session.role === 'STUDENT') {
    return session.userId;
  }
  // Admin viewing student portal without selecting a student
  return null;
}

// Helper: Get class IDs that a user has access to (for teachers/admins)
async function getAccessibleClassIds(session: any): Promise<string[]> {
  const { role, userId, schoolId, districtId } = session;

  // TEACHER: get classes they teach
  if (role === 'TEACHER') {
    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId: userId },
      select: { classId: true }
    });
    return teacherClasses.map(tc => tc.classId);
  }

  // DEPARTMENT_HEAD, VP, PRINCIPAL: get all classes in their school
  if (['DEPARTMENT_HEAD', 'VICE_PRINCIPAL', 'PRINCIPAL'].includes(role) && schoolId) {
    const schoolClasses = await prisma.class.findMany({
      where: { schoolId },
      select: { id: true }
    });
    return schoolClasses.map(c => c.id);
  }

  // DISTRICT_ADMIN: get all classes in their district
  if (role === 'DISTRICT_ADMIN' && districtId) {
    const districtClasses = await prisma.class.findMany({
      where: { school: { districtId } },
      select: { id: true }
    });
    return districtClasses.map(c => c.id);
  }

  // SUPER_ADMIN: get all classes
  if (role === 'SUPER_ADMIN') {
    const allClasses = await prisma.class.findMany({
      select: { id: true }
    });
    return allClasses.map(c => c.id);
  }

  return [];
}

// Helper: Get student IDs that a user has access to (for viewing data)
async function getAccessibleStudentIds(session: any): Promise<string[]> {
  const { role, userId, schoolId, districtId } = session;

  // TEACHER: get students in their classes
  if (role === 'TEACHER') {
    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId: userId },
      select: { classId: true }
    });
    const classIds = teacherClasses.map(tc => tc.classId);
    const students = await prisma.classStudent.findMany({
      where: { classId: { in: classIds } },
      select: { studentId: true }
    });
    return [...new Set(students.map(s => s.studentId))];
  }

  // School leadership: get all students in their school
  if (['DEPARTMENT_HEAD', 'VICE_PRINCIPAL', 'PRINCIPAL'].includes(role) && schoolId) {
    const students = await prisma.user.findMany({
      where: { schoolId, role: 'STUDENT' },
      select: { id: true }
    });
    return students.map(s => s.id);
  }

  // DISTRICT_ADMIN: get all students in their district
  if (role === 'DISTRICT_ADMIN' && districtId) {
    const students = await prisma.user.findMany({
      where: { school: { districtId }, role: 'STUDENT' },
      select: { id: true }
    });
    return students.map(s => s.id);
  }

  // SUPER_ADMIN: get all students
  if (role === 'SUPER_ADMIN') {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true }
    });
    return students.map(s => s.id);
  }

  return [];
}

// Helper: Check view-as permission based on role
async function checkViewAsPermission(session: any, student: any): Promise<boolean> {
  const { role, schoolId, districtId, userId } = session;

  // SUPER_ADMIN can view any student
  if (role === 'SUPER_ADMIN') return true;

  // DISTRICT_ADMIN can view students in their district
  if (role === 'DISTRICT_ADMIN' && districtId) {
    return student.school?.districtId === districtId;
  }

  // PRINCIPAL, VP, DEPT_HEAD can view students in their school
  if (['PRINCIPAL', 'VICE_PRINCIPAL', 'DEPARTMENT_HEAD'].includes(role)) {
    return student.schoolId === schoolId;
  }

  // TEACHER can only view students in their classes
  if (role === 'TEACHER' && userId) {
    const teacherClasses = await prisma.classTeacher.findMany({
      where: { teacherId: userId },
      include: { class: { include: { students: true } } }
    });
    const studentIds = teacherClasses.flatMap(tc => tc.class.students.map((s: any) => s.studentId));
    return studentIds.includes(student.id);
  }

  return false;
}

// Middleware: Block write operations in View-As mode
function blockInViewAsMode(req: Request, res: Response, next: NextFunction) {
  if (req.session.viewAsStudentId) {
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(403).json({
        error: 'Cannot perform this action while viewing as another student'
      });
    }
    return res.redirect(`${config.basePath}/student?error=view_as_readonly`);
  }
  next();
}

// ============================================
// VIEW-AS STUDENT ROUTES
// ============================================

// API: Get list of students that current user can view
router.get('/api/view-as-students', async (req, res) => {
  try {
    const { role, schoolId, districtId, userId } = req.session;

    if (!canViewAsStudent(role || '')) {
      return res.status(403).json({ error: 'Not authorized to view students' });
    }

    let whereClause: any = { role: 'STUDENT', isActive: true };

    if (role === 'SUPER_ADMIN') {
      // Can see all students
    } else if (role === 'DISTRICT_ADMIN' && districtId) {
      whereClause.school = { districtId };
    } else if (['PRINCIPAL', 'VICE_PRINCIPAL', 'DEPARTMENT_HEAD'].includes(role || '')) {
      whereClause.schoolId = schoolId;
    } else if (role === 'TEACHER') {
      const teacherClasses = await prisma.classTeacher.findMany({
        where: { teacherId: userId },
        include: { class: { include: { students: true } } }
      });
      const studentIds = teacherClasses.flatMap(tc => tc.class.students.map((s: any) => s.studentId));
      if (studentIds.length === 0) {
        return res.json({ students: [] });
      }
      whereClause.id = { in: studentIds };
    }

    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        gradeLevel: true,
        school: { select: { name: true } }
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      take: 500
    });

    // Add grade labels
    const studentsWithLabels = students.map(s => ({
      ...s,
      gradeLabel: getGradeLabel(s.gradeLevel)
    }));

    res.json({ students: studentsWithLabels });
  } catch (error) {
    logger.error('View-as students error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ error: 'Failed to load students' });
  }
});

// POST: Start viewing as a student
router.post('/view-as/start', async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!canViewAsStudent(req.session.role || '')) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: { school: true }
    });

    if (!student || student.role !== 'STUDENT') {
      return res.status(404).json({ error: 'Student not found' });
    }

    const hasPermission = await checkViewAsPermission(req.session, student);
    if (!hasPermission) {
      return res.status(403).json({ error: 'You do not have permission to view this student' });
    }

    // Set session variables
    req.session.viewAsStudentId = studentId;
    req.session.viewAsStudentName = `${student.firstName} ${student.lastName}`;

    res.redirect(`${config.basePath}/student`);
  } catch (error) {
    logger.error('View-as start error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ error: 'Failed to start view-as session' });
  }
});

// POST/GET: Exit viewing as a student
router.all('/view-as/exit', async (req, res) => {
  delete req.session.viewAsStudentId;
  delete req.session.viewAsStudentName;
  res.redirect(`${config.basePath}/student`);
});

// ============================================
// STUDENT ROUTES
// ============================================

// Student Dashboard
router.get('/', async (req, res) => {
  try {
    const branding = await getBranding();
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const isViewingAs = !!req.session.viewAsStudentId;
    const canViewAs = canViewAsStudent(req.session.role || '');

    // Get logged-in user for display
    const loggedInUser = await prisma.user.findUnique({
      where: { id: req.session.userId! },
      include: { school: true }
    });

    if (!loggedInUser) {
      req.session.destroy(() => {});
      return res.redirect(`${config.basePath}/auth/login`);
    }

    // If admin viewing without selecting a student, show prompt
    if (!effectiveStudentId && canViewAs) {
      return res.render('student/dashboard', {
        title: 'Dashboard - TutorAI',
        branding,
        user: loggedInUser,
        roleLabel: getRoleLabel(loggedInUser.role),
        isViewingAs: false,
        viewAsStudentName: null,
        canViewAs: true,
        recentSessions: [],
        progressSummary: [],
        sessionStats: { totalSessions: 0, totalMinutes: 0 },
        subjectCategories: SUBJECT_CATEGORIES,
        gradeLevels: GRADE_LEVELS,
        showSelectStudentPrompt: true
      });
    }

    // Get the effective user (either viewing-as student or logged-in student)
    const displayUser = effectiveStudentId && isViewingAs
      ? await prisma.user.findUnique({ where: { id: effectiveStudentId }, include: { school: true } })
      : loggedInUser;

    // Get recent sessions for effective student
    const recentSessions = effectiveStudentId ? await prisma.tutoringSession.findMany({
      where: { studentId: effectiveStudentId },
      include: {
        subject: { include: { category: true } },
        topic: true
      },
      orderBy: { startedAt: 'desc' },
      take: 5
    }) : [];

    // Get progress summary for effective student
    const progressSummary = effectiveStudentId ? await prisma.studentProgress.findMany({
      where: { studentId: effectiveStudentId },
      include: { topic: { include: { subject: true } } },
      orderBy: { lastActivityAt: 'desc' },
      take: 6
    }) : [];

    // Get session stats for effective student
    const sessionStats = effectiveStudentId ? await prisma.tutoringSession.aggregate({
      where: { studentId: effectiveStudentId },
      _count: { id: true },
      _sum: { duration: true }
    }) : { _count: { id: 0 }, _sum: { duration: 0 } };

    res.render('student/dashboard', {
      title: 'Dashboard - TutorAI',
      branding,
      user: displayUser || loggedInUser,
      roleLabel: getRoleLabel(loggedInUser.role),
      isViewingAs,
      viewAsStudentName: req.session.viewAsStudentName,
      canViewAs,
      recentSessions,
      progressSummary,
      sessionStats: {
        totalSessions: sessionStats._count.id,
        totalMinutes: Math.floor((sessionStats._sum.duration || 0) / 60)
      },
      subjectCategories: SUBJECT_CATEGORIES,
      gradeLevels: GRADE_LEVELS,
      showSelectStudentPrompt: false
    });

  } catch (error) {
    logger.error('Dashboard error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Subject Browser
router.get('/subjects', async (req, res) => {
  try {
    const branding = await getBranding();
    const isViewingAs = !!req.session.viewAsStudentId;
    const canViewAs = canViewAsStudent(req.session.role || '');

    const loggedInUser = await prisma.user.findUnique({
      where: { id: req.session.userId! },
      include: { school: true }
    });

    // Get subject categories with subjects
    const categories = await prisma.subjectCategory.findMany({
      where: { isActive: true },
      include: {
        subjects: {
          where: { isActive: true },
          include: { topics: { where: { isActive: true } } }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.render('student/subjects', {
      title: 'Subjects - TutorAI',
      branding,
      user: loggedInUser,
      roleLabel: getRoleLabel(loggedInUser?.role || 'STUDENT'),
      isViewingAs,
      viewAsStudentName: req.session.viewAsStudentName,
      canViewAs,
      categories
    });

  } catch (error) {
    logger.error('Subjects error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Subject Detail
router.get('/subjects/:categoryCode', async (req, res) => {
  try {
    const branding = await getBranding();
    const { categoryCode } = req.params;
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const isViewingAs = !!req.session.viewAsStudentId;
    const canViewAs = canViewAsStudent(req.session.role || '');

    // Get logged-in user
    const loggedInUser = await prisma.user.findUnique({
      where: { id: req.session.userId! },
      include: { school: true }
    });

    // Get the effective user's grade level (for view-as or actual student)
    let studentGrade: number | null = null;
    if (effectiveStudentId) {
      const effectiveUser = isViewingAs
        ? await prisma.user.findUnique({ where: { id: effectiveStudentId } })
        : loggedInUser;
      studentGrade = effectiveUser?.gradeLevel ?? null;
    }

    const category = await prisma.subjectCategory.findUnique({
      where: { code: categoryCode },
      include: {
        subjects: {
          where: { isActive: true },
          include: {
            topics: {
              where: { isActive: true },
              orderBy: [
                { gradeLevel: 'asc' },
                { order: 'asc' }
              ]
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!category) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Subject Not Found'
      });
    }

    // Add grade indicators to topics with proper labels for preschool
    const categoryWithGradeInfo = {
      ...category,
      subjects: category.subjects.map(subject => ({
        ...subject,
        topics: subject.topics.map(topic => ({
          ...topic,
          isAdvanced: studentGrade !== null && topic.gradeLevel !== null && topic.gradeLevel > studentGrade,
          isBelow: studentGrade !== null && topic.gradeLevel !== null && topic.gradeLevel < studentGrade - 2,
          gradeLabel: getGradeLabel(topic.gradeLevel)
        }))
      }))
    };

    res.render('student/subject-detail', {
      title: `${category.name} - TutorAI`,
      branding,
      user: loggedInUser,
      roleLabel: getRoleLabel(loggedInUser?.role || 'STUDENT'),
      isViewingAs,
      viewAsStudentName: req.session.viewAsStudentName,
      canViewAs,
      category: categoryWithGradeInfo,
      studentGrade,
      studentGradeLabel: getGradeLabel(studentGrade)
    });

  } catch (error) {
    logger.error('Subject detail error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Topic Detail - Shows lessons, assignments, quizzes for a topic
router.get('/topics/:id', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const topic = await prisma.topic.findUnique({
      where: { id: req.params.id },
      include: {
        subject: {
          include: { category: true }
        }
      }
    });

    if (!topic) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Topic Not Found'
      });
    }

    // Get student's class enrollments
    const enrollments = await prisma.classStudent.findMany({
      where: { studentId: userId },
      select: { classId: true }
    });
    const classIds = enrollments.map(e => e.classId);

    // Get lessons for this topic (from student's classes or with no class restriction)
    const lessons = await prisma.lesson.findMany({
      where: {
        topicId: topic.id,
        isActive: true,
        OR: [
          { classId: { in: classIds } },
          { classId: null }
        ]
      },
      orderBy: { order: 'asc' }
    });

    // Get assignments for this topic
    const assignments = await prisma.assignment.findMany({
      where: {
        topicId: topic.id,
        isActive: true,
        OR: [
          { classId: { in: classIds } },
          { studentId: userId }
        ]
      }
    });

    // Get quizzes for this topic
    const quizzes = await prisma.quiz.findMany({
      where: {
        topicId: topic.id,
        isActive: true,
        OR: [
          { classId: { in: classIds } },
          { classId: null }
        ]
      },
      include: { questions: true }
    });

    // Get student's progress for this topic
    const progress = await prisma.studentProgress.findUnique({
      where: {
        studentId_topicId: {
          studentId: userId,
          topicId: topic.id
        }
      }
    });

    res.render('student/topic-detail', {
      title: `${topic.name} - TutorAI`,
      branding,
      user: req.session.user,
      topic,
      lessons,
      assignments,
      quizzes,
      progress
    });

  } catch (error) {
    logger.error('Topic detail error:', { error: error instanceof Error ? error.message : String(error) });
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

    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: {
        topic: {
          include: {
            subject: { include: { category: true } }
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

    // Get all lessons in this topic for navigation
    const topicLessons = await prisma.lesson.findMany({
      where: {
        topicId: lesson.topicId,
        isActive: true
      },
      orderBy: { order: 'asc' }
    });

    // Get related assignment (if any)
    const relatedAssignment = await prisma.assignment.findFirst({
      where: {
        lessonId: lesson.id,
        isActive: true
      }
    });

    res.render('student/lesson-view', {
      title: `${lesson.title} - TutorAI`,
      branding,
      user: req.session.user,
      lesson,
      topicLessons,
      relatedAssignment
    });

  } catch (error) {
    logger.error('Lesson view error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Tutoring Interface
router.get('/tutor', async (req, res) => {
  try {
    const branding = await getBranding();
    const { subjectId, topicId, lessonId } = req.query;

    // Get subject/topic/lesson if provided
    let subject = null;
    let topic = null;
    let lesson = null;

    if (lessonId) {
      // If lessonId provided, get full lesson with topic and subject
      lesson = await prisma.lesson.findUnique({
        where: { id: lessonId as string },
        include: {
          topic: {
            include: {
              subject: { include: { category: true } }
            }
          }
        }
      });
      if (lesson) {
        topic = lesson.topic;
        subject = lesson.topic?.subject;
      }
    } else if (topicId) {
      topic = await prisma.topic.findUnique({
        where: { id: topicId as string },
        include: { subject: { include: { category: true } } }
      });
      if (topic) {
        subject = topic.subject;
      }
    } else if (subjectId) {
      subject = await prisma.subject.findUnique({
        where: { id: subjectId as string },
        include: { category: true }
      });
    }

    // Get greeting
    const greeting = await prisma.greeting.findFirst({ where: { id: 'default' } });

    // Get AI config
    const aiConfig = await prisma.aIConfig.findFirst({ where: { id: 'default' } });

    res.render('student/tutor', {
      title: lesson ? `Tutor: ${lesson.title} - TutorAI` : 'Tutor - TutorAI',
      branding,
      user: req.session.user,
      subject,
      topic,
      lesson,
      greeting: greeting || {
        welcomeTitle: 'Welcome to TutorAI!',
        welcomeMessage: "I'm your AI tutor. What would you like to learn today?",
        voiceGreeting: "Hello! I'm your AI tutor. How can I help you today?"
      },
      aiConfig: aiConfig || {
        voiceId: 'alloy',
        enableVoice: true,
        enableVision: true
      }
    });

  } catch (error) {
    logger.error('Tutor interface error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Session History
router.get('/sessions', async (req, res) => {
  try {
    const branding = await getBranding();
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const isViewingAs = !!req.session.viewAsStudentId;
    const canViewAs = canViewAsStudent(req.session.role || '');

    const loggedInUser = await prisma.user.findUnique({
      where: { id: req.session.userId! },
      include: { school: true }
    });

    let sessions: any[] = [];

    if (effectiveStudentId) {
      // Viewing as a specific student - show their sessions
      sessions = await prisma.tutoringSession.findMany({
        where: { studentId: effectiveStudentId },
        include: {
          subject: { include: { category: true } },
          topic: true,
          student: true,
          messages: { take: 1 }
        },
        orderBy: { startedAt: 'desc' }
      });
    } else if (canViewAs) {
      // Admin/Teacher viewing without specific student - show all accessible sessions
      const accessibleStudentIds = await getAccessibleStudentIds(req.session);

      sessions = await prisma.tutoringSession.findMany({
        where: accessibleStudentIds.length > 0 ? { studentId: { in: accessibleStudentIds } } : {},
        include: {
          subject: { include: { category: true } },
          topic: true,
          student: true,
          messages: { take: 1 }
        },
        orderBy: { startedAt: 'desc' },
        take: 50
      });
    } else {
      // Fallback: show all sessions
      sessions = await prisma.tutoringSession.findMany({
        include: {
          subject: { include: { category: true } },
          topic: true,
          student: true,
          messages: { take: 1 }
        },
        orderBy: { startedAt: 'desc' },
        take: 50
      });
    }

    res.render('student/sessions', {
      title: 'Session History - TutorAI',
      branding,
      user: loggedInUser,
      roleLabel: getRoleLabel(loggedInUser?.role || 'STUDENT'),
      isViewingAs,
      viewAsStudentName: req.session.viewAsStudentName,
      canViewAs,
      sessions
    });

  } catch (error) {
    logger.error('Sessions error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Session Detail
router.get('/sessions/:id', async (req, res) => {
  try {
    const branding = await getBranding();
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const isViewingAs = !!req.session.viewAsStudentId;
    const canViewAs = canViewAsStudent(req.session.role || '');

    const loggedInUser = await prisma.user.findUnique({
      where: { id: req.session.userId! },
      include: { school: true }
    });

    let session: any = null;

    if (effectiveStudentId) {
      // Viewing as a specific student - get their session
      session = await prisma.tutoringSession.findFirst({
        where: {
          id: req.params.id,
          studentId: effectiveStudentId
        },
        include: {
          subject: { include: { category: true } },
          topic: true,
          student: true,
          messages: { orderBy: { createdAt: 'asc' } }
        }
      });
    } else if (canViewAs) {
      // Admin/Teacher viewing - check if they have access to this session's student
      const accessibleStudentIds = await getAccessibleStudentIds(req.session);

      session = await prisma.tutoringSession.findFirst({
        where: {
          id: req.params.id,
          studentId: accessibleStudentIds.length > 0 ? { in: accessibleStudentIds } : undefined
        },
        include: {
          subject: { include: { category: true } },
          topic: true,
          student: true,
          messages: { orderBy: { createdAt: 'asc' } }
        }
      });
    }

    if (!session) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Session Not Found'
      });
    }

    res.render('student/session-detail', {
      title: 'Session Detail - TutorAI',
      branding,
      user: loggedInUser,
      roleLabel: getRoleLabel(loggedInUser?.role || 'STUDENT'),
      isViewingAs,
      viewAsStudentName: req.session.viewAsStudentName,
      canViewAs,
      session
    });

  } catch (error) {
    logger.error('Session detail error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Progress
router.get('/progress', async (req, res) => {
  try {
    const branding = await getBranding();
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const isViewingAs = !!req.session.viewAsStudentId;
    const canViewAs = canViewAsStudent(req.session.role || '');

    const loggedInUser = await prisma.user.findUnique({
      where: { id: req.session.userId! },
      include: { school: true }
    });

    let progress: any[] = [];

    if (effectiveStudentId) {
      // Viewing as a specific student - show their progress
      progress = await prisma.studentProgress.findMany({
        where: { studentId: effectiveStudentId },
        include: {
          student: true,
          topic: {
            include: {
              subject: {
                include: { category: true }
              }
            }
          }
        },
        orderBy: { lastActivityAt: 'desc' }
      });
    } else if (canViewAs) {
      // Admin/Teacher viewing without specific student - show all accessible progress
      const accessibleStudentIds = await getAccessibleStudentIds(req.session);

      progress = await prisma.studentProgress.findMany({
        where: accessibleStudentIds.length > 0 ? { studentId: { in: accessibleStudentIds } } : {},
        include: {
          student: true,
          topic: {
            include: {
              subject: {
                include: { category: true }
              }
            }
          }
        },
        orderBy: { lastActivityAt: 'desc' },
        take: 100
      });
    } else {
      // Fallback: show all progress
      progress = await prisma.studentProgress.findMany({
        include: {
          student: true,
          topic: {
            include: {
              subject: {
                include: { category: true }
              }
            }
          }
        },
        orderBy: { lastActivityAt: 'desc' },
        take: 100
      });
    }

    // Group by subject
    const progressBySubject: Record<string, any[]> = {};
    progress.forEach(p => {
      const subjectName = p.topic.subject.name;
      if (!progressBySubject[subjectName]) {
        progressBySubject[subjectName] = [];
      }
      progressBySubject[subjectName].push(p);
    });

    res.render('student/progress', {
      title: 'Progress - TutorAI',
      branding,
      user: loggedInUser,
      roleLabel: getRoleLabel(loggedInUser?.role || 'STUDENT'),
      isViewingAs,
      viewAsStudentName: req.session.viewAsStudentName,
      canViewAs,
      progress,
      progressBySubject
    });

  } catch (error) {
    logger.error('Progress error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Settings
router.get('/settings', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    res.render('student/settings', {
      title: 'Settings - TutorAI',
      branding,
      user
    });

  } catch (error) {
    logger.error('Settings error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// =====================
// ASSIGNMENTS
// =====================

// List student assignments
router.get('/assignments', async (req, res) => {
  try {
    const branding = await getBranding();
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const isViewingAs = !!req.session.viewAsStudentId;
    const canViewAs = canViewAsStudent(req.session.role || '');

    const loggedInUser = await prisma.user.findUnique({
      where: { id: req.session.userId! },
      include: { school: true }
    });

    let assignments: any[] = [];

    if (effectiveStudentId) {
      // Viewing as a specific student - show their assignments
      const enrollments = await prisma.classStudent.findMany({
        where: { studentId: effectiveStudentId },
        select: { classId: true }
      });
      const classIds = enrollments.map(e => e.classId);

      assignments = await prisma.assignment.findMany({
        where: {
          isActive: true,
          OR: [
            { classId: { in: classIds } },
            { studentId: effectiveStudentId }
          ]
        },
        include: {
          topic: { include: { subject: true } },
          class: true,
          lesson: true,
          student: true,
          submissions: {
            where: { studentId: effectiveStudentId }
          }
        },
        orderBy: [
          { dueDate: 'asc' },
          { createdAt: 'desc' }
        ]
      });
    } else if (canViewAs) {
      // Admin/Teacher viewing without specific student - show all accessible assignments
      const accessibleClassIds = await getAccessibleClassIds(req.session);

      assignments = await prisma.assignment.findMany({
        where: {
          isActive: true,
          classId: accessibleClassIds.length > 0 ? { in: accessibleClassIds } : undefined
        },
        include: {
          topic: { include: { subject: true } },
          class: true,
          lesson: true,
          student: true,
          submissions: {
            include: { student: true },
            take: 5
          }
        },
        orderBy: [
          { dueDate: 'asc' },
          { createdAt: 'desc' }
        ],
        take: 50
      });
    } else {
      // Fallback: show all active assignments
      assignments = await prisma.assignment.findMany({
        where: { isActive: true },
        include: {
          topic: { include: { subject: true } },
          class: true,
          lesson: true,
          student: true,
          submissions: { take: 5 }
        },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
        take: 50
      });
    }

    res.render('student/assignments', {
      title: 'Assignments - TutorAI',
      branding,
      user: loggedInUser,
      roleLabel: getRoleLabel(loggedInUser?.role || 'STUDENT'),
      isViewingAs,
      viewAsStudentName: req.session.viewAsStudentName,
      canViewAs,
      assignments
    });

  } catch (error) {
    logger.error('Student assignments error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// View assignment detail
router.get('/assignments/:id', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const assignment = await prisma.assignment.findUnique({
      where: { id: req.params.id },
      include: {
        topic: { include: { subject: true } },
        class: true,
        lesson: true,
        submissions: {
          where: { studentId: userId },
          include: { gradedBy: true }
        }
      }
    });

    if (!assignment) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Assignment Not Found'
      });
    }

    const mySubmission = assignment.submissions[0] || null;

    res.render('student/assignment-detail', {
      title: `${assignment.title} - TutorAI`,
      branding,
      user: req.session.user,
      assignment,
      mySubmission
    });

  } catch (error) {
    logger.error('Assignment detail error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Submit assignment (with file upload support)
router.post('/assignments/:id/submit', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { content, attachments } = req.body;

    const assignment = await prisma.assignment.findUnique({
      where: { id: req.params.id }
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Parse attachments - can be JSON array of upload IDs
    let attachmentIds: string[] = [];
    if (attachments) {
      try {
        attachmentIds = typeof attachments === 'string' ? JSON.parse(attachments) : attachments;
      } catch {
        attachmentIds = Array.isArray(attachments) ? attachments : [attachments];
      }
    }

    // Check if already submitted
    const existing = await prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId: req.params.id,
          studentId: userId
        }
      }
    });

    const submissionData = {
      content: content || null,
      attachments: attachmentIds.length > 0 ? JSON.stringify(attachmentIds) : null,
      submittedAt: new Date(),
      isLate: assignment.dueDate ? new Date() > assignment.dueDate : false,
      status: 'submitted'
    };

    if (existing) {
      // Update existing submission
      await prisma.submission.update({
        where: { id: existing.id },
        data: submissionData
      });
    } else {
      // Create new submission
      await prisma.submission.create({
        data: {
          assignmentId: req.params.id,
          studentId: userId,
          ...submissionData
        }
      });
    }

    res.redirect(`${config.basePath}/student/assignments/${req.params.id}`);

  } catch (error) {
    logger.error('Submit assignment error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// =====================
// QUIZZES
// =====================

// List available quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const branding = await getBranding();
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const isViewingAs = !!req.session.viewAsStudentId;
    const canViewAs = canViewAsStudent(req.session.role || '');

    logger.debug('DEBUG quizzes session.role:', { sessionRole: req.session.role });
    logger.debug('DEBUG quizzes effectiveStudentId:', { effectiveStudentId });
    logger.debug('DEBUG quizzes canViewAs:', { canViewAs });

    const loggedInUser = await prisma.user.findUnique({
      where: { id: req.session.userId! },
      include: { school: true }
    });

    let quizzes: any[] = [];

    if (effectiveStudentId) {
      // Viewing as a specific student - show their quizzes
      const enrollments = await prisma.classStudent.findMany({
        where: { studentId: effectiveStudentId },
        select: { classId: true }
      });
      const classIds = enrollments.map(e => e.classId);

      quizzes = await prisma.quiz.findMany({
        where: {
          isActive: true,
          OR: [
            { classId: { in: classIds } },
            { classId: null }
          ]
        },
        include: {
          topic: { include: { subject: true } },
          class: true,
          questions: true,
          attempts: {
            where: { studentId: effectiveStudentId },
            orderBy: { attemptNum: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (canViewAs) {
      // Admin/Teacher viewing without specific student - show all accessible quizzes
      const accessibleClassIds = await getAccessibleClassIds(req.session);
      logger.debug('DEBUG quizzes accessibleClassIds:', { classCount: accessibleClassIds.length });

      quizzes = await prisma.quiz.findMany({
        where: {
          isActive: true,
          OR: [
            { classId: accessibleClassIds.length > 0 ? { in: accessibleClassIds } : undefined },
            { classId: null }
          ]
        },
        include: {
          topic: { include: { subject: true } },
          class: true,
          questions: true,
          attempts: {
            include: { student: true },
            orderBy: { attemptNum: 'desc' },
            take: 5
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      logger.debug('DEBUG quizzes found', { count: quizzes.length });
    } else {
      // Fallback: show all active quizzes if no specific filtering applies
      logger.debug('DEBUG quizzes FALLBACK - showing all quizzes');
      quizzes = await prisma.quiz.findMany({
        where: { isActive: true },
        include: {
          topic: { include: { subject: true } },
          class: true,
          questions: true,
          attempts: { take: 5 }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      logger.debug('DEBUG quizzes fallback quizzes found:', { quizCount: quizzes.length });
    }

    res.render('student/quizzes', {
      title: 'Quizzes - TutorAI',
      branding,
      user: loggedInUser,
      roleLabel: getRoleLabel(loggedInUser?.role || 'STUDENT'),
      isViewingAs,
      viewAsStudentName: req.session.viewAsStudentName,
      canViewAs,
      quizzes
    });

  } catch (error) {
    logger.error('Student quizzes error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// View quiz info / start quiz
router.get('/quizzes/:id', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const isViewingAs = !!req.session.viewAsStudentId;
    const canViewAs = canViewAsStudent(req.session.role || '');

    // Get enrolled class IDs for access control
    let accessibleClassIds: string[] = [];
    if (effectiveStudentId) {
      const enrollments = await prisma.classStudent.findMany({
        where: { studentId: effectiveStudentId },
        select: { classId: true }
      });
      accessibleClassIds = enrollments.map(e => e.classId);
    } else if (canViewAs) {
      accessibleClassIds = await getAccessibleClassIds(req.session);
    }

    // Find quiz with access control - must be in student's class or global
    const quiz = await prisma.quiz.findFirst({
      where: {
        id: req.params.id,
        isActive: true,
        OR: [
          { classId: { in: accessibleClassIds } },
          { classId: null } // Global quizzes accessible to all
        ]
      },
      include: {
        topic: { include: { subject: true } },
        class: true,
        questions: { orderBy: { questionNum: 'asc' } },
        attempts: {
          where: { studentId: effectiveStudentId || userId },
          orderBy: { attemptNum: 'desc' }
        }
      }
    });

    if (!quiz) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Quiz Not Found'
      });
    }

    const myAttempts = quiz.attempts;
    const canTake = myAttempts.length < quiz.maxAttempts;
    const inProgressAttempt = myAttempts.find(a => a.status === 'in_progress');

    res.render('student/quiz-info', {
      title: `${quiz.title} - TutorAI`,
      branding,
      user: req.session.user,
      quiz,
      myAttempts,
      canTake,
      inProgressAttempt
    });

  } catch (error) {
    logger.error('Quiz info error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Start quiz attempt
router.post('/quizzes/:id/start', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const canViewAs = canViewAsStudent(req.session.role || '');

    // Get enrolled class IDs for access control
    let accessibleClassIds: string[] = [];
    if (effectiveStudentId) {
      const enrollments = await prisma.classStudent.findMany({
        where: { studentId: effectiveStudentId },
        select: { classId: true }
      });
      accessibleClassIds = enrollments.map(e => e.classId);
    } else if (canViewAs) {
      accessibleClassIds = await getAccessibleClassIds(req.session);
    }

    // Find quiz with access control
    const quiz = await prisma.quiz.findFirst({
      where: {
        id: req.params.id,
        isActive: true,
        OR: [
          { classId: { in: accessibleClassIds } },
          { classId: null }
        ]
      },
      include: {
        attempts: {
          where: { studentId: effectiveStudentId || userId }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Check for in-progress attempt
    const inProgress = quiz.attempts.find(a => a.status === 'in_progress');
    if (inProgress) {
      return res.redirect(`${config.basePath}/student/quizzes/${req.params.id}/take`);
    }

    // Check max attempts
    if (quiz.attempts.length >= quiz.maxAttempts) {
      return res.redirect(`${config.basePath}/student/quizzes/${req.params.id}?error=max_attempts`);
    }

    // Create new attempt
    await prisma.quizAttempt.create({
      data: {
        quizId: req.params.id,
        studentId: userId,
        attemptNum: quiz.attempts.length + 1,
        status: 'in_progress'
      }
    });

    res.redirect(`${config.basePath}/student/quizzes/${req.params.id}/take`);

  } catch (error) {
    logger.error('Start quiz error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Take quiz interface
router.get('/quizzes/:id/take', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const canViewAs = canViewAsStudent(req.session.role || '');

    // Get enrolled class IDs for access control
    let accessibleClassIds: string[] = [];
    if (effectiveStudentId) {
      const enrollments = await prisma.classStudent.findMany({
        where: { studentId: effectiveStudentId },
        select: { classId: true }
      });
      accessibleClassIds = enrollments.map(e => e.classId);
    } else if (canViewAs) {
      accessibleClassIds = await getAccessibleClassIds(req.session);
    }

    // Find quiz with access control
    const quiz = await prisma.quiz.findFirst({
      where: {
        id: req.params.id,
        isActive: true,
        OR: [
          { classId: { in: accessibleClassIds } },
          { classId: null }
        ]
      },
      include: {
        topic: { include: { subject: true } },
        questions: { orderBy: { questionNum: 'asc' } }
      }
    });

    if (!quiz) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Quiz Not Found'
      });
    }

    // Get current in-progress attempt
    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        quizId: req.params.id,
        studentId: userId,
        status: 'in_progress'
      },
      include: {
        answers: true
      }
    });

    if (!attempt) {
      return res.redirect(`${config.basePath}/student/quizzes/${req.params.id}`);
    }

    // Randomize questions if enabled
    let questions = quiz.questions;
    if (quiz.randomize) {
      questions = [...questions].sort(() => Math.random() - 0.5);
    }

    res.render('student/quiz-take', {
      title: `${quiz.title} - TutorAI`,
      branding,
      user: req.session.user,
      quiz,
      questions,
      attempt
    });

  } catch (error) {
    logger.error('Take quiz error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Submit quiz
router.post('/quizzes/:id/submit', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { answers } = req.body;
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const canViewAs = canViewAsStudent(req.session.role || '');

    // Get enrolled class IDs for access control
    let accessibleClassIds: string[] = [];
    if (effectiveStudentId) {
      const enrollments = await prisma.classStudent.findMany({
        where: { studentId: effectiveStudentId },
        select: { classId: true }
      });
      accessibleClassIds = enrollments.map(e => e.classId);
    } else if (canViewAs) {
      accessibleClassIds = await getAccessibleClassIds(req.session);
    }

    // Find quiz with access control
    const quiz = await prisma.quiz.findFirst({
      where: {
        id: req.params.id,
        isActive: true,
        OR: [
          { classId: { in: accessibleClassIds } },
          { classId: null }
        ]
      },
      include: {
        questions: true
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Get current attempt
    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        quizId: req.params.id,
        studentId: effectiveStudentId || userId,
        status: 'in_progress'
      }
    });

    if (!attempt) {
      return res.redirect(`${config.basePath}/student/quizzes/${req.params.id}`);
    }

    // Grade each answer
    let totalScore = 0;
    let totalPossible = 0;
    let hasEssayQuestions = false;

    for (const question of quiz.questions) {
      const studentAnswer = answers?.[question.id] || '';
      let isCorrect: boolean | null = false;
      let pointsEarned = 0;

      if (question.questionType === 'essay') {
        // Essay questions need manual grading - mark as null (pending)
        isCorrect = null;
        pointsEarned = 0;
        hasEssayQuestions = true;
        // Essay points are not counted in auto-grading total
      } else if (question.questionType === 'matching') {
        // Auto-grade matching by comparing JSON objects
        try {
          const studentMatches = typeof studentAnswer === 'string' ? JSON.parse(studentAnswer) : studentAnswer;
          const optionsData = question.options ? JSON.parse(question.options) : { pairs: [] };
          const correctPairs = optionsData.pairs || [];

          let correctCount = 0;
          for (const pair of correctPairs) {
            if (studentMatches[pair.left] === pair.right) {
              correctCount++;
            }
          }

          // Calculate partial credit based on correct matches
          const matchRatio = correctPairs.length > 0 ? correctCount / correctPairs.length : 0;
          isCorrect = matchRatio === 1;
          pointsEarned = Math.round(question.points * matchRatio);
        } catch (e) {
          isCorrect = false;
          pointsEarned = 0;
        }
        totalScore += pointsEarned;
        totalPossible += question.points;
      } else if (question.questionType === 'ordering') {
        // Auto-grade ordering by comparing arrays
        try {
          const studentOrder = typeof studentAnswer === 'string' ? JSON.parse(studentAnswer) : studentAnswer;
          const optionsData = question.options ? JSON.parse(question.options) : { items: [] };
          const correctOrder = optionsData.items || [];

          let correctPositions = 0;
          for (let i = 0; i < correctOrder.length; i++) {
            if (studentOrder[i] === correctOrder[i]) {
              correctPositions++;
            }
          }

          // Calculate partial credit based on correct positions
          const orderRatio = correctOrder.length > 0 ? correctPositions / correctOrder.length : 0;
          isCorrect = orderRatio === 1;
          pointsEarned = Math.round(question.points * orderRatio);
        } catch (e) {
          isCorrect = false;
          pointsEarned = 0;
        }
        totalScore += pointsEarned;
        totalPossible += question.points;
      } else {
        // multiple_choice, true_false, fill_blank - standard grading
        isCorrect = studentAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
        pointsEarned = isCorrect ? question.points : 0;
        totalScore += pointsEarned;
        totalPossible += question.points;
      }

      // Save answer
      await prisma.quizAnswer.create({
        data: {
          attemptId: attempt.id,
          questionId: question.id,
          answer: typeof studentAnswer === 'object' ? JSON.stringify(studentAnswer) : studentAnswer,
          isCorrect,
          pointsEarned
        }
      });
    }

    // Calculate percentage and pass/fail
    // For quizzes with essay questions, the percentage is preliminary (essay points excluded from total)
    const percentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;
    const passed = percentage >= quiz.passingScore;

    // Update attempt
    // Status is 'submitted' if all auto-graded, or needs manual review if has essay questions
    await prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        submittedAt: new Date(),
        score: totalScore,
        percentage,
        passed: hasEssayQuestions ? null : passed, // null means pending final grade if has essays
        status: hasEssayQuestions ? 'submitted' : 'graded'
      }
    });

    res.redirect(`${config.basePath}/student/quizzes/${req.params.id}/results/${attempt.id}`);

  } catch (error) {
    logger.error('Submit quiz error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// View quiz results
router.get('/quizzes/:id/results/:attemptId', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: {
        topic: { include: { subject: true } },
        questions: { orderBy: { questionNum: 'asc' } }
      }
    });

    if (!quiz) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Quiz Not Found'
      });
    }

    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        id: req.params.attemptId,
        quizId: req.params.id,
        studentId: userId
      },
      include: {
        answers: {
          include: { question: true }
        }
      }
    });

    if (!attempt) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Attempt Not Found'
      });
    }

    res.render('student/quiz-results', {
      title: `Results: ${quiz.title} - TutorAI`,
      branding,
      user: req.session.user,
      quiz,
      attempt
    });

  } catch (error) {
    logger.error('Quiz results error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// ==========================================
// MESSAGES ROUTES
// ==========================================

// Messages page
router.get('/messages', async (req, res) => {
  try {
    const branding = await getBranding();
    const userId = req.session.userId!;

    const loggedInUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { school: true }
    });

    // Get conversations
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by conversation partner
    const conversationMap = new Map<string, any>();
    for (const msg of messages) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(partnerId)) {
        const partner = await prisma.user.findUnique({
          where: { id: partnerId },
          select: { id: true, firstName: true, lastName: true, role: true }
        });
        conversationMap.set(partnerId, {
          partnerId,
          partner,
          lastMessage: msg,
          unreadCount: 0
        });
      }
      if (msg.receiverId === userId && !msg.isRead) {
        const conv = conversationMap.get(partnerId);
        if (conv) conv.unreadCount++;
      }
    }

    // Get teachers the student can message
    // Find teachers from classes the student is enrolled in
    const enrollments = await prisma.classStudent.findMany({
      where: { studentId: userId },
      select: { classId: true }
    });
    const classIds = enrollments.map(e => e.classId);

    const teacherAssignments = await prisma.classTeacher.findMany({
      where: { classId: { in: classIds } },
      include: {
        teacher: {
          select: { id: true, firstName: true, lastName: true, role: true }
        }
      }
    });

    // Deduplicate teachers
    const teacherMap = new Map();
    for (const ta of teacherAssignments) {
      if (!teacherMap.has(ta.teacher.id)) {
        teacherMap.set(ta.teacher.id, ta.teacher);
      }
    }

    res.render('student/messages', {
      title: 'Messages - TutorAI',
      branding,
      user: loggedInUser,
      conversations: Array.from(conversationMap.values()),
      teachers: Array.from(teacherMap.values()),
      basePath: config.basePath
    });

  } catch (error) {
    logger.error('Messages error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// ==========================================
// GDPR / DATA PRIVACY ROUTES
// ==========================================

// Get GDPR status (deletion request status)
router.get('/privacy/status', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const status = await getDeletionStatus(userId);
    res.json(status);
  } catch (error) {
    logger.error('GDPR status error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ error: 'Failed to get privacy status' });
  }
});

// Export user data (GDPR Article 20 - Right to Data Portability)
router.get('/privacy/export', async (req, res) => {
  try {
    const userId = req.session.userId!;

    // Don't allow export in view-as mode
    if (req.session.viewAsStudentId) {
      return res.status(403).json({ error: 'Cannot export data while viewing as another student' });
    }

    const result = await exportUserData(userId);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // Log the data export
    await logUserAction(req, AuditAction.DATA_EXPORTED, 'User', userId);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="tutorai-data-export-${new Date().toISOString().split('T')[0]}.json"`);

    res.json(result.data);
  } catch (error) {
    logger.error('GDPR export error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Request account deletion (GDPR Article 17 - Right to Erasure)
router.post('/privacy/delete-request', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { reason } = req.body;

    // Don't allow deletion request in view-as mode
    if (req.session.viewAsStudentId) {
      return res.status(403).json({ error: 'Cannot request deletion while viewing as another student' });
    }

    const result = await requestAccountDeletion(userId, reason);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // Log the deletion request
    await logUserAction(req, AuditAction.DELETION_REQUESTED, 'User', userId, { reason });

    res.json({
      success: true,
      message: 'Your account deletion has been scheduled. You have 30 days to cancel this request.',
      deletionId: result.deletionId
    });
  } catch (error) {
    logger.error('GDPR deletion request error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ error: 'Failed to process deletion request' });
  }
});

// Cancel deletion request
router.post('/privacy/cancel-deletion', async (req, res) => {
  try {
    const userId = req.session.userId!;

    // Don't allow cancel in view-as mode
    if (req.session.viewAsStudentId) {
      return res.status(403).json({ error: 'Cannot cancel deletion while viewing as another student' });
    }

    const result = await cancelDeletionRequest(userId);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // Log the cancellation
    await logUserAction(req, AuditAction.DELETION_CANCELLED, 'User', userId);

    res.json({ success: true, message: 'Your deletion request has been cancelled.' });
  } catch (error) {
    logger.error('GDPR cancel deletion error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ error: 'Failed to cancel deletion request' });
  }
});

// ============================================
// REPORT EXPORT ROUTES
// ============================================

// Export progress as CSV
router.get('/reports/progress/csv', async (req, res) => {
  try {
    const userId = req.session.viewAsStudentId || req.session.userId!;
    const { subjectId } = req.query;

    const csvContent = await exportStudentProgressCSV(userId, {
      subjectId: subjectId as string
    });

    const filename = `progress-report-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);

  } catch (error) {
    logger.error('Export progress CSV error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ error: 'Export failed' });
  }
});

// Export progress as printable HTML (for PDF)
router.get('/reports/progress/pdf', async (req, res) => {
  try {
    const userId = req.session.viewAsStudentId || req.session.userId!;
    const { subjectId } = req.query;

    const htmlContent = await generateProgressReportHTML(userId, {
      subjectId: subjectId as string
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);

  } catch (error) {
    logger.error('Generate progress report error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ error: 'Report generation failed' });
  }
});

// Export sessions as CSV
router.get('/reports/sessions/csv', async (req, res) => {
  try {
    const userId = req.session.viewAsStudentId || req.session.userId!;
    const { subjectId, startDate, endDate } = req.query;

    const csvContent = await exportSessionsCSV({
      studentId: userId,
      subjectId: subjectId as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined
    });

    const filename = `sessions-export-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);

  } catch (error) {
    logger.error('Export sessions CSV error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ error: 'Export failed' });
  }
});

// Export session transcript as HTML (for PDF)
router.get('/reports/session/:sessionId/transcript', async (req, res) => {
  try {
    const userId = req.session.viewAsStudentId || req.session.userId!;
    const { sessionId } = req.params;

    // Verify student owns this session
    const session = await prisma.tutoringSession.findFirst({
      where: { id: sessionId, studentId: userId }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const htmlContent = await generateSessionTranscriptHTML(sessionId);

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);

  } catch (error) {
    logger.error('Generate transcript error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ error: 'Transcript generation failed' });
  }
});

// Export assignments as iCal
router.get('/reports/assignments/ical', async (req, res) => {
  try {
    const userId = req.session.viewAsStudentId || req.session.userId!;
    const { classIds } = req.query;

    const icalContent = await generateAssignmentsIcal(userId, {
      classIds: classIds ? (classIds as string).split(',') : undefined
    });

    const filename = `assignments-${new Date().toISOString().split('T')[0]}.ics`;
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(icalContent);

  } catch (error) {
    logger.error('Generate assignments iCal error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ error: 'Calendar export failed' });
  }
});

// Export sessions as iCal
router.get('/reports/sessions/ical', async (req, res) => {
  try {
    const userId = req.session.viewAsStudentId || req.session.userId!;
    const { startDate, endDate } = req.query;

    const icalContent = await generateSessionsIcal(userId, {
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined
    });

    const filename = `tutoring-sessions-${new Date().toISOString().split('T')[0]}.ics`;
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(icalContent);

  } catch (error) {
    logger.error('Generate sessions iCal error:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ error: 'Calendar export failed' });
  }
});

// ============================================
// GAMIFICATION ROUTES
// ============================================

// Get all available badges
router.get('/api/badges', async (req, res) => {
  try {
    const { category, tier } = req.query;
    const badges = await getAllBadges({
      category: category as string,
      tier: tier as string
    });
    res.json(badges);
  } catch (error) {
    logger.error('Get badges error', { error });
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// Get user's badges
router.get('/api/my-badges', async (req, res) => {
  try {
    const studentId = getEffectiveStudentId(req.session);
    if (!studentId) {
      return res.status(400).json({ error: 'No student context' });
    }

    const [badges, allBadges] = await Promise.all([
      getUserBadges(studentId),
      getAllBadges()
    ]);

    const earnedIds = new Set(badges.filter(b => b.earnedAt).map(b => b.badgeId));

    res.json({
      earned: badges.filter(b => b.earnedAt),
      inProgress: badges.filter(b => !b.earnedAt),
      available: allBadges.filter(b => !earnedIds.has(b.id)),
      totalEarned: badges.filter(b => b.earnedAt).length,
      totalAvailable: allBadges.length
    });
  } catch (error) {
    logger.error('Get user badges error', { error });
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// Get user's streak
router.get('/api/streak', async (req, res) => {
  try {
    const studentId = getEffectiveStudentId(req.session);
    if (!studentId) {
      return res.status(400).json({ error: 'No student context' });
    }

    const streak = await getStreak(studentId);
    res.json(streak);
  } catch (error) {
    logger.error('Get streak error', { error });
    res.status(500).json({ error: 'Failed to fetch streak' });
  }
});

// Update streak (called on activity)
router.post('/api/streak/update', async (req, res) => {
  try {
    const studentId = getEffectiveStudentId(req.session);
    if (!studentId) {
      return res.status(400).json({ error: 'No student context' });
    }

    const streak = await updateStreak(studentId);
    res.json(streak);
  } catch (error) {
    logger.error('Update streak error', { error });
    res.status(500).json({ error: 'Failed to update streak' });
  }
});

// Get user's points
router.get('/api/points', async (req, res) => {
  try {
    const studentId = getEffectiveStudentId(req.session);
    if (!studentId) {
      return res.status(400).json({ error: 'No student context' });
    }

    const balance = await getPointBalance(studentId);
    res.json(balance);
  } catch (error) {
    logger.error('Get points error', { error });
    res.status(500).json({ error: 'Failed to fetch points' });
  }
});

// Get point history
router.get('/api/points/history', async (req, res) => {
  try {
    const studentId = getEffectiveStudentId(req.session);
    if (!studentId) {
      return res.status(400).json({ error: 'No student context' });
    }

    const { limit, offset, category } = req.query;
    const history = await getPointHistory(studentId, {
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
      category: category as string
    });

    res.json(history);
  } catch (error) {
    logger.error('Get point history error', { error });
    res.status(500).json({ error: 'Failed to fetch point history' });
  }
});

// Get leaderboard
router.get('/api/leaderboard', async (req, res) => {
  try {
    const { scope = 'global', period = 'all_time', limit } = req.query;
    const session = req.session as any;

    let scopeId: string | undefined;
    if (scope === 'school' && session.schoolId) {
      scopeId = session.schoolId;
    } else if (scope === 'class') {
      // Get first class the student is in
      const enrollment = await prisma.classStudent.findFirst({
        where: { studentId: session.userId },
        select: { classId: true }
      });
      scopeId = enrollment?.classId;
    }

    const leaderboard = await getLeaderboard({
      scope: scope as 'global' | 'school' | 'class',
      scopeId,
      period: period as 'all_time' | 'monthly' | 'weekly' | 'daily',
      limit: limit ? parseInt(limit as string) : 10
    });

    // Get user's rank
    const studentId = getEffectiveStudentId(session);
    let userRank = null;
    if (studentId) {
      userRank = await getUserRank(studentId, {
        scope: scope as 'global' | 'school' | 'class',
        scopeId,
        period: period as 'all_time' | 'monthly' | 'weekly' | 'daily'
      });
    }

    res.json({ leaderboard, userRank });
  } catch (error) {
    logger.error('Get leaderboard error', { error });
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user's activity feed
router.get('/api/activity', async (req, res) => {
  try {
    const studentId = getEffectiveStudentId(req.session);
    if (!studentId) {
      return res.status(400).json({ error: 'No student context' });
    }

    const { limit, offset } = req.query;
    const activity = await getUserActivity(studentId, {
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0
    });

    res.json(activity);
  } catch (error) {
    logger.error('Get activity error', { error });
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Get class/school activity feed
router.get('/api/activity/:scope/:scopeId', async (req, res) => {
  try {
    const { scope, scopeId } = req.params;
    const { limit, offset } = req.query;

    if (!['school', 'class'].includes(scope)) {
      return res.status(400).json({ error: 'Invalid scope' });
    }

    const activity = await getPublicActivity(
      scope as 'school' | 'class',
      scopeId,
      {
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0
      }
    );

    res.json(activity);
  } catch (error) {
    logger.error('Get public activity error', { error });
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Get announcements
router.get('/api/announcements', async (req, res) => {
  try {
    const session = req.session as any;
    const studentId = getEffectiveStudentId(session);

    // Get class IDs for student
    let classIds: string[] = [];
    if (studentId) {
      const enrollments = await prisma.classStudent.findMany({
        where: { studentId },
        select: { classId: true }
      });
      classIds = enrollments.map(e => e.classId);
    }

    const announcements = await getAnnouncementsForUser(
      studentId || session.userId,
      session.schoolId,
      classIds,
      session.role
    );

    res.json(announcements);
  } catch (error) {
    logger.error('Get announcements error', { error });
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Mark announcement as read
router.post('/api/announcements/:id/read', async (req, res) => {
  try {
    const session = req.session as any;
    await markAnnouncementRead(session.userId, req.params.id);
    res.json({ success: true });
  } catch (error) {
    logger.error('Mark announcement read error', { error });
    res.status(500).json({ error: 'Failed to mark announcement as read' });
  }
});

// Get unread announcement count
router.get('/api/announcements/unread-count', async (req, res) => {
  try {
    const session = req.session as any;
    const studentId = getEffectiveStudentId(session);

    let classIds: string[] = [];
    if (studentId) {
      const enrollments = await prisma.classStudent.findMany({
        where: { studentId },
        select: { classId: true }
      });
      classIds = enrollments.map(e => e.classId);
    }

    const count = await getUnreadAnnouncementCount(
      studentId || session.userId,
      session.schoolId,
      classIds
    );

    res.json({ count });
  } catch (error) {
    logger.error('Get unread count error', { error });
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Get gamification summary (dashboard widget)
router.get('/api/gamification/summary', async (req, res) => {
  try {
    const studentId = getEffectiveStudentId(req.session);
    if (!studentId) {
      return res.status(400).json({ error: 'No student context' });
    }

    const [badges, streak, points, recentActivity] = await Promise.all([
      getEarnedBadges(studentId),
      getStreak(studentId),
      getPointBalance(studentId),
      getUserActivity(studentId, { limit: 5 })
    ]);

    res.json({
      badges: {
        count: badges.length,
        recent: badges.slice(0, 3)
      },
      streak: {
        current: streak.currentStreak,
        longest: streak.longestStreak
      },
      points: {
        balance: points.currentBalance,
        level: points.level,
        levelProgress: points.levelProgress,
        levelRequired: points.levelRequired
      },
      recentActivity
    });
  } catch (error) {
    logger.error('Get gamification summary error', { error });
    res.status(500).json({ error: 'Failed to fetch gamification summary' });
  }
});

// ============================================
// DIAGNOSTIC ASSESSMENTS
// ============================================

// List available diagnostic tests
router.get('/diagnostics', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const branding = await getBranding();

    // Get user's grade level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gradeLevel: true }
    });

    // Get available tests
    const tests = await getDiagnosticTests({
      gradeLevel: user?.gradeLevel || undefined,
      isActive: true
    });

    // Get student's diagnostic history
    const history = await getStudentDiagnosticHistory(userId);

    // Get skill gaps
    const skillGaps = await getStudentSkillGaps(userId, { isResolved: false });

    res.render('student/diagnostics', {
      title: 'Diagnostic Assessments - TutorAI',
      branding,
      user: req.session.user,
      tests,
      history,
      skillGaps
    });

  } catch (error) {
    logger.error('Diagnostics page error', { error });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Start a diagnostic test
router.post('/diagnostics/:testId/start', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { testId } = req.params;

    const attemptId = await startDiagnosticAttempt(testId, userId);

    res.json({ success: true, attemptId });

  } catch (error) {
    logger.error('Start diagnostic error', { error });
    res.status(500).json({ error: 'Failed to start diagnostic' });
  }
});

// Take a diagnostic test
router.get('/diagnostics/attempt/:attemptId', async (req, res) => {
  try {
    const branding = await getBranding();
    const { attemptId } = req.params;

    // Get attempt info
    const attempt = await prisma.diagnosticAttempt.findUnique({
      where: { id: attemptId },
      include: { test: true }
    });

    if (!attempt) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Test Not Found'
      });
    }

    // Check if already completed
    if (attempt.status === 'completed') {
      return res.redirect(`${config.basePath}/student/diagnostics/results/${attemptId}`);
    }

    // Get next question
    const questionData = await getNextQuestion(attemptId);

    res.render('student/diagnostic-test', {
      title: `${attempt.test.title} - TutorAI`,
      branding,
      user: req.session.user,
      attempt,
      test: attempt.test,
      questionData
    });

  } catch (error) {
    logger.error('Diagnostic test page error', { error });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Get next question (API)
router.get('/diagnostics/attempt/:attemptId/next', async (req, res) => {
  try {
    const { attemptId } = req.params;

    const questionData = await getNextQuestion(attemptId);

    if (!questionData) {
      return res.json({ complete: true });
    }

    res.json({ success: true, ...questionData });

  } catch (error) {
    logger.error('Get next question error', { error });
    res.status(500).json({ error: 'Failed to get next question' });
  }
});

// Submit answer
router.post('/diagnostics/attempt/:attemptId/answer', async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { questionId, answer, timeSpent } = req.body;

    const result = await submitAnswer(attemptId, questionId, answer, timeSpent);

    // Check if more questions
    const nextQuestion = await getNextQuestion(attemptId);

    res.json({
      success: true,
      ...result,
      hasMore: nextQuestion !== null
    });

  } catch (error) {
    logger.error('Submit answer error', { error });
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

// Complete test
router.post('/diagnostics/attempt/:attemptId/complete', async (req, res) => {
  try {
    const { attemptId } = req.params;

    const result = await completeAttempt(attemptId);

    res.json({ success: true, result });

  } catch (error) {
    logger.error('Complete diagnostic error', { error });
    res.status(500).json({ error: 'Failed to complete diagnostic' });
  }
});

// View results
router.get('/diagnostics/results/:attemptId', async (req, res) => {
  try {
    const branding = await getBranding();
    const { attemptId } = req.params;

    const attempt = await prisma.diagnosticAttempt.findUnique({
      where: { id: attemptId },
      include: {
        test: true,
        result: true,
        responses: {
          include: { question: true }
        }
      }
    });

    if (!attempt) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Results Not Found'
      });
    }

    // Parse result data
    const resultData = attempt.result ? {
      ...attempt.result,
      skillBreakdown: attempt.result.skillBreakdown ? JSON.parse(attempt.result.skillBreakdown) : {},
      skillGaps: attempt.result.skillGaps ? JSON.parse(attempt.result.skillGaps) : [],
      strengths: attempt.result.strengths ? JSON.parse(attempt.result.strengths) : [],
      recommendations: attempt.result.recommendations ? JSON.parse(attempt.result.recommendations) : []
    } : null;

    res.render('student/diagnostic-results', {
      title: 'Diagnostic Results - TutorAI',
      branding,
      user: req.session.user,
      attempt,
      test: attempt.test,
      result: resultData,
      responses: attempt.responses
    });

  } catch (error) {
    logger.error('Diagnostic results error', { error });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Get skill gaps
router.get('/diagnostics/skill-gaps', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { subjectId, priority } = req.query;

    const gaps = await getStudentSkillGaps(userId, {
      subjectId: subjectId as string | undefined,
      priority: priority as string | undefined,
      isResolved: false
    });

    res.json({ success: true, gaps });

  } catch (error) {
    logger.error('Get skill gaps error', { error });
    res.status(500).json({ error: 'Failed to get skill gaps' });
  }
});

// Get placement recommendation
router.get('/diagnostics/placement/:subjectId', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { subjectId } = req.params;

    const recommendation = await getPlacementRecommendation(userId, subjectId);

    res.json({ success: true, recommendation });

  } catch (error) {
    logger.error('Get placement error', { error });
    res.status(500).json({ error: 'Failed to get placement' });
  }
});

// ============================================
// PRACTICE MODE (Spaced Repetition)
// ============================================

// Practice session storage (in-memory for simplicity, could be Redis/DB)
const practiceSessions = new Map<string, PracticeSession>();

// Practice Mode - Main Page
router.get('/practice', async (req, res) => {
  try {
    const branding = await getBranding();
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const isViewingAs = !!req.session.viewAsStudentId;
    const canViewAs = canViewAsStudent(req.session.role || '');

    const loggedInUser = await prisma.user.findUnique({
      where: { id: req.session.userId! },
      include: { school: true }
    });

    // Get subjects with topics for practice
    const categories = await prisma.subjectCategory.findMany({
      where: { isActive: true },
      include: {
        subjects: {
          where: { isActive: true },
          include: {
            topics: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    // Get practice stats for the student
    let stats = null;
    if (effectiveStudentId) {
      stats = await getPracticeStats(effectiveStudentId);
    }

    // Get due items count
    let dueItemsCount = 0;
    if (effectiveStudentId) {
      const dueItems = await getDueItems(effectiveStudentId);
      dueItemsCount = dueItems.length;
    }

    res.render('student/practice', {
      title: 'Practice Mode - TutorAI',
      branding,
      user: loggedInUser,
      roleLabel: getRoleLabel(loggedInUser?.role || 'STUDENT'),
      isViewingAs,
      viewAsStudentName: req.session.viewAsStudentName,
      canViewAs,
      categories,
      stats,
      dueItemsCount,
      defaultSettings: DEFAULT_PRACTICE_SETTINGS
    });

  } catch (error) {
    logger.error('Practice page error', { error });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Start a practice session
router.post('/practice/start', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { topicId, subjectId, itemCount, difficulty, mode } = req.body;

    // Get questions for practice from quizzes and create practice items
    const whereClause: any = { isActive: true };

    if (topicId) {
      whereClause.quiz = { topicId };
    } else if (subjectId) {
      whereClause.quiz = { topic: { subjectId } };
    }

    const questions = await prisma.quizQuestion.findMany({
      where: whereClause,
      include: {
        quiz: {
          include: {
            topic: { include: { subject: true } }
          }
        }
      },
      take: parseInt(itemCount) || 10
    });

    if (questions.length === 0) {
      return res.status(400).json({
        error: 'No practice questions available for this topic'
      });
    }

    // Convert questions to practice items
    const practiceItems: PracticeItem[] = questions.map((q, idx) => ({
      id: q.id,
      questionType: q.questionType as 'multiple_choice' | 'true_false' | 'short_answer' | 'fill_blank',
      type: q.questionType as 'multiple_choice' | 'true_false' | 'short_answer' | 'fill_blank',
      question: q.questionText,
      options: q.options ? JSON.parse(q.options) : undefined,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || undefined,
      difficulty: 'medium' as 'easy' | 'medium' | 'hard' | 'expert',
      points: q.points || 10,
      topicId: q.quiz.topicId || undefined,
      topicName: q.quiz.topic?.name,
      subjectName: q.quiz.topic?.subject?.name,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: new Date()
    }));

    // Start session with settings
    const session = startPracticeSession(userId, practiceItems, {
      itemCount: parseInt(itemCount) || 10,
      adaptiveDifficulty: mode === 'adaptive',
      targetAccuracy: 0.8
    });

    // Store session
    practiceSessions.set(session.id, session);

    res.json({
      success: true,
      sessionId: session.id,
      totalItems: session.totalItems
    });

  } catch (error) {
    logger.error('Start practice session error', { error });
    res.status(500).json({ error: 'Failed to start practice session' });
  }
});

// Take practice session
router.get('/practice/session/:sessionId', async (req, res) => {
  try {
    const branding = await getBranding();
    const { sessionId } = req.params;

    const session = practiceSessions.get(sessionId);
    if (!session) {
      return res.redirect(`${config.basePath}/student/practice?error=session_not_found`);
    }

    // Get current item
    const currentItem = getPracticeItem(session, session.currentIndex);
    if (!currentItem) {
      // Session complete, redirect to results
      return res.redirect(`${config.basePath}/student/practice/results/${sessionId}`);
    }

    res.render('student/practice-session', {
      title: 'Practice Session - TutorAI',
      branding,
      user: req.session.user,
      session,
      currentItem,
      progress: {
        current: session.currentIndex + 1,
        total: session.totalItems,
        correct: session.correctCount,
        incorrect: session.incorrectCount,
        streak: session.streak
      }
    });

  } catch (error) {
    logger.error('Practice session page error', { error });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Get current practice item (API)
router.get('/practice/session/:sessionId/current', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = practiceSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const currentItem = getPracticeItem(session, session.currentIndex);
    if (!currentItem) {
      return res.json({
        complete: true,
        stats: {
          correct: session.correctCount,
          incorrect: session.incorrectCount,
          accuracy: session.totalItems > 0
            ? (session.correctCount / session.totalItems) * 100
            : 0,
          streak: session.streak,
          points: session.points
        }
      });
    }

    // Don't send the correct answer to the client
    const safeItem = {
      id: currentItem.id,
      type: currentItem.type,
      question: currentItem.question,
      options: currentItem.options,
      difficulty: currentItem.difficulty,
      topicName: currentItem.topicName,
      subjectName: currentItem.subjectName
    };

    res.json({
      item: safeItem,
      progress: {
        current: session.currentIndex + 1,
        total: session.totalItems,
        correct: session.correctCount,
        incorrect: session.incorrectCount,
        streak: session.streak,
        points: session.points
      }
    });

  } catch (error) {
    logger.error('Get current practice item error', { error });
    res.status(500).json({ error: 'Failed to get current item' });
  }
});

// Submit practice answer
router.post('/practice/session/:sessionId/answer', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answer, timeSpent } = req.body;

    const session = practiceSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Submit the answer
    const result = submitPracticeAnswer(session, answer, timeSpent || 0);

    // Update session in storage
    practiceSessions.set(sessionId, session);

    res.json({
      success: true,
      isCorrect: result.isCorrect,
      correctAnswer: result.correctAnswer,
      explanation: result.explanation,
      pointsEarned: result.pointsEarned,
      quality: result.quality,
      nextReviewDate: result.nextReviewDate,
      streak: session.streak,
      hasMore: session.currentIndex < session.totalItems
    });

  } catch (error) {
    logger.error('Submit practice answer error', { error });
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

// Skip practice item
router.post('/practice/session/:sessionId/skip', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = practiceSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (!session.settings.allowSkip) {
      return res.status(400).json({ error: 'Skipping is not allowed in this session' });
    }

    // Move to next item
    session.currentIndex++;
    session.skippedCount = (session.skippedCount || 0) + 1;

    practiceSessions.set(sessionId, session);

    res.json({
      success: true,
      hasMore: session.currentIndex < session.totalItems
    });

  } catch (error) {
    logger.error('Skip practice item error', { error });
    res.status(500).json({ error: 'Failed to skip item' });
  }
});

// End practice session
router.post('/practice/session/:sessionId/end', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = practiceSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // End the session
    const result = endPracticeSession(session);

    // Keep session for results page
    practiceSessions.set(sessionId, session);

    res.json({ success: true, result });

  } catch (error) {
    logger.error('End practice session error', { error });
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// Practice results page
router.get('/practice/results/:sessionId', async (req, res) => {
  try {
    const branding = await getBranding();
    const { sessionId } = req.params;

    const session = practiceSessions.get(sessionId);
    if (!session) {
      return res.redirect(`${config.basePath}/student/practice?error=session_not_found`);
    }

    // Calculate final stats
    const totalAnswered = session.correctCount + session.incorrectCount;
    const accuracy = totalAnswered > 0
      ? Math.round((session.correctCount / totalAnswered) * 100)
      : 0;

    // Generate recommendations
    let recommendation = '';
    if (accuracy >= 90) {
      recommendation = 'Excellent work! You have mastered this material. Consider moving to harder topics.';
    } else if (accuracy >= 70) {
      recommendation = 'Good progress! Keep practicing to reinforce your knowledge.';
    } else if (accuracy >= 50) {
      recommendation = 'You\'re making progress. Review the topics you struggled with and try again.';
    } else {
      recommendation = 'Consider reviewing the fundamentals before continuing practice.';
    }

    res.render('student/practice-results', {
      title: 'Practice Results - TutorAI',
      branding,
      user: req.session.user,
      session,
      stats: {
        totalItems: session.totalItems,
        answered: totalAnswered,
        correct: session.correctCount,
        incorrect: session.incorrectCount,
        skipped: session.skippedCount || 0,
        accuracy,
        points: session.points,
        streak: session.streak,
        longestStreak: session.longestStreak || session.streak,
        duration: session.endTime && session.startTime
          ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000)
          : 0
      },
      recommendation,
      responses: session.responses
    });

  } catch (error) {
    logger.error('Practice results page error', { error });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Get practice stats API
router.get('/api/practice/stats', async (req, res) => {
  try {
    const studentId = getEffectiveStudentId(req.session);
    if (!studentId) {
      return res.status(400).json({ error: 'No student context' });
    }

    const stats = await getPracticeStats(studentId);
    res.json(stats);

  } catch (error) {
    logger.error('Get practice stats error', { error });
    res.status(500).json({ error: 'Failed to get practice stats' });
  }
});

// Get due items API
router.get('/api/practice/due', async (req, res) => {
  try {
    const studentId = getEffectiveStudentId(req.session);
    if (!studentId) {
      return res.status(400).json({ error: 'No student context' });
    }

    const { topicId, limit } = req.query;
    const dueItems = await getDueItems(studentId, {
      topicId: topicId as string,
      limit: limit ? parseInt(limit as string) : 50
    });

    res.json({ items: dueItems, count: dueItems.length });

  } catch (error) {
    logger.error('Get due items error', { error });
    res.status(500).json({ error: 'Failed to get due items' });
  }
});

// ============================================
// LEARNING PATHS & MASTERY
// ============================================

// Learning Paths - Main Page
router.get('/learning-paths', async (req, res) => {
  try {
    const branding = await getBranding();
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const isViewingAs = !!req.session.viewAsStudentId;
    const canViewAs = canViewAsStudent(req.session.role || '');

    const loggedInUser = await prisma.user.findUnique({
      where: { id: req.session.userId! },
      include: { school: true }
    });

    // Get all available learning paths
    const paths = await getAllLearningPaths({
      gradeLevel: loggedInUser?.gradeLevel ?? undefined
    });

    // Get student's progress on paths
    let pathProgress: Record<string, any> = {};
    let mastery: any[] = [];
    let recommendations: any[] = [];

    if (effectiveStudentId) {
      // Get mastery data
      mastery = await getStudentMastery(effectiveStudentId);

      // Calculate progress for each path
      const progressData = await getStudentPathProgress(effectiveStudentId);
      for (const p of progressData) {
        pathProgress[p.pathId] = p;
      }

      // Get recommendations
      const studentProfile = {
        gradeLevel: loggedInUser?.gradeLevel ?? undefined,
        completedPaths: progressData.filter(p => p.status === 'completed').map(p => p.pathId),
        interests: [],
        strengths: [],
        weaknesses: [],
        currentMastery: {}
      };
      recommendations = recommendPaths(paths, studentProfile, 5);
    }

    res.render('student/learning-paths', {
      title: 'Learning Paths - TutorAI',
      branding,
      user: loggedInUser,
      roleLabel: getRoleLabel(loggedInUser?.role || 'STUDENT'),
      isViewingAs,
      viewAsStudentName: req.session.viewAsStudentName,
      canViewAs,
      paths,
      pathProgress,
      mastery,
      recommendations,
      formatMasteryLevel,
      getMasteryColor,
      getMasteryBadge,
      MASTERY_THRESHOLDS
    });

  } catch (error) {
    logger.error('Learning paths page error', { error });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Learning Path Detail
router.get('/learning-paths/:pathId', async (req, res) => {
  try {
    const branding = await getBranding();
    const { pathId } = req.params;
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const isViewingAs = !!req.session.viewAsStudentId;
    const canViewAs = canViewAsStudent(req.session.role || '');

    const loggedInUser = await prisma.user.findUnique({
      where: { id: req.session.userId! },
      include: { school: true }
    });

    // Get the path (it's a subject ID)
    const paths = await getLearningPathsBySubject(pathId);
    const path = paths[0];

    if (!path) {
      return res.status(404).render('errors/404', {
        basePath: config.basePath,
        title: 'Learning Path Not Found'
      });
    }

    // Get student's progress
    let progress: any = null;
    let completedNodes: string[] = [];
    let availableNodes: any[] = [];
    let nextNode: any = null;
    let mastery: any[] = [];

    if (effectiveStudentId) {
      const progressData = await getStudentPathProgress(effectiveStudentId, pathId);
      progress = progressData[0] || {
        status: 'not_started',
        completedNodes: [],
        nodeScores: {}
      };
      completedNodes = progress.completedNodes || [];

      // Get mastery for topics in this path
      mastery = await getStudentMastery(effectiveStudentId);

      // Calculate available nodes
      availableNodes = getAvailableNodes(path, completedNodes);
      nextNode = getNextRecommendedNode(path, completedNodes, progress.nodeScores || {});
    }

    // Calculate path progress
    const pathProgressData = calculatePathProgress(path, completedNodes);

    res.render('student/learning-path-detail', {
      title: `${path.title} - TutorAI`,
      branding,
      user: loggedInUser,
      roleLabel: getRoleLabel(loggedInUser?.role || 'STUDENT'),
      isViewingAs,
      viewAsStudentName: req.session.viewAsStudentName,
      canViewAs,
      path,
      progress,
      pathProgressData,
      completedNodes,
      availableNodes,
      nextNode,
      mastery,
      formatMasteryLevel,
      getMasteryColor,
      getMasteryBadge,
      MASTERY_THRESHOLDS
    });

  } catch (error) {
    logger.error('Learning path detail error', { error });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Mastery Dashboard
router.get('/mastery', async (req, res) => {
  try {
    const branding = await getBranding();
    const effectiveStudentId = getEffectiveStudentId(req.session);
    const isViewingAs = !!req.session.viewAsStudentId;
    const canViewAs = canViewAsStudent(req.session.role || '');

    const loggedInUser = await prisma.user.findUnique({
      where: { id: req.session.userId! },
      include: { school: true }
    });

    if (!effectiveStudentId) {
      return res.redirect(`${config.basePath}/student/learning-paths`);
    }

    // Get comprehensive mastery data
    const mastery = await getStudentMastery(effectiveStudentId);
    const dashboardData = await getStudentDashboardData(effectiveStudentId);

    // Group mastery by subject
    const masteryBySubject: Record<string, any[]> = {};
    for (const m of mastery) {
      const topic = await prisma.topic.findUnique({
        where: { id: m.topicId },
        include: { subject: true }
      });
      if (topic) {
        const subjectName = topic.subject.name;
        if (!masteryBySubject[subjectName]) {
          masteryBySubject[subjectName] = [];
        }
        masteryBySubject[subjectName].push({
          ...m,
          topicName: topic.name
        });
      }
    }

    res.render('student/mastery', {
      title: 'Mastery Dashboard - TutorAI',
      branding,
      user: loggedInUser,
      roleLabel: getRoleLabel(loggedInUser?.role || 'STUDENT'),
      isViewingAs,
      viewAsStudentName: req.session.viewAsStudentName,
      canViewAs,
      mastery,
      masteryBySubject,
      dashboardData,
      formatMasteryLevel,
      getMasteryColor,
      getMasteryBadge,
      MASTERY_THRESHOLDS
    });

  } catch (error) {
    logger.error('Mastery dashboard error', { error });
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// API: Get mastery data
router.get('/api/mastery', async (req, res) => {
  try {
    const studentId = getEffectiveStudentId(req.session);
    if (!studentId) {
      return res.status(400).json({ error: 'No student context' });
    }

    const { topicId } = req.query;
    const mastery = await getStudentMastery(studentId, topicId as string);

    res.json({ mastery });

  } catch (error) {
    logger.error('Get mastery API error', { error });
    res.status(500).json({ error: 'Failed to get mastery data' });
  }
});

// API: Get learning path recommendations
router.get('/api/learning-paths/recommendations', async (req, res) => {
  try {
    const studentId = getEffectiveStudentId(req.session);
    if (!studentId) {
      return res.status(400).json({ error: 'No student context' });
    }

    const user = await prisma.user.findUnique({
      where: { id: studentId }
    });

    const paths = await getAllLearningPaths({
      gradeLevel: user?.gradeLevel ?? undefined
    });

    const progressData = await getStudentPathProgress(studentId);
    const studentProfile = {
      gradeLevel: user?.gradeLevel ?? undefined,
      completedPaths: progressData.filter(p => p.status === 'completed').map(p => p.pathId),
      interests: [],
      strengths: [],
      weaknesses: [],
      currentMastery: {}
    };

    const recommendations = recommendPaths(paths, studentProfile, 5);

    res.json({ recommendations });

  } catch (error) {
    logger.error('Get path recommendations API error', { error });
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// API: Get path progress
router.get('/api/learning-paths/:pathId/progress', async (req, res) => {
  try {
    const studentId = getEffectiveStudentId(req.session);
    if (!studentId) {
      return res.status(400).json({ error: 'No student context' });
    }

    const { pathId } = req.params;
    const progressData = await getStudentPathProgress(studentId, pathId);

    res.json({ progress: progressData[0] || null });

  } catch (error) {
    logger.error('Get path progress API error', { error });
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

export default router;
