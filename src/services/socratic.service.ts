// TutorAI Socratic Tutoring Service
// Implements Socratic questioning method - guides students to answers instead of giving them

import { prisma } from '../config/database';
import { logger } from '../utils/logger';

// ============================================
// TUTORING MODES
// ============================================

export type TutoringMode = 'direct' | 'socratic' | 'guided' | 'adaptive';

export interface TutoringContext {
  sessionId: string;
  studentId: string;
  gradeLevel?: number;
  subject?: string;
  topic?: string;
  lessonContent?: string;
  mode: TutoringMode;
  hintCount: number;
  wrongAnswerCount: number;
  lastQuestionContext?: string;
}

// ============================================
// CONFIGURATION
// ============================================

/**
 * Get tutoring configuration
 */
export async function getTutoringConfig(): Promise<any> {
  let config = await prisma.tutoringConfig.findUnique({
    where: { id: 'default' }
  });

  if (!config) {
    config = await prisma.tutoringConfig.create({
      data: { id: 'default' }
    });
  }

  return config;
}

/**
 * Update tutoring configuration
 */
export async function updateTutoringConfig(data: any): Promise<any> {
  return prisma.tutoringConfig.upsert({
    where: { id: 'default' },
    create: { id: 'default', ...data },
    update: data
  });
}

// ============================================
// SOCRATIC SYSTEM PROMPTS
// ============================================

/**
 * Generate system prompt based on tutoring mode
 */
export function generateSystemPrompt(
  mode: TutoringMode,
  context: {
    gradeLevel?: number;
    subject?: string;
    topic?: string;
    lessonContent?: string;
    hintCount?: number;
    studentName?: string;
    wrongAnswerCount?: number;
  }
): string {
  const basePrompt = getBasePrompt(context);

  switch (mode) {
    case 'socratic':
      return getSocraticPrompt(context) + basePrompt;
    case 'guided':
      return getGuidedPrompt(context) + basePrompt;
    case 'adaptive':
      return getAdaptivePrompt(context) + basePrompt;
    case 'direct':
    default:
      return getDirectPrompt(context) + basePrompt;
  }
}

function getBasePrompt(context: any): string {
  let prompt = `

VISUAL AIDS FORMAT - Use these whenever helpful:

1. MATH EQUATIONS: Use LaTeX notation
   - Inline math: $x^2 + 5$
   - Display math: $$\\frac{a}{b} = c$$

2. STEP-BY-STEP: Number each step clearly
   Step 1: [Action]
   Step 2: [Action]

3. DIAGRAMS: Use Mermaid syntax when helpful
   \`\`\`mermaid
   flowchart TD
     A[Start] --> B{Decision}
   \`\`\``;

  if (context.gradeLevel !== undefined) {
    const gradeDesc = getGradeDescription(context.gradeLevel);
    prompt += `\n\nSTUDENT LEVEL: ${gradeDesc}. Adjust vocabulary and complexity accordingly.`;
  }

  if (context.subject) {
    prompt += `\n\nSUBJECT: ${context.subject}`;
  }

  if (context.topic) {
    prompt += `\nTOPIC: ${context.topic}`;
  }

  return prompt;
}

function getSocraticPrompt(context: any): string {
  const hintCount = context.hintCount || 0;
  const studentName = context.studentName || 'the student';

  return `You are TutorAI, an AI tutor using the SOCRATIC METHOD. Your role is to guide ${studentName} to discover answers through thoughtful questioning - NEVER give direct answers.

CORE PRINCIPLES:
1. NEVER provide the answer directly - ask questions that lead to understanding
2. When asked "what is 2+2?" respond with "What do you think? If you had 2 apples and got 2 more, how many would you have?"
3. Celebrate the PROCESS of thinking, not just correct answers
4. If the student is stuck, ask smaller, more focused questions
5. Use relatable examples from the student's world

SOCRATIC QUESTIONING TECHNIQUES:
- Clarifying: "What do you mean by...?" "Can you give me an example?"
- Probing assumptions: "What are you assuming here?" "Why do you think that's true?"
- Probing evidence: "What evidence supports that?" "How do you know?"
- Questioning viewpoints: "What would someone who disagrees say?" "What's another way to look at this?"
- Probing implications: "If that's true, what else must be true?" "What would happen if...?"
- Meta-questions: "Why is this question important?" "What was the point of my question?"

RESPONSE STRUCTURE:
1. Acknowledge the student's thinking (even if wrong)
2. Ask a guiding question that hints at the right direction
3. Provide encouragement
4. Wait for their response before continuing

HINT PROGRESSION (Current hint level: ${hintCount}/3):
${hintCount === 0 ? `
- Level 0: Ask open-ended questions to understand their thinking
- "What's your first instinct here?"
- "What do you already know about this topic?"` : ''}
${hintCount === 1 ? `
- Level 1: Provide a gentle nudge in the right direction
- "Think about... [related concept]"
- "What if you tried... [approach hint]?"` : ''}
${hintCount === 2 ? `
- Level 2: Give a more substantial hint
- "Remember that... [key principle]"
- "The key here is to... [method hint]"` : ''}
${hintCount >= 3 ? `
- Level 3: Walk through the solution together, step by step
- Break down into smallest possible steps
- Ask the student to complete each step with you` : ''}

EXAMPLES OF SOCRATIC RESPONSES:

Student: "What is the capital of France?"
BAD (Direct): "The capital of France is Paris."
GOOD (Socratic): "Great question! Here's a hint - it's one of the most famous cities in the world, known for a tower that was built for a World's Fair. Have you heard of it? What city might that be?"

Student: "How do I solve 3x + 5 = 14?"
BAD: "Subtract 5 from both sides, then divide by 3. x = 3."
GOOD: "Let's think about this together! When we have an equation, what's our goal? What do we want to find out? And to get x by itself, what's the first thing in our way?"

Student: "I don't understand photosynthesis."
BAD: "Photosynthesis is when plants convert sunlight into food..."
GOOD: "Let's explore this! You know plants are living things - what do all living things need to survive? And where do you think plants get their food from?"

ENCOURAGEMENT PHRASES:
- "You're on the right track!"
- "I love how you're thinking about this!"
- "That's a great question to ask yourself!"
- "You're so close - let's take one more step!"
- "Even wrong answers help us learn - what made you think that?"

REMEMBER: Your goal is to make the student feel like THEY figured it out, not that you told them the answer.`;
}

function getGuidedPrompt(context: any): string {
  return `You are TutorAI, an AI tutor using GUIDED INSTRUCTION. Your role is to lead the student through learning step-by-step, checking understanding at each point.

CORE PRINCIPLES:
1. Break every concept into small, manageable steps
2. Explain one step, then verify understanding before moving on
3. Use "I do, We do, You do" teaching method
4. Provide scaffolding that gradually decreases

RESPONSE STRUCTURE:
1. State the current step clearly
2. Explain the step with an example
3. Ask "Does this make sense?" or "Ready for the next step?"
4. Only proceed when the student confirms understanding

GUIDED LEARNING FLOW:
1. "First, let's understand..." (introduce concept)
2. "Here's how it works..." (demonstrate)
3. "Let's try one together..." (collaborative practice)
4. "Now you try..." (independent practice with support)
5. "Great job! Let's move to..." (progression)

Always check: "What questions do you have about this step?"`;
}

function getAdaptivePrompt(context: any): string {
  const wrongCount = context.wrongAnswerCount || 0;

  return `You are TutorAI, an AI tutor using ADAPTIVE TEACHING. You adjust your approach based on the student's performance and responses.

CURRENT STATUS:
- Wrong answer count: ${wrongCount}
${wrongCount >= 3 ? '- Student may be struggling - simplify explanations' : ''}
${wrongCount === 0 ? '- Student doing well - can increase challenge' : ''}

ADAPTIVE RULES:
1. If student answers correctly quickly → increase difficulty slightly
2. If student struggles (3+ wrong) → simplify and provide more scaffolding
3. If student is frustrated → switch to encouragement mode
4. If student seems bored → add challenge or real-world applications

DIFFICULTY ADJUSTMENT:
- Easy: More examples, simpler language, smaller steps
- Medium: Standard explanations, moderate scaffolding
- Hard: Challenge questions, minimal hints, extension problems

RESPONSE APPROACH:
1. Assess the student's current understanding from their response
2. Adjust your explanation complexity accordingly
3. Provide appropriately challenging follow-up
4. Monitor engagement and adapt`;
}

function getDirectPrompt(context: any): string {
  return `You are TutorAI, a friendly and knowledgeable AI tutor for K-12 students. Help students learn through clear, direct explanations.

RESPONSE GUIDELINES:
- Be encouraging and patient
- Provide clear, complete answers
- Use examples to illustrate concepts
- Offer to explain further if needed
- Check understanding at the end

TEACHING APPROACH:
1. Answer the question directly and clearly
2. Provide an example or analogy
3. Offer additional context if helpful
4. Ask if the student has follow-up questions`;
}

function getGradeDescription(gradeLevel: number): string {
  const descriptions: Record<number, string> = {
    [-2]: 'Pre-K 3 (age 3-4) - Use very simple words, songs, and play-based learning',
    [-1]: 'Pre-K 4 (age 4-5) - Simple words, lots of pictures, hands-on examples',
    0: 'Kindergarten (age 5-6) - Very simple words, lots of encouragement, concrete examples',
    1: '1st grade (age 6-7) - Simple sentences, basic concepts, relatable examples',
    2: '2nd grade (age 7-8) - Simple explanations, concrete real-world examples',
    3: '3rd grade (age 8-9) - More detail, multiple examples, some abstraction',
    4: '4th grade (age 9-10) - Building complexity, multi-step explanations',
    5: '5th grade (age 10-11) - Pre-teen level, more abstract thinking allowed',
    6: '6th grade (age 11-12) - Middle school intro, developing independence',
    7: '7th grade (age 12-13) - Pre-algebra concepts, critical thinking',
    8: '8th grade (age 13-14) - Algebra ready, scientific reasoning',
    9: '9th grade (age 14-15) - High school level, formal reasoning',
    10: '10th grade (age 15-16) - Sophomore, advanced concepts',
    11: '11th grade (age 16-17) - Junior, college prep level',
    12: '12th grade (age 17-18) - Senior, advanced/AP level'
  };
  return descriptions[gradeLevel] || `Grade ${gradeLevel}`;
}

// ============================================
// HINT MANAGEMENT
// ============================================

/**
 * Record a hint given to a student
 */
export async function recordHint(
  sessionId: string,
  questionContext: string,
  hintLevel: number,
  hintContent: string
): Promise<any> {
  return prisma.sessionHint.create({
    data: {
      sessionId,
      questionContext,
      hintLevel,
      hintContent
    }
  });
}

/**
 * Get hint count for a session
 */
export async function getSessionHintCount(sessionId: string): Promise<number> {
  return prisma.sessionHint.count({
    where: { sessionId }
  });
}

/**
 * Get hints for a specific question context
 */
export async function getHintsForQuestion(
  sessionId: string,
  questionContext: string
): Promise<any[]> {
  return prisma.sessionHint.findMany({
    where: {
      sessionId,
      questionContext: { contains: questionContext.substring(0, 50) }
    },
    orderBy: { hintLevel: 'asc' }
  });
}

// ============================================
// STRUGGLING DETECTION & ALERTS
// ============================================

/**
 * Analyze if student is struggling and create alert if needed
 */
export async function analyzeStruggling(
  studentId: string,
  sessionId: string,
  metrics: {
    wrongAnswerCount: number;
    timeSpentSeconds: number;
    hintRequestCount: number;
    topicId?: string;
    subjectId?: string;
  }
): Promise<any | null> {
  const config = await getTutoringConfig();

  // Check if struggling based on metrics
  const isStruggling =
    metrics.wrongAnswerCount >= 3 ||
    metrics.hintRequestCount >= config.socraticHintLimit ||
    metrics.timeSpentSeconds > 600; // 10+ minutes on one question

  if (!isStruggling) return null;

  // Determine alert type and severity
  let alertType = 'repeated_wrong';
  let severity = 'medium';
  let description = '';

  if (metrics.wrongAnswerCount >= 5) {
    alertType = 'repeated_wrong';
    severity = 'high';
    description = `Student has answered incorrectly ${metrics.wrongAnswerCount} times on this topic.`;
  } else if (metrics.hintRequestCount >= config.socraticHintLimit) {
    alertType = 'help_requested';
    severity = 'medium';
    description = `Student has requested ${metrics.hintRequestCount} hints and may need teacher support.`;
  } else if (metrics.timeSpentSeconds > 900) {
    alertType = 'long_pause';
    severity = 'medium';
    description = `Student has spent ${Math.round(metrics.timeSpentSeconds / 60)} minutes without progress.`;
  } else {
    description = `Student showing signs of difficulty: ${metrics.wrongAnswerCount} wrong answers.`;
  }

  // Check for existing unresolved alert
  const existingAlert = await prisma.strugglingAlert.findFirst({
    where: {
      studentId,
      sessionId,
      status: { in: ['new', 'acknowledged'] }
    }
  });

  if (existingAlert) {
    // Update existing alert
    return prisma.strugglingAlert.update({
      where: { id: existingAlert.id },
      data: {
        wrongAnswerCount: metrics.wrongAnswerCount,
        timeSpentSeconds: metrics.timeSpentSeconds,
        hintRequestCount: metrics.hintRequestCount,
        severity,
        description
      }
    });
  }

  // Create new alert
  const alert = await prisma.strugglingAlert.create({
    data: {
      studentId,
      sessionId,
      topicId: metrics.topicId,
      subjectId: metrics.subjectId,
      alertType,
      severity,
      description,
      wrongAnswerCount: metrics.wrongAnswerCount,
      timeSpentSeconds: metrics.timeSpentSeconds,
      hintRequestCount: metrics.hintRequestCount
    }
  });

  logger.info(`Struggling alert created for student ${studentId}: ${alertType}`);

  return alert;
}

/**
 * Get struggling alerts for teacher's students
 */
export async function getTeacherAlerts(
  teacherId: string,
  options: {
    status?: string;
    severity?: string;
    limit?: number;
  } = {}
): Promise<any[]> {
  // Get classes taught by this teacher
  const teacherClasses = await prisma.classTeacher.findMany({
    where: { teacherId },
    select: { classId: true }
  });
  const classIds = teacherClasses.map(c => c.classId);

  // Get students in those classes
  const classStudents = await prisma.classStudent.findMany({
    where: { classId: { in: classIds } },
    select: { studentId: true }
  });
  const studentIds = classStudents.map(s => s.studentId);

  // Get alerts for those students
  const where: any = {
    studentId: { in: studentIds }
  };
  if (options.status) where.status = options.status;
  if (options.severity) where.severity = options.severity;

  const alerts = await prisma.strugglingAlert.findMany({
    where,
    take: options.limit || 50,
    orderBy: [
      { severity: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  // Fetch student details
  const alertStudentIds = [...new Set(alerts.map(a => a.studentId))];
  const students = await prisma.user.findMany({
    where: { id: { in: alertStudentIds } },
    select: { id: true, firstName: true, lastName: true, gradeLevel: true }
  });
  const studentMap = new Map(students.map(s => [s.id, s]));

  // Fetch topic/subject details
  const topicIds = alerts.filter(a => a.topicId).map(a => a.topicId!);
  const topics = await prisma.topic.findMany({
    where: { id: { in: topicIds } },
    select: { id: true, name: true }
  });
  const topicMap = new Map(topics.map(t => [t.id, t]));

  return alerts.map(alert => ({
    ...alert,
    student: studentMap.get(alert.studentId),
    topic: alert.topicId ? topicMap.get(alert.topicId) : null
  }));
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(alertId: string, teacherId: string): Promise<any> {
  return prisma.strugglingAlert.update({
    where: { id: alertId },
    data: {
      status: 'acknowledged',
      acknowledgedBy: teacherId,
      acknowledgedAt: new Date()
    }
  });
}

/**
 * Resolve an alert
 */
export async function resolveAlert(alertId: string, resolution: string): Promise<any> {
  return prisma.strugglingAlert.update({
    where: { id: alertId },
    data: {
      status: 'resolved',
      resolvedAt: new Date(),
      resolution
    }
  });
}

/**
 * Dismiss an alert
 */
export async function dismissAlert(alertId: string): Promise<any> {
  return prisma.strugglingAlert.update({
    where: { id: alertId },
    data: { status: 'dismissed' }
  });
}

/**
 * Get alert statistics for teacher dashboard
 */
export async function getAlertStats(teacherId: string): Promise<{
  total: number;
  new: number;
  acknowledged: number;
  critical: number;
  high: number;
}> {
  const alerts = await getTeacherAlerts(teacherId, { limit: 1000 });

  return {
    total: alerts.length,
    new: alerts.filter(a => a.status === 'new').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length
  };
}

// ============================================
// TEACHER ALERT PREFERENCES
// ============================================

/**
 * Get teacher's alert preferences
 */
export async function getTeacherAlertPrefs(teacherId: string): Promise<any> {
  let prefs = await prisma.teacherAlertPrefs.findUnique({
    where: { teacherId }
  });

  if (!prefs) {
    prefs = await prisma.teacherAlertPrefs.create({
      data: { teacherId }
    });
  }

  return prefs;
}

/**
 * Update teacher's alert preferences
 */
export async function updateTeacherAlertPrefs(teacherId: string, data: any): Promise<any> {
  return prisma.teacherAlertPrefs.upsert({
    where: { teacherId },
    create: { teacherId, ...data },
    update: data
  });
}

// ============================================
// ENCOURAGEMENT MESSAGES
// ============================================

const ENCOURAGEMENT_MESSAGES = {
  correct: [
    "Excellent work! You've got it! 🌟",
    "That's exactly right! Great thinking!",
    "Perfect! You're really understanding this!",
    "Wonderful! Keep up the great work!",
    "You nailed it! I'm proud of your effort!"
  ],
  almostCorrect: [
    "You're so close! Just one small adjustment...",
    "Great thinking! You're on the right track!",
    "Almost there! Let's look at this one part again...",
    "I love your approach! Just a tiny tweak needed..."
  ],
  incorrect: [
    "That's not quite it, but I love that you tried! Let's explore this together.",
    "Good attempt! Mistakes help us learn. Let me guide you...",
    "That's a common misconception - let's work through it!",
    "Not quite, but you're thinking! Let's try a different approach."
  ],
  struggling: [
    "I know this is challenging, but you're doing great just by trying!",
    "It's okay to find this hard - that means you're learning!",
    "Let's slow down and break this into smaller pieces.",
    "Remember, every expert was once a beginner. You've got this!"
  ],
  milestone: [
    "Wow! You've completed 10 problems! You're on fire! 🔥",
    "Amazing progress! You've mastered a new skill!",
    "Look how far you've come! Your hard work is paying off!",
    "You've reached a new level! Keep going, superstar!"
  ]
};

/**
 * Get an encouragement message
 */
export function getEncouragement(type: keyof typeof ENCOURAGEMENT_MESSAGES): string {
  const messages = ENCOURAGEMENT_MESSAGES[type];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Analyze response to determine if correct/incorrect
 */
export function analyzeResponse(
  studentAnswer: string,
  expectedAnswer: string,
  tolerance: number = 0.1
): 'correct' | 'almostCorrect' | 'incorrect' {
  // Normalize strings
  const normalizedStudent = studentAnswer.toLowerCase().trim();
  const normalizedExpected = expectedAnswer.toLowerCase().trim();

  // Exact match
  if (normalizedStudent === normalizedExpected) {
    return 'correct';
  }

  // Check for numeric answers with tolerance
  const studentNum = parseFloat(normalizedStudent);
  const expectedNum = parseFloat(normalizedExpected);
  if (!isNaN(studentNum) && !isNaN(expectedNum)) {
    const diff = Math.abs(studentNum - expectedNum);
    if (diff <= tolerance * Math.abs(expectedNum)) {
      return 'correct';
    }
    if (diff <= tolerance * 2 * Math.abs(expectedNum)) {
      return 'almostCorrect';
    }
  }

  // Check for partial string match (contains key words)
  const expectedWords = normalizedExpected.split(/\s+/);
  const matchedWords = expectedWords.filter(word =>
    word.length > 3 && normalizedStudent.includes(word)
  );
  if (matchedWords.length >= expectedWords.length * 0.7) {
    return 'almostCorrect';
  }

  return 'incorrect';
}

export default {
  // Config
  getTutoringConfig,
  updateTutoringConfig,

  // System prompts
  generateSystemPrompt,

  // Hints
  recordHint,
  getSessionHintCount,
  getHintsForQuestion,

  // Struggling detection
  analyzeStruggling,
  getTeacherAlerts,
  acknowledgeAlert,
  resolveAlert,
  dismissAlert,
  getAlertStats,

  // Preferences
  getTeacherAlertPrefs,
  updateTeacherAlertPrefs,

  // Encouragement
  getEncouragement,
  analyzeResponse
};
