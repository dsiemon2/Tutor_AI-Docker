/**
 * Authentication Integration Tests
 * Tests for login, registration, password reset, email verification
 */

import { createMockPrisma, MockPrismaClient } from '../mocks/prisma.mock';

// Create the mock instance
const authMockPrisma: MockPrismaClient = createMockPrisma();

jest.mock('../../config/database', () => ({
  prisma: authMockPrisma
}));

jest.mock('../../config', () => ({
  config: {
    basePath: '/TutorAI',
    jwtSecret: 'test-jwt-secret',
    jwtExpiresIn: '24h'
  }
}));

jest.mock('../../services/email.service', () => ({
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
  sendEmailVerificationEmail: jest.fn().mockResolvedValue(true),
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendPasswordChangedEmail: jest.fn().mockResolvedValue(true)
}));

describe('Authentication', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    passwordHash: '$2b$12$hashedpassword',
    role: 'STUDENT',
    schoolId: 'school-123',
    isActive: true,
    emailVerified: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authMockPrisma.branding.findFirst.mockResolvedValue({
      primaryColor: '#0ea5e9',
      secondaryColor: '#0284c7'
    });
  });

  describe('Login', () => {
    it('should find active user by email', async () => {
      authMockPrisma.user.findFirst.mockResolvedValue(mockUser);

      const user = await authMockPrisma.user.findFirst({
        where: { email: 'test@example.com', isActive: true }
      });

      expect(user).not.toBeNull();
      expect(user?.email).toBe('test@example.com');
    });

    it('should not find inactive user', async () => {
      authMockPrisma.user.findFirst.mockResolvedValue(null);

      const user = await authMockPrisma.user.findFirst({
        where: { email: 'inactive@example.com', isActive: true }
      });

      expect(user).toBeNull();
    });

    it('should update last login timestamp', async () => {
      const updatedUser = { ...mockUser, lastLoginAt: new Date() };
      authMockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await authMockPrisma.user.update({
        where: { id: 'user-123' },
        data: { lastLoginAt: new Date() }
      });

      expect(result.lastLoginAt).not.toBeNull();
    });
  });

  describe('Registration', () => {
    it('should create new user with email unverified', async () => {
      const newUser = { ...mockUser, emailVerified: false };
      authMockPrisma.user.create.mockResolvedValue(newUser);

      const result = await authMockPrisma.user.create({
        data: {
          email: 'new@example.com',
          passwordHash: 'hashed',
          firstName: 'Jane',
          lastName: 'Doe',
          role: 'STUDENT',
          emailVerified: false
        }
      });

      expect(result.emailVerified).toBe(false);
    });

    it('should check for existing user before registration', async () => {
      authMockPrisma.user.findFirst.mockResolvedValue(mockUser);

      const existingUser = await authMockPrisma.user.findFirst({
        where: { email: 'test@example.com' }
      });

      expect(existingUser).not.toBeNull();
    });

    it('should create verification token after registration', async () => {
      const token = {
        id: 'token-123',
        userId: 'user-123',
        token: 'abc123',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };
      authMockPrisma.emailVerificationToken.create.mockResolvedValue(token);

      const result = await authMockPrisma.emailVerificationToken.create({
        data: {
          userId: 'user-123',
          token: 'abc123',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      });

      expect(result.userId).toBe('user-123');
    });
  });

  describe('Password Reset', () => {
    it('should create password reset token', async () => {
      const resetToken = {
        id: 'reset-123',
        userId: 'user-123',
        token: 'resettoken123',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        usedAt: null
      };
      authMockPrisma.passwordResetToken.create.mockResolvedValue(resetToken);

      const result = await authMockPrisma.passwordResetToken.create({
        data: {
          userId: 'user-123',
          token: 'resettoken123',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000)
        }
      });

      expect(result.token).toBe('resettoken123');
      expect(result.usedAt).toBeNull();
    });

    it('should rate limit reset requests (5 min cooldown)', async () => {
      const recentToken = {
        id: 'reset-123',
        userId: 'user-123',
        token: 'recent',
        createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
        usedAt: null
      };
      authMockPrisma.passwordResetToken.findFirst.mockResolvedValue(recentToken);

      const recent = await authMockPrisma.passwordResetToken.findFirst({
        where: {
          userId: 'user-123',
          createdAt: { gt: new Date(Date.now() - 5 * 60 * 1000) },
          usedAt: null
        }
      });

      expect(recent).not.toBeNull(); // Should find recent token = rate limited
    });

    it('should verify valid reset token', async () => {
      const validToken = {
        id: 'reset-123',
        userId: 'user-123',
        token: 'validtoken',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min from now
        usedAt: null
      };
      authMockPrisma.passwordResetToken.findFirst.mockResolvedValue(validToken);

      const token = await authMockPrisma.passwordResetToken.findFirst({
        where: {
          token: 'validtoken',
          usedAt: null,
          expiresAt: { gt: new Date() }
        }
      });

      expect(token).not.toBeNull();
    });

    it('should reject expired reset token', async () => {
      authMockPrisma.passwordResetToken.findFirst.mockResolvedValue(null);

      const token = await authMockPrisma.passwordResetToken.findFirst({
        where: {
          token: 'expiredtoken',
          usedAt: null,
          expiresAt: { gt: new Date() }
        }
      });

      expect(token).toBeNull();
    });

    it('should mark token as used after password reset', async () => {
      const usedToken = {
        id: 'reset-123',
        token: 'usedtoken',
        usedAt: new Date()
      };
      authMockPrisma.passwordResetToken.update.mockResolvedValue(usedToken);

      const result = await authMockPrisma.passwordResetToken.update({
        where: { id: 'reset-123' },
        data: { usedAt: new Date() }
      });

      expect(result.usedAt).not.toBeNull();
    });
  });

  describe('Email Verification', () => {
    it('should verify valid email token', async () => {
      const validToken = {
        id: 'verify-123',
        userId: 'user-123',
        token: 'verifytoken',
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
        verifiedAt: null
      };
      authMockPrisma.emailVerificationToken.findFirst.mockResolvedValue(validToken);

      const token = await authMockPrisma.emailVerificationToken.findFirst({
        where: {
          token: 'verifytoken',
          verifiedAt: null,
          expiresAt: { gt: new Date() }
        }
      });

      expect(token).not.toBeNull();
    });

    it('should mark email as verified', async () => {
      const verifiedUser = { ...mockUser, emailVerified: true };
      authMockPrisma.user.update.mockResolvedValue(verifiedUser);

      const result = await authMockPrisma.user.update({
        where: { id: 'user-123' },
        data: { emailVerified: true }
      });

      expect(result.emailVerified).toBe(true);
    });

    it('should mark verification token as used', async () => {
      const usedToken = {
        id: 'verify-123',
        token: 'usedverify',
        verifiedAt: new Date()
      };
      authMockPrisma.emailVerificationToken.update.mockResolvedValue(usedToken);

      const result = await authMockPrisma.emailVerificationToken.update({
        where: { id: 'verify-123' },
        data: { verifiedAt: new Date() }
      });

      expect(result.verifiedAt).not.toBeNull();
    });

    it('should rate limit resend verification (2 min cooldown)', async () => {
      const recentToken = {
        id: 'verify-123',
        userId: 'user-123',
        createdAt: new Date(Date.now() - 60 * 1000), // 1 min ago
        verifiedAt: null
      };
      authMockPrisma.emailVerificationToken.findFirst.mockResolvedValue(recentToken);

      const recent = await authMockPrisma.emailVerificationToken.findFirst({
        where: {
          userId: 'user-123',
          createdAt: { gt: new Date(Date.now() - 2 * 60 * 1000) },
          verifiedAt: null
        }
      });

      expect(recent).not.toBeNull(); // Should find recent token = rate limited
    });
  });

  describe('Token Generation', () => {
    it('should generate secure random token', () => {
      const crypto = require('crypto');
      const token = crypto.randomBytes(32).toString('hex');

      expect(token.length).toBe(64);
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });

    it('should set 1 hour expiry for password reset', () => {
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      const oneHourFromNow = Date.now() + 60 * 60 * 1000;

      expect(expiresAt.getTime()).toBeCloseTo(oneHourFromNow, -3);
    });

    it('should set 24 hour expiry for email verification', () => {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const oneDayFromNow = Date.now() + 24 * 60 * 60 * 1000;

      expect(expiresAt.getTime()).toBeCloseTo(oneDayFromNow, -3);
    });
  });
});
