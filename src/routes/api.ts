// TutorAI API Routes
// REST API for sessions, uploads, and AI interactions

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';
import { config } from '../config';
import { requireAuth, requireAuthOrToken } from '../middleware/auth';
import { logger } from '../utils/logger';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: config.openaiApiKey });

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// ============================================
// SESSION ENDPOINTS
// ============================================

// Create new tutoring session
router.post('/sessions', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { subjectId, topicId, lessonId, mode } = req.body;

    // If lessonId provided, get associated topic and subject
    let finalTopicId = topicId;
    let finalSubjectId = subjectId;

    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { topic: { include: { subject: true } } }
      });
      if (lesson) {
        finalTopicId = lesson.topicId;
        finalSubjectId = lesson.topic?.subjectId;
      }
    }

    const session = await prisma.tutoringSession.create({
      data: {
        studentId: userId,
        subjectId: finalSubjectId || null,
        topicId: finalTopicId || null,
        lessonId: lessonId || null,
        gradeLevel: req.session.user?.gradeLevel || null,
        mode: mode || 'TEXT',
        status: 'ACTIVE'
      },
      include: {
        subject: true,
        topic: true,
        lesson: true
      }
    });

    res.json({ success: true, session });

  } catch (error) {
    logger.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get session
router.get('/sessions/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;

    const session = await prisma.tutoringSession.findFirst({
      where: {
        id: req.params.id,
        studentId: userId
      },
      include: {
        subject: true,
        topic: true,
        messages: { orderBy: { createdAt: 'asc' } }
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ success: true, session });

  } catch (error) {
    logger.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// End session
router.put('/sessions/:id/end', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;

    const session = await prisma.tutoringSession.findFirst({
      where: {
        id: req.params.id,
        studentId: userId
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const endedAt = new Date();
    const duration = Math.floor((endedAt.getTime() - session.startedAt.getTime()) / 1000);

    const updatedSession = await prisma.tutoringSession.update({
      where: { id: req.params.id },
      data: {
        status: 'COMPLETED',
        endedAt,
        duration
      }
    });

    res.json({ success: true, session: updatedSession });

  } catch (error) {
    logger.error('End session error:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// Add message to session
router.post('/sessions/:id/messages', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { content, role, visualAids, uploadId } = req.body;

    // Verify session belongs to user
    const session = await prisma.tutoringSession.findFirst({
      where: {
        id: req.params.id,
        studentId: userId
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const message = await prisma.sessionMessage.create({
      data: {
        sessionId: req.params.id,
        role: role || 'USER',
        content,
        visualAids: visualAids || null,
        uploadId: uploadId || null
      }
    });

    res.json({ success: true, message });

  } catch (error) {
    logger.error('Add message error:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Helper function to extract visual aids from AI response
function extractVisualAids(text: string): any[] {
  const visualAids: any[] = [];
  let order = 0;

  // Extract display math ($$...$$)
  const displayMathRegex = /\$\$([\s\S]*?)\$\$/g;
  let match;
  while ((match = displayMathRegex.exec(text)) !== null) {
    visualAids.push({
      id: `math-display-${order}`,
      type: 'math',
      content: {
        latex: match[1].trim(),
        displayMode: 'block'
      },
      order: order++
    });
  }

  // Extract inline math ($...$) - but not $$
  const inlineMathRegex = /(?<!\$)\$(?!\$)(.*?)(?<!\$)\$(?!\$)/g;
  while ((match = inlineMathRegex.exec(text)) !== null) {
    visualAids.push({
      id: `math-inline-${order}`,
      type: 'math',
      content: {
        latex: match[1].trim(),
        displayMode: 'inline'
      },
      order: order++
    });
  }

  // Detect step-by-step solutions (Step 1:, Step 2:, etc.)
  const stepRegex = /(?:^|\n)\s*(?:Step|STEP)\s*(\d+)[:\s]*([^\n]+(?:\n(?!(?:Step|STEP)\s*\d)[^\n]+)*)/gi;
  const steps: { number: number; title: string; content: string }[] = [];
  while ((match = stepRegex.exec(text)) !== null) {
    steps.push({
      number: parseInt(match[1]),
      title: `Step ${match[1]}`,
      content: match[2].trim()
    });
  }
  if (steps.length > 0) {
    visualAids.push({
      id: `steps-${order}`,
      type: 'stepCard',
      content: {
        steps: steps,
        showProgress: true
      },
      order: order++
    });
  }

  // Detect numbered lists (1., 2., 3., etc.) as potential steps
  if (steps.length === 0) {
    const numberedRegex = /(?:^|\n)\s*(\d+)\.\s+([^\n]+)/g;
    const numberedSteps: { number: number; title: string; content: string }[] = [];
    while ((match = numberedRegex.exec(text)) !== null) {
      numberedSteps.push({
        number: parseInt(match[1]),
        title: `${match[1]}`,
        content: match[2].trim()
      });
    }
    if (numberedSteps.length >= 3) {
      visualAids.push({
        id: `steps-${order}`,
        type: 'stepCard',
        content: {
          steps: numberedSteps,
          showProgress: true
        },
        order: order++
      });
    }
  }

  // Detect Mermaid diagrams (```mermaid ... ```)
  const mermaidRegex = /```mermaid\s*([\s\S]*?)```/gi;
  while ((match = mermaidRegex.exec(text)) !== null) {
    visualAids.push({
      id: `diagram-${order}`,
      type: 'diagram',
      content: {
        mermaid: match[1].trim()
      },
      order: order++
    });
  }

  return visualAids;
}

// Chat with AI tutor
router.post('/sessions/:id/chat', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Verify session belongs to user
    const session = await prisma.tutoringSession.findFirst({
      where: {
        id: req.params.id,
        studentId: userId
      },
      include: {
        subject: true,
        topic: true,
        lesson: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20 // Last 20 messages for context
        }
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get user info for grade level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gradeLevel: true, firstName: true }
    });

    // Save user message
    await prisma.sessionMessage.create({
      data: {
        sessionId: req.params.id,
        role: 'USER',
        content
      }
    });

    // Build comprehensive system prompt for visual-rich responses
    let systemPrompt = `You are TutorAI, a friendly and knowledgeable AI tutor for K-12 students. Your goal is to help students learn through clear explanations with rich visual aids.

RESPONSE GUIDELINES:
- Be encouraging, patient, and adapt to the student's level
- Use visual aids extensively to enhance understanding
- Ask follow-up questions to check understanding
- Provide hints rather than direct answers when appropriate

VISUAL AIDS FORMAT - Use these whenever helpful:

1. MATH EQUATIONS: Use LaTeX notation
   - Inline math: $x^2 + 5$
   - Display math: $$\\frac{a}{b} = c$$
   - Always use display mode ($$) for important equations

2. STEP-BY-STEP SOLUTIONS: Number each step clearly
   Step 1: [First action]
   Step 2: [Second action]
   Step 3: [Third action]

3. DIAGRAMS: Use Mermaid syntax for flowcharts, processes, timelines
   \`\`\`mermaid
   flowchart TD
     A[Start] --> B{Decision}
     B -->|Yes| C[Result 1]
     B -->|No| D[Result 2]
   \`\`\`

4. For SCIENCE topics: Explain processes with diagrams when possible
5. For MATH topics: Show work step-by-step with equations
6. For HISTORY topics: Use timelines when discussing events
7. For any multi-step process: Break it down into numbered steps`;

    if (user?.gradeLevel) {
      const gradeDescriptions: Record<number, string> = {
        0: 'Kindergarten (age 5-6) - Use very simple words, lots of encouragement',
        1: '1st grade (age 6-7) - Simple sentences, basic concepts',
        2: '2nd grade (age 7-8) - Simple explanations, concrete examples',
        3: '3rd grade (age 8-9) - More detail, real-world examples',
        4: '4th grade (age 9-10) - Building complexity, multiple steps',
        5: '5th grade (age 10-11) - Pre-teen level, more abstract thinking',
        6: '6th grade (age 11-12) - Middle school intro, more independence',
        7: '7th grade (age 12-13) - Pre-algebra concepts, critical thinking',
        8: '8th grade (age 13-14) - Algebra ready, scientific reasoning',
        9: '9th grade (age 14-15) - High school freshman, formal reasoning',
        10: '10th grade (age 15-16) - Sophomore, advanced concepts',
        11: '11th grade (age 16-17) - Junior, college prep level',
        12: '12th grade (age 17-18) - Senior, advanced/AP level'
      };
      const gradeDesc = gradeDescriptions[user.gradeLevel] || `Grade ${user.gradeLevel}`;
      systemPrompt += `\n\nSTUDENT LEVEL: ${gradeDesc}. Adjust vocabulary, complexity, and examples accordingly.`;
    }

    if (session.subject) {
      systemPrompt += `\n\nSUBJECT: ${session.subject.name}`;
    }

    if (session.topic) {
      systemPrompt += `\nTOPIC: ${session.topic.name}`;
      if (session.topic.description) {
        systemPrompt += `\nTOPIC DESCRIPTION: ${session.topic.description}`;
      }
    }

    // Include lesson content if available
    if (session.lesson) {
      systemPrompt += `\n\n=== CURRENT LESSON: ${session.lesson.title} ===`;
      if (session.lesson.description) {
        systemPrompt += `\nLESSON OVERVIEW: ${session.lesson.description}`;
      }
      if (session.lesson.objectives) {
        systemPrompt += `\nLEARNING OBJECTIVES: ${session.lesson.objectives}`;
      }
      if (session.lesson.content) {
        systemPrompt += `\n\nLESSON CONTENT:\n${session.lesson.content}`;
      }
      if (session.lesson.materials) {
        systemPrompt += `\n\nREQUIRED MATERIALS: ${session.lesson.materials}`;
      }
      systemPrompt += `\n\nIMPORTANT: Use this lesson content to guide your tutoring. Reference specific concepts, examples, and exercises from the lesson. Help the student work through the lesson material step by step.`;
    } else if (session.topicId) {
      // No specific lesson - fetch related lessons for this topic to provide context
      const topicLessons = await prisma.lesson.findMany({
        where: {
          topicId: session.topicId,
          isActive: true
        },
        orderBy: { order: 'asc' },
        take: 3
      });

      if (topicLessons.length > 0) {
        systemPrompt += `\n\n=== AVAILABLE LESSON CONTENT FOR THIS TOPIC ===`;
        for (const lesson of topicLessons) {
          systemPrompt += `\n\n--- ${lesson.title} ---`;
          if (lesson.objectives) {
            systemPrompt += `\nObjectives: ${lesson.objectives}`;
          }
          if (lesson.content) {
            // Include first 500 chars of each lesson for context
            const contentPreview = lesson.content.length > 500
              ? lesson.content.substring(0, 500) + '...'
              : lesson.content;
            systemPrompt += `\nContent Preview: ${contentPreview}`;
          }
        }
        systemPrompt += `\n\nUse this curriculum content to guide your tutoring and ensure alignment with the structured lessons.`;
      }
    }

    // Build conversation history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    // Add previous messages for context
    for (const msg of session.messages) {
      messages.push({
        role: msg.role === 'USER' ? 'user' : 'assistant',
        content: msg.content
      });
    }

    // Add current user message
    messages.push({ role: 'user', content });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: config.openaiModel,
      messages,
      temperature: 0.7,
      max_tokens: 2048
    });

    const responseText = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';

    // Extract visual aids from the response
    const visualAids = extractVisualAids(responseText);

    // Save assistant message with visual aids
    await prisma.sessionMessage.create({
      data: {
        sessionId: req.params.id,
        role: 'ASSISTANT',
        content: responseText,
        visualAids: visualAids.length > 0 ? JSON.stringify(visualAids) : null
      }
    });

    res.json({
      success: true,
      response: responseText,
      visualAids: visualAids.length > 0 ? visualAids : undefined
    });

  } catch (error) {
    logger.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// ============================================
// UPLOAD ENDPOINTS
// ============================================

// Upload file
router.post('/uploads', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const userId = req.session.userId!;
    const file = req.file;
    const { sessionId } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const upload = await prisma.upload.create({
      data: {
        userId,
        sessionId: sessionId || null,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storageUrl: `/uploads/${file.filename}`,
        processingStatus: 'PENDING'
      }
    });

    // TODO: Trigger async processing (Vision API, OCR)

    res.json({ success: true, upload });

  } catch (error) {
    logger.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get upload
router.get('/uploads/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;

    const upload = await prisma.upload.findFirst({
      where: {
        id: req.params.id,
        userId
      }
    });

    if (!upload) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    res.json({ success: true, upload });

  } catch (error) {
    logger.error('Get upload error:', error);
    res.status(500).json({ error: 'Failed to get upload' });
  }
});

// ============================================
// SUBJECT ENDPOINTS
// ============================================

// Get all subject categories
router.get('/subjects/categories', async (req, res) => {
  try {
    const categories = await prisma.subjectCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    res.json({ success: true, categories });

  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Get subjects by category
router.get('/subjects/categories/:code', async (req, res) => {
  try {
    const category = await prisma.subjectCategory.findUnique({
      where: { code: req.params.code },
      include: {
        subjects: {
          where: { isActive: true },
          include: {
            topics: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ success: true, category });

  } catch (error) {
    logger.error('Get subjects error:', error);
    res.status(500).json({ error: 'Failed to get subjects' });
  }
});

// Get topics by subject
router.get('/subjects/:id/topics', async (req, res) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id },
      include: {
        topics: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json({ success: true, topics: subject.topics });

  } catch (error) {
    logger.error('Get topics error:', error);
    res.status(500).json({ error: 'Failed to get topics' });
  }
});

// ============================================
// LESSON ENDPOINTS
// ============================================

// Get lessons for a topic
router.get('/topics/:id/lessons', async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        topicId: req.params.id,
        isActive: true
      },
      orderBy: { order: 'asc' }
    });

    res.json({ success: true, lessons });

  } catch (error) {
    logger.error('Get lessons error:', error);
    res.status(500).json({ error: 'Failed to get lessons' });
  }
});

// Get a specific lesson
router.get('/lessons/:id', async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: {
        topic: {
          include: {
            subject: { include: { category: true } }
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json({ success: true, lesson });

  } catch (error) {
    logger.error('Get lesson error:', error);
    res.status(500).json({ error: 'Failed to get lesson' });
  }
});

// ============================================
// PROGRESS ENDPOINTS
// ============================================

// Get student progress
router.get('/progress', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;

    const progress = await prisma.studentProgress.findMany({
      where: { studentId: userId },
      include: {
        topic: {
          include: {
            subject: {
              include: { category: true }
            }
          }
        }
      },
      orderBy: { lastActivityAt: 'desc' }
    });

    res.json({ success: true, progress });

  } catch (error) {
    logger.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// ============================================
// USER ENDPOINTS
// ============================================

// Get current user
router.get('/user', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        gradeLevel: true,
        preferredVoice: true,
        preferredLanguage: true,
        textSize: true,
        highContrast: true,
        dyslexiaFont: true,
        school: {
          select: { id: true, name: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });

  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user settings
router.put('/user/settings', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { preferredVoice, preferredLanguage, textSize, highContrast, dyslexiaFont } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        preferredVoice,
        preferredLanguage,
        textSize,
        highContrast,
        dyslexiaFont
      }
    });

    res.json({ success: true, user });

  } catch (error) {
    logger.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
