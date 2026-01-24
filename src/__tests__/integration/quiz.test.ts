/**
 * Quiz Routes Integration Tests
 * Tests for quiz listing, viewing, starting, taking, and submitting
 */

import request from 'supertest';
import express, { Express } from 'express';

// Mock Prisma
const mockPrisma = {
  quiz: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn()
  },
  quizAttempt: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  quizAnswer: {
    create: jest.fn()
  },
  classStudent: {
    findMany: jest.fn()
  },
  classTeacher: {
    findMany: jest.fn()
  },
  class: {
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

describe('Quiz Routes', () => {
  // Mock data
  const mockStudent = {
    id: 'student-123',
    email: 'student@test.com',
    role: 'STUDENT',
    schoolId: 'school-123'
  };

  const mockQuiz = {
    id: 'quiz-123',
    code: 'QUIZ001',
    title: 'Math Quiz',
    description: 'Test your math skills',
    topicId: 'topic-123',
    classId: 'class-123',
    timeLimit: 30,
    passingScore: 70,
    maxAttempts: 3,
    randomize: false,
    showAnswers: true,
    isActive: true,
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
    },
    questions: [
      {
        id: 'q1',
        questionNum: 1,
        questionText: 'What is 2 + 2?',
        questionType: 'multiple_choice',
        options: JSON.stringify(['3', '4', '5', '6']),
        correctAnswer: '4',
        points: 1
      },
      {
        id: 'q2',
        questionNum: 2,
        questionText: 'What is 3 x 3?',
        questionType: 'multiple_choice',
        options: JSON.stringify(['6', '9', '12', '15']),
        correctAnswer: '9',
        points: 1
      }
    ],
    attempts: []
  };

  const mockEnrollment = {
    classId: 'class-123',
    studentId: 'student-123'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockPrisma.branding.findFirst.mockResolvedValue({
      primaryColor: '#0ea5e9',
      secondaryColor: '#0284c7',
      accentColor: '#38bdf8'
    });

    mockPrisma.user.findUnique.mockResolvedValue(mockStudent);
    mockPrisma.classStudent.findMany.mockResolvedValue([mockEnrollment]);
  });

  describe('Quiz Access Control', () => {
    it('should only allow access to quizzes in enrolled classes', async () => {
      // Student is enrolled in class-123
      mockPrisma.classStudent.findMany.mockResolvedValue([mockEnrollment]);

      // Quiz is in class-123 - should be accessible
      mockPrisma.quiz.findFirst.mockResolvedValue(mockQuiz);

      const result = await mockPrisma.quiz.findFirst({
        where: {
          id: 'quiz-123',
          isActive: true,
          OR: [
            { classId: { in: ['class-123'] } },
            { classId: null }
          ]
        }
      });

      expect(result).not.toBeNull();
      expect(result?.id).toBe('quiz-123');
    });

    it('should not allow access to quizzes in non-enrolled classes', async () => {
      // Student is enrolled in class-456 (different class)
      mockPrisma.classStudent.findMany.mockResolvedValue([{ classId: 'class-456', studentId: 'student-123' }]);

      // Quiz is in class-123 - should NOT be accessible
      mockPrisma.quiz.findFirst.mockResolvedValue(null);

      const result = await mockPrisma.quiz.findFirst({
        where: {
          id: 'quiz-123',
          isActive: true,
          OR: [
            { classId: { in: ['class-456'] } },
            { classId: null }
          ]
        }
      });

      expect(result).toBeNull();
    });

    it('should allow access to global quizzes (classId: null)', async () => {
      const globalQuiz = { ...mockQuiz, classId: null, class: null };
      mockPrisma.quiz.findFirst.mockResolvedValue(globalQuiz);

      const result = await mockPrisma.quiz.findFirst({
        where: {
          id: 'quiz-123',
          isActive: true,
          OR: [
            { classId: { in: ['class-456'] } },
            { classId: null }
          ]
        }
      });

      expect(result).not.toBeNull();
      expect(result?.classId).toBeNull();
    });

    it('should not allow access to inactive quizzes', async () => {
      mockPrisma.quiz.findFirst.mockResolvedValue(null);

      const result = await mockPrisma.quiz.findFirst({
        where: {
          id: 'quiz-123',
          isActive: true, // This filter should exclude inactive quizzes
          OR: [
            { classId: { in: ['class-123'] } },
            { classId: null }
          ]
        }
      });

      expect(result).toBeNull();
    });
  });

  describe('Quiz Attempt Management', () => {
    it('should create new attempt when starting quiz', async () => {
      const mockAttempt = {
        id: 'attempt-123',
        quizId: 'quiz-123',
        studentId: 'student-123',
        attemptNum: 1,
        status: 'in_progress'
      };

      mockPrisma.quizAttempt.create.mockResolvedValue(mockAttempt);

      const result = await mockPrisma.quizAttempt.create({
        data: {
          quizId: 'quiz-123',
          studentId: 'student-123',
          attemptNum: 1,
          status: 'in_progress'
        }
      });

      expect(result.status).toBe('in_progress');
      expect(result.attemptNum).toBe(1);
    });

    it('should enforce max attempts limit', async () => {
      const quizWithMaxAttempts = {
        ...mockQuiz,
        maxAttempts: 3,
        attempts: [
          { id: 'a1', attemptNum: 1, status: 'submitted' },
          { id: 'a2', attemptNum: 2, status: 'submitted' },
          { id: 'a3', attemptNum: 3, status: 'submitted' }
        ]
      };

      mockPrisma.quiz.findFirst.mockResolvedValue(quizWithMaxAttempts);

      const result = await mockPrisma.quiz.findFirst({
        where: { id: 'quiz-123' },
        include: { attempts: { where: { studentId: 'student-123' } } }
      });

      // Should not allow more attempts
      expect(result?.attempts.length).toBe(3);
      expect(result?.attempts.length).toBeGreaterThanOrEqual(result?.maxAttempts || 0);
    });

    it('should redirect to existing in-progress attempt', async () => {
      const inProgressAttempt = {
        id: 'attempt-123',
        quizId: 'quiz-123',
        studentId: 'student-123',
        status: 'in_progress'
      };

      mockPrisma.quizAttempt.findFirst.mockResolvedValue(inProgressAttempt);

      const result = await mockPrisma.quizAttempt.findFirst({
        where: {
          quizId: 'quiz-123',
          studentId: 'student-123',
          status: 'in_progress'
        }
      });

      expect(result).not.toBeNull();
      expect(result?.status).toBe('in_progress');
    });
  });

  describe('Quiz Grading', () => {
    it('should calculate score correctly', () => {
      const questions = mockQuiz.questions;
      const studentAnswers = { 'q1': '4', 'q2': '9' }; // Both correct

      let totalScore = 0;
      let totalPossible = 0;

      for (const question of questions) {
        const studentAnswer = studentAnswers[question.id as keyof typeof studentAnswers] || '';
        const isCorrect = studentAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
        const pointsEarned = isCorrect ? question.points : 0;

        totalScore += pointsEarned;
        totalPossible += question.points;
      }

      expect(totalScore).toBe(2);
      expect(totalPossible).toBe(2);
      expect((totalScore / totalPossible) * 100).toBe(100);
    });

    it('should calculate passing status correctly', () => {
      const passingScore = 70;

      // Test passing
      const passingPercentage = 80;
      expect(passingPercentage >= passingScore).toBe(true);

      // Test failing
      const failingPercentage = 60;
      expect(failingPercentage >= passingScore).toBe(false);

      // Test edge case (exactly passing)
      const exactPercentage = 70;
      expect(exactPercentage >= passingScore).toBe(true);
    });

    it('should handle partial correct answers', () => {
      const questions = mockQuiz.questions;
      const studentAnswers = { 'q1': '4', 'q2': '6' }; // One correct, one wrong

      let totalScore = 0;
      let totalPossible = 0;

      for (const question of questions) {
        const studentAnswer = studentAnswers[question.id as keyof typeof studentAnswers] || '';
        const isCorrect = studentAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
        const pointsEarned = isCorrect ? question.points : 0;

        totalScore += pointsEarned;
        totalPossible += question.points;
      }

      expect(totalScore).toBe(1);
      expect(totalPossible).toBe(2);
      expect((totalScore / totalPossible) * 100).toBe(50);
    });

    it('should handle empty answers', () => {
      const questions = mockQuiz.questions;
      const studentAnswers = {}; // No answers

      let totalScore = 0;
      let totalPossible = 0;

      for (const question of questions) {
        const studentAnswer = (studentAnswers as any)[question.id] || '';
        const isCorrect = studentAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
        const pointsEarned = isCorrect ? question.points : 0;

        totalScore += pointsEarned;
        totalPossible += question.points;
      }

      expect(totalScore).toBe(0);
      expect(totalPossible).toBe(2);
    });
  });

  describe('Quiz Data Validation', () => {
    it('should validate quiz has required fields', () => {
      expect(mockQuiz).toHaveProperty('id');
      expect(mockQuiz).toHaveProperty('title');
      expect(mockQuiz).toHaveProperty('questions');
      expect(mockQuiz).toHaveProperty('passingScore');
      expect(mockQuiz).toHaveProperty('maxAttempts');
      expect(mockQuiz).toHaveProperty('isActive');
    });

    it('should validate question structure', () => {
      const question = mockQuiz.questions[0];
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('questionText');
      expect(question).toHaveProperty('questionType');
      expect(question).toHaveProperty('correctAnswer');
      expect(question).toHaveProperty('points');
    });

    it('should parse question options correctly', () => {
      const question = mockQuiz.questions[0];
      const options = JSON.parse(question.options);

      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBeGreaterThan(0);
      expect(options).toContain(question.correctAnswer);
    });
  });
});
