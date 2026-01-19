// TutorAI WebSocket Handler
// Real-time tutoring with voice and text

import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { parse } from 'url';
import { prisma } from '../config/database';
import { config } from '../config';
import { logger } from '../utils/logger';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: config.openaiApiKey });

interface TutorSession {
  ws: WebSocket;
  userId: string;
  sessionId: string | null;
  subjectId: string | null;
  topicId: string | null;
  lessonId: string | null;
  gradeLevel: number | null;
  mode: 'TEXT' | 'VOICE';
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  lessonContent: string | null;
}

const activeSessions = new Map<WebSocket, TutorSession>();

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
    logger.info('New WebSocket connection');

    // Parse query parameters
    const { query } = parse(req.url || '', true);
    const userId = query.userId as string;
    const sessionId = query.sessionId as string | null;
    const subjectId = query.subjectId as string | null;
    const topicId = query.topicId as string | null;
    const lessonId = query.lessonId as string | null;

    if (!userId) {
      ws.close(4001, 'User ID required');
      return;
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gradeLevel: true, preferredLanguage: true }
    });

    // Fetch lesson content if lessonId provided
    let lessonContent: string | null = null;
    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { topic: { include: { subject: true } } }
      });
      if (lesson) {
        lessonContent = buildLessonContext(lesson);
      }
    } else if (topicId) {
      // Fetch topic lessons for context
      const topicLessons = await prisma.lesson.findMany({
        where: { topicId, isActive: true },
        orderBy: { order: 'asc' },
        take: 3
      });
      if (topicLessons.length > 0) {
        lessonContent = buildTopicLessonsContext(topicLessons);
      }
    }

    // Initialize session
    const session: TutorSession = {
      ws,
      userId,
      sessionId,
      subjectId,
      topicId,
      lessonId,
      gradeLevel: user?.gradeLevel || null,
      mode: 'TEXT',
      conversationHistory: [],
      lessonContent
    };

    activeSessions.set(ws, session);

    // Send welcome message
    sendMessage(ws, {
      type: 'connected',
      message: 'Connected to TutorAI'
    });

    // Handle incoming messages
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        await handleMessage(session, message);
      } catch (error) {
        logger.error('WebSocket message error:', error);
        sendMessage(ws, {
          type: 'error',
          message: 'Failed to process message'
        });
      }
    });

    // Handle disconnect
    ws.on('close', () => {
      logger.info('WebSocket disconnected');
      activeSessions.delete(ws);
    });

    ws.on('error', (error) => {
      logger.error('WebSocket error:', error);
      activeSessions.delete(ws);
    });
  });
}

async function handleMessage(session: TutorSession, message: any) {
  const { type, content, audioData, uploadId } = message;

  switch (type) {
    case 'text':
      await handleTextMessage(session, content, uploadId);
      break;

    case 'audio':
      await handleAudioMessage(session, audioData);
      break;

    case 'mode_change':
      session.mode = content === 'voice' ? 'VOICE' : 'TEXT';
      sendMessage(session.ws, {
        type: 'mode_changed',
        mode: session.mode
      });
      break;

    case 'end_session':
      await endSession(session);
      break;

    default:
      sendMessage(session.ws, {
        type: 'error',
        message: 'Unknown message type'
      });
  }
}

async function handleTextMessage(session: TutorSession, content: string, uploadId?: string) {
  // Add user message to history
  session.conversationHistory.push({ role: 'user', content });

  // Save message to database
  if (session.sessionId) {
    await prisma.sessionMessage.create({
      data: {
        sessionId: session.sessionId,
        role: 'USER',
        content,
        uploadId: uploadId || null
      }
    });
  }

  // Send typing indicator
  sendMessage(session.ws, { type: 'typing', isTyping: true });

  try {
    // Get AI response
    const response = await getAIResponse(session, content, uploadId);

    // Add assistant response to history
    session.conversationHistory.push({ role: 'assistant', content: response.text });

    // Save assistant message to database
    if (session.sessionId) {
      await prisma.sessionMessage.create({
        data: {
          sessionId: session.sessionId,
          role: 'ASSISTANT',
          content: response.text,
          visualAids: response.visualAids ? JSON.stringify(response.visualAids) : null
        }
      });
    }

    // Send response
    sendMessage(session.ws, {
      type: 'response',
      content: response.text,
      visualAids: response.visualAids
    });

    // If voice mode, also send audio
    if (session.mode === 'VOICE') {
      const audioData = await generateSpeech(response.text);
      if (audioData) {
        sendMessage(session.ws, {
          type: 'audio',
          audioData
        });
      }
    }
  } catch (error) {
    logger.error('AI response error:', error);
    sendMessage(session.ws, {
      type: 'error',
      message: 'Failed to get response from AI'
    });
  } finally {
    sendMessage(session.ws, { type: 'typing', isTyping: false });
  }
}

async function handleAudioMessage(session: TutorSession, audioData: string) {
  try {
    // Transcribe audio
    const transcription = await transcribeAudio(audioData);

    if (transcription) {
      // Send transcription to client
      sendMessage(session.ws, {
        type: 'transcription',
        content: transcription
      });

      // Process as text message
      await handleTextMessage(session, transcription);
    }
  } catch (error) {
    logger.error('Audio processing error:', error);
    sendMessage(session.ws, {
      type: 'error',
      message: 'Failed to process audio'
    });
  }
}

async function getAIResponse(
  session: TutorSession,
  userMessage: string,
  uploadId?: string
): Promise<{ text: string; visualAids?: any[] }> {
  // Build system prompt
  const systemPrompt = buildSystemPrompt(session);

  // Build messages array
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
    ...session.conversationHistory.slice(-10) // Keep last 10 messages for context
  ];

  // If there's an upload, we could use vision API
  // For now, just use text

  try {
    const completion = await openai.chat.completions.create({
      model: config.openaiModel,
      messages,
      temperature: 0.7,
      max_tokens: 1024
    });

    const responseText = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';

    // Parse for visual aids (simple detection)
    const visualAids = extractVisualAids(responseText);

    return {
      text: responseText,
      visualAids: visualAids.length > 0 ? visualAids : undefined
    };
  } catch (error) {
    logger.error('OpenAI API error:', error);
    throw error;
  }
}

function buildSystemPrompt(session: TutorSession): string {
  let prompt = `You are TutorAI, a friendly and knowledgeable AI tutor. Your goal is to help students learn and understand concepts through clear explanations, examples, and step-by-step guidance.

Guidelines:
- Be encouraging and patient
- Adapt explanations to the student's level
- Use visual aids when helpful (math equations, diagrams, step-by-step breakdowns)
- Ask follow-up questions to check understanding
- Provide hints rather than direct answers when appropriate
- Celebrate progress and effort`;

  if (session.gradeLevel) {
    const gradeDescriptions: Record<number, string> = {
      [-2]: 'Pre-K 3 (age 3-4) - Very basic concepts, play-based learning',
      [-1]: 'Pre-K 4 (age 4-5) - Simple concepts, hands-on activities',
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
    const gradeDesc = gradeDescriptions[session.gradeLevel] || `Grade ${session.gradeLevel}`;
    prompt += `\n\nSTUDENT LEVEL: ${gradeDesc}. Adjust vocabulary, complexity, and examples accordingly.`;
  }

  if (session.subjectId || session.topicId) {
    prompt += `\n\nFocus on helping with the current subject/topic being studied.`;
  }

  // Include lesson content if available
  if (session.lessonContent) {
    prompt += `\n\n${session.lessonContent}`;
    prompt += `\n\nIMPORTANT: Use this curriculum content to guide your tutoring. Reference specific concepts, examples, and exercises from the lessons. Help the student work through the material step by step.`;
  }

  prompt += `\n\nWhen providing mathematical expressions, use LaTeX notation wrapped in $ for inline and $$ for display mode.
When explaining step-by-step solutions, number each step clearly.
When creating diagrams, describe them clearly or use simple ASCII representations.`;

  return prompt;
}

// Build context string from a single lesson
function buildLessonContext(lesson: any): string {
  let context = `=== CURRENT LESSON: ${lesson.title} ===`;
  if (lesson.description) {
    context += `\nLESSON OVERVIEW: ${lesson.description}`;
  }
  if (lesson.objectives) {
    context += `\nLEARNING OBJECTIVES: ${lesson.objectives}`;
  }
  if (lesson.content) {
    context += `\n\nLESSON CONTENT:\n${lesson.content}`;
  }
  if (lesson.materials) {
    context += `\n\nREQUIRED MATERIALS: ${lesson.materials}`;
  }
  if (lesson.topic) {
    context += `\n\nTOPIC: ${lesson.topic.name}`;
    if (lesson.topic.subject) {
      context += `\nSUBJECT: ${lesson.topic.subject.name}`;
    }
  }
  return context;
}

// Build context string from multiple topic lessons
function buildTopicLessonsContext(lessons: any[]): string {
  let context = `=== AVAILABLE LESSON CONTENT FOR THIS TOPIC ===`;
  for (const lesson of lessons) {
    context += `\n\n--- ${lesson.title} ---`;
    if (lesson.objectives) {
      context += `\nObjectives: ${lesson.objectives}`;
    }
    if (lesson.content) {
      // Include first 500 chars of each lesson for context
      const contentPreview = lesson.content.length > 500
        ? lesson.content.substring(0, 500) + '...'
        : lesson.content;
      context += `\nContent Preview: ${contentPreview}`;
    }
  }
  return context;
}

function extractVisualAids(text: string): any[] {
  const visualAids: any[] = [];

  // Extract LaTeX math expressions
  const displayMathRegex = /\$\$([\s\S]*?)\$\$/g;
  const inlineMathRegex = /\$(.*?)\$/g;

  let match;
  while ((match = displayMathRegex.exec(text)) !== null) {
    visualAids.push({
      type: 'math',
      displayMode: true,
      content: match[1].trim()
    });
  }

  while ((match = inlineMathRegex.exec(text)) !== null) {
    visualAids.push({
      type: 'math',
      displayMode: false,
      content: match[1].trim()
    });
  }

  // Detect step-by-step solutions
  const stepRegex = /(?:Step|步骤)\s*(\d+)[:\s]*(.*?)(?=(?:Step|步骤)\s*\d+|$)/gis;
  const steps: string[] = [];
  while ((match = stepRegex.exec(text)) !== null) {
    steps.push(match[2].trim());
  }
  if (steps.length > 0) {
    visualAids.push({
      type: 'steps',
      steps
    });
  }

  return visualAids;
}

async function transcribeAudio(audioData: string): Promise<string | null> {
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(audioData, 'base64');

    // Create a temporary file or use streaming
    // For simplicity, using the buffer directly with the API
    const file = new File([buffer], 'audio.webm', { type: 'audio/webm' });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1'
    });

    return transcription.text;
  } catch (error) {
    logger.error('Transcription error:', error);
    return null;
  }
}

async function generateSpeech(text: string): Promise<string | null> {
  try {
    // Get AI config for voice
    const aiConfig = await prisma.aIConfig.findFirst({ where: { id: 'default' } });
    const voice = (aiConfig?.voiceId as any) || 'alloy';

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice,
      input: text.substring(0, 4096) // TTS has character limit
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer.toString('base64');
  } catch (error) {
    logger.error('Speech generation error:', error);
    return null;
  }
}

async function endSession(session: TutorSession) {
  if (session.sessionId) {
    const endedAt = new Date();
    const sessionRecord = await prisma.tutoringSession.findUnique({
      where: { id: session.sessionId }
    });

    if (sessionRecord) {
      const duration = Math.floor((endedAt.getTime() - sessionRecord.startedAt.getTime()) / 1000);

      await prisma.tutoringSession.update({
        where: { id: session.sessionId },
        data: {
          status: 'COMPLETED',
          endedAt,
          duration
        }
      });
    }
  }

  sendMessage(session.ws, {
    type: 'session_ended',
    message: 'Session ended successfully'
  });

  session.ws.close();
}

function sendMessage(ws: WebSocket, data: any) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

export { activeSessions };
