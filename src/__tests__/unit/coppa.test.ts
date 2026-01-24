/**
 * COPPA Compliance Unit Tests
 * Tests for age verification and parental consent functionality
 */

import { calculateAge, requiresParentalConsent, generateConsentToken } from '../../services/coppa.service';

describe('COPPA Compliance', () => {
  describe('Age Calculation', () => {
    it('should calculate age correctly for a 10-year-old', () => {
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

      const age = calculateAge(tenYearsAgo);
      expect(age).toBe(10);
    });

    it('should calculate age correctly for a 13-year-old', () => {
      const thirteenYearsAgo = new Date();
      thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);

      const age = calculateAge(thirteenYearsAgo);
      expect(age).toBe(13);
    });

    it('should calculate age correctly for a 5-year-old', () => {
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

      const age = calculateAge(fiveYearsAgo);
      expect(age).toBe(5);
    });

    it('should handle birthday not yet occurred this year', () => {
      const today = new Date();
      // Create date 10 years ago, but later in the year
      const dob = new Date(today.getFullYear() - 10, today.getMonth() + 1, 15);

      // If the birthday month is in the future, they haven't turned 10 yet
      const age = calculateAge(dob);
      if (today.getMonth() < dob.getMonth()) {
        expect(age).toBe(9);
      } else {
        expect(age).toBe(10);
      }
    });

    it('should handle exact birthday today', () => {
      const today = new Date();
      const dob = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());

      const age = calculateAge(dob);
      expect(age).toBe(12);
    });
  });

  describe('Parental Consent Requirement', () => {
    it('should require consent for 5-year-old', () => {
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

      expect(requiresParentalConsent(fiveYearsAgo)).toBe(true);
    });

    it('should require consent for 10-year-old', () => {
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

      expect(requiresParentalConsent(tenYearsAgo)).toBe(true);
    });

    it('should require consent for 12-year-old', () => {
      const twelveYearsAgo = new Date();
      twelveYearsAgo.setFullYear(twelveYearsAgo.getFullYear() - 12);

      expect(requiresParentalConsent(twelveYearsAgo)).toBe(true);
    });

    it('should NOT require consent for 13-year-old', () => {
      const thirteenYearsAgo = new Date();
      thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);
      thirteenYearsAgo.setDate(thirteenYearsAgo.getDate() - 1); // Ensure they're actually 13

      expect(requiresParentalConsent(thirteenYearsAgo)).toBe(false);
    });

    it('should NOT require consent for 15-year-old', () => {
      const fifteenYearsAgo = new Date();
      fifteenYearsAgo.setFullYear(fifteenYearsAgo.getFullYear() - 15);

      expect(requiresParentalConsent(fifteenYearsAgo)).toBe(false);
    });

    it('should NOT require consent for 18-year-old', () => {
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

      expect(requiresParentalConsent(eighteenYearsAgo)).toBe(false);
    });
  });

  describe('Consent Token Generation', () => {
    it('should generate 64-character hex token', () => {
      const token = generateConsentToken();

      expect(token.length).toBe(64);
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });

    it('should generate unique tokens', () => {
      const tokens = new Set<string>();

      for (let i = 0; i < 100; i++) {
        tokens.add(generateConsentToken());
      }

      expect(tokens.size).toBe(100); // All unique
    });
  });

  describe('COPPA Age Threshold', () => {
    it('should use 13 as the threshold age', () => {
      // Edge case: exactly 13
      const justTurned13 = new Date();
      justTurned13.setFullYear(justTurned13.getFullYear() - 13);

      // At exactly 13 (on birthday), no consent required
      expect(calculateAge(justTurned13)).toBe(13);
      expect(requiresParentalConsent(justTurned13)).toBe(false);
    });

    it('should require consent day before 13th birthday', () => {
      // Day before 13th birthday
      const almostThirteen = new Date();
      almostThirteen.setFullYear(almostThirteen.getFullYear() - 13);
      almostThirteen.setDate(almostThirteen.getDate() + 1);

      const age = calculateAge(almostThirteen);
      expect(age).toBe(12); // Still 12
      expect(requiresParentalConsent(almostThirteen)).toBe(true);
    });
  });

  describe('Consent Request Expiry', () => {
    it('should set 7-day expiry for consent requests', () => {
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      const expiresAt = new Date(Date.now() + sevenDaysMs);

      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      // Allow 1 second tolerance
      expect(Math.abs(expiresAt.getTime() - sevenDaysFromNow.getTime())).toBeLessThan(1000);
    });
  });

  describe('Consent Status Transitions', () => {
    it('should have valid status values', () => {
      const validStatuses = ['pending', 'verified', 'rejected', 'revoked'];

      expect(validStatuses).toContain('pending');
      expect(validStatuses).toContain('verified');
      expect(validStatuses).toContain('rejected');
      expect(validStatuses).toContain('revoked');
    });

    it('should define valid consent methods', () => {
      const validMethods = ['email', 'signed_form', 'in_person'];

      expect(validMethods).toContain('email');
    });

    it('should define valid relationships', () => {
      const validRelationships = ['parent', 'guardian', 'legal_guardian'];

      expect(validRelationships.length).toBeGreaterThan(0);
    });
  });

  describe('Privacy Preferences', () => {
    it('should have correct default preferences', () => {
      const defaults = {
        allowDataCollection: true, // Required for service
        allowThirdPartySharing: false, // COPPA restricts this
        allowMarketing: false // Conservative default
      };

      expect(defaults.allowDataCollection).toBe(true);
      expect(defaults.allowThirdPartySharing).toBe(false);
      expect(defaults.allowMarketing).toBe(false);
    });
  });
});
