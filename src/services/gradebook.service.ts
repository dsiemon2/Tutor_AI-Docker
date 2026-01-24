// Gradebook Service - Grade calculation, weighting, and standards alignment
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

// ============================================
// TYPES
// ============================================

export interface GradeThresholds {
  gradeA: number;
  gradeAMinus: number;
  gradeBPlus: number;
  gradeB: number;
  gradeBMinus: number;
  gradeCPlus: number;
  gradeC: number;
  gradeCMinus: number;
  gradeDPlus: number;
  gradeD: number;
  gradeDMinus: number;
}

export interface CategoryGrade {
  total: number;
  count: number;
  average: number;
  dropped: number[];
}

export interface GradeSummary {
  overallGrade: number;
  letterGrade: string;
  gpa: number;
  categoryBreakdown: Record<string, CategoryGrade>;
  assignmentsCompleted: number;
  assignmentsMissing: number;
  assignmentsLate: number;
  quizzesCompleted: number;
  quizAverage: number | null;
}

// ============================================
// GRADEBOOK SETTINGS
// ============================================

export async function getGradebookSettings(): Promise<GradeThresholds & {
  useWeightedGrades: boolean;
  includeZerosInAverage: boolean;
  lateWorkPenalty: number;
  maxLatePenalty: number;
  gracePeriodHours: number;
}> {
  const settings = await prisma.gradebookSettings.findUnique({
    where: { id: 'default' }
  });

  if (settings) {
    return settings;
  }

  // Create default settings
  const defaultSettings = await prisma.gradebookSettings.create({
    data: { id: 'default' }
  });

  return defaultSettings;
}

export async function updateGradebookSettings(data: Partial<GradeThresholds> & {
  useWeightedGrades?: boolean;
  includeZerosInAverage?: boolean;
  lateWorkPenalty?: number;
  maxLatePenalty?: number;
  gracePeriodHours?: number;
}): Promise<void> {
  await prisma.gradebookSettings.upsert({
    where: { id: 'default' },
    update: data,
    create: { id: 'default', ...data }
  });
}

// ============================================
// LETTER GRADE CONVERSION
// ============================================

export function getLetterGrade(percentage: number, thresholds?: GradeThresholds): string {
  const t = thresholds || {
    gradeA: 90,
    gradeAMinus: 87,
    gradeBPlus: 83,
    gradeB: 80,
    gradeBMinus: 77,
    gradeCPlus: 73,
    gradeC: 70,
    gradeCMinus: 67,
    gradeDPlus: 63,
    gradeD: 60,
    gradeDMinus: 57
  };

  if (percentage >= t.gradeA) return 'A';
  if (percentage >= t.gradeAMinus) return 'A-';
  if (percentage >= t.gradeBPlus) return 'B+';
  if (percentage >= t.gradeB) return 'B';
  if (percentage >= t.gradeBMinus) return 'B-';
  if (percentage >= t.gradeCPlus) return 'C+';
  if (percentage >= t.gradeC) return 'C';
  if (percentage >= t.gradeCMinus) return 'C-';
  if (percentage >= t.gradeDPlus) return 'D+';
  if (percentage >= t.gradeD) return 'D';
  if (percentage >= t.gradeDMinus) return 'D-';
  return 'F';
}

export function getGPA(letterGrade: string): number {
  const gpaMap: Record<string, number> = {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'D-': 0.7,
    'F': 0.0
  };
  return gpaMap[letterGrade] ?? 0.0;
}

// ============================================
// GRADE CATEGORIES
// ============================================

export async function getGradeCategories(classId: string) {
  return prisma.gradeCategory.findMany({
    where: { classId, isActive: true },
    orderBy: { order: 'asc' }
  });
}

export async function createGradeCategory(data: {
  classId: string;
  name: string;
  weight: number;
  dropLowest?: number;
  color?: string;
  order?: number;
}) {
  return prisma.gradeCategory.create({
    data: {
      classId: data.classId,
      name: data.name,
      weight: data.weight,
      dropLowest: data.dropLowest || 0,
      color: data.color,
      order: data.order || 0
    }
  });
}

export async function updateGradeCategory(
  categoryId: string,
  data: {
    name?: string;
    weight?: number;
    dropLowest?: number;
    color?: string;
    order?: number;
  }
) {
  return prisma.gradeCategory.update({
    where: { id: categoryId },
    data
  });
}

export async function deleteGradeCategory(categoryId: string) {
  return prisma.gradeCategory.update({
    where: { id: categoryId },
    data: { isActive: false }
  });
}

export async function initializeDefaultCategories(classId: string) {
  const existingCategories = await prisma.gradeCategory.count({
    where: { classId }
  });

  if (existingCategories > 0) {
    return; // Categories already exist
  }

  const defaultCategories = [
    { name: 'Homework', weight: 0.20, color: '#3b82f6', order: 1 },
    { name: 'Quizzes', weight: 0.20, color: '#10b981', order: 2 },
    { name: 'Tests', weight: 0.40, color: '#f59e0b', order: 3 },
    { name: 'Projects', weight: 0.15, color: '#8b5cf6', order: 4 },
    { name: 'Participation', weight: 0.05, color: '#ec4899', order: 5 }
  ];

  for (const cat of defaultCategories) {
    await prisma.gradeCategory.create({
      data: { classId, ...cat }
    });
  }
}

// ============================================
// GRADE CALCULATION
// ============================================

export async function calculateStudentGrade(
  studentId: string,
  classId: string
): Promise<GradeSummary> {
  const settings = await getGradebookSettings();
  const categories = await getGradeCategories(classId);

  // Get all submissions for this student in this class
  const submissions = await prisma.submission.findMany({
    where: {
      studentId,
      assignment: {
        classId,
        isActive: true
      },
      status: 'graded'
    },
    include: {
      assignment: true
    }
  });

  // Get all quiz attempts for this student in this class
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: {
      studentId,
      quiz: {
        classId,
        isActive: true
      },
      status: 'graded'
    },
    include: {
      quiz: true
    }
  });

  // Count missing assignments
  const allAssignments = await prisma.assignment.findMany({
    where: {
      classId,
      isActive: true,
      OR: [
        { studentId: null }, // Class-wide assignments
        { studentId }        // Individual assignments for this student
      ]
    }
  });

  const submittedAssignmentIds = new Set(submissions.map(s => s.assignmentId));
  const missingAssignments = allAssignments.filter(a => !submittedAssignmentIds.has(a.id));
  const lateSubmissions = submissions.filter(s => s.isLate);

  // Map assignment types to categories
  const typeToCategory: Record<string, string> = {
    'homework': 'Homework',
    'project': 'Projects',
    'practice': 'Homework',
    'test': 'Tests',
    'quiz': 'Quizzes'
  };

  // Calculate category grades
  const categoryBreakdown: Record<string, CategoryGrade> = {};

  for (const category of categories) {
    categoryBreakdown[category.id] = {
      total: 0,
      count: 0,
      average: 0,
      dropped: []
    };
  }

  // Process submissions
  for (const submission of submissions) {
    if (submission.grade === null) continue;

    const categoryName = typeToCategory[submission.assignment.type] || 'Homework';
    const category = categories.find(c => c.name === categoryName);

    if (category && categoryBreakdown[category.id]) {
      // Apply late penalty if applicable
      let grade = submission.grade;
      if (submission.isLate && settings.lateWorkPenalty > 0) {
        const dueDate = submission.assignment.dueDate;
        if (dueDate) {
          const hoursLate = (submission.submittedAt.getTime() - dueDate.getTime()) / (1000 * 60 * 60);
          const effectiveHoursLate = Math.max(0, hoursLate - settings.gracePeriodHours);
          const daysLate = Math.ceil(effectiveHoursLate / 24);
          const penalty = Math.min(daysLate * settings.lateWorkPenalty, settings.maxLatePenalty);
          grade = Math.max(0, grade - penalty);
        }
      }

      categoryBreakdown[category.id].total += grade;
      categoryBreakdown[category.id].count++;
    }
  }

  // Process quiz attempts (use best attempt for each quiz)
  const quizBestScores: Record<string, number> = {};
  for (const attempt of quizAttempts) {
    if (attempt.percentage !== null) {
      const quizId = attempt.quizId;
      if (!quizBestScores[quizId] || attempt.percentage > quizBestScores[quizId]) {
        quizBestScores[quizId] = attempt.percentage;
      }
    }
  }

  // Add quiz scores to Quizzes category
  const quizCategory = categories.find(c => c.name === 'Quizzes');
  if (quizCategory) {
    for (const score of Object.values(quizBestScores)) {
      categoryBreakdown[quizCategory.id].total += score;
      categoryBreakdown[quizCategory.id].count++;
    }
  }

  // Handle drop lowest and calculate averages
  for (const category of categories) {
    const cat = categoryBreakdown[category.id];
    if (cat.count === 0) {
      cat.average = 0;
      continue;
    }

    // For drop lowest, we'd need to track individual grades
    // Simplified: just calculate average
    cat.average = cat.total / cat.count;
  }

  // Calculate weighted overall grade
  let weightedSum = 0;
  let weightUsed = 0;

  for (const category of categories) {
    const cat = categoryBreakdown[category.id];
    if (cat.count > 0 || settings.includeZerosInAverage) {
      weightedSum += cat.average * category.weight;
      weightUsed += category.weight;
    }
  }

  // Include zeros for missing assignments if configured
  if (settings.includeZerosInAverage && missingAssignments.length > 0) {
    // Missing assignments count as zeros
    // This is simplified; real implementation would distribute across categories
  }

  const overallGrade = weightUsed > 0 ? weightedSum / weightUsed : 0;
  const letterGrade = getLetterGrade(overallGrade);
  const gpa = getGPA(letterGrade);

  // Quiz average
  const quizScores = Object.values(quizBestScores);
  const quizAverage = quizScores.length > 0
    ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
    : null;

  return {
    overallGrade,
    letterGrade,
    gpa,
    categoryBreakdown,
    assignmentsCompleted: submissions.length,
    assignmentsMissing: missingAssignments.length,
    assignmentsLate: lateSubmissions.length,
    quizzesCompleted: Object.keys(quizBestScores).length,
    quizAverage
  };
}

export async function updateGradebookEntry(
  studentId: string,
  classId: string
): Promise<void> {
  const summary = await calculateStudentGrade(studentId, classId);

  await prisma.gradebookEntry.upsert({
    where: {
      studentId_classId: { studentId, classId }
    },
    update: {
      categoryGrades: JSON.stringify(summary.categoryBreakdown),
      overallGrade: summary.overallGrade,
      letterGrade: summary.letterGrade,
      gpa: summary.gpa,
      assignmentsCompleted: summary.assignmentsCompleted,
      assignmentsMissing: summary.assignmentsMissing,
      assignmentsLate: summary.assignmentsLate,
      quizzesCompleted: summary.quizzesCompleted,
      quizAverage: summary.quizAverage,
      lastCalculatedAt: new Date()
    },
    create: {
      studentId,
      classId,
      categoryGrades: JSON.stringify(summary.categoryBreakdown),
      overallGrade: summary.overallGrade,
      letterGrade: summary.letterGrade,
      gpa: summary.gpa,
      assignmentsCompleted: summary.assignmentsCompleted,
      assignmentsMissing: summary.assignmentsMissing,
      assignmentsLate: summary.assignmentsLate,
      quizzesCompleted: summary.quizzesCompleted,
      quizAverage: summary.quizAverage
    }
  });
}

export async function getClassGradebook(classId: string) {
  // Get all students in the class
  const classStudents = await prisma.classStudent.findMany({
    where: { classId },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          studentId: true
        }
      }
    }
  });

  // Get gradebook entries
  const entries = await prisma.gradebookEntry.findMany({
    where: { classId }
  });

  const entryMap = new Map(entries.map(e => [e.studentId, e]));

  // Combine data
  return classStudents.map(cs => ({
    student: cs.student,
    gradebook: entryMap.get(cs.studentId) || null,
    needsCalculation: !entryMap.has(cs.studentId)
  }));
}

export async function recalculateClassGrades(classId: string): Promise<void> {
  const classStudents = await prisma.classStudent.findMany({
    where: { classId }
  });

  for (const cs of classStudents) {
    try {
      await updateGradebookEntry(cs.studentId, classId);
    } catch (error) {
      logger.error(`Failed to calculate grade for student ${cs.studentId} in class ${classId}: ${error}`);
    }
  }
}

// ============================================
// STANDARDS
// ============================================

export async function getStandards(filters?: {
  gradeLevel?: number;
  subjectArea?: string;
  standardSet?: string;
  search?: string;
}) {
  const where: Record<string, unknown> = { isActive: true };

  if (filters?.gradeLevel !== undefined) {
    where.gradeLevel = filters.gradeLevel;
  }
  if (filters?.subjectArea) {
    where.subjectArea = filters.subjectArea;
  }
  if (filters?.standardSet) {
    where.standardSet = filters.standardSet;
  }
  if (filters?.search) {
    where.OR = [
      { code: { contains: filters.search } },
      { title: { contains: filters.search } },
      { description: { contains: filters.search } }
    ];
  }

  return prisma.standard.findMany({
    where,
    orderBy: [{ gradeLevel: 'asc' }, { code: 'asc' }],
    include: {
      parent: true,
      children: true
    }
  });
}

export async function createStandard(data: {
  code: string;
  title: string;
  description?: string;
  gradeLevel?: number;
  subjectArea?: string;
  domain?: string;
  cluster?: string;
  standardSet?: string;
  state?: string;
  parentId?: string;
}) {
  return prisma.standard.create({ data });
}

export async function alignToStandard(data: {
  standardId: string;
  entityType: 'Assignment' | 'Quiz' | 'Lesson' | 'Topic';
  entityId: string;
  alignmentLevel?: 'full' | 'partial' | 'introduction';
  notes?: string;
  createdById?: string;
}) {
  return prisma.standardAlignment.create({
    data: {
      standardId: data.standardId,
      entityType: data.entityType,
      entityId: data.entityId,
      alignmentLevel: data.alignmentLevel || 'full',
      notes: data.notes,
      createdById: data.createdById
    }
  });
}

export async function getStandardAlignments(entityType: string, entityId: string) {
  return prisma.standardAlignment.findMany({
    where: { entityType, entityId },
    include: {
      standard: true
    }
  });
}

export async function removeStandardAlignment(alignmentId: string) {
  return prisma.standardAlignment.delete({
    where: { id: alignmentId }
  });
}

export async function getStandardMastery(studentId: string, standardId: string) {
  // Get all aligned content for this standard
  const alignments = await prisma.standardAlignment.findMany({
    where: { standardId }
  });

  let totalScore = 0;
  let totalItems = 0;

  for (const alignment of alignments) {
    if (alignment.entityType === 'Assignment') {
      const submission = await prisma.submission.findFirst({
        where: {
          studentId,
          assignmentId: alignment.entityId,
          status: 'graded'
        }
      });
      if (submission?.grade !== null) {
        totalScore += submission.grade;
        totalItems++;
      }
    } else if (alignment.entityType === 'Quiz') {
      const attempt = await prisma.quizAttempt.findFirst({
        where: {
          studentId,
          quizId: alignment.entityId,
          status: 'graded'
        },
        orderBy: { percentage: 'desc' }
      });
      if (attempt?.percentage !== null) {
        totalScore += attempt.percentage;
        totalItems++;
      }
    }
  }

  return {
    standardId,
    itemsAssessed: totalItems,
    averageScore: totalItems > 0 ? totalScore / totalItems : null,
    masteryLevel: totalItems > 0 ? getMasteryLevel(totalScore / totalItems) : 'not_assessed'
  };
}

function getMasteryLevel(score: number): string {
  if (score >= 90) return 'mastered';
  if (score >= 75) return 'proficient';
  if (score >= 60) return 'approaching';
  return 'below';
}

// ============================================
// GRADE REPORTS
// ============================================

export async function getStudentGradeReport(studentId: string) {
  // Get all classes the student is enrolled in
  const enrollments = await prisma.classStudent.findMany({
    where: { studentId },
    include: {
      class: {
        include: {
          subject: true
        }
      }
    }
  });

  const report = [];

  for (const enrollment of enrollments) {
    const entry = await prisma.gradebookEntry.findUnique({
      where: {
        studentId_classId: { studentId, classId: enrollment.classId }
      }
    });

    report.push({
      class: enrollment.class,
      subject: enrollment.class.subject,
      grade: entry ? {
        overall: entry.overallGrade,
        letter: entry.letterGrade,
        gpa: entry.gpa,
        assignmentsCompleted: entry.assignmentsCompleted,
        assignmentsMissing: entry.assignmentsMissing
      } : null
    });
  }

  // Calculate cumulative GPA
  const gradedClasses = report.filter(r => r.grade?.gpa !== null);
  const cumulativeGPA = gradedClasses.length > 0
    ? gradedClasses.reduce((sum, r) => sum + (r.grade?.gpa || 0), 0) / gradedClasses.length
    : null;

  return {
    classes: report,
    cumulativeGPA,
    totalClasses: report.length,
    gradedClasses: gradedClasses.length
  };
}

export async function getClassStatistics(classId: string) {
  const entries = await prisma.gradebookEntry.findMany({
    where: { classId, overallGrade: { not: null } }
  });

  if (entries.length === 0) {
    return {
      studentCount: 0,
      averageGrade: null,
      medianGrade: null,
      highestGrade: null,
      lowestGrade: null,
      gradeDistribution: {}
    };
  }

  const grades = entries.map(e => e.overallGrade!).sort((a, b) => a - b);
  const average = grades.reduce((a, b) => a + b, 0) / grades.length;
  const median = grades[Math.floor(grades.length / 2)];

  // Grade distribution
  const distribution: Record<string, number> = {
    'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0
  };

  for (const entry of entries) {
    if (entry.letterGrade) {
      const letter = entry.letterGrade.charAt(0);
      if (distribution[letter] !== undefined) {
        distribution[letter]++;
      }
    }
  }

  return {
    studentCount: entries.length,
    averageGrade: average,
    medianGrade: median,
    highestGrade: grades[grades.length - 1],
    lowestGrade: grades[0],
    gradeDistribution: distribution
  };
}
