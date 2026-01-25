# TutorAI - Project Reference

**Type:** AI Tutoring Platform
**Port:** 8091
**URL Prefix:** /TutorAI/
**Status:** Active (Development)
**Live URL:** https://www.tutorableai.com
**Last Updated:** 2026-01-24

---

## Quick Access URLs

| Type | URL |
|------|-----|
| Landing | http://localhost:8091/TutorAI/ |
| Student | http://localhost:8091/TutorAI/student |
| Teacher | http://localhost:8091/TutorAI/teacher |
| Dept Head | http://localhost:8091/TutorAI/depthead |
| Vice Principal | http://localhost:8091/TutorAI/vp |
| Principal | http://localhost:8091/TutorAI/principal |
| District Admin | http://localhost:8091/TutorAI/district |
| School Admin | http://localhost:8091/TutorAI/schooladmin |
| Super Admin | http://localhost:8091/TutorAI/admin?token=admin |
| Parent | http://localhost:8091/TutorAI/parent |
| Login | http://localhost:8091/TutorAI/auth/login |

---

## Project Overview

TutorAI is a multi-tenant K-12 AI tutoring platform that provides personalized learning experiences for students.

### Key Features

- **Multi-tenant Architecture**: School > User hierarchy
- **K-12 Curriculum**: 74 subjects, 166 topics across 6 categories
- **Voice & Text Modes**: OpenAI Realtime API integration
- **Visual Rendering**: KaTeX (math), Mermaid (diagrams), Chart.js (graphs)
- **Progress Tracking**: Session-based learning with mastery levels
- **Practice Mode**: SM-2 spaced repetition algorithm for drill sessions
- **Learning Paths**: Structured paths with prerequisites and progress tracking
- **Mastery Dashboard**: Six-level mastery system (novice to master)
- **Knowledge Base**: Educational content documents
- **Adaptive Learning**: Logic rules for personalized responses
- **Accessibility**: High contrast, dyslexia font, text size options
- **24 Languages**: Full multilingual support
- **Unit Testing**: 745+ Jest tests with comprehensive coverage

---

## Subject Categories

| Category | Subjects | Topics |
|----------|----------|--------|
| Mathematics | 14 (K-12) | Counting through AP Calculus |
| Science | 12 (K-12) | Elementary Science through AP Physics |
| English Language Arts | 15 (K-12) | Phonics through AP Literature |
| History & Social Studies | 14 (K-12) | Community Helpers through AP History |
| World Languages | 7 | Spanish, French, Chinese, Latin |
| Computer Science | 6 | Intro CS through AP Computer Science |

---

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (Prisma ORM)
- **Sessions**: Redis
- **Frontend**: EJS templates + Bootstrap 5
- **Voice**: OpenAI Realtime API
- **Math Rendering**: KaTeX
- **Diagrams**: Mermaid.js
- **Charts**: Chart.js
- **Containerization**: Docker + Docker Compose + Nginx

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@tutorai.com | demo1234 |
| School Admin | principal@lincolnhs.edu | demo1234 |
| Teacher | sjohnson@lincolnhs.edu | demo1234 |
| Student | emma.wilson@student.lincolnhs.edu | demo1234 |

---

## Project Structure

```
Tutor_AI/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Demo data seeding
├── src/
│   ├── __tests__/         # Jest unit tests (745+ tests)
│   ├── config/            # Database, Redis, constants
│   ├── middleware/        # Auth, RBAC, error handling
│   ├── routes/            # Express routes
│   ├── services/          # Business logic services
│   │   ├── payments/      # Payment gateway integrations
│   │   ├── practice.service.ts    # SM-2 spaced repetition
│   │   └── learningPath.service.ts # Learning paths & mastery
│   └── server.ts          # Main entry point
├── views/
│   ├── admin/             # Admin panel pages
│   ├── auth/              # Login, register
│   ├── public/            # Landing, features
│   ├── student/           # Student dashboard, tutoring
│   └── teacher/           # Teacher dashboard
└── public/                # Static assets
```

---

## Database Schema

### Core Models

- **School**: Multi-tenant root (name, address, subscription)
- **User**: Users with roles (SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT)
- **Class**: Classes within schools
- **ClassStudent/ClassTeacher**: Enrollment relationships

### Curriculum Models

- **SubjectCategory**: Math, Science, ELA, History, Languages, CS
- **Subject**: Individual subjects within categories
- **Topic**: Topics within subjects with grade levels

### Session Models

- **TutoringSession**: Student tutoring records
- **SessionMessage**: Chat history with visual aids
- **StudentProgress**: Mastery tracking per topic

### Config Models

- **AIConfig**: Model settings, voice, temperature
- **Language**: 24 languages (all enabled)
- **Branding**: Colors, logo, fonts
- **Greeting**: Welcome messages
- **KnowledgeDocument**: Educational content
- **LogicRule**: Adaptive learning rules
- **AIFunction**: AI tool definitions

---

## Commands

### Docker (Recommended)
```bash
# Copy environment file and add your OPENAI_API_KEY
cp .env.docker .env

# Build and start all containers
docker compose up -d --build

# View logs
docker compose logs -f

# Stop all containers
docker compose down

# Rebuild after code changes
docker compose build --no-cache && docker compose up -d
```

### Local Development (without Docker)
```bash
# Install dependencies
npm install

# Start dev server (requires local Redis)
npm run dev
```

### Database Operations
```bash
# Push schema changes
npx prisma db push

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

### Build for Production
```bash
npm run build
npm start
```

---

## Admin Panel Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | /admin | Overview & stats |
| Sessions | /admin/sessions | Tutoring sessions |
| Analytics | /admin/analytics | Usage metrics |
| Schools | /admin/schools | School management |
| Users | /admin/users | User management |
| Subjects | /admin/subjects | Subjects & topics |
| Knowledge Base | /admin/knowledge-base | KB documents |
| AI Config | /admin/ai-config | AI settings |
| Voices | /admin/voices | Voice & languages |
| Greeting | /admin/greeting | Welcome messages |
| Logic Rules | /admin/logic-rules | Adaptive rules |
| Functions | /admin/functions | AI functions |
| Settings | /admin/settings | Platform settings |

---

## RBAC Hierarchy

```
SUPER_ADMIN (100)      - Platform owner, all schools, view any student
├── DISTRICT_ADMIN (90) - District management, all schools in district
│   └── PRINCIPAL (85)  - School management, all students in school
│       └── VICE_PRINCIPAL (75) - School operations, student oversight
│           └── DEPARTMENT_HEAD (65) - Department curriculum, teacher support
│               └── TEACHER (60)  - Class management, own students only
│                   └── STUDENT (40) - Use tutoring, view own progress
```

### View-As-Student Feature
Admins and teachers can view the student portal as any student they have access to:
- **Super Admin**: Can view as any student
- **District Admin**: Can view students in their district
- **Principal/VP/Dept Head**: Can view students in their school
- **Teacher**: Can view students in their classes

Access via dropdown in student portal navbar when logged in as admin/teacher.

---

## Environment Variables

### Docker (.env file)
```bash
# Required
OPENAI_API_KEY=sk-your-openai-api-key

# Admin access
ADMIN_TOKEN=admin

# Security (change for production)
SESSION_SECRET=change-me-in-production
```

### Local Development
```bash
# Server
PORT=8091
BASE_PATH=/TutorAI
NODE_ENV=development

# Database (SQLite for local dev)
DATABASE_URL=file:./dev.db

# Redis
REDIS_URL=redis://localhost:6379

# Auth
SESSION_SECRET=your-session-secret
ADMIN_TOKEN=admin

# OpenAI
OPENAI_API_KEY=your-openai-key
```

---

## Student Portal Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | /student | Student home with quick stats |
| Subjects | /student/subjects | Browse subjects by category |
| Tutor | /student/tutor | AI tutoring chat interface |
| Practice | /student/practice | Spaced repetition drill sessions |
| Learning Paths | /student/learning-paths | Structured learning paths |
| Mastery | /student/mastery | Mastery dashboard with skill levels |
| Assignments | /student/assignments | View and submit assignments |
| Quizzes | /student/quizzes | Take quizzes, view results |
| Sessions | /student/sessions | Tutoring session history |
| Progress | /student/progress | Learning progress by subject |
| Settings | /student/settings | User preferences |

---

## Sample Data (Seed)

The seed creates comprehensive demo data:

| Data Type | Count | Description |
|-----------|-------|-------------|
| Schools | 5 | Lincoln HS, Elementary, Preschool, Middle, Vo-Tech |
| Users | 26+ | Students across all grade levels |
| Classes | 19 | From Pre-K Colors to Culinary Arts |
| Lessons | 774 | Across all subjects and topics |
| Assignments | 40+ | Homework, projects, essays |
| Quizzes | 25 | With questions and answer options |
| Sessions | 136 | Tutoring session records |
| Progress | 16 | Student mastery tracking |

### Grade Levels Supported
- Pre-K 3 (grade -2)
- Pre-K 4 (grade -1)
- Kindergarten (grade 0)
- Grades 1-12

---

## Notes

- Uses "Schools" instead of "Companies" for multi-tenancy
- **Docker deployment available** - uses SQLite + Redis + Nginx
- All 24 languages enabled by default
- Sky blue color theme (#0ea5e9)
- **Sessions are lost on container restart** (MemoryStore) - must re-login after rebuild

---

## Agent Capabilities

When working on this project, apply these specialized behaviors:

### Backend Architect
- Design routes for multi-tenant School > User hierarchy
- Implement session management with Redis
- Structure curriculum routes (categories, subjects, topics)
- Handle tutoring session state and progress tracking

### AI Engineer
- Design adaptive AI tutor that adjusts to student level
- Implement voice tutoring via OpenAI Realtime API
- Create encouraging, patient tutoring persona
- Handle visual rendering triggers (math, diagrams, charts)

### Database Admin
- Prisma schema for curriculum (74 subjects, 166 topics, 6 categories)
- Track StudentProgress with mastery levels
- Store TutoringSession and SessionMessage history
- Handle KnowledgeDocument for educational content

### Security Auditor
- Protect student data (FERPA/COPPA considerations)
- Implement proper RBAC (SUPER_ADMIN > SCHOOL_ADMIN > TEACHER > STUDENT)
- Secure session handling with Redis
- Review school-level data isolation

### Content Creator
- Write educational content for K-12 curriculum
- Create encouraging feedback messages
- Design adaptive learning logic rules
- Structure knowledge base documents

### Frontend Developer
- Implement KaTeX for math rendering
- Integrate Mermaid.js for diagrams
- Use Chart.js for progress visualization
- Build accessible interfaces (high contrast, dyslexia fonts)

### UX Researcher
- Design for K-12 students (varying ages and abilities)
- Implement accessibility options (text size, contrast, fonts)
- Create engaging learning interfaces
- Test with student-appropriate language

## Payment Gateways

All 5 payment gateways are fully integrated:

| Gateway | Status | Location |
|---------|--------|----------|
| **Stripe** | Full integration | `src/services/payments/stripe.service.ts` |
| **PayPal** | Full integration | `src/services/payments/paypal.service.ts` |
| **Braintree** | Full integration | `src/services/payments/braintree.service.ts` |
| **Square** | Full integration | `src/services/payments/square.service.ts` |
| **Authorize.net** | Full integration | `src/services/payments/authorize.service.ts` |

### Payment Services Location
```
src/services/payments/
├── stripe.service.ts       # Stripe payment processing
├── paypal.service.ts       # PayPal order management
├── braintree.service.ts    # Braintree transactions
├── square.service.ts       # Square payment processing
├── authorize.service.ts    # Authorize.net processing
├── payment.service.ts      # Unified payment orchestrator
└── index.ts                # Service exports
```

## Learning Services

### Practice Mode (SM-2 Spaced Repetition)
Location: `src/services/practice.service.ts`

Features:
- **SM-2 Algorithm**: Industry-standard spaced repetition for optimal retention
- **Quality Ratings**: 0-5 scale for answer accuracy
- **Ease Factor**: Dynamic difficulty adjustment (1.3-2.5 range)
- **Interval Calculation**: Automatic scheduling based on performance
- **Fuzzy Matching**: Levenshtein distance for answer validation

### Learning Paths & Mastery
Location: `src/services/learningPath.service.ts`

Features:
- **Mastery Levels**: 6 levels (novice, beginner, intermediate, proficient, expert, master)
- **Score Thresholds**: 0%, 20%, 40%, 60%, 80%, 95%
- **Path Progress**: Track completion with prerequisites
- **Recommendations**: AI-powered path suggestions based on performance
- **Node Dependencies**: Prerequisite-based topic unlocking

## Unit Testing

Framework: Jest with ts-jest

| Test Suite | Tests | Description |
|------------|-------|-------------|
| Practice Service | 75 | SM-2 algorithm, answer checking, scoring |
| Learning Path Service | 71 | Mastery calculation, path progress, recommendations |
| Accessibility | 50+ | WCAG compliance, color contrast, keyboard navigation |
| Authentication | 100+ | Login, RBAC, session management |
| Payment Services | 100+ | All 5 gateway integrations |

**Total: 851 unit tests**

Run tests:
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Logging

Comprehensive Winston logging with daily rotation:

```
src/utils/logger.ts
```

### Features
- **Console Output**: Colorized logs in all environments
- **File Rotation**: Daily log files in production
- **Error Logs**: Separate error-level log files (`error-%DATE%.log`)
- **Combined Logs**: All levels in combined files (`combined-%DATE%.log`)
- **HTTP Logging**: Morgan stream integration for request logging
- **Stack Traces**: Full stack traces for errors
- **Retention**: 14 days, 20MB max per file

### Log Levels
- `error` - Error conditions
- `warn` - Warning conditions
- `info` - Informational messages
- `http` - HTTP request logging
- `debug` - Debug information

### Usage
```typescript
import logger from '../utils/logger';

logger.info('Server started on port 8091');
logger.error('Database connection failed', { error: err.message });
logger.debug({ userId, action }, 'User action logged');
```

---

## Docker Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Nginx (port 8091)                        │
│                    Reverse Proxy                            │
│         /TutorAI/admin/* → admin:3001                       │
│         /TutorAI/* → app:3000                               │
└──────────────┬────────────────────────────┬─────────────────┘
               │                            │
    ┌──────────▼──────────┐     ┌──────────▼──────────┐
    │   App Container     │     │  Admin Container    │
    │   (port 3000)       │     │   (port 3001)       │
    └──────────┬──────────┘     └──────────┬──────────┘
               │                            │
    ┌──────────▼────────────────────────────▼─────────┐
    │                                                 │
    │  ┌─────────────┐         ┌─────────────┐       │
    │  │   SQLite    │         │   Redis     │       │
    │  │ (shared vol)│         │ (sessions)  │       │
    │  └─────────────┘         └─────────────┘       │
    │                                                 │
    └─────────────────────────────────────────────────┘
```
