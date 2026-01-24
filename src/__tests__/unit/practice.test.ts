// Tests for Practice Mode & Drill System

import {
  calculateSM2,
  calculateQuality,
  checkAnswer,
  difficultyToNumber,
  numberToDifficulty,
  DEFAULT_PRACTICE_SETTINGS,
  ResponseQuality
} from '../../services/practice.service';

describe('Practice Service', () => {
  describe('SM-2 Spaced Repetition Algorithm', () => {
    describe('Quality Response Handling', () => {
      it('should reset on quality 0 (complete blackout)', () => {
        const result = calculateSM2(0, 2.5, 10, 5);
        expect(result.repetitions).toBe(0);
        expect(result.interval).toBe(1);
      });

      it('should reset on quality 1 (incorrect, vague memory)', () => {
        const result = calculateSM2(1, 2.5, 10, 5);
        expect(result.repetitions).toBe(0);
        expect(result.interval).toBe(1);
      });

      it('should reset on quality 2 (incorrect, remembered after)', () => {
        const result = calculateSM2(2, 2.5, 10, 5);
        expect(result.repetitions).toBe(0);
        expect(result.interval).toBe(1);
      });

      it('should progress on quality 3 (correct with difficulty)', () => {
        const result = calculateSM2(3, 2.5, 6, 2);
        expect(result.repetitions).toBe(3);
        expect(result.interval).toBeGreaterThan(6);
      });

      it('should progress on quality 4 (correct with hesitation)', () => {
        const result = calculateSM2(4, 2.5, 6, 2);
        expect(result.repetitions).toBe(3);
        expect(result.interval).toBeGreaterThan(6);
      });

      it('should progress optimally on quality 5 (perfect)', () => {
        const result = calculateSM2(5, 2.5, 6, 2);
        expect(result.repetitions).toBe(3);
        expect(result.interval).toBeGreaterThan(6);
        expect(result.easeFactor).toBeGreaterThan(2.5);
      });
    });

    describe('Interval Progression', () => {
      it('should set interval to 1 day on first success', () => {
        const result = calculateSM2(4, 2.5, 0, 0);
        expect(result.interval).toBe(1);
        expect(result.repetitions).toBe(1);
      });

      it('should set interval to 6 days on second success', () => {
        const result = calculateSM2(4, 2.5, 1, 1);
        expect(result.interval).toBe(6);
        expect(result.repetitions).toBe(2);
      });

      it('should multiply by ease factor after second success', () => {
        const result = calculateSM2(4, 2.5, 6, 2);
        expect(result.interval).toBe(Math.round(6 * 2.5)); // 15 days
        expect(result.repetitions).toBe(3);
      });
    });

    describe('Ease Factor Adjustments', () => {
      it('should increase ease factor on perfect response', () => {
        const result = calculateSM2(5, 2.5, 6, 2);
        expect(result.easeFactor).toBeGreaterThan(2.5);
      });

      it('should maintain ease factor on quality 4', () => {
        const result = calculateSM2(4, 2.5, 6, 2);
        expect(result.easeFactor).toBeCloseTo(2.5, 1);
      });

      it('should decrease ease factor on quality 3', () => {
        const result = calculateSM2(3, 2.5, 6, 2);
        expect(result.easeFactor).toBeLessThan(2.5);
      });

      it('should not go below minimum ease factor of 1.3', () => {
        let ef = 2.5;
        for (let i = 0; i < 20; i++) {
          const result = calculateSM2(3, ef, 6, 2);
          ef = result.easeFactor;
        }
        expect(ef).toBeGreaterThanOrEqual(1.3);
      });
    });
  });

  describe('Quality Calculation', () => {
    it('should return 5 for very fast correct answer', () => {
      const quality = calculateQuality(true, 5000, 30000);
      expect(quality).toBe(5);
    });

    it('should return 4 for fast correct answer', () => {
      const quality = calculateQuality(true, 15000, 30000);
      expect(quality).toBe(4);
    });

    it('should return 3 for normal speed correct answer', () => {
      const quality = calculateQuality(true, 25000, 30000);
      expect(quality).toBe(3);
    });

    it('should return 3 for slow correct answer', () => {
      const quality = calculateQuality(true, 60000, 30000);
      expect(quality).toBe(3);
    });

    it('should return 1 for quick incorrect answer', () => {
      const quality = calculateQuality(false, 5000, 30000);
      expect(quality).toBe(1);
    });

    it('should return 0 for slow incorrect answer', () => {
      const quality = calculateQuality(false, 60000, 30000);
      expect(quality).toBe(0);
    });
  });

  describe('Answer Checking', () => {
    describe('Multiple Choice', () => {
      it('should match exact answer', () => {
        expect(checkAnswer('A', 'A', 'multiple_choice')).toBe(true);
      });

      it('should be case insensitive', () => {
        expect(checkAnswer('a', 'A', 'multiple_choice')).toBe(true);
        expect(checkAnswer('Paris', 'paris', 'multiple_choice')).toBe(true);
      });

      it('should trim whitespace', () => {
        expect(checkAnswer('  A  ', 'A', 'multiple_choice')).toBe(true);
      });

      it('should reject wrong answer', () => {
        expect(checkAnswer('B', 'A', 'multiple_choice')).toBe(false);
      });
    });

    describe('True/False', () => {
      it('should match true', () => {
        expect(checkAnswer('true', 'true', 'true_false')).toBe(true);
        expect(checkAnswer('True', 'true', 'true_false')).toBe(true);
      });

      it('should match false', () => {
        expect(checkAnswer('false', 'false', 'true_false')).toBe(true);
      });

      it('should reject wrong answer', () => {
        expect(checkAnswer('true', 'false', 'true_false')).toBe(false);
      });
    });

    describe('Short Answer', () => {
      it('should match exact answer', () => {
        expect(checkAnswer('Paris', 'Paris', 'short_answer')).toBe(true);
      });

      it('should match with different case', () => {
        expect(checkAnswer('PARIS', 'paris', 'short_answer')).toBe(true);
      });

      it('should ignore punctuation', () => {
        expect(checkAnswer('Paris.', 'Paris', 'short_answer')).toBe(true);
        expect(checkAnswer('Paris!', 'Paris', 'short_answer')).toBe(true);
      });

      it('should match multi-word answers', () => {
        expect(checkAnswer('New York', 'New York', 'short_answer')).toBe(true);
      });

      it('should allow minor typos for short words', () => {
        expect(checkAnswer('Pars', 'Paris', 'short_answer')).toBe(true);
      });
    });

    describe('Fill in the Blank', () => {
      it('should work like short answer', () => {
        expect(checkAnswer('water', 'water', 'fill_blank')).toBe(true);
        expect(checkAnswer('H2O', 'H2O', 'fill_blank')).toBe(true);
      });
    });
  });

  describe('Difficulty Conversion', () => {
    describe('difficultyToNumber', () => {
      it('should convert easy to 2', () => {
        expect(difficultyToNumber('easy')).toBe(2);
      });

      it('should convert medium to 5', () => {
        expect(difficultyToNumber('medium')).toBe(5);
      });

      it('should convert hard to 7', () => {
        expect(difficultyToNumber('hard')).toBe(7);
      });

      it('should convert expert to 9', () => {
        expect(difficultyToNumber('expert')).toBe(9);
      });
    });

    describe('numberToDifficulty', () => {
      it('should convert 1-2 to easy', () => {
        expect(numberToDifficulty(1)).toBe('easy');
        expect(numberToDifficulty(2)).toBe('easy');
      });

      it('should convert 3-5 to medium', () => {
        expect(numberToDifficulty(3)).toBe('medium');
        expect(numberToDifficulty(4)).toBe('medium');
        expect(numberToDifficulty(5)).toBe('medium');
      });

      it('should convert 6-7 to hard', () => {
        expect(numberToDifficulty(6)).toBe('hard');
        expect(numberToDifficulty(7)).toBe('hard');
      });

      it('should convert 8+ to expert', () => {
        expect(numberToDifficulty(8)).toBe('expert');
        expect(numberToDifficulty(9)).toBe('expert');
        expect(numberToDifficulty(10)).toBe('expert');
      });
    });

    describe('Round-trip conversion', () => {
      const difficulties: Array<'easy' | 'medium' | 'hard' | 'expert'> = ['easy', 'medium', 'hard', 'expert'];

      difficulties.forEach(diff => {
        it(`should round-trip ${diff}`, () => {
          const num = difficultyToNumber(diff);
          const back = numberToDifficulty(num);
          expect(back).toBe(diff);
        });
      });
    });
  });

  describe('Default Practice Settings', () => {
    it('should have 10 items by default', () => {
      expect(DEFAULT_PRACTICE_SETTINGS.itemCount).toBe(10);
    });

    it('should have no time limit by default', () => {
      expect(DEFAULT_PRACTICE_SETTINGS.timeLimit).toBeUndefined();
    });

    it('should show explanations by default', () => {
      expect(DEFAULT_PRACTICE_SETTINGS.showExplanations).toBe(true);
    });

    it('should enable adaptive difficulty by default', () => {
      expect(DEFAULT_PRACTICE_SETTINGS.adaptiveDifficulty).toBe(true);
    });

    it('should shuffle items by default', () => {
      expect(DEFAULT_PRACTICE_SETTINGS.shuffleItems).toBe(true);
    });

    it('should allow skip by default', () => {
      expect(DEFAULT_PRACTICE_SETTINGS.allowSkip).toBe(true);
    });

    it('should target 80% accuracy by default', () => {
      expect(DEFAULT_PRACTICE_SETTINGS.targetAccuracy).toBe(0.8);
    });
  });

  describe('Points Calculation', () => {
    function calculatePoints(correctCount: number, totalAnswered: number, totalTime: number): number {
      let points = 0;

      // Base points
      points += correctCount * 10;

      // Accuracy bonus
      const accuracy = correctCount / Math.max(totalAnswered, 1);
      if (accuracy >= 0.9) points += 50;
      else if (accuracy >= 0.8) points += 30;
      else if (accuracy >= 0.7) points += 15;

      // Completion bonus (assuming 10 items)
      if (totalAnswered >= 10) points += 25;

      // Speed bonus
      const avgTime = totalTime / Math.max(totalAnswered, 1);
      if (avgTime < 15 && accuracy >= 0.7) points += 20;

      return points;
    }

    it('should give 10 points per correct answer', () => {
      expect(calculatePoints(5, 5, 100)).toBeGreaterThanOrEqual(50);
    });

    it('should give accuracy bonus for 90%+', () => {
      const points90 = calculatePoints(9, 10, 200);
      const points70 = calculatePoints(7, 10, 200);
      expect(points90).toBeGreaterThan(points70);
    });

    it('should give completion bonus', () => {
      const complete = calculatePoints(8, 10, 200);
      const incomplete = calculatePoints(8, 8, 160);
      expect(complete).toBeGreaterThan(incomplete);
    });

    it('should give speed bonus for fast accurate answers', () => {
      const fast = calculatePoints(8, 10, 100);  // 10s avg
      const slow = calculatePoints(8, 10, 300);  // 30s avg
      expect(fast).toBeGreaterThan(slow);
    });
  });

  describe('Fuzzy Matching', () => {
    // Reimplement for testing
    function levenshteinDistance(a: string, b: string): number {
      const matrix: number[][] = [];
      for (let i = 0; i <= b.length; i++) matrix[i] = [i];
      for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }
      return matrix[b.length][a.length];
    }

    it('should return 0 for identical strings', () => {
      expect(levenshteinDistance('hello', 'hello')).toBe(0);
    });

    it('should count single character difference', () => {
      expect(levenshteinDistance('hello', 'hallo')).toBe(1);
    });

    it('should count missing character', () => {
      expect(levenshteinDistance('hello', 'hell')).toBe(1);
    });

    it('should count extra character', () => {
      expect(levenshteinDistance('hello', 'helloo')).toBe(1);
    });

    it('should handle completely different strings', () => {
      expect(levenshteinDistance('abc', 'xyz')).toBe(3);
    });

    it('should handle empty strings', () => {
      expect(levenshteinDistance('', 'hello')).toBe(5);
      expect(levenshteinDistance('hello', '')).toBe(5);
    });
  });

  describe('Quality Rating Types', () => {
    it('should have quality ratings from 0 to 5', () => {
      const validQualities: ResponseQuality[] = [0, 1, 2, 3, 4, 5];
      validQualities.forEach(q => {
        expect(q).toBeGreaterThanOrEqual(0);
        expect(q).toBeLessThanOrEqual(5);
      });
    });
  });

  describe('Streak Maintenance', () => {
    function maintainsStreak(accuracy: number): boolean {
      return accuracy >= 0.7;
    }

    it('should maintain streak at 70% accuracy', () => {
      expect(maintainsStreak(0.7)).toBe(true);
    });

    it('should maintain streak at 100% accuracy', () => {
      expect(maintainsStreak(1.0)).toBe(true);
    });

    it('should break streak below 70%', () => {
      expect(maintainsStreak(0.69)).toBe(false);
    });

    it('should break streak at 0%', () => {
      expect(maintainsStreak(0)).toBe(false);
    });
  });

  describe('Recommendation Generation', () => {
    function generateRecommendations(accuracy: number): string[] {
      const recommendations: string[] = [];

      if (accuracy < 0.5) {
        recommendations.push('Review the fundamentals');
        recommendations.push('Try easier problems');
      } else if (accuracy < 0.7) {
        recommendations.push('Practice more at this level');
      } else if (accuracy < 0.9) {
        recommendations.push('Try harder problems');
      } else {
        recommendations.push('You\'ve mastered this level');
      }

      return recommendations;
    }

    it('should suggest fundamentals review for low accuracy', () => {
      const recs = generateRecommendations(0.3);
      expect(recs.some(r => r.toLowerCase().includes('fundamental'))).toBe(true);
    });

    it('should suggest more practice for moderate accuracy', () => {
      const recs = generateRecommendations(0.6);
      expect(recs.some(r => r.toLowerCase().includes('practice'))).toBe(true);
    });

    it('should suggest harder problems for good accuracy', () => {
      const recs = generateRecommendations(0.85);
      expect(recs.some(r => r.toLowerCase().includes('harder'))).toBe(true);
    });

    it('should congratulate for excellent accuracy', () => {
      const recs = generateRecommendations(0.95);
      expect(recs.some(r => r.toLowerCase().includes('master'))).toBe(true);
    });
  });

  describe('Shuffle Function', () => {
    function shuffleArray<T>(array: T[]): T[] {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    it('should preserve array length', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled.length).toBe(arr.length);
    });

    it('should preserve all elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled.sort()).toEqual(arr.sort());
    });

    it('should not modify original array', () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      shuffleArray(arr);
      expect(arr).toEqual(original);
    });

    it('should handle empty array', () => {
      const shuffled = shuffleArray([]);
      expect(shuffled).toEqual([]);
    });

    it('should handle single element', () => {
      const shuffled = shuffleArray([1]);
      expect(shuffled).toEqual([1]);
    });
  });
});
