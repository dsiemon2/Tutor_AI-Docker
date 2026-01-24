// TutorAI Bulk Operations Service
// Batch operations for users, enrollments, and data management

import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';
import { createAuditLog, AuditAction } from './audit.service';

export interface BulkUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'TEACHER' | 'SCHOOL_ADMIN';
  gradeLevel?: number;
  password?: string;
}

export interface BulkResult {
  success: number;
  failed: number;
  errors: { index: number; email?: string; error: string }[];
  created?: any[];
}

/**
 * Bulk create users
 */
export async function bulkCreateUsers(
  users: BulkUserData[],
  schoolId: string,
  createdById: string
): Promise<BulkResult> {
  const result: BulkResult = {
    success: 0,
    failed: 0,
    errors: [],
    created: []
  };

  for (let i = 0; i < users.length; i++) {
    const userData = users[i];

    try {
      // Check if email already exists
      const existing = await prisma.user.findUnique({
        where: { email: userData.email.toLowerCase() }
      });

      if (existing) {
        result.failed++;
        result.errors.push({
          index: i,
          email: userData.email,
          error: 'Email already exists'
        });
        continue;
      }

      // Generate password if not provided
      const password = userData.password || generateRandomPassword();
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email.toLowerCase(),
          passwordHash,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          schoolId,
          gradeLevel: userData.gradeLevel,
          isActive: true
        }
      });

      result.success++;
      result.created?.push({
        ...user,
        temporaryPassword: password
      });

      // Log the action
      await createAuditLog({
        userId: createdById,
        action: AuditAction.USER_CREATED,
        entityType: 'User',
        entityId: user.id,
        newValues: { role: user.role, email: user.email },
        metadata: { source: 'bulk_import' }
      });

    } catch (error: any) {
      result.failed++;
      result.errors.push({
        index: i,
        email: userData.email,
        error: error.message || 'Unknown error'
      });
      logger.error(`Bulk user create error at index ${i}:`, error);
    }
  }

  logger.info(`Bulk user creation: ${result.success} success, ${result.failed} failed`);
  return result;
}

/**
 * Bulk update user status (activate/deactivate)
 */
export async function bulkUpdateUserStatus(
  userIds: string[],
  isActive: boolean,
  updatedById: string
): Promise<BulkResult> {
  const result: BulkResult = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { isActive }
      });

      result.success++;

      await createAuditLog({
        userId: updatedById,
        action: isActive ? AuditAction.USER_ACTIVATED : AuditAction.USER_DEACTIVATED,
        entityType: 'User',
        entityId: userId,
        oldValues: { isActive: !isActive },
        newValues: { isActive },
        metadata: { source: 'bulk_operation' }
      });

    } catch (error: any) {
      result.failed++;
      result.errors.push({
        index: i,
        error: error.message || 'User not found or update failed'
      });
    }
  }

  logger.info(`Bulk status update: ${result.success} success, ${result.failed} failed`);
  return result;
}

/**
 * Bulk enroll students in a class
 */
export async function bulkEnrollStudents(
  classId: string,
  studentIds: string[],
  enrolledById: string
): Promise<BulkResult> {
  const result: BulkResult = {
    success: 0,
    failed: 0,
    errors: []
  };

  // Verify class exists
  const targetClass = await prisma.class.findUnique({
    where: { id: classId }
  });

  if (!targetClass) {
    return {
      success: 0,
      failed: studentIds.length,
      errors: [{ index: -1, error: 'Class not found' }]
    };
  }

  for (let i = 0; i < studentIds.length; i++) {
    const studentId = studentIds[i];

    try {
      // Check if already enrolled
      const existing = await prisma.classStudent.findUnique({
        where: {
          classId_studentId: { classId, studentId }
        }
      });

      if (existing) {
        result.failed++;
        result.errors.push({
          index: i,
          error: 'Student already enrolled in this class'
        });
        continue;
      }

      // Verify student exists and is a student
      const student = await prisma.user.findFirst({
        where: { id: studentId, role: 'STUDENT' }
      });

      if (!student) {
        result.failed++;
        result.errors.push({
          index: i,
          error: 'Student not found'
        });
        continue;
      }

      // Create enrollment
      await prisma.classStudent.create({
        data: {
          classId,
          studentId,
          enrolledAt: new Date()
        }
      });

      result.success++;

      await createAuditLog({
        userId: enrolledById,
        action: AuditAction.STUDENT_ENROLLED,
        entityType: 'ClassStudent',
        entityId: `${classId}-${studentId}`,
        newValues: { classId, studentId },
        metadata: { source: 'bulk_enrollment' }
      });

    } catch (error: any) {
      result.failed++;
      result.errors.push({
        index: i,
        error: error.message || 'Enrollment failed'
      });
    }
  }

  logger.info(`Bulk enrollment: ${result.success} success, ${result.failed} failed`);
  return result;
}

/**
 * Bulk remove students from a class
 */
export async function bulkUnenrollStudents(
  classId: string,
  studentIds: string[],
  removedById: string
): Promise<BulkResult> {
  const result: BulkResult = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (let i = 0; i < studentIds.length; i++) {
    const studentId = studentIds[i];

    try {
      await prisma.classStudent.delete({
        where: {
          classId_studentId: { classId, studentId }
        }
      });

      result.success++;

      await createAuditLog({
        userId: removedById,
        action: AuditAction.STUDENT_UNENROLLED,
        entityType: 'ClassStudent',
        entityId: `${classId}-${studentId}`,
        oldValues: { classId, studentId },
        metadata: { source: 'bulk_unenrollment' }
      });

    } catch (error: any) {
      result.failed++;
      result.errors.push({
        index: i,
        error: error.message || 'Unenrollment failed'
      });
    }
  }

  logger.info(`Bulk unenrollment: ${result.success} success, ${result.failed} failed`);
  return result;
}

/**
 * Bulk assign teachers to a class
 */
export async function bulkAssignTeachers(
  classId: string,
  teacherIds: string[],
  assignedById: string
): Promise<BulkResult> {
  const result: BulkResult = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (let i = 0; i < teacherIds.length; i++) {
    const teacherId = teacherIds[i];

    try {
      // Check if already assigned
      const existing = await prisma.classTeacher.findUnique({
        where: {
          classId_teacherId: { classId, teacherId }
        }
      });

      if (existing) {
        result.failed++;
        result.errors.push({
          index: i,
          error: 'Teacher already assigned to this class'
        });
        continue;
      }

      // Verify teacher exists
      const teacher = await prisma.user.findFirst({
        where: { id: teacherId, role: 'TEACHER' }
      });

      if (!teacher) {
        result.failed++;
        result.errors.push({
          index: i,
          error: 'Teacher not found'
        });
        continue;
      }

      await prisma.classTeacher.create({
        data: {
          classId,
          teacherId,
          isPrimary: i === 0 // First teacher is primary
        }
      });

      result.success++;

      await createAuditLog({
        userId: assignedById,
        action: AuditAction.TEACHER_ASSIGNED,
        entityType: 'ClassTeacher',
        entityId: `${classId}-${teacherId}`,
        newValues: { classId, teacherId },
        metadata: { source: 'bulk_assignment' }
      });

    } catch (error: any) {
      result.failed++;
      result.errors.push({
        index: i,
        error: error.message || 'Assignment failed'
      });
    }
  }

  logger.info(`Bulk teacher assignment: ${result.success} success, ${result.failed} failed`);
  return result;
}

/**
 * Bulk delete users (soft delete - deactivate)
 */
export async function bulkDeleteUsers(
  userIds: string[],
  deletedById: string
): Promise<BulkResult> {
  return bulkUpdateUserStatus(userIds, false, deletedById);
}

/**
 * Bulk reset passwords
 */
export async function bulkResetPasswords(
  userIds: string[],
  resetById: string
): Promise<{ success: number; failed: number; passwords: { userId: string; email: string; password: string }[] }> {
  const result = {
    success: 0,
    failed: 0,
    passwords: [] as { userId: string; email: string; password: string }[]
  };

  for (const userId of userIds) {
    try {
      const newPassword = generateRandomPassword();
      const passwordHash = await bcrypt.hash(newPassword, 12);

      const user = await prisma.user.update({
        where: { id: userId },
        data: { passwordHash }
      });

      result.success++;
      result.passwords.push({
        userId: user.id,
        email: user.email,
        password: newPassword
      });

      await createAuditLog({
        userId: resetById,
        action: AuditAction.PASSWORD_CHANGED,
        entityType: 'User',
        entityId: userId,
        metadata: { source: 'bulk_password_reset', resetBy: resetById }
      });

    } catch (error) {
      result.failed++;
    }
  }

  logger.info(`Bulk password reset: ${result.success} success, ${result.failed} failed`);
  return result;
}

/**
 * Parse CSV data for user import
 */
export function parseUserCSV(csvContent: string): { users: BulkUserData[]; errors: string[] } {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const users: BulkUserData[] = [];
  const errors: string[] = [];

  if (lines.length < 2) {
    return { users: [], errors: ['CSV must have a header row and at least one data row'] };
  }

  // Parse header
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const emailIndex = header.indexOf('email');
  const firstNameIndex = header.indexOf('firstname') !== -1 ? header.indexOf('firstname') : header.indexOf('first_name');
  const lastNameIndex = header.indexOf('lastname') !== -1 ? header.indexOf('lastname') : header.indexOf('last_name');
  const roleIndex = header.indexOf('role');
  const gradeLevelIndex = header.indexOf('gradelevel') !== -1 ? header.indexOf('gradelevel') : header.indexOf('grade_level');

  if (emailIndex === -1 || firstNameIndex === -1 || lastNameIndex === -1) {
    return { users: [], errors: ['CSV must have email, firstName, and lastName columns'] };
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    if (values.length <= Math.max(emailIndex, firstNameIndex, lastNameIndex)) {
      errors.push(`Row ${i + 1}: Not enough columns`);
      continue;
    }

    const email = values[emailIndex]?.trim();
    const firstName = values[firstNameIndex]?.trim();
    const lastName = values[lastNameIndex]?.trim();
    const role = (values[roleIndex]?.trim().toUpperCase() || 'STUDENT') as BulkUserData['role'];
    const gradeLevel = gradeLevelIndex !== -1 ? parseInt(values[gradeLevelIndex]?.trim()) : undefined;

    if (!email || !firstName || !lastName) {
      errors.push(`Row ${i + 1}: Missing required fields`);
      continue;
    }

    if (!email.includes('@')) {
      errors.push(`Row ${i + 1}: Invalid email format`);
      continue;
    }

    if (!['STUDENT', 'TEACHER', 'SCHOOL_ADMIN'].includes(role)) {
      errors.push(`Row ${i + 1}: Invalid role "${role}". Must be STUDENT, TEACHER, or SCHOOL_ADMIN`);
      continue;
    }

    users.push({
      email,
      firstName,
      lastName,
      role,
      gradeLevel: !isNaN(gradeLevel!) ? gradeLevel : undefined
    });
  }

  return { users, errors };
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Generate a random password
 */
function generateRandomPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Export users to CSV format
 */
export async function exportUsersToCSV(
  options: {
    schoolId?: string;
    role?: string;
    isActive?: boolean;
  } = {}
): Promise<string> {
  const where: any = {};
  if (options.schoolId) where.schoolId = options.schoolId;
  if (options.role) where.role = options.role;
  if (typeof options.isActive === 'boolean') where.isActive = options.isActive;

  const users = await prisma.user.findMany({
    where,
    include: { school: { select: { name: true } } },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }]
  });

  const header = 'Email,First Name,Last Name,Role,Grade Level,School,Active,Created At';
  const rows = users.map(user =>
    `"${user.email}","${user.firstName}","${user.lastName}","${user.role}","${user.gradeLevel || ''}","${user.school?.name || ''}","${user.isActive}","${user.createdAt.toISOString()}"`
  );

  return [header, ...rows].join('\n');
}

export default {
  bulkCreateUsers,
  bulkUpdateUserStatus,
  bulkEnrollStudents,
  bulkUnenrollStudents,
  bulkAssignTeachers,
  bulkDeleteUsers,
  bulkResetPasswords,
  parseUserCSV,
  exportUsersToCSV
};
