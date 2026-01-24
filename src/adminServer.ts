// TutorAI Admin Server
// Separate server for admin panel (Docker multi-container setup)

import express from 'express';
import path from 'path';
import session from 'express-session';
import { config } from './config';
import { logger } from './utils/logger';
import adminRoutes from './routes/admin';

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static files - serve at both root and basePath for Docker compatibility
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(config.basePath, express.static(path.join(__dirname, '..', 'public')));

// Session configuration (memory store for simplicity)
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Make basePath available to all views
app.use((req, res, next) => {
  res.locals.basePath = config.basePath;
  next();
});

// Admin routes
app.use('/admin', adminRoutes);
app.use(`${config.basePath}/admin`, adminRoutes);

// Health check endpoint for Docker
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Redirect root to admin with token
app.get('/', (req, res) => {
  const adminPath = config.basePath ? `${config.basePath}/admin` : '/admin';
  res.redirect(`${adminPath}?token=${config.adminToken}`);
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('errors/404', {
    basePath: config.basePath,
    title: 'Page Not Found'
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Admin server error:', err);
  res.status(500).render('errors/500', {
    basePath: config.basePath,
    title: 'Server Error'
  });
});

// Start server
const PORT = process.env.ADMIN_PORT || 3001;

app.listen(PORT, () => {
  logger.info(`TutorAI Admin Server running on port ${PORT}`);
});

export default app;
