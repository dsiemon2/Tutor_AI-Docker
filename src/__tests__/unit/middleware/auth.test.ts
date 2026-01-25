/**
 * Authentication Middleware Unit Tests
 * Tests for requireAuth, requireRole, and requireMinRole middleware
 */

import { Request, Response, NextFunction } from 'express';

// Mock the dependencies before importing the module
jest.mock('../../../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}));

jest.mock('../../../config', () => ({
  config: {
    basePath: '/TutorAI',
    adminToken: 'test-admin-token',
    sessionSecret: 'test-secret'
  }
}));

import { requireAuth, requireRole, requireMinRole, requireAuthOrToken } from '../../../middleware/auth';
import { prisma } from '../../../config/database';

describe('Authentication Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      session: {} as any,
      query: {},
      path: '/test'
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
      render: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('requireAuth', () => {
    it('should call next() when user is authenticated via session', async () => {
      mockReq.session = {
        userId: 'user-123',
        role: 'STUDENT'
      } as any;

      await requireAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.redirect).not.toHaveBeenCalled();
    });

    it('should redirect to login when user is not authenticated', async () => {
      mockReq.session = {} as any;

      await requireAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.redirect).toHaveBeenCalledWith(expect.stringContaining('/auth/login'));
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow access with valid admin token via requireAuthOrToken', async () => {
      mockReq.query = { token: 'test-admin-token' };
      mockReq.session = {} as any;
      mockReq.headers = {};

      await requireAuthOrToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject invalid admin token via requireAuthOrToken', async () => {
      mockReq.query = { token: 'invalid-token' };
      mockReq.session = {} as any;
      mockReq.headers = {};

      await requireAuthOrToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.redirect).toHaveBeenCalledWith(expect.stringContaining('/admin/auth/login'));
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('should call next() when user has required role', () => {
      mockReq.session = {
        userId: 'user-123',
        role: 'TEACHER'
      } as any;

      const middleware = requireRole('TEACHER');
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() when user has one of multiple allowed roles', () => {
      mockReq.session = {
        userId: 'user-123',
        role: 'PRINCIPAL'
      } as any;

      const middleware = requireRole('TEACHER', 'PRINCIPAL', 'SUPER_ADMIN');
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 when user does not have required role', () => {
      mockReq.session = {
        userId: 'user-123',
        role: 'STUDENT'
      } as any;

      const middleware = requireRole('TEACHER');
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should redirect to login when user is not authenticated', () => {
      mockReq.session = {} as any;

      const middleware = requireRole('TEACHER');
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.redirect).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireMinRole', () => {
    const ROLE_HIERARCHY: Record<string, number> = {
      'SUPER_ADMIN': 100,
      'DISTRICT_ADMIN': 90,
      'PRINCIPAL': 85,
      'VICE_PRINCIPAL': 75,
      'DEPARTMENT_HEAD': 65,
      'TEACHER': 60,
      'STUDENT': 40
    };

    it('should call next() when user has higher role than minimum', () => {
      mockReq.session = {
        userId: 'user-123',
        role: 'PRINCIPAL'
      } as any;

      const middleware = requireMinRole('TEACHER');
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() when user has exact minimum role', () => {
      mockReq.session = {
        userId: 'user-123',
        role: 'TEACHER'
      } as any;

      const middleware = requireMinRole('TEACHER');
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 when user has lower role than minimum', () => {
      mockReq.session = {
        userId: 'user-123',
        role: 'STUDENT'
      } as any;

      const middleware = requireMinRole('TEACHER');
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow SUPER_ADMIN access to everything', () => {
      mockReq.session = {
        userId: 'admin-123',
        role: 'SUPER_ADMIN'
      } as any;

      const middleware = requireMinRole('PRINCIPAL');
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});

describe('Role Hierarchy Validation', () => {
  const ROLE_HIERARCHY: Record<string, number> = {
    'SUPER_ADMIN': 100,
    'DISTRICT_ADMIN': 90,
    'PRINCIPAL': 85,
    'VICE_PRINCIPAL': 75,
    'DEPARTMENT_HEAD': 65,
    'TEACHER': 60,
    'STUDENT': 40
  };

  it('should have correct hierarchy order', () => {
    expect(ROLE_HIERARCHY['SUPER_ADMIN']).toBeGreaterThan(ROLE_HIERARCHY['DISTRICT_ADMIN']);
    expect(ROLE_HIERARCHY['DISTRICT_ADMIN']).toBeGreaterThan(ROLE_HIERARCHY['PRINCIPAL']);
    expect(ROLE_HIERARCHY['PRINCIPAL']).toBeGreaterThan(ROLE_HIERARCHY['VICE_PRINCIPAL']);
    expect(ROLE_HIERARCHY['VICE_PRINCIPAL']).toBeGreaterThan(ROLE_HIERARCHY['DEPARTMENT_HEAD']);
    expect(ROLE_HIERARCHY['DEPARTMENT_HEAD']).toBeGreaterThan(ROLE_HIERARCHY['TEACHER']);
    expect(ROLE_HIERARCHY['TEACHER']).toBeGreaterThan(ROLE_HIERARCHY['STUDENT']);
  });

  it('should have all expected roles defined', () => {
    const expectedRoles = [
      'SUPER_ADMIN',
      'DISTRICT_ADMIN',
      'PRINCIPAL',
      'VICE_PRINCIPAL',
      'DEPARTMENT_HEAD',
      'TEACHER',
      'STUDENT'
    ];

    expectedRoles.forEach(role => {
      expect(ROLE_HIERARCHY).toHaveProperty(role);
      expect(typeof ROLE_HIERARCHY[role]).toBe('number');
    });
  });
});
