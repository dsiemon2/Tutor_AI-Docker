# Agent Implementation - Tutor AI

## Project Overview

**Type**: Training & Education Platform
**Purpose**: Multi-tenant K-12 AI tutoring platform with voice and text learning

## Tech Stack

```
Backend:     Node.js + Express + TypeScript
Database:    SQLite + Prisma ORM
Sessions:    Redis
Voice:       OpenAI Realtime API
Frontend:    EJS templates + Bootstrap 5
Math:        KaTeX rendering
Diagrams:    Mermaid.js
Charts:      Chart.js
Logging:     Winston with daily rotation
Container:   Docker + Docker Compose
Port:        8091
Base Path:   /TutorAI/
```

## Key Components

- `src/routes/admin.ts` - Admin panel with curriculum management
- `src/services/` - Learning services
- `prisma/schema.prisma` - Multi-tenant schema (School > User)
- Curriculum: 74 subjects, 166 topics, 6 categories

## RBAC Roles
- SUPER_ADMIN
- SCHOOL_ADMIN
- TEACHER
- STUDENT

---

## Recommended Agents

### MUST IMPLEMENT (Priority 1)

| Agent | File | Use Case |
|-------|------|----------|
| **Backend Architect** | engineering/backend-architect.md | Multi-tenant architecture, learning session management |
| **DevOps Automator** | engineering/devops-automator.md | Docker, Redis session management |
| **AI Engineer** | engineering/ai-engineer.md | OpenAI integration, adaptive learning logic |
| **Database Admin** | data/database-admin.md | SQLite optimization, curriculum data, progress tracking |
| **Security Auditor** | security/security-auditor.md | Multi-tenant isolation, student data protection (COPPA/FERPA) |
| **Bug Debugger** | quality/bug-debugger.md | Learning session issues, progress tracking bugs |

### SHOULD IMPLEMENT (Priority 2)

| Agent | File | Use Case |
|-------|------|----------|
| **Frontend Developer** | engineering/frontend-developer.md | KaTeX, Mermaid, Chart.js integration |
| **API Tester** | testing/api-tester.md | Learning API validation, progress endpoints |
| **Code Reviewer** | quality/code-reviewer.md | TypeScript patterns, accessibility |
| **UI Designer** | design/ui-designer.md | Learning interfaces, accessibility (dyslexia font, high contrast) |
| **UX Researcher** | design/ux-researcher.md | Learning experience optimization, K-12 usability |
| **Content Creator** | marketing/content-creator.md | Educational content, curriculum descriptions |

### COULD IMPLEMENT (Priority 3)

| Agent | File | Use Case |
|-------|------|----------|
| **Performance Benchmarker** | testing/performance-benchmarker.md | Learning session performance |
| **Analytics Reporter** | studio-operations/analytics-reporter.md | Learning analytics, progress reports |
| **Trend Researcher** | product/trend-researcher.md | Educational trends, curriculum updates |
| **Feedback Synthesizer** | product/feedback-synthesizer.md | Student/teacher feedback analysis |

---

## Agent Prompts Tailored for This Project

### Backend Architect Prompt Addition
```
Project Context:
- Multi-tenant K-12 tutoring platform (School > User hierarchy)
- 74 subjects, 166 topics across 6 categories
- Voice and text learning modes
- Mastery levels and progress tracking
- Adaptive learning via logic rules
- 24 language support
```

### AI Engineer Prompt Addition
```
Project Context:
- OpenAI API for tutoring conversations
- Adaptive learning: adjusts difficulty based on mastery
- Visual rendering: KaTeX (math), Mermaid (diagrams), Chart.js (graphs)
- Voice mode with OpenAI Realtime API
- Knowledge base for educational content
```

### Security Auditor Prompt Addition
```
Project Context:
- Student data protection (COPPA/FERPA considerations)
- Multi-tenant isolation (school data separation)
- Role-based access control (4 roles)
- Session security with Redis
- Age-appropriate content filtering
```

### UX Researcher Prompt Addition
```
Project Context:
- K-12 audience (ages 5-18)
- Accessibility features: high contrast, dyslexia font, text size
- Learning experience optimization
- Engagement and retention metrics
```

---

## Marketing & Growth Agents (When Production Ready)

Add these when the project is ready for public release/marketing:

### Social Media & Marketing

| Agent | File | Use Case |
|-------|------|----------|
| **TikTok Strategist** | marketing/tiktok-strategist.md | Educational content, study tips, parent testimonials |
| **Instagram Curator** | marketing/instagram-curator.md | Student success stories, learning tips |
| **Twitter/X Engager** | marketing/twitter-engager.md | EdTech community engagement |
| **Reddit Community Builder** | marketing/reddit-community-builder.md | r/education, r/homeschool communities |
| **Content Creator** | marketing/content-creator.md | Educational content, blog posts, email campaigns |
| **SEO Optimizer** | marketing/seo-optimizer.md | Educational keywords, parent search terms |
| **Visual Storyteller** | design/visual-storyteller.md | Student learning imagery, diagrams |

### Growth & Analytics

| Agent | File | Use Case |
|-------|------|----------|
| **Growth Hacker** | marketing/growth-hacker.md | School acquisition, student retention |
| **Trend Researcher** | product/trend-researcher.md | EdTech trends, curriculum changes |
| **Finance Tracker** | studio-operations/finance-tracker.md | School subscription revenue, per-student metrics |
| **Analytics Reporter** | studio-operations/analytics-reporter.md | Learning outcomes, engagement metrics |

---

## Not Recommended for This Project

| Agent | Reason |
|-------|--------|
| Mobile App Builder | Web-based platform |
| Whimsy Injector | Educational context requires focus |

---

## Implementation Commands

```bash
# Invoke agents from project root
claude --agent engineering/backend-architect
claude --agent engineering/ai-engineer
claude --agent data/database-admin
claude --agent security/security-auditor
claude --agent design/ux-researcher
claude --agent quality/bug-debugger
```
