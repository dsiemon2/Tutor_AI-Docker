// TutorAI Gamification Service
// Handles badges, streaks, points, leaderboards, and activity feed

import { prisma } from '../config/database';
import { logger } from '../utils/logger';

// ============================================
// BADGE MANAGEMENT
// ============================================

export interface BadgeRequirement {
  type: 'sessions' | 'quizzes' | 'assignments' | 'mastery' | 'streak' | 'points' | 'time' | 'custom';
  count?: number;
  subject?: string;
  topic?: string;
  minScore?: number;
  minMastery?: number;
  streakDays?: number;
}

/**
 * Get all available badges
 */
export async function getAllBadges(options: {
  category?: string;
  tier?: string;
  includeHidden?: boolean;
} = {}): Promise<any[]> {
  const where: any = { isActive: true };

  if (options.category) where.category = options.category;
  if (options.tier) where.tier = options.tier;
  if (!options.includeHidden) where.isHidden = false;

  return prisma.badge.findMany({
    where,
    orderBy: [
      { category: 'asc' },
      { tier: 'asc' },
      { name: 'asc' }
    ]
  });
}

/**
 * Get a user's badges (earned and in progress)
 */
export async function getUserBadges(userId: string): Promise<any[]> {
  return prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true
    },
    orderBy: { earnedAt: 'desc' }
  });
}

/**
 * Get user's earned badges only
 */
export async function getEarnedBadges(userId: string): Promise<any[]> {
  return prisma.userBadge.findMany({
    where: {
      userId,
      earnedAt: { not: null }
    },
    include: {
      badge: true
    },
    orderBy: { earnedAt: 'desc' }
  });
}

/**
 * Award a badge to a user
 */
export async function awardBadge(userId: string, badgeCode: string): Promise<any | null> {
  const badge = await prisma.badge.findUnique({
    where: { code: badgeCode }
  });

  if (!badge) {
    logger.warn(`Badge not found: ${badgeCode}`);
    return null;
  }

  // Check if already earned
  const existing = await prisma.userBadge.findUnique({
    where: {
      userId_badgeId: { userId, badgeId: badge.id }
    }
  });

  if (existing?.earnedAt) {
    return existing; // Already earned
  }

  // Award or update badge
  const userBadge = await prisma.userBadge.upsert({
    where: {
      userId_badgeId: { userId, badgeId: badge.id }
    },
    create: {
      userId,
      badgeId: badge.id,
      progress: 1,
      targetProgress: 1,
      earnedAt: new Date()
    },
    update: {
      earnedAt: new Date()
    },
    include: { badge: true }
  });

  // Award points for badge
  if (badge.points > 0) {
    await addPoints(userId, badge.points, 'earned', 'Badge earned', 'badge', 'Badge', badge.id);
  }

  // Create activity feed entry
  await createActivity(userId, 'badge_earned', `Earned the "${badge.name}" badge!`, {
    badgeId: badge.id,
    badgeCode: badge.code,
    badgeTier: badge.tier,
    points: badge.points
  });

  logger.info(`Badge awarded: ${badgeCode} to user ${userId}`);
  return userBadge;
}

/**
 * Update badge progress
 */
export async function updateBadgeProgress(
  userId: string,
  badgeCode: string,
  progress: number,
  targetProgress?: number
): Promise<any | null> {
  const badge = await prisma.badge.findUnique({
    where: { code: badgeCode }
  });

  if (!badge) return null;

  const userBadge = await prisma.userBadge.upsert({
    where: {
      userId_badgeId: { userId, badgeId: badge.id }
    },
    create: {
      userId,
      badgeId: badge.id,
      progress,
      targetProgress: targetProgress || progress
    },
    update: {
      progress
    }
  });

  // Check if badge is now earned
  if (userBadge.progress >= userBadge.targetProgress && !userBadge.earnedAt) {
    return awardBadge(userId, badgeCode);
  }

  return userBadge;
}

/**
 * Check and award badges based on user activity
 */
export async function checkAndAwardBadges(
  userId: string,
  activityType: 'session' | 'quiz' | 'assignment' | 'mastery' | 'streak' | 'login'
): Promise<any[]> {
  const awarded: any[] = [];

  // Get user stats
  const [sessionCount, quizCount, assignmentCount, masteryStats, streak] = await Promise.all([
    prisma.tutoringSession.count({ where: { studentId: userId } }),
    prisma.quizAttempt.count({ where: { studentId: userId, status: 'graded' } }),
    prisma.submission.count({ where: { studentId: userId, status: 'graded' } }),
    prisma.studentProgress.aggregate({
      where: { studentId: userId, masteryLevel: { gte: 4 } },
      _count: true
    }),
    getStreak(userId)
  ]);

  // Session badges
  if (activityType === 'session') {
    if (sessionCount === 1) {
      const badge = await awardBadge(userId, 'first_session');
      if (badge) awarded.push(badge);
    }
    if (sessionCount === 10) {
      const badge = await awardBadge(userId, 'session_10');
      if (badge) awarded.push(badge);
    }
    if (sessionCount === 50) {
      const badge = await awardBadge(userId, 'session_50');
      if (badge) awarded.push(badge);
    }
    if (sessionCount === 100) {
      const badge = await awardBadge(userId, 'session_100');
      if (badge) awarded.push(badge);
    }
  }

  // Quiz badges
  if (activityType === 'quiz') {
    if (quizCount === 1) {
      const badge = await awardBadge(userId, 'first_quiz');
      if (badge) awarded.push(badge);
    }
    if (quizCount === 25) {
      const badge = await awardBadge(userId, 'quiz_master');
      if (badge) awarded.push(badge);
    }
  }

  // Streak badges
  if (activityType === 'streak' && streak) {
    if (streak.currentStreak >= 7) {
      const badge = await awardBadge(userId, 'streak_7');
      if (badge) awarded.push(badge);
    }
    if (streak.currentStreak >= 30) {
      const badge = await awardBadge(userId, 'streak_30');
      if (badge) awarded.push(badge);
    }
    if (streak.currentStreak >= 100) {
      const badge = await awardBadge(userId, 'streak_100');
      if (badge) awarded.push(badge);
    }
  }

  // Mastery badges
  if (activityType === 'mastery') {
    const masteredTopics = masteryStats._count;
    if (masteredTopics >= 1) {
      const badge = await awardBadge(userId, 'first_mastery');
      if (badge) awarded.push(badge);
    }
    if (masteredTopics >= 10) {
      const badge = await awardBadge(userId, 'mastery_10');
      if (badge) awarded.push(badge);
    }
  }

  return awarded;
}

// ============================================
// STREAK MANAGEMENT
// ============================================

/**
 * Get user's streak data
 */
export async function getStreak(userId: string): Promise<any> {
  let streak = await prisma.streak.findUnique({
    where: { userId }
  });

  if (!streak) {
    streak = await prisma.streak.create({
      data: { userId }
    });
  }

  return streak;
}

/**
 * Update streak for user activity
 */
export async function updateStreak(userId: string): Promise<any> {
  const streak = await getStreak(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = streak.lastActivityDate
    ? new Date(streak.lastActivityDate)
    : null;

  if (lastActivity) {
    lastActivity.setHours(0, 0, 0, 0);
  }

  // Same day - no change
  if (lastActivity && lastActivity.getTime() === today.getTime()) {
    return streak;
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let newStreak = streak.currentStreak;
  let streakStart = streak.streakStartDate;

  if (!lastActivity) {
    // First activity ever
    newStreak = 1;
    streakStart = today;
  } else if (lastActivity.getTime() === yesterday.getTime()) {
    // Consecutive day - extend streak
    newStreak = streak.currentStreak + 1;
  } else if (streak.freezesRemaining > 0 && lastActivity.getTime() >= yesterday.getTime() - 86400000) {
    // Missed one day but have freeze
    const updated = await prisma.streak.update({
      where: { userId },
      data: {
        freezesRemaining: streak.freezesRemaining - 1,
        freezesUsed: streak.freezesUsed + 1,
        lastActivityDate: today
      }
    });
    return updated;
  } else {
    // Streak broken - restart
    newStreak = 1;
    streakStart = today;
  }

  const longestStreak = Math.max(streak.longestStreak, newStreak);

  const updated = await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak,
      lastActivityDate: today,
      streakStartDate: streakStart
    }
  });

  // Award streak bonuses
  const pointConfig = await getPointConfig();
  await addPoints(userId, pointConfig.streakDaily, 'bonus', 'Daily streak bonus', 'streak');

  if (newStreak === 7) {
    await addPoints(userId, pointConfig.streakWeekly, 'bonus', '7-day streak bonus', 'streak');
    await createActivity(userId, 'streak_milestone', '7-day learning streak!', { streak: 7 });
  } else if (newStreak === 30) {
    await addPoints(userId, pointConfig.streakMonthly, 'bonus', '30-day streak bonus', 'streak');
    await createActivity(userId, 'streak_milestone', '30-day learning streak!', { streak: 30 });
  }

  // Check for streak badges
  await checkAndAwardBadges(userId, 'streak');

  return updated;
}

/**
 * Add streak freeze to user
 */
export async function addStreakFreeze(userId: string, count: number = 1): Promise<any> {
  return prisma.streak.upsert({
    where: { userId },
    create: {
      userId,
      freezesRemaining: count
    },
    update: {
      freezesRemaining: { increment: count }
    }
  });
}

// ============================================
// POINTS MANAGEMENT
// ============================================

/**
 * Get point configuration
 */
export async function getPointConfig(): Promise<any> {
  let config = await prisma.pointConfig.findUnique({
    where: { id: 'default' }
  });

  if (!config) {
    config = await prisma.pointConfig.create({
      data: { id: 'default' }
    });
  }

  return config;
}

/**
 * Get user's point balance
 */
export async function getPointBalance(userId: string): Promise<any> {
  let balance = await prisma.pointBalance.findUnique({
    where: { userId }
  });

  if (!balance) {
    balance = await prisma.pointBalance.create({
      data: { userId }
    });
  }

  return balance;
}

/**
 * Add points to user
 */
export async function addPoints(
  userId: string,
  amount: number,
  type: 'earned' | 'bonus' | 'transfer',
  reason: string,
  category: string,
  referenceType?: string,
  referenceId?: string
): Promise<any> {
  const balance = await getPointBalance(userId);

  const transaction = await prisma.pointTransaction.create({
    data: {
      userId,
      amount,
      type,
      reason,
      category,
      referenceType,
      referenceId,
      balanceBefore: balance.currentBalance,
      balanceAfter: balance.currentBalance + amount
    }
  });

  const updatedBalance = await prisma.pointBalance.update({
    where: { userId },
    data: {
      totalEarned: { increment: amount },
      currentBalance: { increment: amount },
      lifetimePoints: { increment: amount }
    }
  });

  // Check for level up
  await checkLevelUp(userId);

  return { transaction, balance: updatedBalance };
}

/**
 * Spend points
 */
export async function spendPoints(
  userId: string,
  amount: number,
  reason: string,
  category: string = 'purchase'
): Promise<{ success: boolean; transaction?: any; error?: string }> {
  const balance = await getPointBalance(userId);

  if (balance.currentBalance < amount) {
    return { success: false, error: 'Insufficient points' };
  }

  const transaction = await prisma.pointTransaction.create({
    data: {
      userId,
      amount: -amount,
      type: 'spent',
      reason,
      category,
      balanceBefore: balance.currentBalance,
      balanceAfter: balance.currentBalance - amount
    }
  });

  await prisma.pointBalance.update({
    where: { userId },
    data: {
      totalSpent: { increment: amount },
      currentBalance: { decrement: amount }
    }
  });

  return { success: true, transaction };
}

/**
 * Get point transaction history
 */
export async function getPointHistory(
  userId: string,
  options: { limit?: number; offset?: number; category?: string } = {}
): Promise<any[]> {
  return prisma.pointTransaction.findMany({
    where: {
      userId,
      ...(options.category && { category: options.category })
    },
    take: options.limit || 50,
    skip: options.offset || 0,
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Check and apply level up
 */
async function checkLevelUp(userId: string): Promise<void> {
  const balance = await getPointBalance(userId);

  // Level calculation: 100 points for level 1, increasing by 50% each level
  let level = 1;
  let totalRequired = 100;
  let lifetimePoints = balance.lifetimePoints;

  while (lifetimePoints >= totalRequired) {
    lifetimePoints -= totalRequired;
    level++;
    totalRequired = Math.floor(totalRequired * 1.5);
  }

  if (level > balance.level) {
    await prisma.pointBalance.update({
      where: { userId },
      data: {
        level,
        levelProgress: lifetimePoints,
        levelRequired: totalRequired
      }
    });

    await createActivity(userId, 'level_up', `Reached Level ${level}!`, {
      level,
      previousLevel: balance.level
    });

    logger.info(`User ${userId} leveled up to ${level}`);
  } else {
    await prisma.pointBalance.update({
      where: { userId },
      data: {
        levelProgress: lifetimePoints,
        levelRequired: totalRequired
      }
    });
  }
}

/**
 * Award points for completing a session
 */
export async function awardSessionPoints(userId: string, durationMinutes: number): Promise<void> {
  const config = await getPointConfig();

  const points = config.sessionComplete + (durationMinutes * config.sessionMinutes);
  await addPoints(userId, points, 'earned', `Tutoring session (${durationMinutes} min)`, 'session');

  await checkAndAwardBadges(userId, 'session');
}

/**
 * Award points for completing a quiz
 */
export async function awardQuizPoints(
  userId: string,
  score: number,
  passed: boolean,
  perfect: boolean
): Promise<void> {
  const config = await getPointConfig();

  let points = config.quizComplete;
  if (passed) points += config.quizPassBonus;
  if (perfect) points += config.quizPerfectScore;

  await addPoints(userId, points, 'earned', `Quiz completed (${score}%)`, 'quiz');

  await checkAndAwardBadges(userId, 'quiz');
}

/**
 * Award points for submitting assignment
 */
export async function awardAssignmentPoints(
  userId: string,
  onTime: boolean,
  grade?: number
): Promise<void> {
  const config = await getPointConfig();

  let points = config.assignmentSubmit;
  if (onTime) points += config.assignmentOnTime;
  if (grade && grade >= 95) points += config.assignmentPerfect;

  await addPoints(userId, points, 'earned', 'Assignment submitted', 'assignment');

  await checkAndAwardBadges(userId, 'assignment');
}

// ============================================
// LEADERBOARD
// ============================================

export interface LeaderboardOptions {
  scope: 'global' | 'school' | 'class';
  scopeId?: string;
  period: 'all_time' | 'monthly' | 'weekly' | 'daily';
  limit?: number;
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(options: LeaderboardOptions): Promise<any[]> {
  const { scope, scopeId, period, limit = 10 } = options;

  // Calculate period start date
  const periodStart = getPeriodStart(period);

  // Build query based on scope
  let userFilter: any = {};

  if (scope === 'school' && scopeId) {
    userFilter.schoolId = scopeId;
  } else if (scope === 'class' && scopeId) {
    userFilter.classesAsStudent = {
      some: { classId: scopeId }
    };
  }

  // Get users with their point totals for the period
  if (period === 'all_time') {
    // Use PointBalance for all-time
    const balances = await prisma.pointBalance.findMany({
      take: limit,
      orderBy: { lifetimePoints: 'desc' }
    });

    // Fetch user details separately
    const userIds = balances.map((b: any) => b.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        school: { select: { name: true } }
      }
    });
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    return balances.map((b: any, index: number) => ({
      rank: index + 1,
      userId: b.userId,
      user: userMap.get(b.userId),
      points: b.lifetimePoints,
      level: b.level
    }));
  } else {
    // Calculate from transactions for time-based periods
    const transactions = await prisma.pointTransaction.groupBy({
      by: ['userId'],
      where: {
        createdAt: { gte: periodStart },
        amount: { gt: 0 }
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: limit
    });

    const userIds = transactions.map((t: any) => t.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        school: { select: { name: true } }
      }
    });

    const userMap = new Map(users.map((u: any) => [u.id, u]));

    return transactions.map((t: any, index: number) => ({
      rank: index + 1,
      userId: t.userId,
      user: userMap.get(t.userId),
      points: t._sum.amount || 0
    }));
  }
}

/**
 * Get user's rank on leaderboard
 */
export async function getUserRank(
  userId: string,
  options: Omit<LeaderboardOptions, 'limit'>
): Promise<{ rank: number; points: number; total: number }> {
  const { scope, scopeId, period } = options;
  const periodStart = getPeriodStart(period);

  if (period === 'all_time') {
    const balance = await getPointBalance(userId);

    const higherRanked = await prisma.pointBalance.count({
      where: {
        lifetimePoints: { gt: balance.lifetimePoints }
      }
    });

    const total = await prisma.pointBalance.count();

    return {
      rank: higherRanked + 1,
      points: balance.lifetimePoints,
      total
    };
  } else {
    const userTotal = await prisma.pointTransaction.aggregate({
      where: {
        userId,
        createdAt: { gte: periodStart },
        amount: { gt: 0 }
      },
      _sum: { amount: true }
    });

    const points = userTotal._sum.amount || 0;

    const higherRanked = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT "userId") as count
      FROM "PointTransaction"
      WHERE "createdAt" >= ${periodStart}
        AND amount > 0
      GROUP BY "userId"
      HAVING SUM(amount) > ${points}
    `;

    const totalUsers = await prisma.pointTransaction.groupBy({
      by: ['userId'],
      where: {
        createdAt: { gte: periodStart },
        amount: { gt: 0 }
      }
    });

    return {
      rank: Number(higherRanked[0]?.count || 0) + 1,
      points,
      total: totalUsers.length
    };
  }
}

function getPeriodStart(period: string): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  switch (period) {
    case 'daily':
      return now;
    case 'weekly':
      now.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      return now;
    case 'monthly':
      now.setDate(1); // First of month
      return now;
    default:
      return new Date(0); // Beginning of time
  }
}

// ============================================
// ACTIVITY FEED
// ============================================

/**
 * Create activity feed entry
 */
export async function createActivity(
  userId: string,
  type: string,
  title: string,
  metadata?: any,
  isPublic: boolean = true
): Promise<any> {
  return prisma.activityFeed.create({
    data: {
      userId,
      type,
      title,
      metadata: metadata ? JSON.stringify(metadata) : null,
      isPublic
    }
  });
}

/**
 * Get user's activity feed
 */
export async function getUserActivity(
  userId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<any[]> {
  return prisma.activityFeed.findMany({
    where: { userId },
    take: options.limit || 20,
    skip: options.offset || 0,
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Get public activity feed for class/school
 */
export async function getPublicActivity(
  scope: 'school' | 'class',
  scopeId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<any[]> {
  let userIds: string[];

  if (scope === 'school') {
    const users = await prisma.user.findMany({
      where: { schoolId: scopeId },
      select: { id: true }
    });
    userIds = users.map((u: any) => u.id);
  } else {
    const enrollments = await prisma.classStudent.findMany({
      where: { classId: scopeId },
      select: { studentId: true }
    });
    userIds = enrollments.map((e: any) => e.studentId);
  }

  const activities = await prisma.activityFeed.findMany({
    where: {
      userId: { in: userIds },
      isPublic: true
    },
    take: options.limit || 50,
    skip: options.offset || 0,
    orderBy: { createdAt: 'desc' }
  });

  // Fetch user details separately
  const activityUserIds = [...new Set(activities.map((a: any) => a.userId))];
  const users = await prisma.user.findMany({
    where: { id: { in: activityUserIds } },
    select: {
      id: true,
      firstName: true,
      lastName: true
    }
  });
  const userMap = new Map(users.map((u: any) => [u.id, u]));

  return activities.map((a: any) => ({
    ...a,
    user: userMap.get(a.userId)
  }));
}

// ============================================
// ANNOUNCEMENTS
// ============================================

/**
 * Create announcement
 */
export async function createAnnouncement(data: {
  title: string;
  content: string;
  type?: string;
  scope: string;
  scopeId?: string;
  targetRoles?: string[];
  authorId: string;
  publishAt?: Date;
  expiresAt?: Date;
  isPinned?: boolean;
}): Promise<any> {
  return prisma.announcement.create({
    data: {
      title: data.title,
      content: data.content,
      type: data.type || 'info',
      scope: data.scope,
      scopeId: data.scopeId,
      targetRoles: data.targetRoles ? JSON.stringify(data.targetRoles) : null,
      authorId: data.authorId,
      publishAt: data.publishAt || new Date(),
      expiresAt: data.expiresAt,
      isPinned: data.isPinned || false
    }
  });
}

/**
 * Get announcements for user
 */
export async function getAnnouncementsForUser(
  userId: string,
  schoolId?: string,
  classIds?: string[],
  role?: string
): Promise<any[]> {
  const now = new Date();

  const announcements = await prisma.announcement.findMany({
    where: {
      isActive: true,
      publishAt: { lte: now },
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } }
      ],
      AND: [
        {
          OR: [
            { scope: 'all' },
            { scope: 'school', scopeId: schoolId },
            { scope: 'class', scopeId: { in: classIds || [] } }
          ]
        }
      ]
    },
    include: {
      readBy: {
        where: { userId },
        select: { readAt: true }
      }
    },
    orderBy: [
      { isPinned: 'desc' },
      { publishAt: 'desc' }
    ]
  });

  // Fetch authors separately
  const authorIds = [...new Set(announcements.map((a: any) => a.authorId))];
  const authors = await prisma.user.findMany({
    where: { id: { in: authorIds } },
    select: {
      id: true,
      firstName: true,
      lastName: true
    }
  });
  const authorMap = new Map(authors.map((u: any) => [u.id, u]));

  // Filter by role if specified
  return announcements.filter((a: any) => {
    if (!a.targetRoles) return true;
    try {
      const roles = JSON.parse(a.targetRoles);
      return roles.includes(role);
    } catch {
      return true;
    }
  }).map((a: any) => ({
    ...a,
    author: authorMap.get(a.authorId),
    isRead: a.readBy.length > 0,
    readAt: a.readBy[0]?.readAt || null,
    readBy: undefined
  }));
}

/**
 * Mark announcement as read
 */
export async function markAnnouncementRead(userId: string, announcementId: string): Promise<void> {
  await prisma.announcementRead.upsert({
    where: {
      announcementId_userId: { announcementId, userId }
    },
    create: {
      announcementId,
      userId
    },
    update: {} // No update needed
  });
}

/**
 * Get unread announcement count
 */
export async function getUnreadAnnouncementCount(
  userId: string,
  schoolId?: string,
  classIds?: string[]
): Promise<number> {
  const announcements = await getAnnouncementsForUser(userId, schoolId, classIds);
  return announcements.filter((a: any) => !a.isRead).length;
}

// ============================================
// DEFAULT BADGES SETUP
// ============================================

export const DEFAULT_BADGES = [
  // Session badges
  { code: 'first_session', name: 'First Steps', description: 'Complete your first tutoring session', category: 'achievement', tier: 'bronze', icon: 'play-circle', points: 10 },
  { code: 'session_10', name: 'Getting Started', description: 'Complete 10 tutoring sessions', category: 'achievement', tier: 'bronze', icon: 'book', points: 25 },
  { code: 'session_50', name: 'Dedicated Learner', description: 'Complete 50 tutoring sessions', category: 'achievement', tier: 'silver', icon: 'award', points: 100 },
  { code: 'session_100', name: 'Century Scholar', description: 'Complete 100 tutoring sessions', category: 'achievement', tier: 'gold', icon: 'trophy', points: 250 },

  // Quiz badges
  { code: 'first_quiz', name: 'Quiz Taker', description: 'Complete your first quiz', category: 'achievement', tier: 'bronze', icon: 'check-square', points: 10 },
  { code: 'quiz_master', name: 'Quiz Master', description: 'Complete 25 quizzes', category: 'achievement', tier: 'silver', icon: 'clipboard-check', points: 75 },
  { code: 'perfect_score', name: 'Perfect Score', description: 'Get 100% on a quiz', category: 'achievement', tier: 'gold', icon: 'star', points: 50 },

  // Streak badges
  { code: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day learning streak', category: 'streak', tier: 'bronze', icon: 'fire', points: 25 },
  { code: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day learning streak', category: 'streak', tier: 'silver', icon: 'fire', points: 100 },
  { code: 'streak_100', name: 'Streak Legend', description: 'Maintain a 100-day learning streak', category: 'streak', tier: 'gold', icon: 'fire', points: 500 },

  // Mastery badges
  { code: 'first_mastery', name: 'Topic Expert', description: 'Master your first topic', category: 'mastery', tier: 'bronze', icon: 'mortarboard', points: 25 },
  { code: 'mastery_10', name: 'Knowledge Seeker', description: 'Master 10 topics', category: 'mastery', tier: 'silver', icon: 'lightbulb', points: 100 },
  { code: 'subject_complete', name: 'Subject Master', description: 'Complete all topics in a subject', category: 'mastery', tier: 'gold', icon: 'patch-check', points: 200 },

  // Special badges
  { code: 'early_bird', name: 'Early Bird', description: 'Start a session before 7 AM', category: 'special', tier: 'bronze', icon: 'sun', points: 15, isHidden: true },
  { code: 'night_owl', name: 'Night Owl', description: 'Complete a session after 10 PM', category: 'special', tier: 'bronze', icon: 'moon', points: 15, isHidden: true },
  { code: 'weekend_warrior', name: 'Weekend Warrior', description: 'Study on both Saturday and Sunday', category: 'special', tier: 'bronze', icon: 'calendar-week', points: 20, isHidden: true },
];

/**
 * Initialize default badges
 */
export async function initializeDefaultBadges(): Promise<void> {
  for (const badge of DEFAULT_BADGES) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      create: badge,
      update: badge
    });
  }
  logger.info('Default badges initialized');
}

export default {
  // Badges
  getAllBadges,
  getUserBadges,
  getEarnedBadges,
  awardBadge,
  updateBadgeProgress,
  checkAndAwardBadges,
  initializeDefaultBadges,

  // Streaks
  getStreak,
  updateStreak,
  addStreakFreeze,

  // Points
  getPointConfig,
  getPointBalance,
  addPoints,
  spendPoints,
  getPointHistory,
  awardSessionPoints,
  awardQuizPoints,
  awardAssignmentPoints,

  // Leaderboard
  getLeaderboard,
  getUserRank,

  // Activity Feed
  createActivity,
  getUserActivity,
  getPublicActivity,

  // Announcements
  createAnnouncement,
  getAnnouncementsForUser,
  markAnnouncementRead,
  getUnreadAnnouncementCount
};
