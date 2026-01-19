// TutorAI Auth Middleware
// Session authentication, JWT, and role-based access control

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../config/database';
import { ROLES, ROLE_HIERARCHY } from '../config/constants';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        schoolId: string | null;
        districtId?: string | null;
        departmentCode?: string | null;
      };
    }
  }
}

// Extend Express Session
declare module 'express-session' {
  interface SessionData {
    // Front-end session (student, teacher, principals, etc.)
    userId?: string;
    schoolId?: string | null;
    districtId?: string | null;
    departmentCode?: string | null;
    role?: string;
    gradeLevel?: number | null;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      schoolId: string | null;
      districtId?: string | null;
      departmentCode?: string | null;
      gradeLevel?: number | null;
    };
    // View As Student feature (for admins to view student data)
    viewAsStudentId?: string;
    viewAsStudentName?: string;
    // Admin session (super admin, district admin - separate from front-end)
    adminUserId?: string;
    adminSchoolId?: string | null;
    adminDistrictId?: string | null;
    adminRole?: string;
    adminUser?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      schoolId: string | null;
      districtId?: string | null;
    };
  }
}

/**
 * Require authenticated session
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    return next();
  }

  // Check for API requests
  if (req.path.startsWith('/api/') || req.xhr) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Redirect to login
  return res.redirect(`${config.basePath}/auth/login`);
}

/**
 * Require specific role(s)
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId || !req.session.role) {
      if (req.path.startsWith('/api/') || req.xhr) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      return res.redirect(`${config.basePath}/auth/login`);
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.session.role)) {
      if (req.path.startsWith('/api/') || req.xhr) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      return res.status(403).render('errors/403', {
        basePath: config.basePath,
        title: 'Access Denied'
      });
    }

    return next();
  };
}

/**
 * Require minimum role level
 * Uses ROLE_HIERARCHY from constants:
 * SUPER_ADMIN: 100, DISTRICT_ADMIN: 90, PRINCIPAL: 85,
 * VICE_PRINCIPAL: 75, DEPARTMENT_HEAD: 65, TEACHER: 60, STUDENT: 40
 */
export function requireMinRole(minRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId || !req.session.role) {
      if (req.path.startsWith('/api/') || req.xhr) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      return res.redirect(`${config.basePath}/auth/login`);
    }

    const userLevel = ROLE_HIERARCHY[req.session.role as keyof typeof ROLE_HIERARCHY] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole as keyof typeof ROLE_HIERARCHY] || 100;

    if (userLevel < requiredLevel) {
      if (req.path.startsWith('/api/') || req.xhr) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      return res.status(403).render('errors/403', {
        basePath: config.basePath,
        title: 'Access Denied'
      });
    }

    return next();
  };
}

/**
 * Require auth OR admin token (for admin panel)
 * Uses admin-specific session keys (adminUserId, adminRole, etc.)
 */
export function requireAuthOrToken(req: Request, res: Response, next: NextFunction) {
  // Check for admin token
  const token = req.query.token || req.body?.token;
  if (token === config.adminToken) {
    return next();
  }

  // Check for admin-specific session auth
  if (req.session.adminUserId) {
    return next();
  }

  // Check for JWT in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwtToken = authHeader.substring(7);
    try {
      const decoded = jwt.verify(jwtToken, config.jwtSecret) as {
        userId: string;
        email: string;
        role: string;
        schoolId: string | null;
      };
      req.user = decoded;
      return next();
    } catch (error) {
      // Invalid token, continue to auth check
    }
  }

  if (req.path.startsWith('/api/') || req.xhr) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Redirect to admin login for admin routes
  return res.redirect(`${config.basePath}/admin/auth/login`);
}

/**
 * Verify JWT token
 */
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: string;
      email: string;
      role: string;
      schoolId: string | null;
    };
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Optional auth - populates user if logged in, but doesn't require it
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  // Check JWT first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as {
        userId: string;
        email: string;
        role: string;
        schoolId: string | null;
      };
      req.user = decoded;
    } catch (error) {
      // Invalid token, continue without user
    }
  }

  return next();
}

/**
 * Require same school (multi-tenant check)
 * SUPER_ADMIN: Can access any school
 * DISTRICT_ADMIN: Can access schools in their district
 * Others: Can only access their own school
 */
export function requireSameSchool(paramName: string = 'schoolId') {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId || !req.session.role) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Super admins can access any school
    if (req.session.role === 'SUPER_ADMIN') {
      return next();
    }

    const requestedSchoolId = req.params[paramName] || req.body?.[paramName] || req.query[paramName];

    // District admins can access any school in their district
    if (req.session.role === 'DISTRICT_ADMIN' && req.session.districtId) {
      try {
        const school = await prisma.school.findUnique({
          where: { id: requestedSchoolId as string },
          select: { districtId: true }
        });
        if (school && school.districtId === req.session.districtId) {
          return next();
        }
      } catch (error) {
        // Continue to check school-level access
      }
    }

    if (requestedSchoolId && requestedSchoolId !== req.session.schoolId) {
      return res.status(403).json({ error: 'Access denied to this school' });
    }

    return next();
  };
}

/**
 * Require same district (for district-level operations)
 */
export function requireSameDistrict(paramName: string = 'districtId') {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId || !req.session.role) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Super admins can access any district
    if (req.session.role === 'SUPER_ADMIN') {
      return next();
    }

    const requestedDistrictId = req.params[paramName] || req.body?.[paramName] || req.query[paramName];

    // District admins can only access their own district
    if (req.session.role === 'DISTRICT_ADMIN') {
      if (requestedDistrictId && requestedDistrictId !== req.session.districtId) {
        return res.status(403).json({ error: 'Access denied to this district' });
      }
      return next();
    }

    // Other roles cannot access district-level resources directly
    return res.status(403).json({ error: 'District-level access required' });
  };
}

/**
 * Check if user is school leadership (Principal, VP, or higher)
 */
export function requireSchoolLeadership() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId || !req.session.role) {
      if (req.path.startsWith('/api/') || req.xhr) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      return res.redirect(`${config.basePath}/auth/login`);
    }

    const leadershipRoles = ['SUPER_ADMIN', 'DISTRICT_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL'];

    if (!leadershipRoles.includes(req.session.role)) {
      if (req.path.startsWith('/api/') || req.xhr) {
        return res.status(403).json({ error: 'School leadership required' });
      }
      return res.status(403).render('errors/403', {
        basePath: config.basePath,
        title: 'Access Denied'
      });
    }

    return next();
  };
}

/**
 * Check if user can manage curriculum (Department Head or higher)
 */
export function requireCurriculumAccess() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId || !req.session.role) {
      if (req.path.startsWith('/api/') || req.xhr) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      return res.redirect(`${config.basePath}/auth/login`);
    }

    const curriculumRoles = ['SUPER_ADMIN', 'DISTRICT_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'DEPARTMENT_HEAD'];

    if (!curriculumRoles.includes(req.session.role)) {
      if (req.path.startsWith('/api/') || req.xhr) {
        return res.status(403).json({ error: 'Curriculum management access required' });
      }
      return res.status(403).render('errors/403', {
        basePath: config.basePath,
        title: 'Access Denied'
      });
    }

    return next();
  };
}

/**
 * Refresh session user data
 */
export async function refreshSession(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.session.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          schoolId: true,
          districtId: true,
          departmentCode: true,
          gradeLevel: true,
          isActive: true
        }
      });

      if (!user || !user.isActive) {
        req.session.destroy(() => {});
        if (req.path.startsWith('/api/') || req.xhr) {
          return res.status(401).json({ error: 'Session expired' });
        }
        return res.redirect(`${config.basePath}/auth/login`);
      }

      req.session.user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        schoolId: user.schoolId,
        districtId: user.districtId,
        departmentCode: user.departmentCode,
        gradeLevel: user.gradeLevel
      };
      req.session.districtId = user.districtId;
      req.session.departmentCode = user.departmentCode;
    } catch (error) {
      // Continue with existing session data
    }
  }

  return next();
}
