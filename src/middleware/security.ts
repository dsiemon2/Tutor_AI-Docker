/**
 * Security Middleware
 * Rate limiting, CSRF protection, input validation helpers
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import crypto from 'crypto';
import { logger } from '../utils/logger';

// ============================================
// RATE LIMITING
// ============================================

/**
 * General API rate limiter - 100 requests per 15 minutes
 */
export const apiLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  }
});

/**
 * Auth rate limiter - 10 attempts per 15 minutes (for login/register)
 */
export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}, email: ${req.body?.email}`);
    res.status(429).json(options.message);
  }
});

/**
 * Strict rate limiter - 5 requests per hour (for password reset, etc.)
 */
export const strictLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'Too many requests, please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Strict rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  }
});

/**
 * AI/Chat rate limiter - 30 messages per minute
 */
export const chatLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: { error: 'Slow down! Too many messages sent.' },
  standardHeaders: true,
  legacyHeaders: false
});

// ============================================
// CSRF PROTECTION (Double Submit Cookie)
// ============================================

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_FIELD_NAME = '_csrf';

/**
 * Generate CSRF token and set cookie
 */
export function generateCsrfToken(req: Request, res: Response): string {
  const token = crypto.randomBytes(32).toString('hex');

  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  return token;
}

/**
 * CSRF protection middleware
 * Validates token from header or body against cookie
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Skip for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip for API routes with JWT auth (they use a different auth mechanism)
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return next();
  }

  const cookieToken = req.cookies[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME] as string;
  const bodyToken = req.body?.[CSRF_FIELD_NAME];

  const submittedToken = headerToken || bodyToken;

  if (!cookieToken || !submittedToken || cookieToken !== submittedToken) {
    logger.warn(`CSRF validation failed for ${req.method} ${req.path}`);
    res.status(403).json({ error: 'Invalid CSRF token' });
    return;
  }

  next();
}

/**
 * Middleware to ensure CSRF token exists and provide it to views
 */
export function csrfTokenProvider(req: Request, res: Response, next: NextFunction): void {
  let token = req.cookies[CSRF_COOKIE_NAME];

  if (!token) {
    token = generateCsrfToken(req, res);
  }

  // Make token available to views
  res.locals.csrfToken = token;
  next();
}

// ============================================
// INPUT VALIDATION HELPERS
// ============================================

/**
 * Validate and sanitize email
 */
export const validateEmail = (): ValidationChain =>
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email is too long');

/**
 * Validate password requirements
 */
export const validatePassword = (fieldName = 'password'): ValidationChain =>
  body(fieldName)
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .isLength({ max: 128 })
    .withMessage('Password is too long')
    .matches(/^[\x00-\x7F]*$/)
    .withMessage('Password contains invalid characters');

/**
 * Validate name field
 */
export const validateName = (fieldName: string): ValidationChain =>
  body(fieldName)
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(`${fieldName} must be between 1 and 100 characters`)
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(`${fieldName} contains invalid characters`);

/**
 * Validate UUID parameter
 */
export const validateUUID = (paramName: string): ValidationChain =>
  param(paramName)
    .isString()
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(`Invalid ${paramName} format`);

/**
 * Validate optional string with max length
 */
export const validateOptionalString = (fieldName: string, maxLength = 1000): ValidationChain =>
  body(fieldName)
    .optional()
    .trim()
    .isLength({ max: maxLength })
    .withMessage(`${fieldName} is too long`);

/**
 * Validate required string with length
 */
export const validateString = (fieldName: string, minLength = 1, maxLength = 1000): ValidationChain =>
  body(fieldName)
    .trim()
    .isLength({ min: minLength, max: maxLength })
    .withMessage(`${fieldName} must be between ${minLength} and ${maxLength} characters`);

/**
 * Validate integer in range
 */
export const validateInteger = (fieldName: string, min = 0, max = 100): ValidationChain =>
  body(fieldName)
    .isInt({ min, max })
    .withMessage(`${fieldName} must be between ${min} and ${max}`);

/**
 * Validate boolean
 */
export const validateBoolean = (fieldName: string): ValidationChain =>
  body(fieldName)
    .optional()
    .isBoolean()
    .withMessage(`${fieldName} must be true or false`);

/**
 * Validate URL
 */
export const validateURL = (fieldName: string): ValidationChain =>
  body(fieldName)
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage(`${fieldName} must be a valid URL`);

/**
 * Validate pagination query params
 */
export const validatePagination = (): ValidationChain[] => [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

/**
 * Middleware to check validation results
 */
export function handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => {
      if ('path' in err) {
        return { field: err.path, message: err.msg };
      }
      return { message: err.msg };
    });

    logger.warn('Validation errors:', { errors: errorMessages, path: req.path });

    // For API requests, return JSON
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(400).json({ errors: errorMessages });
      return;
    }

    // For form submissions, you might want to redirect back with errors
    // For now, return JSON
    res.status(400).json({ errors: errorMessages });
    return;
  }

  next();
}

// ============================================
// SECURITY HEADERS (Additional to Helmet)
// ============================================

/**
 * Additional security headers middleware
 */
export function additionalSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Prevent browsers from MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(self), camera=()');

  next();
}

// ============================================
// SQL INJECTION PROTECTION
// ============================================

/**
 * Check for common SQL injection patterns in string
 */
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/i,
    /(--)/, // SQL comment
    /(;)/, // Statement terminator
    /(\bOR\b\s+\d+\s*=\s*\d+)/i, // OR 1=1 patterns
    /(\bAND\b\s+\d+\s*=\s*\d+)/i, // AND 1=1 patterns
    /'.*--/, // Quote followed by comment
    /\/\*.*\*\// // Block comment
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Middleware to check for SQL injection in body
 */
export function sqlInjectionProtection(req: Request, res: Response, next: NextFunction): void {
  const checkObject = (obj: Record<string, unknown>, path = ''): string | null => {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'string' && containsSqlInjection(value)) {
        return currentPath;
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const result = checkObject(value as Record<string, unknown>, currentPath);
        if (result) return result;
      }
    }
    return null;
  };

  if (req.body && typeof req.body === 'object') {
    const suspiciousField = checkObject(req.body);
    if (suspiciousField) {
      logger.warn(`Potential SQL injection detected in field: ${suspiciousField}`, {
        ip: req.ip,
        path: req.path
      });
      res.status(400).json({ error: 'Invalid input detected' });
      return;
    }
  }

  next();
}

// ============================================
// EXPORT ALL VALIDATORS FOR COMMON ROUTES
// ============================================

export const validators = {
  login: [
    validateEmail(),
    validatePassword(),
    handleValidationErrors
  ],
  register: [
    validateEmail(),
    validatePassword(),
    validateName('firstName'),
    validateName('lastName'),
    handleValidationErrors
  ],
  passwordReset: [
    validateEmail(),
    handleValidationErrors
  ],
  newPassword: [
    validatePassword(),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),
    handleValidationErrors
  ],
  message: [
    validateString('content', 1, 5000),
    validateOptionalString('subject', 200),
    handleValidationErrors
  ]
};

export default {
  apiLimiter,
  authLimiter,
  strictLimiter,
  chatLimiter,
  csrfProtection,
  csrfTokenProvider,
  handleValidationErrors,
  additionalSecurityHeaders,
  sqlInjectionProtection,
  validators
};
