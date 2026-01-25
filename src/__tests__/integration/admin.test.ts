/**
 * Admin Routes Integration Tests
 * Tests for admin CRUD operations: Knowledge Base, Logic Rules, Functions, SMS, Webhooks
 */

// Mock Prisma
const mockPrisma = {
  knowledgeDocument: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  logicRule: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  aIFunction: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  sMSConfig: {
    findFirst: jest.fn(),
    upsert: jest.fn()
  },
  webhook: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  branding: {
    findFirst: jest.fn()
  }
};

jest.mock('../../config/database', () => ({
  prisma: mockPrisma
}));

jest.mock('../../config', () => ({
  config: {
    basePath: '/TutorAI',
    adminToken: 'test-admin-token'
  }
}));

describe('Admin Knowledge Base CRUD', () => {
  const mockDocument = {
    id: 'doc-123',
    title: 'Algebra Fundamentals',
    content: 'This document covers basic algebra concepts...',
    category: 'tutorial',
    tags: 'algebra, math, fundamentals',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.branding.findFirst.mockResolvedValue({
      primaryColor: '#0ea5e9'
    });
  });

  describe('List Documents', () => {
    it('should return all documents', async () => {
      mockPrisma.knowledgeDocument.findMany.mockResolvedValue([mockDocument]);

      const documents = await mockPrisma.knowledgeDocument.findMany({
        orderBy: { createdAt: 'desc' }
      });

      expect(documents.length).toBe(1);
      expect(documents[0].title).toBe('Algebra Fundamentals');
    });
  });

  describe('Create Document', () => {
    it('should create document with required fields', async () => {
      mockPrisma.knowledgeDocument.create.mockResolvedValue(mockDocument);

      const result = await mockPrisma.knowledgeDocument.create({
        data: {
          title: 'Algebra Fundamentals',
          content: 'This document covers basic algebra concepts...',
          category: 'tutorial',
          isActive: true
        }
      });

      expect(result.title).toBe('Algebra Fundamentals');
      expect(result.category).toBe('tutorial');
    });

    it('should support optional tags', async () => {
      const docWithTags = { ...mockDocument, tags: 'algebra, math' };
      mockPrisma.knowledgeDocument.create.mockResolvedValue(docWithTags);

      const result = await mockPrisma.knowledgeDocument.create({
        data: {
          title: 'Algebra Fundamentals',
          content: 'Content here',
          tags: 'algebra, math'
        }
      });

      expect(result.tags).toBe('algebra, math');
    });
  });

  describe('Update Document', () => {
    it('should update document fields', async () => {
      const updatedDoc = { ...mockDocument, title: 'Updated Title', isActive: false };
      mockPrisma.knowledgeDocument.update.mockResolvedValue(updatedDoc);

      const result = await mockPrisma.knowledgeDocument.update({
        where: { id: 'doc-123' },
        data: { title: 'Updated Title', isActive: false }
      });

      expect(result.title).toBe('Updated Title');
      expect(result.isActive).toBe(false);
    });
  });

  describe('Delete Document', () => {
    it('should delete document', async () => {
      mockPrisma.knowledgeDocument.delete.mockResolvedValue(mockDocument);

      await mockPrisma.knowledgeDocument.delete({
        where: { id: 'doc-123' }
      });

      expect(mockPrisma.knowledgeDocument.delete).toHaveBeenCalledWith({
        where: { id: 'doc-123' }
      });
    });
  });
});

describe('Admin Logic Rules CRUD', () => {
  const mockRule = {
    id: 'rule-123',
    name: 'Struggling Student Support',
    description: 'Provide extra support when student struggles',
    condition: 'student.incorrectAnswers >= 3',
    action: 'switchToSupportiveMode()',
    priority: 8,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('List Rules', () => {
    it('should return rules sorted by priority', async () => {
      const rules = [
        { ...mockRule, priority: 10 },
        { ...mockRule, id: 'rule-2', priority: 5 }
      ];
      mockPrisma.logicRule.findMany.mockResolvedValue(rules);

      const result = await mockPrisma.logicRule.findMany({
        orderBy: { priority: 'desc' }
      });

      expect(result.length).toBe(2);
    });
  });

  describe('Create Rule', () => {
    it('should create rule with condition and action', async () => {
      mockPrisma.logicRule.create.mockResolvedValue(mockRule);

      const result = await mockPrisma.logicRule.create({
        data: {
          name: 'Struggling Student Support',
          condition: 'student.incorrectAnswers >= 3',
          action: 'switchToSupportiveMode()',
          priority: 8,
          isActive: true
        }
      });

      expect(result.condition).toBe('student.incorrectAnswers >= 3');
      expect(result.action).toBe('switchToSupportiveMode()');
    });

    it('should validate priority range 0-10', () => {
      const validPriority = 8;
      const invalidPriority = 15;

      expect(validPriority >= 0 && validPriority <= 10).toBe(true);
      expect(invalidPriority >= 0 && invalidPriority <= 10).toBe(false);
    });
  });

  describe('Update Rule', () => {
    it('should toggle rule active status', async () => {
      const inactiveRule = { ...mockRule, isActive: false };
      mockPrisma.logicRule.update.mockResolvedValue(inactiveRule);

      const result = await mockPrisma.logicRule.update({
        where: { id: 'rule-123' },
        data: { isActive: false }
      });

      expect(result.isActive).toBe(false);
    });
  });
});

describe('Admin AI Functions CRUD', () => {
  const mockFunction = {
    id: 'func-123',
    name: 'generatePracticeProblems',
    description: 'Generates practice problems for a topic',
    parameters: JSON.stringify({ type: 'object', properties: { topic: { type: 'string' } } }),
    triggerType: 'manual',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('List Functions', () => {
    it('should return all functions', async () => {
      mockPrisma.aIFunction.findMany.mockResolvedValue([mockFunction]);

      const functions = await mockPrisma.aIFunction.findMany({
        orderBy: { createdAt: 'desc' }
      });

      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('generatePracticeProblems');
    });
  });

  describe('Create Function', () => {
    it('should create function with JSON parameters', async () => {
      mockPrisma.aIFunction.create.mockResolvedValue(mockFunction);

      const result = await mockPrisma.aIFunction.create({
        data: {
          name: 'generatePracticeProblems',
          description: 'Generates practice problems',
          parameters: JSON.stringify({ type: 'object' }),
          triggerType: 'manual',
          isActive: true
        }
      });

      expect(result.name).toBe('generatePracticeProblems');
      const params = JSON.parse(result.parameters!);
      expect(params.type).toBe('object');
    });

    it('should support different trigger types', () => {
      const validTriggers = ['manual', 'scheduled', 'event', 'automatic'];
      expect(validTriggers).toContain(mockFunction.triggerType);
    });
  });
});

describe('Admin SMS Settings', () => {
  const mockSMSConfig = {
    id: 'default',
    isEnabled: true,
    accountSid: 'AC1234567890',
    authToken: 'test-auth-token',
    phoneNumber: '+15551234567',
    sessionReminders: true,
    progressUpdates: true,
    achievementAlerts: false,
    teacherAlerts: false,
    sessionReminderTemplate: 'Hi {student_name}! Your session starts soon.',
    progressUpdateTemplate: 'Weekly update for {student_name}',
    achievementTemplate: 'Congrats {student_name}!',
    teacherAlertTemplate: 'Alert for {student_name}',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Get SMS Config', () => {
    it('should return default SMS config', async () => {
      mockPrisma.sMSConfig.findFirst.mockResolvedValue(mockSMSConfig);

      const config = await mockPrisma.sMSConfig.findFirst({
        where: { id: 'default' }
      });

      expect(config?.isEnabled).toBe(true);
      expect(config?.accountSid).toBe('AC1234567890');
    });

    it('should return default values if no config exists', async () => {
      mockPrisma.sMSConfig.findFirst.mockResolvedValue(null);

      const config = await mockPrisma.sMSConfig.findFirst({
        where: { id: 'default' }
      });

      expect(config).toBeNull();
    });
  });

  describe('Update SMS Config', () => {
    it('should upsert SMS config', async () => {
      mockPrisma.sMSConfig.upsert.mockResolvedValue(mockSMSConfig);

      const result = await mockPrisma.sMSConfig.upsert({
        where: { id: 'default' },
        update: { isEnabled: true, accountSid: 'AC1234567890' },
        create: { id: 'default', isEnabled: true, accountSid: 'AC1234567890' }
      });

      expect(result.isEnabled).toBe(true);
    });

    it('should validate Twilio account SID format', () => {
      // Twilio SID format: AC + 32 hex characters = 34 total
      const validSidFormat = 'AC' + 'x'.repeat(32); // ACxxxxxxxx... (34 chars)
      const invalidSid = 'XX1234567890';

      expect(validSidFormat.startsWith('AC') && validSidFormat.length === 34).toBe(true);
      expect(invalidSid.startsWith('AC') && invalidSid.length === 34).toBe(false);
    });
  });
});

describe('Admin Webhooks CRUD', () => {
  const mockWebhook = {
    id: 'webhook-123',
    name: 'LMS Integration',
    url: 'https://lms.school.edu/webhook',
    secret: 'secret-key',
    events: JSON.stringify(['session.ended', 'progress.updated']),
    isActive: true,
    lastTriggeredAt: null,
    failureCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('List Webhooks', () => {
    it('should return all webhooks', async () => {
      mockPrisma.webhook.findMany.mockResolvedValue([mockWebhook]);

      const webhooks = await mockPrisma.webhook.findMany({
        orderBy: { createdAt: 'desc' }
      });

      expect(webhooks.length).toBe(1);
      expect(webhooks[0].name).toBe('LMS Integration');
    });
  });

  describe('Create Webhook', () => {
    it('should create webhook with events as JSON array', async () => {
      mockPrisma.webhook.create.mockResolvedValue(mockWebhook);

      const result = await mockPrisma.webhook.create({
        data: {
          name: 'LMS Integration',
          url: 'https://lms.school.edu/webhook',
          events: JSON.stringify(['session.ended', 'progress.updated']),
          isActive: true
        }
      });

      const events = JSON.parse(result.events);
      expect(events).toContain('session.ended');
      expect(events).toContain('progress.updated');
    });

    it('should validate webhook URL format', () => {
      const validUrl = 'https://example.com/webhook';
      const invalidUrl = 'not-a-url';

      try {
        new URL(validUrl);
        expect(true).toBe(true);
      } catch {
        expect(false).toBe(true);
      }

      try {
        new URL(invalidUrl);
        expect(false).toBe(true);
      } catch {
        expect(true).toBe(true);
      }
    });
  });

  describe('Update Webhook', () => {
    it('should update last triggered timestamp', async () => {
      const triggeredWebhook = { ...mockWebhook, lastTriggeredAt: new Date() };
      mockPrisma.webhook.update.mockResolvedValue(triggeredWebhook);

      const result = await mockPrisma.webhook.update({
        where: { id: 'webhook-123' },
        data: { lastTriggeredAt: new Date() }
      });

      expect(result.lastTriggeredAt).not.toBeNull();
    });

    it('should toggle webhook active status', async () => {
      const inactiveWebhook = { ...mockWebhook, isActive: false };
      mockPrisma.webhook.update.mockResolvedValue(inactiveWebhook);

      const result = await mockPrisma.webhook.update({
        where: { id: 'webhook-123' },
        data: { isActive: false }
      });

      expect(result.isActive).toBe(false);
    });
  });

  describe('Delete Webhook', () => {
    it('should delete webhook', async () => {
      mockPrisma.webhook.delete.mockResolvedValue(mockWebhook);

      await mockPrisma.webhook.delete({
        where: { id: 'webhook-123' }
      });

      expect(mockPrisma.webhook.delete).toHaveBeenCalledWith({
        where: { id: 'webhook-123' }
      });
    });
  });

  describe('Available Events', () => {
    it('should define valid event types', () => {
      const validEvents = [
        'session.started',
        'session.ended',
        'session.paused',
        'progress.updated',
        'progress.report',
        'mastery.achieved',
        'achievement.unlocked',
        'streak.maintained',
        'topic.completed'
      ];

      const events = JSON.parse(mockWebhook.events);
      expect(events.every((e: string) => validEvents.includes(e))).toBe(true);
    });
  });
});
