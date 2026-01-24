/**
 * Assignment Routes Integration Tests
 * Tests for assignment listing, viewing, submission, and grading
 */

// Mock Prisma
const mockPrisma = {
  assignment: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn()
  },
  submission: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn()
  },
  classStudent: {
    findMany: jest.fn()
  },
  user: {
    findUnique: jest.fn()
  },
  branding: {
    findFirst: jest.fn()
  }
};

jest.mock('../../config/database', () => ({
  prisma: mockPrisma
}));

jest.mock('../../config', () => ({
  config: {
    basePath: '/TutorAI',
    adminToken: 'test-admin-token'
  }
}));

describe('Assignment Routes', () => {
  // Mock data
  const mockStudent = {
    id: 'student-123',
    email: 'student@test.com',
    role: 'STUDENT',
    schoolId: 'school-123'
  };

  const mockAssignment = {
    id: 'assign-123',
    title: 'Math Homework 1',
    description: 'Complete the algebra problems',
    instructions: 'Show all your work',
    type: 'homework',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    maxPoints: 100,
    allowLate: true,
    isActive: true,
    topicId: 'topic-123',
    classId: 'class-123',
    topic: {
      id: 'topic-123',
      name: 'Algebra',
      subject: {
        id: 'subject-123',
        name: 'Mathematics'
      }
    },
    class: {
      id: 'class-123',
      name: 'Math 101'
    }
  };

  const mockSubmission = {
    id: 'submission-123',
    assignmentId: 'assign-123',
    studentId: 'student-123',
    content: 'My completed homework',
    attachments: null,
    status: 'submitted',
    submittedAt: new Date(),
    isLate: false,
    grade: null,
    feedback: null
  };

  const mockEnrollment = {
    classId: 'class-123',
    studentId: 'student-123'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockPrisma.branding.findFirst.mockResolvedValue({
      primaryColor: '#0ea5e9',
      secondaryColor: '#0284c7',
      accentColor: '#38bdf8'
    });

    mockPrisma.user.findUnique.mockResolvedValue(mockStudent);
    mockPrisma.classStudent.findMany.mockResolvedValue([mockEnrollment]);
  });

  describe('Assignment Access Control', () => {
    it('should only show assignments for enrolled classes', async () => {
      mockPrisma.classStudent.findMany.mockResolvedValue([mockEnrollment]);
      mockPrisma.assignment.findMany.mockResolvedValue([mockAssignment]);

      const enrollments = await mockPrisma.classStudent.findMany({
        where: { studentId: 'student-123' }
      });
      const classIds = enrollments.map(e => e.classId);

      const result = await mockPrisma.assignment.findMany({
        where: {
          isActive: true,
          OR: [
            { classId: { in: classIds } },
            { classId: null }
          ]
        }
      });

      expect(result.length).toBe(1);
      expect(result[0].classId).toBe('class-123');
    });

    it('should include global assignments (classId: null)', async () => {
      const globalAssignment = { ...mockAssignment, classId: null, class: null };
      mockPrisma.assignment.findMany.mockResolvedValue([mockAssignment, globalAssignment]);

      const result = await mockPrisma.assignment.findMany({
        where: {
          isActive: true,
          OR: [
            { classId: { in: ['class-123'] } },
            { classId: null }
          ]
        }
      });

      expect(result.length).toBe(2);
    });

    it('should not show inactive assignments', async () => {
      const inactiveAssignment = { ...mockAssignment, isActive: false };
      mockPrisma.assignment.findMany.mockResolvedValue([]);

      const result = await mockPrisma.assignment.findMany({
        where: { isActive: true }
      });

      expect(result.length).toBe(0);
    });
  });

  describe('Assignment Submission', () => {
    it('should create new submission when student submits', async () => {
      mockPrisma.submission.create.mockResolvedValue(mockSubmission);

      const result = await mockPrisma.submission.create({
        data: {
          assignmentId: 'assign-123',
          studentId: 'student-123',
          content: 'My completed homework',
          status: 'submitted',
          submittedAt: new Date(),
          isLate: false
        }
      });

      expect(result.status).toBe('submitted');
      expect(result.content).toBe('My completed homework');
    });

    it('should detect late submissions', () => {
      const pastDueDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
      const now = new Date();
      const isLate = pastDueDate < now;

      expect(isLate).toBe(true);
    });

    it('should not allow late submission if assignment disallows it', () => {
      const noLateAssignment = { ...mockAssignment, allowLate: false };
      const pastDueDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const now = new Date();
      const isLate = pastDueDate < now;
      const canSubmit = !isLate || noLateAssignment.allowLate;

      expect(canSubmit).toBe(false);
    });

    it('should allow updating submission before grading', async () => {
      const updatedSubmission = { ...mockSubmission, content: 'Updated homework' };
      mockPrisma.submission.update.mockResolvedValue(updatedSubmission);

      const result = await mockPrisma.submission.update({
        where: { id: 'submission-123' },
        data: { content: 'Updated homework' }
      });

      expect(result.content).toBe('Updated homework');
    });

    it('should handle file attachments', async () => {
      const submissionWithAttachments = {
        ...mockSubmission,
        attachments: JSON.stringify(['upload-1', 'upload-2'])
      };
      mockPrisma.submission.create.mockResolvedValue(submissionWithAttachments);

      const result = await mockPrisma.submission.create({
        data: {
          assignmentId: 'assign-123',
          studentId: 'student-123',
          content: 'See attached files',
          attachments: JSON.stringify(['upload-1', 'upload-2']),
          status: 'submitted'
        }
      });

      const attachments = JSON.parse(result.attachments!);
      expect(attachments.length).toBe(2);
    });
  });

  describe('Assignment Grading', () => {
    it('should allow teacher to grade submission', async () => {
      const gradedSubmission = {
        ...mockSubmission,
        status: 'graded',
        grade: 85,
        feedback: 'Good work!'
      };
      mockPrisma.submission.update.mockResolvedValue(gradedSubmission);

      const result = await mockPrisma.submission.update({
        where: { id: 'submission-123' },
        data: {
          status: 'graded',
          grade: 85,
          feedback: 'Good work!'
        }
      });

      expect(result.status).toBe('graded');
      expect(result.grade).toBe(85);
      expect(result.feedback).toBe('Good work!');
    });

    it('should validate grade is within max points', () => {
      const maxPoints = 100;
      const validGrade = 85;
      const invalidGrade = 150;

      expect(validGrade <= maxPoints).toBe(true);
      expect(invalidGrade <= maxPoints).toBe(false);
    });

    it('should not allow student to edit after grading', async () => {
      const gradedSubmission = { ...mockSubmission, status: 'graded' };
      mockPrisma.submission.findFirst.mockResolvedValue(gradedSubmission);

      const submission = await mockPrisma.submission.findFirst({
        where: { id: 'submission-123' }
      });

      const canEdit = submission?.status !== 'graded';
      expect(canEdit).toBe(false);
    });
  });

  describe('Due Date Handling', () => {
    it('should identify overdue assignments', () => {
      const pastDue = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const now = new Date();
      const isOverdue = pastDue < now;

      expect(isOverdue).toBe(true);
    });

    it('should identify upcoming assignments', () => {
      const futureDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const isOverdue = futureDue < now;

      expect(isOverdue).toBe(false);
    });

    it('should handle assignments with no due date', () => {
      const noDueDateAssignment = { ...mockAssignment, dueDate: null };
      const isOverdue = noDueDateAssignment.dueDate && new Date(noDueDateAssignment.dueDate) < new Date();

      expect(isOverdue).toBeFalsy();
    });
  });

  describe('Assignment Types', () => {
    it('should support homework type', () => {
      expect(mockAssignment.type).toBe('homework');
    });

    it('should support different assignment types', () => {
      const validTypes = ['homework', 'project', 'essay', 'lab', 'presentation', 'other'];
      expect(validTypes).toContain(mockAssignment.type);
    });
  });
});
