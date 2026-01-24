/**
 * GDPR Compliance Service
 * Handles data export and deletion requests
 */

import { prisma } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Export all user data (GDPR Article 20 - Right to Data Portability)
 */
export async function exportUserData(userId: string): Promise<{
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}> {
  try {
    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        gradeLevel: true,
        preferredVoice: true,
        preferredLanguage: true,
        textSize: true,
        highContrast: true,
        dyslexiaFont: true,
        emailVerified: true,
        createdAt: true,
        lastLoginAt: true,
        school: {
          select: {
            name: true,
            city: true,
            state: true
          }
        }
      }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Get tutoring sessions
    const sessions = await prisma.tutoringSession.findMany({
      where: { studentId: userId },
      select: {
        id: true,
        mode: true,
        status: true,
        startedAt: true,
        endedAt: true,
        duration: true,
        summary: true,
        subject: { select: { name: true } },
        topic: { select: { name: true } },
        messages: {
          select: {
            role: true,
            content: true,
            createdAt: true
          }
        }
      }
    });

    // Get student progress
    const progress = await prisma.studentProgress.findMany({
      where: { studentId: userId },
      select: {
        masteryLevel: true,
        totalTime: true,
        questionsAttempted: true,
        questionsCorrect: true,
        lastActivityAt: true,
        topic: {
          select: {
            name: true,
            subject: { select: { name: true } }
          }
        }
      }
    });

    // Get quiz attempts
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { studentId: userId },
      select: {
        attemptNum: true,
        startedAt: true,
        submittedAt: true,
        score: true,
        percentage: true,
        passed: true,
        quiz: {
          select: {
            title: true,
            topic: { select: { name: true } }
          }
        },
        answers: {
          select: {
            answer: true,
            isCorrect: true,
            pointsEarned: true,
            question: { select: { questionText: true } }
          }
        }
      }
    });

    // Get assignment submissions
    const submissions = await prisma.submission.findMany({
      where: { studentId: userId },
      select: {
        content: true,
        submittedAt: true,
        isLate: true,
        grade: true,
        feedback: true,
        status: true,
        assignment: {
          select: {
            title: true,
            instructions: true,
            topic: { select: { name: true } }
          }
        }
      }
    });

    // Get messages (sent and received)
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      select: {
        content: true,
        subject: true,
        isRead: true,
        createdAt: true,
        senderId: true,
        receiverId: true
      }
    });

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where: { userId },
      select: {
        type: true,
        title: true,
        message: true,
        isRead: true,
        createdAt: true
      }
    });

    // Compile all data
    const exportData = {
      exportDate: new Date().toISOString(),
      exportVersion: '1.0',
      user: {
        profile: user,
        preferences: {
          voice: user.preferredVoice,
          language: user.preferredLanguage,
          textSize: user.textSize,
          highContrast: user.highContrast,
          dyslexiaFont: user.dyslexiaFont
        }
      },
      learning: {
        sessions,
        progress,
        quizAttempts,
        submissions
      },
      communication: {
        messages,
        notifications
      }
    };

    logger.info(`Data export generated for user ${userId}`);

    return {
      success: true,
      data: exportData
    };

  } catch (error) {
    logger.error('Data export error:', error);
    return {
      success: false,
      error: 'Failed to export data'
    };
  }
}

/**
 * Request account deletion (GDPR Article 17 - Right to Erasure)
 */
export async function requestAccountDeletion(
  userId: string,
  reason?: string
): Promise<{
  success: boolean;
  deletionId?: string;
  error?: string;
}> {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check for pending deletion request
    const existingRequest = await prisma.auditLog.findFirst({
      where: {
        userId,
        action: 'DELETION_REQUESTED',
        createdAt: { gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Within last 7 days
      }
    });

    if (existingRequest) {
      return { success: false, error: 'A deletion request is already pending' };
    }

    // Log the deletion request
    const deletionLog = await prisma.auditLog.create({
      data: {
        userId,
        userEmail: user.email,
        action: 'DELETION_REQUESTED',
        entityType: 'User',
        entityId: userId,
        metadata: JSON.stringify({
          reason,
          requestedAt: new Date().toISOString(),
          scheduledDeletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        })
      }
    });

    logger.info(`Deletion requested for user ${userId}`);

    return {
      success: true,
      deletionId: deletionLog.id
    };

  } catch (error) {
    logger.error('Deletion request error:', error);
    return {
      success: false,
      error: 'Failed to process deletion request'
    };
  }
}

/**
 * Cancel account deletion request
 */
export async function cancelDeletionRequest(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Find pending deletion request
    const deletionRequest = await prisma.auditLog.findFirst({
      where: {
        userId,
        action: 'DELETION_REQUESTED'
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!deletionRequest) {
      return { success: false, error: 'No deletion request found' };
    }

    // Log cancellation
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DELETION_CANCELLED',
        entityType: 'User',
        entityId: userId,
        metadata: JSON.stringify({
          originalRequestId: deletionRequest.id,
          cancelledAt: new Date().toISOString()
        })
      }
    });

    logger.info(`Deletion cancelled for user ${userId}`);

    return { success: true };

  } catch (error) {
    logger.error('Cancel deletion error:', error);
    return { success: false, error: 'Failed to cancel deletion' };
  }
}

/**
 * Execute account deletion (for scheduled deletion jobs)
 */
export async function executeAccountDeletion(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Get user email for audit log
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Delete user data in order (respecting foreign keys)
    await prisma.$transaction([
      // Delete messages
      prisma.message.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } }),

      // Delete notifications
      prisma.notification.deleteMany({ where: { userId } }),

      // Delete quiz answers through attempts
      prisma.quizAnswer.deleteMany({
        where: { attempt: { studentId: userId } }
      }),

      // Delete quiz attempts
      prisma.quizAttempt.deleteMany({ where: { studentId: userId } }),

      // Delete submissions
      prisma.submission.deleteMany({ where: { studentId: userId } }),

      // Delete session messages
      prisma.sessionMessage.deleteMany({
        where: { session: { studentId: userId } }
      }),

      // Delete tutoring sessions
      prisma.tutoringSession.deleteMany({ where: { studentId: userId } }),

      // Delete progress
      prisma.studentProgress.deleteMany({ where: { studentId: userId } }),

      // Delete uploads
      prisma.upload.deleteMany({ where: { userId } }),

      // Delete class enrollments
      prisma.classStudent.deleteMany({ where: { studentId: userId } }),

      // Delete age verification
      prisma.ageVerification.deleteMany({ where: { userId } }),

      // Delete parental consent
      prisma.parentalConsent.deleteMany({ where: { studentId: userId } }),

      // Delete password reset tokens
      prisma.passwordResetToken.deleteMany({ where: { userId } }),

      // Delete email verification tokens
      prisma.emailVerificationToken.deleteMany({ where: { userId } }),

      // Finally delete user
      prisma.user.delete({ where: { id: userId } })
    ]);

    // Log deletion (anonymized)
    await prisma.auditLog.create({
      data: {
        action: 'ACCOUNT_DELETED',
        entityType: 'User',
        entityId: userId,
        metadata: JSON.stringify({
          deletedAt: new Date().toISOString(),
          // Keep anonymized email hash for compliance verification
          emailHash: require('crypto').createHash('sha256').update(user.email).digest('hex')
        })
      }
    });

    logger.info(`Account deleted for user ${userId}`);

    return { success: true };

  } catch (error) {
    logger.error('Account deletion error:', error);
    return { success: false, error: 'Failed to delete account' };
  }
}

/**
 * Get deletion request status
 */
export async function getDeletionStatus(userId: string): Promise<{
  hasPendingDeletion: boolean;
  scheduledDate?: Date;
  requestedAt?: Date;
}> {
  const deletionRequest = await prisma.auditLog.findFirst({
    where: {
      userId,
      action: 'DELETION_REQUESTED'
    },
    orderBy: { createdAt: 'desc' }
  });

  if (!deletionRequest) {
    return { hasPendingDeletion: false };
  }

  // Check if cancelled
  const cancellation = await prisma.auditLog.findFirst({
    where: {
      userId,
      action: 'DELETION_CANCELLED',
      createdAt: { gt: deletionRequest.createdAt }
    }
  });

  if (cancellation) {
    return { hasPendingDeletion: false };
  }

  const metadata = deletionRequest.metadata ? JSON.parse(deletionRequest.metadata) : {};

  return {
    hasPendingDeletion: true,
    scheduledDate: metadata.scheduledDeletion ? new Date(metadata.scheduledDeletion) : undefined,
    requestedAt: deletionRequest.createdAt
  };
}

export default {
  exportUserData,
  requestAccountDeletion,
  cancelDeletionRequest,
  executeAccountDeletion,
  getDeletionStatus
};
