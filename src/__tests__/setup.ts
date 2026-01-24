// Jest Test Setup
// This file runs before each test file

import { prisma } from '../config/database';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-secret-key';
process.env.ADMIN_TOKEN = 'test-admin-token';
process.env.BASE_PATH = '/TutorAI';

// Mock the logger to avoid console noise during tests
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn()
  }
}));

// Clean up after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Global test timeout
jest.setTimeout(30000);
