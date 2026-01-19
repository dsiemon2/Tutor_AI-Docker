// Lesson Content Type Definitions

export interface LessonData {
  title: string;
  description: string;
  content: string;
  objectives: string[];
}

export interface LessonContent {
  intro: LessonData;
  practice: LessonData;
  mastery: LessonData;
}

export type LessonContentMap = Record<string, LessonContent>;
