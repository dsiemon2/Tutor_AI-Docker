// TutorAI Configuration
// Central configuration module

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  adminPort: parseInt(process.env.ADMIN_PORT || '3001', 10),
  basePath: process.env.BASE_PATH || '/TutorAI',

  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tutorai',

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // Session
  sessionSecret: process.env.SESSION_SECRET || 'change-this-secret-in-production',
  sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10), // 24 hours

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'change-this-jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // Admin
  adminToken: process.env.ADMIN_TOKEN || 'admin',

  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4',

  // OAuth - Google
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || '',

  // OAuth - Microsoft
  microsoftClientId: process.env.MICROSOFT_CLIENT_ID || '',
  microsoftClientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
  microsoftCallbackUrl: process.env.MICROSOFT_CALLBACK_URL || '',

  // File Upload
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logDir: process.env.LOG_DIR || './logs',

  // Feature flags
  features: {
    voice: true,
    fileUpload: true,
    imageAnalysis: true,
    oauth: {
      google: !!process.env.GOOGLE_CLIENT_ID,
      microsoft: !!process.env.MICROSOFT_CLIENT_ID
    }
  }
} as const;

export type Config = typeof config;

export default config;
