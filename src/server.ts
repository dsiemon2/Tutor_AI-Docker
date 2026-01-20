// TutorAI Main Server
// Express application entry point

import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import { config } from './config';
import { prisma } from './config/database';
import { logger } from './utils/logger';

// Import routes
import publicRoutes from './routes/public';
import authRoutes from './routes/auth';
import studentRoutes from './routes/student';
import teacherRoutes from './routes/teacher';
import apiRoutes from './routes/api';
import adminRoutes from './routes/admin';
import schoolAdminRoutes from './routes/schooladmin';

// Import WebSocket handler
import { setupWebSocket } from './realtime/tutorHandler';

const app = express();
const server = createServer(app);

// ============================================
// MIDDLEWARE
// ============================================

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing
app.use(cookieParser());

// Session configuration (memory store for simplicity)
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  name: 'tutorai.sid',
  cookie: {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'lax',
    maxAge: config.sessionMaxAge
  }
}));

// Static files - serve at both root and basePath for Docker compatibility
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(config.basePath, express.static(path.join(__dirname, '..', 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Add basePath to all responses
app.use((req, res, next) => {
  res.locals.basePath = config.basePath;
  res.locals.currentPath = req.path;
  next();
});

// ============================================
// ROUTES (mounted at both root and basePath for Docker)
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});
app.get(`${config.basePath}/health`, (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes (landing, pricing, etc.)
app.use('/', publicRoutes);
app.use(config.basePath, publicRoutes);

// Auth routes (login, register, OAuth)
app.use('/auth', authRoutes);
app.use(`${config.basePath}/auth`, authRoutes);

// Student routes
app.use('/student', studentRoutes);
app.use(`${config.basePath}/student`, studentRoutes);

// Teacher routes
app.use('/teacher', teacherRoutes);
app.use(`${config.basePath}/teacher`, teacherRoutes);

// API routes
app.use('/api', apiRoutes);
app.use(`${config.basePath}/api`, apiRoutes);

// Admin routes (for direct access without separate admin server)
app.use('/admin', adminRoutes);
app.use(`${config.basePath}/admin`, adminRoutes);

// School Admin routes
app.use('/schooladmin', schoolAdminRoutes);
app.use(`${config.basePath}/schooladmin`, schoolAdminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('errors/404', {
    basePath: config.basePath,
    title: 'Page Not Found'
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).render('errors/500', {
    basePath: config.basePath,
    title: 'Server Error',
    error: config.env === 'development' ? err.message : 'Something went wrong'
  });
});

// ============================================
// WEBSOCKET SERVER
// ============================================

const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket upgrade (supports both with and without basePath for Docker)
server.on('upgrade', (request, socket, head) => {
  const pathname = request.url || '';

  if (pathname.startsWith(`${config.basePath}/ws/tutor`) || pathname.startsWith('/ws/tutor')) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Setup WebSocket handler
setupWebSocket(wss);

// ============================================
// SERVER STARTUP
// ============================================

async function startServer() {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info('Database connected');

    // Start server
    server.listen(config.port, () => {
      logger.info(`TutorAI server running on port ${config.port}`);
      logger.info(`Base path: ${config.basePath}`);
      logger.info(`Environment: ${config.env}`);
      logger.info(`URL: http://localhost:${config.port}${config.basePath}/`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown() {
  logger.info('Shutting down...');

  server.close(() => {
    logger.info('HTTP server closed');
  });

  wss.close(() => {
    logger.info('WebSocket server closed');
  });

  await prisma.$disconnect();
  logger.info('Database disconnected');

  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the server
startServer();

export { app, server, wss };
