// TutorAI Seed File
// Creates comprehensive demo data for development and testing

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateLessonContent } from './lessonContent';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // =====================
  // Languages (24 languages, all enabled)
  // =====================
  const languages = [
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', enabled: true },
    { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文', enabled: true },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština', enabled: true },
    { code: 'da', name: 'Danish', nativeName: 'Dansk', enabled: true },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', enabled: true },
    { code: 'en', name: 'English', nativeName: 'English', enabled: true },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi', enabled: true },
    { code: 'fr', name: 'French', nativeName: 'Français', enabled: true },
    { code: 'de', name: 'German', nativeName: 'Deutsch', enabled: true },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', enabled: true },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית', enabled: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', enabled: true },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', enabled: true },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', enabled: true },
    { code: 'ko', name: 'Korean', nativeName: '한국어', enabled: true },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk', enabled: true },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', enabled: true },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', enabled: true },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', enabled: true },
    { code: 'es', name: 'Spanish', nativeName: 'Español', enabled: true },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', enabled: true },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', enabled: true },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', enabled: true },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', enabled: true }
  ];

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: lang,
      create: lang
    });
  }
  console.log('Languages seeded');

  // =====================
  // Branding
  // =====================
  await prisma.branding.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#0ea5e9',
      secondaryColor: '#0284c7',
      accentColor: '#38bdf8',
      headingFont: 'Inter',
      bodyFont: 'Inter'
    }
  });
  console.log('Branding seeded');

  // =====================
  // Store Info
  // =====================
  await prisma.storeInfo.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      businessName: 'TutorAI',
      tagline: 'AI-Powered Learning for Every Student',
      description: 'TutorAI is an intelligent tutoring platform that provides personalized learning experiences for students of all ages.',
      address: '100 Education Boulevard, Suite 500',
      phone: '1-800-TUTOR-AI',
      email: 'support@tutorai.com',
      website: 'https://tutorai.com',
      businessHours: '24/7',
      timezone: 'America/New_York'
    }
  });
  console.log('Store info seeded');

  // =====================
  // Greeting
  // =====================
  await prisma.greeting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      welcomeTitle: 'Welcome to TutorAI!',
      welcomeMessage: "I'm your AI tutor. What would you like to learn today? I can help with Math, Science, English, History, and more!",
      voiceGreeting: "Hello! I'm your AI tutor. Whether you need help with homework, want to learn something new, or prepare for a test, I'm here to help!"
    }
  });
  console.log('Greeting seeded');

  // =====================
  // AI Config
  // =====================
  await prisma.aIConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1024,
      voiceId: 'alloy',
      enableVoice: true,
      enableVision: true,
      enableRealtime: true
    }
  });
  console.log('AI config seeded');

  // =====================
  // DISTRICTS
  // =====================
  const districts = [
    {
      id: 'lincoln-usd',
      code: 'LUSD-001',
      name: 'Lincoln Unified School District',
      state: 'IL',
      address: '500 District Plaza',
      city: 'Springfield',
      zipCode: '62701',
      phone: '217-555-0001',
      email: 'admin@lincolnusd.edu',
      website: 'https://lincolnusd.edu',
      superintendent: 'Dr. Margaret Thompson'
    },
    {
      id: 'bay-state-district',
      code: 'BSD-001',
      name: 'Bay State School District',
      state: 'MA',
      address: '200 Education Center',
      city: 'Boston',
      zipCode: '02101',
      phone: '617-555-0001',
      email: 'admin@baystatedistrict.edu',
      website: 'https://baystatedistrict.edu',
      superintendent: 'Dr. William Harper'
    },
    {
      id: 'texas-isd',
      code: 'TISD-001',
      name: 'Texas Independent School District',
      state: 'TX',
      address: '300 Learning Way',
      city: 'Austin',
      zipCode: '78701',
      phone: '512-555-0001',
      email: 'admin@texasisd.edu',
      website: 'https://texasisd.edu',
      superintendent: 'Dr. Rosa Martinez'
    }
  ];

  for (const district of districts) {
    await prisma.district.upsert({
      where: { id: district.id },
      update: district,
      create: { ...district, isActive: true }
    });
  }
  console.log('Districts seeded');

  // =====================
  // SCHOOLS (with types and district relationships)
  // =====================
  const schools = [
    // Lincoln USD Schools
    {
      id: 'lincoln-high',
      name: 'Lincoln High School',
      districtId: 'lincoln-usd',
      schoolType: 'HIGH_SCHOOL',
      gradeMin: 9,
      gradeMax: 12,
      address: '1234 Lincoln Avenue',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      phone: '217-555-0100',
      email: 'admin@lincolnhs.edu',
      website: 'https://lincolnhs.edu',
      gradeRange: '9-12',
      subscriptionTier: 'PREMIUM'
    },
    {
      id: 'lincoln-middle',
      name: 'Lincoln Middle School',
      districtId: 'lincoln-usd',
      schoolType: 'MIDDLE_SCHOOL',
      gradeMin: 6,
      gradeMax: 8,
      address: '1235 Lincoln Avenue',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      phone: '217-555-0101',
      email: 'admin@lincolnms.edu',
      website: 'https://lincolnms.edu',
      gradeRange: '6-8',
      subscriptionTier: 'PREMIUM'
    },
    {
      id: 'lincoln-elementary',
      name: 'Lincoln Elementary School',
      districtId: 'lincoln-usd',
      schoolType: 'ELEMENTARY',
      gradeMin: 0,
      gradeMax: 5,
      address: '1236 Lincoln Avenue',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      phone: '217-555-0102',
      email: 'admin@lincolnelem.edu',
      website: 'https://lincolnelem.edu',
      gradeRange: 'K-5',
      subscriptionTier: 'PREMIUM'
    },
    {
      id: 'lincoln-preschool',
      name: 'Lincoln Early Learning Center',
      districtId: 'lincoln-usd',
      schoolType: 'PRESCHOOL',
      gradeMin: -2,
      gradeMax: 0,
      address: '1237 Lincoln Avenue',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      phone: '217-555-0103',
      email: 'admin@lincolnelc.edu',
      website: 'https://lincolnelc.edu',
      gradeRange: 'PK-K',
      subscriptionTier: 'PREMIUM'
    },
    {
      id: 'lincoln-votech',
      name: 'Lincoln Career & Technical Center',
      districtId: 'lincoln-usd',
      schoolType: 'VOCATIONAL_TECH',
      gradeMin: 9,
      gradeMax: 12,
      address: '500 Trade School Road',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702',
      phone: '217-555-0104',
      email: 'admin@lincolnctc.edu',
      website: 'https://lincolnctc.edu',
      gradeRange: '9-12',
      subscriptionTier: 'PREMIUM'
    },
    // Bay State District Schools
    {
      id: 'washington-middle',
      name: 'Washington Middle School',
      districtId: 'bay-state-district',
      schoolType: 'MIDDLE_SCHOOL',
      gradeMin: 6,
      gradeMax: 8,
      address: '567 Washington Street',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      phone: '617-555-0200',
      email: 'admin@washingtonms.edu',
      website: 'https://washingtonms.edu',
      gradeRange: '6-8',
      subscriptionTier: 'STANDARD'
    },
    {
      id: 'boston-elementary',
      name: 'Boston Elementary School',
      districtId: 'bay-state-district',
      schoolType: 'ELEMENTARY',
      gradeMin: 0,
      gradeMax: 5,
      address: '568 Washington Street',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      phone: '617-555-0201',
      email: 'admin@bostonelem.edu',
      website: 'https://bostonelem.edu',
      gradeRange: 'K-5',
      subscriptionTier: 'STANDARD'
    },
    // Texas ISD Schools
    {
      id: 'jefferson-elementary',
      name: 'Jefferson Elementary',
      districtId: 'texas-isd',
      schoolType: 'ELEMENTARY',
      gradeMin: 0,
      gradeMax: 5,
      address: '890 Jefferson Road',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      phone: '512-555-0300',
      email: 'admin@jeffersonelem.edu',
      website: 'https://jeffersonelem.edu',
      gradeRange: 'K-5',
      subscriptionTier: 'BASIC'
    },
    {
      id: 'stem-academy',
      name: 'STEM Academy',
      districtId: 'texas-isd',
      schoolType: 'MAGNET',
      gradeMin: 9,
      gradeMax: 12,
      address: '100 Innovation Drive',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95101',
      phone: '408-555-0400',
      email: 'admin@stemacademy.edu',
      website: 'https://stemacademy.edu',
      gradeRange: '9-12',
      subscriptionTier: 'PREMIUM'
    },
    // Standalone school (no district)
    {
      id: 'riverside-prep',
      name: 'Riverside Preparatory Academy',
      schoolType: 'K12',
      gradeMin: 0,
      gradeMax: 12,
      address: '2500 Riverside Blvd',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      phone: '305-555-0500',
      email: 'admin@riversideprep.edu',
      website: 'https://riversideprep.edu',
      gradeRange: 'K-12',
      subscriptionTier: 'PREMIUM'
    }
  ];

  for (const school of schools) {
    await prisma.school.upsert({
      where: { id: school.id },
      update: school,
      create: { ...school, isActive: true }
    });
  }
  console.log('Schools seeded');

  // =====================
  // Demo Users (with new role hierarchy)
  // =====================
  const passwordHash = await bcrypt.hash('demo1234', 12);

  // Super Admin (Platform Level)
  await prisma.user.upsert({
    where: { email: 'admin@tutorai.com' },
    update: {},
    create: {
      email: 'admin@tutorai.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'SUPER_ADMIN',
      isActive: true
    }
  });

  // District Admins
  const districtAdmins = [
    { email: 'district@lincolnusd.edu', firstName: 'Margaret', lastName: 'Thompson', districtId: 'lincoln-usd' },
    { email: 'district@baystate.edu', firstName: 'William', lastName: 'Harper', districtId: 'bay-state-district' },
    { email: 'district@texasisd.edu', firstName: 'Rosa', lastName: 'Martinez', districtId: 'texas-isd' }
  ];

  for (const admin of districtAdmins) {
    await prisma.user.upsert({
      where: { email: admin.email },
      update: {},
      create: { ...admin, passwordHash, role: 'DISTRICT_ADMIN', isActive: true }
    });
  }

  // Principals (School Level Leadership)
  const principals = [
    { email: 'principal@lincolnhs.edu', firstName: 'Robert', lastName: 'Anderson', schoolId: 'lincoln-high' },
    { email: 'principal@lincolnms.edu', firstName: 'Susan', lastName: 'Wright', schoolId: 'lincoln-middle' },
    { email: 'principal@lincolnelem.edu', firstName: 'Thomas', lastName: 'Green', schoolId: 'lincoln-elementary' },
    { email: 'principal@lincolnelc.edu', firstName: 'Emily', lastName: 'Clark', schoolId: 'lincoln-preschool' },
    { email: 'principal@lincolnctc.edu', firstName: 'James', lastName: 'Wilson', schoolId: 'lincoln-votech' },
    { email: 'principal@washingtonms.edu', firstName: 'Maria', lastName: 'Garcia', schoolId: 'washington-middle' },
    { email: 'principal@bostonelem.edu', firstName: 'Patrick', lastName: 'Murphy', schoolId: 'boston-elementary' },
    { email: 'principal@jeffersonelem.edu', firstName: 'Linda', lastName: 'Davis', schoolId: 'jefferson-elementary' },
    { email: 'principal@stemacademy.edu', firstName: 'David', lastName: 'Chen', schoolId: 'stem-academy' },
    { email: 'principal@riversideprep.edu', firstName: 'Carmen', lastName: 'Rodriguez', schoolId: 'riverside-prep' }
  ];

  for (const principal of principals) {
    await prisma.user.upsert({
      where: { email: principal.email },
      update: {},
      create: { ...principal, passwordHash, role: 'PRINCIPAL', isActive: true }
    });
  }

  // Vice Principals
  const vicePrincipals = [
    { email: 'vp@lincolnhs.edu', firstName: 'Patricia', lastName: 'Martinez', schoolId: 'lincoln-high' },
    { email: 'vp@lincolnms.edu', firstName: 'Kevin', lastName: 'Brown', schoolId: 'lincoln-middle' },
    { email: 'vp@washingtonms.edu', firstName: 'Nancy', lastName: 'Lee', schoolId: 'washington-middle' },
    { email: 'vp@stemacademy.edu', firstName: 'Brian', lastName: 'Taylor', schoolId: 'stem-academy' },
    { email: 'vp@lincolnctc.edu', firstName: 'Carol', lastName: 'White', schoolId: 'lincoln-votech' }
  ];

  for (const vp of vicePrincipals) {
    await prisma.user.upsert({
      where: { email: vp.email },
      update: {},
      create: { ...vp, passwordHash, role: 'VICE_PRINCIPAL', isActive: true }
    });
  }

  // Department Heads (Lead Teachers)
  const deptHeads = [
    // Lincoln High School
    { email: 'math.head@lincolnhs.edu', firstName: 'David', lastName: 'Chen', schoolId: 'lincoln-high', departmentCode: 'MATH' },
    { email: 'science.head@lincolnhs.edu', firstName: 'Rachel', lastName: 'Kim', schoolId: 'lincoln-high', departmentCode: 'SCI' },
    { email: 'ela.head@lincolnhs.edu', firstName: 'Mark', lastName: 'Johnson', schoolId: 'lincoln-high', departmentCode: 'ELA' },
    { email: 'history.head@lincolnhs.edu', firstName: 'Angela', lastName: 'Davis', schoolId: 'lincoln-high', departmentCode: 'SS' },
    // Lincoln Middle School
    { email: 'math.head@lincolnms.edu', firstName: 'Steven', lastName: 'Park', schoolId: 'lincoln-middle', departmentCode: 'MATH' },
    { email: 'science.head@lincolnms.edu', firstName: 'Laura', lastName: 'Smith', schoolId: 'lincoln-middle', departmentCode: 'SCI' },
    // Lincoln Vo-Tech
    { email: 'auto.head@lincolnctc.edu', firstName: 'Mike', lastName: 'Rodriguez', schoolId: 'lincoln-votech', departmentCode: 'AUTO' },
    { email: 'culinary.head@lincolnctc.edu', firstName: 'Chef', lastName: 'Antonio', schoolId: 'lincoln-votech', departmentCode: 'CULINARY' },
    { email: 'healthcare.head@lincolnctc.edu', firstName: 'Nurse', lastName: 'Williams', schoolId: 'lincoln-votech', departmentCode: 'HEALTHCARE' }
  ];

  for (const head of deptHeads) {
    await prisma.user.upsert({
      where: { email: head.email },
      update: {},
      create: { ...head, passwordHash, role: 'DEPARTMENT_HEAD', isActive: true }
    });
  }

  // Teachers (1-2 per classroom as required)
  const teachers = [
    // Lincoln High School Teachers
    { email: 'sjohnson@lincolnhs.edu', firstName: 'Sarah', lastName: 'Johnson', schoolId: 'lincoln-high' },
    { email: 'mwilliams@lincolnhs.edu', firstName: 'Michael', lastName: 'Williams', schoolId: 'lincoln-high' },
    { email: 'asmith@lincolnhs.edu', firstName: 'Amanda', lastName: 'Smith', schoolId: 'lincoln-high' },
    { email: 'jthompson@lincolnhs.edu', firstName: 'Jason', lastName: 'Thompson', schoolId: 'lincoln-high' },
    // Lincoln Middle School Teachers
    { email: 'lbrown@lincolnms.edu', firstName: 'Lisa', lastName: 'Brown', schoolId: 'lincoln-middle' },
    { email: 'dgarcia@lincolnms.edu', firstName: 'Daniel', lastName: 'Garcia', schoolId: 'lincoln-middle' },
    // Lincoln Elementary Teachers
    { email: 'kwhite@lincolnelem.edu', firstName: 'Karen', lastName: 'White', schoolId: 'lincoln-elementary' },
    { email: 'rgreen@lincolnelem.edu', firstName: 'Rebecca', lastName: 'Green', schoolId: 'lincoln-elementary' },
    { email: 'jlee@lincolnelem.edu', firstName: 'John', lastName: 'Lee', schoolId: 'lincoln-elementary' },
    // Lincoln Preschool Teachers
    { email: 'sclark@lincolnelc.edu', firstName: 'Samantha', lastName: 'Clark', schoolId: 'lincoln-preschool' },
    { email: 'mharris@lincolnelc.edu', firstName: 'Michelle', lastName: 'Harris', schoolId: 'lincoln-preschool' },
    // Lincoln Vo-Tech Teachers
    { email: 'bsmith@lincolnctc.edu', firstName: 'Bill', lastName: 'Smith', schoolId: 'lincoln-votech' },
    { email: 'twelding@lincolnctc.edu', firstName: 'Tom', lastName: 'Welder', schoolId: 'lincoln-votech' },
    { email: 'celectrical@lincolnctc.edu', firstName: 'Chris', lastName: 'Sparks', schoolId: 'lincoln-votech' },
    // Washington Middle School Teachers
    { email: 'jdavis@washingtonms.edu', firstName: 'Jennifer', lastName: 'Davis', schoolId: 'washington-middle' },
    { email: 'pjohnson@washingtonms.edu', firstName: 'Paul', lastName: 'Johnson', schoolId: 'washington-middle' },
    // Boston Elementary Teachers
    { email: 'emurphy@bostonelem.edu', firstName: 'Erin', lastName: 'Murphy', schoolId: 'boston-elementary' },
    { email: 'toconnor@bostonelem.edu', firstName: 'Tim', lastName: 'OConnor', schoolId: 'boston-elementary' },
    // Jefferson Elementary Teachers
    { email: 'mperez@jeffersonelem.edu', firstName: 'Maria', lastName: 'Perez', schoolId: 'jefferson-elementary' },
    { email: 'jramirez@jeffersonelem.edu', firstName: 'Jose', lastName: 'Ramirez', schoolId: 'jefferson-elementary' },
    // STEM Academy Teachers
    { email: 'rlee@stemacademy.edu', firstName: 'Richard', lastName: 'Lee', schoolId: 'stem-academy' },
    { email: 'sturing@stemacademy.edu', firstName: 'Sara', lastName: 'Turing', schoolId: 'stem-academy' },
    // Riverside Prep Teachers
    { email: 'aflores@riversideprep.edu', firstName: 'Ana', lastName: 'Flores', schoolId: 'riverside-prep' },
    { email: 'msantos@riversideprep.edu', firstName: 'Marco', lastName: 'Santos', schoolId: 'riverside-prep' }
  ];

  for (const teacher of teachers) {
    await prisma.user.upsert({
      where: { email: teacher.email },
      update: {},
      create: { ...teacher, passwordHash, role: 'TEACHER', isActive: true }
    });
  }

  // Students (across all school types)
  const students = [
    // Lincoln High School Students
    { email: 'emma.wilson@student.lincolnhs.edu', firstName: 'Emma', lastName: 'Wilson', schoolId: 'lincoln-high', gradeLevel: 10 },
    { email: 'james.brown@student.lincolnhs.edu', firstName: 'James', lastName: 'Brown', schoolId: 'lincoln-high', gradeLevel: 11 },
    { email: 'olivia.martinez@student.lincolnhs.edu', firstName: 'Olivia', lastName: 'Martinez', schoolId: 'lincoln-high', gradeLevel: 9 },
    { email: 'william.jones@student.lincolnhs.edu', firstName: 'William', lastName: 'Jones', schoolId: 'lincoln-high', gradeLevel: 12 },
    // Lincoln Middle School Students
    { email: 'alex.kim@student.lincolnms.edu', firstName: 'Alex', lastName: 'Kim', schoolId: 'lincoln-middle', gradeLevel: 6 },
    { email: 'maya.patel@student.lincolnms.edu', firstName: 'Maya', lastName: 'Patel', schoolId: 'lincoln-middle', gradeLevel: 7 },
    { email: 'ethan.lee@student.lincolnms.edu', firstName: 'Ethan', lastName: 'Lee', schoolId: 'lincoln-middle', gradeLevel: 8 },
    // Lincoln Elementary Students
    { email: 'lily.chen@student.lincolnelem.edu', firstName: 'Lily', lastName: 'Chen', schoolId: 'lincoln-elementary', gradeLevel: 0 },
    { email: 'jack.miller@student.lincolnelem.edu', firstName: 'Jack', lastName: 'Miller', schoolId: 'lincoln-elementary', gradeLevel: 2 },
    { email: 'sophie.taylor@student.lincolnelem.edu', firstName: 'Sophie', lastName: 'Taylor', schoolId: 'lincoln-elementary', gradeLevel: 4 },
    // Lincoln Preschool Students
    { email: 'max.davis@student.lincolnelc.edu', firstName: 'Max', lastName: 'Davis', schoolId: 'lincoln-preschool', gradeLevel: -2 },
    { email: 'zoe.garcia@student.lincolnelc.edu', firstName: 'Zoe', lastName: 'Garcia', schoolId: 'lincoln-preschool', gradeLevel: -1 },
    // Lincoln Vo-Tech Students
    { email: 'ryan.thompson@student.lincolnctc.edu', firstName: 'Ryan', lastName: 'Thompson', schoolId: 'lincoln-votech', gradeLevel: 10 },
    { email: 'ashley.white@student.lincolnctc.edu', firstName: 'Ashley', lastName: 'White', schoolId: 'lincoln-votech', gradeLevel: 11 },
    { email: 'brandon.harris@student.lincolnctc.edu', firstName: 'Brandon', lastName: 'Harris', schoolId: 'lincoln-votech', gradeLevel: 12 },
    // Washington Middle School Students
    { email: 'noah.taylor@student.washingtonms.edu', firstName: 'Noah', lastName: 'Taylor', schoolId: 'washington-middle', gradeLevel: 7 },
    { email: 'sophia.anderson@student.washingtonms.edu', firstName: 'Sophia', lastName: 'Anderson', schoolId: 'washington-middle', gradeLevel: 8 },
    // Boston Elementary Students
    { email: 'lucas.murphy@student.bostonelem.edu', firstName: 'Lucas', lastName: 'Murphy', schoolId: 'boston-elementary', gradeLevel: 3 },
    { email: 'mia.oconnor@student.bostonelem.edu', firstName: 'Mia', lastName: 'OConnor', schoolId: 'boston-elementary', gradeLevel: 5 },
    // Jefferson Elementary Students
    { email: 'diego.perez@student.jeffersonelem.edu', firstName: 'Diego', lastName: 'Perez', schoolId: 'jefferson-elementary', gradeLevel: 1 },
    { email: 'isabella.ramirez@student.jeffersonelem.edu', firstName: 'Isabella', lastName: 'Ramirez', schoolId: 'jefferson-elementary', gradeLevel: 4 },
    // STEM Academy Students
    { email: 'liam.thomas@student.stemacademy.edu', firstName: 'Liam', lastName: 'Thomas', schoolId: 'stem-academy', gradeLevel: 11 },
    { email: 'ava.jackson@student.stemacademy.edu', firstName: 'Ava', lastName: 'Jackson', schoolId: 'stem-academy', gradeLevel: 12 },
    // Riverside Prep Students
    { email: 'ethan.white@student.riversideprep.edu', firstName: 'Ethan', lastName: 'White', schoolId: 'riverside-prep', gradeLevel: 10 },
    { email: 'sofia.santos@student.riversideprep.edu', firstName: 'Sofia', lastName: 'Santos', schoolId: 'riverside-prep', gradeLevel: 6 }
  ];

  const createdStudents: any[] = [];
  for (const student of students) {
    const created = await prisma.user.upsert({
      where: { email: student.email },
      update: {},
      create: { ...student, passwordHash, role: 'STUDENT', isActive: true }
    });
    createdStudents.push(created);
  }
  console.log('Users seeded');

  // =====================
  // Subject Categories (10 categories - expanded for all school types)
  // =====================
  const categories = [
    // Early Childhood (Preschool & Pre-K)
    { code: 'early_childhood', name: 'Early Childhood', description: 'Foundational skills for preschool and pre-kindergarten', icon: '🧒', color: '#f472b6', order: 0 },
    // Core Academic Subjects
    { code: 'math', name: 'Mathematics', description: 'Numbers, equations, and problem-solving', icon: '📐', color: '#3b82f6', order: 1 },
    { code: 'science', name: 'Science', description: 'Explore the natural world', icon: '🔬', color: '#22c55e', order: 2 },
    { code: 'ela', name: 'English Language Arts', description: 'Reading, writing, and communication', icon: '📖', color: '#f59e0b', order: 3 },
    { code: 'history', name: 'History & Social Studies', description: 'Understanding our world and past', icon: '🌍', color: '#8b5cf6', order: 4 },
    { code: 'languages', name: 'World Languages', description: 'Learn new languages', icon: '🗣️', color: '#ec4899', order: 5 },
    { code: 'cs', name: 'Computer Science', description: 'Programming and technology', icon: '💻', color: '#06b6d4', order: 6 },
    // Vocational-Technical
    { code: 'vocational', name: 'Vocational & Technical', description: 'Career and technical education trades', icon: '🔧', color: '#64748b', order: 7 },
    // Arts & Electives
    { code: 'arts', name: 'Arts & Music', description: 'Visual arts, music, drama, and creative expression', icon: '🎨', color: '#a855f7', order: 8 },
    { code: 'pe_health', name: 'Physical Education & Health', description: 'Physical fitness, sports, and health education', icon: '💪', color: '#ef4444', order: 9 }
  ];

  const categoryMap: Record<string, any> = {};
  for (const cat of categories) {
    const created = await prisma.subjectCategory.upsert({
      where: { code: cat.code },
      update: cat,
      create: { ...cat, isActive: true }
    });
    categoryMap[cat.code] = created;
  }
  console.log('Subject categories seeded');

  // =====================
  // COMPREHENSIVE SUBJECTS (K-12 subjects)
  // =====================
  const subjects = [
    // MATH SUBJECTS - Elementary (K-5)
    { code: 'math-k', name: 'Kindergarten Math', description: 'Counting, numbers, and basic shapes', categoryCode: 'math', gradeRange: 'K', order: 1 },
    { code: 'math-1', name: 'First Grade Math', description: 'Addition, subtraction, place value', categoryCode: 'math', gradeRange: '1', order: 2 },
    { code: 'math-2', name: 'Second Grade Math', description: 'Addition, subtraction fluency, intro to multiplication', categoryCode: 'math', gradeRange: '2', order: 3 },
    { code: 'math-3', name: 'Third Grade Math', description: 'Multiplication, division, fractions intro', categoryCode: 'math', gradeRange: '3', order: 4 },
    { code: 'math-4', name: 'Fourth Grade Math', description: 'Multi-digit operations, fractions, decimals', categoryCode: 'math', gradeRange: '4', order: 5 },
    { code: 'math-5', name: 'Fifth Grade Math', description: 'Fractions, decimals, volume, coordinate plane', categoryCode: 'math', gradeRange: '5', order: 6 },
    // MATH SUBJECTS - Middle & High School
    { code: 'pre-algebra', name: 'Pre-Algebra', description: 'Foundation for algebra concepts', categoryCode: 'math', gradeRange: '6-8', order: 7 },
    { code: 'algebra-1', name: 'Algebra I', description: 'Linear equations and inequalities', categoryCode: 'math', gradeRange: '8-9', order: 2 },
    { code: 'algebra-2', name: 'Algebra II', description: 'Advanced algebraic concepts', categoryCode: 'math', gradeRange: '10-11', order: 3 },
    { code: 'geometry', name: 'Geometry', description: 'Shapes, proofs, and spatial reasoning', categoryCode: 'math', gradeRange: '9-10', order: 4 },
    { code: 'trigonometry', name: 'Trigonometry', description: 'Triangle relationships and functions', categoryCode: 'math', gradeRange: '10-11', order: 5 },
    { code: 'pre-calculus', name: 'Pre-Calculus', description: 'Preparation for calculus', categoryCode: 'math', gradeRange: '11-12', order: 6 },
    { code: 'calculus-ab', name: 'Calculus AB (AP)', description: 'Limits, derivatives, and integrals', categoryCode: 'math', gradeRange: '11-12', order: 7 },
    { code: 'calculus-bc', name: 'Calculus BC (AP)', description: 'Advanced calculus topics', categoryCode: 'math', gradeRange: '12', order: 8 },
    { code: 'statistics', name: 'Statistics (AP)', description: 'Data analysis and probability', categoryCode: 'math', gradeRange: '11-12', order: 9 },

    // SCIENCE SUBJECTS - Elementary (K-5)
    { code: 'science-k', name: 'Kindergarten Science', description: 'Weather, animals, and the senses', categoryCode: 'science', gradeRange: 'K', order: 1 },
    { code: 'science-1', name: 'First Grade Science', description: 'Plants, animals, and seasons', categoryCode: 'science', gradeRange: '1', order: 2 },
    { code: 'science-2', name: 'Second Grade Science', description: 'Life cycles, habitats, matter', categoryCode: 'science', gradeRange: '2', order: 3 },
    { code: 'science-3', name: 'Third Grade Science', description: 'Forces, motion, ecosystems', categoryCode: 'science', gradeRange: '3', order: 4 },
    { code: 'science-4', name: 'Fourth Grade Science', description: 'Energy, Earth systems, human body', categoryCode: 'science', gradeRange: '4', order: 5 },
    { code: 'science-5', name: 'Fifth Grade Science', description: 'Matter, Earth and space, organisms', categoryCode: 'science', gradeRange: '5', order: 6 },
    // SCIENCE SUBJECTS - Middle & High School
    { code: 'earth-science', name: 'Earth Science', description: 'Geology, meteorology, and astronomy', categoryCode: 'science', gradeRange: '8-9', order: 7 },
    { code: 'biology', name: 'Biology', description: 'Study of living organisms', categoryCode: 'science', gradeRange: '9-10', order: 2 },
    { code: 'ap-biology', name: 'Biology (AP)', description: 'College-level biology', categoryCode: 'science', gradeRange: '11-12', order: 3 },
    { code: 'chemistry', name: 'Chemistry', description: 'Matter and chemical reactions', categoryCode: 'science', gradeRange: '10-11', order: 4 },
    { code: 'ap-chemistry', name: 'Chemistry (AP)', description: 'Advanced chemistry concepts', categoryCode: 'science', gradeRange: '11-12', order: 5 },
    { code: 'physics', name: 'Physics', description: 'Motion, energy, and forces', categoryCode: 'science', gradeRange: '11-12', order: 6 },
    { code: 'ap-physics-1', name: 'Physics 1 (AP)', description: 'Algebra-based physics', categoryCode: 'science', gradeRange: '10-12', order: 7 },
    { code: 'ap-physics-c', name: 'Physics C (AP)', description: 'Calculus-based physics', categoryCode: 'science', gradeRange: '11-12', order: 8 },
    { code: 'environmental', name: 'Environmental Science', description: 'Ecology and environmental issues', categoryCode: 'science', gradeRange: '10-12', order: 9 },

    // ELA SUBJECTS - Elementary (K-5)
    { code: 'ela-k', name: 'Kindergarten ELA', description: 'Letter recognition, phonics, basic reading', categoryCode: 'ela', gradeRange: 'K', order: 1 },
    { code: 'ela-1', name: 'First Grade ELA', description: 'Beginning reading, phonics, simple writing', categoryCode: 'ela', gradeRange: '1', order: 2 },
    { code: 'ela-2', name: 'Second Grade ELA', description: 'Reading fluency, writing sentences, spelling', categoryCode: 'ela', gradeRange: '2', order: 3 },
    { code: 'ela-3', name: 'Third Grade ELA', description: 'Reading comprehension, paragraphs, grammar', categoryCode: 'ela', gradeRange: '3', order: 4 },
    { code: 'ela-4', name: 'Fourth Grade ELA', description: 'Reading strategies, multi-paragraph writing', categoryCode: 'ela', gradeRange: '4', order: 5 },
    { code: 'ela-5', name: 'Fifth Grade ELA', description: 'Literary analysis, essay writing, research', categoryCode: 'ela', gradeRange: '5', order: 6 },
    // ELA SUBJECTS - Middle & High School
    { code: 'english-6', name: 'English 6', description: 'Middle school English fundamentals', categoryCode: 'ela', gradeRange: '6', order: 7 },
    { code: 'english-7', name: 'English 7', description: 'Reading comprehension and writing', categoryCode: 'ela', gradeRange: '7', order: 2 },
    { code: 'english-8', name: 'English 8', description: 'Literary analysis and composition', categoryCode: 'ela', gradeRange: '8', order: 3 },
    { code: 'english-9', name: 'English 9', description: 'High school English introduction', categoryCode: 'ela', gradeRange: '9', order: 4 },
    { code: 'english-10', name: 'English 10', description: 'World literature and writing', categoryCode: 'ela', gradeRange: '10', order: 5 },
    { code: 'english-11', name: 'American Literature', description: 'American literary traditions', categoryCode: 'ela', gradeRange: '11', order: 6 },
    { code: 'english-12', name: 'British Literature', description: 'British literary traditions', categoryCode: 'ela', gradeRange: '12', order: 7 },
    { code: 'ap-lang', name: 'AP Language & Composition', description: 'Rhetoric and argumentation', categoryCode: 'ela', gradeRange: '11', order: 8 },
    { code: 'ap-lit', name: 'AP Literature & Composition', description: 'Advanced literary analysis', categoryCode: 'ela', gradeRange: '12', order: 9 },

    // SOCIAL STUDIES - Elementary (K-5)
    { code: 'social-k', name: 'Kindergarten Social Studies', description: 'Community, rules, and citizenship', categoryCode: 'history', gradeRange: 'K', order: 1 },
    { code: 'social-1', name: 'First Grade Social Studies', description: 'Families, neighborhoods, maps intro', categoryCode: 'history', gradeRange: '1', order: 2 },
    { code: 'social-2', name: 'Second Grade Social Studies', description: 'Communities, cultures, basic geography', categoryCode: 'history', gradeRange: '2', order: 3 },
    { code: 'social-3', name: 'Third Grade Social Studies', description: 'Local communities, government, economics', categoryCode: 'history', gradeRange: '3', order: 4 },
    { code: 'social-4', name: 'Fourth Grade Social Studies', description: 'State history, regions, Native Americans', categoryCode: 'history', gradeRange: '4', order: 5 },
    { code: 'social-5', name: 'Fifth Grade Social Studies', description: 'US history through Revolution, geography', categoryCode: 'history', gradeRange: '5', order: 6 },
    // HISTORY SUBJECTS - Middle & High School
    { code: 'world-geography', name: 'World Geography', description: 'Physical and human geography', categoryCode: 'history', gradeRange: '6-7', order: 7 },
    { code: 'world-history', name: 'World History', description: 'Major civilizations and events', categoryCode: 'history', gradeRange: '9-10', order: 2 },
    { code: 'ap-world-history', name: 'AP World History', description: 'College-level world history', categoryCode: 'history', gradeRange: '10-11', order: 3 },
    { code: 'us-history', name: 'US History', description: 'American history from colonization', categoryCode: 'history', gradeRange: '11', order: 4 },
    { code: 'ap-us-history', name: 'AP US History', description: 'Advanced American history', categoryCode: 'history', gradeRange: '11', order: 5 },
    { code: 'government', name: 'Government & Civics', description: 'Political systems and citizenship', categoryCode: 'history', gradeRange: '12', order: 6 },
    { code: 'ap-gov', name: 'AP US Government', description: 'American political systems', categoryCode: 'history', gradeRange: '12', order: 7 },
    { code: 'economics', name: 'Economics', description: 'Micro and macroeconomics', categoryCode: 'history', gradeRange: '12', order: 8 },

    // WORLD LANGUAGES
    { code: 'spanish-1', name: 'Spanish I', description: 'Beginning Spanish', categoryCode: 'languages', gradeRange: '9-12', order: 1 },
    { code: 'spanish-2', name: 'Spanish II', description: 'Intermediate Spanish', categoryCode: 'languages', gradeRange: '9-12', order: 2 },
    { code: 'spanish-3', name: 'Spanish III', description: 'Advanced Spanish', categoryCode: 'languages', gradeRange: '10-12', order: 3 },
    { code: 'ap-spanish', name: 'AP Spanish', description: 'College-level Spanish', categoryCode: 'languages', gradeRange: '11-12', order: 4 },
    { code: 'french-1', name: 'French I', description: 'Beginning French', categoryCode: 'languages', gradeRange: '9-12', order: 5 },
    { code: 'french-2', name: 'French II', description: 'Intermediate French', categoryCode: 'languages', gradeRange: '9-12', order: 6 },
    { code: 'mandarin-1', name: 'Mandarin Chinese I', description: 'Beginning Mandarin', categoryCode: 'languages', gradeRange: '9-12', order: 7 },

    // COMPUTER SCIENCE
    { code: 'intro-cs', name: 'Introduction to Computer Science', description: 'Computing fundamentals', categoryCode: 'cs', gradeRange: '9-10', order: 1 },
    { code: 'ap-csp', name: 'AP Computer Science Principles', description: 'Computing concepts and creativity', categoryCode: 'cs', gradeRange: '9-12', order: 2 },
    { code: 'ap-csa', name: 'AP Computer Science A', description: 'Java programming', categoryCode: 'cs', gradeRange: '10-12', order: 3 },
    { code: 'web-dev', name: 'Web Development', description: 'HTML, CSS, and JavaScript', categoryCode: 'cs', gradeRange: '9-12', order: 4 },
    { code: 'python', name: 'Python Programming', description: 'Python fundamentals', categoryCode: 'cs', gradeRange: '9-12', order: 5 },
    { code: 'data-science', name: 'Data Science', description: 'Data analysis and visualization', categoryCode: 'cs', gradeRange: '11-12', order: 6 },

    // =====================
    // EARLY CHILDHOOD (Preschool & Pre-K)
    // =====================
    { code: 'colors-shapes', name: 'Colors & Shapes', description: 'Color recognition and basic shapes', categoryCode: 'early_childhood', gradeRange: 'PK', order: 1 },
    { code: 'letters-abc', name: 'Letters & ABCs', description: 'Alphabet recognition and letter sounds', categoryCode: 'early_childhood', gradeRange: 'PK', order: 2 },
    { code: 'numbers-counting', name: 'Numbers & Counting', description: 'Numbers 1-10 and basic counting', categoryCode: 'early_childhood', gradeRange: 'PK', order: 3 },
    { code: 'social-skills', name: 'Social Skills', description: 'Sharing, taking turns, and making friends', categoryCode: 'early_childhood', gradeRange: 'PK', order: 4 },
    { code: 'motor-skills', name: 'Motor Skills', description: 'Fine and gross motor development', categoryCode: 'early_childhood', gradeRange: 'PK', order: 5 },
    { code: 'patterns-sorting', name: 'Patterns & Sorting', description: 'Recognizing and creating patterns', categoryCode: 'early_childhood', gradeRange: 'PK', order: 6 },
    { code: 'story-listening', name: 'Story Time & Listening', description: 'Listening comprehension and story elements', categoryCode: 'early_childhood', gradeRange: 'PK', order: 7 },
    { code: 'art-creativity', name: 'Art & Creativity', description: 'Drawing, painting, and creative expression', categoryCode: 'early_childhood', gradeRange: 'PK', order: 8 },

    // =====================
    // VOCATIONAL-TECHNICAL (Grades 9-12)
    // =====================
    // Automotive
    { code: 'auto-tech', name: 'Automotive Technology', description: 'Vehicle maintenance and repair fundamentals', categoryCode: 'vocational', gradeRange: '9-12', order: 1 },
    { code: 'auto-body', name: 'Auto Body & Collision', description: 'Body repair and refinishing', categoryCode: 'vocational', gradeRange: '9-12', order: 2 },
    { code: 'diesel-tech', name: 'Diesel Technology', description: 'Diesel engine repair and maintenance', categoryCode: 'vocational', gradeRange: '9-12', order: 3 },
    // Construction & Building Trades
    { code: 'welding', name: 'Welding & Metal Fabrication', description: 'Welding techniques and metal work', categoryCode: 'vocational', gradeRange: '9-12', order: 4 },
    { code: 'electrical', name: 'Electrical Technology', description: 'Electrical systems and wiring', categoryCode: 'vocational', gradeRange: '9-12', order: 5 },
    { code: 'plumbing', name: 'Plumbing', description: 'Plumbing systems installation and repair', categoryCode: 'vocational', gradeRange: '9-12', order: 6 },
    { code: 'hvac', name: 'HVAC/R', description: 'Heating, ventilation, air conditioning, and refrigeration', categoryCode: 'vocational', gradeRange: '9-12', order: 7 },
    { code: 'carpentry', name: 'Carpentry & Construction', description: 'Building construction and woodworking', categoryCode: 'vocational', gradeRange: '9-12', order: 8 },
    { code: 'construction-mgt', name: 'Construction Management', description: 'Project management in construction', categoryCode: 'vocational', gradeRange: '10-12', order: 9 },
    // Culinary & Hospitality
    { code: 'culinary', name: 'Culinary Arts', description: 'Cooking techniques and kitchen management', categoryCode: 'vocational', gradeRange: '9-12', order: 10 },
    { code: 'baking', name: 'Baking & Pastry', description: 'Baking, pastry arts, and desserts', categoryCode: 'vocational', gradeRange: '9-12', order: 11 },
    // Health Sciences
    { code: 'healthcare', name: 'Healthcare Careers', description: 'Introduction to health occupations', categoryCode: 'vocational', gradeRange: '9-12', order: 12 },
    { code: 'cna', name: 'Certified Nursing Assistant', description: 'CNA training and patient care', categoryCode: 'vocational', gradeRange: '10-12', order: 13 },
    { code: 'med-assist', name: 'Medical Assisting', description: 'Clinical and administrative medical skills', categoryCode: 'vocational', gradeRange: '10-12', order: 14 },
    { code: 'ems', name: 'Emergency Medical Services', description: 'EMT training and emergency response', categoryCode: 'vocational', gradeRange: '11-12', order: 15 },
    // Personal Services
    { code: 'cosmetology', name: 'Cosmetology', description: 'Hair, skin, and nail care', categoryCode: 'vocational', gradeRange: '10-12', order: 16 },
    { code: 'ece-career', name: 'Early Childhood Education', description: 'Child development and teaching', categoryCode: 'vocational', gradeRange: '10-12', order: 17 },
    // IT & Media
    { code: 'it-network', name: 'IT & Networking', description: 'Computer networking and IT support', categoryCode: 'vocational', gradeRange: '9-12', order: 18 },
    { code: 'graphic-design', name: 'Graphic Design', description: 'Visual design and digital media', categoryCode: 'vocational', gradeRange: '9-12', order: 19 },
    // Agriculture & Natural Resources
    { code: 'agriculture', name: 'Agriculture & Horticulture', description: 'Farming, plant science, and landscaping', categoryCode: 'vocational', gradeRange: '9-12', order: 20 },
    { code: 'vet-sci', name: 'Veterinary Science', description: 'Animal care and veterinary assisting', categoryCode: 'vocational', gradeRange: '9-12', order: 21 },
    // Manufacturing
    { code: 'manufacturing', name: 'Manufacturing & Machining', description: 'CNC machining and manufacturing processes', categoryCode: 'vocational', gradeRange: '9-12', order: 22 },
    // Public Safety
    { code: 'criminal-justice', name: 'Criminal Justice', description: 'Law enforcement and legal studies', categoryCode: 'vocational', gradeRange: '10-12', order: 23 },
    { code: 'fire-science', name: 'Fire Science', description: 'Fire fighting and prevention', categoryCode: 'vocational', gradeRange: '10-12', order: 24 },

    // =====================
    // ARTS & MUSIC (K-12)
    // =====================
    { code: 'art-fund', name: 'Art Fundamentals', description: 'Basic art concepts and techniques', categoryCode: 'arts', gradeRange: 'K-12', order: 1 },
    { code: 'drawing', name: 'Drawing & Painting', description: 'Drawing and painting techniques', categoryCode: 'arts', gradeRange: '3-12', order: 2 },
    { code: 'sculpture', name: 'Sculpture & Ceramics', description: '3D art and pottery', categoryCode: 'arts', gradeRange: '6-12', order: 3 },
    { code: 'ap-art', name: 'AP Art & Design', description: 'Portfolio-based art studies', categoryCode: 'arts', gradeRange: '10-12', order: 4 },
    { code: 'music-fund', name: 'Music Fundamentals', description: 'Basic music concepts and appreciation', categoryCode: 'arts', gradeRange: 'K-12', order: 5 },
    { code: 'choir', name: 'Choir', description: 'Vocal music and choral singing', categoryCode: 'arts', gradeRange: '3-12', order: 6 },
    { code: 'band', name: 'Band', description: 'Instrumental music performance', categoryCode: 'arts', gradeRange: '4-12', order: 7 },
    { code: 'orchestra', name: 'Orchestra', description: 'String and orchestral instruments', categoryCode: 'arts', gradeRange: '4-12', order: 8 },
    { code: 'music-theory', name: 'Music Theory', description: 'Understanding musical structure', categoryCode: 'arts', gradeRange: '9-12', order: 9 },
    { code: 'ap-music-theory', name: 'AP Music Theory', description: 'Advanced music theory and composition', categoryCode: 'arts', gradeRange: '10-12', order: 10 },
    { code: 'drama', name: 'Drama & Theater', description: 'Acting and theatrical performance', categoryCode: 'arts', gradeRange: '3-12', order: 11 },

    // =====================
    // PHYSICAL EDUCATION & HEALTH (K-12)
    // =====================
    { code: 'pe', name: 'Physical Education', description: 'Physical fitness and movement', categoryCode: 'pe_health', gradeRange: 'K-12', order: 1 },
    { code: 'health', name: 'Health Education', description: 'Personal health and wellness', categoryCode: 'pe_health', gradeRange: '3-12', order: 2 },
    { code: 'fitness', name: 'Fitness & Conditioning', description: 'Physical training and exercise', categoryCode: 'pe_health', gradeRange: '6-12', order: 3 },
    { code: 'team-sports', name: 'Team Sports', description: 'Basketball, soccer, volleyball, etc.', categoryCode: 'pe_health', gradeRange: '6-12', order: 4 },
    { code: 'lifetime-fitness', name: 'Lifetime Fitness', description: 'Lifelong health and fitness habits', categoryCode: 'pe_health', gradeRange: '9-12', order: 5 }
  ];

  const subjectMap: Record<string, any> = {};
  for (const subj of subjects) {
    const created = await prisma.subject.upsert({
      where: { code: subj.code },
      update: { name: subj.name, description: subj.description, gradeRange: subj.gradeRange, order: subj.order },
      create: {
        code: subj.code,
        name: subj.name,
        description: subj.description,
        categoryId: categoryMap[subj.categoryCode].id,
        gradeRange: subj.gradeRange,
        order: subj.order,
        isActive: true
      }
    });
    subjectMap[subj.code] = created;
  }
  console.log('Subjects seeded');

  // =====================
  // COMPREHENSIVE TOPICS (K-12 topics)
  // =====================
  const topics = [
    // KINDERGARTEN MATH TOPICS
    { code: 'counting-10', name: 'Counting to 10', subjectCode: 'math-k', gradeLevel: 0, order: 1 },
    { code: 'counting-20', name: 'Counting to 20', subjectCode: 'math-k', gradeLevel: 0, order: 2 },
    { code: 'number-recognition', name: 'Number Recognition', subjectCode: 'math-k', gradeLevel: 0, order: 3 },
    { code: 'shapes-basic', name: 'Basic Shapes', subjectCode: 'math-k', gradeLevel: 0, order: 4 },
    { code: 'comparing-numbers', name: 'Comparing Numbers', subjectCode: 'math-k', gradeLevel: 0, order: 5 },
    { code: 'sorting-classifying', name: 'Sorting and Classifying', subjectCode: 'math-k', gradeLevel: 0, order: 6 },

    // FIRST GRADE MATH TOPICS
    { code: 'addition-10', name: 'Addition Within 10', subjectCode: 'math-1', gradeLevel: 1, order: 1 },
    { code: 'subtraction-10', name: 'Subtraction Within 10', subjectCode: 'math-1', gradeLevel: 1, order: 2 },
    { code: 'addition-20', name: 'Addition Within 20', subjectCode: 'math-1', gradeLevel: 1, order: 3 },
    { code: 'place-value-intro', name: 'Place Value (Tens and Ones)', subjectCode: 'math-1', gradeLevel: 1, order: 4 },
    { code: 'telling-time-hour', name: 'Telling Time (Hour)', subjectCode: 'math-1', gradeLevel: 1, order: 5 },
    { code: 'shapes-2d-3d', name: '2D and 3D Shapes', subjectCode: 'math-1', gradeLevel: 1, order: 6 },

    // SECOND GRADE MATH TOPICS
    { code: 'addition-100', name: 'Addition Within 100', subjectCode: 'math-2', gradeLevel: 2, order: 1 },
    { code: 'subtraction-100', name: 'Subtraction Within 100', subjectCode: 'math-2', gradeLevel: 2, order: 2 },
    { code: 'place-value-hundreds', name: 'Place Value (Hundreds)', subjectCode: 'math-2', gradeLevel: 2, order: 3 },
    { code: 'measuring-length', name: 'Measuring Length', subjectCode: 'math-2', gradeLevel: 2, order: 4 },
    { code: 'money-coins', name: 'Money and Coins', subjectCode: 'math-2', gradeLevel: 2, order: 5 },
    { code: 'intro-multiplication', name: 'Introduction to Multiplication', subjectCode: 'math-2', gradeLevel: 2, order: 6 },

    // THIRD GRADE MATH TOPICS
    { code: 'multiplication-facts', name: 'Multiplication Facts', subjectCode: 'math-3', gradeLevel: 3, order: 1 },
    { code: 'division-facts', name: 'Division Facts', subjectCode: 'math-3', gradeLevel: 3, order: 2 },
    { code: 'fractions-intro', name: 'Introduction to Fractions', subjectCode: 'math-3', gradeLevel: 3, order: 3 },
    { code: 'area-perimeter-intro', name: 'Area and Perimeter', subjectCode: 'math-3', gradeLevel: 3, order: 4 },
    { code: 'word-problems-3', name: 'Two-Step Word Problems', subjectCode: 'math-3', gradeLevel: 3, order: 5 },
    { code: 'telling-time-minutes', name: 'Telling Time (Minutes)', subjectCode: 'math-3', gradeLevel: 3, order: 6 },

    // FOURTH GRADE MATH TOPICS
    { code: 'multi-digit-multiplication', name: 'Multi-Digit Multiplication', subjectCode: 'math-4', gradeLevel: 4, order: 1 },
    { code: 'long-division', name: 'Long Division', subjectCode: 'math-4', gradeLevel: 4, order: 2 },
    { code: 'fractions-equivalent', name: 'Equivalent Fractions', subjectCode: 'math-4', gradeLevel: 4, order: 3 },
    { code: 'fractions-add-sub', name: 'Adding & Subtracting Fractions', subjectCode: 'math-4', gradeLevel: 4, order: 4 },
    { code: 'decimals-intro', name: 'Introduction to Decimals', subjectCode: 'math-4', gradeLevel: 4, order: 5 },
    { code: 'angles-measuring', name: 'Measuring Angles', subjectCode: 'math-4', gradeLevel: 4, order: 6 },

    // FIFTH GRADE MATH TOPICS
    { code: 'fractions-multiply', name: 'Multiplying Fractions', subjectCode: 'math-5', gradeLevel: 5, order: 1 },
    { code: 'fractions-divide', name: 'Dividing Fractions', subjectCode: 'math-5', gradeLevel: 5, order: 2 },
    { code: 'decimals-operations', name: 'Decimal Operations', subjectCode: 'math-5', gradeLevel: 5, order: 3 },
    { code: 'volume-intro', name: 'Volume of 3D Shapes', subjectCode: 'math-5', gradeLevel: 5, order: 4 },
    { code: 'coordinate-plane-intro', name: 'Coordinate Plane', subjectCode: 'math-5', gradeLevel: 5, order: 5 },
    { code: 'order-operations', name: 'Order of Operations', subjectCode: 'math-5', gradeLevel: 5, order: 6 },

    // ELEMENTARY SCIENCE TOPICS (K-5)
    { code: 'five-senses', name: 'The Five Senses', subjectCode: 'science-k', gradeLevel: 0, order: 1 },
    { code: 'weather-basics', name: 'Weather and Seasons', subjectCode: 'science-k', gradeLevel: 0, order: 2 },
    { code: 'animals-pets', name: 'Animals and Pets', subjectCode: 'science-k', gradeLevel: 0, order: 3 },
    { code: 'plants-grow', name: 'How Plants Grow', subjectCode: 'science-1', gradeLevel: 1, order: 1 },
    { code: 'animal-habitats', name: 'Animal Habitats', subjectCode: 'science-1', gradeLevel: 1, order: 2 },
    { code: 'day-night', name: 'Day and Night', subjectCode: 'science-1', gradeLevel: 1, order: 3 },
    { code: 'life-cycles', name: 'Life Cycles', subjectCode: 'science-2', gradeLevel: 2, order: 1 },
    { code: 'matter-states', name: 'States of Matter', subjectCode: 'science-2', gradeLevel: 2, order: 2 },
    { code: 'habitats-ecosystems', name: 'Habitats and Ecosystems', subjectCode: 'science-2', gradeLevel: 2, order: 3 },
    { code: 'forces-motion-simple', name: 'Forces and Motion', subjectCode: 'science-3', gradeLevel: 3, order: 1 },
    { code: 'simple-machines', name: 'Simple Machines', subjectCode: 'science-3', gradeLevel: 3, order: 2 },
    { code: 'food-chains', name: 'Food Chains', subjectCode: 'science-3', gradeLevel: 3, order: 3 },
    { code: 'energy-forms', name: 'Forms of Energy', subjectCode: 'science-4', gradeLevel: 4, order: 1 },
    { code: 'earth-layers', name: 'Earth\'s Layers', subjectCode: 'science-4', gradeLevel: 4, order: 2 },
    { code: 'human-body-intro', name: 'Human Body Systems Intro', subjectCode: 'science-4', gradeLevel: 4, order: 3 },
    { code: 'matter-properties', name: 'Properties of Matter', subjectCode: 'science-5', gradeLevel: 5, order: 1 },
    { code: 'solar-system', name: 'Solar System', subjectCode: 'science-5', gradeLevel: 5, order: 2 },
    { code: 'ecosystems-advanced', name: 'Ecosystems', subjectCode: 'science-5', gradeLevel: 5, order: 3 },

    // ELEMENTARY ELA TOPICS (K-5)
    { code: 'letter-sounds', name: 'Letter Sounds', subjectCode: 'ela-k', gradeLevel: 0, order: 1 },
    { code: 'sight-words-k', name: 'Sight Words', subjectCode: 'ela-k', gradeLevel: 0, order: 2 },
    { code: 'rhyming-words', name: 'Rhyming Words', subjectCode: 'ela-k', gradeLevel: 0, order: 3 },
    { code: 'phonics-blends', name: 'Phonics and Blends', subjectCode: 'ela-1', gradeLevel: 1, order: 1 },
    { code: 'reading-simple', name: 'Reading Simple Sentences', subjectCode: 'ela-1', gradeLevel: 1, order: 2 },
    { code: 'writing-sentences', name: 'Writing Sentences', subjectCode: 'ela-1', gradeLevel: 1, order: 3 },
    { code: 'reading-fluency', name: 'Reading Fluency', subjectCode: 'ela-2', gradeLevel: 2, order: 1 },
    { code: 'spelling-patterns', name: 'Spelling Patterns', subjectCode: 'ela-2', gradeLevel: 2, order: 2 },
    { code: 'complete-sentences', name: 'Complete Sentences', subjectCode: 'ela-2', gradeLevel: 2, order: 3 },
    { code: 'reading-comprehension-3', name: 'Reading Comprehension', subjectCode: 'ela-3', gradeLevel: 3, order: 1 },
    { code: 'paragraph-writing', name: 'Paragraph Writing', subjectCode: 'ela-3', gradeLevel: 3, order: 2 },
    { code: 'grammar-nouns-verbs', name: 'Nouns and Verbs', subjectCode: 'ela-3', gradeLevel: 3, order: 3 },
    { code: 'main-idea', name: 'Main Idea and Details', subjectCode: 'ela-4', gradeLevel: 4, order: 1 },
    { code: 'informative-writing', name: 'Informative Writing', subjectCode: 'ela-4', gradeLevel: 4, order: 2 },
    { code: 'vocabulary-context', name: 'Vocabulary in Context', subjectCode: 'ela-4', gradeLevel: 4, order: 3 },
    { code: 'literary-elements', name: 'Literary Elements', subjectCode: 'ela-5', gradeLevel: 5, order: 1 },
    { code: 'essay-writing-intro', name: 'Essay Writing', subjectCode: 'ela-5', gradeLevel: 5, order: 2 },
    { code: 'research-skills', name: 'Research Skills', subjectCode: 'ela-5', gradeLevel: 5, order: 3 },

    // ELEMENTARY SOCIAL STUDIES TOPICS (K-5)
    { code: 'rules-school', name: 'Rules at School', subjectCode: 'social-k', gradeLevel: 0, order: 1 },
    { code: 'community-helpers', name: 'Community Helpers', subjectCode: 'social-k', gradeLevel: 0, order: 2 },
    { code: 'families-traditions', name: 'Families and Traditions', subjectCode: 'social-1', gradeLevel: 1, order: 1 },
    { code: 'maps-globes', name: 'Maps and Globes', subjectCode: 'social-1', gradeLevel: 1, order: 2 },
    { code: 'communities-urban-rural', name: 'Urban and Rural Communities', subjectCode: 'social-2', gradeLevel: 2, order: 1 },
    { code: 'cultures-around-world', name: 'Cultures Around the World', subjectCode: 'social-2', gradeLevel: 2, order: 2 },
    { code: 'local-government', name: 'Local Government', subjectCode: 'social-3', gradeLevel: 3, order: 1 },
    { code: 'economics-basics', name: 'Basic Economics', subjectCode: 'social-3', gradeLevel: 3, order: 2 },
    { code: 'state-history', name: 'State History', subjectCode: 'social-4', gradeLevel: 4, order: 1 },
    { code: 'us-regions', name: 'US Regions', subjectCode: 'social-4', gradeLevel: 4, order: 2 },
    { code: 'native-americans', name: 'Native American History', subjectCode: 'social-4', gradeLevel: 4, order: 3 },
    { code: 'exploration-colonization', name: 'Exploration and Colonization', subjectCode: 'social-5', gradeLevel: 5, order: 1 },
    { code: 'american-revolution-intro', name: 'American Revolution', subjectCode: 'social-5', gradeLevel: 5, order: 2 },

    // ALGEBRA I TOPICS
    { code: 'variables-expressions', name: 'Variables & Expressions', subjectCode: 'algebra-1', gradeLevel: 8, order: 1 },
    { code: 'linear-equations', name: 'Linear Equations', subjectCode: 'algebra-1', gradeLevel: 8, order: 2 },
    { code: 'inequalities', name: 'Inequalities', subjectCode: 'algebra-1', gradeLevel: 8, order: 3 },
    { code: 'graphing-linear', name: 'Graphing Linear Equations', subjectCode: 'algebra-1', gradeLevel: 9, order: 4 },
    { code: 'systems-equations', name: 'Systems of Equations', subjectCode: 'algebra-1', gradeLevel: 9, order: 5 },
    { code: 'polynomials', name: 'Polynomials', subjectCode: 'algebra-1', gradeLevel: 9, order: 6 },
    { code: 'factoring', name: 'Factoring', subjectCode: 'algebra-1', gradeLevel: 9, order: 7 },
    { code: 'quadratic-equations', name: 'Quadratic Equations', subjectCode: 'algebra-1', gradeLevel: 9, order: 8 },

    // ALGEBRA II TOPICS
    { code: 'complex-numbers', name: 'Complex Numbers', subjectCode: 'algebra-2', gradeLevel: 10, order: 1 },
    { code: 'polynomial-functions', name: 'Polynomial Functions', subjectCode: 'algebra-2', gradeLevel: 10, order: 2 },
    { code: 'rational-expressions', name: 'Rational Expressions', subjectCode: 'algebra-2', gradeLevel: 10, order: 3 },
    { code: 'exponential-functions', name: 'Exponential Functions', subjectCode: 'algebra-2', gradeLevel: 10, order: 4 },
    { code: 'logarithms', name: 'Logarithms', subjectCode: 'algebra-2', gradeLevel: 10, order: 5 },
    { code: 'sequences-series', name: 'Sequences & Series', subjectCode: 'algebra-2', gradeLevel: 11, order: 6 },

    // GEOMETRY TOPICS
    { code: 'points-lines-planes', name: 'Points, Lines, and Planes', subjectCode: 'geometry', gradeLevel: 9, order: 1 },
    { code: 'angles', name: 'Angles and Their Measures', subjectCode: 'geometry', gradeLevel: 9, order: 2 },
    { code: 'parallel-perpendicular', name: 'Parallel & Perpendicular Lines', subjectCode: 'geometry', gradeLevel: 9, order: 3 },
    { code: 'triangles', name: 'Triangles', subjectCode: 'geometry', gradeLevel: 9, order: 4 },
    { code: 'triangle-congruence', name: 'Triangle Congruence', subjectCode: 'geometry', gradeLevel: 9, order: 5 },
    { code: 'triangle-similarity', name: 'Similar Triangles', subjectCode: 'geometry', gradeLevel: 10, order: 6 },
    { code: 'right-triangles', name: 'Right Triangles & Trigonometry', subjectCode: 'geometry', gradeLevel: 10, order: 7 },
    { code: 'quadrilaterals', name: 'Quadrilaterals', subjectCode: 'geometry', gradeLevel: 10, order: 8 },
    { code: 'circles', name: 'Circles', subjectCode: 'geometry', gradeLevel: 10, order: 9 },
    { code: 'area-perimeter', name: 'Area & Perimeter', subjectCode: 'geometry', gradeLevel: 10, order: 10 },
    { code: 'volume-surface-area', name: 'Volume & Surface Area', subjectCode: 'geometry', gradeLevel: 10, order: 11 },
    { code: 'geometric-proofs', name: 'Geometric Proofs', subjectCode: 'geometry', gradeLevel: 10, order: 12 },

    // BIOLOGY TOPICS
    { code: 'scientific-method', name: 'Scientific Method', subjectCode: 'biology', gradeLevel: 9, order: 1 },
    { code: 'cell-structure', name: 'Cell Structure', subjectCode: 'biology', gradeLevel: 9, order: 2 },
    { code: 'cell-membrane', name: 'Cell Membrane & Transport', subjectCode: 'biology', gradeLevel: 9, order: 3 },
    { code: 'photosynthesis', name: 'Photosynthesis', subjectCode: 'biology', gradeLevel: 9, order: 4 },
    { code: 'cellular-respiration', name: 'Cellular Respiration', subjectCode: 'biology', gradeLevel: 9, order: 5 },
    { code: 'cell-division', name: 'Cell Division (Mitosis & Meiosis)', subjectCode: 'biology', gradeLevel: 9, order: 6 },
    { code: 'dna-structure', name: 'DNA Structure & Replication', subjectCode: 'biology', gradeLevel: 10, order: 7 },
    { code: 'protein-synthesis', name: 'Protein Synthesis', subjectCode: 'biology', gradeLevel: 10, order: 8 },
    { code: 'genetics-mendel', name: 'Mendelian Genetics', subjectCode: 'biology', gradeLevel: 10, order: 9 },
    { code: 'evolution', name: 'Evolution & Natural Selection', subjectCode: 'biology', gradeLevel: 10, order: 10 },
    { code: 'ecology', name: 'Ecology & Ecosystems', subjectCode: 'biology', gradeLevel: 10, order: 11 },
    { code: 'human-body-systems', name: 'Human Body Systems', subjectCode: 'biology', gradeLevel: 10, order: 12 },

    // CHEMISTRY TOPICS
    { code: 'atomic-structure', name: 'Atomic Structure', subjectCode: 'chemistry', gradeLevel: 10, order: 1 },
    { code: 'periodic-table', name: 'Periodic Table', subjectCode: 'chemistry', gradeLevel: 10, order: 2 },
    { code: 'chemical-bonding', name: 'Chemical Bonding', subjectCode: 'chemistry', gradeLevel: 10, order: 3 },
    { code: 'chemical-reactions', name: 'Chemical Reactions', subjectCode: 'chemistry', gradeLevel: 10, order: 4 },
    { code: 'stoichiometry', name: 'Stoichiometry', subjectCode: 'chemistry', gradeLevel: 10, order: 5 },
    { code: 'states-of-matter', name: 'States of Matter', subjectCode: 'chemistry', gradeLevel: 10, order: 6 },
    { code: 'solutions', name: 'Solutions & Concentration', subjectCode: 'chemistry', gradeLevel: 11, order: 7 },
    { code: 'acids-bases', name: 'Acids & Bases', subjectCode: 'chemistry', gradeLevel: 11, order: 8 },
    { code: 'thermochemistry', name: 'Thermochemistry', subjectCode: 'chemistry', gradeLevel: 11, order: 9 },
    { code: 'equilibrium', name: 'Chemical Equilibrium', subjectCode: 'chemistry', gradeLevel: 11, order: 10 },

    // PHYSICS TOPICS
    { code: 'motion-1d', name: 'Motion in One Dimension', subjectCode: 'physics', gradeLevel: 11, order: 1 },
    { code: 'motion-2d', name: 'Motion in Two Dimensions', subjectCode: 'physics', gradeLevel: 11, order: 2 },
    { code: 'newtons-laws', name: "Newton's Laws of Motion", subjectCode: 'physics', gradeLevel: 11, order: 3 },
    { code: 'work-energy', name: 'Work & Energy', subjectCode: 'physics', gradeLevel: 11, order: 4 },
    { code: 'momentum', name: 'Momentum & Collisions', subjectCode: 'physics', gradeLevel: 11, order: 5 },
    { code: 'circular-motion', name: 'Circular Motion', subjectCode: 'physics', gradeLevel: 11, order: 6 },
    { code: 'gravitation', name: 'Gravitation', subjectCode: 'physics', gradeLevel: 11, order: 7 },
    { code: 'waves', name: 'Waves & Sound', subjectCode: 'physics', gradeLevel: 11, order: 8 },
    { code: 'electricity', name: 'Electricity & Circuits', subjectCode: 'physics', gradeLevel: 12, order: 9 },
    { code: 'magnetism', name: 'Magnetism', subjectCode: 'physics', gradeLevel: 12, order: 10 },

    // US HISTORY TOPICS
    { code: 'colonial-america', name: 'Colonial America', subjectCode: 'us-history', gradeLevel: 11, order: 1 },
    { code: 'american-revolution', name: 'American Revolution', subjectCode: 'us-history', gradeLevel: 11, order: 2 },
    { code: 'constitution', name: 'Constitution & Early Republic', subjectCode: 'us-history', gradeLevel: 11, order: 3 },
    { code: 'westward-expansion', name: 'Westward Expansion', subjectCode: 'us-history', gradeLevel: 11, order: 4 },
    { code: 'civil-war', name: 'Civil War & Reconstruction', subjectCode: 'us-history', gradeLevel: 11, order: 5 },
    { code: 'industrialization', name: 'Industrialization', subjectCode: 'us-history', gradeLevel: 11, order: 6 },
    { code: 'progressive-era', name: 'Progressive Era', subjectCode: 'us-history', gradeLevel: 11, order: 7 },
    { code: 'world-war-1', name: 'World War I', subjectCode: 'us-history', gradeLevel: 11, order: 8 },
    { code: 'great-depression', name: 'Great Depression & New Deal', subjectCode: 'us-history', gradeLevel: 11, order: 9 },
    { code: 'world-war-2', name: 'World War II', subjectCode: 'us-history', gradeLevel: 11, order: 10 },
    { code: 'cold-war', name: 'Cold War', subjectCode: 'us-history', gradeLevel: 11, order: 11 },
    { code: 'civil-rights', name: 'Civil Rights Movement', subjectCode: 'us-history', gradeLevel: 11, order: 12 },

    // COMPUTER SCIENCE TOPICS
    { code: 'intro-programming', name: 'Introduction to Programming', subjectCode: 'intro-cs', gradeLevel: 9, order: 1 },
    { code: 'variables-data-types', name: 'Variables & Data Types', subjectCode: 'intro-cs', gradeLevel: 9, order: 2 },
    { code: 'conditionals', name: 'Conditionals', subjectCode: 'intro-cs', gradeLevel: 9, order: 3 },
    { code: 'loops', name: 'Loops', subjectCode: 'intro-cs', gradeLevel: 9, order: 4 },
    { code: 'functions-cs', name: 'Functions', subjectCode: 'intro-cs', gradeLevel: 9, order: 5 },
    { code: 'arrays', name: 'Arrays & Lists', subjectCode: 'intro-cs', gradeLevel: 10, order: 6 },
    { code: 'algorithms', name: 'Basic Algorithms', subjectCode: 'ap-csa', gradeLevel: 10, order: 1 },
    { code: 'oop', name: 'Object-Oriented Programming', subjectCode: 'ap-csa', gradeLevel: 10, order: 2 },
    { code: 'recursion', name: 'Recursion', subjectCode: 'ap-csa', gradeLevel: 11, order: 3 },
    { code: 'sorting-searching', name: 'Sorting & Searching', subjectCode: 'ap-csa', gradeLevel: 11, order: 4 },

    // =====================
    // EARLY CHILDHOOD TOPICS (Preschool & Pre-K)
    // =====================
    // Colors & Shapes
    { code: 'ec-colors-primary', name: 'Primary Colors', subjectCode: 'colors-shapes', gradeLevel: -2, order: 1 },
    { code: 'ec-colors-secondary', name: 'Secondary Colors', subjectCode: 'colors-shapes', gradeLevel: -1, order: 2 },
    { code: 'ec-shapes-circle-square', name: 'Circles and Squares', subjectCode: 'colors-shapes', gradeLevel: -2, order: 3 },
    { code: 'ec-shapes-triangle-rectangle', name: 'Triangles and Rectangles', subjectCode: 'colors-shapes', gradeLevel: -1, order: 4 },
    // Letters & ABCs
    { code: 'ec-letters-az', name: 'Letters A-Z Recognition', subjectCode: 'letters-abc', gradeLevel: -2, order: 1 },
    { code: 'ec-letter-sounds', name: 'Letter Sounds', subjectCode: 'letters-abc', gradeLevel: -1, order: 2 },
    { code: 'ec-writing-letters', name: 'Writing Letters', subjectCode: 'letters-abc', gradeLevel: -1, order: 3 },
    // Numbers & Counting
    { code: 'ec-numbers-1-5', name: 'Numbers 1-5', subjectCode: 'numbers-counting', gradeLevel: -2, order: 1 },
    { code: 'ec-numbers-6-10', name: 'Numbers 6-10', subjectCode: 'numbers-counting', gradeLevel: -1, order: 2 },
    { code: 'ec-counting-objects', name: 'Counting Objects', subjectCode: 'numbers-counting', gradeLevel: -2, order: 3 },
    // Social Skills
    { code: 'ec-sharing', name: 'Sharing with Others', subjectCode: 'social-skills', gradeLevel: -2, order: 1 },
    { code: 'ec-taking-turns', name: 'Taking Turns', subjectCode: 'social-skills', gradeLevel: -2, order: 2 },
    { code: 'ec-making-friends', name: 'Making Friends', subjectCode: 'social-skills', gradeLevel: -1, order: 3 },
    // Motor Skills
    { code: 'ec-cutting-scissors', name: 'Using Scissors', subjectCode: 'motor-skills', gradeLevel: -1, order: 1 },
    { code: 'ec-holding-pencil', name: 'Holding a Pencil', subjectCode: 'motor-skills', gradeLevel: -2, order: 2 },
    { code: 'ec-tracing-lines', name: 'Tracing Lines', subjectCode: 'motor-skills', gradeLevel: -2, order: 3 },

    // =====================
    // VOCATIONAL-TECHNICAL TOPICS
    // =====================
    // Automotive Technology
    { code: 'voc-auto-safety', name: 'Shop Safety', subjectCode: 'auto-tech', gradeLevel: 9, order: 1 },
    { code: 'voc-auto-tools', name: 'Hand Tools & Equipment', subjectCode: 'auto-tech', gradeLevel: 9, order: 2 },
    { code: 'voc-auto-engines', name: 'Engine Fundamentals', subjectCode: 'auto-tech', gradeLevel: 10, order: 3 },
    { code: 'voc-auto-brakes', name: 'Brake Systems', subjectCode: 'auto-tech', gradeLevel: 10, order: 4 },
    { code: 'voc-auto-electrical', name: 'Automotive Electrical', subjectCode: 'auto-tech', gradeLevel: 11, order: 5 },
    { code: 'voc-auto-diagnostics', name: 'Diagnostics & Troubleshooting', subjectCode: 'auto-tech', gradeLevel: 12, order: 6 },
    // Welding
    { code: 'voc-weld-safety', name: 'Welding Safety', subjectCode: 'welding', gradeLevel: 9, order: 1 },
    { code: 'voc-weld-mig', name: 'MIG Welding', subjectCode: 'welding', gradeLevel: 10, order: 2 },
    { code: 'voc-weld-tig', name: 'TIG Welding', subjectCode: 'welding', gradeLevel: 11, order: 3 },
    { code: 'voc-weld-stick', name: 'Stick Welding', subjectCode: 'welding', gradeLevel: 10, order: 4 },
    { code: 'voc-weld-blueprint', name: 'Blueprint Reading', subjectCode: 'welding', gradeLevel: 11, order: 5 },
    // Electrical
    { code: 'voc-elec-theory', name: 'Electrical Theory', subjectCode: 'electrical', gradeLevel: 9, order: 1 },
    { code: 'voc-elec-code', name: 'National Electrical Code', subjectCode: 'electrical', gradeLevel: 10, order: 2 },
    { code: 'voc-elec-residential', name: 'Residential Wiring', subjectCode: 'electrical', gradeLevel: 10, order: 3 },
    { code: 'voc-elec-commercial', name: 'Commercial Wiring', subjectCode: 'electrical', gradeLevel: 11, order: 4 },
    { code: 'voc-elec-motors', name: 'Motors & Controls', subjectCode: 'electrical', gradeLevel: 12, order: 5 },
    // Culinary Arts
    { code: 'voc-culinary-safety', name: 'Kitchen Safety & Sanitation', subjectCode: 'culinary', gradeLevel: 9, order: 1 },
    { code: 'voc-culinary-knife', name: 'Knife Skills', subjectCode: 'culinary', gradeLevel: 9, order: 2 },
    { code: 'voc-culinary-methods', name: 'Cooking Methods', subjectCode: 'culinary', gradeLevel: 10, order: 3 },
    { code: 'voc-culinary-baking', name: 'Baking Fundamentals', subjectCode: 'culinary', gradeLevel: 10, order: 4 },
    { code: 'voc-culinary-menu', name: 'Menu Planning', subjectCode: 'culinary', gradeLevel: 11, order: 5 },
    { code: 'voc-culinary-management', name: 'Kitchen Management', subjectCode: 'culinary', gradeLevel: 12, order: 6 },
    // Healthcare
    { code: 'voc-health-medical-terms', name: 'Medical Terminology', subjectCode: 'healthcare', gradeLevel: 9, order: 1 },
    { code: 'voc-health-anatomy', name: 'Basic Anatomy', subjectCode: 'healthcare', gradeLevel: 10, order: 2 },
    { code: 'voc-health-vital-signs', name: 'Vital Signs', subjectCode: 'healthcare', gradeLevel: 10, order: 3 },
    { code: 'voc-health-patient-care', name: 'Patient Care', subjectCode: 'healthcare', gradeLevel: 11, order: 4 },
    { code: 'voc-health-infection-control', name: 'Infection Control', subjectCode: 'healthcare', gradeLevel: 11, order: 5 },
    // CNA
    { code: 'voc-cna-personal-care', name: 'Personal Care Skills', subjectCode: 'cna', gradeLevel: 10, order: 1 },
    { code: 'voc-cna-mobility', name: 'Patient Mobility', subjectCode: 'cna', gradeLevel: 11, order: 2 },
    { code: 'voc-cna-documentation', name: 'Documentation', subjectCode: 'cna', gradeLevel: 11, order: 3 },
    // Carpentry
    { code: 'voc-carp-safety', name: 'Construction Safety', subjectCode: 'carpentry', gradeLevel: 9, order: 1 },
    { code: 'voc-carp-tools', name: 'Hand & Power Tools', subjectCode: 'carpentry', gradeLevel: 9, order: 2 },
    { code: 'voc-carp-framing', name: 'Framing', subjectCode: 'carpentry', gradeLevel: 10, order: 3 },
    { code: 'voc-carp-roofing', name: 'Roofing', subjectCode: 'carpentry', gradeLevel: 11, order: 4 },
    { code: 'voc-carp-finishing', name: 'Finish Carpentry', subjectCode: 'carpentry', gradeLevel: 12, order: 5 },
    // IT & Networking
    { code: 'voc-it-hardware', name: 'Computer Hardware', subjectCode: 'it-network', gradeLevel: 9, order: 1 },
    { code: 'voc-it-os', name: 'Operating Systems', subjectCode: 'it-network', gradeLevel: 10, order: 2 },
    { code: 'voc-it-networking', name: 'Network Fundamentals', subjectCode: 'it-network', gradeLevel: 10, order: 3 },
    { code: 'voc-it-security', name: 'Network Security', subjectCode: 'it-network', gradeLevel: 11, order: 4 },
    { code: 'voc-it-troubleshoot', name: 'Troubleshooting', subjectCode: 'it-network', gradeLevel: 11, order: 5 },
    // Cosmetology
    { code: 'voc-cosmo-hair-basics', name: 'Hair Care Basics', subjectCode: 'cosmetology', gradeLevel: 10, order: 1 },
    { code: 'voc-cosmo-cutting', name: 'Hair Cutting', subjectCode: 'cosmetology', gradeLevel: 11, order: 2 },
    { code: 'voc-cosmo-color', name: 'Hair Coloring', subjectCode: 'cosmetology', gradeLevel: 11, order: 3 },
    { code: 'voc-cosmo-skin', name: 'Skin Care', subjectCode: 'cosmetology', gradeLevel: 11, order: 4 },
    { code: 'voc-cosmo-nails', name: 'Nail Technology', subjectCode: 'cosmetology', gradeLevel: 12, order: 5 },

    // =====================
    // ARTS & MUSIC TOPICS
    // =====================
    // Art Fundamentals
    { code: 'art-elements', name: 'Elements of Art', subjectCode: 'art-fund', gradeLevel: 3, order: 1 },
    { code: 'art-principles', name: 'Principles of Design', subjectCode: 'art-fund', gradeLevel: 4, order: 2 },
    { code: 'art-color-theory', name: 'Color Theory', subjectCode: 'art-fund', gradeLevel: 5, order: 3 },
    { code: 'art-perspective', name: 'Perspective Drawing', subjectCode: 'drawing', gradeLevel: 6, order: 1 },
    { code: 'art-shading', name: 'Shading Techniques', subjectCode: 'drawing', gradeLevel: 7, order: 2 },
    { code: 'art-composition', name: 'Composition', subjectCode: 'drawing', gradeLevel: 8, order: 3 },
    // Music
    { code: 'music-notes', name: 'Reading Music Notes', subjectCode: 'music-fund', gradeLevel: 3, order: 1 },
    { code: 'music-rhythm', name: 'Rhythm & Beat', subjectCode: 'music-fund', gradeLevel: 4, order: 2 },
    { code: 'music-instruments', name: 'Instrument Families', subjectCode: 'music-fund', gradeLevel: 5, order: 3 },
    { code: 'music-scales', name: 'Scales & Keys', subjectCode: 'music-theory', gradeLevel: 9, order: 1 },
    { code: 'music-chords', name: 'Chords & Harmony', subjectCode: 'music-theory', gradeLevel: 10, order: 2 },
    { code: 'music-ear-training', name: 'Ear Training', subjectCode: 'music-theory', gradeLevel: 11, order: 3 },
    // Drama
    { code: 'drama-basics', name: 'Theater Basics', subjectCode: 'drama', gradeLevel: 6, order: 1 },
    { code: 'drama-acting', name: 'Acting Techniques', subjectCode: 'drama', gradeLevel: 7, order: 2 },
    { code: 'drama-improv', name: 'Improvisation', subjectCode: 'drama', gradeLevel: 8, order: 3 },
    { code: 'drama-stagecraft', name: 'Stagecraft', subjectCode: 'drama', gradeLevel: 9, order: 4 },

    // =====================
    // PHYSICAL EDUCATION & HEALTH TOPICS
    // =====================
    // Physical Education
    { code: 'pe-fitness-basics', name: 'Fitness Basics', subjectCode: 'pe', gradeLevel: 3, order: 1 },
    { code: 'pe-locomotor', name: 'Locomotor Skills', subjectCode: 'pe', gradeLevel: 0, order: 2 },
    { code: 'pe-ball-skills', name: 'Ball Handling Skills', subjectCode: 'pe', gradeLevel: 2, order: 3 },
    { code: 'pe-team-games', name: 'Team Games', subjectCode: 'team-sports', gradeLevel: 6, order: 1 },
    { code: 'pe-basketball-skills', name: 'Basketball Skills', subjectCode: 'team-sports', gradeLevel: 7, order: 2 },
    { code: 'pe-soccer-skills', name: 'Soccer Skills', subjectCode: 'team-sports', gradeLevel: 7, order: 3 },
    { code: 'pe-volleyball-skills', name: 'Volleyball Skills', subjectCode: 'team-sports', gradeLevel: 8, order: 4 },
    // Health Education
    { code: 'health-nutrition', name: 'Nutrition Basics', subjectCode: 'health', gradeLevel: 4, order: 1 },
    { code: 'health-hygiene', name: 'Personal Hygiene', subjectCode: 'health', gradeLevel: 3, order: 2 },
    { code: 'health-safety', name: 'Safety & First Aid', subjectCode: 'health', gradeLevel: 5, order: 3 },
    { code: 'health-mental', name: 'Mental Health', subjectCode: 'health', gradeLevel: 6, order: 4 },
    { code: 'health-substance', name: 'Substance Awareness', subjectCode: 'health', gradeLevel: 7, order: 5 },
    // Fitness
    { code: 'fitness-cardio', name: 'Cardiovascular Training', subjectCode: 'fitness', gradeLevel: 9, order: 1 },
    { code: 'fitness-strength', name: 'Strength Training', subjectCode: 'fitness', gradeLevel: 10, order: 2 },
    { code: 'fitness-flexibility', name: 'Flexibility & Stretching', subjectCode: 'fitness', gradeLevel: 9, order: 3 },
    { code: 'fitness-workout-plan', name: 'Creating Workout Plans', subjectCode: 'fitness', gradeLevel: 11, order: 4 }
  ];

  const topicMap: Record<string, any> = {};
  for (const topic of topics) {
    if (subjectMap[topic.subjectCode]) {
      const created = await prisma.topic.upsert({
        where: { code: topic.code },
        update: { name: topic.name, gradeLevel: topic.gradeLevel, order: topic.order },
        create: {
          code: topic.code,
          name: topic.name,
          description: `Learn about ${topic.name}`,
          subjectId: subjectMap[topic.subjectCode].id,
          gradeLevel: topic.gradeLevel,
          order: topic.order,
          isActive: true
        }
      });
      topicMap[topic.code] = created;
    }
  }
  console.log('Topics seeded');

  // =====================
  // LESSON SHELLS (Pre-populated for all topics)
  // =====================
  // Get system user for creating lessons
  const systemAdmin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' }
  });

  if (systemAdmin) {
    // Generate rich lesson content for each topic using AI-assisted generator
    let lessonCount = 0;

    for (const topic of topics) {
      if (!topicMap[topic.code]) continue;

      const topicName = topic.name;
      const grade = topic.gradeLevel;

      // Extract category code from subject code (e.g., 'math-k' -> 'math', 'science-5' -> 'science')
      const subjectCode = (topic as any).subjectCode || '';
      const categoryCode = subjectCode.split('-')[0] || 'science';

      // Generate rich content using the content generator
      const content = generateLessonContent(topic.code, topicName, categoryCode, grade);

      // Create 3 lessons per topic: intro, practice, mastery
      const lessonTypes = [
        { suffix: 'intro', data: content.intro, order: 1 },
        { suffix: 'practice', data: content.practice, order: 2 },
        { suffix: 'mastery', data: content.mastery, order: 3 }
      ];

      for (const lessonType of lessonTypes) {
        const lessonCode = `${topic.code}-${lessonType.suffix}`;

        try {
          await prisma.lesson.upsert({
            where: { code: lessonCode },
            update: {
              title: lessonType.data.title,
              description: lessonType.data.description,
              content: lessonType.data.content,
              objectives: JSON.stringify(lessonType.data.objectives),
              gradeLevel: grade,
              duration: grade < 6 ? 30 : 45,
              order: lessonType.order
            },
            create: {
              code: lessonCode,
              title: lessonType.data.title,
              description: lessonType.data.description,
              content: lessonType.data.content,
              objectives: JSON.stringify(lessonType.data.objectives),
              topicId: topicMap[topic.code].id,
              gradeLevel: grade,
              duration: grade < 6 ? 30 : 45,
              order: lessonType.order,
              isSystemLesson: true,
              createdById: systemAdmin.id,
              isActive: true
            }
          });
          lessonCount++;
        } catch (error) {
          // Skip duplicate or invalid lessons
        }
      }
    }
    console.log(`Lessons seeded: ${lessonCount} rich lessons created`);
  }

  // =====================
  // TUTORING SESSIONS (20+ sessions)
  // =====================
  const sessionData = [
    { studentEmail: 'emma.wilson@student.lincolnhs.edu', subjectCode: 'algebra-1', topicCode: 'linear-equations', mode: 'VOICE', status: 'COMPLETED', duration: 35 },
    { studentEmail: 'emma.wilson@student.lincolnhs.edu', subjectCode: 'geometry', topicCode: 'triangles', mode: 'TEXT', status: 'COMPLETED', duration: 28 },
    { studentEmail: 'emma.wilson@student.lincolnhs.edu', subjectCode: 'biology', topicCode: 'photosynthesis', mode: 'TEXT', status: 'COMPLETED', duration: 42 },
    { studentEmail: 'james.brown@student.lincolnhs.edu', subjectCode: 'algebra-2', topicCode: 'logarithms', mode: 'VOICE', status: 'COMPLETED', duration: 45 },
    { studentEmail: 'james.brown@student.lincolnhs.edu', subjectCode: 'chemistry', topicCode: 'stoichiometry', mode: 'TEXT', status: 'COMPLETED', duration: 55 },
    { studentEmail: 'james.brown@student.lincolnhs.edu', subjectCode: 'us-history', topicCode: 'civil-war', mode: 'TEXT', status: 'COMPLETED', duration: 32 },
    { studentEmail: 'olivia.martinez@student.lincolnhs.edu', subjectCode: 'algebra-1', topicCode: 'quadratic-equations', mode: 'VOICE', status: 'ACTIVE', duration: 0 },
    { studentEmail: 'noah.taylor@student.washingtonms.edu', subjectCode: 'pre-algebra', topicCode: 'variables-expressions', mode: 'TEXT', status: 'COMPLETED', duration: 25 },
    { studentEmail: 'sophia.anderson@student.washingtonms.edu', subjectCode: 'algebra-1', topicCode: 'graphing-linear', mode: 'VOICE', status: 'COMPLETED', duration: 38 },
    { studentEmail: 'liam.thomas@student.stemacademy.edu', subjectCode: 'ap-csa', topicCode: 'oop', mode: 'TEXT', status: 'COMPLETED', duration: 60 },
    { studentEmail: 'liam.thomas@student.stemacademy.edu', subjectCode: 'calculus-ab', topicCode: 'sequences-series', mode: 'VOICE', status: 'COMPLETED', duration: 48 },
    { studentEmail: 'ava.jackson@student.stemacademy.edu', subjectCode: 'ap-physics-1', topicCode: 'newtons-laws', mode: 'VOICE', status: 'COMPLETED', duration: 52 },
    { studentEmail: 'ava.jackson@student.stemacademy.edu', subjectCode: 'ap-chemistry', topicCode: 'equilibrium', mode: 'TEXT', status: 'COMPLETED', duration: 65 },
    { studentEmail: 'ethan.white@student.riversideprep.edu', subjectCode: 'geometry', topicCode: 'geometric-proofs', mode: 'TEXT', status: 'COMPLETED', duration: 40 },
    { studentEmail: 'ethan.white@student.riversideprep.edu', subjectCode: 'biology', topicCode: 'genetics-mendel', mode: 'VOICE', status: 'COMPLETED', duration: 35 }
  ];

  // Sample conversation templates for different subjects
  const sampleConversations: Record<string, { user: string; ai: string }[]> = {
    'linear-equations': [
      { user: "I'm having trouble solving 2x + 5 = 13. Can you help?", ai: "Of course! Let's solve this step by step.\n\n**Step 1:** Subtract 5 from both sides:\n$$2x + 5 - 5 = 13 - 5$$\n$$2x = 8$$\n\n**Step 2:** Divide both sides by 2:\n$$\\frac{2x}{2} = \\frac{8}{2}$$\n$$x = 4$$\n\nTo check: $2(4) + 5 = 8 + 5 = 13$ ✓" },
      { user: "That makes sense! What about 3x - 7 = 11?", ai: "Great! Let's apply the same approach:\n\n**Step 1:** Add 7 to both sides:\n$$3x - 7 + 7 = 11 + 7$$\n$$3x = 18$$\n\n**Step 2:** Divide both sides by 3:\n$$x = 6$$\n\nCheck: $3(6) - 7 = 18 - 7 = 11$ ✓\n\nYou're getting the hang of it!" }
    ],
    'triangles': [
      { user: "What are the different types of triangles?", ai: "Great question! Triangles can be classified in two ways:\n\n**By Sides:**\n- **Equilateral**: All 3 sides equal\n- **Isosceles**: 2 sides equal\n- **Scalene**: No sides equal\n\n**By Angles:**\n- **Acute**: All angles < 90°\n- **Right**: One angle = 90°\n- **Obtuse**: One angle > 90°\n\nRemember: The sum of all angles in any triangle is always 180°!" },
      { user: "How do I find the area of a triangle?", ai: "The most common formula is:\n\n$$A = \\frac{1}{2} \\times base \\times height$$\n\nFor example, if a triangle has base = 8 cm and height = 5 cm:\n$$A = \\frac{1}{2} \\times 8 \\times 5 = 20 \\text{ cm}^2$$\n\nThere's also Heron's formula when you know all three sides, but we can cover that later!" }
    ],
    'photosynthesis': [
      { user: "Can you explain photosynthesis?", ai: "Photosynthesis is how plants make their own food using sunlight! Here's the equation:\n\n$$6CO_2 + 6H_2O + \\text{light} \\rightarrow C_6H_{12}O_6 + 6O_2$$\n\n**In simple terms:**\n- **Inputs:** Carbon dioxide + Water + Light energy\n- **Outputs:** Glucose (sugar) + Oxygen\n\nThis happens in the **chloroplasts** of plant cells, specifically in the chlorophyll which gives plants their green color!" },
      { user: "Where exactly does this happen in the plant?", ai: "Photosynthesis mainly occurs in the **leaves**! Here's the structure:\n\n1. **Chloroplasts** - The organelles where photosynthesis happens\n2. **Chlorophyll** - Green pigment that absorbs light (mostly red and blue light)\n3. **Stomata** - Tiny pores on leaves for gas exchange (CO₂ in, O₂ out)\n4. **Xylem** - Brings water up from roots\n\nThe chloroplast has two main parts:\n- **Thylakoids**: Light-dependent reactions\n- **Stroma**: Light-independent reactions (Calvin Cycle)" }
    ],
    'logarithms': [
      { user: "I don't understand logarithms at all.", ai: "Let me break it down simply!\n\nA logarithm is the **inverse of an exponent**. It answers: \"What power do I raise the base to, to get this number?\"\n\n$$\\log_b(x) = y \\text{ means } b^y = x$$\n\n**Example:**\n$$\\log_2(8) = 3 \\text{ because } 2^3 = 8$$\n\nThink of it this way:\n- $2 \\times 2 \\times 2 = 8$\n- So $\\log_2(8)$ asks: \"How many 2's do I multiply?\" → Answer: 3" },
      { user: "What about log base 10?", ai: "Great question! $\\log_{10}$ is called the **common logarithm** and is often written simply as $\\log$ (no base shown).\n\n**Examples:**\n- $\\log(100) = 2$ because $10^2 = 100$\n- $\\log(1000) = 3$ because $10^3 = 1000$\n- $\\log(10) = 1$ because $10^1 = 10$\n\n**Key properties:**\n- $\\log(ab) = \\log(a) + \\log(b)$\n- $\\log(a/b) = \\log(a) - \\log(b)$\n- $\\log(a^n) = n \\cdot \\log(a)$" }
    ],
    'stoichiometry': [
      { user: "How do I balance chemical equations?", ai: "Balancing equations follows the Law of Conservation of Mass - atoms can't be created or destroyed!\n\n**Steps:**\n1. Write the unbalanced equation\n2. Count atoms on each side\n3. Add coefficients to balance\n\n**Example:** $H_2 + O_2 \\rightarrow H_2O$\n\n- Left: 2 H, 2 O\n- Right: 2 H, 1 O\n\nWe need to balance oxygen:\n$$2H_2 + O_2 \\rightarrow 2H_2O$$\n\nNow: Left (4 H, 2 O) = Right (4 H, 2 O) ✓" }
    ],
    'civil-war': [
      { user: "What caused the Civil War?", ai: "The American Civil War (1861-1865) had several interconnected causes:\n\n**Primary Causes:**\n1. **Slavery** - The fundamental issue dividing North and South\n2. **States' Rights** - Debate over federal vs. state power\n3. **Economic Differences** - Industrial North vs. Agricultural South\n4. **Political Events** - Election of Lincoln, Kansas-Nebraska Act\n\n**Key Events Leading Up:**\n- Missouri Compromise (1820)\n- Compromise of 1850\n- Dred Scott Decision (1857)\n- John Brown's Raid (1859)\n- Lincoln's Election (1860)\n\nSouth Carolina seceded first in December 1860." }
    ],
    'quadratic-equations': [
      { user: "How do I solve quadratic equations?", ai: "There are three main methods to solve quadratic equations ($ax^2 + bx + c = 0$):\n\n**1. Factoring** (when possible):\n$$x^2 + 5x + 6 = 0$$\n$$(x + 2)(x + 3) = 0$$\n$$x = -2 \\text{ or } x = -3$$\n\n**2. Quadratic Formula** (always works):\n$$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$\n\n**3. Completing the Square**\n\nWhich method would you like to explore first?" }
    ],
    'oop': [
      { user: "What is object-oriented programming?", ai: "Object-Oriented Programming (OOP) is a programming paradigm that organizes code into **objects** - bundles of data and related functions.\n\n**Four Pillars of OOP:**\n\n1. **Encapsulation** - Bundling data with methods, hiding internal details\n2. **Abstraction** - Showing only essential features, hiding complexity\n3. **Inheritance** - Creating new classes from existing ones\n4. **Polymorphism** - Same method behaving differently for different objects\n\n**Example in Java:**\n```java\nclass Dog {\n    private String name;\n    \n    public void bark() {\n        System.out.println(\"Woof!\");\n    }\n}\n```" }
    ],
    'default': [
      { user: "Can you help me understand this topic?", ai: "Of course! I'd be happy to help you understand this topic better. Let me break it down into key concepts and provide some examples to make it clearer. What specific part would you like to start with?" },
      { user: "Thank you, that helps!", ai: "You're welcome! Remember, the key to mastering any topic is practice. Would you like me to give you some practice problems, or is there another concept you'd like to explore?" }
    ]
  };

  for (const sess of sessionData) {
    const student = await prisma.user.findUnique({ where: { email: sess.studentEmail } });
    const subject = subjectMap[sess.subjectCode];
    const topic = topicMap[sess.topicCode];

    if (student && subject) {
      const startTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const endTime = sess.status === 'COMPLETED' ? new Date(startTime.getTime() + sess.duration * 60 * 1000) : null;

      const session = await prisma.tutoringSession.create({
        data: {
          studentId: student.id,
          subjectId: subject.id,
          topicId: topic?.id,
          gradeLevel: student.gradeLevel || 10,
          mode: sess.mode,
          status: sess.status,
          startedAt: startTime,
          endedAt: endTime,
          duration: sess.status === 'COMPLETED' ? sess.duration * 60 : null
        }
      });

      // Add messages for completed sessions
      if (sess.status === 'COMPLETED') {
        const conversation = sampleConversations[sess.topicCode] || sampleConversations['default'];
        let msgTime = new Date(startTime);

        for (const msg of conversation) {
          // User message
          await prisma.sessionMessage.create({
            data: {
              sessionId: session.id,
              role: 'USER',
              content: msg.user,
              createdAt: msgTime
            }
          });
          msgTime = new Date(msgTime.getTime() + 30000); // 30 seconds later

          // AI response
          await prisma.sessionMessage.create({
            data: {
              sessionId: session.id,
              role: 'ASSISTANT',
              content: msg.ai,
              createdAt: msgTime
            }
          });
          msgTime = new Date(msgTime.getTime() + 60000); // 1 minute later
        }
      }
    }
  }
  console.log('Sessions and messages seeded');

  // =====================
  // STUDENT PROGRESS
  // =====================
  const progressData = [
    { studentEmail: 'emma.wilson@student.lincolnhs.edu', topicCode: 'linear-equations', mastery: 85, questionsAttempted: 25, questionsCorrect: 21 },
    { studentEmail: 'emma.wilson@student.lincolnhs.edu', topicCode: 'triangles', mastery: 72, questionsAttempted: 18, questionsCorrect: 13 },
    { studentEmail: 'emma.wilson@student.lincolnhs.edu', topicCode: 'photosynthesis', mastery: 90, questionsAttempted: 20, questionsCorrect: 18 },
    { studentEmail: 'emma.wilson@student.lincolnhs.edu', topicCode: 'quadratic-equations', mastery: 65, questionsAttempted: 15, questionsCorrect: 10 },
    { studentEmail: 'james.brown@student.lincolnhs.edu', topicCode: 'logarithms', mastery: 78, questionsAttempted: 22, questionsCorrect: 17 },
    { studentEmail: 'james.brown@student.lincolnhs.edu', topicCode: 'stoichiometry', mastery: 82, questionsAttempted: 20, questionsCorrect: 16 },
    { studentEmail: 'james.brown@student.lincolnhs.edu', topicCode: 'civil-war', mastery: 88, questionsAttempted: 15, questionsCorrect: 13 },
    { studentEmail: 'olivia.martinez@student.lincolnhs.edu', topicCode: 'quadratic-equations', mastery: 45, questionsAttempted: 10, questionsCorrect: 5 },
    { studentEmail: 'noah.taylor@student.washingtonms.edu', topicCode: 'variables-expressions', mastery: 70, questionsAttempted: 20, questionsCorrect: 14 },
    { studentEmail: 'sophia.anderson@student.washingtonms.edu', topicCode: 'graphing-linear', mastery: 75, questionsAttempted: 16, questionsCorrect: 12 },
    { studentEmail: 'liam.thomas@student.stemacademy.edu', topicCode: 'oop', mastery: 92, questionsAttempted: 30, questionsCorrect: 28 },
    { studentEmail: 'liam.thomas@student.stemacademy.edu', topicCode: 'recursion', mastery: 85, questionsAttempted: 20, questionsCorrect: 17 },
    { studentEmail: 'ava.jackson@student.stemacademy.edu', topicCode: 'newtons-laws', mastery: 88, questionsAttempted: 25, questionsCorrect: 22 },
    { studentEmail: 'ava.jackson@student.stemacademy.edu', topicCode: 'equilibrium', mastery: 80, questionsAttempted: 18, questionsCorrect: 14 },
    { studentEmail: 'ethan.white@student.riversideprep.edu', topicCode: 'geometric-proofs', mastery: 68, questionsAttempted: 22, questionsCorrect: 15 },
    { studentEmail: 'ethan.white@student.riversideprep.edu', topicCode: 'genetics-mendel', mastery: 75, questionsAttempted: 20, questionsCorrect: 15 }
  ];

  for (const prog of progressData) {
    const student = await prisma.user.findUnique({ where: { email: prog.studentEmail } });
    const topic = topicMap[prog.topicCode];

    if (student && topic) {
      await prisma.studentProgress.upsert({
        where: {
          studentId_topicId: {
            studentId: student.id,
            topicId: topic.id
          }
        },
        update: {
          masteryLevel: prog.mastery,
          questionsAttempted: prog.questionsAttempted,
          questionsCorrect: prog.questionsCorrect,
          lastActivityAt: new Date()
        },
        create: {
          studentId: student.id,
          topicId: topic.id,
          masteryLevel: prog.mastery,
          questionsAttempted: prog.questionsAttempted,
          questionsCorrect: prog.questionsCorrect,
          lastActivityAt: new Date()
        }
      });
    }
  }
  console.log('Student progress seeded');

  // =====================
  // KNOWLEDGE BASE DOCUMENTS (30+ documents)
  // =====================
  const kbDocuments = [
    // Math Documents
    { title: 'Solving Linear Equations', content: 'A linear equation is an equation where the variable has an exponent of 1. To solve: 1) Combine like terms, 2) Use inverse operations to isolate the variable, 3) Check your solution.', category: 'math', tags: 'algebra,equations,linear' },
    { title: 'Quadratic Formula', content: 'The quadratic formula x = (-b ± √(b²-4ac)) / 2a solves any quadratic equation ax² + bx + c = 0. The discriminant (b²-4ac) tells you the number of solutions.', category: 'math', tags: 'algebra,quadratic,formula' },
    { title: 'Pythagorean Theorem', content: 'In a right triangle, a² + b² = c², where c is the hypotenuse. This is used to find missing sides of right triangles and has many real-world applications.', category: 'math', tags: 'geometry,triangles,theorem' },
    { title: 'SOHCAHTOA - Trigonometric Ratios', content: 'Sine = Opposite/Hypotenuse, Cosine = Adjacent/Hypotenuse, Tangent = Opposite/Adjacent. Remember with SOHCAHTOA!', category: 'math', tags: 'trigonometry,ratios' },
    { title: 'Order of Operations (PEMDAS)', content: 'Parentheses, Exponents, Multiplication/Division (left to right), Addition/Subtraction (left to right). Essential for evaluating expressions correctly.', category: 'math', tags: 'arithmetic,operations' },

    // Science Documents
    { title: 'The Cell: Basic Unit of Life', content: 'Cells are the fundamental unit of all living things. Key organelles include: nucleus (DNA), mitochondria (energy), ribosomes (protein synthesis), and cell membrane (protection).', category: 'science', tags: 'biology,cells' },
    { title: 'Photosynthesis Equation', content: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Plants convert carbon dioxide and water into glucose and oxygen using sunlight.', category: 'science', tags: 'biology,photosynthesis' },
    { title: 'Newton\'s Three Laws of Motion', content: '1) An object at rest stays at rest unless acted upon. 2) F=ma (Force equals mass times acceleration). 3) Every action has an equal and opposite reaction.', category: 'science', tags: 'physics,motion,laws' },
    { title: 'The Periodic Table Organization', content: 'Elements are organized by atomic number. Rows (periods) show energy levels. Columns (groups) show similar properties. Metals on left, nonmetals on right.', category: 'science', tags: 'chemistry,elements' },
    { title: 'Balancing Chemical Equations', content: 'Matter cannot be created or destroyed. Balance equations by adjusting coefficients, not subscripts. Start with the most complex molecule.', category: 'science', tags: 'chemistry,equations' },
    { title: 'DNA Structure', content: 'DNA is a double helix made of nucleotides. Each nucleotide has a sugar, phosphate, and base (A-T, G-C pairs). DNA stores genetic information.', category: 'science', tags: 'biology,genetics,dna' },
    { title: 'Work, Energy, and Power', content: 'Work = Force × Distance. Energy is the ability to do work. Power = Work/Time. Energy is conserved in closed systems.', category: 'science', tags: 'physics,energy' },

    // English Documents
    { title: 'Essay Structure: Introduction, Body, Conclusion', content: 'Introduction: Hook, background, thesis. Body: Topic sentences, evidence, analysis. Conclusion: Restate thesis, summarize, broader significance.', category: 'english', tags: 'writing,essays' },
    { title: 'Parts of Speech', content: 'Nouns (people, places, things), Verbs (actions), Adjectives (describe nouns), Adverbs (describe verbs), Pronouns, Prepositions, Conjunctions, Interjections.', category: 'english', tags: 'grammar,writing' },
    { title: 'Literary Devices', content: 'Metaphor, simile, personification, alliteration, imagery, symbolism, foreshadowing, irony. Authors use these to create meaning and engage readers.', category: 'english', tags: 'literature,analysis' },
    { title: 'MLA Citation Format', content: 'Author Last, First. "Title." Container, Publisher, Date, Location. Use in-text citations (Author Page) and Works Cited page.', category: 'english', tags: 'writing,citations' },
    { title: 'Thesis Statement Writing', content: 'A thesis is a one-sentence summary of your argument. It should be specific, arguable, and supportable. Place it at the end of your introduction.', category: 'english', tags: 'writing,essays' },

    // History Documents
    { title: 'Causes of the American Revolution', content: 'Taxation without representation, British policies (Stamp Act, Townshend Acts), Boston Massacre, Boston Tea Party, Enlightenment ideas about liberty.', category: 'history', tags: 'us-history,revolution' },
    { title: 'The Constitution and Bill of Rights', content: 'The Constitution established the federal government structure. The Bill of Rights (first 10 amendments) protects individual liberties like free speech, religion, and due process.', category: 'history', tags: 'us-history,government' },
    { title: 'Causes of World War I', content: 'MAIN: Militarism, Alliances, Imperialism, Nationalism. The assassination of Archduke Franz Ferdinand sparked the war.', category: 'history', tags: 'world-history,war' },
    { title: 'The Cold War', content: 'Post-WWII tension between USA (capitalism) and USSR (communism). Included: Korean War, Cuban Missile Crisis, Vietnam War, Space Race. Ended 1991.', category: 'history', tags: 'us-history,cold-war' },

    // Computer Science Documents
    { title: 'What is an Algorithm?', content: 'An algorithm is a step-by-step procedure for solving a problem. Good algorithms are correct, efficient, and clear. Examples: sorting, searching, pathfinding.', category: 'cs', tags: 'programming,algorithms' },
    { title: 'Variables and Data Types', content: 'Variables store data. Common types: integers (whole numbers), floats (decimals), strings (text), booleans (true/false). Choose the right type for your data.', category: 'cs', tags: 'programming,basics' },
    { title: 'Loops: For and While', content: 'Loops repeat code. For loops run a set number of times. While loops run until a condition is false. Avoid infinite loops!', category: 'cs', tags: 'programming,loops' },
    { title: 'Object-Oriented Programming Concepts', content: 'OOP organizes code into objects. Key concepts: Classes (blueprints), Objects (instances), Inheritance (sharing properties), Encapsulation (hiding data), Polymorphism.', category: 'cs', tags: 'programming,oop' },
    { title: 'Big O Notation', content: 'Big O describes algorithm efficiency. O(1) constant, O(n) linear, O(n²) quadratic, O(log n) logarithmic. Lower is better for large inputs.', category: 'cs', tags: 'algorithms,efficiency' },

    // Study Tips
    { title: 'Effective Study Techniques', content: 'Active recall (test yourself), spaced repetition (review over time), elaboration (explain in your own words), interleaving (mix subjects).', category: 'general', tags: 'study,tips' },
    { title: 'Test-Taking Strategies', content: 'Read all instructions. Answer easy questions first. Manage your time. For multiple choice, eliminate wrong answers. Review before submitting.', category: 'general', tags: 'study,tests' },
    { title: 'Note-Taking Methods', content: 'Cornell Method: divide page into notes, cues, summary. Mind maps for visual learners. Outline method for organized subjects.', category: 'general', tags: 'study,notes' }
  ];

  for (const doc of kbDocuments) {
    await prisma.knowledgeDocument.create({
      data: {
        title: doc.title,
        content: doc.content,
        category: doc.category,
        tags: doc.tags,
        isActive: true
      }
    });
  }
  console.log('Knowledge base seeded');

  // =====================
  // LOGIC RULES (15+ rules)
  // =====================
  const logicRules = [
    { name: 'Low Mastery Alert', condition: 'masteryLevel < 30', action: 'Suggest review of prerequisites and offer additional practice problems', priority: 10 },
    { name: 'High Performer Acceleration', condition: 'masteryLevel > 90 AND questionsCorrect/questionsAttempted > 0.95', action: 'Recommend advancing to next topic or AP-level content', priority: 8 },
    { name: 'Struggling Student Support', condition: 'questionsCorrect/questionsAttempted < 0.5 AND questionsAttempted > 5', action: 'Switch to step-by-step guided mode, provide visual aids', priority: 9 },
    { name: 'Voice Mode for Math', condition: 'subject == "math" AND hasVisualContent == true', action: 'Enable visual rendering with voice explanation', priority: 5 },
    { name: 'Encourage Breaks', condition: 'sessionDuration > 45', action: 'Suggest a 5-minute break to improve retention', priority: 7 },
    { name: 'Homework Help Mode', condition: 'timeOfDay > 15:00 AND timeOfDay < 21:00 AND isWeekday', action: 'Prioritize homework assistance, offer step-by-step solutions', priority: 6 },
    { name: 'Test Prep Mode', condition: 'daysUntilTest < 7', action: 'Focus on practice tests and review of weak areas', priority: 10 },
    { name: 'New User Onboarding', condition: 'totalSessions < 3', action: 'Provide tour of features, recommend starting assessment', priority: 8 },
    { name: 'Science Lab Support', condition: 'subject == "science" AND topicType == "lab"', action: 'Enable step-by-step lab procedure mode with safety reminders', priority: 7 },
    { name: 'Writing Feedback Mode', condition: 'subject == "ela" AND taskType == "essay"', action: 'Enable paragraph-by-paragraph feedback, check thesis statement', priority: 6 },
    { name: 'History Source Analysis', condition: 'subject == "history" AND taskType == "document_analysis"', action: 'Enable HIPP analysis framework (Historical context, Intended audience, Purpose, POV)', priority: 5 },
    { name: 'Coding Error Detection', condition: 'subject == "cs" AND codeSubmitted == true', action: 'Run syntax check, provide hints before showing solution', priority: 8 },
    { name: 'Language Practice Mode', condition: 'category == "languages" AND practiceType == "speaking"', action: 'Enable voice input and pronunciation feedback', priority: 7 },
    { name: 'Night Owl Reminder', condition: 'timeOfDay > 22:00', action: 'Remind about sleep importance, suggest bookmarking for tomorrow', priority: 9 },
    { name: 'Weekend Enrichment', condition: 'isWeekend AND masteryLevel > 70', action: 'Suggest enrichment activities, real-world applications', priority: 4 }
  ];

  for (const rule of logicRules) {
    await prisma.logicRule.create({
      data: {
        name: rule.name,
        description: `Rule: ${rule.name}`,
        condition: rule.condition,
        action: rule.action,
        priority: rule.priority,
        isActive: true
      }
    });
  }
  console.log('Logic rules seeded');

  // =====================
  // AI FUNCTIONS (15+ functions)
  // =====================
  const aiFunctions = [
    { name: 'getStudentProgress', description: 'Retrieve student mastery levels and learning history', parameters: '{"studentId": "string", "subjectId": "string?"}', triggerType: 'auto' },
    { name: 'generatePracticeProblems', description: 'Create practice problems based on topic and difficulty', parameters: '{"topicId": "string", "difficulty": "number", "count": "number"}', triggerType: 'auto' },
    { name: 'analyzeHomework', description: 'Analyze uploaded homework image and extract problems', parameters: '{"imageUrl": "string", "subject": "string"}', triggerType: 'manual' },
    { name: 'renderMathEquation', description: 'Render mathematical equations using LaTeX/KaTeX', parameters: '{"equation": "string", "format": "inline|block"}', triggerType: 'auto' },
    { name: 'generateDiagram', description: 'Create visual diagrams for explanations', parameters: '{"type": "flowchart|graph|geometry", "data": "object"}', triggerType: 'auto' },
    { name: 'checkAnswer', description: 'Validate student answer and provide feedback', parameters: '{"question": "string", "studentAnswer": "string", "correctAnswer": "string"}', triggerType: 'auto' },
    { name: 'getRelatedTopics', description: 'Find related topics for deeper learning', parameters: '{"topicId": "string", "relationship": "prerequisite|next|related"}', triggerType: 'auto' },
    { name: 'searchKnowledgeBase', description: 'Search knowledge base for relevant information', parameters: '{"query": "string", "category": "string?", "limit": "number"}', triggerType: 'auto' },
    { name: 'generateQuiz', description: 'Create a quiz for topic assessment', parameters: '{"topicId": "string", "questionCount": "number", "questionTypes": "array"}', triggerType: 'manual' },
    { name: 'explainStep', description: 'Provide step-by-step explanation of a solution', parameters: '{"problem": "string", "currentStep": "number", "totalSteps": "number"}', triggerType: 'auto' },
    { name: 'translateContent', description: 'Translate learning content to student preferred language', parameters: '{"content": "string", "targetLanguage": "string"}', triggerType: 'auto' },
    { name: 'scheduleReminder', description: 'Set a study reminder for the student', parameters: '{"studentId": "string", "topicId": "string", "reminderTime": "datetime"}', triggerType: 'manual' },
    { name: 'generateStudyPlan', description: 'Create personalized study plan based on goals', parameters: '{"studentId": "string", "targetDate": "date", "topics": "array"}', triggerType: 'manual' },
    { name: 'recordProgress', description: 'Save student progress and update mastery level', parameters: '{"studentId": "string", "topicId": "string", "score": "number", "timeSpent": "number"}', triggerType: 'auto' },
    { name: 'getHint', description: 'Provide a hint for a problem without giving the answer', parameters: '{"problemId": "string", "hintLevel": "number"}', triggerType: 'auto' }
  ];

  for (const func of aiFunctions) {
    await prisma.aIFunction.upsert({
      where: { name: func.name },
      update: func,
      create: { ...func, isActive: true }
    });
  }
  console.log('AI functions seeded');

  // =====================
  // CLASSES - Expanded for all schools
  // =====================

  // Get teachers for different schools
  const teacherLincolnHS = await prisma.user.findUnique({ where: { email: 'sjohnson@lincolnhs.edu' } });
  const teacherLincolnMS = await prisma.user.findUnique({ where: { email: 'lbrown@lincolnms.edu' } });
  const teacherLincolnElem = await prisma.user.findUnique({ where: { email: 'kwhite@lincolnelem.edu' } });
  const teacherLincolnPreschool = await prisma.user.findUnique({ where: { email: 'sclark@lincolnelc.edu' } });
  const teacherLincolnVotech = await prisma.user.findUnique({ where: { email: 'bsmith@lincolnctc.edu' } });

  // Default teacher for lessons, assignments, and quizzes
  const teacher = teacherLincolnHS;

  const classData = [
    // Lincoln High School classes
    { id: 'class-algebra-1a', name: 'Algebra I - Period 1', description: 'First period Algebra I class', gradeLevel: 9, schoolId: 'lincoln-high' },
    { id: 'class-geometry-2b', name: 'Geometry - Period 2', description: 'Second period Geometry class', gradeLevel: 10, schoolId: 'lincoln-high' },
    { id: 'class-bio-3c', name: 'Biology - Period 3', description: 'Third period Biology class', gradeLevel: 9, schoolId: 'lincoln-high' },
    { id: 'class-us-history', name: 'US History', description: 'US History class', gradeLevel: 11, schoolId: 'lincoln-high' },
    { id: 'class-english-lit', name: 'English Literature', description: 'English Literature class', gradeLevel: 10, schoolId: 'lincoln-high' },

    // Lincoln Middle School classes
    { id: 'class-pre-algebra', name: 'Pre-Algebra', description: 'Pre-Algebra fundamentals', gradeLevel: 7, schoolId: 'lincoln-middle' },
    { id: 'class-life-science', name: 'Life Science', description: 'Introduction to life science', gradeLevel: 7, schoolId: 'lincoln-middle' },
    { id: 'class-english-7', name: 'English 7', description: 'Grade 7 English', gradeLevel: 7, schoolId: 'lincoln-middle' },
    { id: 'class-social-studies-7', name: 'Social Studies 7', description: 'Grade 7 Social Studies', gradeLevel: 7, schoolId: 'lincoln-middle' },

    // Lincoln Elementary classes
    { id: 'class-math-k', name: 'Math - Kindergarten', description: 'Kindergarten math class', gradeLevel: 0, schoolId: 'lincoln-elementary' },
    { id: 'class-math-2', name: 'Math - Grade 2', description: 'Second grade math class', gradeLevel: 2, schoolId: 'lincoln-elementary' },
    { id: 'class-math-4', name: 'Math - Grade 4', description: 'Fourth grade math class', gradeLevel: 4, schoolId: 'lincoln-elementary' },
    { id: 'class-reading-k', name: 'Reading - Kindergarten', description: 'Kindergarten reading class', gradeLevel: 0, schoolId: 'lincoln-elementary' },
    { id: 'class-reading-2', name: 'Reading - Grade 2', description: 'Second grade reading class', gradeLevel: 2, schoolId: 'lincoln-elementary' },

    // Lincoln Preschool classes
    { id: 'class-prek3-colors', name: 'Colors & Shapes - Pre-K 3', description: 'Pre-K 3 colors and shapes', gradeLevel: -2, schoolId: 'lincoln-preschool' },
    { id: 'class-prek4-abc', name: 'ABCs & 123s - Pre-K 4', description: 'Pre-K 4 letters and numbers', gradeLevel: -1, schoolId: 'lincoln-preschool' },

    // Lincoln Vo-Tech classes
    { id: 'class-auto-basics', name: 'Automotive Basics', description: 'Introduction to automotive technology', gradeLevel: 10, schoolId: 'lincoln-votech' },
    { id: 'class-welding-intro', name: 'Introduction to Welding', description: 'Basic welding techniques', gradeLevel: 11, schoolId: 'lincoln-votech' },
    { id: 'class-culinary-fundamentals', name: 'Culinary Fundamentals', description: 'Basic cooking and food safety', gradeLevel: 10, schoolId: 'lincoln-votech' }
  ];

  const classMap: Record<string, any> = {};
  for (const cls of classData) {
    const created = await prisma.class.upsert({
      where: { id: cls.id },
      update: {},
      create: { ...cls, isActive: true }
    });
    classMap[cls.id] = created;
  }

  // Add teachers to classes
  const teacherClassAssignments = [
    // Lincoln High
    { teacherId: teacherLincolnHS?.id, classIds: ['class-algebra-1a', 'class-geometry-2b', 'class-bio-3c', 'class-us-history', 'class-english-lit'] },
    // Lincoln Middle
    { teacherId: teacherLincolnMS?.id, classIds: ['class-pre-algebra', 'class-life-science', 'class-english-7', 'class-social-studies-7'] },
    // Lincoln Elementary
    { teacherId: teacherLincolnElem?.id, classIds: ['class-math-k', 'class-math-2', 'class-math-4', 'class-reading-k', 'class-reading-2'] },
    // Lincoln Preschool
    { teacherId: teacherLincolnPreschool?.id, classIds: ['class-prek3-colors', 'class-prek4-abc'] },
    // Lincoln Vo-Tech
    { teacherId: teacherLincolnVotech?.id, classIds: ['class-auto-basics', 'class-welding-intro', 'class-culinary-fundamentals'] }
  ];

  for (const assignment of teacherClassAssignments) {
    if (assignment.teacherId) {
      for (const classId of assignment.classIds) {
        if (classMap[classId]) {
          await prisma.classTeacher.upsert({
            where: { classId_teacherId: { classId, teacherId: assignment.teacherId } },
            update: {},
            create: { classId, teacherId: assignment.teacherId, isPrimary: true }
          });
        }
      }
    }
  }

  // Add ALL students to appropriate classes based on their school and grade level
  for (const student of createdStudents) {
    const studentClassEnrollments: string[] = [];

    // Lincoln High students (grades 9-12)
    if (student.schoolId === 'lincoln-high') {
      if (student.gradeLevel === 9) {
        studentClassEnrollments.push('class-algebra-1a', 'class-bio-3c');
      } else if (student.gradeLevel === 10) {
        studentClassEnrollments.push('class-geometry-2b', 'class-english-lit');
      } else if (student.gradeLevel === 11) {
        studentClassEnrollments.push('class-us-history');
      } else if (student.gradeLevel === 12) {
        studentClassEnrollments.push('class-us-history', 'class-english-lit');
      }
    }

    // Lincoln Middle students (grades 6-8)
    if (student.schoolId === 'lincoln-middle') {
      studentClassEnrollments.push('class-pre-algebra', 'class-life-science', 'class-english-7', 'class-social-studies-7');
    }

    // Lincoln Elementary students (grades K-5)
    if (student.schoolId === 'lincoln-elementary') {
      if (student.gradeLevel === 0) {
        studentClassEnrollments.push('class-math-k', 'class-reading-k');
      } else if (student.gradeLevel === 2) {
        studentClassEnrollments.push('class-math-2', 'class-reading-2');
      } else if (student.gradeLevel === 4) {
        studentClassEnrollments.push('class-math-4');
      }
    }

    // Lincoln Preschool students
    if (student.schoolId === 'lincoln-preschool') {
      if (student.gradeLevel === -2) {
        studentClassEnrollments.push('class-prek3-colors');
      } else if (student.gradeLevel === -1) {
        studentClassEnrollments.push('class-prek4-abc');
      }
    }

    // Lincoln Vo-Tech students
    if (student.schoolId === 'lincoln-votech') {
      studentClassEnrollments.push('class-auto-basics', 'class-welding-intro', 'class-culinary-fundamentals');
    }

    // Enroll student in their classes
    for (const classId of studentClassEnrollments) {
      if (classMap[classId]) {
        await prisma.classStudent.upsert({
          where: { classId_studentId: { classId, studentId: student.id } },
          update: {},
          create: { classId, studentId: student.id }
        });
      }
    }
  }
  console.log('Classes seeded');

  // =====================
  // LESSONS
  // =====================
  if (teacher) {
    const lessonsData = [
      {
        code: 'lesson-linear-1',
        title: 'Introduction to Linear Equations',
        description: 'Learn the basics of linear equations and how to identify them.',
        content: `# Linear Equations Basics

A **linear equation** is an equation where the highest power of the variable is 1.

## Standard Form
The standard form of a linear equation is:
$$ax + b = c$$

## Examples
- $2x + 5 = 13$ (linear)
- $x^2 + 3 = 7$ (NOT linear - has x²)
- $3y - 7 = 8$ (linear)

## Key Properties
1. Graph is always a straight line
2. Has exactly one solution (unless no solution or infinite solutions)
3. Can be solved by isolation

## Practice
Try solving: $4x - 3 = 9$`,
        topicCode: 'linear-equations',
        classId: 'class-algebra-1a',
        gradeLevel: 9,
        duration: 30
      },
      {
        code: 'lesson-linear-2',
        title: 'Solving Multi-Step Linear Equations',
        description: 'Master equations that require multiple steps to solve.',
        content: `# Multi-Step Equations

## The Process
1. **Simplify** both sides (distribute, combine like terms)
2. **Move variables** to one side
3. **Move constants** to the other side
4. **Divide** to isolate the variable

## Example
Solve: $3(x + 2) - 4 = 2x + 7$

**Step 1:** Distribute
$$3x + 6 - 4 = 2x + 7$$

**Step 2:** Combine like terms
$$3x + 2 = 2x + 7$$

**Step 3:** Subtract 2x from both sides
$$x + 2 = 7$$

**Step 4:** Subtract 2
$$x = 5$$

**Check:** $3(5+2) - 4 = 21 - 4 = 17$ and $2(5) + 7 = 17$ ✓`,
        topicCode: 'linear-equations',
        classId: 'class-algebra-1a',
        gradeLevel: 9,
        duration: 45
      },
      {
        code: 'lesson-triangles-1',
        title: 'Types of Triangles',
        description: 'Learn to classify triangles by sides and angles.',
        content: `# Triangle Classification

## By Sides
- **Equilateral**: All 3 sides equal (60° each angle)
- **Isosceles**: Exactly 2 sides equal
- **Scalene**: No sides equal

## By Angles
- **Acute**: All angles < 90°
- **Right**: One angle = 90°
- **Obtuse**: One angle > 90°

## Important Facts
- Sum of angles always = 180°
- Largest angle is opposite the longest side
- Triangle Inequality: Sum of any two sides > third side`,
        topicCode: 'triangles',
        classId: 'class-geometry-2b',
        gradeLevel: 10,
        duration: 35
      },
      {
        code: 'lesson-cell-1',
        title: 'Cell Structure and Function',
        description: 'Explore the basic unit of life and its organelles.',
        content: `# The Cell

Cells are the basic unit of all living things.

## Cell Types
- **Prokaryotic**: No nucleus (bacteria)
- **Eukaryotic**: Has nucleus (plants, animals, fungi)

## Key Organelles

| Organelle | Function |
|-----------|----------|
| Nucleus | Contains DNA, control center |
| Mitochondria | Energy production (ATP) |
| Ribosome | Protein synthesis |
| Cell Membrane | Protection, selective barrier |
| Cytoplasm | Gel-like fluid holding organelles |

## Plant vs Animal Cells
Plants have: Cell wall, chloroplasts, large vacuole
Animals have: Centrioles, small vacuoles`,
        topicCode: 'cell-structure',
        classId: 'class-bio-3c',
        gradeLevel: 9,
        duration: 40
      },
      // Early Math - Public lessons (no class restriction)
      {
        code: 'lesson-counting-10-1',
        title: 'Learning to Count to 10',
        description: 'Fun introduction to counting numbers from 1 to 10.',
        content: `# Counting to 10

## Let's Count Together!

🔢 **1, 2, 3, 4, 5, 6, 7, 8, 9, 10!**

## Number Recognition

| Number | Word | Objects |
|--------|------|---------|
| 1 | One | 🍎 |
| 2 | Two | 🍎🍎 |
| 3 | Three | 🍎🍎🍎 |
| 4 | Four | 🍎🍎🍎🍎 |
| 5 | Five | 🍎🍎🍎🍎🍎 |
| 6 | Six | 🍎🍎🍎🍎🍎🍎 |
| 7 | Seven | 🍎🍎🍎🍎🍎🍎🍎 |
| 8 | Eight | 🍎🍎🍎🍎🍎🍎🍎🍎 |
| 9 | Nine | 🍎🍎🍎🍎🍎🍎🍎🍎🍎 |
| 10 | Ten | 🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎 |

## Practice Activities
1. Count your fingers
2. Count objects in your room
3. Sing a counting song!`,
        topicCode: 'counting-10',
        classId: null,
        gradeLevel: 0,
        duration: 15
      },
      {
        code: 'lesson-counting-10-2',
        title: 'Counting Objects to 10',
        description: 'Practice counting different objects up to 10.',
        content: `# Counting Objects

## Count the Stars! ⭐

How many stars do you see?

⭐⭐⭐⭐⭐ = **5 stars**

⭐⭐⭐ = **3 stars**

⭐⭐⭐⭐⭐⭐⭐ = **7 stars**

## Tips for Counting
1. Point to each object as you count
2. Say the number out loud
3. Count slowly and carefully
4. Check by counting again!

## Practice
Count these animals:
- 🐶🐶🐶🐶 = ? dogs
- 🐱🐱🐱🐱🐱🐱 = ? cats
- 🐰🐰 = ? bunnies`,
        topicCode: 'counting-10',
        classId: null,
        gradeLevel: 0,
        duration: 15
      },
      {
        code: 'lesson-counting-20-1',
        title: 'Counting from 11 to 20',
        description: 'Extend your counting skills to 20.',
        content: `# Counting to 20

## Numbers 11-20

| Number | Word |
|--------|------|
| 11 | Eleven |
| 12 | Twelve |
| 13 | Thirteen |
| 14 | Fourteen |
| 15 | Fifteen |
| 16 | Sixteen |
| 17 | Seventeen |
| 18 | Eighteen |
| 19 | Nineteen |
| 20 | Twenty |

## Pattern to Remember
- 13 = thir**teen** (3 + 10)
- 14 = four**teen** (4 + 10)
- 15 = fif**teen** (5 + 10)

The "teen" means "plus ten"!

## Practice
Count from 1 to 20 without stopping!`,
        topicCode: 'counting-20',
        classId: null,
        gradeLevel: 0,
        duration: 20
      },
      {
        code: 'lesson-addition-1',
        title: 'Introduction to Addition',
        description: 'Learn what addition means and how to add small numbers.',
        content: `# What is Addition?

Addition means **putting together** or **combining**.

## The Plus Sign: +

When we see **+** we add numbers together.

## Examples

🍎🍎 + 🍎 = 🍎🍎🍎

**2 + 1 = 3**

---

🌟🌟🌟 + 🌟🌟 = 🌟🌟🌟🌟🌟

**3 + 2 = 5**

## Addition Facts to Remember
- 1 + 1 = 2
- 2 + 2 = 4
- 3 + 3 = 6
- 4 + 4 = 8
- 5 + 5 = 10

## Practice
Use your fingers to solve:
- 2 + 3 = ?
- 4 + 1 = ?
- 3 + 4 = ?`,
        topicCode: 'addition-10',
        classId: null,
        gradeLevel: 0,
        duration: 20
      },
      {
        code: 'lesson-subtraction-1',
        title: 'Introduction to Subtraction',
        description: 'Learn what subtraction means and how to subtract small numbers.',
        content: `# What is Subtraction?

Subtraction means **taking away**.

## The Minus Sign: -

When we see **-** we take away.

## Examples

🍎🍎🍎🍎🍎 - 🍎🍎 = 🍎🍎🍎

**5 - 2 = 3**

Start with 5 apples, take away 2, you have 3 left!

---

🌟🌟🌟🌟 - 🌟 = 🌟🌟🌟

**4 - 1 = 3**

## Practice
- 5 - 1 = ?
- 4 - 2 = ?
- 3 - 1 = ?

## Tip
You can use your fingers! Hold up the first number, then put down the second number.`,
        topicCode: 'subtraction-10',
        classId: null,
        gradeLevel: 0,
        duration: 20
      }
    ];

    for (const lesson of lessonsData) {
      const topic = topicMap[lesson.topicCode];
      if (topic) {
        await prisma.lesson.upsert({
          where: { code: lesson.code },
          update: {},
          create: {
            code: lesson.code,
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            topicId: topic.id,
            classId: lesson.classId,
            gradeLevel: lesson.gradeLevel,
            duration: lesson.duration,
            createdById: teacher.id,
            isActive: true
          }
        });
      }
    }
    console.log('Lessons seeded');

    // =====================
    // ASSIGNMENTS (Expanded across all schools and grade levels)
    // =====================
    const assignmentsData = [
      // ---- LINCOLN HIGH SCHOOL ----
      // Algebra I
      {
        code: 'assign-linear-hw1',
        title: 'Linear Equations Practice Set',
        instructions: `Complete the following problems. Show all work!

1. Solve for x: 2x + 7 = 15
2. Solve for x: 3x - 4 = 11
3. Solve for x: 5x + 3 = 2x + 12
4. Solve for x: 4(x - 2) = 3x + 5
5. Solve for x: 2(x + 3) + x = 4x - 1

Remember to check your answers by substituting back!`,
        topicCode: 'linear-equations',
        classId: 'class-algebra-1a',
        type: 'homework',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxPoints: 100
      },
      {
        code: 'assign-variables-hw1',
        title: 'Variables and Expressions Worksheet',
        instructions: `Evaluate each expression for the given value of the variable:

1. 3x + 5 when x = 4
2. 2(y - 3) + 7 when y = 6
3. x² + 2x - 1 when x = 3
4. Write an expression: "5 more than twice a number"
5. Write an expression: "The product of a number and 7, decreased by 2"`,
        topicCode: 'variables-expressions',
        classId: 'class-algebra-1a',
        type: 'homework',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        maxPoints: 50
      },
      {
        code: 'assign-quadratic-project',
        title: 'Quadratic Functions in Real Life',
        instructions: `Research and present a real-world application of quadratic functions:

1. Find a real-world scenario (projectile motion, profit optimization, etc.)
2. Write the quadratic equation that models the scenario
3. Graph the function and identify vertex, axis of symmetry, roots
4. Explain what each part of the graph means in context
5. Present your findings in a 5-minute presentation`,
        topicCode: 'quadratic-equations',
        classId: 'class-algebra-1a',
        type: 'project',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        maxPoints: 200
      },

      // Geometry
      {
        code: 'assign-triangles-project',
        title: 'Triangle Properties Project',
        instructions: `Create a poster or digital presentation showing:

1. All 6 types of triangles (by sides and angles)
2. Draw and label each type with measurements
3. Real-world examples of each triangle type
4. Prove the Triangle Inequality Theorem with 3 examples
5. Show how to calculate area using base × height ÷ 2

Submit as PDF or image of physical poster.`,
        topicCode: 'triangles',
        classId: 'class-geometry-2b',
        type: 'project',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxPoints: 150
      },
      {
        code: 'assign-angles-hw1',
        title: 'Angles Practice Problems',
        instructions: `Find the missing angle measures:

1. Two angles are supplementary. One measures 65°. Find the other.
2. Two angles are complementary. One measures 38°. Find the other.
3. Lines AB and CD intersect. If angle 1 = 72°, find angles 2, 3, and 4.
4. Find x if angles (2x + 10)° and (3x - 5)° are vertical angles.
5. In triangle ABC, angle A = 45°, angle B = 75°. Find angle C.`,
        topicCode: 'angles',
        classId: 'class-geometry-2b',
        type: 'homework',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        maxPoints: 75
      },
      {
        code: 'assign-circles-hw1',
        title: 'Circle Properties Worksheet',
        instructions: `For each problem, show your work:

1. A circle has radius 7 cm. Find its circumference and area.
2. A circle has diameter 12 inches. Find its circumference and area.
3. Find the arc length of a 60° sector with radius 10 cm.
4. Find the area of a sector with central angle 90° and radius 8 ft.
5. Two chords intersect inside a circle. If AB = 6 and BC = 4, find CD if AD = 8.`,
        topicCode: 'circles',
        classId: 'class-geometry-2b',
        type: 'homework',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        maxPoints: 100
      },

      // Biology
      {
        code: 'assign-cells-lab',
        title: 'Cell Observation Lab Report',
        instructions: `After completing the microscope lab, write a lab report including:

1. **Purpose**: What was the goal of this lab?
2. **Materials**: List all materials used
3. **Procedure**: Numbered steps you followed
4. **Observations**: Describe what you saw in:
   - Onion cells (plant)
   - Cheek cells (animal)
5. **Drawings**: Labeled diagrams of both cell types
6. **Conclusions**: What differences did you observe?`,
        topicCode: 'cell-structure',
        classId: 'class-bio-3c',
        type: 'homework',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        maxPoints: 100
      },
      {
        code: 'assign-cell-membrane-hw',
        title: 'Cell Membrane Transport',
        instructions: `Answer the following questions about cell membrane transport:

1. Define osmosis and give an example.
2. What is the difference between passive and active transport?
3. Explain what happens to a red blood cell in:
   - Hypotonic solution
   - Hypertonic solution
   - Isotonic solution
4. Draw and label the fluid mosaic model of the cell membrane.
5. Explain how facilitated diffusion works.`,
        topicCode: 'cell-membrane',
        classId: 'class-bio-3c',
        type: 'homework',
        dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        maxPoints: 80
      },
      {
        code: 'assign-cell-division-project',
        title: 'Mitosis vs Meiosis Comparison Project',
        instructions: `Create a detailed comparison of mitosis and meiosis:

1. Create a Venn diagram comparing the two processes
2. Draw all stages of mitosis with labels
3. Draw all stages of meiosis (I and II) with labels
4. Explain why mitosis produces identical cells
5. Explain why meiosis produces genetic variation
6. Give examples of when each process occurs in the body`,
        topicCode: 'cell-division',
        classId: 'class-bio-3c',
        type: 'project',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        maxPoints: 150
      },

      // US History
      {
        code: 'assign-revolution-essay',
        title: 'Causes of the American Revolution',
        instructions: `Write a 3-5 paragraph essay addressing:

1. Introduction: What was the American Revolution?
2. Body: Discuss at least 3 major causes:
   - Taxation without representation
   - British policies (Stamp Act, Tea Act, etc.)
   - Colonial desire for self-governance
3. Conclusion: How did these causes lead to revolution?

Include at least 2 primary source references.`,
        topicCode: 'american-revolution',
        classId: 'class-us-history',
        type: 'essay',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxPoints: 100
      },
      {
        code: 'assign-civil-war-timeline',
        title: 'Civil War Timeline Project',
        instructions: `Create a detailed timeline of the Civil War:

1. Include at least 15 major events from 1861-1865
2. For each event include: date, name, description, significance
3. Include key battles: Fort Sumter, Bull Run, Gettysburg, Appomattox
4. Include important political events: Emancipation Proclamation, etc.
5. Use images or illustrations for at least 5 events
6. Submit as poster or digital presentation`,
        topicCode: 'civil-war',
        classId: 'class-us-history',
        type: 'project',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        maxPoints: 175
      },
      {
        code: 'assign-constitution-analysis',
        title: 'Constitution Analysis Assignment',
        instructions: `Analyze the US Constitution:

1. Read the Preamble and explain each phrase
2. Summarize the powers of each branch of government
3. Explain the system of checks and balances
4. Choose 2 amendments from the Bill of Rights and explain their importance
5. How does the Constitution reflect Enlightenment ideas?`,
        topicCode: 'constitution',
        classId: 'class-us-history',
        type: 'homework',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        maxPoints: 100
      },

      // English Literature
      {
        code: 'assign-literary-analysis',
        title: 'Literary Elements Analysis',
        instructions: `Choose a short story or novel excerpt and analyze:

1. Identify the protagonist and antagonist
2. Describe the setting and its importance
3. Identify the main conflict (internal/external)
4. Find examples of at least 3 literary devices (metaphor, simile, foreshadowing, etc.)
5. Explain the theme of the work
6. Write a 2-paragraph reflection on the author's purpose`,
        topicCode: 'literary-elements',
        classId: 'class-english-lit',
        type: 'essay',
        dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        maxPoints: 100
      },
      {
        code: 'assign-essay-writing',
        title: 'Argumentative Essay',
        instructions: `Write a 5-paragraph argumentative essay on one of these topics:

1. Should cell phones be allowed in classrooms?
2. Is homework beneficial for students?
3. Should school start times be later?

Your essay must include:
- Clear thesis statement
- At least 3 supporting arguments
- Counterargument and rebuttal
- Proper citations
- Strong conclusion`,
        topicCode: 'essay-writing-intro',
        classId: 'class-english-lit',
        type: 'essay',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        maxPoints: 150
      },

      // ---- LINCOLN MIDDLE SCHOOL ----
      // Pre-Algebra
      {
        code: 'assign-prealg-variables',
        title: 'Introduction to Variables',
        instructions: `Complete these variable expression problems:

1. Write an expression for "a number increased by 7"
2. Write an expression for "twice a number minus 4"
3. Evaluate 3n + 5 when n = 4
4. Evaluate 2(x - 3) when x = 7
5. Is n = 5 a solution to 3n - 7 = 8? Show your work.`,
        topicCode: 'variables-expressions',
        classId: 'class-pre-algebra',
        type: 'homework',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxPoints: 50
      },
      {
        code: 'assign-prealg-inequalities',
        title: 'Inequalities Practice',
        instructions: `Solve and graph each inequality:

1. x + 5 > 12
2. 3n - 4 ≤ 11
3. 2(y + 3) ≥ 10
4. Write an inequality: "You must be at least 48 inches tall"
5. Write an inequality for: "No more than 25 students per class"`,
        topicCode: 'inequalities',
        classId: 'class-pre-algebra',
        type: 'homework',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        maxPoints: 60
      },

      // Life Science
      {
        code: 'assign-ecosystems-poster',
        title: 'Ecosystem Poster Project',
        instructions: `Create a poster about a chosen ecosystem:

1. Choose: rainforest, desert, tundra, ocean, or grassland
2. Describe the climate and geography
3. Draw a food web with at least 8 organisms
4. Identify producers, consumers, and decomposers
5. Explain 2 adaptations organisms have for this ecosystem
6. Discuss one threat to this ecosystem`,
        topicCode: 'ecosystems-advanced',
        classId: 'class-life-science',
        type: 'project',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        maxPoints: 125
      },
      {
        code: 'assign-food-chains-hw',
        title: 'Food Chains and Food Webs',
        instructions: `Answer these questions about food chains:

1. What is the difference between a food chain and a food web?
2. Draw a food chain with at least 4 organisms. Label each.
3. What happens to energy as you move up the food chain?
4. Define: producer, primary consumer, secondary consumer, decomposer
5. Why are decomposers important to ecosystems?`,
        topicCode: 'food-chains',
        classId: 'class-life-science',
        type: 'homework',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        maxPoints: 75
      },

      // English 7
      {
        code: 'assign-eng7-paragraph',
        title: 'Paragraph Writing Practice',
        instructions: `Write three well-structured paragraphs:

1. Paragraph 1: Describe your favorite place (use descriptive language)
2. Paragraph 2: Explain how to do something you're good at (how-to)
3. Paragraph 3: Convince someone to try your favorite activity (persuasive)

Each paragraph must have:
- Topic sentence
- At least 3 supporting sentences
- Concluding sentence`,
        topicCode: 'paragraph-writing',
        classId: 'class-english-7',
        type: 'homework',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        maxPoints: 75
      },
      {
        code: 'assign-eng7-grammar',
        title: 'Nouns and Verbs Review',
        instructions: `Complete the grammar exercises:

1. Identify all nouns in: "The quick brown fox jumps over the lazy dog."
2. Identify all verbs in: "She ran quickly to the store and bought groceries."
3. Write 5 sentences using action verbs
4. Write 5 sentences using linking verbs
5. Change these nouns from singular to plural: child, mouse, deer, tooth, person`,
        topicCode: 'grammar-nouns-verbs',
        classId: 'class-english-7',
        type: 'homework',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxPoints: 50
      },

      // Social Studies 7
      {
        code: 'assign-ss7-cultures',
        title: 'World Cultures Research Project',
        instructions: `Research a culture from another country:

1. Choose a country (not USA)
2. Research: location, population, language, religion
3. Describe traditions, holidays, and customs
4. Research traditional food, clothing, and music
5. Compare and contrast with American culture
6. Create a presentation or poster`,
        topicCode: 'cultures-around-world',
        classId: 'class-social-studies-7',
        type: 'project',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        maxPoints: 150
      },
      {
        code: 'assign-ss7-geography',
        title: 'Map Skills Assignment',
        instructions: `Complete these geography exercises:

1. Label the 7 continents and 5 oceans on a blank world map
2. Identify the Prime Meridian and Equator
3. Find the latitude and longitude of 5 major cities
4. Explain the difference between physical and political maps
5. Draw a map of your school with a legend and compass rose`,
        topicCode: 'maps-globes',
        classId: 'class-social-studies-7',
        type: 'homework',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        maxPoints: 75
      },

      // ---- LINCOLN ELEMENTARY SCHOOL ----
      // Kindergarten Math
      {
        code: 'assign-mathk-counting',
        title: 'Counting Practice Sheet',
        instructions: `Practice counting to 10:

1. Count the objects in each picture
2. Write the number that comes next: 1, 2, __
3. Write the number that comes before: __, 5, 6
4. Circle groups of 5 objects
5. Draw 7 stars`,
        topicCode: 'counting-10',
        classId: 'class-math-k',
        type: 'homework',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        maxPoints: 30
      },
      {
        code: 'assign-mathk-shapes',
        title: 'Shapes Around Us',
        instructions: `Find shapes in the real world:

1. Draw 3 things shaped like circles
2. Draw 3 things shaped like squares
3. Draw 3 things shaped like triangles
4. Color the shapes: circles = red, squares = blue, triangles = green
5. How many sides does each shape have?`,
        topicCode: 'shapes-basic',
        classId: 'class-math-k',
        type: 'homework',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxPoints: 30
      },

      // Grade 2 Math
      {
        code: 'assign-math2-addition',
        title: 'Addition Within 100',
        instructions: `Solve these addition problems:

1. 34 + 25 = ___
2. 47 + 38 = ___
3. 56 + 29 = ___
4. 63 + 18 = ___
5. Word problem: Sarah has 45 stickers. She gets 27 more. How many total?`,
        topicCode: 'addition-100',
        classId: 'class-math-2',
        type: 'homework',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        maxPoints: 40
      },
      {
        code: 'assign-math2-money',
        title: 'Counting Money',
        instructions: `Count the coins and bills:

1. Draw coins to show 47 cents
2. Count: 3 quarters, 2 dimes, 4 pennies = ___
3. You have $1.00. You spend 65 cents. How much is left?
4. What coins make 50 cents? (Show 2 different ways)
5. Word problem: A toy costs $2.50. You have $3.00. What's your change?`,
        topicCode: 'money-coins',
        classId: 'class-math-2',
        type: 'homework',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        maxPoints: 50
      },

      // Grade 4 Math
      {
        code: 'assign-math4-multiplication',
        title: 'Multi-Digit Multiplication',
        instructions: `Solve using the standard algorithm:

1. 23 × 14 = ___
2. 45 × 32 = ___
3. 67 × 28 = ___
4. 156 × 7 = ___
5. Word problem: A bookshelf holds 24 books. There are 15 shelves. How many books total?`,
        topicCode: 'multi-digit-multiplication',
        classId: 'class-math-4',
        type: 'homework',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxPoints: 60
      },
      {
        code: 'assign-math4-fractions',
        title: 'Equivalent Fractions',
        instructions: `Find equivalent fractions:

1. 1/2 = __/6
2. 2/3 = __/9
3. 3/4 = 6/__
4. Reduce to lowest terms: 6/8
5. Reduce to lowest terms: 9/12
6. Are 2/4 and 3/6 equivalent? Explain.`,
        topicCode: 'fractions-equivalent',
        classId: 'class-math-4',
        type: 'homework',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        maxPoints: 50
      },

      // Kindergarten Reading
      {
        code: 'assign-readk-letters',
        title: 'Letter Sounds Practice',
        instructions: `Practice letter sounds:

1. Say the sound for each letter: A, B, C, D, E
2. Draw a picture of something that starts with "M"
3. Draw a picture of something that starts with "S"
4. Circle the letter that makes the first sound in "cat"
5. Match pictures to their beginning letter sounds`,
        topicCode: 'letter-sounds',
        classId: 'class-reading-k',
        type: 'homework',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        maxPoints: 25
      },
      {
        code: 'assign-readk-sightwords',
        title: 'Sight Words Practice',
        instructions: `Practice these sight words:

1. Read each word: the, and, is, it, you
2. Write each word 3 times
3. Find these words in a book with a grown-up
4. Use 2 of the words in a sentence
5. Draw a picture for your sentence`,
        topicCode: 'sight-words-k',
        classId: 'class-reading-k',
        type: 'homework',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxPoints: 25
      },

      // Grade 2 Reading
      {
        code: 'assign-read2-fluency',
        title: 'Reading Fluency Practice',
        instructions: `Practice reading fluently:

1. Read the passage aloud 3 times
2. Time yourself each time (with a grown-up's help)
3. Circle any words you found difficult
4. Answer the comprehension questions
5. Write a summary sentence about what you read`,
        topicCode: 'reading-fluency',
        classId: 'class-reading-2',
        type: 'homework',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxPoints: 40
      },
      {
        code: 'assign-read2-spelling',
        title: 'Spelling Patterns: -ight words',
        instructions: `Practice -ight words:

1. Write each word 3 times: light, night, right, bright, sight
2. Use each word in a sentence
3. Find 2 more words that end in -ight
4. Alphabetize the -ight words
5. Draw a picture for "bright light at night"`,
        topicCode: 'spelling-patterns',
        classId: 'class-reading-2',
        type: 'homework',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        maxPoints: 35
      },

      // ---- LINCOLN PRESCHOOL ----
      // Pre-K 3 Colors
      {
        code: 'assign-prek3-colors',
        title: 'Color Recognition Fun',
        instructions: `Learn your colors:

1. Point to something RED in the classroom
2. Point to something BLUE in the classroom
3. Color the circle RED
4. Color the square BLUE
5. Color the triangle YELLOW
6. Tell a grown-up your favorite color`,
        topicCode: 'colors-shapes',
        classId: 'class-prek3-colors',
        type: 'homework',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxPoints: 20
      },

      // Pre-K 4 ABCs
      {
        code: 'assign-prek4-abc',
        title: 'ABC Practice',
        instructions: `Practice your ABCs:

1. Sing the ABC song with a grown-up
2. Trace the letters A, B, C, D, E
3. Find the letter that your name starts with
4. Draw a picture of something that starts with A
5. Count how many letters are in your first name`,
        topicCode: 'letters-abc',
        classId: 'class-prek4-abc',
        type: 'homework',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxPoints: 20
      },
      {
        code: 'assign-prek4-numbers',
        title: 'Counting to 5',
        instructions: `Practice counting:

1. Count to 5 with a grown-up
2. Hold up 3 fingers
3. Draw 4 circles
4. Count the buttons on your shirt
5. Clap 5 times`,
        topicCode: 'numbers-counting',
        classId: 'class-prek4-abc',
        type: 'homework',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        maxPoints: 20
      },

      // ---- LINCOLN VO-TECH ----
      // Automotive
      {
        code: 'assign-auto-safety',
        title: 'Shop Safety Rules Quiz Prep',
        instructions: `Study these safety topics for the quiz:

1. List 5 personal protective equipment (PPE) items
2. Describe proper lifting technique
3. What are the fire extinguisher types and their uses?
4. Explain the purpose of MSDS sheets
5. List 3 hazards specific to automotive shops`,
        topicCode: 'voc-auto-safety',
        classId: 'class-auto-basics',
        type: 'homework',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxPoints: 50
      },
      {
        code: 'assign-auto-tools',
        title: 'Tool Identification Project',
        instructions: `Create a tool identification guide:

1. Take photos or draw 15 common automotive hand tools
2. Label each tool with its correct name
3. Describe the primary use of each tool
4. Explain proper storage and care
5. Identify 3 tools that require safety precautions`,
        topicCode: 'voc-auto-tools',
        classId: 'class-auto-basics',
        type: 'project',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxPoints: 100
      },
      {
        code: 'assign-auto-brakes',
        title: 'Brake System Diagram',
        instructions: `Create a detailed brake system diagram:

1. Draw a complete disc brake assembly
2. Label all components: rotor, caliper, pads, etc.
3. Draw a drum brake assembly
4. Label all components: drum, shoes, springs, etc.
5. Explain how hydraulic pressure operates brakes`,
        topicCode: 'voc-auto-brakes',
        classId: 'class-auto-basics',
        type: 'project',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        maxPoints: 125
      },

      // Welding
      {
        code: 'assign-weld-safety',
        title: 'Welding Safety Certification Study Guide',
        instructions: `Complete this safety study guide:

1. List all required PPE for welding
2. Describe proper ventilation requirements
3. Explain fire prevention measures
4. What are the symptoms of arc eye?
5. Describe proper handling of compressed gas cylinders`,
        topicCode: 'voc-weld-safety',
        classId: 'class-welding-intro',
        type: 'homework',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxPoints: 60
      },
      {
        code: 'assign-weld-mig-practice',
        title: 'MIG Welding Technique Report',
        instructions: `Document your MIG welding practice:

1. Describe proper machine setup (wire speed, voltage)
2. Explain the importance of work angle and travel angle
3. Describe common MIG welding defects and their causes
4. Log 5 practice welds with photos and self-evaluation
5. Explain how to troubleshoot porosity issues`,
        topicCode: 'voc-weld-mig',
        classId: 'class-welding-intro',
        type: 'homework',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxPoints: 100
      },

      // Culinary
      {
        code: 'assign-culinary-safety',
        title: 'Kitchen Safety & Sanitation Test Prep',
        instructions: `Study these food safety topics:

1. Describe the temperature danger zone
2. Explain proper handwashing technique (steps and duration)
3. What are the Big 8 food allergens?
4. Describe FIFO inventory management
5. Explain cross-contamination prevention`,
        topicCode: 'voc-culinary-safety',
        classId: 'class-culinary-fundamentals',
        type: 'homework',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxPoints: 50
      },
      {
        code: 'assign-culinary-knife',
        title: 'Knife Skills Practice Log',
        instructions: `Document your knife skills practice:

1. Demonstrate and photograph 5 basic cuts: julienne, brunoise, chiffonade, dice, mince
2. List the knives used for each cut
3. Time yourself cutting 1 onion using proper technique
4. Explain proper knife care and storage
5. Describe knife safety rules`,
        topicCode: 'voc-culinary-knife',
        classId: 'class-culinary-fundamentals',
        type: 'project',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxPoints: 100
      },
      {
        code: 'assign-culinary-methods',
        title: 'Cooking Methods Comparison',
        instructions: `Compare dry and moist heat cooking methods:

1. Define dry heat methods: sauté, roast, grill, broil
2. Define moist heat methods: braise, steam, poach, simmer
3. Which method is best for: chicken breast, beef brisket, vegetables?
4. Explain the Maillard reaction
5. Create a dish using 2 different cooking methods`,
        topicCode: 'voc-culinary-methods',
        classId: 'class-culinary-fundamentals',
        type: 'homework',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        maxPoints: 75
      }
    ];

    for (const assignment of assignmentsData) {
      const topic = topicMap[assignment.topicCode];
      if (topic) {
        await prisma.assignment.upsert({
          where: { code: assignment.code },
          update: {},
          create: {
            code: assignment.code,
            title: assignment.title,
            instructions: assignment.instructions,
            topicId: topic.id,
            classId: assignment.classId,
            type: assignment.type,
            dueDate: assignment.dueDate,
            maxPoints: assignment.maxPoints,
            allowLate: true,
            createdById: teacher.id,
            isActive: true
          }
        });
      }
    }
    console.log('Assignments seeded');

    // =====================
    // QUIZZES (Expanded across all schools and grade levels)
    // =====================
    const quizzesData = [
      // ---- LINCOLN HIGH SCHOOL ----
      // Algebra I
      {
        code: 'quiz-linear-basics',
        title: 'Linear Equations Basics Quiz',
        description: 'Test your understanding of basic linear equations.',
        topicCode: 'linear-equations',
        classId: 'class-algebra-1a',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'What is the solution to: x + 5 = 12?', questionType: 'fill_blank', correctAnswer: '7', points: 2, explanation: 'Subtract 5 from both sides: x = 12 - 5 = 7' },
          { questionNum: 2, questionText: 'What is the solution to: 2x = 16?', questionType: 'fill_blank', correctAnswer: '8', points: 2, explanation: 'Divide both sides by 2: x = 16 ÷ 2 = 8' },
          { questionNum: 3, questionText: 'Which equation is linear?', questionType: 'multiple_choice', options: JSON.stringify(['x² + 3 = 7', '2x + 5 = 9', 'x³ = 27', '√x = 4']), correctAnswer: '2x + 5 = 9', points: 2, explanation: 'Linear equations have x to the first power only.' },
          { questionNum: 4, questionText: 'Solving 3x - 6 = 9 gives x = 5', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: '3x = 15, so x = 5. Correct!' },
          { questionNum: 5, questionText: 'What is the solution to: 4x + 3 = 2x + 11?', questionType: 'fill_blank', correctAnswer: '4', points: 2, explanation: '4x - 2x = 11 - 3, so 2x = 8, x = 4' }
        ]
      },
      {
        code: 'quiz-variables-intro',
        title: 'Variables and Expressions',
        description: 'Test your knowledge of algebraic expressions.',
        topicCode: 'variables-expressions',
        classId: 'class-algebra-1a',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'What is 3x + 2 when x = 4?', questionType: 'fill_blank', correctAnswer: '14', points: 2, explanation: '3(4) + 2 = 12 + 2 = 14' },
          { questionNum: 2, questionText: 'Which is a variable?', questionType: 'multiple_choice', options: JSON.stringify(['5', 'x', '+', '=']), correctAnswer: 'x', points: 2, explanation: 'A variable is a letter that represents an unknown value.' },
          { questionNum: 3, questionText: '"The sum of x and 5" can be written as x + 5', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Sum means addition, so x + 5 is correct.' },
          { questionNum: 4, questionText: 'What is 2(x - 3) when x = 7?', questionType: 'fill_blank', correctAnswer: '8', points: 2, explanation: '2(7 - 3) = 2(4) = 8' },
          { questionNum: 5, questionText: 'A coefficient is the number in front of a variable.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'In 3x, the coefficient is 3.' }
        ]
      },

      // Geometry
      {
        code: 'quiz-triangles-basic',
        title: 'Triangle Fundamentals',
        description: 'Test your knowledge of triangle types and properties.',
        topicCode: 'triangles',
        classId: 'class-geometry-2b',
        timeLimit: 20,
        passingScore: 70,
        maxAttempts: 2,
        questions: [
          { questionNum: 1, questionText: 'What is a triangle with all sides equal called?', questionType: 'multiple_choice', options: JSON.stringify(['Isosceles', 'Scalene', 'Equilateral', 'Right']), correctAnswer: 'Equilateral', points: 2, explanation: 'Equilateral means equal sides.' },
          { questionNum: 2, questionText: 'The sum of angles in any triangle is _____ degrees.', questionType: 'fill_blank', correctAnswer: '180', points: 2, explanation: 'This is a fundamental property of all triangles.' },
          { questionNum: 3, questionText: 'A triangle with one 90° angle is called obtuse.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'False', points: 2, explanation: 'A 90° angle makes it a RIGHT triangle.' },
          { questionNum: 4, questionText: 'An isosceles triangle has exactly how many equal sides?', questionType: 'fill_blank', correctAnswer: '2', points: 2, explanation: 'Isosceles has exactly 2 equal sides.' },
          { questionNum: 5, questionText: 'Which triangle has no equal sides?', questionType: 'multiple_choice', options: JSON.stringify(['Equilateral', 'Isosceles', 'Scalene', 'Right']), correctAnswer: 'Scalene', points: 2, explanation: 'Scalene triangles have all different side lengths.' }
        ]
      },
      {
        code: 'quiz-angles-basics',
        title: 'Angles and Measures',
        description: 'Test your understanding of angles.',
        topicCode: 'angles',
        classId: 'class-geometry-2b',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'Two angles that add up to 90° are called...', questionType: 'multiple_choice', options: JSON.stringify(['Supplementary', 'Complementary', 'Vertical', 'Adjacent']), correctAnswer: 'Complementary', points: 2, explanation: 'Complementary angles sum to 90°.' },
          { questionNum: 2, questionText: 'What is the measure of a straight angle?', questionType: 'fill_blank', correctAnswer: '180', points: 2, explanation: 'A straight angle measures 180°.' },
          { questionNum: 3, questionText: 'Vertical angles are always equal.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Vertical angles are formed by intersecting lines and are always equal.' },
          { questionNum: 4, questionText: 'An acute angle is less than _____ degrees.', questionType: 'fill_blank', correctAnswer: '90', points: 2, explanation: 'Acute angles are less than 90°.' },
          { questionNum: 5, questionText: 'Supplementary angles add up to 180°.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Supplementary angles sum to 180°.' }
        ]
      },

      // Biology
      {
        code: 'quiz-cells-intro',
        title: 'Cell Structure Quiz',
        description: 'Test your understanding of cell organelles and their functions.',
        topicCode: 'cell-structure',
        classId: 'class-bio-3c',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'What organelle is known as the "powerhouse of the cell"?', questionType: 'multiple_choice', options: JSON.stringify(['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body']), correctAnswer: 'Mitochondria', points: 2, explanation: 'Mitochondria produce ATP.' },
          { questionNum: 2, questionText: 'The nucleus contains the cell\'s DNA.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'The nucleus stores genetic information.' },
          { questionNum: 3, questionText: 'Which organelle is only found in plant cells?', questionType: 'multiple_choice', options: JSON.stringify(['Mitochondria', 'Chloroplast', 'Ribosome', 'Cell membrane']), correctAnswer: 'Chloroplast', points: 2, explanation: 'Chloroplasts contain chlorophyll for photosynthesis.' },
          { questionNum: 4, questionText: 'Proteins are made by which organelle?', questionType: 'fill_blank', correctAnswer: 'Ribosome', points: 2, explanation: 'Ribosomes are the protein factories of the cell.' },
          { questionNum: 5, questionText: 'Bacteria cells have a nucleus.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'False', points: 2, explanation: 'Bacteria are prokaryotes - they lack a membrane-bound nucleus.' }
        ]
      },
      {
        code: 'quiz-cell-transport',
        title: 'Cell Transport Quiz',
        description: 'Test your knowledge of how materials move in and out of cells.',
        topicCode: 'cell-membrane',
        classId: 'class-bio-3c',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'Movement of water across a membrane is called...', questionType: 'multiple_choice', options: JSON.stringify(['Diffusion', 'Osmosis', 'Active transport', 'Endocytosis']), correctAnswer: 'Osmosis', points: 2, explanation: 'Osmosis is specifically the diffusion of water.' },
          { questionNum: 2, questionText: 'Passive transport requires energy from the cell.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'False', points: 2, explanation: 'Passive transport does NOT require energy.' },
          { questionNum: 3, questionText: 'In a hypertonic solution, a cell will...', questionType: 'multiple_choice', options: JSON.stringify(['Swell', 'Shrink', 'Stay the same', 'Explode']), correctAnswer: 'Shrink', points: 2, explanation: 'Water moves out of the cell in a hypertonic solution.' },
          { questionNum: 4, questionText: 'Active transport moves molecules from low to high concentration.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Active transport works against the concentration gradient.' },
          { questionNum: 5, questionText: 'The cell membrane is also called the _____ membrane.', questionType: 'fill_blank', correctAnswer: 'plasma', points: 2, explanation: 'The cell membrane is also known as the plasma membrane.' }
        ]
      },

      // US History
      {
        code: 'quiz-revolution-causes',
        title: 'American Revolution Causes',
        description: 'Test your knowledge of what led to the American Revolution.',
        topicCode: 'american-revolution',
        classId: 'class-us-history',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'Which act taxed paper goods in the colonies?', questionType: 'multiple_choice', options: JSON.stringify(['Tea Act', 'Stamp Act', 'Sugar Act', 'Townshend Acts']), correctAnswer: 'Stamp Act', points: 2, explanation: 'The Stamp Act (1765) taxed all paper documents.' },
          { questionNum: 2, questionText: 'The Boston Tea Party occurred in 1773.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'The Boston Tea Party was on December 16, 1773.' },
          { questionNum: 3, questionText: '"No taxation without _____" was a colonial slogan.', questionType: 'fill_blank', correctAnswer: 'representation', points: 2, explanation: 'Colonists demanded representation in Parliament.' },
          { questionNum: 4, questionText: 'Who wrote the Declaration of Independence?', questionType: 'multiple_choice', options: JSON.stringify(['George Washington', 'Thomas Jefferson', 'Benjamin Franklin', 'John Adams']), correctAnswer: 'Thomas Jefferson', points: 2, explanation: 'Jefferson was the primary author of the Declaration.' },
          { questionNum: 5, questionText: 'The Declaration of Independence was signed in 1776.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'The Declaration was adopted on July 4, 1776.' }
        ]
      },
      {
        code: 'quiz-civil-war-basics',
        title: 'Civil War Basics',
        description: 'Test your knowledge of the American Civil War.',
        topicCode: 'civil-war',
        classId: 'class-us-history',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'The Civil War began in which year?', questionType: 'fill_blank', correctAnswer: '1861', points: 2, explanation: 'The Civil War began in 1861 with Fort Sumter.' },
          { questionNum: 2, questionText: 'Who was president during the Civil War?', questionType: 'multiple_choice', options: JSON.stringify(['George Washington', 'Abraham Lincoln', 'Thomas Jefferson', 'Andrew Jackson']), correctAnswer: 'Abraham Lincoln', points: 2, explanation: 'Lincoln was president from 1861-1865.' },
          { questionNum: 3, questionText: 'The Union was the Northern states.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'The Union represented the Northern states.' },
          { questionNum: 4, questionText: 'The Emancipation Proclamation freed enslaved people in the _____', questionType: 'multiple_choice', options: JSON.stringify(['Union states', 'Confederate states', 'All states', 'Border states']), correctAnswer: 'Confederate states', points: 2, explanation: 'It freed enslaved people in rebelling states.' },
          { questionNum: 5, questionText: 'The Battle of Gettysburg was a turning point of the war.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Gettysburg (1863) was a major Union victory.' }
        ]
      },

      // English Literature
      {
        code: 'quiz-literary-elements',
        title: 'Literary Elements Quiz',
        description: 'Test your knowledge of story elements.',
        topicCode: 'literary-elements',
        classId: 'class-english-lit',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'The main character in a story is called the...', questionType: 'multiple_choice', options: JSON.stringify(['Antagonist', 'Protagonist', 'Narrator', 'Author']), correctAnswer: 'Protagonist', points: 2, explanation: 'The protagonist is the main character.' },
          { questionNum: 2, questionText: 'Setting includes time and place of a story.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Setting is where and when the story takes place.' },
          { questionNum: 3, questionText: 'A comparison using "like" or "as" is a...', questionType: 'multiple_choice', options: JSON.stringify(['Metaphor', 'Simile', 'Personification', 'Hyperbole']), correctAnswer: 'Simile', points: 2, explanation: 'Similes use "like" or "as" to compare.' },
          { questionNum: 4, questionText: 'The central message of a story is the _____', questionType: 'fill_blank', correctAnswer: 'theme', points: 2, explanation: 'The theme is the underlying message.' },
          { questionNum: 5, questionText: 'Foreshadowing hints at events that will happen later.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Foreshadowing gives clues about future events.' }
        ]
      },

      // ---- LINCOLN MIDDLE SCHOOL ----
      // Pre-Algebra
      {
        code: 'quiz-prealg-variables',
        title: 'Introduction to Variables',
        description: 'Test your understanding of variables and expressions.',
        topicCode: 'variables-expressions',
        classId: 'class-pre-algebra',
        timeLimit: 12,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'What is n + 5 when n = 3?', questionType: 'fill_blank', correctAnswer: '8', points: 2, explanation: '3 + 5 = 8' },
          { questionNum: 2, questionText: 'A variable represents an unknown number.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Variables are letters that stand for numbers.' },
          { questionNum: 3, questionText: 'What does 2n mean?', questionType: 'multiple_choice', options: JSON.stringify(['2 + n', '2 × n', '2 - n', '2 ÷ n']), correctAnswer: '2 × n', points: 2, explanation: '2n means 2 times n.' },
          { questionNum: 4, questionText: 'Evaluate 4x - 2 when x = 3.', questionType: 'fill_blank', correctAnswer: '10', points: 2, explanation: '4(3) - 2 = 12 - 2 = 10' },
          { questionNum: 5, questionText: '"A number increased by 7" is written as n - 7.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'False', points: 2, explanation: 'Increased means addition: n + 7' }
        ]
      },
      {
        code: 'quiz-prealg-inequalities',
        title: 'Inequalities Quiz',
        description: 'Test your knowledge of inequalities.',
        topicCode: 'inequalities',
        classId: 'class-pre-algebra',
        timeLimit: 12,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'The symbol < means...', questionType: 'multiple_choice', options: JSON.stringify(['Less than', 'Greater than', 'Equal to', 'Not equal']), correctAnswer: 'Less than', points: 2, explanation: '< means less than.' },
          { questionNum: 2, questionText: 'Is 5 a solution to x > 3?', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: '5 is greater than 3, so yes.' },
          { questionNum: 3, questionText: 'The symbol ≤ means "less than or equal to."', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: '≤ includes both less than AND equal to.' },
          { questionNum: 4, questionText: 'If x + 2 > 7, then x > ____', questionType: 'fill_blank', correctAnswer: '5', points: 2, explanation: 'x + 2 > 7, so x > 5' },
          { questionNum: 5, questionText: '≥ means...', questionType: 'multiple_choice', options: JSON.stringify(['Less than', 'Greater than', 'Greater than or equal to', 'Not equal']), correctAnswer: 'Greater than or equal to', points: 2, explanation: '≥ means greater than or equal to.' }
        ]
      },

      // Life Science
      {
        code: 'quiz-food-chains',
        title: 'Food Chains and Energy',
        description: 'Test your knowledge of ecosystems and food chains.',
        topicCode: 'food-chains',
        classId: 'class-life-science',
        timeLimit: 12,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'Organisms that make their own food are called...', questionType: 'multiple_choice', options: JSON.stringify(['Consumers', 'Producers', 'Decomposers', 'Predators']), correctAnswer: 'Producers', points: 2, explanation: 'Producers (plants) make their own food.' },
          { questionNum: 2, questionText: 'Energy decreases as you move up a food chain.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Only about 10% of energy transfers to the next level.' },
          { questionNum: 3, questionText: 'An organism that eats only plants is a...', questionType: 'multiple_choice', options: JSON.stringify(['Carnivore', 'Herbivore', 'Omnivore', 'Decomposer']), correctAnswer: 'Herbivore', points: 2, explanation: 'Herbivores eat only plants.' },
          { questionNum: 4, questionText: 'Decomposers break down dead organisms.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Decomposers recycle nutrients back into the ecosystem.' },
          { questionNum: 5, questionText: 'What do all food chains start with?', questionType: 'fill_blank', correctAnswer: 'producers', points: 2, explanation: 'All food chains begin with producers (plants).' }
        ]
      },

      // English 7
      {
        code: 'quiz-eng7-grammar',
        title: 'Nouns and Verbs Quiz',
        description: 'Test your grammar knowledge.',
        topicCode: 'grammar-nouns-verbs',
        classId: 'class-english-7',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'A noun is a person, place, thing, or idea.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Nouns name people, places, things, or ideas.' },
          { questionNum: 2, questionText: 'Which word is a verb?', questionType: 'multiple_choice', options: JSON.stringify(['Happy', 'Run', 'Beautiful', 'House']), correctAnswer: 'Run', points: 2, explanation: 'Run is an action verb.' },
          { questionNum: 3, questionText: '"Is" and "are" are examples of action verbs.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'False', points: 2, explanation: '"Is" and "are" are linking verbs, not action verbs.' },
          { questionNum: 4, questionText: 'What is the plural of "child"?', questionType: 'fill_blank', correctAnswer: 'children', points: 2, explanation: 'Child becomes children (irregular plural).' },
          { questionNum: 5, questionText: 'Which is a proper noun?', questionType: 'multiple_choice', options: JSON.stringify(['city', 'dog', 'Texas', 'book']), correctAnswer: 'Texas', points: 2, explanation: 'Texas is a specific place name (proper noun).' }
        ]
      },

      // Social Studies 7
      {
        code: 'quiz-ss7-geography',
        title: 'World Geography Quiz',
        description: 'Test your knowledge of geography basics.',
        topicCode: 'maps-globes',
        classId: 'class-social-studies-7',
        timeLimit: 12,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'How many continents are there?', questionType: 'fill_blank', correctAnswer: '7', points: 2, explanation: 'There are 7 continents on Earth.' },
          { questionNum: 2, questionText: 'The Prime Meridian runs through which city?', questionType: 'multiple_choice', options: JSON.stringify(['New York', 'London', 'Paris', 'Tokyo']), correctAnswer: 'London', points: 2, explanation: 'The Prime Meridian passes through Greenwich, London.' },
          { questionNum: 3, questionText: 'The Equator divides Earth into Northern and Southern hemispheres.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'The Equator is at 0° latitude.' },
          { questionNum: 4, questionText: 'Lines of latitude run east to west.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Latitude lines are horizontal (parallel).' },
          { questionNum: 5, questionText: 'How many oceans are there?', questionType: 'fill_blank', correctAnswer: '5', points: 2, explanation: 'There are 5 oceans: Pacific, Atlantic, Indian, Southern, Arctic.' }
        ]
      },

      // ---- LINCOLN ELEMENTARY SCHOOL ----
      // Kindergarten Math
      {
        code: 'quiz-mathk-counting',
        title: 'Counting to 10',
        description: 'Practice counting numbers.',
        topicCode: 'counting-10',
        classId: 'class-math-k',
        timeLimit: 8,
        passingScore: 70,
        maxAttempts: 5,
        questions: [
          { questionNum: 1, questionText: 'What number comes after 5?', questionType: 'fill_blank', correctAnswer: '6', points: 2, explanation: 'After 5 comes 6!' },
          { questionNum: 2, questionText: 'How many fingers are on one hand?', questionType: 'fill_blank', correctAnswer: '5', points: 2, explanation: 'We have 5 fingers on each hand!' },
          { questionNum: 3, questionText: 'What number comes before 4?', questionType: 'fill_blank', correctAnswer: '3', points: 2, explanation: 'Before 4 comes 3!' },
          { questionNum: 4, questionText: '10 comes after 9.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Yes! 9, then 10!' },
          { questionNum: 5, questionText: 'Which number is bigger: 3 or 7?', questionType: 'fill_blank', correctAnswer: '7', points: 2, explanation: '7 is bigger than 3!' }
        ]
      },
      {
        code: 'quiz-mathk-shapes',
        title: 'Basic Shapes',
        description: 'Learn about shapes.',
        topicCode: 'shapes-basic',
        classId: 'class-math-k',
        timeLimit: 8,
        passingScore: 70,
        maxAttempts: 5,
        questions: [
          { questionNum: 1, questionText: 'A circle has no corners.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Circles are round with no corners!' },
          { questionNum: 2, questionText: 'How many sides does a triangle have?', questionType: 'fill_blank', correctAnswer: '3', points: 2, explanation: 'Tri means 3. Triangles have 3 sides!' },
          { questionNum: 3, questionText: 'How many sides does a square have?', questionType: 'fill_blank', correctAnswer: '4', points: 2, explanation: 'Squares have 4 equal sides!' },
          { questionNum: 4, questionText: 'A square has 4 corners.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Squares have 4 corners!' },
          { questionNum: 5, questionText: 'Which shape is round?', questionType: 'multiple_choice', options: JSON.stringify(['Square', 'Triangle', 'Circle', 'Rectangle']), correctAnswer: 'Circle', points: 2, explanation: 'Circles are perfectly round!' }
        ]
      },

      // Grade 2 Math
      {
        code: 'quiz-math2-addition',
        title: 'Addition Within 100',
        description: 'Practice adding numbers.',
        topicCode: 'addition-100',
        classId: 'class-math-2',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: '25 + 13 = ?', questionType: 'fill_blank', correctAnswer: '38', points: 2, explanation: '25 + 13 = 38' },
          { questionNum: 2, questionText: '40 + 27 = ?', questionType: 'fill_blank', correctAnswer: '67', points: 2, explanation: '40 + 27 = 67' },
          { questionNum: 3, questionText: '36 + 18 = 54', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: '36 + 18 = 54. Correct!' },
          { questionNum: 4, questionText: '52 + 29 = ?', questionType: 'fill_blank', correctAnswer: '81', points: 2, explanation: '52 + 29 = 81' },
          { questionNum: 5, questionText: 'When we add, the answer is called the...', questionType: 'multiple_choice', options: JSON.stringify(['Difference', 'Sum', 'Product', 'Quotient']), correctAnswer: 'Sum', points: 2, explanation: 'The answer to addition is called the sum.' }
        ]
      },
      {
        code: 'quiz-math2-money',
        title: 'Counting Money',
        description: 'Practice counting coins.',
        topicCode: 'money-coins',
        classId: 'class-math-2',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'How many cents is a quarter worth?', questionType: 'fill_blank', correctAnswer: '25', points: 2, explanation: 'A quarter = 25 cents' },
          { questionNum: 2, questionText: 'A dime is worth 10 cents.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'A dime = 10 cents' },
          { questionNum: 3, questionText: '2 quarters = ? cents', questionType: 'fill_blank', correctAnswer: '50', points: 2, explanation: '25 + 25 = 50 cents' },
          { questionNum: 4, questionText: 'Which coin is worth the most?', questionType: 'multiple_choice', options: JSON.stringify(['Penny', 'Nickel', 'Dime', 'Quarter']), correctAnswer: 'Quarter', points: 2, explanation: 'Quarter (25¢) is worth the most.' },
          { questionNum: 5, questionText: 'How many cents are in $1.00?', questionType: 'fill_blank', correctAnswer: '100', points: 2, explanation: '$1.00 = 100 cents' }
        ]
      },

      // Grade 4 Math
      {
        code: 'quiz-math4-multiplication',
        title: 'Multiplication Quiz',
        description: 'Test your multiplication skills.',
        topicCode: 'multi-digit-multiplication',
        classId: 'class-math-4',
        timeLimit: 12,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: '12 × 5 = ?', questionType: 'fill_blank', correctAnswer: '60', points: 2, explanation: '12 × 5 = 60' },
          { questionNum: 2, questionText: '23 × 4 = ?', questionType: 'fill_blank', correctAnswer: '92', points: 2, explanation: '23 × 4 = 92' },
          { questionNum: 3, questionText: '15 × 10 = 150', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: '15 × 10 = 150. Correct!' },
          { questionNum: 4, questionText: '34 × 3 = ?', questionType: 'fill_blank', correctAnswer: '102', points: 2, explanation: '34 × 3 = 102' },
          { questionNum: 5, questionText: 'The answer to multiplication is called the...', questionType: 'multiple_choice', options: JSON.stringify(['Sum', 'Difference', 'Product', 'Quotient']), correctAnswer: 'Product', points: 2, explanation: 'The answer to multiplication is the product.' }
        ]
      },
      {
        code: 'quiz-math4-fractions',
        title: 'Fractions Quiz',
        description: 'Test your fraction knowledge.',
        topicCode: 'fractions-equivalent',
        classId: 'class-math-4',
        timeLimit: 12,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'The top number of a fraction is called the...', questionType: 'multiple_choice', options: JSON.stringify(['Denominator', 'Numerator', 'Whole number', 'Decimal']), correctAnswer: 'Numerator', points: 2, explanation: 'The top number is the numerator.' },
          { questionNum: 2, questionText: '1/2 = 2/4', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: '1/2 and 2/4 are equivalent fractions.' },
          { questionNum: 3, questionText: '2/6 reduced to lowest terms is...', questionType: 'fill_blank', correctAnswer: '1/3', points: 2, explanation: '2/6 ÷ 2/2 = 1/3' },
          { questionNum: 4, questionText: 'The bottom number is the denominator.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'The denominator is the bottom number.' },
          { questionNum: 5, questionText: 'Which fraction is equivalent to 3/6?', questionType: 'multiple_choice', options: JSON.stringify(['1/3', '2/3', '1/2', '2/4']), correctAnswer: '1/2', points: 2, explanation: '3/6 = 1/2 (divide both by 3)' }
        ]
      },

      // Kindergarten Reading
      {
        code: 'quiz-readk-letters',
        title: 'Letter Sounds',
        description: 'Learn letter sounds.',
        topicCode: 'letter-sounds',
        classId: 'class-reading-k',
        timeLimit: 8,
        passingScore: 70,
        maxAttempts: 5,
        questions: [
          { questionNum: 1, questionText: 'What letter makes the /m/ sound?', questionType: 'fill_blank', correctAnswer: 'M', points: 2, explanation: 'M makes the /m/ sound like in "mom"!' },
          { questionNum: 2, questionText: '"Cat" starts with the letter C.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Yes! Cat starts with C!' },
          { questionNum: 3, questionText: 'What letter does "sun" start with?', questionType: 'fill_blank', correctAnswer: 'S', points: 2, explanation: 'Sun starts with S!' },
          { questionNum: 4, questionText: '"Dog" starts with the letter B.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'False', points: 2, explanation: 'Dog starts with D, not B!' },
          { questionNum: 5, questionText: 'What letter does "apple" start with?', questionType: 'fill_blank', correctAnswer: 'A', points: 2, explanation: 'Apple starts with A!' }
        ]
      },

      // Grade 2 Reading
      {
        code: 'quiz-read2-spelling',
        title: 'Spelling Patterns',
        description: 'Test your spelling knowledge.',
        topicCode: 'spelling-patterns',
        classId: 'class-reading-2',
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionNum: 1, questionText: 'Which word rhymes with "cat"?', questionType: 'multiple_choice', options: JSON.stringify(['Dog', 'Hat', 'Run', 'Big']), correctAnswer: 'Hat', points: 2, explanation: 'Cat and hat both end in -at!' },
          { questionNum: 2, questionText: '"Light" and "night" have the same ending.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Both end in -ight!' },
          { questionNum: 3, questionText: 'How do you spell the word for a nighttime light in the sky?', questionType: 'fill_blank', correctAnswer: 'moon', points: 2, explanation: 'Moon lights up the night!' },
          { questionNum: 4, questionText: 'Which word is spelled correctly?', questionType: 'multiple_choice', options: JSON.stringify(['Becuz', 'Because', 'Becuse', 'Becaus']), correctAnswer: 'Because', points: 2, explanation: 'Because is spelled B-E-C-A-U-S-E.' },
          { questionNum: 5, questionText: '"Bright" ends with the -ight pattern.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Bright ends in -ight!' }
        ]
      },

      // ---- LINCOLN PRESCHOOL ----
      {
        code: 'quiz-prek3-colors',
        title: 'Colors Fun!',
        description: 'Learn your colors!',
        topicCode: 'colors-shapes',
        classId: 'class-prek3-colors',
        timeLimit: 5,
        passingScore: 60,
        maxAttempts: 10,
        questions: [
          { questionNum: 1, questionText: 'Apples are often what color?', questionType: 'multiple_choice', options: JSON.stringify(['Blue', 'Red', 'Purple', 'Green']), correctAnswer: 'Red', points: 2, explanation: 'Many apples are red!' },
          { questionNum: 2, questionText: 'The sky is blue.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Yes! The sky is blue!' },
          { questionNum: 3, questionText: 'Bananas are what color?', questionType: 'multiple_choice', options: JSON.stringify(['Red', 'Yellow', 'Blue', 'Green']), correctAnswer: 'Yellow', points: 2, explanation: 'Bananas are yellow!' },
          { questionNum: 4, questionText: 'Grass is green.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Yes! Grass is green!' }
        ]
      },
      {
        code: 'quiz-prek4-abc',
        title: 'ABCs Quiz!',
        description: 'Practice your ABCs!',
        topicCode: 'letters-abc',
        classId: 'class-prek4-abc',
        timeLimit: 5,
        passingScore: 60,
        maxAttempts: 10,
        questions: [
          { questionNum: 1, questionText: 'What letter comes after A?', questionType: 'fill_blank', correctAnswer: 'B', points: 2, explanation: 'A, B, C!' },
          { questionNum: 2, questionText: 'C comes after B.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Yes! A, B, C!' },
          { questionNum: 3, questionText: 'What letter comes after D?', questionType: 'fill_blank', correctAnswer: 'E', points: 2, explanation: 'D, E, F!' },
          { questionNum: 4, questionText: 'The first letter of the alphabet is A.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'A is the first letter!' }
        ]
      },

      // ---- LINCOLN VO-TECH ----
      {
        code: 'quiz-auto-safety',
        title: 'Shop Safety Quiz',
        description: 'Test your knowledge of automotive shop safety.',
        topicCode: 'voc-auto-safety',
        classId: 'class-auto-basics',
        timeLimit: 15,
        passingScore: 80,
        maxAttempts: 2,
        questions: [
          { questionNum: 1, questionText: 'What does PPE stand for?', questionType: 'fill_blank', correctAnswer: 'Personal Protective Equipment', points: 2, explanation: 'PPE = Personal Protective Equipment' },
          { questionNum: 2, questionText: 'Safety glasses should be worn when working with tools.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Always protect your eyes!' },
          { questionNum: 3, questionText: 'Which fire extinguisher type is for electrical fires?', questionType: 'multiple_choice', options: JSON.stringify(['Class A', 'Class B', 'Class C', 'Class D']), correctAnswer: 'Class C', points: 2, explanation: 'Class C is for electrical fires.' },
          { questionNum: 4, questionText: 'You should lift heavy objects with your back.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'False', points: 2, explanation: 'Lift with your legs, not your back!' },
          { questionNum: 5, questionText: 'MSDS stands for Material Safety Data _____', questionType: 'fill_blank', correctAnswer: 'Sheet', points: 2, explanation: 'MSDS = Material Safety Data Sheet' }
        ]
      },
      {
        code: 'quiz-weld-safety',
        title: 'Welding Safety Quiz',
        description: 'Test your welding safety knowledge.',
        topicCode: 'voc-weld-safety',
        classId: 'class-welding-intro',
        timeLimit: 15,
        passingScore: 80,
        maxAttempts: 2,
        questions: [
          { questionNum: 1, questionText: 'What minimum shade lens is recommended for MIG welding?', questionType: 'multiple_choice', options: JSON.stringify(['Shade 5', 'Shade 8', 'Shade 10', 'Shade 14']), correctAnswer: 'Shade 10', points: 2, explanation: 'MIG welding typically requires shade 10-13.' },
          { questionNum: 2, questionText: 'Arc eye is caused by UV radiation from the welding arc.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'UV radiation from the arc can damage unprotected eyes.' },
          { questionNum: 3, questionText: 'Welding should be done in a well-ventilated area.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'Proper ventilation removes harmful fumes.' },
          { questionNum: 4, questionText: 'What color is the oxygen cylinder?', questionType: 'multiple_choice', options: JSON.stringify(['Red', 'Green', 'Yellow', 'Blue']), correctAnswer: 'Green', points: 2, explanation: 'Oxygen cylinders are green; acetylene is red.' },
          { questionNum: 5, questionText: 'You can weld near flammable materials if you work quickly.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'False', points: 2, explanation: 'Never weld near flammable materials!' }
        ]
      },
      {
        code: 'quiz-culinary-safety',
        title: 'Kitchen Safety Quiz',
        description: 'Test your food safety knowledge.',
        topicCode: 'voc-culinary-safety',
        classId: 'class-culinary-fundamentals',
        timeLimit: 15,
        passingScore: 80,
        maxAttempts: 2,
        questions: [
          { questionNum: 1, questionText: 'The temperature danger zone is between 40°F and...', questionType: 'multiple_choice', options: JSON.stringify(['100°F', '120°F', '140°F', '160°F']), correctAnswer: '140°F', points: 2, explanation: 'The danger zone is 40°F - 140°F.' },
          { questionNum: 2, questionText: 'How long should you wash your hands?', questionType: 'multiple_choice', options: JSON.stringify(['5 seconds', '10 seconds', '20 seconds', '1 minute']), correctAnswer: '20 seconds', points: 2, explanation: 'Wash hands for at least 20 seconds.' },
          { questionNum: 3, questionText: 'Cross-contamination occurs when bacteria spread from raw to cooked food.', questionType: 'true_false', options: JSON.stringify(['True', 'False']), correctAnswer: 'True', points: 2, explanation: 'This is the definition of cross-contamination.' },
          { questionNum: 4, questionText: 'FIFO stands for First In, First _____', questionType: 'fill_blank', correctAnswer: 'Out', points: 2, explanation: 'FIFO = First In, First Out.' },
          { questionNum: 5, questionText: 'Chicken should be cooked to an internal temperature of...', questionType: 'multiple_choice', options: JSON.stringify(['145°F', '155°F', '165°F', '175°F']), correctAnswer: '165°F', points: 2, explanation: 'Poultry must reach 165°F internal temperature.' }
        ]
      }
    ];

    for (const quizData of quizzesData) {
      const topic = topicMap[quizData.topicCode];
      if (topic) {
        const quiz = await prisma.quiz.upsert({
          where: { code: quizData.code },
          update: {},
          create: {
            code: quizData.code,
            title: quizData.title,
            description: quizData.description,
            topicId: topic.id,
            classId: quizData.classId,
            timeLimit: quizData.timeLimit,
            passingScore: quizData.passingScore,
            maxAttempts: quizData.maxAttempts,
            randomize: false,
            showAnswers: true,
            createdById: teacher.id,
            isActive: true
          }
        });

        // Add questions
        for (const q of quizData.questions) {
          await prisma.quizQuestion.upsert({
            where: { quizId_questionNum: { quizId: quiz.id, questionNum: q.questionNum } },
            update: {},
            create: {
              quizId: quiz.id,
              questionNum: q.questionNum,
              questionText: q.questionText,
              questionType: q.questionType,
              options: q.options || null,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              points: q.points
            }
          });
        }
      }
    }
    console.log('Quizzes seeded');
  }

  // =====================
  // PAYMENT GATEWAYS (5 gateways)
  // =====================
  const paymentGateways = [
    {
      provider: 'stripe',
      isEnabled: true,  // Stripe enabled by default
      testMode: true,
      publishableKey: '',
      secretKey: '',
      webhookSecret: ''
    },
    {
      provider: 'paypal',
      isEnabled: false,
      testMode: true,
      clientId: '',
      clientSecret: '',
      webhookId: ''
    },
    {
      provider: 'braintree',
      isEnabled: false,
      testMode: true,
      merchantId: '',
      publicKey: '',
      privateKey: ''
    },
    {
      provider: 'square',
      isEnabled: false,
      testMode: true,
      applicationId: '',
      accessToken: '',
      locationId: '',
      webhookSignatureKey: ''
    },
    {
      provider: 'authorize',
      isEnabled: false,
      testMode: true,
      apiLoginId: '',
      transactionKey: '',
      signatureKey: ''
    }
  ];

  for (const gateway of paymentGateways) {
    await prisma.paymentGateway.upsert({
      where: { provider: gateway.provider },
      update: {},
      create: gateway
    });
  }
  console.log('Payment gateways seeded');

  // =====================
  // SUBSCRIPTION PLANS
  // =====================
  const subscriptionPlans = [
    {
      code: 'basic',
      name: 'Basic',
      description: 'Essential tutoring features for individual learners',
      price: 9.99,
      billingPeriod: 'monthly',
      features: 'Basic AI tutoring,Limited subjects,Email support',
      isActive: true
    },
    {
      code: 'standard',
      name: 'Standard',
      description: 'Full access to all subjects and features',
      price: 19.99,
      billingPeriod: 'monthly',
      features: 'All subjects,Voice tutoring,Progress tracking,Priority support',
      isActive: true
    },
    {
      code: 'premium',
      name: 'Premium',
      description: 'Complete learning suite with advanced features',
      price: 29.99,
      billingPeriod: 'monthly',
      features: 'All Standard features,Advanced analytics,Custom study plans,24/7 support,Multiple students',
      isActive: true
    },
    {
      code: 'school',
      name: 'School License',
      description: 'Multi-user license for educational institutions',
      price: 499.99,
      billingPeriod: 'yearly',
      features: 'Unlimited students,Teacher dashboards,Admin controls,API access,Dedicated support',
      isActive: true
    }
  ];

  for (const plan of subscriptionPlans) {
    await prisma.subscriptionPlan.upsert({
      where: { code: plan.code },
      update: {},
      create: plan
    });
  }
  console.log('Subscription plans seeded');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
