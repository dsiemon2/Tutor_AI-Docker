// TutorAI Report Generation Service
// PDF, CSV, and iCal exports for students, teachers, and admins

import { prisma } from '../config/database';
import { logger } from '../utils/logger';

// ============================================
// CSV EXPORT FUNCTIONS
// ============================================

/**
 * Export student progress to CSV
 */
export async function exportStudentProgressCSV(
  studentId: string,
  options: { subjectId?: string; startDate?: Date; endDate?: Date } = {}
): Promise<string> {
  const where: any = { studentId };
  if (options.subjectId) {
    const subject = await prisma.subject.findUnique({ where: { id: options.subjectId }, include: { topics: true } });
    if (subject) {
      where.topicId = { in: subject.topics.map(t => t.id) };
    }
  }

  const progress = await prisma.studentProgress.findMany({
    where,
    include: {
      topic: { include: { subject: { include: { category: true } } } },
      student: { select: { firstName: true, lastName: true, email: true } }
    },
    orderBy: { lastActivityAt: 'desc' }
  });

  const header = 'Student,Subject,Category,Topic,Mastery Level,Questions Attempted,Questions Correct,Accuracy,Time Spent (min),Last Activity';
  const rows = progress.map(p => {
    const accuracy = p.questionsAttempted > 0
      ? Math.round((p.questionsCorrect / p.questionsAttempted) * 100)
      : 0;
    return `"${p.student.firstName} ${p.student.lastName}","${p.topic.subject.name}","${p.topic.subject.category?.name || ''}","${p.topic.name}",${p.masteryLevel},${p.questionsAttempted},${p.questionsCorrect},${accuracy}%,${Math.round(p.totalTime / 60)},"${p.lastActivityAt.toISOString()}"`;
  });

  return [header, ...rows].join('\n');
}

/**
 * Export tutoring sessions to CSV
 */
export async function exportSessionsCSV(
  options: {
    studentId?: string;
    subjectId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  } = {}
): Promise<string> {
  const where: any = {};
  if (options.studentId) where.studentId = options.studentId;
  if (options.subjectId) where.subjectId = options.subjectId;
  if (options.startDate || options.endDate) {
    where.startedAt = {};
    if (options.startDate) where.startedAt.gte = options.startDate;
    if (options.endDate) where.startedAt.lte = options.endDate;
  }

  const sessions = await prisma.tutoringSession.findMany({
    where,
    include: {
      student: { select: { firstName: true, lastName: true, email: true } },
      subject: { select: { name: true } },
      topic: { select: { name: true } }
    },
    orderBy: { startedAt: 'desc' },
    take: options.limit || 1000
  });

  const header = 'Session ID,Student,Email,Subject,Topic,Status,Duration (min),Started At,Ended At,Summary';
  const rows = sessions.map(s =>
    `"${s.id}","${s.student.firstName} ${s.student.lastName}","${s.student.email}","${s.subject?.name || ''}","${s.topic?.name || ''}","${s.status}",${Math.round((s.duration || 0) / 60)},"${s.startedAt.toISOString()}","${s.endedAt?.toISOString() || ''}","${(s.summary || '').replace(/"/g, '""')}"`
  );

  return [header, ...rows].join('\n');
}

/**
 * Export assignments to CSV
 */
export async function exportAssignmentsCSV(
  options: {
    classId?: string;
    createdById?: string;
  } = {}
): Promise<string> {
  const where: any = {};
  if (options.classId) where.classId = options.classId;
  if (options.createdById) where.createdById = options.createdById;

  const assignments = await prisma.assignment.findMany({
    where,
    include: {
      createdBy: { select: { firstName: true, lastName: true } },
      class: { select: { name: true } },
      topic: { include: { subject: { select: { name: true } } } },
      _count: { select: { submissions: true } }
    },
    orderBy: { dueDate: 'desc' }
  });

  const header = 'Title,Class,Subject,Topic,Created By,Due Date,Points,Submissions,Created At';
  const rows = assignments.map(a =>
    `"${a.title}","${a.class?.name || ''}","${a.topic?.subject?.name || ''}","${a.topic?.name || ''}","${a.createdBy?.firstName} ${a.createdBy?.lastName}","${a.dueDate?.toISOString() || ''}",${a.maxPoints},${a._count.submissions},"${a.createdAt.toISOString()}"`
  );

  return [header, ...rows].join('\n');
}

/**
 * Export grades/submissions to CSV
 */
export async function exportGradesCSV(
  classId: string,
  assignmentId?: string
): Promise<string> {
  const where: any = {};
  if (assignmentId) {
    where.assignmentId = assignmentId;
  } else {
    // Get all assignments for the class
    const assignments = await prisma.assignment.findMany({
      where: { classId },
      select: { id: true }
    });
    where.assignmentId = { in: assignments.map(a => a.id) };
  }

  const submissions = await prisma.submission.findMany({
    where,
    include: {
      student: { select: { firstName: true, lastName: true, email: true } },
      assignment: { select: { title: true, maxPoints: true } }
    },
    orderBy: [{ assignment: { title: 'asc' } }, { student: { lastName: 'asc' } }]
  });

  const header = 'Student,Email,Assignment,Grade,Max Points,Percentage,Status,Submitted At,Graded At';
  const rows = submissions.map(s => {
    const percentage = s.grade !== null && s.assignment.maxPoints > 0
      ? Math.round((s.grade / s.assignment.maxPoints) * 100)
      : '';
    return `"${s.student.firstName} ${s.student.lastName}","${s.student.email}","${s.assignment.title}",${s.grade ?? ''},${s.assignment.maxPoints},${percentage}%,"${s.status}","${s.submittedAt.toISOString()}","${s.gradedAt?.toISOString() || ''}"`;
  });

  return [header, ...rows].join('\n');
}

// ============================================
// PDF GENERATION (HTML-based for server-side)
// ============================================

/**
 * Generate student progress report HTML (can be converted to PDF client-side)
 */
export async function generateProgressReportHTML(
  studentId: string,
  options: { subjectId?: string } = {}
): Promise<string> {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: { school: true }
  });

  if (!student) throw new Error('Student not found');

  const where: any = { studentId };
  if (options.subjectId) {
    const subject = await prisma.subject.findUnique({ where: { id: options.subjectId }, include: { topics: true } });
    if (subject) {
      where.topicId = { in: subject.topics.map(t => t.id) };
    }
  }

  const progress = await prisma.studentProgress.findMany({
    where,
    include: {
      topic: { include: { subject: { include: { category: true } } } }
    },
    orderBy: [{ topic: { subject: { name: 'asc' } } }, { topic: { name: 'asc' } }]
  });

  // Group by subject
  const bySubject: Record<string, typeof progress> = {};
  progress.forEach(p => {
    const subjectName = p.topic.subject.name;
    if (!bySubject[subjectName]) bySubject[subjectName] = [];
    bySubject[subjectName].push(p);
  });

  // Calculate overall stats
  const totalTopics = progress.length;
  const masteredTopics = progress.filter(p => p.masteryLevel >= 4).length;
  const totalQuestions = progress.reduce((sum, p) => sum + p.questionsAttempted, 0);
  const correctQuestions = progress.reduce((sum, p) => sum + p.questionsCorrect, 0);
  const totalTime = progress.reduce((sum, p) => sum + p.totalTime, 0);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Progress Report - ${student.firstName} ${student.lastName}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; }
    .header h1 { color: #0ea5e9; margin-bottom: 5px; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; background: #f8f9fa; padding: 20px; border-radius: 8px; }
    .stat { text-align: center; }
    .stat-value { font-size: 2em; font-weight: bold; color: #0ea5e9; }
    .stat-label { color: #666; font-size: 0.9em; }
    .subject { margin: 20px 0; }
    .subject-header { background: #0ea5e9; color: white; padding: 10px; border-radius: 4px 4px 0 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f9fa; }
    .mastery-bar { width: 100px; height: 8px; background: #e5e7eb; border-radius: 4px; }
    .mastery-fill { height: 100%; border-radius: 4px; }
    .mastery-0 { background: #ef4444; width: 0%; }
    .mastery-1 { background: #f97316; width: 20%; }
    .mastery-2 { background: #eab308; width: 40%; }
    .mastery-3 { background: #84cc16; width: 60%; }
    .mastery-4 { background: #22c55e; width: 80%; }
    .mastery-5 { background: #10b981; width: 100%; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 0.8em; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Student Progress Report</h1>
    <h2>${student.firstName} ${student.lastName}</h2>
    <p>${student.school?.name || 'TutorAI'} | Grade ${student.gradeLevel || 'N/A'}</p>
    <p>Generated: ${new Date().toLocaleDateString()}</p>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-value">${totalTopics}</div>
      <div class="stat-label">Topics Studied</div>
    </div>
    <div class="stat">
      <div class="stat-value">${masteredTopics}</div>
      <div class="stat-label">Topics Mastered</div>
    </div>
    <div class="stat">
      <div class="stat-value">${totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0}%</div>
      <div class="stat-label">Accuracy</div>
    </div>
    <div class="stat">
      <div class="stat-value">${Math.round(totalTime / 60)}</div>
      <div class="stat-label">Minutes Learning</div>
    </div>
  </div>

  ${Object.entries(bySubject).map(([subjectName, topics]) => `
    <div class="subject">
      <div class="subject-header">
        <strong>${subjectName}</strong> (${topics.length} topics)
      </div>
      <table>
        <thead>
          <tr>
            <th>Topic</th>
            <th>Mastery</th>
            <th>Questions</th>
            <th>Accuracy</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          ${topics.map(t => `
            <tr>
              <td>${t.topic.name}</td>
              <td>
                <div class="mastery-bar">
                  <div class="mastery-fill mastery-${t.masteryLevel}"></div>
                </div>
                Level ${t.masteryLevel}/5
              </td>
              <td>${t.questionsCorrect}/${t.questionsAttempted}</td>
              <td>${t.questionsAttempted > 0 ? Math.round((t.questionsCorrect / t.questionsAttempted) * 100) : 0}%</td>
              <td>${Math.round(t.totalTime / 60)} min</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('')}

  <div class="footer">
    <p>Generated by TutorAI - AI-Powered Learning Platform</p>
  </div>
</body>
</html>
  `;
}

/**
 * Generate session transcript HTML
 */
export async function generateSessionTranscriptHTML(sessionId: string): Promise<string> {
  const session = await prisma.tutoringSession.findUnique({
    where: { id: sessionId },
    include: {
      student: { include: { school: true } },
      subject: { include: { category: true } },
      topic: true,
      messages: { orderBy: { createdAt: 'asc' } }
    }
  });

  if (!session) throw new Error('Session not found');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Session Transcript - ${session.student.firstName} ${session.student.lastName}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; }
    .header h1 { color: #0ea5e9; margin-bottom: 5px; }
    .info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .info-row { display: flex; justify-content: space-between; margin: 5px 0; }
    .messages { margin-top: 20px; }
    .message { margin: 15px 0; padding: 15px; border-radius: 8px; }
    .message-user { background: #e3f2fd; margin-left: 50px; }
    .message-assistant { background: #f5f5f5; margin-right: 50px; }
    .message-header { font-weight: bold; margin-bottom: 10px; color: #666; }
    .message-time { float: right; font-size: 0.8em; color: #999; }
    .summary { background: #e8f5e9; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 0.8em; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Session Transcript</h1>
    <h2>${session.topic?.name || session.subject?.name || 'Tutoring Session'}</h2>
    <p>${session.student.firstName} ${session.student.lastName}</p>
  </div>

  <div class="info">
    <div class="info-row">
      <span><strong>Date:</strong> ${session.startedAt.toLocaleDateString()}</span>
      <span><strong>Duration:</strong> ${Math.round((session.duration || 0) / 60)} minutes</span>
    </div>
    <div class="info-row">
      <span><strong>Subject:</strong> ${session.subject?.name || 'General'}</span>
      <span><strong>Category:</strong> ${session.subject?.category?.name || 'General'}</span>
    </div>
    <div class="info-row">
      <span><strong>School:</strong> ${session.student.school?.name || 'N/A'}</span>
      <span><strong>Grade:</strong> ${session.student.gradeLevel || 'N/A'}</span>
    </div>
  </div>

  ${session.summary ? `
  <div class="summary">
    <strong>Session Summary:</strong>
    <p>${session.summary}</p>
  </div>
  ` : ''}

  <div class="messages">
    <h3>Conversation</h3>
    ${session.messages.map(m => `
      <div class="message message-${m.role}">
        <div class="message-header">
          ${m.role === 'user' ? session.student.firstName : 'TutorAI'}
          <span class="message-time">${new Date(m.createdAt).toLocaleTimeString()}</span>
        </div>
        <div class="message-content">${escapeHtml(m.content)}</div>
      </div>
    `).join('')}
  </div>

  <div class="footer">
    <p>Generated by TutorAI - AI-Powered Learning Platform</p>
    <p>Generated: ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
  `;
}

// ============================================
// ICAL CALENDAR EXPORT
// ============================================

/**
 * Generate iCal file for student's assignments
 */
export async function generateAssignmentsIcal(
  studentId: string,
  options: { classIds?: string[] } = {}
): Promise<string> {
  // Get student's classes
  const enrollments = await prisma.classStudent.findMany({
    where: {
      studentId,
      ...(options.classIds ? { classId: { in: options.classIds } } : {})
    },
    select: { classId: true }
  });

  const classIds = enrollments.map(e => e.classId);

  const assignments = await prisma.assignment.findMany({
    where: {
      classId: { in: classIds },
      dueDate: { gte: new Date() }
    },
    include: {
      class: { select: { name: true } },
      topic: { include: { subject: { select: { name: true } } } }
    },
    orderBy: { dueDate: 'asc' }
  });

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { firstName: true, lastName: true }
  });

  return generateIcalContent(
    assignments.map(a => ({
      uid: `assignment-${a.id}@tutorai.com`,
      summary: `Due: ${a.title}`,
      description: `${a.instructions || ''}\n\nClass: ${a.class?.name || ''}\nSubject: ${a.topic?.subject?.name || ''}\nPoints: ${a.maxPoints}`,
      start: a.dueDate!,
      end: a.dueDate!,
      location: a.class?.name || ''
    })),
    `TutorAI Assignments - ${student?.firstName} ${student?.lastName}`
  );
}

/**
 * Generate iCal file for tutoring sessions
 */
export async function generateSessionsIcal(
  studentId: string,
  options: { startDate?: Date; endDate?: Date } = {}
): Promise<string> {
  const where: any = { studentId };
  if (options.startDate || options.endDate) {
    where.startedAt = {};
    if (options.startDate) where.startedAt.gte = options.startDate;
    if (options.endDate) where.startedAt.lte = options.endDate;
  }

  const sessions = await prisma.tutoringSession.findMany({
    where,
    include: {
      subject: { select: { name: true } },
      topic: { select: { name: true } }
    },
    orderBy: { startedAt: 'desc' },
    take: 100
  });

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { firstName: true, lastName: true }
  });

  return generateIcalContent(
    sessions.map(s => ({
      uid: `session-${s.id}@tutorai.com`,
      summary: `Tutoring: ${s.topic?.name || s.subject?.name || 'Study Session'}`,
      description: s.summary || '',
      start: s.startedAt,
      end: s.endedAt || new Date(s.startedAt.getTime() + (s.duration || 0) * 1000),
      location: 'TutorAI Online'
    })),
    `TutorAI Sessions - ${student?.firstName} ${student?.lastName}`
  );
}

/**
 * Generate iCal content
 */
function generateIcalContent(
  events: {
    uid: string;
    summary: string;
    description: string;
    start: Date;
    end: Date;
    location?: string;
  }[],
  calendarName: string
): string {
  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TutorAI//TutorAI Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${calendarName}
${events.map(e => `BEGIN:VEVENT
UID:${e.uid}
DTSTART:${formatDate(e.start)}
DTEND:${formatDate(e.end)}
SUMMARY:${escapeIcalText(e.summary)}
DESCRIPTION:${escapeIcalText(e.description)}
${e.location ? `LOCATION:${escapeIcalText(e.location)}` : ''}
END:VEVENT`).join('\n')}
END:VCALENDAR`;
}

/**
 * Escape text for iCal format
 */
function escapeIcalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Escape HTML
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default {
  exportStudentProgressCSV,
  exportSessionsCSV,
  exportAssignmentsCSV,
  exportGradesCSV,
  generateProgressReportHTML,
  generateSessionTranscriptHTML,
  generateAssignmentsIcal,
  generateSessionsIcal
};
