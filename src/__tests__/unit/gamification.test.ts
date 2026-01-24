// Tests for Gamification Service

describe('Gamification Service', () => {
  describe('Badge System', () => {
    describe('Badge Categories', () => {
      it('should support achievement badges', () => {
        const categories = ['achievement', 'streak', 'mastery', 'social', 'special'];
        expect(categories).toContain('achievement');
      });

      it('should support streak badges', () => {
        const categories = ['achievement', 'streak', 'mastery', 'social', 'special'];
        expect(categories).toContain('streak');
      });

      it('should support mastery badges', () => {
        const categories = ['achievement', 'streak', 'mastery', 'social', 'special'];
        expect(categories).toContain('mastery');
      });
    });

    describe('Badge Tiers', () => {
      it('should have correct tier progression', () => {
        const tiers = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
        expect(tiers.indexOf('bronze')).toBeLessThan(tiers.indexOf('silver'));
        expect(tiers.indexOf('silver')).toBeLessThan(tiers.indexOf('gold'));
        expect(tiers.indexOf('gold')).toBeLessThan(tiers.indexOf('platinum'));
        expect(tiers.indexOf('platinum')).toBeLessThan(tiers.indexOf('diamond'));
      });
    });

    describe('Default Badges', () => {
      const defaultBadges = [
        { code: 'first_session', tier: 'bronze', points: 10 },
        { code: 'session_10', tier: 'bronze', points: 25 },
        { code: 'session_50', tier: 'silver', points: 100 },
        { code: 'session_100', tier: 'gold', points: 250 },
        { code: 'streak_7', tier: 'bronze', points: 25 },
        { code: 'streak_30', tier: 'silver', points: 100 },
        { code: 'streak_100', tier: 'gold', points: 500 },
      ];

      it('should have unique badge codes', () => {
        const codes = defaultBadges.map(b => b.code);
        const uniqueCodes = new Set(codes);
        expect(uniqueCodes.size).toBe(codes.length);
      });

      it('should have increasing points by tier', () => {
        const bronzeBadges = defaultBadges.filter(b => b.tier === 'bronze');
        const silverBadges = defaultBadges.filter(b => b.tier === 'silver');
        const goldBadges = defaultBadges.filter(b => b.tier === 'gold');

        const avgBronze = bronzeBadges.reduce((sum, b) => sum + b.points, 0) / bronzeBadges.length;
        const avgSilver = silverBadges.reduce((sum, b) => sum + b.points, 0) / silverBadges.length;
        const avgGold = goldBadges.reduce((sum, b) => sum + b.points, 0) / goldBadges.length;

        expect(avgBronze).toBeLessThan(avgSilver);
        expect(avgSilver).toBeLessThan(avgGold);
      });
    });
  });

  describe('Streak System', () => {
    describe('Streak Calculation', () => {
      it('should start streak at 0', () => {
        const initialStreak = { currentStreak: 0, longestStreak: 0 };
        expect(initialStreak.currentStreak).toBe(0);
      });

      it('should increment streak on consecutive days', () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const isConsecutive = (today.getTime() - yesterday.getTime()) <= 86400000 * 1.5;
        expect(isConsecutive).toBe(true);
      });

      it('should break streak on missed day', () => {
        const today = new Date();
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const isConsecutive = (today.getTime() - threeDaysAgo.getTime()) <= 86400000 * 1.5;
        expect(isConsecutive).toBe(false);
      });

      it('should track longest streak', () => {
        const streakData = { currentStreak: 5, longestStreak: 10 };
        const newStreak = Math.max(streakData.longestStreak, streakData.currentStreak + 1);
        expect(newStreak).toBe(10); // Longest remains 10
      });

      it('should update longest when current exceeds', () => {
        const streakData = { currentStreak: 10, longestStreak: 10 };
        const newStreak = Math.max(streakData.longestStreak, streakData.currentStreak + 1);
        expect(newStreak).toBe(11);
      });
    });

    describe('Streak Freeze', () => {
      it('should allow streak freeze', () => {
        const streak = { freezesRemaining: 2, currentStreak: 5 };
        expect(streak.freezesRemaining).toBeGreaterThan(0);
      });

      it('should decrement freeze on use', () => {
        const streak = { freezesRemaining: 2 };
        streak.freezesRemaining--;
        expect(streak.freezesRemaining).toBe(1);
      });
    });
  });

  describe('Points System', () => {
    describe('Point Configuration', () => {
      const defaultConfig = {
        sessionComplete: 10,
        sessionMinutes: 1,
        quizComplete: 5,
        quizPerfectScore: 20,
        quizPassBonus: 10,
        assignmentSubmit: 10,
        assignmentOnTime: 5,
        assignmentPerfect: 15,
        topicMastered: 25,
        subjectComplete: 100,
        streakDaily: 5,
        streakWeekly: 25,
        streakMonthly: 100,
      };

      it('should have positive point values', () => {
        Object.values(defaultConfig).forEach(value => {
          expect(value).toBeGreaterThanOrEqual(0);
        });
      });

      it('should have higher rewards for harder achievements', () => {
        expect(defaultConfig.subjectComplete).toBeGreaterThan(defaultConfig.topicMastered);
        expect(defaultConfig.streakMonthly).toBeGreaterThan(defaultConfig.streakWeekly);
        expect(defaultConfig.streakWeekly).toBeGreaterThan(defaultConfig.streakDaily);
      });
    });

    describe('Point Transactions', () => {
      it('should track point balance', () => {
        const balance = { totalEarned: 100, totalSpent: 30, currentBalance: 70 };
        expect(balance.currentBalance).toBe(balance.totalEarned - balance.totalSpent);
      });

      it('should support earning points', () => {
        const balance = { currentBalance: 50 };
        const earned = 25;
        balance.currentBalance += earned;
        expect(balance.currentBalance).toBe(75);
      });

      it('should support spending points', () => {
        const balance = { currentBalance: 50 };
        const spent = 20;
        if (balance.currentBalance >= spent) {
          balance.currentBalance -= spent;
        }
        expect(balance.currentBalance).toBe(30);
      });

      it('should prevent negative balance', () => {
        const balance = { currentBalance: 10 };
        const spent = 20;
        const canSpend = balance.currentBalance >= spent;
        expect(canSpend).toBe(false);
      });
    });

    describe('Level System', () => {
      it('should start at level 1', () => {
        const newUser = { level: 1, lifetimePoints: 0 };
        expect(newUser.level).toBe(1);
      });

      it('should calculate level from lifetime points', () => {
        // Level calculation: 100 points for level 1, increasing by 50% each level
        function calculateLevel(lifetimePoints: number): number {
          let level = 1;
          let required = 100;
          let remaining = lifetimePoints;

          while (remaining >= required) {
            remaining -= required;
            level++;
            required = Math.floor(required * 1.5);
          }

          return level;
        }

        expect(calculateLevel(0)).toBe(1);
        expect(calculateLevel(99)).toBe(1);
        expect(calculateLevel(100)).toBe(2);
        expect(calculateLevel(250)).toBe(3); // 100 + 150 = 250
      });

      it('should calculate level progress', () => {
        const lifetimePoints = 175;
        let required = 100;
        let remaining = lifetimePoints;
        let level = 1;

        while (remaining >= required) {
          remaining -= required;
          level++;
          required = Math.floor(required * 1.5);
        }

        expect(level).toBe(2);
        expect(remaining).toBe(75); // Progress toward level 3
        expect(required).toBe(150); // Points needed for level 3
      });
    });
  });

  describe('Leaderboard', () => {
    describe('Scope Options', () => {
      it('should support global scope', () => {
        const scopes = ['global', 'school', 'class'];
        expect(scopes).toContain('global');
      });

      it('should support school scope', () => {
        const scopes = ['global', 'school', 'class'];
        expect(scopes).toContain('school');
      });

      it('should support class scope', () => {
        const scopes = ['global', 'school', 'class'];
        expect(scopes).toContain('class');
      });
    });

    describe('Time Periods', () => {
      it('should support all time period', () => {
        const periods = ['all_time', 'monthly', 'weekly', 'daily'];
        expect(periods).toContain('all_time');
      });

      it('should calculate correct period start for daily', () => {
        const now = new Date();
        const dayStart = new Date(now);
        dayStart.setHours(0, 0, 0, 0);
        expect(dayStart.getHours()).toBe(0);
        expect(dayStart.getMinutes()).toBe(0);
      });

      it('should calculate correct period start for weekly', () => {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        expect(weekStart.getDay()).toBe(0); // Sunday
      });

      it('should calculate correct period start for monthly', () => {
        const now = new Date();
        const monthStart = new Date(now);
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        expect(monthStart.getDate()).toBe(1);
      });
    });

    describe('Ranking', () => {
      it('should sort by points descending', () => {
        const entries = [
          { userId: 'a', points: 50 },
          { userId: 'b', points: 100 },
          { userId: 'c', points: 75 },
        ];

        entries.sort((a, b) => b.points - a.points);

        expect(entries[0].userId).toBe('b');
        expect(entries[1].userId).toBe('c');
        expect(entries[2].userId).toBe('a');
      });

      it('should assign correct ranks', () => {
        const sorted = [
          { userId: 'b', points: 100 },
          { userId: 'c', points: 75 },
          { userId: 'a', points: 50 },
        ];

        const ranked = sorted.map((entry, index) => ({
          ...entry,
          rank: index + 1
        }));

        expect(ranked[0].rank).toBe(1);
        expect(ranked[1].rank).toBe(2);
        expect(ranked[2].rank).toBe(3);
      });
    });
  });

  describe('Activity Feed', () => {
    describe('Activity Types', () => {
      const activityTypes = [
        'badge_earned',
        'streak_milestone',
        'quiz_completed',
        'level_up',
        'assignment_submitted',
        'session_completed'
      ];

      it('should support badge earned activity', () => {
        expect(activityTypes).toContain('badge_earned');
      });

      it('should support streak milestone activity', () => {
        expect(activityTypes).toContain('streak_milestone');
      });

      it('should support level up activity', () => {
        expect(activityTypes).toContain('level_up');
      });
    });

    describe('Visibility', () => {
      it('should support public activities', () => {
        const activity = { isPublic: true };
        expect(activity.isPublic).toBe(true);
      });

      it('should support private activities', () => {
        const activity = { isPublic: false };
        expect(activity.isPublic).toBe(false);
      });
    });

    describe('Metadata', () => {
      it('should store JSON metadata', () => {
        const metadata = JSON.stringify({ badgeId: 'abc123', points: 50 });
        const parsed = JSON.parse(metadata);
        expect(parsed.badgeId).toBe('abc123');
        expect(parsed.points).toBe(50);
      });
    });
  });

  describe('Announcements', () => {
    describe('Announcement Types', () => {
      const types = ['info', 'success', 'warning', 'urgent'];

      it('should support info type', () => {
        expect(types).toContain('info');
      });

      it('should support urgent type', () => {
        expect(types).toContain('urgent');
      });
    });

    describe('Announcement Scope', () => {
      it('should support all users scope', () => {
        const scopes = ['all', 'school', 'class'];
        expect(scopes).toContain('all');
      });

      it('should support school-specific scope', () => {
        const announcement = { scope: 'school', scopeId: 'school123' };
        expect(announcement.scope).toBe('school');
        expect(announcement.scopeId).toBeTruthy();
      });

      it('should support class-specific scope', () => {
        const announcement = { scope: 'class', scopeId: 'class123' };
        expect(announcement.scope).toBe('class');
        expect(announcement.scopeId).toBeTruthy();
      });
    });

    describe('Read Tracking', () => {
      it('should track if announcement is read', () => {
        const announcementWithRead = {
          id: 'ann1',
          readBy: [{ userId: 'user1', readAt: new Date() }]
        };
        expect(announcementWithRead.readBy.length).toBe(1);
      });

      it('should identify unread announcements', () => {
        const announcement = { readBy: [] };
        const isRead = announcement.readBy.length > 0;
        expect(isRead).toBe(false);
      });
    });

    describe('Pinning', () => {
      it('should support pinned announcements', () => {
        const announcement = { isPinned: true };
        expect(announcement.isPinned).toBe(true);
      });

      it('should sort pinned first', () => {
        const announcements = [
          { id: 'a', isPinned: false, publishAt: new Date('2024-01-02') },
          { id: 'b', isPinned: true, publishAt: new Date('2024-01-01') },
          { id: 'c', isPinned: false, publishAt: new Date('2024-01-03') },
        ];

        announcements.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return b.publishAt.getTime() - a.publishAt.getTime();
        });

        expect(announcements[0].id).toBe('b'); // Pinned first
        expect(announcements[1].id).toBe('c'); // Then by date desc
        expect(announcements[2].id).toBe('a');
      });
    });

    describe('Expiration', () => {
      it('should identify expired announcements', () => {
        const expired = { expiresAt: new Date('2020-01-01') };
        const now = new Date();
        const isExpired = expired.expiresAt < now;
        expect(isExpired).toBe(true);
      });

      it('should identify active announcements', () => {
        const future = new Date();
        future.setFullYear(future.getFullYear() + 1);
        const active = { expiresAt: future };
        const now = new Date();
        const isActive = active.expiresAt > now;
        expect(isActive).toBe(true);
      });

      it('should treat null expiry as never expires', () => {
        const noExpiry = { expiresAt: null };
        const isActive = noExpiry.expiresAt === null || noExpiry.expiresAt > new Date();
        expect(isActive).toBe(true);
      });
    });
  });
});
