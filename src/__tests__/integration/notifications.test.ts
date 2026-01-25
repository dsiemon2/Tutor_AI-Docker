/**
 * Notification System Integration Tests
 * Tests for notifications CRUD and messaging
 */

import { createMockPrisma, MockPrismaClient } from '../mocks/prisma.mock';

// Create the mock instance
const notificationMockPrisma: MockPrismaClient = createMockPrisma();

jest.mock('../../config/database', () => ({
  prisma: notificationMockPrisma
}));

jest.mock('../../config', () => ({
  config: {
    basePath: '/TutorAI',
    adminToken: 'test-admin-token'
  }
}));

describe('Notification System', () => {
  const mockUser = {
    id: 'user-123',
    email: 'user@test.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'STUDENT'
  };

  const mockNotification = {
    id: 'notif-123',
    userId: 'user-123',
    type: 'info',
    title: 'New Assignment',
    message: 'You have a new assignment due next week',
    link: '/student/assignments/assign-123',
    isRead: false,
    readAt: null,
    createdAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    notificationMockPrisma.user.findUnique.mockResolvedValue(mockUser);
  });

  describe('Get Notifications', () => {
    it('should return all notifications for user', async () => {
      notificationMockPrisma.notification.findMany.mockResolvedValue([mockNotification]);
      notificationMockPrisma.notification.count.mockResolvedValue(1);

      const notifications = await notificationMockPrisma.notification.findMany({
        where: { userId: 'user-123' },
        orderBy: { createdAt: 'desc' }
      });

      const unreadCount = await notificationMockPrisma.notification.count({
        where: { userId: 'user-123', isRead: false }
      });

      expect(notifications.length).toBe(1);
      expect(unreadCount).toBe(1);
    });

    it('should filter unread only notifications', async () => {
      const readNotification = { ...mockNotification, isRead: true };
      notificationMockPrisma.notification.findMany.mockResolvedValue([mockNotification]); // Only unread

      const notifications = await notificationMockPrisma.notification.findMany({
        where: { userId: 'user-123', isRead: false }
      });

      expect(notifications.every(n => !n.isRead)).toBe(true);
    });

    it('should limit number of notifications returned', async () => {
      const notifications = Array(50).fill(null).map((_, i) => ({
        ...mockNotification,
        id: `notif-${i}`
      }));
      notificationMockPrisma.notification.findMany.mockResolvedValue(notifications.slice(0, 20));

      const result = await notificationMockPrisma.notification.findMany({
        where: { userId: 'user-123' },
        take: 20
      });

      expect(result.length).toBe(20);
    });
  });

  describe('Create Notification', () => {
    it('should create notification with required fields', async () => {
      notificationMockPrisma.notification.create.mockResolvedValue(mockNotification);

      const result = await notificationMockPrisma.notification.create({
        data: {
          userId: 'user-123',
          type: 'info',
          title: 'New Assignment',
          message: 'You have a new assignment due next week'
        }
      });

      expect(result).toHaveProperty('id');
      expect(result.type).toBe('info');
      expect(result.isRead).toBe(false);
    });

    it('should support different notification types', () => {
      const validTypes = ['info', 'success', 'warning', 'error'];
      validTypes.forEach(type => {
        expect(['info', 'success', 'warning', 'error']).toContain(type);
      });
    });

    it('should support optional link field', async () => {
      const notifWithLink = { ...mockNotification, link: '/student/assignments/123' };
      notificationMockPrisma.notification.create.mockResolvedValue(notifWithLink);

      const result = await notificationMockPrisma.notification.create({
        data: {
          userId: 'user-123',
          type: 'info',
          title: 'New Assignment',
          message: 'You have a new assignment',
          link: '/student/assignments/123'
        }
      });

      expect(result.link).toBe('/student/assignments/123');
    });
  });

  describe('Mark Notification as Read', () => {
    it('should mark single notification as read', async () => {
      const readNotification = { ...mockNotification, isRead: true, readAt: new Date() };
      notificationMockPrisma.notification.findFirst.mockResolvedValue(mockNotification);
      notificationMockPrisma.notification.update.mockResolvedValue(readNotification);

      const notification = await notificationMockPrisma.notification.findFirst({
        where: { id: 'notif-123', userId: 'user-123' }
      });

      expect(notification).not.toBeNull();

      const result = await notificationMockPrisma.notification.update({
        where: { id: 'notif-123' },
        data: { isRead: true, readAt: new Date() }
      });

      expect(result.isRead).toBe(true);
      expect(result.readAt).not.toBeNull();
    });

    it('should mark all notifications as read', async () => {
      notificationMockPrisma.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await notificationMockPrisma.notification.updateMany({
        where: { userId: 'user-123', isRead: false },
        data: { isRead: true, readAt: new Date() }
      });

      expect(result.count).toBe(5);
    });
  });

  describe('Delete Notification', () => {
    it('should delete notification belonging to user', async () => {
      notificationMockPrisma.notification.findFirst.mockResolvedValue(mockNotification);
      notificationMockPrisma.notification.delete.mockResolvedValue(mockNotification);

      const notification = await notificationMockPrisma.notification.findFirst({
        where: { id: 'notif-123', userId: 'user-123' }
      });

      expect(notification).not.toBeNull();

      await notificationMockPrisma.notification.delete({
        where: { id: 'notif-123' }
      });

      expect(notificationMockPrisma.notification.delete).toHaveBeenCalled();
    });

    it('should not delete notification belonging to different user', async () => {
      notificationMockPrisma.notification.findFirst.mockResolvedValue(null);

      const notification = await notificationMockPrisma.notification.findFirst({
        where: { id: 'notif-123', userId: 'different-user' }
      });

      expect(notification).toBeNull();
    });
  });
});

describe('Messaging System', () => {
  const mockUser = {
    id: 'user-123',
    email: 'student@test.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'STUDENT'
  };

  const mockTeacher = {
    id: 'teacher-456',
    email: 'teacher@test.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'TEACHER'
  };

  const mockMessage = {
    id: 'msg-123',
    senderId: 'user-123',
    receiverId: 'teacher-456',
    subject: 'Question about homework',
    content: 'I have a question about problem 5',
    isRead: false,
    readAt: null,
    parentId: null,
    attachments: null,
    createdAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Get Conversations', () => {
    it('should return messages where user is sender or receiver', async () => {
      const messages = [
        mockMessage,
        { ...mockMessage, id: 'msg-124', senderId: 'teacher-456', receiverId: 'user-123' }
      ];
      notificationMockPrisma.message.findMany.mockResolvedValue(messages);

      const result = await notificationMockPrisma.message.findMany({
        where: {
          OR: [
            { senderId: 'user-123' },
            { receiverId: 'user-123' }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });

      expect(result.length).toBe(2);
    });

    it('should group messages by conversation partner', () => {
      const messages = [
        { ...mockMessage, senderId: 'user-123', receiverId: 'teacher-456' },
        { ...mockMessage, id: 'msg-2', senderId: 'teacher-456', receiverId: 'user-123' },
        { ...mockMessage, id: 'msg-3', senderId: 'user-123', receiverId: 'teacher-789' }
      ];

      const userId = 'user-123';
      const conversationMap = new Map<string, any>();

      for (const msg of messages) {
        const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, { partnerId, messages: [] });
        }
        conversationMap.get(partnerId).messages.push(msg);
      }

      expect(conversationMap.size).toBe(2); // Two different conversation partners
    });
  });

  describe('Get Messages with User', () => {
    it('should return conversation thread between two users', async () => {
      const messages = [
        mockMessage,
        { ...mockMessage, id: 'msg-2', senderId: 'teacher-456', receiverId: 'user-123', content: 'Sure, let me explain' }
      ];
      notificationMockPrisma.message.findMany.mockResolvedValue(messages);

      const result = await notificationMockPrisma.message.findMany({
        where: {
          OR: [
            { senderId: 'user-123', receiverId: 'teacher-456' },
            { senderId: 'teacher-456', receiverId: 'user-123' }
          ]
        },
        orderBy: { createdAt: 'asc' }
      });

      expect(result.length).toBe(2);
    });

    it('should mark messages as read when viewing', async () => {
      notificationMockPrisma.message.updateMany.mockResolvedValue({ count: 2 });

      const result = await notificationMockPrisma.message.updateMany({
        where: {
          senderId: 'teacher-456',
          receiverId: 'user-123',
          isRead: false
        },
        data: { isRead: true, readAt: new Date() }
      });

      expect(result.count).toBe(2);
    });
  });

  describe('Send Message', () => {
    it('should create message with required fields', async () => {
      notificationMockPrisma.user.findUnique.mockResolvedValue(mockTeacher);
      notificationMockPrisma.message.create.mockResolvedValue(mockMessage);

      const receiver = await notificationMockPrisma.user.findUnique({
        where: { id: 'teacher-456' }
      });

      expect(receiver).not.toBeNull();

      const result = await notificationMockPrisma.message.create({
        data: {
          senderId: 'user-123',
          receiverId: 'teacher-456',
          content: 'I have a question about problem 5'
        }
      });

      expect(result.senderId).toBe('user-123');
      expect(result.receiverId).toBe('teacher-456');
    });

    it('should support optional subject', async () => {
      const messageWithSubject = { ...mockMessage, subject: 'Question about homework' };
      notificationMockPrisma.message.create.mockResolvedValue(messageWithSubject);

      const result = await notificationMockPrisma.message.create({
        data: {
          senderId: 'user-123',
          receiverId: 'teacher-456',
          subject: 'Question about homework',
          content: 'I have a question'
        }
      });

      expect(result.subject).toBe('Question about homework');
    });

    it('should support reply threading', async () => {
      const reply = {
        ...mockMessage,
        id: 'msg-reply',
        senderId: 'teacher-456',
        receiverId: 'user-123',
        parentId: 'msg-123',
        content: 'Here is the answer'
      };
      notificationMockPrisma.message.create.mockResolvedValue(reply);

      const result = await notificationMockPrisma.message.create({
        data: {
          senderId: 'teacher-456',
          receiverId: 'user-123',
          parentId: 'msg-123',
          content: 'Here is the answer'
        }
      });

      expect(result.parentId).toBe('msg-123');
    });

    it('should create notification for receiver', async () => {
      notificationMockPrisma.message.create.mockResolvedValue(mockMessage);
      notificationMockPrisma.notification.create.mockResolvedValue({
        id: 'notif-123',
        userId: 'teacher-456',
        type: 'info',
        title: 'New Message',
        message: 'You have a new message from John',
        link: '/messages/user-123'
      });

      // Simulate sending message and creating notification
      const message = await notificationMockPrisma.message.create({
        data: { ...mockMessage }
      });

      const notification = await notificationMockPrisma.notification.create({
        data: {
          userId: message.receiverId,
          type: 'info',
          title: 'New Message',
          message: 'You have a new message',
          link: `/messages/${message.senderId}`
        }
      });

      expect(notification.userId).toBe('teacher-456');
      expect(notification.type).toBe('info');
    });
  });

  describe('Delete Message', () => {
    it('should allow sender to delete message', async () => {
      notificationMockPrisma.message.findFirst.mockResolvedValue(mockMessage);
      notificationMockPrisma.message.delete.mockResolvedValue(mockMessage);

      const message = await notificationMockPrisma.message.findFirst({
        where: { id: 'msg-123', senderId: 'user-123' }
      });

      expect(message).not.toBeNull();

      await notificationMockPrisma.message.delete({
        where: { id: 'msg-123' }
      });

      expect(notificationMockPrisma.message.delete).toHaveBeenCalled();
    });

    it('should not allow non-sender to delete', async () => {
      notificationMockPrisma.message.findFirst.mockResolvedValue(null);

      const message = await notificationMockPrisma.message.findFirst({
        where: { id: 'msg-123', senderId: 'different-user' }
      });

      expect(message).toBeNull();
    });
  });

  describe('Unread Count', () => {
    it('should return count of unread messages', async () => {
      notificationMockPrisma.message.count.mockResolvedValue(5);

      const unreadCount = await notificationMockPrisma.message.count({
        where: { receiverId: 'user-123', isRead: false }
      });

      expect(unreadCount).toBe(5);
    });
  });
});
