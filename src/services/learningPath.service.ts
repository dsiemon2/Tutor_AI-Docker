// Learning Path Service - Structured Learning Progressions & Mastery Tracking
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

// ============================================
// TYPES
// ============================================

export type MasteryLevel = 'novice' | 'beginner' | 'intermediate' | 'proficient' | 'expert' | 'master';
export type PathStatus = 'not_started' | 'in_progress' | 'completed' | 'paused';
export type NodeType = 'lesson' | 'quiz' | 'practice' | 'project' | 'assessment' | 'milestone';

export interface LearningPathNode {
  id: string;
  title: string;
  description?: string;
  type: NodeType;
  topicId?: string;
  order: number;
  estimatedMinutes: number;
  pointsValue: number;
  prerequisites: string[]; // Node IDs that must be completed first
  isOptional: boolean;
  unlockCriteria?: {
    minMastery?: MasteryLevel;
    minScore?: number;
    requiredBadges?: string[];
  };
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  subjectId?: string;
  gradeLevel?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  nodes: LearningPathNode[];
  prerequisites: string[]; // Path IDs
  outcomes: string[]; // Learning outcomes
  badgeId?: string; // Badge earned on completion
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PathProgress {
  pathId: string;
  studentId: string;
  status: PathStatus;
  currentNodeId?: string;
  completedNodes: string[];
  nodeScores: Record<string, number>; // nodeId -> score
  startedAt?: Date;
  completedAt?: Date;
  lastActivityAt: Date;
  totalPoints: number;
  masteryLevel: MasteryLevel;
}

export interface NodeProgress {
  nodeId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'skipped';
  score?: number;
  attempts: number;
  timeSpent: number; // seconds
  completedAt?: Date;
}

export interface MasteryProgress {
  topicId: string;
  studentId: string;
  level: MasteryLevel;
  score: number; // 0-100
  questionsAttempted: number;
  questionsCorrect: number;
  streak: number;
  lastActivityAt: Date;
  nextReviewAt?: Date;
  history: MasteryHistoryEntry[];
}

export interface MasteryHistoryEntry {
  date: Date;
  score: number;
  level: MasteryLevel;
  activity: string;
}

export interface PathRecommendation {
  path: LearningPath;
  reason: string;
  matchScore: number; // 0-100
  estimatedCompletion: string;
  prerequisites: {
    path: LearningPath;
    completed: boolean;
  }[];
}

// ============================================
// MASTERY LEVEL CALCULATIONS
// ============================================

export const MASTERY_THRESHOLDS = {
  novice: 0,
  beginner: 20,
  intermediate: 40,
  proficient: 60,
  expert: 80,
  master: 95
};

export function calculateMasteryLevel(score: number): MasteryLevel {
  if (score >= MASTERY_THRESHOLDS.master) return 'master';
  if (score >= MASTERY_THRESHOLDS.expert) return 'expert';
  if (score >= MASTERY_THRESHOLDS.proficient) return 'proficient';
  if (score >= MASTERY_THRESHOLDS.intermediate) return 'intermediate';
  if (score >= MASTERY_THRESHOLDS.beginner) return 'beginner';
  return 'novice';
}

export function getMasteryThreshold(level: MasteryLevel): number {
  return MASTERY_THRESHOLDS[level];
}

export function getNextMasteryLevel(current: MasteryLevel): MasteryLevel | null {
  const levels: MasteryLevel[] = ['novice', 'beginner', 'intermediate', 'proficient', 'expert', 'master'];
  const currentIndex = levels.indexOf(current);
  if (currentIndex < levels.length - 1) {
    return levels[currentIndex + 1];
  }
  return null; // Already at max
}

export function getMasteryProgress(currentScore: number, currentLevel: MasteryLevel): {
  progressInLevel: number;
  pointsToNextLevel: number;
  nextLevel: MasteryLevel | null;
} {
  const nextLevel = getNextMasteryLevel(currentLevel);
  if (!nextLevel) {
    return {
      progressInLevel: 100,
      pointsToNextLevel: 0,
      nextLevel: null
    };
  }

  const currentThreshold = MASTERY_THRESHOLDS[currentLevel];
  const nextThreshold = MASTERY_THRESHOLDS[nextLevel];
  const levelRange = nextThreshold - currentThreshold;
  const progressInRange = currentScore - currentThreshold;

  return {
    progressInLevel: Math.round((progressInRange / levelRange) * 100),
    pointsToNextLevel: nextThreshold - currentScore,
    nextLevel
  };
}

// ============================================
// MASTERY SCORE CALCULATION
// ============================================

export interface MasteryInput {
  questionsCorrect: number;
  questionsTotal: number;
  averageTimeSeconds: number;
  consistencyStreak: number;
  recentTrend: 'improving' | 'stable' | 'declining';
  daysSinceLastActivity: number;
}

export function calculateMasteryScore(input: MasteryInput): number {
  // Base score from accuracy (70% weight)
  const accuracyScore = (input.questionsCorrect / Math.max(input.questionsTotal, 1)) * 100;

  // Speed bonus (10% weight) - faster = better, up to a point
  const expectedTime = 30; // seconds per question
  const timeRatio = expectedTime / Math.max(input.averageTimeSeconds, 10);
  const speedScore = Math.min(timeRatio * 100, 100);

  // Consistency bonus (10% weight)
  const consistencyScore = Math.min(input.consistencyStreak * 10, 100);

  // Trend bonus (5% weight)
  let trendScore = 50;
  if (input.recentTrend === 'improving') trendScore = 100;
  if (input.recentTrend === 'declining') trendScore = 0;

  // Recency factor (5% weight) - decay over time
  const recencyDays = Math.min(input.daysSinceLastActivity, 30);
  const recencyScore = 100 - (recencyDays / 30) * 50; // Lose up to 50% over 30 days

  // Weighted combination
  const totalScore =
    (accuracyScore * 0.70) +
    (speedScore * 0.10) +
    (consistencyScore * 0.10) +
    (trendScore * 0.05) +
    (recencyScore * 0.05);

  return Math.round(Math.min(100, Math.max(0, totalScore)));
}

// ============================================
// LEARNING PATH PROGRESS
// ============================================

export function calculatePathProgress(
  path: LearningPath,
  completedNodes: string[]
): {
  completionPercentage: number;
  requiredRemaining: number;
  optionalRemaining: number;
  estimatedMinutesRemaining: number;
} {
  const requiredNodes = path.nodes.filter(n => !n.isOptional);
  const optionalNodes = path.nodes.filter(n => n.isOptional);

  const completedRequired = requiredNodes.filter(n => completedNodes.includes(n.id));
  const completedOptional = optionalNodes.filter(n => completedNodes.includes(n.id));

  const completionPercentage = requiredNodes.length > 0
    ? Math.round((completedRequired.length / requiredNodes.length) * 100)
    : 100;

  const remainingNodes = path.nodes.filter(n => !completedNodes.includes(n.id));
  const estimatedMinutesRemaining = remainingNodes
    .filter(n => !n.isOptional)
    .reduce((sum, n) => sum + n.estimatedMinutes, 0);

  return {
    completionPercentage,
    requiredRemaining: requiredNodes.length - completedRequired.length,
    optionalRemaining: optionalNodes.length - completedOptional.length,
    estimatedMinutesRemaining
  };
}

export function getAvailableNodes(
  path: LearningPath,
  completedNodes: string[],
  currentMastery?: MasteryLevel
): LearningPathNode[] {
  return path.nodes.filter(node => {
    // Already completed
    if (completedNodes.includes(node.id)) return false;

    // Check prerequisites
    const prereqsMet = node.prerequisites.every(prereqId =>
      completedNodes.includes(prereqId)
    );
    if (!prereqsMet) return false;

    // Check unlock criteria
    if (node.unlockCriteria) {
      if (node.unlockCriteria.minMastery && currentMastery) {
        const levels: MasteryLevel[] = ['novice', 'beginner', 'intermediate', 'proficient', 'expert', 'master'];
        const requiredIndex = levels.indexOf(node.unlockCriteria.minMastery);
        const currentIndex = levels.indexOf(currentMastery);
        if (currentIndex < requiredIndex) return false;
      }
    }

    return true;
  });
}

export function getNextRecommendedNode(
  path: LearningPath,
  completedNodes: string[],
  nodeScores: Record<string, number>
): LearningPathNode | null {
  const available = getAvailableNodes(path, completedNodes);

  if (available.length === 0) return null;

  // Sort by order, prioritizing required nodes
  const sorted = available.sort((a, b) => {
    if (a.isOptional !== b.isOptional) {
      return a.isOptional ? 1 : -1;
    }
    return a.order - b.order;
  });

  return sorted[0];
}

// ============================================
// PATH RECOMMENDATIONS
// ============================================

export function calculatePathMatch(
  path: LearningPath,
  studentProfile: {
    gradeLevel?: number;
    completedPaths: string[];
    interests: string[];
    strengths: string[];
    weaknesses: string[];
    currentMastery: Record<string, MasteryLevel>;
  }
): number {
  let score = 50; // Base score

  // Grade level match (+/- 20 points)
  if (path.gradeLevel && studentProfile.gradeLevel) {
    const diff = Math.abs(path.gradeLevel - studentProfile.gradeLevel);
    score += Math.max(0, 20 - diff * 5);
  }

  // Prerequisites completed (+20 points)
  const prereqsCompleted = path.prerequisites.every(p =>
    studentProfile.completedPaths.includes(p)
  );
  if (prereqsCompleted) score += 20;
  else score -= 30; // Penalize if prerequisites not met

  // Interest match (+10 points)
  if (studentProfile.interests.some(i =>
    path.title.toLowerCase().includes(i.toLowerCase()) ||
    path.description.toLowerCase().includes(i.toLowerCase())
  )) {
    score += 10;
  }

  // Addresses weaknesses (+10 points)
  if (studentProfile.weaknesses.some(w =>
    path.outcomes.some(o => o.toLowerCase().includes(w.toLowerCase()))
  )) {
    score += 10;
  }

  return Math.max(0, Math.min(100, score));
}

export function recommendPaths(
  availablePaths: LearningPath[],
  studentProfile: {
    gradeLevel?: number;
    completedPaths: string[];
    interests: string[];
    strengths: string[];
    weaknesses: string[];
    currentMastery: Record<string, MasteryLevel>;
  },
  limit: number = 5
): PathRecommendation[] {
  const scoredPaths = availablePaths
    .filter(p => !studentProfile.completedPaths.includes(p.id))
    .map(path => ({
      path,
      matchScore: calculatePathMatch(path, studentProfile)
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);

  return scoredPaths.map(({ path, matchScore }) => {
    // Generate reason
    let reason = 'Recommended based on your profile.';
    if (matchScore >= 80) {
      reason = 'Highly recommended - matches your interests and skill level.';
    } else if (matchScore >= 60) {
      reason = 'Good fit for your current learning goals.';
    } else if (matchScore < 40) {
      reason = 'You may need to complete prerequisites first.';
    }

    // Estimate completion
    const hoursPerWeek = 5; // Assume 5 hours/week
    const weeks = Math.ceil(path.estimatedHours / hoursPerWeek);
    const estimatedCompletion = weeks <= 1
      ? 'Less than a week'
      : weeks <= 4
        ? `About ${weeks} weeks`
        : `About ${Math.ceil(weeks / 4)} months`;

    return {
      path,
      reason,
      matchScore,
      estimatedCompletion,
      prerequisites: path.prerequisites.map(prereqId => ({
        path: availablePaths.find(p => p.id === prereqId)!,
        completed: studentProfile.completedPaths.includes(prereqId)
      })).filter(p => p.path)
    };
  });
}

// ============================================
// DATABASE OPERATIONS
// ============================================

export async function getStudentMastery(
  studentId: string,
  topicId?: string
): Promise<MasteryProgress[]> {
  const progress = await prisma.studentProgress.findMany({
    where: {
      studentId,
      ...(topicId ? { topicId } : {})
    },
    include: {
      topic: {
        include: {
          subject: true
        }
      }
    }
  });

  return progress.map(p => {
    const score = p.questionsCorrect && p.questionsAttempted
      ? (p.questionsCorrect / p.questionsAttempted) * 100
      : 0;

    return {
      topicId: p.topicId,
      studentId: p.studentId,
      level: calculateMasteryLevel(score),
      score: Math.round(score),
      questionsAttempted: p.questionsAttempted || 0,
      questionsCorrect: p.questionsCorrect || 0,
      streak: 0, // Would need separate tracking
      lastActivityAt: p.lastActivityAt,
      nextReviewAt: undefined,
      history: []
    };
  });
}

export async function updateStudentMastery(
  studentId: string,
  topicId: string,
  correctAnswers: number,
  totalQuestions: number
): Promise<MasteryProgress> {
  const existing = await prisma.studentProgress.findUnique({
    where: {
      studentId_topicId: { studentId, topicId }
    }
  });

  const newCorrect = (existing?.questionsCorrect || 0) + correctAnswers;
  const newTotal = (existing?.questionsAttempted || 0) + totalQuestions;
  const score = newTotal > 0 ? (newCorrect / newTotal) * 100 : 0;
  const level = calculateMasteryLevel(score);
  const levelNum = Math.round(score); // Store as numeric score

  const progress = await prisma.studentProgress.upsert({
    where: {
      studentId_topicId: { studentId, topicId }
    },
    update: {
      questionsCorrect: newCorrect,
      questionsAttempted: newTotal,
      masteryLevel: levelNum,
      lastActivityAt: new Date()
    },
    create: {
      studentId,
      topicId,
      questionsCorrect: newCorrect,
      questionsAttempted: newTotal,
      masteryLevel: levelNum,
      lastActivityAt: new Date()
    }
  });

  return {
    topicId: progress.topicId,
    studentId: progress.studentId,
    level,
    score: Math.round(score),
    questionsAttempted: newTotal,
    questionsCorrect: newCorrect,
    streak: 0,
    lastActivityAt: progress.lastActivityAt,
    history: []
  };
}

export async function getStudentPathProgress(
  studentId: string,
  pathId?: string
): Promise<PathProgress[]> {
  // For now, we'll use a simple structure
  // In production, this would be a dedicated PathProgress table
  const sessions = await prisma.tutoringSession.findMany({
    where: {
      studentId,
      ...(pathId ? { topic: { subjectId: pathId } } : {})
    },
    include: {
      topic: true
    },
    orderBy: { startedAt: 'desc' }
  });

  // Group by topic/subject to estimate path progress
  const progressMap = new Map<string, PathProgress>();

  for (const session of sessions) {
    if (!session.topicId) continue;

    const subjectId = session.topic?.subjectId || 'unknown';

    if (!progressMap.has(subjectId)) {
      progressMap.set(subjectId, {
        pathId: subjectId,
        studentId,
        status: 'in_progress',
        completedNodes: [],
        nodeScores: {},
        startedAt: session.startedAt,
        lastActivityAt: session.startedAt,
        totalPoints: 0,
        masteryLevel: 'novice'
      });
    }

    const progress = progressMap.get(subjectId)!;
    progress.completedNodes.push(session.topicId);
    progress.lastActivityAt = session.startedAt > progress.lastActivityAt
      ? session.startedAt
      : progress.lastActivityAt;
  }

  return Array.from(progressMap.values());
}

export async function getLearningPathsBySubject(
  subjectId: string
): Promise<LearningPath[]> {
  // Get topics for this subject to create path nodes
  const topics = await prisma.topic.findMany({
    where: {
      subjectId,
      isActive: true
    },
    include: {
      subject: {
        include: { category: true }
      }
    },
    orderBy: [
      { gradeLevel: 'asc' },
      { order: 'asc' }
    ]
  });

  if (topics.length === 0) return [];

  const subject = topics[0].subject;

  // Create a learning path from the topics
  const nodes: LearningPathNode[] = topics.map((topic, idx) => ({
    id: topic.id,
    title: topic.name,
    description: topic.description || undefined,
    type: 'lesson' as NodeType,
    topicId: topic.id,
    order: idx,
    estimatedMinutes: 30,
    pointsValue: 100,
    prerequisites: idx > 0 ? [topics[idx - 1].id] : [],
    isOptional: false
  }));

  const path: LearningPath = {
    id: subjectId,
    title: `${subject.name} Learning Path`,
    description: `Master ${subject.name} through a structured learning journey.`,
    subjectId,
    gradeLevel: topics[0].gradeLevel ?? undefined,
    difficulty: 'intermediate',
    estimatedHours: Math.ceil(topics.length * 0.5),
    nodes,
    prerequisites: [],
    outcomes: [
      `Understand core concepts of ${subject.name}`,
      `Apply ${subject.name} knowledge to solve problems`,
      `Demonstrate mastery through assessments`
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return [path];
}

export async function getAllLearningPaths(
  options?: {
    subjectId?: string;
    gradeLevel?: number;
    difficulty?: string;
  }
): Promise<LearningPath[]> {
  const subjects = await prisma.subject.findMany({
    where: {
      isActive: true,
      ...(options?.subjectId ? { id: options.subjectId } : {})
    },
    include: {
      category: true,
      topics: {
        where: { isActive: true },
        orderBy: [
          { gradeLevel: 'asc' },
          { order: 'asc' }
        ]
      }
    }
  });

  const paths: LearningPath[] = [];

  for (const subject of subjects) {
    if (subject.topics.length === 0) continue;

    // Filter by grade level if specified
    const relevantTopics = options?.gradeLevel
      ? subject.topics.filter(t =>
          t.gradeLevel === null ||
          Math.abs((t.gradeLevel || 0) - options.gradeLevel!) <= 2
        )
      : subject.topics;

    if (relevantTopics.length === 0) continue;

    const nodes: LearningPathNode[] = relevantTopics.map((topic, idx) => ({
      id: topic.id,
      title: topic.name,
      description: topic.description || undefined,
      type: 'lesson' as NodeType,
      topicId: topic.id,
      order: idx,
      estimatedMinutes: 30,
      pointsValue: 100,
      prerequisites: idx > 0 ? [relevantTopics[idx - 1].id] : [],
      isOptional: false
    }));

    paths.push({
      id: subject.id,
      title: `${subject.name} Learning Path`,
      description: `Master ${subject.name} through a structured learning journey covering ${relevantTopics.length} topics.`,
      subjectId: subject.id,
      gradeLevel: relevantTopics[0].gradeLevel ?? undefined,
      difficulty: 'intermediate',
      estimatedHours: Math.ceil(relevantTopics.length * 0.5),
      nodes,
      prerequisites: [],
      outcomes: [
        `Understand core concepts of ${subject.name}`,
        `Apply ${subject.name} knowledge to solve problems`,
        `Demonstrate mastery through assessments`
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  return paths;
}

export async function getStudentDashboardData(studentId: string): Promise<{
  overallMastery: MasteryLevel;
  topicsInProgress: number;
  topicsMastered: number;
  totalPoints: number;
  currentStreak: number;
  recentActivity: {
    date: Date;
    type: string;
    topic: string;
    points: number;
  }[];
  recommendations: string[];
}> {
  const progress = await prisma.studentProgress.findMany({
    where: { studentId },
    include: {
      topic: {
        include: { subject: true }
      }
    }
  });

  const sessions = await prisma.tutoringSession.findMany({
    where: { studentId },
    include: {
      topic: true
    },
    orderBy: { startedAt: 'desc' },
    take: 10
  });

  // Calculate overall mastery
  let totalScore = 0;
  let topicsMastered = 0;

  for (const p of progress) {
    const score = p.questionsAttempted && p.questionsAttempted > 0
      ? (p.questionsCorrect || 0) / p.questionsAttempted * 100
      : 0;
    totalScore += score;

    if (calculateMasteryLevel(score) === 'expert' || calculateMasteryLevel(score) === 'master') {
      topicsMastered++;
    }
  }

  const avgScore = progress.length > 0 ? totalScore / progress.length : 0;

  // Recent activity
  const recentActivity = sessions.map(s => ({
    date: s.startedAt,
    type: 'tutoring',
    topic: s.topic?.name || 'General',
    points: 50
  }));

  // Generate recommendations
  const recommendations: string[] = [];
  if (progress.length === 0) {
    recommendations.push('Start your first tutoring session to begin tracking progress!');
  } else if (avgScore < 50) {
    recommendations.push('Focus on reviewing fundamentals to build a stronger foundation.');
  } else if (avgScore < 80) {
    recommendations.push('Great progress! Try some harder practice problems to advance.');
  } else {
    recommendations.push('Excellent mastery! Consider helping other students or exploring new topics.');
  }

  return {
    overallMastery: calculateMasteryLevel(avgScore),
    topicsInProgress: progress.length - topicsMastered,
    topicsMastered,
    totalPoints: progress.length * 100, // Simplified
    currentStreak: 1, // Would need separate tracking
    recentActivity,
    recommendations
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function formatMasteryLevel(level: MasteryLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function getMasteryColor(level: MasteryLevel): string {
  const colors: Record<MasteryLevel, string> = {
    novice: '#6b7280',      // gray
    beginner: '#3b82f6',    // blue
    intermediate: '#10b981', // green
    proficient: '#f59e0b',  // amber
    expert: '#8b5cf6',      // purple
    master: '#ef4444'       // red/gold
  };
  return colors[level];
}

export function getMasteryBadge(level: MasteryLevel): string {
  const badges: Record<MasteryLevel, string> = {
    novice: 'bi-emoji-neutral',
    beginner: 'bi-emoji-smile',
    intermediate: 'bi-star',
    proficient: 'bi-star-fill',
    expert: 'bi-trophy',
    master: 'bi-trophy-fill'
  };
  return badges[level];
}

export function estimateTimeToMastery(
  currentScore: number,
  targetLevel: MasteryLevel,
  averageScorePerSession: number = 5
): {
  sessions: number;
  estimatedHours: number;
} {
  const targetScore = MASTERY_THRESHOLDS[targetLevel];
  const pointsNeeded = Math.max(0, targetScore - currentScore);
  const sessions = Math.ceil(pointsNeeded / averageScorePerSession);

  return {
    sessions,
    estimatedHours: Math.ceil(sessions * 0.5)
  };
}
