// Voice Tutoring Service - OpenAI TTS/Whisper Integration
import OpenAI from 'openai';
import { prisma } from '../config/database';
import { config } from '../config';
import { logger } from '../utils/logger';

const openai = new OpenAI({ apiKey: config.openaiApiKey });

// ============================================
// TYPES
// ============================================

export type VoiceId = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface VoiceSettings {
  voiceId: VoiceId;
  speed: number;          // 0.25 - 4.0
  language: string;
  enabled: boolean;
}

export interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
  words?: Array<{
    word: string;
    start: number;
    end: number;
  }>;
}

export interface SpeechResult {
  audio: Buffer;
  format: 'mp3' | 'opus' | 'aac' | 'flac';
  durationMs?: number;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  voiceId: 'nova',
  speed: 1.0,
  language: 'en',
  enabled: true
};

export const VOICE_DESCRIPTIONS: Record<VoiceId, string> = {
  alloy: 'Neutral, balanced voice suitable for general use',
  echo: 'Male voice with moderate tone',
  fable: 'British-accented voice with storytelling quality',
  onyx: 'Deep male voice with authority',
  nova: 'Female voice, clear and friendly',
  shimmer: 'Soft female voice, gentle and soothing'
};

// ============================================
// VOICE SETTINGS MANAGEMENT
// ============================================

export async function getUserVoiceSettings(userId: string): Promise<VoiceSettings> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      preferredVoice: true,
      preferredLanguage: true
    }
  });

  if (!user) {
    return DEFAULT_VOICE_SETTINGS;
  }

  return {
    voiceId: (user.preferredVoice as VoiceId) || DEFAULT_VOICE_SETTINGS.voiceId,
    speed: 1.0,
    language: user.preferredLanguage || 'en',
    enabled: true
  };
}

export async function getAIConfigVoice(): Promise<VoiceId> {
  const aiConfig = await prisma.aIConfig.findFirst({ where: { id: 'default' } });
  return (aiConfig?.voiceId as VoiceId) || 'nova';
}

// ============================================
// SPEECH-TO-TEXT (Transcription)
// ============================================

export async function transcribeAudio(
  audioData: Buffer | string,
  options?: {
    language?: string;
    prompt?: string;
    format?: 'mp3' | 'mp4' | 'mpeg' | 'mpga' | 'm4a' | 'wav' | 'webm';
    timestamps?: boolean;
  }
): Promise<TranscriptionResult | null> {
  try {
    // Convert base64 string to Buffer if needed
    const buffer = typeof audioData === 'string'
      ? Buffer.from(audioData, 'base64')
      : audioData;

    // Create a file-like object for the API
    const file = new File([buffer], `audio.${options?.format || 'webm'}`, {
      type: `audio/${options?.format || 'webm'}`
    });

    // Request transcription with word timestamps if needed
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: options?.language,
      prompt: options?.prompt,
      response_format: options?.timestamps ? 'verbose_json' : 'json',
      timestamp_granularities: options?.timestamps ? ['word'] : undefined
    });

    // Handle response format
    if (typeof transcription === 'string') {
      return { text: transcription };
    }

    const result: TranscriptionResult = {
      text: transcription.text
    };

    // Add additional fields if available
    if ('language' in transcription && typeof transcription.language === 'string') {
      result.language = transcription.language;
    }
    if ('duration' in transcription && typeof transcription.duration === 'number') {
      result.duration = transcription.duration;
    }
    if ('words' in transcription && Array.isArray(transcription.words)) {
      result.words = transcription.words.map((w: { word: string; start: number; end: number }) => ({
        word: w.word,
        start: w.start,
        end: w.end
      }));
    }

    logger.info(`Transcribed audio: ${result.text.substring(0, 100)}...`);

    return result;

  } catch (error) {
    logger.error(`Transcription error: ${error}`);
    return null;
  }
}

// ============================================
// TEXT-TO-SPEECH (Speech Synthesis)
// ============================================

export async function synthesizeSpeech(
  text: string,
  options?: {
    voice?: VoiceId;
    speed?: number;
    format?: 'mp3' | 'opus' | 'aac' | 'flac';
  }
): Promise<SpeechResult | null> {
  try {
    // Clean text for speech (remove markdown, limit length)
    const cleanedText = cleanTextForSpeech(text);

    if (!cleanedText || cleanedText.length === 0) {
      return null;
    }

    // TTS has a character limit
    const truncatedText = cleanedText.substring(0, 4096);

    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: options?.voice || 'nova',
      input: truncatedText,
      speed: options?.speed || 1.0,
      response_format: options?.format || 'mp3'
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    logger.info(`Generated speech: ${text.substring(0, 50)}... (${buffer.length} bytes)`);

    return {
      audio: buffer,
      format: options?.format || 'mp3'
    };

  } catch (error) {
    logger.error(`Speech synthesis error: ${error}`);
    return null;
  }
}

export async function synthesizeSpeechHD(
  text: string,
  options?: {
    voice?: VoiceId;
    speed?: number;
    format?: 'mp3' | 'opus' | 'aac' | 'flac';
  }
): Promise<SpeechResult | null> {
  try {
    const cleanedText = cleanTextForSpeech(text);

    if (!cleanedText || cleanedText.length === 0) {
      return null;
    }

    const truncatedText = cleanedText.substring(0, 4096);

    const response = await openai.audio.speech.create({
      model: 'tts-1-hd', // Higher quality model
      voice: options?.voice || 'nova',
      input: truncatedText,
      speed: options?.speed || 1.0,
      response_format: options?.format || 'mp3'
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    return {
      audio: buffer,
      format: options?.format || 'mp3'
    };

  } catch (error) {
    logger.error(`HD speech synthesis error: ${error}`);
    return null;
  }
}

// ============================================
// TEXT CLEANING FOR SPEECH
// ============================================

export function cleanTextForSpeech(text: string): string {
  let cleaned = text;

  // Remove markdown formatting
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
  cleaned = cleaned.replace(/\*(.*?)\*/g, '$1'); // Italic
  cleaned = cleaned.replace(/`(.*?)`/g, '$1'); // Code
  cleaned = cleaned.replace(/```[\s\S]*?```/g, ''); // Code blocks
  cleaned = cleaned.replace(/#{1,6}\s*/g, ''); // Headers

  // Convert LaTeX math to spoken form
  cleaned = cleaned.replace(/\$\$([\s\S]*?)\$\$/g, (_, expr) => convertMathToSpoken(expr));
  cleaned = cleaned.replace(/\$(.*?)\$/g, (_, expr) => convertMathToSpoken(expr));

  // Remove links, keep text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // Clean up whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Remove emoji (optional - keep if you want)
  // cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}]/gu, '');

  return cleaned;
}

function convertMathToSpoken(latex: string): string {
  // Basic LaTeX to spoken text conversion
  let spoken = latex.trim();

  // Common math conversions
  spoken = spoken.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 divided by $2');
  spoken = spoken.replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1');
  spoken = spoken.replace(/\\sqrt\[(\d+)\]\{([^}]+)\}/g, '$1th root of $2');
  spoken = spoken.replace(/\^2/g, ' squared');
  spoken = spoken.replace(/\^3/g, ' cubed');
  spoken = spoken.replace(/\^(\d+)/g, ' to the power of $1');
  spoken = spoken.replace(/\^{([^}]+)}/g, ' to the power of $1');
  spoken = spoken.replace(/\\times/g, ' times ');
  spoken = spoken.replace(/\\div/g, ' divided by ');
  spoken = spoken.replace(/\\pm/g, ' plus or minus ');
  spoken = spoken.replace(/\\pi/g, ' pi ');
  spoken = spoken.replace(/\\theta/g, ' theta ');
  spoken = spoken.replace(/\\alpha/g, ' alpha ');
  spoken = spoken.replace(/\\beta/g, ' beta ');
  spoken = spoken.replace(/\\sum/g, ' sum of ');
  spoken = spoken.replace(/\\int/g, ' integral of ');
  spoken = spoken.replace(/\\infty/g, ' infinity ');
  spoken = spoken.replace(/=/g, ' equals ');
  spoken = spoken.replace(/>/g, ' is greater than ');
  spoken = spoken.replace(/</g, ' is less than ');
  spoken = spoken.replace(/\\geq/g, ' is greater than or equal to ');
  spoken = spoken.replace(/\\leq/g, ' is less than or equal to ');
  spoken = spoken.replace(/\\neq/g, ' is not equal to ');

  // Clean up remaining LaTeX commands
  spoken = spoken.replace(/\\[a-zA-Z]+/g, ' ');
  spoken = spoken.replace(/[{}]/g, '');

  return spoken.replace(/\s+/g, ' ').trim();
}

// ============================================
// STREAMING SPEECH (For longer content)
// ============================================

export async function* streamSpeech(
  text: string,
  options?: {
    voice?: VoiceId;
    speed?: number;
    chunkSize?: number;
  }
): AsyncGenerator<Buffer, void, unknown> {
  const chunkSize = options?.chunkSize || 500; // Characters per chunk
  const sentences = splitIntoSentences(text);

  let buffer = '';

  for (const sentence of sentences) {
    buffer += sentence;

    // Generate speech when buffer is large enough
    if (buffer.length >= chunkSize || sentence === sentences[sentences.length - 1]) {
      const result = await synthesizeSpeech(buffer, {
        voice: options?.voice,
        speed: options?.speed
      });

      if (result) {
        yield result.audio;
      }

      buffer = '';
    }
  }
}

function splitIntoSentences(text: string): string[] {
  // Split on sentence-ending punctuation
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  return sentences.map(s => s.trim()).filter(s => s.length > 0);
}

// ============================================
// VOICE ACTIVITY DETECTION HELPERS
// ============================================

export interface AudioAnalysis {
  hasVoice: boolean;
  averageVolume: number;
  peakVolume: number;
  duration: number;
  silenceRatio: number;
}

export function analyzeAudioData(pcmData: Int16Array, sampleRate: number = 16000): AudioAnalysis {
  const samples = pcmData.length;
  const duration = samples / sampleRate;

  let sum = 0;
  let peak = 0;
  let silentSamples = 0;
  const silenceThreshold = 500; // PCM value threshold for silence

  for (let i = 0; i < samples; i++) {
    const absValue = Math.abs(pcmData[i]);
    sum += absValue;
    if (absValue > peak) peak = absValue;
    if (absValue < silenceThreshold) silentSamples++;
  }

  const averageVolume = sum / samples;
  const silenceRatio = silentSamples / samples;

  return {
    hasVoice: averageVolume > 1000 && silenceRatio < 0.9,
    averageVolume,
    peakVolume: peak,
    duration,
    silenceRatio
  };
}

// ============================================
// VOICE SESSION MANAGEMENT
// ============================================

export interface VoiceSession {
  id: string;
  userId: string;
  sessionId: string;
  voiceSettings: VoiceSettings;
  isActive: boolean;
  startedAt: Date;
  lastActivityAt: Date;
  messageCount: number;
}

const voiceSessions = new Map<string, VoiceSession>();

export function createVoiceSession(
  id: string,
  userId: string,
  sessionId: string,
  settings?: Partial<VoiceSettings>
): VoiceSession {
  const session: VoiceSession = {
    id,
    userId,
    sessionId,
    voiceSettings: { ...DEFAULT_VOICE_SETTINGS, ...settings },
    isActive: true,
    startedAt: new Date(),
    lastActivityAt: new Date(),
    messageCount: 0
  };

  voiceSessions.set(id, session);
  return session;
}

export function getVoiceSession(id: string): VoiceSession | undefined {
  return voiceSessions.get(id);
}

export function updateVoiceSessionActivity(id: string): void {
  const session = voiceSessions.get(id);
  if (session) {
    session.lastActivityAt = new Date();
    session.messageCount++;
  }
}

export function endVoiceSession(id: string): void {
  const session = voiceSessions.get(id);
  if (session) {
    session.isActive = false;
  }
  voiceSessions.delete(id);
}

export function getActiveVoiceSessions(): VoiceSession[] {
  return Array.from(voiceSessions.values()).filter(s => s.isActive);
}

// ============================================
// PRONUNCIATION HELPERS
// ============================================

export const PRONUNCIATION_OVERRIDES: Record<string, string> = {
  // Math terms
  'π': 'pi',
  '²': 'squared',
  '³': 'cubed',
  '±': 'plus or minus',
  '∞': 'infinity',
  '≠': 'not equal to',
  '≤': 'less than or equal to',
  '≥': 'greater than or equal to',
  '∑': 'sum',
  '∫': 'integral',

  // Common abbreviations
  'AI': 'A I',
  'TutorAI': 'Tutor A I',
  'e.g.': 'for example',
  'i.e.': 'that is',
  'etc.': 'et cetera',

  // Subject-specific
  'pH': 'P H',
  'DNA': 'D N A',
  'RNA': 'R N A',
  'H₂O': 'H 2 O, or water',
  'CO₂': 'C O 2, or carbon dioxide'
};

export function applyPronunciationOverrides(text: string): string {
  let result = text;
  for (const [pattern, replacement] of Object.entries(PRONUNCIATION_OVERRIDES)) {
    result = result.replace(new RegExp(escapeRegex(pattern), 'g'), replacement);
  }
  return result;
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================
// TUTORING VOICE RESPONSES
// ============================================

export function addSpeechEmphasis(text: string): string {
  // Add natural pauses and emphasis for better speech flow
  let result = text;

  // Add pauses after colons
  result = result.replace(/:\s*/g, ': ... ');

  // Add pause before "but", "however", etc.
  result = result.replace(/\s+(but|however|although)\s+/gi, ' ... $1 ');

  // Add emphasis to important words
  result = result.replace(/\b(remember|important|key|note)\b/gi, '... $1 ...');

  return result;
}

export function wrapForTutoringVoice(text: string, studentName?: string): string {
  let result = text;

  // Apply pronunciation overrides
  result = applyPronunciationOverrides(result);

  // Clean for speech
  result = cleanTextForSpeech(result);

  // Add speech emphasis
  result = addSpeechEmphasis(result);

  return result;
}
