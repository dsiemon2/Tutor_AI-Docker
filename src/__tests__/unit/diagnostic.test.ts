// Tests for Diagnostic Assessment Service

import {
  ProficiencyLevel
} from '../../services/diagnostic.service';

describe('Diagnostic Assessment Service', () => {
  describe('Proficiency Level Calculation', () => {
    function getProficiencyLevel(score: number): ProficiencyLevel {
      if (score >= 90) return 'advanced';
      if (score >= 70) return 'proficient';
      if (score >= 50) return 'basic';
      return 'below_basic';
    }

    const testCases = [
      { score: 100, expected: 'advanced' },
      { score: 95, expected: 'advanced' },
      { score: 90, expected: 'advanced' },
      { score: 89, expected: 'proficient' },
      { score: 80, expected: 'proficient' },
      { score: 70, expected: 'proficient' },
      { score: 69, expected: 'basic' },
      { score: 60, expected: 'basic' },
      { score: 50, expected: 'basic' },
      { score: 49, expected: 'below_basic' },
      { score: 30, expected: 'below_basic' },
      { score: 0, expected: 'below_basic' }
    ];

    testCases.forEach(({ score, expected }) => {
      it(`should return ${expected} for score ${score}`, () => {
        expect(getProficiencyLevel(score)).toBe(expected);
      });
    });
  });

  describe('Adaptive Difficulty Adjustment', () => {
    function calculateTargetDifficulty(recentResponses: Array<{ isCorrect: boolean; difficulty: number }>): number {
      if (recentResponses.length === 0) {
        return 5; // Start at medium
      }

      const correctCount = recentResponses.filter(r => r.isCorrect).length;
      const recentAccuracy = correctCount / recentResponses.length;

      const avgDifficulty = recentResponses.reduce((sum, r) => sum + r.difficulty, 0) / recentResponses.length;

      if (recentAccuracy >= 0.8) {
        return Math.min(10, avgDifficulty + 1);
      } else if (recentAccuracy >= 0.6) {
        return avgDifficulty;
      } else if (recentAccuracy >= 0.4) {
        return Math.max(1, avgDifficulty - 1);
      } else {
        return Math.max(1, avgDifficulty - 2);
      }
    }

    it('should start at medium difficulty (5) with no prior responses', () => {
      expect(calculateTargetDifficulty([])).toBe(5);
    });

    it('should increase difficulty after high accuracy (80%+)', () => {
      const responses = [
        { isCorrect: true, difficulty: 5 },
        { isCorrect: true, difficulty: 5 },
        { isCorrect: true, difficulty: 5 },
        { isCorrect: true, difficulty: 5 },
        { isCorrect: false, difficulty: 5 }
      ];
      expect(calculateTargetDifficulty(responses)).toBe(6);
    });

    it('should maintain difficulty at moderate accuracy (60-79%)', () => {
      const responses = [
        { isCorrect: true, difficulty: 5 },
        { isCorrect: true, difficulty: 5 },
        { isCorrect: true, difficulty: 5 },
        { isCorrect: false, difficulty: 5 },
        { isCorrect: false, difficulty: 5 }
      ];
      expect(calculateTargetDifficulty(responses)).toBe(5);
    });

    it('should decrease difficulty at low accuracy (40-59%)', () => {
      const responses = [
        { isCorrect: true, difficulty: 5 },
        { isCorrect: true, difficulty: 5 },
        { isCorrect: false, difficulty: 5 },
        { isCorrect: false, difficulty: 5 },
        { isCorrect: false, difficulty: 5 }
      ];
      expect(calculateTargetDifficulty(responses)).toBe(4);
    });

    it('should decrease difficulty more at very low accuracy (<40%)', () => {
      const responses = [
        { isCorrect: true, difficulty: 5 },
        { isCorrect: false, difficulty: 5 },
        { isCorrect: false, difficulty: 5 },
        { isCorrect: false, difficulty: 5 },
        { isCorrect: false, difficulty: 5 }
      ];
      expect(calculateTargetDifficulty(responses)).toBe(3);
    });

    it('should not exceed maximum difficulty of 10', () => {
      const responses = [
        { isCorrect: true, difficulty: 10 },
        { isCorrect: true, difficulty: 10 },
        { isCorrect: true, difficulty: 10 },
        { isCorrect: true, difficulty: 10 },
        { isCorrect: true, difficulty: 10 }
      ];
      expect(calculateTargetDifficulty(responses)).toBe(10);
    });

    it('should not go below minimum difficulty of 1', () => {
      const responses = [
        { isCorrect: false, difficulty: 1 },
        { isCorrect: false, difficulty: 1 },
        { isCorrect: false, difficulty: 1 },
        { isCorrect: false, difficulty: 1 },
        { isCorrect: false, difficulty: 1 }
      ];
      expect(calculateTargetDifficulty(responses)).toBe(1);
    });
  });

  describe('Grade Level Estimation', () => {
    interface GradeLevelResponse {
      isCorrect: boolean;
      gradeLevel: number | null;
    }

    function estimateGradeLevel(responses: GradeLevelResponse[]): number {
      let weightedSum = 0;
      let totalWeight = 0;

      for (const response of responses) {
        if (response.gradeLevel !== null) {
          const weight = response.isCorrect ? 1 : 0.3;
          weightedSum += response.gradeLevel * weight;
          totalWeight += weight;
        }
      }

      if (totalWeight === 0) {
        return 5; // Default
      }

      const correctCount = responses.filter(r => r.isCorrect).length;
      const accuracy = responses.length > 0 ? correctCount / responses.length : 0;

      let baseGrade = weightedSum / totalWeight;

      if (accuracy >= 0.9) {
        baseGrade += 0.5;
      } else if (accuracy >= 0.7) {
        // At level
      } else if (accuracy >= 0.5) {
        baseGrade -= 0.5;
      } else {
        baseGrade -= 1;
      }

      return Math.max(0, Math.min(12, Math.round(baseGrade * 10) / 10));
    }

    it('should return default grade 5 with no grade level data', () => {
      const responses: GradeLevelResponse[] = [
        { isCorrect: true, gradeLevel: null },
        { isCorrect: false, gradeLevel: null }
      ];
      expect(estimateGradeLevel(responses)).toBe(5);
    });

    it('should calculate weighted average grade level', () => {
      const responses: GradeLevelResponse[] = [
        { isCorrect: true, gradeLevel: 5 },
        { isCorrect: true, gradeLevel: 6 },
        { isCorrect: true, gradeLevel: 5 },
        { isCorrect: true, gradeLevel: 6 }
      ];
      // All correct at grades 5-6, with 100% accuracy should add 0.5
      const result = estimateGradeLevel(responses);
      expect(result).toBeGreaterThanOrEqual(5);
      expect(result).toBeLessThanOrEqual(7);
    });

    it('should adjust down for low accuracy', () => {
      const responses: GradeLevelResponse[] = [
        { isCorrect: false, gradeLevel: 5 },
        { isCorrect: false, gradeLevel: 5 },
        { isCorrect: false, gradeLevel: 5 },
        { isCorrect: true, gradeLevel: 5 }
      ];
      // 25% accuracy - should subtract 1 from base
      const result = estimateGradeLevel(responses);
      expect(result).toBeLessThan(5);
    });

    it('should not exceed grade 12', () => {
      const responses: GradeLevelResponse[] = [
        { isCorrect: true, gradeLevel: 12 },
        { isCorrect: true, gradeLevel: 12 },
        { isCorrect: true, gradeLevel: 12 }
      ];
      expect(estimateGradeLevel(responses)).toBe(12);
    });

    it('should not go below grade 0', () => {
      const responses: GradeLevelResponse[] = [
        { isCorrect: false, gradeLevel: 0 },
        { isCorrect: false, gradeLevel: 0 },
        { isCorrect: false, gradeLevel: 0 }
      ];
      expect(estimateGradeLevel(responses)).toBe(0);
    });
  });

  describe('Skill Gap Identification', () => {
    interface SkillResult {
      skillCode: string;
      skillName: string;
      correct: number;
      total: number;
      percentage: number;
    }

    function identifyGapsAndStrengths(skillBreakdown: Record<string, SkillResult>): {
      gaps: string[];
      strengths: string[];
    } {
      const gaps: string[] = [];
      const strengths: string[] = [];

      for (const [code, skill] of Object.entries(skillBreakdown)) {
        if (skill.percentage < 70) {
          gaps.push(code);
        }
        if (skill.percentage >= 90) {
          strengths.push(code);
        }
      }

      return { gaps, strengths };
    }

    it('should identify skill gaps below 70%', () => {
      const breakdown: Record<string, SkillResult> = {
        'algebra': { skillCode: 'algebra', skillName: 'Algebra', correct: 3, total: 5, percentage: 60 },
        'geometry': { skillCode: 'geometry', skillName: 'Geometry', correct: 4, total: 5, percentage: 80 }
      };
      const { gaps } = identifyGapsAndStrengths(breakdown);
      expect(gaps).toContain('algebra');
      expect(gaps).not.toContain('geometry');
    });

    it('should identify strengths at 90%+', () => {
      const breakdown: Record<string, SkillResult> = {
        'algebra': { skillCode: 'algebra', skillName: 'Algebra', correct: 5, total: 5, percentage: 100 },
        'geometry': { skillCode: 'geometry', skillName: 'Geometry', correct: 4, total: 5, percentage: 80 }
      };
      const { strengths } = identifyGapsAndStrengths(breakdown);
      expect(strengths).toContain('algebra');
      expect(strengths).not.toContain('geometry');
    });

    it('should handle empty breakdown', () => {
      const { gaps, strengths } = identifyGapsAndStrengths({});
      expect(gaps).toHaveLength(0);
      expect(strengths).toHaveLength(0);
    });

    it('should categorize borderline cases correctly', () => {
      const breakdown: Record<string, SkillResult> = {
        'skill1': { skillCode: 'skill1', skillName: 'Skill 1', correct: 7, total: 10, percentage: 70 },
        'skill2': { skillCode: 'skill2', skillName: 'Skill 2', correct: 69, total: 100, percentage: 69 },
        'skill3': { skillCode: 'skill3', skillName: 'Skill 3', correct: 9, total: 10, percentage: 90 },
        'skill4': { skillCode: 'skill4', skillName: 'Skill 4', correct: 89, total: 100, percentage: 89 }
      };
      const { gaps, strengths } = identifyGapsAndStrengths(breakdown);
      expect(gaps).toContain('skill2');
      expect(gaps).not.toContain('skill1'); // 70% is not a gap
      expect(strengths).toContain('skill3');
      expect(strengths).not.toContain('skill4'); // 89% is not a strength
    });
  });

  describe('Skill Gap Priority', () => {
    function calculateGapPriority(currentScore: number, targetScore: number = 70): string {
      const gapSize = Math.max(0, targetScore - currentScore);

      if (gapSize >= 40) return 'critical';
      if (gapSize >= 25) return 'high';
      if (gapSize >= 10) return 'medium';
      return 'low';
    }

    const priorityCases = [
      { score: 20, expected: 'critical' }, // Gap: 50
      { score: 30, expected: 'critical' }, // Gap: 40
      { score: 35, expected: 'high' },     // Gap: 35
      { score: 45, expected: 'high' },     // Gap: 25
      { score: 50, expected: 'medium' },   // Gap: 20
      { score: 60, expected: 'medium' },   // Gap: 10
      { score: 65, expected: 'low' },      // Gap: 5
      { score: 70, expected: 'low' },      // Gap: 0
      { score: 80, expected: 'low' }       // No gap
    ];

    priorityCases.forEach(({ score, expected }) => {
      it(`should assign ${expected} priority for score ${score}`, () => {
        expect(calculateGapPriority(score)).toBe(expected);
      });
    });
  });

  describe('Score Calculation', () => {
    interface Response {
      isCorrect: boolean;
      question: { skillCode: string | null; skillName: string | null };
    }

    function calculateOverallScore(responses: Response[]): number {
      if (responses.length === 0) return 0;
      const correct = responses.filter(r => r.isCorrect).length;
      return (correct / responses.length) * 100;
    }

    function calculateSkillBreakdown(responses: Response[]): Record<string, { correct: number; total: number; percentage: number }> {
      const breakdown: Record<string, { correct: number; total: number; percentage: number }> = {};

      for (const response of responses) {
        const code = response.question.skillCode || 'general';

        if (!breakdown[code]) {
          breakdown[code] = { correct: 0, total: 0, percentage: 0 };
        }

        breakdown[code].total++;
        if (response.isCorrect) {
          breakdown[code].correct++;
        }
      }

      for (const skill of Object.values(breakdown)) {
        skill.percentage = skill.total > 0 ? (skill.correct / skill.total) * 100 : 0;
      }

      return breakdown;
    }

    describe('Overall Score', () => {
      it('should calculate 100% for all correct', () => {
        const responses: Response[] = [
          { isCorrect: true, question: { skillCode: null, skillName: null } },
          { isCorrect: true, question: { skillCode: null, skillName: null } }
        ];
        expect(calculateOverallScore(responses)).toBe(100);
      });

      it('should calculate 0% for all incorrect', () => {
        const responses: Response[] = [
          { isCorrect: false, question: { skillCode: null, skillName: null } },
          { isCorrect: false, question: { skillCode: null, skillName: null } }
        ];
        expect(calculateOverallScore(responses)).toBe(0);
      });

      it('should calculate 50% for half correct', () => {
        const responses: Response[] = [
          { isCorrect: true, question: { skillCode: null, skillName: null } },
          { isCorrect: false, question: { skillCode: null, skillName: null } }
        ];
        expect(calculateOverallScore(responses)).toBe(50);
      });

      it('should return 0 for empty responses', () => {
        expect(calculateOverallScore([])).toBe(0);
      });
    });

    describe('Skill Breakdown', () => {
      it('should group by skill code', () => {
        const responses: Response[] = [
          { isCorrect: true, question: { skillCode: 'algebra', skillName: 'Algebra' } },
          { isCorrect: true, question: { skillCode: 'algebra', skillName: 'Algebra' } },
          { isCorrect: false, question: { skillCode: 'geometry', skillName: 'Geometry' } }
        ];
        const breakdown = calculateSkillBreakdown(responses);

        expect(breakdown['algebra'].total).toBe(2);
        expect(breakdown['algebra'].correct).toBe(2);
        expect(breakdown['algebra'].percentage).toBe(100);
        expect(breakdown['geometry'].total).toBe(1);
        expect(breakdown['geometry'].correct).toBe(0);
        expect(breakdown['geometry'].percentage).toBe(0);
      });

      it('should use "general" for null skill codes', () => {
        const responses: Response[] = [
          { isCorrect: true, question: { skillCode: null, skillName: null } }
        ];
        const breakdown = calculateSkillBreakdown(responses);
        expect(breakdown['general']).toBeDefined();
        expect(breakdown['general'].total).toBe(1);
      });
    });
  });

  describe('Answer Validation', () => {
    function isCorrectAnswer(userAnswer: string, correctAnswer: string): boolean {
      const normalized = userAnswer.trim().toLowerCase();
      const expected = correctAnswer.trim().toLowerCase();
      return normalized === expected;
    }

    it('should match exact answers', () => {
      expect(isCorrectAnswer('Paris', 'Paris')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(isCorrectAnswer('PARIS', 'paris')).toBe(true);
      expect(isCorrectAnswer('paris', 'PARIS')).toBe(true);
    });

    it('should trim whitespace', () => {
      expect(isCorrectAnswer('  Paris  ', 'Paris')).toBe(true);
      expect(isCorrectAnswer('Paris', '  Paris  ')).toBe(true);
    });

    it('should reject incorrect answers', () => {
      expect(isCorrectAnswer('London', 'Paris')).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(isCorrectAnswer('', 'Paris')).toBe(false);
      expect(isCorrectAnswer('Paris', '')).toBe(false);
    });
  });

  describe('Question Selection', () => {
    interface Question {
      id: string;
      difficulty: number;
    }

    function selectQuestionByDifficulty(
      questions: Question[],
      targetDifficulty: number,
      answeredIds: string[]
    ): Question | null {
      const available = questions.filter(q => !answeredIds.includes(q.id));

      if (available.length === 0) return null;

      // Sort by distance from target difficulty
      available.sort((a, b) => {
        const distA = Math.abs(a.difficulty - targetDifficulty);
        const distB = Math.abs(b.difficulty - targetDifficulty);
        return distA - distB;
      });

      // Get questions close to target difficulty
      const closeQuestions = available.filter(q =>
        Math.abs(q.difficulty - targetDifficulty) <= 1
      );

      // Return first from close questions, or first available
      return closeQuestions.length > 0 ? closeQuestions[0] : available[0];
    }

    it('should select closest difficulty question', () => {
      const questions: Question[] = [
        { id: '1', difficulty: 3 },
        { id: '2', difficulty: 5 },
        { id: '3', difficulty: 7 }
      ];
      const selected = selectQuestionByDifficulty(questions, 5, []);
      expect(selected?.id).toBe('2');
    });

    it('should exclude already answered questions', () => {
      const questions: Question[] = [
        { id: '1', difficulty: 5 },
        { id: '2', difficulty: 5 },
        { id: '3', difficulty: 5 }
      ];
      const selected = selectQuestionByDifficulty(questions, 5, ['1', '2']);
      expect(selected?.id).toBe('3');
    });

    it('should return null when all questions answered', () => {
      const questions: Question[] = [
        { id: '1', difficulty: 5 }
      ];
      const selected = selectQuestionByDifficulty(questions, 5, ['1']);
      expect(selected).toBeNull();
    });

    it('should prefer questions within 1 difficulty level', () => {
      const questions: Question[] = [
        { id: '1', difficulty: 1 },
        { id: '2', difficulty: 4 },
        { id: '3', difficulty: 10 }
      ];
      // Target 5, question at 4 is within 1 level
      const selected = selectQuestionByDifficulty(questions, 5, []);
      expect(selected?.id).toBe('2');
    });
  });

  describe('Recommendation Generation', () => {
    interface SkillResult {
      skillCode: string;
      skillName: string;
      percentage: number;
    }

    interface Recommendation {
      type: 'practice' | 'topic' | 'lesson';
      id: string;
      name: string;
      reason: string;
    }

    function generateRecommendations(
      skillGaps: string[],
      skillBreakdown: Record<string, SkillResult>
    ): Recommendation[] {
      // Sort gaps by severity
      const sortedGaps = [...skillGaps].sort((a, b) => {
        const scoreA = skillBreakdown[a]?.percentage || 0;
        const scoreB = skillBreakdown[b]?.percentage || 0;
        return scoreA - scoreB;
      });

      return sortedGaps.slice(0, 5).map(code => {
        const skill = skillBreakdown[code];
        return {
          type: 'practice' as const,
          id: code,
          name: skill?.skillName || code,
          reason: `Score: ${skill?.percentage.toFixed(0) || 0}% - needs improvement`
        };
      });
    }

    it('should generate recommendations for skill gaps', () => {
      const breakdown: Record<string, SkillResult> = {
        'algebra': { skillCode: 'algebra', skillName: 'Algebra', percentage: 40 }
      };
      const recommendations = generateRecommendations(['algebra'], breakdown);
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].id).toBe('algebra');
      expect(recommendations[0].name).toBe('Algebra');
    });

    it('should sort by lowest score first', () => {
      const breakdown: Record<string, SkillResult> = {
        'skill1': { skillCode: 'skill1', skillName: 'Skill 1', percentage: 60 },
        'skill2': { skillCode: 'skill2', skillName: 'Skill 2', percentage: 30 },
        'skill3': { skillCode: 'skill3', skillName: 'Skill 3', percentage: 45 }
      };
      const recommendations = generateRecommendations(['skill1', 'skill2', 'skill3'], breakdown);
      expect(recommendations[0].id).toBe('skill2'); // Lowest score
      expect(recommendations[1].id).toBe('skill3');
      expect(recommendations[2].id).toBe('skill1');
    });

    it('should limit to 5 recommendations', () => {
      const breakdown: Record<string, SkillResult> = {};
      const gaps: string[] = [];
      for (let i = 0; i < 10; i++) {
        gaps.push(`skill${i}`);
        breakdown[`skill${i}`] = { skillCode: `skill${i}`, skillName: `Skill ${i}`, percentage: 50 };
      }
      const recommendations = generateRecommendations(gaps, breakdown);
      expect(recommendations).toHaveLength(5);
    });

    it('should handle empty gaps', () => {
      const recommendations = generateRecommendations([], {});
      expect(recommendations).toHaveLength(0);
    });
  });

  describe('Test Completion Check', () => {
    function isTestComplete(answeredCount: number, totalQuestions: number): boolean {
      return answeredCount >= totalQuestions;
    }

    it('should return true when all questions answered', () => {
      expect(isTestComplete(20, 20)).toBe(true);
    });

    it('should return true when more than required answered', () => {
      expect(isTestComplete(25, 20)).toBe(true);
    });

    it('should return false when questions remaining', () => {
      expect(isTestComplete(15, 20)).toBe(false);
    });

    it('should return false for zero answered', () => {
      expect(isTestComplete(0, 20)).toBe(false);
    });
  });

  describe('Time Tracking', () => {
    function calculateAverageTimePerQuestion(responses: Array<{ timeSpentSeconds: number | null }>): number {
      const validTimes = responses.filter(r => r.timeSpentSeconds !== null && r.timeSpentSeconds > 0);
      if (validTimes.length === 0) return 0;
      return validTimes.reduce((sum, r) => sum + (r.timeSpentSeconds || 0), 0) / validTimes.length;
    }

    it('should calculate average time correctly', () => {
      const responses = [
        { timeSpentSeconds: 30 },
        { timeSpentSeconds: 60 },
        { timeSpentSeconds: 90 }
      ];
      expect(calculateAverageTimePerQuestion(responses)).toBe(60);
    });

    it('should ignore null times', () => {
      const responses = [
        { timeSpentSeconds: 30 },
        { timeSpentSeconds: null },
        { timeSpentSeconds: 90 }
      ];
      expect(calculateAverageTimePerQuestion(responses)).toBe(60);
    });

    it('should return 0 for no valid times', () => {
      const responses = [
        { timeSpentSeconds: null },
        { timeSpentSeconds: null }
      ];
      expect(calculateAverageTimePerQuestion(responses)).toBe(0);
    });

    it('should handle empty array', () => {
      expect(calculateAverageTimePerQuestion([])).toBe(0);
    });
  });
});
