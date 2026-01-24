// Tests for Learning Path Service

import {
  calculateMasteryLevel,
  getMasteryThreshold,
  getNextMasteryLevel,
  getMasteryProgress,
  calculateMasteryScore,
  calculatePathProgress,
  getAvailableNodes,
  getNextRecommendedNode,
  calculatePathMatch,
  recommendPaths,
  formatMasteryLevel,
  getMasteryColor,
  getMasteryBadge,
  estimateTimeToMastery,
  MASTERY_THRESHOLDS,
  type MasteryLevel,
  type LearningPath,
  type LearningPathNode,
  type MasteryInput
} from '../../services/learningPath.service';

describe('Learning Path Service', () => {
  describe('Mastery Level Calculations', () => {
    describe('calculateMasteryLevel', () => {
      it('should return novice for score 0', () => {
        expect(calculateMasteryLevel(0)).toBe('novice');
      });

      it('should return novice for score 19', () => {
        expect(calculateMasteryLevel(19)).toBe('novice');
      });

      it('should return beginner for score 20', () => {
        expect(calculateMasteryLevel(20)).toBe('beginner');
      });

      it('should return beginner for score 39', () => {
        expect(calculateMasteryLevel(39)).toBe('beginner');
      });

      it('should return intermediate for score 40', () => {
        expect(calculateMasteryLevel(40)).toBe('intermediate');
      });

      it('should return proficient for score 60', () => {
        expect(calculateMasteryLevel(60)).toBe('proficient');
      });

      it('should return expert for score 80', () => {
        expect(calculateMasteryLevel(80)).toBe('expert');
      });

      it('should return master for score 95', () => {
        expect(calculateMasteryLevel(95)).toBe('master');
      });

      it('should return master for score 100', () => {
        expect(calculateMasteryLevel(100)).toBe('master');
      });
    });

    describe('getMasteryThreshold', () => {
      it('should return 0 for novice', () => {
        expect(getMasteryThreshold('novice')).toBe(0);
      });

      it('should return 20 for beginner', () => {
        expect(getMasteryThreshold('beginner')).toBe(20);
      });

      it('should return 40 for intermediate', () => {
        expect(getMasteryThreshold('intermediate')).toBe(40);
      });

      it('should return 60 for proficient', () => {
        expect(getMasteryThreshold('proficient')).toBe(60);
      });

      it('should return 80 for expert', () => {
        expect(getMasteryThreshold('expert')).toBe(80);
      });

      it('should return 95 for master', () => {
        expect(getMasteryThreshold('master')).toBe(95);
      });
    });

    describe('getNextMasteryLevel', () => {
      it('should return beginner after novice', () => {
        expect(getNextMasteryLevel('novice')).toBe('beginner');
      });

      it('should return intermediate after beginner', () => {
        expect(getNextMasteryLevel('beginner')).toBe('intermediate');
      });

      it('should return proficient after intermediate', () => {
        expect(getNextMasteryLevel('intermediate')).toBe('proficient');
      });

      it('should return expert after proficient', () => {
        expect(getNextMasteryLevel('proficient')).toBe('expert');
      });

      it('should return master after expert', () => {
        expect(getNextMasteryLevel('expert')).toBe('master');
      });

      it('should return null after master', () => {
        expect(getNextMasteryLevel('master')).toBeNull();
      });
    });

    describe('getMasteryProgress', () => {
      it('should calculate progress within beginner level', () => {
        const result = getMasteryProgress(30, 'beginner');
        expect(result.nextLevel).toBe('intermediate');
        expect(result.pointsToNextLevel).toBe(10);
        expect(result.progressInLevel).toBe(50); // 30-20=10 out of 40-20=20 = 50%
      });

      it('should return 100% progress at max level', () => {
        const result = getMasteryProgress(100, 'master');
        expect(result.nextLevel).toBeNull();
        expect(result.progressInLevel).toBe(100);
        expect(result.pointsToNextLevel).toBe(0);
      });

      it('should calculate progress at level threshold', () => {
        const result = getMasteryProgress(40, 'intermediate');
        expect(result.progressInLevel).toBe(0);
        expect(result.pointsToNextLevel).toBe(20);
      });
    });
  });

  describe('Mastery Score Calculation', () => {
    it('should weight accuracy at 70%', () => {
      const input: MasteryInput = {
        questionsCorrect: 10,
        questionsTotal: 10,
        averageTimeSeconds: 30,
        consistencyStreak: 0,
        recentTrend: 'stable',
        daysSinceLastActivity: 0
      };
      const score = calculateMasteryScore(input);
      // 100% accuracy contributes 70 points
      expect(score).toBeGreaterThanOrEqual(70);
    });

    it('should give higher score for faster answers', () => {
      const slowInput: MasteryInput = {
        questionsCorrect: 8,
        questionsTotal: 10,
        averageTimeSeconds: 60,
        consistencyStreak: 0,
        recentTrend: 'stable',
        daysSinceLastActivity: 0
      };
      const fastInput: MasteryInput = {
        ...slowInput,
        averageTimeSeconds: 15
      };
      expect(calculateMasteryScore(fastInput)).toBeGreaterThan(calculateMasteryScore(slowInput));
    });

    it('should reward consistency streaks', () => {
      const noStreak: MasteryInput = {
        questionsCorrect: 8,
        questionsTotal: 10,
        averageTimeSeconds: 30,
        consistencyStreak: 0,
        recentTrend: 'stable',
        daysSinceLastActivity: 0
      };
      const withStreak: MasteryInput = {
        ...noStreak,
        consistencyStreak: 10
      };
      expect(calculateMasteryScore(withStreak)).toBeGreaterThan(calculateMasteryScore(noStreak));
    });

    it('should reward improving trend', () => {
      const stable: MasteryInput = {
        questionsCorrect: 8,
        questionsTotal: 10,
        averageTimeSeconds: 30,
        consistencyStreak: 0,
        recentTrend: 'stable',
        daysSinceLastActivity: 0
      };
      const improving: MasteryInput = {
        ...stable,
        recentTrend: 'improving'
      };
      expect(calculateMasteryScore(improving)).toBeGreaterThan(calculateMasteryScore(stable));
    });

    it('should penalize declining trend', () => {
      const stable: MasteryInput = {
        questionsCorrect: 8,
        questionsTotal: 10,
        averageTimeSeconds: 30,
        consistencyStreak: 0,
        recentTrend: 'stable',
        daysSinceLastActivity: 0
      };
      const declining: MasteryInput = {
        ...stable,
        recentTrend: 'declining'
      };
      expect(calculateMasteryScore(declining)).toBeLessThan(calculateMasteryScore(stable));
    });

    it('should decay score over time without activity', () => {
      const recent: MasteryInput = {
        questionsCorrect: 8,
        questionsTotal: 10,
        averageTimeSeconds: 30,
        consistencyStreak: 0,
        recentTrend: 'stable',
        daysSinceLastActivity: 0
      };
      const stale: MasteryInput = {
        ...recent,
        daysSinceLastActivity: 30
      };
      expect(calculateMasteryScore(stale)).toBeLessThan(calculateMasteryScore(recent));
    });

    it('should handle zero questions gracefully', () => {
      const input: MasteryInput = {
        questionsCorrect: 0,
        questionsTotal: 0,
        averageTimeSeconds: 30,
        consistencyStreak: 0,
        recentTrend: 'stable',
        daysSinceLastActivity: 0
      };
      const score = calculateMasteryScore(input);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should cap score at 100', () => {
      const perfect: MasteryInput = {
        questionsCorrect: 100,
        questionsTotal: 100,
        averageTimeSeconds: 5,
        consistencyStreak: 100,
        recentTrend: 'improving',
        daysSinceLastActivity: 0
      };
      expect(calculateMasteryScore(perfect)).toBeLessThanOrEqual(100);
    });
  });

  describe('Learning Path Progress', () => {
    const createTestPath = (nodeCount: number = 5): LearningPath => ({
      id: 'test-path',
      title: 'Test Path',
      description: 'A test learning path',
      difficulty: 'intermediate',
      estimatedHours: 10,
      nodes: Array.from({ length: nodeCount }, (_, i) => ({
        id: `node-${i}`,
        title: `Node ${i}`,
        type: 'lesson' as const,
        order: i,
        estimatedMinutes: 30,
        pointsValue: 100,
        prerequisites: i > 0 ? [`node-${i - 1}`] : [],
        isOptional: i === nodeCount - 1 // Last node is optional
      })),
      prerequisites: [],
      outcomes: ['Learn stuff'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    describe('calculatePathProgress', () => {
      it('should return 0% for no completed nodes', () => {
        const path = createTestPath();
        const result = calculatePathProgress(path, []);
        expect(result.completionPercentage).toBe(0);
        expect(result.requiredRemaining).toBe(4); // 4 required, 1 optional
      });

      it('should calculate completion based on required nodes only', () => {
        const path = createTestPath();
        const result = calculatePathProgress(path, ['node-0', 'node-1']);
        expect(result.completionPercentage).toBe(50); // 2 of 4 required
      });

      it('should return 100% when all required nodes complete', () => {
        const path = createTestPath();
        const result = calculatePathProgress(path, ['node-0', 'node-1', 'node-2', 'node-3']);
        expect(result.completionPercentage).toBe(100);
        expect(result.optionalRemaining).toBe(1);
      });

      it('should calculate remaining time correctly', () => {
        const path = createTestPath();
        const result = calculatePathProgress(path, ['node-0']);
        // 3 required nodes remaining * 30 minutes each
        expect(result.estimatedMinutesRemaining).toBe(90);
      });
    });

    describe('getAvailableNodes', () => {
      it('should return first node when nothing completed', () => {
        const path = createTestPath();
        const available = getAvailableNodes(path, []);
        expect(available.length).toBe(1);
        expect(available[0].id).toBe('node-0');
      });

      it('should unlock next node after completing prerequisite', () => {
        const path = createTestPath();
        const available = getAvailableNodes(path, ['node-0']);
        expect(available.map(n => n.id)).toContain('node-1');
      });

      it('should not include already completed nodes', () => {
        const path = createTestPath();
        const available = getAvailableNodes(path, ['node-0']);
        expect(available.map(n => n.id)).not.toContain('node-0');
      });

      it('should not unlock node with unmet prerequisites', () => {
        const path = createTestPath();
        const available = getAvailableNodes(path, []);
        expect(available.map(n => n.id)).not.toContain('node-2');
      });

      it('should return empty when all nodes completed', () => {
        const path = createTestPath();
        const allNodes = path.nodes.map(n => n.id);
        const available = getAvailableNodes(path, allNodes);
        expect(available.length).toBe(0);
      });
    });

    describe('getNextRecommendedNode', () => {
      it('should return first available required node', () => {
        const path = createTestPath();
        const next = getNextRecommendedNode(path, [], {});
        expect(next?.id).toBe('node-0');
      });

      it('should prioritize required over optional nodes', () => {
        const path = createTestPath();
        // Complete all but last two (one required, one optional)
        const completed = ['node-0', 'node-1', 'node-2'];
        const next = getNextRecommendedNode(path, completed, {});
        expect(next?.id).toBe('node-3'); // Required comes first
        expect(next?.isOptional).toBe(false);
      });

      it('should return null when path is complete', () => {
        const path = createTestPath();
        const allNodes = path.nodes.map(n => n.id);
        const next = getNextRecommendedNode(path, allNodes, {});
        expect(next).toBeNull();
      });
    });
  });

  describe('Path Recommendations', () => {
    const createTestPaths = (): LearningPath[] => [
      {
        id: 'math-basics',
        title: 'Math Basics',
        description: 'Learn fundamental math concepts',
        gradeLevel: 5,
        difficulty: 'beginner',
        estimatedHours: 10,
        nodes: [],
        prerequisites: [],
        outcomes: ['Understand addition', 'Understand subtraction'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'algebra',
        title: 'Introduction to Algebra',
        description: 'Learn algebraic concepts',
        gradeLevel: 7,
        difficulty: 'intermediate',
        estimatedHours: 20,
        nodes: [],
        prerequisites: ['math-basics'],
        outcomes: ['Solve equations', 'Work with variables'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'science',
        title: 'General Science',
        description: 'Explore scientific concepts',
        gradeLevel: 5,
        difficulty: 'beginner',
        estimatedHours: 15,
        nodes: [],
        prerequisites: [],
        outcomes: ['Scientific method', 'Basic experiments'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    describe('calculatePathMatch', () => {
      it('should give higher score for matching grade level', () => {
        const paths = createTestPaths();
        const profile = {
          gradeLevel: 5,
          completedPaths: [],
          interests: [],
          strengths: [],
          weaknesses: [],
          currentMastery: {}
        };

        const mathScore = calculatePathMatch(paths[0], profile); // Grade 5
        const algebraScore = calculatePathMatch(paths[1], profile); // Grade 7

        expect(mathScore).toBeGreaterThan(algebraScore);
      });

      it('should penalize paths with unmet prerequisites', () => {
        const paths = createTestPaths();
        const profileWithPrereq = {
          gradeLevel: 7,
          completedPaths: ['math-basics'],
          interests: [],
          strengths: [],
          weaknesses: [],
          currentMastery: {}
        };
        const profileWithoutPrereq = {
          ...profileWithPrereq,
          completedPaths: []
        };

        const withPrereq = calculatePathMatch(paths[1], profileWithPrereq);
        const withoutPrereq = calculatePathMatch(paths[1], profileWithoutPrereq);

        expect(withPrereq).toBeGreaterThan(withoutPrereq);
      });

      it('should boost score for interest match', () => {
        const paths = createTestPaths();
        const profileWithInterest = {
          gradeLevel: 5,
          completedPaths: [],
          interests: ['math'],
          strengths: [],
          weaknesses: [],
          currentMastery: {}
        };
        const profileWithoutInterest = {
          ...profileWithInterest,
          interests: []
        };

        const withInterest = calculatePathMatch(paths[0], profileWithInterest);
        const withoutInterest = calculatePathMatch(paths[0], profileWithoutInterest);

        expect(withInterest).toBeGreaterThan(withoutInterest);
      });
    });

    describe('recommendPaths', () => {
      it('should return paths sorted by match score', () => {
        const paths = createTestPaths();
        const profile = {
          gradeLevel: 5,
          completedPaths: [],
          interests: ['math'],
          strengths: [],
          weaknesses: [],
          currentMastery: {}
        };

        const recommendations = recommendPaths(paths, profile, 3);

        expect(recommendations.length).toBeLessThanOrEqual(3);
        // Should be sorted by matchScore descending
        for (let i = 1; i < recommendations.length; i++) {
          expect(recommendations[i - 1].matchScore).toBeGreaterThanOrEqual(
            recommendations[i].matchScore
          );
        }
      });

      it('should exclude already completed paths', () => {
        const paths = createTestPaths();
        const profile = {
          gradeLevel: 5,
          completedPaths: ['math-basics'],
          interests: [],
          strengths: [],
          weaknesses: [],
          currentMastery: {}
        };

        const recommendations = recommendPaths(paths, profile);
        const pathIds = recommendations.map(r => r.path.id);

        expect(pathIds).not.toContain('math-basics');
      });

      it('should include prerequisite info', () => {
        const paths = createTestPaths();
        const profile = {
          gradeLevel: 7,
          completedPaths: [],
          interests: [],
          strengths: [],
          weaknesses: [],
          currentMastery: {}
        };

        const recommendations = recommendPaths(paths, profile);
        const algebraRec = recommendations.find(r => r.path.id === 'algebra');

        expect(algebraRec?.prerequisites.length).toBeGreaterThan(0);
        expect(algebraRec?.prerequisites[0].completed).toBe(false);
      });

      it('should generate appropriate reason text', () => {
        const paths = createTestPaths();
        const profile = {
          gradeLevel: 5,
          completedPaths: [],
          interests: ['math'],
          strengths: [],
          weaknesses: [],
          currentMastery: {}
        };

        const recommendations = recommendPaths(paths, profile);

        expect(recommendations[0].reason).toBeTruthy();
        expect(typeof recommendations[0].reason).toBe('string');
      });

      it('should estimate completion time', () => {
        const paths = createTestPaths();
        const profile = {
          gradeLevel: 5,
          completedPaths: [],
          interests: [],
          strengths: [],
          weaknesses: [],
          currentMastery: {}
        };

        const recommendations = recommendPaths(paths, profile);

        expect(recommendations[0].estimatedCompletion).toBeTruthy();
        expect(typeof recommendations[0].estimatedCompletion).toBe('string');
      });
    });
  });

  describe('Utility Functions', () => {
    describe('formatMasteryLevel', () => {
      it('should capitalize first letter', () => {
        expect(formatMasteryLevel('novice')).toBe('Novice');
        expect(formatMasteryLevel('beginner')).toBe('Beginner');
        expect(formatMasteryLevel('master')).toBe('Master');
      });
    });

    describe('getMasteryColor', () => {
      it('should return gray for novice', () => {
        expect(getMasteryColor('novice')).toBe('#6b7280');
      });

      it('should return blue for beginner', () => {
        expect(getMasteryColor('beginner')).toBe('#3b82f6');
      });

      it('should return green for intermediate', () => {
        expect(getMasteryColor('intermediate')).toBe('#10b981');
      });

      it('should return amber for proficient', () => {
        expect(getMasteryColor('proficient')).toBe('#f59e0b');
      });

      it('should return purple for expert', () => {
        expect(getMasteryColor('expert')).toBe('#8b5cf6');
      });

      it('should return red/gold for master', () => {
        expect(getMasteryColor('master')).toBe('#ef4444');
      });
    });

    describe('getMasteryBadge', () => {
      it('should return appropriate icons for each level', () => {
        expect(getMasteryBadge('novice')).toContain('bi-');
        expect(getMasteryBadge('beginner')).toContain('bi-');
        expect(getMasteryBadge('intermediate')).toContain('star');
        expect(getMasteryBadge('expert')).toContain('trophy');
        expect(getMasteryBadge('master')).toContain('trophy-fill');
      });
    });

    describe('estimateTimeToMastery', () => {
      it('should calculate sessions needed', () => {
        const result = estimateTimeToMastery(50, 'expert', 5);
        // Need 30 points (80-50), at 5 per session = 6 sessions
        expect(result.sessions).toBe(6);
      });

      it('should return 0 sessions if already at target', () => {
        const result = estimateTimeToMastery(95, 'expert', 5);
        expect(result.sessions).toBe(0);
      });

      it('should calculate estimated hours', () => {
        const result = estimateTimeToMastery(0, 'beginner', 5);
        // Need 20 points, at 5 per session = 4 sessions
        // 4 sessions * 0.5 hours = 2 hours
        expect(result.estimatedHours).toBe(2);
      });

      it('should handle fractional sessions by rounding up', () => {
        const result = estimateTimeToMastery(0, 'beginner', 7);
        // Need 20 points, at 7 per session = 2.86 sessions -> 3
        expect(result.sessions).toBe(3);
      });
    });
  });

  describe('Mastery Thresholds', () => {
    it('should have all levels defined', () => {
      expect(MASTERY_THRESHOLDS.novice).toBeDefined();
      expect(MASTERY_THRESHOLDS.beginner).toBeDefined();
      expect(MASTERY_THRESHOLDS.intermediate).toBeDefined();
      expect(MASTERY_THRESHOLDS.proficient).toBeDefined();
      expect(MASTERY_THRESHOLDS.expert).toBeDefined();
      expect(MASTERY_THRESHOLDS.master).toBeDefined();
    });

    it('should have increasing thresholds', () => {
      const levels: MasteryLevel[] = ['novice', 'beginner', 'intermediate', 'proficient', 'expert', 'master'];
      for (let i = 1; i < levels.length; i++) {
        expect(MASTERY_THRESHOLDS[levels[i]]).toBeGreaterThan(MASTERY_THRESHOLDS[levels[i - 1]]);
      }
    });

    it('should start at 0 and end at 95', () => {
      expect(MASTERY_THRESHOLDS.novice).toBe(0);
      expect(MASTERY_THRESHOLDS.master).toBe(95);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty path', () => {
      const emptyPath: LearningPath = {
        id: 'empty',
        title: 'Empty Path',
        description: '',
        difficulty: 'beginner',
        estimatedHours: 0,
        nodes: [],
        prerequisites: [],
        outcomes: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const progress = calculatePathProgress(emptyPath, []);
      expect(progress.completionPercentage).toBe(100); // No required nodes = complete

      const available = getAvailableNodes(emptyPath, []);
      expect(available.length).toBe(0);
    });

    it('should handle negative scores gracefully', () => {
      // Score calculation shouldn't produce negative but level should handle it
      const level = calculateMasteryLevel(-10);
      expect(level).toBe('novice');
    });

    it('should handle score above 100', () => {
      const level = calculateMasteryLevel(150);
      expect(level).toBe('master');
    });

    it('should handle circular prerequisites (by ignoring)', () => {
      const circularPath: LearningPath = {
        id: 'circular',
        title: 'Circular Path',
        description: '',
        difficulty: 'beginner',
        estimatedHours: 5,
        nodes: [
          {
            id: 'node-a',
            title: 'Node A',
            type: 'lesson',
            order: 0,
            estimatedMinutes: 30,
            pointsValue: 100,
            prerequisites: ['node-b'], // Circular!
            isOptional: false
          },
          {
            id: 'node-b',
            title: 'Node B',
            type: 'lesson',
            order: 1,
            estimatedMinutes: 30,
            pointsValue: 100,
            prerequisites: ['node-a'], // Circular!
            isOptional: false
          }
        ],
        prerequisites: [],
        outcomes: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Should return empty (no nodes available due to circular deps)
      const available = getAvailableNodes(circularPath, []);
      expect(available.length).toBe(0);
    });
  });
});
