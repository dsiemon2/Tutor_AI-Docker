// TutorAI Search Service
// Global search across users, sessions, classes, and content

import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export interface SearchResult {
  type: 'user' | 'school' | 'class' | 'session' | 'subject' | 'topic';
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  url?: string;
  metadata?: Record<string, any>;
}

export interface SearchOptions {
  types?: ('user' | 'school' | 'class' | 'session' | 'subject' | 'topic')[];
  limit?: number;
  schoolId?: string;
  role?: string;
}

/**
 * Global search across all entities
 */
export async function globalSearch(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const {
    types = ['user', 'school', 'class', 'session', 'subject', 'topic'],
    limit = 20,
    schoolId,
    role
  } = options;

  const results: SearchResult[] = [];
  const searchTerm = `%${query.toLowerCase()}%`;
  const limitPerType = Math.ceil(limit / types.length);

  try {
    // Search users
    if (types.includes('user')) {
      const users = await prisma.user.findMany({
        where: {
          AND: [
            schoolId ? { schoolId } : {},
            role ? { role: role as any } : {},
            {
              OR: [
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } }
              ]
            }
          ]
        },
        include: { school: { select: { name: true } } },
        take: limitPerType
      });

      results.push(...users.map(user => ({
        type: 'user' as const,
        id: user.id,
        title: `${user.firstName} ${user.lastName}`,
        subtitle: user.email,
        description: `${user.role} at ${user.school?.name || 'Unknown School'}`,
        url: `/admin/users/${user.id}`,
        metadata: { role: user.role, schoolId: user.schoolId }
      })));
    }

    // Search schools
    if (types.includes('school')) {
      const schools = await prisma.school.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: limitPerType
      });

      results.push(...schools.map(school => ({
        type: 'school' as const,
        id: school.id,
        title: school.name,
        subtitle: school.address || undefined,
        description: `School - ${school.subscriptionStatus}`,
        url: `/admin/schools/${school.id}`,
        metadata: { subscriptionStatus: school.subscriptionStatus }
      })));
    }

    // Search classes
    if (types.includes('class')) {
      const classes = await prisma.class.findMany({
        where: {
          AND: [
            schoolId ? { schoolId } : {},
            {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } }
              ]
            }
          ]
        },
        include: {
          school: { select: { name: true } },
          subject: { select: { name: true } }
        },
        take: limitPerType
      });

      results.push(...classes.map(cls => ({
        type: 'class' as const,
        id: cls.id,
        title: cls.name,
        subtitle: cls.subject?.name || undefined,
        description: `Class at ${cls.school?.name}`,
        url: `/admin/classes/${cls.id}`,
        metadata: { schoolId: cls.schoolId, gradeLevel: cls.gradeLevel }
      })));
    }

    // Search sessions
    if (types.includes('session')) {
      const sessions = await prisma.tutoringSession.findMany({
        where: {
          OR: [
            { summary: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          student: { select: { firstName: true, lastName: true } },
          topic: { select: { name: true } },
          subject: { select: { name: true } }
        },
        take: limitPerType,
        orderBy: { startedAt: 'desc' }
      });

      results.push(...sessions.map(session => ({
        type: 'session' as const,
        id: session.id,
        title: `${session.student.firstName} ${session.student.lastName}'s Session`,
        subtitle: session.topic?.name || session.subject?.name || undefined,
        description: session.summary || 'No summary',
        url: `/admin/sessions/${session.id}`,
        metadata: { studentId: session.studentId, startedAt: session.startedAt }
      })));
    }

    // Search subjects
    if (types.includes('subject')) {
      const subjects = await prisma.subject.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: { category: { select: { name: true } } },
        take: limitPerType
      });

      results.push(...subjects.map(subject => ({
        type: 'subject' as const,
        id: subject.id,
        title: subject.name,
        subtitle: subject.category?.name || undefined,
        description: subject.description || undefined,
        url: `/admin/subjects/${subject.id}`,
        metadata: { categoryId: subject.categoryId, gradeRange: subject.gradeRange }
      })));
    }

    // Search topics
    if (types.includes('topic')) {
      const topics = await prisma.topic.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: { subject: { select: { name: true } } },
        take: limitPerType
      });

      results.push(...topics.map(topic => ({
        type: 'topic' as const,
        id: topic.id,
        title: topic.name,
        subtitle: topic.subject?.name || undefined,
        description: topic.description || undefined,
        url: `/admin/topics/${topic.id}`,
        metadata: { subjectId: topic.subjectId, gradeLevel: topic.gradeLevel }
      })));
    }

    // Sort by relevance (exact matches first)
    const queryLower = query.toLowerCase();
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase().includes(queryLower) ? 0 : 1;
      const bExact = b.title.toLowerCase().includes(queryLower) ? 0 : 1;
      return aExact - bExact;
    });

    return results.slice(0, limit);

  } catch (error) {
    logger.error('Global search error:', error);
    throw error;
  }
}

/**
 * Search users with advanced filters
 */
export async function searchUsers(
  query: string,
  options: {
    role?: string;
    schoolId?: string;
    isActive?: boolean;
    gradeLevel?: number;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ users: any[]; total: number }> {
  const { role, schoolId, isActive, gradeLevel, limit = 50, offset = 0 } = options;

  const where: any = {
    AND: [
      {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      }
    ]
  };

  if (role) where.AND.push({ role });
  if (schoolId) where.AND.push({ schoolId });
  if (typeof isActive === 'boolean') where.AND.push({ isActive });
  if (gradeLevel !== undefined) where.AND.push({ gradeLevel });

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        school: { select: { id: true, name: true } }
      },
      take: limit,
      skip: offset,
      orderBy: { lastName: 'asc' }
    }),
    prisma.user.count({ where })
  ]);

  return { users, total };
}

/**
 * Search sessions with filters
 */
export async function searchSessions(
  options: {
    studentId?: string;
    subjectId?: string;
    topicId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ sessions: any[]; total: number }> {
  const { studentId, subjectId, topicId, startDate, endDate, status, limit = 50, offset = 0 } = options;

  const where: any = {};

  if (studentId) where.studentId = studentId;
  if (subjectId) where.subjectId = subjectId;
  if (topicId) where.topicId = topicId;
  if (status) where.status = status;
  if (startDate || endDate) {
    where.startedAt = {};
    if (startDate) where.startedAt.gte = startDate;
    if (endDate) where.startedAt.lte = endDate;
  }

  const [sessions, total] = await Promise.all([
    prisma.tutoringSession.findMany({
      where,
      include: {
        student: { select: { id: true, firstName: true, lastName: true, email: true } },
        subject: { select: { id: true, name: true } },
        topic: { select: { id: true, name: true } }
      },
      take: limit,
      skip: offset,
      orderBy: { startedAt: 'desc' }
    }),
    prisma.tutoringSession.count({ where })
  ]);

  return { sessions, total };
}

export default {
  globalSearch,
  searchUsers,
  searchSessions
};
