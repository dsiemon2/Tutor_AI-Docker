/**
 * Audit Logging Service
 * Tracks admin actions and important events for compliance
 */

import { Request } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

// Audit action types
export enum AuditAction {
  // User actions
  LOGIN = 'LOGIN',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',

  // Admin actions
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_ACTIVATED = 'USER_ACTIVATED',
  USER_DEACTIVATED = 'USER_DEACTIVATED',
  USER_REACTIVATED = 'USER_REACTIVATED',
  ROLE_CHANGED = 'ROLE_CHANGED',

  // Enrollment actions
  STUDENT_ENROLLED = 'STUDENT_ENROLLED',
  STUDENT_UNENROLLED = 'STUDENT_UNENROLLED',
  TEACHER_ASSIGNED = 'TEACHER_ASSIGNED',
  TEACHER_UNASSIGNED = 'TEACHER_UNASSIGNED',

  // Content management
  SCHOOL_CREATED = 'SCHOOL_CREATED',
  SCHOOL_UPDATED = 'SCHOOL_UPDATED',
  SCHOOL_DELETED = 'SCHOOL_DELETED',

  CLASS_CREATED = 'CLASS_CREATED',
  CLASS_UPDATED = 'CLASS_UPDATED',
  CLASS_DELETED = 'CLASS_DELETED',

  ASSIGNMENT_CREATED = 'ASSIGNMENT_CREATED',
  ASSIGNMENT_UPDATED = 'ASSIGNMENT_UPDATED',
  ASSIGNMENT_DELETED = 'ASSIGNMENT_DELETED',

  QUIZ_CREATED = 'QUIZ_CREATED',
  QUIZ_UPDATED = 'QUIZ_UPDATED',
  QUIZ_DELETED = 'QUIZ_DELETED',

  // Grading
  GRADE_ASSIGNED = 'GRADE_ASSIGNED',
  GRADE_UPDATED = 'GRADE_UPDATED',

  // Config changes
  AI_CONFIG_UPDATED = 'AI_CONFIG_UPDATED',
  BRANDING_UPDATED = 'BRANDING_UPDATED',
  SMS_CONFIG_UPDATED = 'SMS_CONFIG_UPDATED',
  WEBHOOK_CREATED = 'WEBHOOK_CREATED',
  WEBHOOK_UPDATED = 'WEBHOOK_UPDATED',
  WEBHOOK_DELETED = 'WEBHOOK_DELETED',

  // Data actions
  DATA_EXPORTED = 'DATA_EXPORTED',
  DELETION_REQUESTED = 'DELETION_REQUESTED',
  DELETION_CANCELLED = 'DELETION_CANCELLED',
  ACCOUNT_DELETED = 'ACCOUNT_DELETED',

  // COPPA
  CONSENT_REQUESTED = 'CONSENT_REQUESTED',
  CONSENT_VERIFIED = 'CONSENT_VERIFIED',
  CONSENT_REJECTED = 'CONSENT_REJECTED',
  CONSENT_REVOKED = 'CONSENT_REVOKED',

  // Security events
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_TOKEN = 'INVALID_TOKEN'
}

export interface AuditLogEntry {
  userId?: string;
  userEmail?: string;
  action: AuditAction | string;
  entityType: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<string | null> {
  try {
    const log = await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        userEmail: entry.userEmail,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        oldValues: entry.oldValues ? JSON.stringify(entry.oldValues) : null,
        newValues: entry.newValues ? JSON.stringify(entry.newValues) : null,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null
      }
    });

    logger.debug(`Audit log created: ${entry.action} on ${entry.entityType}`);
    return log.id;

  } catch (error) {
    logger.error('Failed to create audit log:', error);
    return null;
  }
}

/**
 * Helper to extract request info for audit log
 */
export function getRequestInfo(req: Request): {
  ipAddress: string;
  userAgent: string;
  userId?: string;
  userEmail?: string;
} {
  return {
    ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
    userAgent: req.get('user-agent') || 'unknown',
    userId: req.session?.userId,
    userEmail: req.session?.user?.email
  };
}

/**
 * Log a user action
 */
export async function logUserAction(
  req: Request,
  action: AuditAction,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const info = getRequestInfo(req);

  await createAuditLog({
    ...info,
    action,
    entityType,
    entityId,
    metadata
  });
}

/**
 * Log an admin action with old/new values
 */
export async function logAdminAction(
  req: Request,
  action: AuditAction,
  entityType: string,
  entityId: string,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>
): Promise<void> {
  const info = getRequestInfo(req);

  await createAuditLog({
    ...info,
    action,
    entityType,
    entityId,
    oldValues,
    newValues
  });
}

/**
 * Log a security event
 */
export async function logSecurityEvent(
  req: Request,
  action: AuditAction,
  details: Record<string, unknown>
): Promise<void> {
  const info = getRequestInfo(req);

  await createAuditLog({
    ...info,
    action,
    entityType: 'Security',
    metadata: details
  });

  // Also log to regular logger for immediate alerting
  logger.warn(`Security event: ${action}`, { ...info, ...details });
}

/**
 * Get audit logs with filtering
 */
export async function getAuditLogs(options: {
  userId?: string;
  action?: string;
  entityType?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}): Promise<{
  logs: Array<Record<string, unknown>>;
  total: number;
}> {
  const where: Record<string, unknown> = {};

  if (options.userId) where.userId = options.userId;
  if (options.action) where.action = options.action;
  if (options.entityType) where.entityType = options.entityType;

  if (options.startDate || options.endDate) {
    where.createdAt = {};
    if (options.startDate) (where.createdAt as Record<string, unknown>).gte = options.startDate;
    if (options.endDate) (where.createdAt as Record<string, unknown>).lte = options.endDate;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options.limit || 50,
      skip: options.offset || 0
    }),
    prisma.auditLog.count({ where })
  ]);

  return {
    logs: logs.map(log => ({
      ...log,
      oldValues: log.oldValues ? JSON.parse(log.oldValues) : null,
      newValues: log.newValues ? JSON.parse(log.newValues) : null,
      metadata: log.metadata ? JSON.parse(log.metadata) : null
    })),
    total
  };
}

/**
 * Get user activity summary
 */
export async function getUserActivitySummary(userId: string, days = 30): Promise<{
  logins: number;
  actions: number;
  lastActivity: Date | null;
}> {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [logins, actions, lastLog] = await Promise.all([
    prisma.auditLog.count({
      where: {
        userId,
        action: AuditAction.LOGIN,
        createdAt: { gte: startDate }
      }
    }),
    prisma.auditLog.count({
      where: {
        userId,
        createdAt: { gte: startDate }
      }
    }),
    prisma.auditLog.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    })
  ]);

  return {
    logins,
    actions,
    lastActivity: lastLog?.createdAt || null
  };
}

/**
 * Get admin action statistics
 */
export async function getAdminStats(days = 7): Promise<{
  totalActions: number;
  userCreations: number;
  userUpdates: number;
  userDeletions: number;
  configChanges: number;
}> {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [total, creations, updates, deletions, configs] = await Promise.all([
    prisma.auditLog.count({
      where: { createdAt: { gte: startDate } }
    }),
    prisma.auditLog.count({
      where: {
        action: AuditAction.USER_CREATED,
        createdAt: { gte: startDate }
      }
    }),
    prisma.auditLog.count({
      where: {
        action: AuditAction.USER_UPDATED,
        createdAt: { gte: startDate }
      }
    }),
    prisma.auditLog.count({
      where: {
        action: AuditAction.USER_DELETED,
        createdAt: { gte: startDate }
      }
    }),
    prisma.auditLog.count({
      where: {
        action: {
          in: [
            AuditAction.AI_CONFIG_UPDATED,
            AuditAction.BRANDING_UPDATED,
            AuditAction.SMS_CONFIG_UPDATED
          ]
        },
        createdAt: { gte: startDate }
      }
    })
  ]);

  return {
    totalActions: total,
    userCreations: creations,
    userUpdates: updates,
    userDeletions: deletions,
    configChanges: configs
  };
}

export default {
  AuditAction,
  createAuditLog,
  getRequestInfo,
  logUserAction,
  logAdminAction,
  logSecurityEvent,
  getAuditLogs,
  getUserActivitySummary,
  getAdminStats
};
