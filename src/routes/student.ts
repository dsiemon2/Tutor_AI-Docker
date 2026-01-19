// TutorAI Student Routes
// Student dashboard, subjects, tutoring interface

import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { config } from '../config';
import { requireAuth, requireRole, requireMinRole } from '../middleware/auth';
import { SUBJECT_CATEGORIES, GRADE_LEVELS, ROLE_HIERARCHY } from '../config/constants';

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
    console.error('View-as students error:', error);
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
    console.error('View-as start error:', error);
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
    console.error('Dashboard error:', error);
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
    console.error('Subjects error:', error);
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
    console.error('Subject detail error:', error);
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
    console.error('Topic detail error:', error);
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
    console.error('Lesson view error:', error);
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
    console.error('Tutor interface error:', error);
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
    console.error('Sessions error:', error);
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
    console.error('Session detail error:', error);
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
    console.error('Progress error:', error);
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
    console.error('Settings error:', error);
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
    console.error('Student assignments error:', error);
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
    console.error('Assignment detail error:', error);
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

// Submit assignment
router.post('/assignments/:id/submit', async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { content } = req.body;

    const assignment = await prisma.assignment.findUnique({
      where: { id: req.params.id }
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
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

    if (existing) {
      // Update existing submission
      await prisma.submission.update({
        where: { id: existing.id },
        data: {
          content,
          submittedAt: new Date(),
          isLate: assignment.dueDate ? new Date() > assignment.dueDate : false,
          status: 'submitted'
        }
      });
    } else {
      // Create new submission
      await prisma.submission.create({
        data: {
          assignmentId: req.params.id,
          studentId: userId,
          content,
          isLate: assignment.dueDate ? new Date() > assignment.dueDate : false,
          status: 'submitted'
        }
      });
    }

    res.redirect(`${config.basePath}/student/assignments/${req.params.id}`);

  } catch (error) {
    console.error('Submit assignment error:', error);
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
    console.error('Student quizzes error:', error);
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

    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: {
        topic: { include: { subject: true } },
        class: true,
        questions: { orderBy: { questionNum: 'asc' } },
        attempts: {
          where: { studentId: userId },
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
    console.error('Quiz info error:', error);
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

    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: {
        attempts: {
          where: { studentId: userId }
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
    console.error('Start quiz error:', error);
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
    console.error('Take quiz error:', error);
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

    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
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
        studentId: userId,
        status: 'in_progress'
      }
    });

    if (!attempt) {
      return res.redirect(`${config.basePath}/student/quizzes/${req.params.id}`);
    }

    // Grade each answer
    let totalScore = 0;
    let totalPossible = 0;

    for (const question of quiz.questions) {
      const studentAnswer = answers?.[question.id] || '';
      const isCorrect = studentAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
      const pointsEarned = isCorrect ? question.points : 0;

      totalScore += pointsEarned;
      totalPossible += question.points;

      // Save answer
      await prisma.quizAnswer.create({
        data: {
          attemptId: attempt.id,
          questionId: question.id,
          answer: studentAnswer,
          isCorrect,
          pointsEarned
        }
      });
    }

    // Calculate percentage and pass/fail
    const percentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;
    const passed = percentage >= quiz.passingScore;

    // Update attempt
    await prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        submittedAt: new Date(),
        score: totalScore,
        percentage,
        passed,
        status: 'submitted'
      }
    });

    res.redirect(`${config.basePath}/student/quizzes/${req.params.id}/results/${attempt.id}`);

  } catch (error) {
    console.error('Submit quiz error:', error);
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
    console.error('Quiz results error:', error);
    res.status(500).render('errors/500', {
      basePath: config.basePath,
      title: 'Error'
    });
  }
});

export default router;
