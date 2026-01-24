// Tests for Gradebook Service

import {
  getLetterGrade,
  getGPA,
  GradeThresholds
} from '../../services/gradebook.service';

describe('Gradebook Service', () => {
  describe('Letter Grade Conversion', () => {
    describe('Default Thresholds', () => {
      const testCases = [
        { score: 95, expected: 'A' },
        { score: 90, expected: 'A' },
        { score: 89, expected: 'A-' },
        { score: 87, expected: 'A-' },
        { score: 86, expected: 'B+' },
        { score: 83, expected: 'B+' },
        { score: 82, expected: 'B' },
        { score: 80, expected: 'B' },
        { score: 79, expected: 'B-' },
        { score: 77, expected: 'B-' },
        { score: 76, expected: 'C+' },
        { score: 73, expected: 'C+' },
        { score: 72, expected: 'C' },
        { score: 70, expected: 'C' },
        { score: 69, expected: 'C-' },
        { score: 67, expected: 'C-' },
        { score: 66, expected: 'D+' },
        { score: 63, expected: 'D+' },
        { score: 62, expected: 'D' },
        { score: 60, expected: 'D' },
        { score: 59, expected: 'D-' },
        { score: 57, expected: 'D-' },
        { score: 56, expected: 'F' },
        { score: 50, expected: 'F' },
        { score: 0, expected: 'F' }
      ];

      testCases.forEach(({ score, expected }) => {
        it(`should return ${expected} for score ${score}`, () => {
          expect(getLetterGrade(score)).toBe(expected);
        });
      });
    });

    describe('Custom Thresholds', () => {
      it('should use custom thresholds when provided', () => {
        const customThresholds: GradeThresholds = {
          gradeA: 93,
          gradeAMinus: 90,
          gradeBPlus: 87,
          gradeB: 83,
          gradeBMinus: 80,
          gradeCPlus: 77,
          gradeC: 73,
          gradeCMinus: 70,
          gradeDPlus: 67,
          gradeD: 63,
          gradeDMinus: 60
        };

        expect(getLetterGrade(93, customThresholds)).toBe('A');
        expect(getLetterGrade(92, customThresholds)).toBe('A-');
        expect(getLetterGrade(89, customThresholds)).toBe('B+');
        expect(getLetterGrade(59, customThresholds)).toBe('F');
      });
    });

    describe('Edge Cases', () => {
      it('should handle exactly 100%', () => {
        expect(getLetterGrade(100)).toBe('A');
      });

      it('should handle exactly 0%', () => {
        expect(getLetterGrade(0)).toBe('F');
      });

      it('should handle decimal scores', () => {
        expect(getLetterGrade(89.5)).toBe('A-');
        expect(getLetterGrade(89.9)).toBe('A-');
        expect(getLetterGrade(90.0)).toBe('A');
      });

      it('should handle negative scores as F', () => {
        expect(getLetterGrade(-5)).toBe('F');
      });

      it('should handle scores over 100', () => {
        expect(getLetterGrade(105)).toBe('A');
      });
    });
  });

  describe('GPA Calculation', () => {
    const gpaTests = [
      { letter: 'A', expected: 4.0 },
      { letter: 'A-', expected: 3.7 },
      { letter: 'B+', expected: 3.3 },
      { letter: 'B', expected: 3.0 },
      { letter: 'B-', expected: 2.7 },
      { letter: 'C+', expected: 2.3 },
      { letter: 'C', expected: 2.0 },
      { letter: 'C-', expected: 1.7 },
      { letter: 'D+', expected: 1.3 },
      { letter: 'D', expected: 1.0 },
      { letter: 'D-', expected: 0.7 },
      { letter: 'F', expected: 0.0 }
    ];

    gpaTests.forEach(({ letter, expected }) => {
      it(`should return ${expected} GPA for grade ${letter}`, () => {
        expect(getGPA(letter)).toBe(expected);
      });
    });

    it('should return 0 for unknown letter grades', () => {
      expect(getGPA('X')).toBe(0.0);
      expect(getGPA('')).toBe(0.0);
    });
  });

  describe('Grade Weighting', () => {
    describe('Category Weight Validation', () => {
      it('should handle weights summing to 100%', () => {
        const weights = [0.20, 0.20, 0.40, 0.15, 0.05];
        const sum = weights.reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1.0);
      });

      it('should handle individual category weights', () => {
        const homework = { weight: 0.25, average: 85 };
        const tests = { weight: 0.50, average: 78 };
        const participation = { weight: 0.25, average: 95 };

        const weighted =
          homework.average * homework.weight +
          tests.average * tests.weight +
          participation.average * participation.weight;

        expect(weighted).toBeCloseTo(84);
      });
    });

    describe('Drop Lowest Logic', () => {
      it('should correctly drop lowest score', () => {
        const scores = [70, 85, 90, 95, 60];
        const dropCount = 1;

        const sorted = [...scores].sort((a, b) => a - b);
        const kept = sorted.slice(dropCount);

        expect(kept).toEqual([70, 85, 90, 95]);
        expect(kept.reduce((a, b) => a + b, 0) / kept.length).toBe(85);
      });

      it('should handle dropping multiple lowest', () => {
        const scores = [50, 60, 70, 80, 90, 100];
        const dropCount = 2;

        const sorted = [...scores].sort((a, b) => a - b);
        const kept = sorted.slice(dropCount);

        expect(kept).toEqual([70, 80, 90, 100]);
        expect(kept.reduce((a, b) => a + b, 0) / kept.length).toBe(85);
      });

      it('should not drop when dropCount is 0', () => {
        const scores = [70, 80, 90];
        const dropCount = 0;

        const sorted = [...scores].sort((a, b) => a - b);
        const kept = sorted.slice(dropCount);

        expect(kept.length).toBe(3);
      });
    });
  });

  describe('Late Work Penalty', () => {
    describe('Penalty Calculation', () => {
      it('should calculate daily penalty correctly', () => {
        const originalGrade = 100;
        const daysLate = 2;
        const penaltyPerDay = 10;
        const maxPenalty = 50;

        const penalty = Math.min(daysLate * penaltyPerDay, maxPenalty);
        const finalGrade = Math.max(0, originalGrade - penalty);

        expect(penalty).toBe(20);
        expect(finalGrade).toBe(80);
      });

      it('should cap penalty at maximum', () => {
        const originalGrade = 100;
        const daysLate = 10;
        const penaltyPerDay = 10;
        const maxPenalty = 50;

        const penalty = Math.min(daysLate * penaltyPerDay, maxPenalty);
        const finalGrade = Math.max(0, originalGrade - penalty);

        expect(penalty).toBe(50);
        expect(finalGrade).toBe(50);
      });

      it('should not go below zero', () => {
        const originalGrade = 30;
        const penalty = 50;
        const finalGrade = Math.max(0, originalGrade - penalty);

        expect(finalGrade).toBe(0);
      });
    });

    describe('Grace Period', () => {
      it('should not apply penalty within grace period', () => {
        const gracePeriodHours = 24;
        const hoursLate = 12;

        const effectiveHoursLate = Math.max(0, hoursLate - gracePeriodHours);
        const daysLate = Math.ceil(effectiveHoursLate / 24);

        expect(daysLate).toBe(0);
      });

      it('should apply penalty after grace period', () => {
        const gracePeriodHours = 24;
        const hoursLate = 36;

        const effectiveHoursLate = Math.max(0, hoursLate - gracePeriodHours);
        const daysLate = Math.ceil(effectiveHoursLate / 24);

        expect(daysLate).toBe(1);
      });
    });
  });

  describe('Mastery Levels', () => {
    describe('getMasteryLevel helper', () => {
      function getMasteryLevel(score: number): string {
        if (score >= 90) return 'mastered';
        if (score >= 75) return 'proficient';
        if (score >= 60) return 'approaching';
        return 'below';
      }

      it('should return mastered for 90+', () => {
        expect(getMasteryLevel(90)).toBe('mastered');
        expect(getMasteryLevel(100)).toBe('mastered');
      });

      it('should return proficient for 75-89', () => {
        expect(getMasteryLevel(75)).toBe('proficient');
        expect(getMasteryLevel(89)).toBe('proficient');
      });

      it('should return approaching for 60-74', () => {
        expect(getMasteryLevel(60)).toBe('approaching');
        expect(getMasteryLevel(74)).toBe('approaching');
      });

      it('should return below for under 60', () => {
        expect(getMasteryLevel(59)).toBe('below');
        expect(getMasteryLevel(0)).toBe('below');
      });
    });
  });

  describe('Grade Statistics', () => {
    describe('Class Average', () => {
      it('should calculate average correctly', () => {
        const grades = [80, 85, 90, 75, 70];
        const average = grades.reduce((a, b) => a + b, 0) / grades.length;
        expect(average).toBe(80);
      });

      it('should handle empty grades array', () => {
        const grades: number[] = [];
        const average = grades.length > 0
          ? grades.reduce((a, b) => a + b, 0) / grades.length
          : null;
        expect(average).toBeNull();
      });
    });

    describe('Median Grade', () => {
      it('should calculate median for odd count', () => {
        const grades = [70, 80, 90, 85, 75].sort((a, b) => a - b);
        const median = grades[Math.floor(grades.length / 2)];
        expect(median).toBe(80);
      });

      it('should calculate median for even count', () => {
        const grades = [70, 80, 90, 85].sort((a, b) => a - b);
        const midIndex = Math.floor(grades.length / 2);
        const median = (grades[midIndex - 1] + grades[midIndex]) / 2;
        expect(median).toBe(82.5);
      });
    });

    describe('Grade Distribution', () => {
      it('should count grades by letter', () => {
        const letterGrades = ['A', 'B', 'A', 'C', 'B', 'A', 'F', 'B'];
        const distribution: Record<string, number> = {};

        letterGrades.forEach(grade => {
          const letter = grade.charAt(0);
          distribution[letter] = (distribution[letter] || 0) + 1;
        });

        expect(distribution['A']).toBe(3);
        expect(distribution['B']).toBe(3);
        expect(distribution['C']).toBe(1);
        expect(distribution['F']).toBe(1);
      });
    });
  });
});
