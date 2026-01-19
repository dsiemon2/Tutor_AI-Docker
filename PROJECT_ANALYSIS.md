# TutorAI Project Analysis

**Analysis Date:** January 19, 2026
**Purpose:** Compare current implementation against requirements

---

## Summary

| Category | Status |
|----------|--------|
| **Roles & Hierarchy** | Partial - Missing 3 roles |
| **School Types** | Missing - No categorization |
| **Classrooms/Classes** | Exists - Needs enhancement |
| **Grade-Level Segregation** | Exists - Well implemented |
| **Lessons System** | Exists - Needs content population |
| **AI Integration** | Exists - Functional |

---

## 1. USER ROLES & HIERARCHY

### What EXISTS

| Role | Level | Description |
|------|-------|-------------|
| SUPER_ADMIN | 100 | Platform owner, all schools |
| SCHOOL_ADMIN | 80 | School management (used as Principal) |
| TEACHER | 60 | Class & student management |
| STUDENT | 40 | Learning & progress tracking |

**Location:** `src/config/constants.ts` (lines 5-22), `prisma/schema.prisma` (line 62)

### What DOESN'T EXIST

| Required Role | Status | Notes |
|---------------|--------|-------|
| **District Admin** | MISSING | No district entity exists |
| **Principal** | PARTIAL | Uses SCHOOL_ADMIN (no distinction) |
| **Vice Principal** | MISSING | Not implemented |

### What SHOULD Exist

```
DISTRICT_ADMIN (90)     - Oversees multiple schools in district
├── PRINCIPAL (85)      - School-level leadership
│   └── VICE_PRINCIPAL (75) - Assistant principal duties
│       └── TEACHER (60)    - Classroom instruction
│           └── STUDENT (40) - Learning
```

**Recommendation:** Add these roles to `UserRole` enum in schema.prisma and constants.ts

### What SHOULDN'T Exist

- Current 4-role system is good but incomplete
- SCHOOL_ADMIN being used as Principal is a workaround, not a solution

---

## 2. SCHOOL TYPES

### What EXISTS

5 demo schools created in seed data:
- Lincoln High School (9-12)
- Washington Middle School (6-8)
- Jefferson Elementary (K-5)
- STEM Academy (9-12)
- Riverside Preparatory Academy (6-12)

**Location:** `prisma/seed.ts` (lines 18-92)

### What DOESN'T EXIST

| Required Type | Status |
|---------------|--------|
| **Preschool** | MISSING |
| **Kindergarten** | PARTIAL (combined with Elementary K-5) |
| **Elementary** | EXISTS (as school, not type) |
| **Middle School** | EXISTS (as school, not type) |
| **High School** | EXISTS (as school, not type) |
| **Vo-Tech** | MISSING |

**Critical Issue:** No `schoolType` field in School model

### What SHOULD Exist

Add to `prisma/schema.prisma`:

```prisma
enum SchoolType {
  PRESCHOOL
  KINDERGARTEN
  ELEMENTARY
  MIDDLE_SCHOOL
  HIGH_SCHOOL
  VOCATIONAL_TECH
  CHARTER
  MAGNET
}

model School {
  // ... existing fields
  schoolType    SchoolType
  gradeRange    String?    // "PK-K", "K-5", "6-8", "9-12"
}
```

### What SHOULDN'T Exist

- `gradeRange` as freeform string is weak - should be structured

---

## 3. TEACHER ASSIGNMENTS

### What EXISTS

- `ClassTeacher` model for many-to-many relationship
- `isPrimary` flag for primary teacher designation
- Teachers can be assigned to multiple classes

**Location:** `prisma/schema.prisma` (lines 135-146)

```prisma
model ClassTeacher {
  id        String   @id @default(cuid())
  classId   String
  teacherId String
  isPrimary Boolean  @default(false)
  // ... relationships
}
```

### What DOESN'T EXIST

| Requirement | Status |
|-------------|--------|
| 1-2 teachers per classroom enforcement | NOT ENFORCED |
| Teacher specialty/certification tracking | MISSING |
| Department assignment | MISSING |

### What SHOULD Exist

- Add validation to ensure 1-2 teachers per class
- Add teacher certification/specialty fields
- Add department grouping for teachers

```prisma
model Teacher {
  // Add to User or create separate
  certifications  String[]    // ["Math", "Science"]
  department      String?     // "Math Department"
  maxClasses      Int @default(6)
}
```

### What SHOULDN'T Exist

- Current flexible assignment is good, just needs constraints

---

## 4. CLASSROOMS & CLASSES

### What EXISTS

Full class management system:

```prisma
model Class {
  id           String
  name         String
  schoolId     String        // Multi-tenant
  subjectId    String?       // Links to subject
  gradeLevel   Int?          // Grade for this class
  academicYear String?
  students     ClassStudent[]
  teachers     ClassTeacher[]
  lessons      Lesson[]
  assignments  Assignment[]
  quizzes      Quiz[]
}
```

**Location:** `prisma/schema.prisma` (lines 96-118)

### What DOESN'T EXIST

| Feature | Status |
|---------|--------|
| Class periods/scheduling | MISSING |
| Room numbers | MISSING |
| Class capacity limits | MISSING |
| Prerequisites | MISSING |

### What SHOULD Exist

```prisma
model Class {
  // ... existing
  roomNumber    String?
  period        Int?          // 1-8 for class periods
  maxCapacity   Int @default(30)
  prerequisites String[]      // Required class IDs
}
```

### What SHOULDN'T Exist

- Current structure is good, needs enhancement not replacement

---

## 5. SUBJECTS BY GRADE LEVEL

### What EXISTS - WELL IMPLEMENTED

**6 Subject Categories:**
- Mathematics (14 subjects)
- Science (14 subjects)
- English Language Arts (15 subjects)
- History & Social Studies (14 subjects)
- World Languages (7 subjects)
- Computer Science (6 subjects)

**Total: 74 Subjects, 166+ Topics**

**Location:** `src/config/constants.ts`, `prisma/seed.ts`

### Grade-Level Organization (EXISTS)

| Grade Range | Subject Examples |
|-------------|------------------|
| K-2 | Basic Math, Kindergarten ELA, General Science |
| 3-5 | 3rd-5th Grade Math/ELA/Science/Social Studies |
| 6-8 | Pre-Algebra, Earth Science, English 6-8 |
| 9-12 | Algebra I/II, Biology, US History |
| AP | AP Calculus, AP Biology, AP US History |

### Grade Segregation (EXISTS)

Each topic has a `gradeLevel` field:

```prisma
model Topic {
  gradeLevel   Int?      // K=0, 1-12
  difficulty   Int       // 1-5 scale
}
```

**Example from seed:**
- "Linear Equations" → Grade 8-9, Algebra I
- "Cell Structure" → Grade 9-10, Biology
- "Phonics" → Grade K-1, Kindergarten ELA

### What DOESN'T EXIST

| Feature | Status |
|---------|--------|
| Vo-Tech subjects | MISSING |
| Trade curriculum (Welding, Auto, etc.) | MISSING |
| Preschool-specific subjects | MISSING |

### What SHOULD Exist

Add Vocational-Technical subjects:

```javascript
// Add to SUBJECT_CATEGORIES
{
  code: 'vocational',
  name: 'Vocational & Technical',
  icon: '🔧',
  color: '#64748b',
  subjects: [
    'auto_mechanics',
    'welding',
    'carpentry',
    'electrical',
    'plumbing',
    'culinary_arts',
    'cosmetology',
    'healthcare',
    'hvac'
  ]
}
```

Add Preschool subjects:

```javascript
{
  code: 'early_childhood',
  name: 'Early Childhood',
  icon: '🧒',
  subjects: [
    'colors_shapes',
    'letters_abc',
    'numbers_counting',
    'social_skills',
    'motor_skills'
  ]
}
```

### What SHOULDN'T Exist

- Grade mixing in topic display - Current implementation properly filters by grade
- The grade-level filtering is correctly implemented

---

## 6. LESSONS SYSTEM

### What EXISTS

Full lesson management:

```prisma
model Lesson {
  id          String
  code        String @unique
  title       String
  description String?
  content     String?      // Rich text/markdown
  topicId     String       // Required - links to curriculum
  classId     String?      // Optional - class assignment
  gradeLevel  Int?
  duration    Int?         // Minutes
  createdById String       // Teacher who created
  assignments Assignment[]
  order       Int @default(0)
  isActive    Boolean @default(true)
}
```

**Location:** `prisma/schema.prisma` (lines 417-441)

### Teacher Routes for Lessons (EXISTS)

From `src/routes/teacher.ts`:
- `GET /teacher/lessons` - List lessons
- `GET /teacher/lessons/create` - Create form
- `POST /teacher/lessons` - Create lesson
- `GET /teacher/lessons/:id` - View lesson
- `GET /teacher/lessons/:id/edit` - Edit form
- `PUT /teacher/lessons/:id` - Update lesson
- `DELETE /teacher/lessons/:id` - Delete lesson

### What DOESN'T EXIST

| Feature | Status |
|---------|--------|
| **Pre-populated lessons** | MISSING - No seed data |
| **Lesson templates** | MISSING |
| **Lesson library/marketplace** | MISSING |
| **AI-generated lesson content** | MISSING |
| **Lesson standards alignment** | MISSING |

### What SHOULD Exist

**CRITICAL: Lessons need to be seeded with content for each topic.**

Example structure needed:

```javascript
// For each of the 166+ topics, create lessons:
{
  topicCode: 'linear_equations',
  lessons: [
    {
      title: 'Introduction to Linear Equations',
      content: '# What is a Linear Equation?\n\nA linear equation...',
      duration: 45,
      order: 1
    },
    {
      title: 'Solving One-Step Equations',
      content: '# Solving One-Step Equations\n\n...',
      duration: 45,
      order: 2
    },
    // ... more lessons
  ]
}
```

**Estimated Content Needed:**
- 166 topics × 3-5 lessons each = **500-830 lessons**

### What SHOULDN'T Exist

- Empty lesson system (current state)
- Lessons without topic linkage

---

## 7. AI INTEGRATION

### What EXISTS

**AI Configuration:**
```prisma
model AIConfig {
  model           String @default("gpt-4")
  voice           String @default("alloy")
  temperature     Float  @default(0.7)
  realtimeEnabled Boolean @default(true)
  systemPrompt    String?
}
```

**Knowledge Documents:**
```prisma
model KnowledgeDocument {
  id        String
  title     String
  content   String
  category  String
  tags      String?
  isActive  Boolean @default(true)
}
```

**Logic Rules (Adaptive Learning):**
```prisma
model LogicRule {
  id          String
  name        String
  description String?
  condition   String     // JSON condition
  action      String     // JSON action
  priority    Int @default(0)
  isActive    Boolean @default(true)
}
```

**Location:** `prisma/schema.prisma` (lines 248-326)

### What DOESN'T EXIST

| Feature | Status |
|---------|--------|
| Lessons → AI context feeding | NOT CONNECTED |
| Topic-specific AI prompts | MISSING |
| Lesson-based tutoring sessions | NOT IMPLEMENTED |

### What SHOULD Exist

Connect lessons to AI tutoring:

```javascript
// When student starts tutoring session:
1. Load student's current topic
2. Fetch lessons for that topic
3. Include lesson content in AI system prompt
4. AI tutors based on lesson material
```

```prisma
model TutoringSession {
  // ... existing
  lessonId    String?     // Add lesson context
  lesson      Lesson?     @relation(...)
}
```

### What SHOULDN'T Exist

- AI tutoring without curriculum context (partially current state)

---

## 8. DETAILED GAP ANALYSIS

### MUST IMPLEMENT (Critical)

| # | Feature | Priority | Effort |
|---|---------|----------|--------|
| 1 | Add District entity & District Admin role | HIGH | Medium |
| 2 | Add Principal & Vice Principal roles | HIGH | Low |
| 3 | Add School Type field | HIGH | Low |
| 4 | Create Vo-Tech subject category | HIGH | Medium |
| 5 | Create Preschool subject category | HIGH | Medium |
| 6 | **Seed lessons for all 166+ topics** | CRITICAL | High |
| 7 | Connect lessons to AI tutoring context | HIGH | Medium |

### SHOULD IMPLEMENT (Important)

| # | Feature | Priority | Effort |
|---|---------|----------|--------|
| 8 | Teacher certification tracking | MEDIUM | Low |
| 9 | Class period/scheduling | MEDIUM | Medium |
| 10 | Lesson templates | MEDIUM | Medium |
| 11 | Standards alignment (Common Core) | MEDIUM | High |

### NICE TO HAVE (Enhancement)

| # | Feature | Priority | Effort |
|---|---------|----------|--------|
| 12 | Lesson marketplace | LOW | High |
| 13 | AI lesson generation | LOW | High |
| 14 | Parent portal | LOW | High |

---

## 9. CURRENT VS REQUIRED STRUCTURE

### Current Hierarchy
```
Platform (TutorAI)
└── School (5 demo schools)
    ├── SCHOOL_ADMIN (acts as Principal)
    ├── TEACHER
    │   ├── Class
    │   │   ├── Subject → Topics
    │   │   ├── Lessons (empty)
    │   │   ├── Assignments
    │   │   └── Quizzes
    │   └── Students
    └── STUDENT
```

### Required Hierarchy
```
Platform (TutorAI)
└── District (NEW)
    ├── DISTRICT_ADMIN (NEW)
    └── School (with type: Preschool/Elem/Middle/High/Vo-Tech)
        ├── PRINCIPAL (NEW - distinct from School Admin)
        ├── VICE_PRINCIPAL (NEW)
        ├── Department (NEW)
        │   └── TEACHER (1-2 per class, certified)
        │       ├── Class (by grade, subject, period)
        │       │   ├── Subject → Topics (grade-filtered)
        │       │   ├── Lessons (PRE-POPULATED)
        │       │   ├── Assignments
        │       │   └── Quizzes
        │       └── Students
        └── STUDENT
```

---

## 10. DATABASE CHANGES REQUIRED

### New Models Needed

```prisma
// Add to schema.prisma

model District {
  id          String   @id @default(cuid())
  name        String
  state       String
  schools     School[]
  admins      User[]   @relation("DistrictAdmins")
  createdAt   DateTime @default(now())
}

enum SchoolType {
  PRESCHOOL
  KINDERGARTEN
  ELEMENTARY
  MIDDLE_SCHOOL
  HIGH_SCHOOL
  VOCATIONAL_TECH
}

enum UserRole {
  SUPER_ADMIN
  DISTRICT_ADMIN    // NEW
  PRINCIPAL         // NEW
  VICE_PRINCIPAL    // NEW
  SCHOOL_ADMIN
  TEACHER
  STUDENT
}
```

### Schema Modifications

```prisma
model School {
  // Add:
  districtId    String?
  district      District? @relation(...)
  schoolType    SchoolType
}

model User {
  // Add for teachers:
  certifications String[]
  department     String?
}

model TutoringSession {
  // Add:
  lessonId      String?
  lesson        Lesson? @relation(...)
}
```

---

## 11. CONTENT REQUIREMENTS

### Lessons to Create

| Category | Subjects | Topics | Lessons Needed (3-5 per topic) |
|----------|----------|--------|--------------------------------|
| Mathematics | 14 | ~40 | 120-200 |
| Science | 14 | ~35 | 105-175 |
| ELA | 15 | ~30 | 90-150 |
| History | 14 | ~30 | 90-150 |
| Languages | 7 | ~20 | 60-100 |
| Computer Science | 6 | ~11 | 33-55 |
| **Vo-Tech (NEW)** | 9 | ~45 | 135-225 |
| **Early Childhood (NEW)** | 5 | ~15 | 45-75 |

**TOTAL: ~680-1,130 lessons needed**

### Priority Order for Lesson Creation

1. **Phase 1:** Core subjects (Math, Science, ELA) for grades K-5
2. **Phase 2:** Core subjects for grades 6-8
3. **Phase 3:** High school subjects (9-12)
4. **Phase 4:** AP courses
5. **Phase 5:** Vo-Tech subjects
6. **Phase 6:** World Languages & CS

---

## 12. CONCLUSION

### What Works Well
- Multi-tenant school architecture
- 4-level RBAC (needs expansion)
- Grade-level subject organization
- Assignment & Quiz systems
- AI tutoring infrastructure
- Payment integration

### Critical Gaps
1. **No District level** - Can't manage school systems
2. **Missing roles** - Principal, VP, District Admin
3. **No school types** - Can't distinguish Elem/Middle/High/Vo-Tech
4. **Empty lessons** - System exists but no content
5. **AI not connected to lessons** - Tutoring doesn't use curriculum

### Recommended Action Plan

**Immediate (Week 1-2):**
- Add District model and DistrictAdmin role
- Add Principal/VicePrincipal roles
- Add SchoolType enum

**Short-term (Week 3-4):**
- Add Vo-Tech and Preschool subject categories
- Create lesson templates
- Begin lesson content creation

**Medium-term (Month 2-3):**
- Seed 200+ core lessons
- Connect lessons to AI tutoring
- Add teacher certifications

**Long-term (Month 4+):**
- Complete all lesson content
- Add standards alignment
- Build parent portal
