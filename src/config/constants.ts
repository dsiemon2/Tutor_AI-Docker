// TutorAI Constants
// Roles, Subjects, Grades, Languages, School Types

// ============================================
// ROLES & PERMISSIONS
// ============================================

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  DISTRICT_ADMIN: 'DISTRICT_ADMIN',
  PRINCIPAL: 'PRINCIPAL',
  VICE_PRINCIPAL: 'VICE_PRINCIPAL',
  DEPARTMENT_HEAD: 'DEPARTMENT_HEAD',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT'
} as const;

export type Role = keyof typeof ROLES;

export const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 100,
  DISTRICT_ADMIN: 90,
  PRINCIPAL: 85,
  VICE_PRINCIPAL: 75,
  DEPARTMENT_HEAD: 65,
  TEACHER: 60,
  STUDENT: 40
};

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  DISTRICT_ADMIN: 'District Admin',
  PRINCIPAL: 'Principal',
  VICE_PRINCIPAL: 'Vice Principal',
  DEPARTMENT_HEAD: 'Department Head',
  TEACHER: 'Teacher',
  STUDENT: 'Student'
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  SUPER_ADMIN: 'Platform administrator with access to all schools and settings',
  DISTRICT_ADMIN: 'Oversees multiple schools within a district',
  PRINCIPAL: 'School leadership - manages teachers, curriculum, and school settings',
  VICE_PRINCIPAL: 'Assistant principal - supports principal duties',
  DEPARTMENT_HEAD: 'Lead teacher - oversees curriculum for their subject department',
  TEACHER: 'Classroom instruction - manages classes, lessons, and student progress',
  STUDENT: 'Learner - access to tutoring, assignments, and progress tracking'
};

// ============================================
// SCHOOL TYPES
// ============================================

export const SCHOOL_TYPES = {
  PRESCHOOL: 'PRESCHOOL',
  KINDERGARTEN: 'KINDERGARTEN',
  ELEMENTARY: 'ELEMENTARY',
  MIDDLE_SCHOOL: 'MIDDLE_SCHOOL',
  HIGH_SCHOOL: 'HIGH_SCHOOL',
  VOCATIONAL_TECH: 'VOCATIONAL_TECH',
  K8: 'K8',
  K12: 'K12',
  CHARTER: 'CHARTER',
  MAGNET: 'MAGNET'
} as const;

export type SchoolType = keyof typeof SCHOOL_TYPES;

export const SCHOOL_TYPE_CONFIG: Record<SchoolType, {
  label: string;
  gradeMin: number;
  gradeMax: number;
  description: string;
}> = {
  PRESCHOOL: {
    label: 'Preschool',
    gradeMin: -2, // Pre-K 3
    gradeMax: -1, // Pre-K 4
    description: 'Early childhood education (ages 3-4)'
  },
  KINDERGARTEN: {
    label: 'Kindergarten',
    gradeMin: 0,
    gradeMax: 0,
    description: 'Kindergarten only (age 5)'
  },
  ELEMENTARY: {
    label: 'Elementary School',
    gradeMin: 0,
    gradeMax: 5,
    description: 'Elementary education (K-5)'
  },
  MIDDLE_SCHOOL: {
    label: 'Middle School',
    gradeMin: 6,
    gradeMax: 8,
    description: 'Middle school education (6-8)'
  },
  HIGH_SCHOOL: {
    label: 'High School',
    gradeMin: 9,
    gradeMax: 12,
    description: 'High school education (9-12)'
  },
  VOCATIONAL_TECH: {
    label: 'Vocational-Technical',
    gradeMin: 9,
    gradeMax: 12,
    description: 'Career and technical education (9-12)'
  },
  K8: {
    label: 'K-8 School',
    gradeMin: 0,
    gradeMax: 8,
    description: 'Combined elementary and middle (K-8)'
  },
  K12: {
    label: 'K-12 School',
    gradeMin: 0,
    gradeMax: 12,
    description: 'Full K-12 education'
  },
  CHARTER: {
    label: 'Charter School',
    gradeMin: 0,
    gradeMax: 12,
    description: 'Independent public charter school'
  },
  MAGNET: {
    label: 'Magnet School',
    gradeMin: 0,
    gradeMax: 12,
    description: 'Specialized magnet program school'
  }
};

// ============================================
// GRADE LEVELS
// ============================================

export const GRADE_LEVELS = [
  { value: -2, label: 'Pre-K 3', code: 'PK3', level: 'PRESCHOOL', age: 3 },
  { value: -1, label: 'Pre-K 4', code: 'PK4', level: 'PRESCHOOL', age: 4 },
  { value: 0, label: 'Kindergarten', code: 'K', level: 'ELEMENTARY', age: 5 },
  { value: 1, label: '1st Grade', code: '1', level: 'ELEMENTARY', age: 6 },
  { value: 2, label: '2nd Grade', code: '2', level: 'ELEMENTARY', age: 7 },
  { value: 3, label: '3rd Grade', code: '3', level: 'ELEMENTARY', age: 8 },
  { value: 4, label: '4th Grade', code: '4', level: 'ELEMENTARY', age: 9 },
  { value: 5, label: '5th Grade', code: '5', level: 'ELEMENTARY', age: 10 },
  { value: 6, label: '6th Grade', code: '6', level: 'MIDDLE', age: 11 },
  { value: 7, label: '7th Grade', code: '7', level: 'MIDDLE', age: 12 },
  { value: 8, label: '8th Grade', code: '8', level: 'MIDDLE', age: 13 },
  { value: 9, label: '9th Grade', code: '9', level: 'HIGH', age: 14 },
  { value: 10, label: '10th Grade', code: '10', level: 'HIGH', age: 15 },
  { value: 11, label: '11th Grade', code: '11', level: 'HIGH', age: 16 },
  { value: 12, label: '12th Grade', code: '12', level: 'HIGH', age: 17 }
] as const;

export const GRADE_LEVEL_RANGES = {
  PRESCHOOL: { min: -2, max: -1, label: 'Preschool (Pre-K 3-4)' },
  ELEMENTARY: { min: 0, max: 5, label: 'Elementary School (K-5)' },
  MIDDLE: { min: 6, max: 8, label: 'Middle School (6-8)' },
  HIGH: { min: 9, max: 12, label: 'High School (9-12)' },
  VOCATIONAL: { min: 9, max: 12, label: 'Vocational-Technical (9-12)' }
} as const;

// ============================================
// SUBJECT CATEGORIES
// ============================================

export const SUBJECT_CATEGORIES = [
  // Early Childhood (Preschool/Pre-K)
  {
    code: 'early_childhood',
    name: 'Early Childhood',
    icon: 'bi-emoji-smile',
    color: '#f472b6',
    description: 'Foundational skills for preschool and pre-kindergarten',
    gradeMin: -2,
    gradeMax: 0
  },
  // Core Academic Subjects (K-12)
  {
    code: 'math',
    name: 'Mathematics',
    icon: 'bi-calculator',
    color: '#3b82f6',
    description: 'Numbers, algebra, geometry, and more',
    gradeMin: 0,
    gradeMax: 12
  },
  {
    code: 'science',
    name: 'Science',
    icon: 'bi-flask',
    color: '#22c55e',
    description: 'Biology, chemistry, physics, and earth science',
    gradeMin: 0,
    gradeMax: 12
  },
  {
    code: 'ela',
    name: 'English Language Arts',
    icon: 'bi-book',
    color: '#f59e0b',
    description: 'Reading, writing, grammar, and literature',
    gradeMin: 0,
    gradeMax: 12
  },
  {
    code: 'history',
    name: 'History & Social Studies',
    icon: 'bi-globe',
    color: '#8b5cf6',
    description: 'History, geography, civics, and economics',
    gradeMin: 0,
    gradeMax: 12
  },
  {
    code: 'languages',
    name: 'World Languages',
    icon: 'bi-translate',
    color: '#ec4899',
    description: 'Spanish, French, German, Chinese, and more',
    gradeMin: 0,
    gradeMax: 12
  },
  {
    code: 'cs',
    name: 'Computer Science',
    icon: 'bi-code-slash',
    color: '#06b6d4',
    description: 'Coding, programming, and digital literacy',
    gradeMin: 3,
    gradeMax: 12
  },
  // Vocational-Technical (Grades 9-12)
  {
    code: 'vocational',
    name: 'Vocational & Technical',
    icon: 'bi-tools',
    color: '#64748b',
    description: 'Career and technical education trades',
    gradeMin: 9,
    gradeMax: 12
  },
  // Arts & Electives
  {
    code: 'arts',
    name: 'Arts & Music',
    icon: 'bi-palette',
    color: '#a855f7',
    description: 'Visual arts, music, drama, and creative expression',
    gradeMin: -2,
    gradeMax: 12
  },
  {
    code: 'pe_health',
    name: 'Physical Education & Health',
    icon: 'bi-heart-pulse',
    color: '#ef4444',
    description: 'Physical fitness, sports, and health education',
    gradeMin: -2,
    gradeMax: 12
  }
] as const;

// ============================================
// SUBJECTS BY CATEGORY
// ============================================

export const SUBJECTS = {
  // Early Childhood (Pre-K and Kindergarten)
  EARLY_CHILDHOOD: [
    { name: 'Colors & Shapes', code: 'COLORS_SHAPES', minGrade: -2, maxGrade: 0 },
    { name: 'Letters & ABCs', code: 'LETTERS_ABC', minGrade: -2, maxGrade: 0 },
    { name: 'Numbers & Counting', code: 'NUMBERS_COUNTING', minGrade: -2, maxGrade: 0 },
    { name: 'Social Skills', code: 'SOCIAL_SKILLS', minGrade: -2, maxGrade: 0 },
    { name: 'Motor Skills', code: 'MOTOR_SKILLS', minGrade: -2, maxGrade: 0 },
    { name: 'Patterns & Sorting', code: 'PATTERNS_SORTING', minGrade: -2, maxGrade: 0 },
    { name: 'Story Time & Listening', code: 'STORY_LISTENING', minGrade: -2, maxGrade: 0 },
    { name: 'Art & Creativity', code: 'ART_CREATIVITY', minGrade: -2, maxGrade: 0 }
  ],
  // Mathematics (K-12)
  MATH: [
    { name: 'Basic Math', code: 'BASIC', minGrade: 0, maxGrade: 5 },
    { name: 'Pre-Algebra', code: 'PREALG', minGrade: 6, maxGrade: 7 },
    { name: 'Algebra I', code: 'ALG1', minGrade: 7, maxGrade: 9 },
    { name: 'Geometry', code: 'GEOM', minGrade: 8, maxGrade: 10 },
    { name: 'Algebra II', code: 'ALG2', minGrade: 9, maxGrade: 11 },
    { name: 'Pre-Calculus', code: 'PRECALC', minGrade: 10, maxGrade: 12 },
    { name: 'Calculus', code: 'CALC', minGrade: 11, maxGrade: 12 },
    { name: 'AP Calculus AB', code: 'AP_CALC_AB', minGrade: 11, maxGrade: 12 },
    { name: 'AP Calculus BC', code: 'AP_CALC_BC', minGrade: 11, maxGrade: 12 },
    { name: 'Statistics', code: 'STATS', minGrade: 9, maxGrade: 12 },
    { name: 'AP Statistics', code: 'AP_STATS', minGrade: 10, maxGrade: 12 }
  ],
  // Science (K-12)
  SCI: [
    { name: 'General Science', code: 'GENSCI', minGrade: 0, maxGrade: 5 },
    { name: 'Earth Science', code: 'EARTH', minGrade: 4, maxGrade: 8 },
    { name: 'Life Science', code: 'LIFE', minGrade: 4, maxGrade: 7 },
    { name: 'Physical Science', code: 'PHYSCI', minGrade: 6, maxGrade: 8 },
    { name: 'Biology', code: 'BIO', minGrade: 9, maxGrade: 12 },
    { name: 'AP Biology', code: 'AP_BIO', minGrade: 10, maxGrade: 12 },
    { name: 'Chemistry', code: 'CHEM', minGrade: 10, maxGrade: 12 },
    { name: 'AP Chemistry', code: 'AP_CHEM', minGrade: 11, maxGrade: 12 },
    { name: 'Physics', code: 'PHYS', minGrade: 10, maxGrade: 12 },
    { name: 'AP Physics 1', code: 'AP_PHYS1', minGrade: 11, maxGrade: 12 },
    { name: 'AP Physics 2', code: 'AP_PHYS2', minGrade: 11, maxGrade: 12 },
    { name: 'Environmental Science', code: 'ENV', minGrade: 9, maxGrade: 12 },
    { name: 'AP Environmental Science', code: 'AP_ENV', minGrade: 10, maxGrade: 12 }
  ],
  // English Language Arts (K-12)
  ELA: [
    { name: 'Reading', code: 'READ', minGrade: 0, maxGrade: 8 },
    { name: 'Writing', code: 'WRITE', minGrade: 0, maxGrade: 12 },
    { name: 'Grammar', code: 'GRAM', minGrade: 0, maxGrade: 8 },
    { name: 'Literature', code: 'LIT', minGrade: 6, maxGrade: 12 },
    { name: 'Vocabulary', code: 'VOCAB', minGrade: 0, maxGrade: 12 },
    { name: 'Essay Writing', code: 'ESSAY', minGrade: 6, maxGrade: 12 },
    { name: 'American Literature', code: 'AMER_LIT', minGrade: 10, maxGrade: 12 },
    { name: 'British Literature', code: 'BRIT_LIT', minGrade: 10, maxGrade: 12 },
    { name: 'AP English Language', code: 'AP_ENG_LANG', minGrade: 10, maxGrade: 12 },
    { name: 'AP English Literature', code: 'AP_ENG_LIT', minGrade: 11, maxGrade: 12 }
  ],
  // History & Social Studies (K-12)
  SS: [
    { name: 'Community & Helpers', code: 'COMMUNITY', minGrade: 0, maxGrade: 2 },
    { name: 'US History', code: 'USHIST', minGrade: 3, maxGrade: 12 },
    { name: 'AP US History', code: 'AP_USHIST', minGrade: 10, maxGrade: 12 },
    { name: 'World History', code: 'WORLD', minGrade: 5, maxGrade: 12 },
    { name: 'AP World History', code: 'AP_WORLD', minGrade: 10, maxGrade: 12 },
    { name: 'Geography', code: 'GEO', minGrade: 0, maxGrade: 12 },
    { name: 'AP Human Geography', code: 'AP_HUMGEO', minGrade: 9, maxGrade: 12 },
    { name: 'Civics', code: 'CIV', minGrade: 3, maxGrade: 12 },
    { name: 'AP Government', code: 'AP_GOV', minGrade: 11, maxGrade: 12 },
    { name: 'Economics', code: 'ECON', minGrade: 6, maxGrade: 12 },
    { name: 'AP Economics', code: 'AP_ECON', minGrade: 11, maxGrade: 12 }
  ],
  // World Languages
  LANGUAGES: [
    { name: 'Spanish I', code: 'SPAN1', minGrade: 6, maxGrade: 12 },
    { name: 'Spanish II', code: 'SPAN2', minGrade: 7, maxGrade: 12 },
    { name: 'Spanish III', code: 'SPAN3', minGrade: 8, maxGrade: 12 },
    { name: 'AP Spanish', code: 'AP_SPAN', minGrade: 10, maxGrade: 12 },
    { name: 'French I', code: 'FRENCH1', minGrade: 6, maxGrade: 12 },
    { name: 'French II', code: 'FRENCH2', minGrade: 7, maxGrade: 12 },
    { name: 'French III', code: 'FRENCH3', minGrade: 8, maxGrade: 12 },
    { name: 'AP French', code: 'AP_FRENCH', minGrade: 10, maxGrade: 12 },
    { name: 'German I', code: 'GERMAN1', minGrade: 6, maxGrade: 12 },
    { name: 'German II', code: 'GERMAN2', minGrade: 7, maxGrade: 12 },
    { name: 'Mandarin Chinese I', code: 'CHINESE1', minGrade: 6, maxGrade: 12 },
    { name: 'Mandarin Chinese II', code: 'CHINESE2', minGrade: 7, maxGrade: 12 },
    { name: 'Latin I', code: 'LATIN1', minGrade: 8, maxGrade: 12 },
    { name: 'Latin II', code: 'LATIN2', minGrade: 9, maxGrade: 12 },
    { name: 'AP Latin', code: 'AP_LATIN', minGrade: 10, maxGrade: 12 }
  ],
  // Computer Science
  CS: [
    { name: 'Digital Literacy', code: 'DIGILIT', minGrade: 3, maxGrade: 5 },
    { name: 'Intro to Computers', code: 'INTRO_COMP', minGrade: 6, maxGrade: 8 },
    { name: 'Intro to Programming', code: 'INTRO_PROG', minGrade: 7, maxGrade: 10 },
    { name: 'AP Computer Science Principles', code: 'AP_CSP', minGrade: 9, maxGrade: 12 },
    { name: 'AP Computer Science A', code: 'AP_CSA', minGrade: 10, maxGrade: 12 },
    { name: 'Web Development', code: 'WEBDEV', minGrade: 9, maxGrade: 12 },
    { name: 'Python Programming', code: 'PYTHON', minGrade: 9, maxGrade: 12 },
    { name: 'Data Science', code: 'DATASCI', minGrade: 10, maxGrade: 12 },
    { name: 'Cybersecurity', code: 'CYBERSEC', minGrade: 10, maxGrade: 12 }
  ],
  // Vocational-Technical Trades (14+ programs)
  VOCATIONAL: [
    { name: 'Automotive Technology', code: 'AUTO_TECH', minGrade: 9, maxGrade: 12 },
    { name: 'Auto Body & Collision', code: 'AUTO_BODY', minGrade: 9, maxGrade: 12 },
    { name: 'Welding & Metal Fabrication', code: 'WELDING', minGrade: 9, maxGrade: 12 },
    { name: 'Electrical Technology', code: 'ELECTRICAL', minGrade: 9, maxGrade: 12 },
    { name: 'Plumbing', code: 'PLUMBING', minGrade: 9, maxGrade: 12 },
    { name: 'HVAC/R', code: 'HVAC', minGrade: 9, maxGrade: 12 },
    { name: 'Carpentry & Construction', code: 'CARPENTRY', minGrade: 9, maxGrade: 12 },
    { name: 'Construction Management', code: 'CONSTRUCT_MGT', minGrade: 10, maxGrade: 12 },
    { name: 'Culinary Arts', code: 'CULINARY', minGrade: 9, maxGrade: 12 },
    { name: 'Baking & Pastry', code: 'BAKING', minGrade: 9, maxGrade: 12 },
    { name: 'Cosmetology', code: 'COSMETOLOGY', minGrade: 10, maxGrade: 12 },
    { name: 'Healthcare Careers', code: 'HEALTHCARE', minGrade: 9, maxGrade: 12 },
    { name: 'Certified Nursing Assistant', code: 'CNA', minGrade: 10, maxGrade: 12 },
    { name: 'Medical Assisting', code: 'MED_ASSIST', minGrade: 10, maxGrade: 12 },
    { name: 'IT & Networking', code: 'IT_NETWORK', minGrade: 9, maxGrade: 12 },
    { name: 'Graphic Design', code: 'GRAPHIC_DESIGN', minGrade: 9, maxGrade: 12 },
    { name: 'Agriculture & Horticulture', code: 'AGRICULTURE', minGrade: 9, maxGrade: 12 },
    { name: 'Veterinary Science', code: 'VET_SCI', minGrade: 9, maxGrade: 12 },
    { name: 'Manufacturing & Machining', code: 'MANUFACTURING', minGrade: 9, maxGrade: 12 },
    { name: 'Diesel Technology', code: 'DIESEL', minGrade: 9, maxGrade: 12 },
    { name: 'Early Childhood Education', code: 'ECE_CAREER', minGrade: 10, maxGrade: 12 },
    { name: 'Criminal Justice', code: 'CRIMINAL_JUST', minGrade: 10, maxGrade: 12 },
    { name: 'Fire Science', code: 'FIRE_SCI', minGrade: 10, maxGrade: 12 },
    { name: 'Emergency Medical Services', code: 'EMS', minGrade: 11, maxGrade: 12 }
  ],
  // Arts & Music
  ARTS: [
    { name: 'Art Fundamentals', code: 'ART_FUND', minGrade: 0, maxGrade: 12 },
    { name: 'Drawing & Painting', code: 'DRAWING', minGrade: 3, maxGrade: 12 },
    { name: 'Sculpture & Ceramics', code: 'SCULPTURE', minGrade: 6, maxGrade: 12 },
    { name: 'AP Art & Design', code: 'AP_ART', minGrade: 10, maxGrade: 12 },
    { name: 'Music Fundamentals', code: 'MUSIC_FUND', minGrade: 0, maxGrade: 12 },
    { name: 'Choir', code: 'CHOIR', minGrade: 3, maxGrade: 12 },
    { name: 'Band', code: 'BAND', minGrade: 4, maxGrade: 12 },
    { name: 'Orchestra', code: 'ORCHESTRA', minGrade: 4, maxGrade: 12 },
    { name: 'Music Theory', code: 'MUSIC_THEORY', minGrade: 9, maxGrade: 12 },
    { name: 'AP Music Theory', code: 'AP_MUSIC', minGrade: 10, maxGrade: 12 },
    { name: 'Drama & Theater', code: 'DRAMA', minGrade: 3, maxGrade: 12 }
  ],
  // Physical Education & Health
  PE_HEALTH: [
    { name: 'Physical Education', code: 'PE', minGrade: -2, maxGrade: 12 },
    { name: 'Health Education', code: 'HEALTH', minGrade: 3, maxGrade: 12 },
    { name: 'Fitness & Conditioning', code: 'FITNESS', minGrade: 6, maxGrade: 12 },
    { name: 'Team Sports', code: 'TEAM_SPORTS', minGrade: 6, maxGrade: 12 },
    { name: 'Lifetime Fitness', code: 'LIFETIME_FIT', minGrade: 9, maxGrade: 12 }
  ]
} as const;

// ============================================
// LANGUAGES (24 - all enabled)
// ============================================

export const LANGUAGES = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' }
] as const;

// ============================================
// OPENAI VOICES
// ============================================

export const VOICES = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', description: 'Warm and resonant' },
  { id: 'fable', name: 'Fable', description: 'Expressive and dynamic' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', description: 'Friendly and upbeat' },
  { id: 'shimmer', name: 'Shimmer', description: 'Clear and bright' }
] as const;

// ============================================
// SUBSCRIPTION TIERS
// ============================================

export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    students: 25,
    teachers: 2,
    sessionsPerMonth: 10,
    features: ['Basic tutoring', 'Text chat', '5 subjects']
  },
  STARTER: {
    name: 'Starter',
    price: 99,
    students: 100,
    teachers: 5,
    sessionsPerMonth: -1, // unlimited
    features: ['Unlimited sessions', 'Voice mode', 'All subjects', 'Progress tracking']
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: 299,
    students: 500,
    teachers: 25,
    sessionsPerMonth: -1,
    features: ['Everything in Starter', 'Analytics dashboard', 'File uploads', 'Parent portal']
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: -1, // custom
    students: -1, // unlimited
    teachers: -1,
    sessionsPerMonth: -1,
    features: ['Everything in Professional', 'SSO', 'API access', 'Custom branding', 'SLA']
  }
} as const;

// ============================================
// COLORS (Education theme)
// ============================================

export const COLORS = {
  primary: '#0ea5e9',    // Sky blue
  secondary: '#0284c7',  // Darker blue
  accent: '#38bdf8',     // Light blue
  success: '#22c55e',    // Green
  warning: '#f59e0b',    // Amber
  danger: '#ef4444',     // Red
  info: '#6366f1',       // Indigo
  light: '#f8fafc',      // Slate 50
  dark: '#0f172a'        // Slate 900
} as const;

// ============================================
// SESSION MODES
// ============================================

export const SESSION_MODES = {
  TEXT: { label: 'Text Chat', icon: 'bi-chat-dots' },
  VOICE: { label: 'Voice', icon: 'bi-mic' },
  HYBRID: { label: 'Voice + Text', icon: 'bi-headset' }
} as const;

// ============================================
// PROCESSING STATUS
// ============================================

export const PROCESSING_STATUS = {
  PENDING: { label: 'Pending', color: 'warning' },
  PROCESSING: { label: 'Processing', color: 'info' },
  COMPLETED: { label: 'Completed', color: 'success' },
  FAILED: { label: 'Failed', color: 'danger' }
} as const;

// ============================================
// DEMO USERS
// ============================================

export const DEMO_USERS = [
  // Platform Admin
  {
    email: 'admin@tutorai.com',
    password: 'demo1234',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'SUPER_ADMIN'
  },
  // District Admin
  {
    email: 'district@lincolnusd.edu',
    password: 'demo1234',
    firstName: 'Margaret',
    lastName: 'Thompson',
    role: 'DISTRICT_ADMIN'
  },
  // Principal
  {
    email: 'principal@lincolnhs.edu',
    password: 'demo1234',
    firstName: 'Robert',
    lastName: 'Anderson',
    role: 'PRINCIPAL'
  },
  // Vice Principal
  {
    email: 'vp@lincolnhs.edu',
    password: 'demo1234',
    firstName: 'Patricia',
    lastName: 'Martinez',
    role: 'VICE_PRINCIPAL'
  },
  // Department Head (Math)
  {
    email: 'math.head@lincolnhs.edu',
    password: 'demo1234',
    firstName: 'David',
    lastName: 'Chen',
    role: 'DEPARTMENT_HEAD',
    departmentCode: 'MATH'
  },
  // Teacher
  {
    email: 'sjohnson@lincolnhs.edu',
    password: 'demo1234',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'TEACHER'
  },
  // Student
  {
    email: 'emma.wilson@student.lincolnhs.edu',
    password: 'demo1234',
    firstName: 'Emma',
    lastName: 'Wilson',
    role: 'STUDENT',
    gradeLevel: 10
  }
] as const;
