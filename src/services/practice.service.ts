// Practice Mode & Drill System Service
// Implements spaced repetition (SM-2 algorithm) and adaptive practice

import { prisma } from '../config/database';
import { logger } from '../utils/logger';

// ============================================
// TYPES
// ============================================

export type PracticeType = 'drill' | 'flashcard' | 'quiz' | 'timed' | 'adaptive';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
export type ResponseQuality = 0 | 1 | 2 | 3 | 4 | 5; // SM-2 quality ratings

export interface PracticeItem {
  id: string;
  question: string;
  questionType: 'multiple_choice' | 'short_answer' | 'true_false' | 'fill_blank';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: number;
  skillCode?: string;
  topicId?: string;
  points: number;
}

export interface PracticeSession {
  id: string;
  userId: string;
  type: PracticeType;
  subjectId?: string;
  topicId?: string;
  items: PracticeItem[];
  currentIndex: number;
  correctCount: number;
  totalTime: number;
  startedAt: Date;
  settings: PracticeSettings;
}

export interface PracticeSettings {
  itemCount: number;
  timeLimit?: number;  // seconds per item
  showExplanations: boolean;
  adaptiveDifficulty: boolean;
  shuffleItems: boolean;
  allowSkip: boolean;
  targetAccuracy: number;
}

export interface SpacedRepetitionCard {
  id: string;
  userId: string;
  itemId: string;
  easeFactor: number;      // SM-2 ease factor (default 2.5)
  interval: number;        // Days until next review
  repetitions: number;     // Number of successful reviews
  nextReviewDate: Date;
  lastReviewDate?: Date;
}

export interface PracticeResult {
  sessionId: string;
  totalItems: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  accuracy: number;
  totalTimeSeconds: number;
  averageTimePerItem: number;
  pointsEarned: number;
  skillsImproved: string[];
  streakMaintained: boolean;
  nextRecommendations: string[];
}

// ============================================
// DEFAULT SETTINGS
// ============================================

export const DEFAULT_PRACTICE_SETTINGS: PracticeSettings = {
  itemCount: 10,
  timeLimit: undefined,
  showExplanations: true,
  adaptiveDifficulty: true,
  shuffleItems: true,
  allowSkip: true,
  targetAccuracy: 0.8
};

// ============================================
// SM-2 SPACED REPETITION ALGORITHM
// ============================================

/**
 * Calculate next review interval using SM-2 algorithm
 * Quality ratings:
 * 5 - perfect response
 * 4 - correct with hesitation
 * 3 - correct with difficulty
 * 2 - incorrect, but remembered after seeing answer
 * 1 - incorrect, remembered vaguely
 * 0 - complete blackout
 */
export function calculateSM2(
  quality: ResponseQuality,
  previousEaseFactor: number,
  previousInterval: number,
  repetitions: number
): { easeFactor: number; interval: number; repetitions: number } {
  // Calculate new ease factor
  let newEaseFactor = previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ensure ease factor doesn't go below 1.3
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  let newInterval: number;
  let newRepetitions: number;

  if (quality < 3) {
    // Failed - reset
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Passed
    newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(previousInterval * newEaseFactor);
    }
  }

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions
  };
}

/**
 * Convert response time and correctness to SM-2 quality rating
 */
export function calculateQuality(
  isCorrect: boolean,
  responseTimeMs: number,
  expectedTimeMs: number = 30000
): ResponseQuality {
  if (!isCorrect) {
    return responseTimeMs < expectedTimeMs ? 1 : 0;
  }

  // Correct answer - rate based on response time
  const timeRatio = responseTimeMs / expectedTimeMs;

  if (timeRatio < 0.3) return 5;  // Very fast
  if (timeRatio < 0.6) return 4;  // Fast
  if (timeRatio < 1.0) return 3;  // Normal
  return 3; // Slow but correct
}

// ============================================
// PRACTICE SESSION MANAGEMENT
// ============================================

const activePracticeSessions = new Map<string, PracticeSession>();

export async function startPracticeSession(
  userId: string,
  options: {
    type: PracticeType;
    subjectId?: string;
    topicId?: string;
    skillCodes?: string[];
    settings?: Partial<PracticeSettings>;
  }
): Promise<PracticeSession> {
  const settings = { ...DEFAULT_PRACTICE_SETTINGS, ...options.settings };

  // Get practice items based on options
  const items = await getPracticeItems(userId, {
    subjectId: options.subjectId,
    topicId: options.topicId,
    skillCodes: options.skillCodes,
    count: settings.itemCount,
    adaptive: settings.adaptiveDifficulty,
    type: options.type
  });

  // Shuffle if enabled
  const finalItems = settings.shuffleItems ? shuffleArray(items) : items;

  const session: PracticeSession = {
    id: generateId(),
    userId,
    type: options.type,
    subjectId: options.subjectId,
    topicId: options.topicId,
    items: finalItems,
    currentIndex: 0,
    correctCount: 0,
    totalTime: 0,
    startedAt: new Date(),
    settings
  };

  activePracticeSessions.set(session.id, session);

  logger.info(`Started practice session ${session.id} for user ${userId}`);

  return session;
}

export function getPracticeSession(sessionId: string): PracticeSession | undefined {
  return activePracticeSessions.get(sessionId);
}

export function getCurrentItem(session: PracticeSession): PracticeItem | null {
  if (session.currentIndex >= session.items.length) {
    return null;
  }
  return session.items[session.currentIndex];
}

export async function submitPracticeAnswer(
  sessionId: string,
  answer: string,
  timeSpentMs: number
): Promise<{
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
  hasMore: boolean;
  quality: ResponseQuality;
}> {
  const session = activePracticeSessions.get(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  const item = getCurrentItem(session);
  if (!item) {
    throw new Error('No current item');
  }

  // Check answer
  const isCorrect = checkAnswer(answer, item.correctAnswer, item.questionType);

  if (isCorrect) {
    session.correctCount++;
  }

  session.totalTime += timeSpentMs / 1000;

  // Calculate quality for spaced repetition
  const quality = calculateQuality(isCorrect, timeSpentMs);

  // Update spaced repetition card if applicable
  await updateSpacedRepetitionCard(session.userId, item.id, quality);

  // Move to next item
  session.currentIndex++;

  const hasMore = session.currentIndex < session.items.length;

  return {
    isCorrect,
    correctAnswer: item.correctAnswer,
    explanation: session.settings.showExplanations ? item.explanation : undefined,
    hasMore,
    quality
  };
}

export async function skipPracticeItem(sessionId: string): Promise<{
  hasMore: boolean;
  skippedItem: PracticeItem;
}> {
  const session = activePracticeSessions.get(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  if (!session.settings.allowSkip) {
    throw new Error('Skipping not allowed');
  }

  const skippedItem = getCurrentItem(session);
  if (!skippedItem) {
    throw new Error('No current item');
  }

  session.currentIndex++;
  const hasMore = session.currentIndex < session.items.length;

  return { hasMore, skippedItem };
}

export async function completePracticeSession(sessionId: string): Promise<PracticeResult> {
  const session = activePracticeSessions.get(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  const totalItems = session.items.length;
  const answeredCount = session.currentIndex;
  const skippedCount = totalItems - answeredCount;
  const incorrectCount = answeredCount - session.correctCount;
  const accuracy = answeredCount > 0 ? session.correctCount / answeredCount : 0;

  // Calculate points
  const pointsEarned = calculatePoints(session);

  // Identify improved skills
  const skillsImproved = identifyImprovedSkills(session);

  // Check streak
  const streakMaintained = await updatePracticeStreak(session.userId, accuracy);

  // Generate recommendations
  const nextRecommendations = generateRecommendations(session);

  // Save session to database
  await savePracticeSession(session, {
    accuracy,
    pointsEarned,
    skillsImproved,
    streakMaintained
  });

  // Clean up
  activePracticeSessions.delete(sessionId);

  return {
    sessionId,
    totalItems,
    correctCount: session.correctCount,
    incorrectCount,
    skippedCount,
    accuracy,
    totalTimeSeconds: session.totalTime,
    averageTimePerItem: session.totalTime / Math.max(answeredCount, 1),
    pointsEarned,
    skillsImproved,
    streakMaintained,
    nextRecommendations
  };
}

// ============================================
// PRACTICE ITEM RETRIEVAL
// ============================================

async function getPracticeItems(
  userId: string,
  options: {
    subjectId?: string;
    topicId?: string;
    skillCodes?: string[];
    count: number;
    adaptive: boolean;
    type: PracticeType;
  }
): Promise<PracticeItem[]> {
  const items: PracticeItem[] = [];

  // For spaced repetition, prioritize due cards
  if (options.type === 'flashcard') {
    const dueCards = await getDueSpacedRepetitionCards(userId, options.count);
    items.push(...dueCards);
  }

  // If we need more items, get from skill gaps
  if (items.length < options.count && options.adaptive) {
    const gapItems = await getSkillGapItems(userId, {
      subjectId: options.subjectId,
      topicId: options.topicId,
      count: options.count - items.length
    });
    items.push(...gapItems);
  }

  // Fill remaining with general practice items
  if (items.length < options.count) {
    const generalItems = await getGeneralPracticeItems({
      subjectId: options.subjectId,
      topicId: options.topicId,
      skillCodes: options.skillCodes,
      count: options.count - items.length,
      excludeIds: items.map(i => i.id)
    });
    items.push(...generalItems);
  }

  return items;
}

async function getDueSpacedRepetitionCards(
  userId: string,
  count: number
): Promise<PracticeItem[]> {
  // This would fetch from a SpacedRepetitionCard table
  // For now, return empty - will be populated when cards are created
  return [];
}

async function getSkillGapItems(
  userId: string,
  options: {
    subjectId?: string;
    topicId?: string;
    count: number;
  }
): Promise<PracticeItem[]> {
  // Get user's skill gaps and create practice items
  const gaps = await prisma.skillGap.findMany({
    where: {
      studentId: userId,
      isResolved: false,
      ...(options.subjectId && { subjectId: options.subjectId }),
      ...(options.topicId && { topicId: options.topicId })
    },
    orderBy: { priority: 'desc' },
    take: options.count
  });

  // Convert gaps to practice items
  return gaps.map(gap => ({
    id: `gap-${gap.id}`,
    question: `Practice problem for ${gap.skillName}`,
    questionType: 'short_answer' as const,
    correctAnswer: '',
    difficulty: Math.ceil((100 - gap.currentScore) / 20),
    skillCode: gap.skillCode,
    topicId: gap.topicId || undefined,
    points: 10
  }));
}

async function getGeneralPracticeItems(
  options: {
    subjectId?: string;
    topicId?: string;
    skillCodes?: string[];
    count: number;
    excludeIds: string[];
  }
): Promise<PracticeItem[]> {
  // Get questions from DiagnosticQuestion or Quiz questions
  const questions = await prisma.diagnosticQuestion.findMany({
    where: {
      isActive: true,
      ...(options.skillCodes && options.skillCodes.length > 0 && {
        skillCode: { in: options.skillCodes }
      }),
      id: { notIn: options.excludeIds }
    },
    take: options.count,
    orderBy: { difficulty: 'asc' }
  });

  return questions.map(q => ({
    id: q.id,
    question: q.questionText,
    questionType: q.questionType as PracticeItem['questionType'],
    options: q.options ? JSON.parse(q.options) : undefined,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || undefined,
    difficulty: q.difficulty,
    skillCode: q.skillCode || undefined,
    points: q.points
  }));
}

// ============================================
// ANSWER CHECKING
// ============================================

export function checkAnswer(
  userAnswer: string,
  correctAnswer: string,
  questionType: string
): boolean {
  const normalizedUser = userAnswer.trim().toLowerCase();
  const normalizedCorrect = correctAnswer.trim().toLowerCase();

  switch (questionType) {
    case 'multiple_choice':
    case 'true_false':
      return normalizedUser === normalizedCorrect;

    case 'short_answer':
    case 'fill_blank':
      // Allow for minor variations
      return fuzzyMatch(normalizedUser, normalizedCorrect);

    default:
      return normalizedUser === normalizedCorrect;
  }
}

function fuzzyMatch(input: string, target: string): boolean {
  // Exact match
  if (input === target) return true;

  // Remove common variations
  const cleanInput = input.replace(/[.,!?;:'"]/g, '').trim();
  const cleanTarget = target.replace(/[.,!?;:'"]/g, '').trim();

  if (cleanInput === cleanTarget) return true;

  // Check if input contains the key answer
  if (cleanTarget.split(/\s+/).every(word => cleanInput.includes(word))) {
    return true;
  }

  // Levenshtein distance for typo tolerance (if short answers)
  if (target.length < 20) {
    const distance = levenshteinDistance(cleanInput, cleanTarget);
    const maxDistance = Math.floor(target.length * 0.2); // 20% tolerance
    return distance <= maxDistance;
  }

  return false;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// ============================================
// SPACED REPETITION CARD MANAGEMENT
// ============================================

async function updateSpacedRepetitionCard(
  userId: string,
  itemId: string,
  quality: ResponseQuality
): Promise<void> {
  // This would update or create a spaced repetition card
  // Implementation depends on having a SpacedRepetitionCard model
  logger.debug(`Updated SR card for user ${userId}, item ${itemId}, quality ${quality}`);
}

// ============================================
// POINTS & STREAK CALCULATION
// ============================================

function calculatePoints(session: PracticeSession): number {
  let points = 0;

  // Base points for correct answers
  points += session.correctCount * 10;

  // Bonus for accuracy
  const accuracy = session.correctCount / Math.max(session.currentIndex, 1);
  if (accuracy >= 0.9) points += 50;
  else if (accuracy >= 0.8) points += 30;
  else if (accuracy >= 0.7) points += 15;

  // Bonus for completing all items
  if (session.currentIndex >= session.items.length) {
    points += 25;
  }

  // Bonus for speed (if under average time)
  const avgTimePerItem = session.totalTime / Math.max(session.currentIndex, 1);
  if (avgTimePerItem < 15 && accuracy >= 0.7) {
    points += 20; // Speed bonus
  }

  return points;
}

async function updatePracticeStreak(userId: string, accuracy: number): Promise<boolean> {
  // A practice session counts towards streak if accuracy >= 70%
  if (accuracy < 0.7) {
    return false;
  }

  // This would update the user's streak in the database
  // For now, return true if accuracy met threshold
  return true;
}

function identifyImprovedSkills(session: PracticeSession): string[] {
  const improved: string[] = [];
  const skillCorrect: Record<string, number> = {};
  const skillTotal: Record<string, number> = {};

  for (let i = 0; i < session.currentIndex; i++) {
    const item = session.items[i];
    if (item.skillCode) {
      skillTotal[item.skillCode] = (skillTotal[item.skillCode] || 0) + 1;
      // Note: This is simplified - would need actual response tracking
    }
  }

  // Skills with 80%+ accuracy are "improved"
  for (const [skill, total] of Object.entries(skillTotal)) {
    const correct = skillCorrect[skill] || 0;
    if (correct / total >= 0.8) {
      improved.push(skill);
    }
  }

  return improved;
}

function generateRecommendations(session: PracticeSession): string[] {
  const recommendations: string[] = [];
  const accuracy = session.correctCount / Math.max(session.currentIndex, 1);

  if (accuracy < 0.5) {
    recommendations.push('Review the fundamentals for this topic');
    recommendations.push('Try easier practice problems first');
  } else if (accuracy < 0.7) {
    recommendations.push('Practice more problems at this level');
    recommendations.push('Focus on the concepts you missed');
  } else if (accuracy < 0.9) {
    recommendations.push('Great progress! Try some harder problems');
    recommendations.push('Consider moving to the next topic');
  } else {
    recommendations.push('Excellent! You\'ve mastered this level');
    recommendations.push('Challenge yourself with advanced problems');
  }

  return recommendations;
}

// ============================================
// DATABASE PERSISTENCE
// ============================================

async function savePracticeSession(
  session: PracticeSession,
  results: {
    accuracy: number;
    pointsEarned: number;
    skillsImproved: string[];
    streakMaintained: boolean;
  }
): Promise<void> {
  // This would save to a PracticeSession table
  logger.info(`Saved practice session ${session.id}: accuracy=${results.accuracy}, points=${results.pointsEarned}`);
}

// ============================================
// DRILL GENERATION
// ============================================

export interface DrillConfig {
  topic: string;
  difficulty: DifficultyLevel;
  count: number;
  types: string[];
}

export function generateDrillProblems(config: DrillConfig): PracticeItem[] {
  // This would generate practice problems based on config
  // For now, return template items
  const problems: PracticeItem[] = [];

  for (let i = 0; i < config.count; i++) {
    problems.push({
      id: `drill-${config.topic}-${i}`,
      question: `Practice problem ${i + 1} for ${config.topic}`,
      questionType: 'short_answer',
      correctAnswer: '',
      difficulty: difficultyToNumber(config.difficulty),
      skillCode: config.topic,
      points: 10
    });
  }

  return problems;
}

export function difficultyToNumber(difficulty: DifficultyLevel): number {
  switch (difficulty) {
    case 'easy': return 2;
    case 'medium': return 5;
    case 'hard': return 7;
    case 'expert': return 9;
    default: return 5;
  }
}

export function numberToDifficulty(n: number): DifficultyLevel {
  if (n <= 2) return 'easy';
  if (n <= 5) return 'medium';
  if (n <= 7) return 'hard';
  return 'expert';
}

// ============================================
// TIMED PRACTICE
// ============================================

export interface TimedPracticeConfig {
  totalTimeSeconds: number;
  itemTimeSeconds?: number;
  subjectId?: string;
  topicId?: string;
}

export async function startTimedPractice(
  userId: string,
  config: TimedPracticeConfig
): Promise<PracticeSession> {
  const itemCount = config.itemTimeSeconds
    ? Math.floor(config.totalTimeSeconds / config.itemTimeSeconds)
    : 20;

  return startPracticeSession(userId, {
    type: 'timed',
    subjectId: config.subjectId,
    topicId: config.topicId,
    settings: {
      itemCount,
      timeLimit: config.itemTimeSeconds,
      showExplanations: false,
      adaptiveDifficulty: true,
      shuffleItems: true,
      allowSkip: true,
      targetAccuracy: 0.7
    }
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId(): string {
  return `prac_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================
// PRACTICE STATISTICS
// ============================================

export async function getPracticeStats(userId: string): Promise<{
  totalSessions: number;
  totalItems: number;
  overallAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  pointsEarned: number;
  skillMastery: Record<string, number>;
  recentSessions: Array<{
    date: Date;
    accuracy: number;
    itemCount: number;
  }>;
}> {
  // This would fetch from database
  // For now, return mock data
  return {
    totalSessions: 0,
    totalItems: 0,
    overallAccuracy: 0,
    currentStreak: 0,
    longestStreak: 0,
    pointsEarned: 0,
    skillMastery: {},
    recentSessions: []
  };
}

export async function getRecommendedPractice(userId: string): Promise<Array<{
  type: PracticeType;
  topicId?: string;
  topicName: string;
  reason: string;
  priority: number;
}>> {
  // Get skill gaps and recommend practice
  const gaps = await prisma.skillGap.findMany({
    where: { studentId: userId, isResolved: false },
    orderBy: { priority: 'desc' },
    take: 5
  });

  return gaps.map((gap, index) => ({
    type: 'adaptive' as PracticeType,
    topicId: gap.topicId || undefined,
    topicName: gap.skillName,
    reason: `Score: ${gap.currentScore.toFixed(0)}% - needs practice`,
    priority: 5 - index
  }));
}
