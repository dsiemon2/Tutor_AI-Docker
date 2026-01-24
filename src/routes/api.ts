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
import {
  generateSystemPrompt,
  getTutoringConfig,
  getSessionHintCount,
  recordHint,
  analyzeStruggling,
  getEncouragement,
  TutoringMode
} from '../services/socratic.service';

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

// Chat with AI tutor (with Socratic mode support)
router.post('/sessions/:id/chat', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { content, requestHint } = req.body;

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

    // Get tutoring configuration
    const tutoringConfig = await getTutoringConfig();
    const tutoringMode = (tutoringConfig.defaultMode || 'socratic') as TutoringMode;

    // Get session hint count for Socratic mode
    const hintCount = await getSessionHintCount(session.id);

    // Track wrong answers (simple heuristic: count "not quite" or "incorrect" in AI messages)
    const wrongAnswerCount = session.messages.filter(m =>
      m.role === 'ASSISTANT' &&
      (m.content.toLowerCase().includes('not quite') ||
       m.content.toLowerCase().includes('that\'s not') ||
       m.content.toLowerCase().includes('incorrect') ||
       m.content.toLowerCase().includes('try again'))
    ).length;

    // Save user message
    await prisma.sessionMessage.create({
      data: {
        sessionId: req.params.id,
        role: 'USER',
        content
      }
    });

    // Record hint request if applicable
    if (requestHint) {
      await recordHint(session.id, content, hintCount + 1, `Hint requested for: ${content.substring(0, 100)}`);
    }

    // Generate system prompt using Socratic service
    const systemPrompt = generateSystemPrompt(tutoringMode, {
      gradeLevel: user?.gradeLevel ?? undefined,
      subject: session.subject?.name,
      topic: session.topic?.name,
      lessonContent: session.lesson?.content ?? undefined,
      hintCount: requestHint ? hintCount + 1 : hintCount,
      studentName: user?.firstName
    });

    // Add lesson-specific context
    let lessonContext = '';
    if (session.lesson) {
      lessonContext = `\n\n=== CURRENT LESSON: ${session.lesson.title} ===`;
      if (session.lesson.description) {
        lessonContext += `\nLESSON OVERVIEW: ${session.lesson.description}`;
      }
      if (session.lesson.objectives) {
        lessonContext += `\nLEARNING OBJECTIVES: ${session.lesson.objectives}`;
      }
      if (session.lesson.content) {
        lessonContext += `\n\nLESSON CONTENT:\n${session.lesson.content}`;
      }
      lessonContext += `\n\nUse this lesson content to guide your tutoring. Help the student work through the material step by step.`;
    } else if (session.topicId) {
      // Fetch related lessons for context
      const topicLessons = await prisma.lesson.findMany({
        where: {
          topicId: session.topicId,
          isActive: true
        },
        orderBy: { order: 'asc' },
        take: 3
      });

      if (topicLessons.length > 0) {
        lessonContext = `\n\n=== AVAILABLE LESSON CONTENT ===`;
        for (const lesson of topicLessons) {
          lessonContext += `\n\n--- ${lesson.title} ---`;
          if (lesson.objectives) {
            lessonContext += `\nObjectives: ${lesson.objectives}`;
          }
          if (lesson.content) {
            const contentPreview = lesson.content.length > 500
              ? lesson.content.substring(0, 500) + '...'
              : lesson.content;
            lessonContext += `\nContent Preview: ${contentPreview}`;
          }
        }
      }
    }

    // Build conversation history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt + lessonContext }
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

    // Analyze if student is struggling and create alert if needed
    const sessionDuration = Math.floor((Date.now() - session.startedAt.getTime()) / 1000);
    const newHintCount = requestHint ? hintCount + 1 : hintCount;

    await analyzeStruggling(userId, session.id, {
      wrongAnswerCount: wrongAnswerCount + (responseText.toLowerCase().includes('not quite') ? 1 : 0),
      timeSpentSeconds: sessionDuration,
      hintRequestCount: newHintCount,
      topicId: session.topicId ?? undefined,
      subjectId: session.subjectId ?? undefined
    });

    // Include encouragement if student got something right
    let encouragement: string | undefined;
    if (responseText.toLowerCase().includes('correct') ||
        responseText.toLowerCase().includes('great job') ||
        responseText.toLowerCase().includes('exactly right')) {
      encouragement = getEncouragement('correct');
    }

    res.json({
      success: true,
      response: responseText,
      visualAids: visualAids.length > 0 ? visualAids : undefined,
      encouragement,
      tutoringMode,
      hintCount: newHintCount
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

// ============================================
// NOTIFICATION ENDPOINTS
// ============================================

// Get notifications for current user
router.get('/notifications', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const limit = parseInt(req.query.limit as string) || 20;
    const unreadOnly = req.query.unread === 'true';

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { isRead: false } : {})
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false }
    });

    res.json({ success: true, notifications, unreadCount });

  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;

    const notification = await prisma.notification.findFirst({
      where: { id: req.params.id, userId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true, readAt: new Date() }
    });

    res.json({ success: true });

  } catch (error) {
    logger.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/notifications/read-all', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() }
    });

    res.json({ success: true });

  } catch (error) {
    logger.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

// Delete notification
router.delete('/notifications/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;

    const notification = await prisma.notification.findFirst({
      where: { id: req.params.id, userId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await prisma.notification.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true });

  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// ============================================
// MESSAGING ENDPOINTS
// ============================================

// Get conversations (grouped messages)
router.get('/messages/conversations', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;

    // Get all messages where user is sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by conversation partner
    const conversationMap = new Map<string, any>();
    for (const msg of messages) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(partnerId)) {
        const partner = await prisma.user.findUnique({
          where: { id: partnerId },
          select: { id: true, firstName: true, lastName: true, role: true }
        });
        conversationMap.set(partnerId, {
          partnerId,
          partner,
          lastMessage: msg,
          unreadCount: 0
        });
      }
      if (msg.receiverId === userId && !msg.isRead) {
        const conv = conversationMap.get(partnerId);
        conv.unreadCount++;
      }
    }

    res.json({ success: true, conversations: Array.from(conversationMap.values()) });

  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Get messages with a specific user
router.get('/messages/:userId', requireAuth, async (req, res) => {
  try {
    const currentUserId = req.session.userId!;
    const partnerId = req.params.userId;
    const limit = parseInt(req.query.limit as string) || 50;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: partnerId },
          { senderId: partnerId, receiverId: currentUserId }
        ]
      },
      orderBy: { createdAt: 'asc' },
      take: limit
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: currentUserId,
        isRead: false
      },
      data: { isRead: true, readAt: new Date() }
    });

    res.json({ success: true, messages });

  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send a message
router.post('/messages', requireAuth, async (req, res) => {
  try {
    const senderId = req.session.userId!;
    const { receiverId, subject, content, parentId } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Receiver and content are required' });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        subject: subject || null,
        content,
        parentId: parentId || null
      }
    });

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'info',
        title: 'New Message',
        message: `You have a new message from ${req.session.user?.firstName || 'a user'}`,
        link: `/messages/${senderId}`
      }
    });

    res.json({ success: true, message });

  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Delete a message
router.delete('/messages/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;

    const message = await prisma.message.findFirst({
      where: {
        id: req.params.id,
        senderId: userId // Only sender can delete
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found or not authorized' });
    }

    await prisma.message.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true });

  } catch (error) {
    logger.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Get unread message count
router.get('/messages/unread/count', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;

    const unreadCount = await prisma.message.count({
      where: { receiverId: userId, isRead: false }
    });

    res.json({ success: true, unreadCount });

  } catch (error) {
    logger.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

export default router;
