// Diagnostic Assessment Service - Adaptive testing, proficiency calculation, skill gap identification
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

// ============================================
// TYPES
// ============================================

export type ProficiencyLevel = 'below_basic' | 'basic' | 'proficient' | 'advanced';

export interface SkillResult {
  skillCode: string;
  skillName: string;
  correct: number;
  total: number;
  percentage: number;
  gradeLevel?: number;
}

export interface DiagnosticResultSummary {
  overallScore: number;
  proficiencyLevel: ProficiencyLevel;
  estimatedGradeLevel: number;
  skillBreakdown: Record<string, SkillResult>;
  skillGaps: string[];
  strengths: string[];
  recommendations: {
    type: 'topic' | 'lesson' | 'practice';
    id: string;
    name: string;
    reason: string;
  }[];
}

// ============================================
// DIAGNOSTIC TEST MANAGEMENT
// ============================================

export async function getDiagnosticTests(filters?: {
  subjectId?: string;
  gradeLevel?: number;
  isActive?: boolean;
}) {
  const where: Record<string, unknown> = {};

  if (filters?.subjectId) {
    where.subjectId = filters.subjectId;
  }
  if (filters?.gradeLevel !== undefined) {
    where.minGradeLevel = { lte: filters.gradeLevel };
    where.maxGradeLevel = { gte: filters.gradeLevel };
  }
  if (filters?.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return prisma.diagnosticTest.findMany({
    where,
    include: {
      _count: {
        select: { questions: true, attempts: true }
      }
    },
    orderBy: { title: 'asc' }
  });
}

export async function getDiagnosticTest(testId: string) {
  return prisma.diagnosticTest.findUnique({
    where: { id: testId },
    include: {
      questions: {
        where: { isActive: true },
        orderBy: { difficulty: 'asc' }
      }
    }
  });
}

export async function createDiagnosticTest(data: {
  code: string;
  title: string;
  description?: string;
  subjectId?: string;
  topicId?: string;
  minGradeLevel?: number;
  maxGradeLevel?: number;
  questionCount?: number;
  timeLimit?: number;
  adaptiveDifficulty?: boolean;
  passingScore?: number;
}) {
  return prisma.diagnosticTest.create({
    data: {
      code: data.code,
      title: data.title,
      description: data.description,
      subjectId: data.subjectId,
      topicId: data.topicId,
      minGradeLevel: data.minGradeLevel ?? 0,
      maxGradeLevel: data.maxGradeLevel ?? 12,
      questionCount: data.questionCount ?? 20,
      timeLimit: data.timeLimit,
      adaptiveDifficulty: data.adaptiveDifficulty ?? true,
      passingScore: data.passingScore ?? 70
    }
  });
}

// ============================================
// QUESTION MANAGEMENT
// ============================================

export async function addDiagnosticQuestion(data: {
  testId: string;
  questionText: string;
  questionType?: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: number;
  gradeLevel?: number;
  skillCode?: string;
  skillName?: string;
  points?: number;
  timeEstimate?: number;
}) {
  return prisma.diagnosticQuestion.create({
    data: {
      testId: data.testId,
      questionText: data.questionText,
      questionType: data.questionType || 'multiple_choice',
      options: data.options ? JSON.stringify(data.options) : null,
      correctAnswer: data.correctAnswer,
      explanation: data.explanation,
      difficulty: data.difficulty ?? 5,
      gradeLevel: data.gradeLevel,
      skillCode: data.skillCode,
      skillName: data.skillName,
      points: data.points ?? 1,
      timeEstimate: data.timeEstimate
    }
  });
}

// ============================================
// ADAPTIVE TESTING
// ============================================

export async function startDiagnosticAttempt(
  testId: string,
  studentId: string
): Promise<string> {
  const attempt = await prisma.diagnosticAttempt.create({
    data: {
      testId,
      studentId,
      status: 'in_progress'
    }
  });

  return attempt.id;
}

export async function getNextQuestion(attemptId: string): Promise<{
  question: unknown;
  questionNumber: number;
  totalQuestions: number;
} | null> {
  const attempt = await prisma.diagnosticAttempt.findUnique({
    where: { id: attemptId },
    include: {
      test: true,
      responses: {
        include: { question: true }
      }
    }
  });

  if (!attempt || attempt.status !== 'in_progress') {
    return null;
  }

  const answeredQuestionIds = attempt.responses.map(r => r.questionId);
  const totalNeeded = attempt.test.questionCount;

  if (answeredQuestionIds.length >= totalNeeded) {
    return null; // Test complete
  }

  // Calculate current difficulty level based on recent performance
  let targetDifficulty = 5; // Start at medium

  if (attempt.test.adaptiveDifficulty && attempt.responses.length > 0) {
    // Look at last 5 responses
    const recentResponses = attempt.responses.slice(-5);
    const correctCount = recentResponses.filter(r => r.isCorrect).length;
    const recentAccuracy = correctCount / recentResponses.length;

    // Get average difficulty of recent questions
    const avgDifficulty = recentResponses.reduce((sum, r) =>
      sum + (r.difficultyAtAnswer || r.question.difficulty), 0
    ) / recentResponses.length;

    // Adjust target difficulty based on performance
    if (recentAccuracy >= 0.8) {
      targetDifficulty = Math.min(10, avgDifficulty + 1);
    } else if (recentAccuracy >= 0.6) {
      targetDifficulty = avgDifficulty;
    } else if (recentAccuracy >= 0.4) {
      targetDifficulty = Math.max(1, avgDifficulty - 1);
    } else {
      targetDifficulty = Math.max(1, avgDifficulty - 2);
    }
  }

  // Get available questions sorted by distance from target difficulty
  const availableQuestions = await prisma.diagnosticQuestion.findMany({
    where: {
      testId: attempt.testId,
      isActive: true,
      id: { notIn: answeredQuestionIds }
    }
  });

  if (availableQuestions.length === 0) {
    return null;
  }

  // Sort by distance from target difficulty
  availableQuestions.sort((a, b) => {
    const distA = Math.abs(a.difficulty - targetDifficulty);
    const distB = Math.abs(b.difficulty - targetDifficulty);
    return distA - distB;
  });

  // Add some randomization among similar difficulties
  const closeQuestions = availableQuestions.filter(q =>
    Math.abs(q.difficulty - targetDifficulty) <= 1
  );

  const selectedQuestion = closeQuestions.length > 0
    ? closeQuestions[Math.floor(Math.random() * Math.min(3, closeQuestions.length))]
    : availableQuestions[0];

  return {
    question: {
      ...selectedQuestion,
      options: selectedQuestion.options ? JSON.parse(selectedQuestion.options) : null
    },
    questionNumber: answeredQuestionIds.length + 1,
    totalQuestions: totalNeeded
  };
}

export async function submitAnswer(
  attemptId: string,
  questionId: string,
  answer: string,
  timeSpentSeconds?: number
): Promise<{ isCorrect: boolean; explanation?: string }> {
  const question = await prisma.diagnosticQuestion.findUnique({
    where: { id: questionId }
  });

  if (!question) {
    throw new Error('Question not found');
  }

  // Check if answer is correct
  const normalizedAnswer = answer.trim().toLowerCase();
  const normalizedCorrect = question.correctAnswer.trim().toLowerCase();
  const isCorrect = normalizedAnswer === normalizedCorrect;

  // Save response
  await prisma.diagnosticResponse.create({
    data: {
      attemptId,
      questionId,
      answer,
      isCorrect,
      timeSpentSeconds,
      difficultyAtAnswer: question.difficulty
    }
  });

  // Update attempt stats
  await prisma.diagnosticAttempt.update({
    where: { id: attemptId },
    data: {
      totalQuestions: { increment: 1 },
      correctAnswers: isCorrect ? { increment: 1 } : undefined
    }
  });

  return {
    isCorrect,
    explanation: question.explanation || undefined
  };
}

export async function completeAttempt(attemptId: string): Promise<DiagnosticResultSummary> {
  const attempt = await prisma.diagnosticAttempt.findUnique({
    where: { id: attemptId },
    include: {
      test: true,
      responses: {
        include: { question: true }
      }
    }
  });

  if (!attempt) {
    throw new Error('Attempt not found');
  }

  // Calculate results
  const result = calculateDiagnosticResult(attempt.responses);

  // Update attempt
  await prisma.diagnosticAttempt.update({
    where: { id: attemptId },
    data: {
      status: 'completed',
      completedAt: new Date(),
      score: result.overallScore,
      proficiencyLevel: result.proficiencyLevel,
      estimatedGradeLevel: result.estimatedGradeLevel
    }
  });

  // Save detailed result
  await prisma.diagnosticResult.create({
    data: {
      attemptId,
      studentId: attempt.studentId,
      overallScore: result.overallScore,
      proficiencyLevel: result.proficiencyLevel,
      estimatedGradeLevel: result.estimatedGradeLevel,
      skillBreakdown: JSON.stringify(result.skillBreakdown),
      skillGaps: JSON.stringify(result.skillGaps),
      strengths: JSON.stringify(result.strengths),
      recommendations: JSON.stringify(result.recommendations)
    }
  });

  // Create skill gap records
  for (const skillCode of result.skillGaps) {
    const skillData = result.skillBreakdown[skillCode];
    if (skillData) {
      await createOrUpdateSkillGap(attempt.studentId, {
        skillCode,
        skillName: skillData.skillName,
        currentScore: skillData.percentage,
        gradeLevel: skillData.gradeLevel,
        sourceType: 'diagnostic',
        sourceId: attemptId,
        subjectId: attempt.test.subjectId || undefined,
        topicId: attempt.test.topicId || undefined
      });
    }
  }

  return result;
}

// ============================================
// RESULT CALCULATION
// ============================================

function calculateDiagnosticResult(
  responses: Array<{
    isCorrect: boolean | null;
    question: {
      difficulty: number;
      gradeLevel: number | null;
      skillCode: string | null;
      skillName: string | null;
    };
  }>
): DiagnosticResultSummary {
  // Calculate overall score
  const totalQuestions = responses.length;
  const correctAnswers = responses.filter(r => r.isCorrect).length;
  const overallScore = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  // Calculate skill breakdown
  const skillBreakdown: Record<string, SkillResult> = {};

  for (const response of responses) {
    const skillCode = response.question.skillCode || 'general';

    if (!skillBreakdown[skillCode]) {
      skillBreakdown[skillCode] = {
        skillCode,
        skillName: response.question.skillName || 'General',
        correct: 0,
        total: 0,
        percentage: 0,
        gradeLevel: response.question.gradeLevel || undefined
      };
    }

    skillBreakdown[skillCode].total++;
    if (response.isCorrect) {
      skillBreakdown[skillCode].correct++;
    }
  }

  // Calculate percentages
  for (const skill of Object.values(skillBreakdown)) {
    skill.percentage = skill.total > 0 ? (skill.correct / skill.total) * 100 : 0;
  }

  // Identify gaps and strengths
  const skillGaps: string[] = [];
  const strengths: string[] = [];

  for (const [code, skill] of Object.entries(skillBreakdown)) {
    if (skill.percentage < 70) {
      skillGaps.push(code);
    }
    if (skill.percentage >= 90) {
      strengths.push(code);
    }
  }

  // Calculate estimated grade level using IRT-like approach
  const estimatedGradeLevel = calculateEstimatedGradeLevel(responses);

  // Determine proficiency level
  const proficiencyLevel = getProficiencyLevel(overallScore);

  // Generate recommendations
  const recommendations = generateRecommendations(skillGaps, skillBreakdown);

  return {
    overallScore,
    proficiencyLevel,
    estimatedGradeLevel,
    skillBreakdown,
    skillGaps,
    strengths,
    recommendations
  };
}

function calculateEstimatedGradeLevel(
  responses: Array<{
    isCorrect: boolean | null;
    question: {
      difficulty: number;
      gradeLevel: number | null;
    };
  }>
): number {
  // Use a simple weighted average based on correct answers at different grade levels
  let weightedSum = 0;
  let totalWeight = 0;

  for (const response of responses) {
    if (response.question.gradeLevel !== null) {
      const weight = response.isCorrect ? 1 : 0.3; // Correct answers count more
      weightedSum += response.question.gradeLevel * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight === 0) {
    return 5; // Default to 5th grade if no grade levels
  }

  // Also factor in overall performance
  const correctCount = responses.filter(r => r.isCorrect).length;
  const accuracy = responses.length > 0 ? correctCount / responses.length : 0;

  // Adjust grade level based on accuracy
  let baseGrade = weightedSum / totalWeight;

  if (accuracy >= 0.9) {
    baseGrade += 0.5; // Performing above level
  } else if (accuracy >= 0.7) {
    // At level
  } else if (accuracy >= 0.5) {
    baseGrade -= 0.5; // Slightly below
  } else {
    baseGrade -= 1; // Significantly below
  }

  // Clamp to valid grade range
  return Math.max(0, Math.min(12, Math.round(baseGrade * 10) / 10));
}

function getProficiencyLevel(score: number): ProficiencyLevel {
  if (score >= 90) return 'advanced';
  if (score >= 70) return 'proficient';
  if (score >= 50) return 'basic';
  return 'below_basic';
}

function generateRecommendations(
  skillGaps: string[],
  skillBreakdown: Record<string, SkillResult>
): Array<{ type: 'topic' | 'lesson' | 'practice'; id: string; name: string; reason: string }> {
  const recommendations: Array<{ type: 'topic' | 'lesson' | 'practice'; id: string; name: string; reason: string }> = [];

  // Sort gaps by severity (lowest score first)
  const sortedGaps = skillGaps.sort((a, b) => {
    const scoreA = skillBreakdown[a]?.percentage || 0;
    const scoreB = skillBreakdown[b]?.percentage || 0;
    return scoreA - scoreB;
  });

  // Generate recommendations for top 5 gaps
  for (const skillCode of sortedGaps.slice(0, 5)) {
    const skill = skillBreakdown[skillCode];
    if (skill) {
      recommendations.push({
        type: 'practice',
        id: skillCode,
        name: skill.skillName,
        reason: `Score: ${skill.percentage.toFixed(0)}% - needs improvement`
      });
    }
  }

  return recommendations;
}

// ============================================
// SKILL GAP MANAGEMENT
// ============================================

async function createOrUpdateSkillGap(
  studentId: string,
  data: {
    skillCode: string;
    skillName: string;
    currentScore: number;
    gradeLevel?: number;
    sourceType: string;
    sourceId?: string;
    subjectId?: string;
    topicId?: string;
  }
): Promise<void> {
  const targetScore = 70;
  const gapSize = Math.max(0, targetScore - data.currentScore);

  // Determine priority based on gap size
  let priority: string;
  if (gapSize >= 40) {
    priority = 'critical';
  } else if (gapSize >= 25) {
    priority = 'high';
  } else if (gapSize >= 10) {
    priority = 'medium';
  } else {
    priority = 'low';
  }

  // Check if gap already exists
  const existing = await prisma.skillGap.findFirst({
    where: {
      studentId,
      skillCode: data.skillCode,
      isResolved: false
    }
  });

  if (existing) {
    // Update existing gap
    await prisma.skillGap.update({
      where: { id: existing.id },
      data: {
        currentScore: data.currentScore,
        gapSize,
        priority,
        sourceType: data.sourceType,
        sourceId: data.sourceId
      }
    });
  } else {
    // Create new gap
    await prisma.skillGap.create({
      data: {
        studentId,
        subjectId: data.subjectId,
        topicId: data.topicId,
        skillCode: data.skillCode,
        skillName: data.skillName,
        gradeLevel: data.gradeLevel,
        currentScore: data.currentScore,
        targetScore,
        gapSize,
        priority,
        sourceType: data.sourceType,
        sourceId: data.sourceId
      }
    });
  }
}

export async function getStudentSkillGaps(
  studentId: string,
  filters?: {
    subjectId?: string;
    priority?: string;
    isResolved?: boolean;
  }
) {
  const where: Record<string, unknown> = { studentId };

  if (filters?.subjectId) {
    where.subjectId = filters.subjectId;
  }
  if (filters?.priority) {
    where.priority = filters.priority;
  }
  if (filters?.isResolved !== undefined) {
    where.isResolved = filters.isResolved;
  }

  return prisma.skillGap.findMany({
    where,
    orderBy: [
      { priority: 'desc' },
      { gapSize: 'desc' }
    ]
  });
}

export async function resolveSkillGap(
  gapId: string,
  resolutionScore: number
): Promise<void> {
  await prisma.skillGap.update({
    where: { id: gapId },
    data: {
      isResolved: true,
      resolvedAt: new Date(),
      resolutionScore
    }
  });
}

// ============================================
// STUDENT DIAGNOSTIC HISTORY
// ============================================

export async function getStudentDiagnosticHistory(studentId: string) {
  const attempts = await prisma.diagnosticAttempt.findMany({
    where: { studentId, status: 'completed' },
    include: {
      test: true,
      result: true
    },
    orderBy: { completedAt: 'desc' }
  });

  return attempts.map(attempt => ({
    id: attempt.id,
    testId: attempt.testId,
    testTitle: attempt.test.title,
    completedAt: attempt.completedAt,
    score: attempt.score,
    proficiencyLevel: attempt.proficiencyLevel,
    estimatedGradeLevel: attempt.estimatedGradeLevel,
    result: attempt.result ? {
      skillGaps: attempt.result.skillGaps ? JSON.parse(attempt.result.skillGaps) : [],
      strengths: attempt.result.strengths ? JSON.parse(attempt.result.strengths) : [],
      recommendations: attempt.result.recommendations ? JSON.parse(attempt.result.recommendations) : []
    } : null
  }));
}

export async function getStudentProficiencyOverTime(
  studentId: string,
  subjectId?: string
): Promise<Array<{ date: Date; score: number; gradeLevel: number }>> {
  const where: Record<string, unknown> = {
    studentId,
    status: 'completed'
  };

  if (subjectId) {
    where.test = { subjectId };
  }

  const attempts = await prisma.diagnosticAttempt.findMany({
    where,
    select: {
      completedAt: true,
      score: true,
      estimatedGradeLevel: true
    },
    orderBy: { completedAt: 'asc' }
  });

  return attempts
    .filter(a => a.completedAt && a.score !== null && a.estimatedGradeLevel !== null)
    .map(a => ({
      date: a.completedAt!,
      score: a.score!,
      gradeLevel: a.estimatedGradeLevel!
    }));
}

// ============================================
// PLACEMENT RECOMMENDATIONS
// ============================================

export async function getPlacementRecommendation(
  studentId: string,
  subjectId: string
): Promise<{
  recommendedGradeLevel: number;
  currentProficiency: ProficiencyLevel;
  reasoning: string;
  topicsToReview: string[];
  readyForTopics: string[];
}> {
  // Get most recent diagnostic result for this subject
  const latestAttempt = await prisma.diagnosticAttempt.findFirst({
    where: {
      studentId,
      test: { subjectId },
      status: 'completed'
    },
    include: {
      result: true,
      test: true
    },
    orderBy: { completedAt: 'desc' }
  });

  if (!latestAttempt || !latestAttempt.result) {
    return {
      recommendedGradeLevel: 5, // Default
      currentProficiency: 'basic',
      reasoning: 'No diagnostic data available. Recommend taking a diagnostic assessment.',
      topicsToReview: [],
      readyForTopics: []
    };
  }

  const result = latestAttempt.result;
  const skillGaps = result.skillGaps ? JSON.parse(result.skillGaps) : [];
  const strengths = result.strengths ? JSON.parse(result.strengths) : [];

  // Get topic names for skill codes
  const topicsToReview = skillGaps.slice(0, 5);
  const readyForTopics = strengths.slice(0, 5);

  let reasoning = `Based on diagnostic assessment completed on ${latestAttempt.completedAt?.toLocaleDateString()}:\n`;
  reasoning += `- Overall score: ${result.overallScore.toFixed(1)}%\n`;
  reasoning += `- Estimated grade level: ${result.estimatedGradeLevel.toFixed(1)}\n`;
  reasoning += `- Identified ${skillGaps.length} skill gaps and ${strengths.length} strengths`;

  return {
    recommendedGradeLevel: result.estimatedGradeLevel,
    currentProficiency: result.proficiencyLevel as ProficiencyLevel,
    reasoning,
    topicsToReview,
    readyForTopics
  };
}
