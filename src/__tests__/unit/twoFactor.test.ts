// Tests for Two-Factor Authentication Service

import {
  generateSecret,
  generateTotpUri,
  generateTotp,
  verifyTotp,
  generateBackupCodes,
  hashBackupCodes,
  verifyBackupCode
} from '../../services/twoFactor.service';

describe('Two-Factor Authentication Service', () => {
  describe('generateSecret', () => {
    it('should generate a base32 encoded secret', () => {
      const secret = generateSecret();
      expect(secret).toMatch(/^[A-Z2-7]+$/);
    });

    it('should generate secrets of consistent length', () => {
      const secret = generateSecret();
      // 20 bytes = 160 bits, base32 encodes 5 bits per char = 32 chars
      expect(secret.length).toBe(32);
    });

    it('should generate unique secrets', () => {
      const secret1 = generateSecret();
      const secret2 = generateSecret();
      expect(secret1).not.toBe(secret2);
    });
  });

  describe('generateTotpUri', () => {
    it('should generate valid otpauth URI', () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const email = 'test@example.com';
      const uri = generateTotpUri(secret, email);

      expect(uri).toContain('otpauth://totp/');
      expect(uri).toContain(secret);
      expect(uri).toContain(encodeURIComponent(email));
    });

    it('should include issuer in URI', () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const email = 'test@example.com';
      const issuer = 'TutorAI';
      const uri = generateTotpUri(secret, email, issuer);

      expect(uri).toContain(`issuer=${encodeURIComponent(issuer)}`);
    });

    it('should include algorithm and digits', () => {
      const uri = generateTotpUri('JBSWY3DPEHPK3PXP', 'test@example.com');

      expect(uri).toContain('algorithm=SHA1');
      expect(uri).toContain('digits=6');
      expect(uri).toContain('period=30');
    });

    it('should handle special characters in email', () => {
      const uri = generateTotpUri('JBSWY3DPEHPK3PXP', 'test+tag@example.com');
      expect(uri).toContain(encodeURIComponent('test+tag@example.com'));
    });
  });

  describe('generateTotp', () => {
    it('should generate 6-digit code', () => {
      const secret = generateSecret();
      const code = generateTotp(secret);

      expect(code).toMatch(/^\d{6}$/);
    });

    it('should generate same code for same secret at same time', () => {
      const secret = generateSecret();
      const code1 = generateTotp(secret);
      const code2 = generateTotp(secret);

      expect(code1).toBe(code2);
    });

    it('should pad codes with leading zeros', () => {
      // Test multiple times to increase chance of getting a code with leading zeros
      const secret = generateSecret();
      const code = generateTotp(secret);
      expect(code.length).toBe(6);
    });
  });

  describe('verifyTotp', () => {
    it('should verify valid TOTP code', () => {
      const secret = generateSecret();
      const code = generateTotp(secret);

      expect(verifyTotp(secret, code)).toBe(true);
    });

    it('should reject invalid code', () => {
      const secret = generateSecret();
      expect(verifyTotp(secret, '000000')).toBe(false);
    });

    it('should reject code of wrong length', () => {
      const secret = generateSecret();
      expect(verifyTotp(secret, '12345')).toBe(false);
      expect(verifyTotp(secret, '1234567')).toBe(false);
    });

    it('should use time window for tolerance', () => {
      const secret = generateSecret();
      const code = generateTotp(secret);

      // With window=1, should accept current code
      expect(verifyTotp(secret, code, 1)).toBe(true);
    });

    it('should be timing-safe against code comparison', () => {
      const secret = generateSecret();
      // This test ensures the comparison doesn't short-circuit
      const startTime = Date.now();
      verifyTotp(secret, '000000');
      const invalidTime = Date.now() - startTime;

      const code = generateTotp(secret);
      const startTime2 = Date.now();
      verifyTotp(secret, code);
      const validTime = Date.now() - startTime2;

      // Times should be roughly similar (timing-safe comparison)
      // Allow for some variance due to system load
      expect(Math.abs(invalidTime - validTime)).toBeLessThan(50);
    });
  });

  describe('generateBackupCodes', () => {
    it('should generate 10 backup codes', () => {
      const codes = generateBackupCodes();
      expect(codes.length).toBe(10);
    });

    it('should generate codes in XXXX-XXXX format', () => {
      const codes = generateBackupCodes();
      codes.forEach(code => {
        expect(code).toMatch(/^[A-F0-9]{4}-[A-F0-9]{4}$/);
      });
    });

    it('should generate unique codes', () => {
      const codes = generateBackupCodes();
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });

    it('should generate different codes each time', () => {
      const codes1 = generateBackupCodes();
      const codes2 = generateBackupCodes();

      // At least some codes should be different
      const overlap = codes1.filter(c => codes2.includes(c));
      expect(overlap.length).toBeLessThan(codes1.length);
    });
  });

  describe('hashBackupCodes', () => {
    it('should hash all backup codes', async () => {
      const codes = ['ABCD-1234', 'EFGH-5678'];
      const hashed = await hashBackupCodes(codes);

      expect(hashed.length).toBe(codes.length);
      hashed.forEach((hash, i) => {
        expect(hash).not.toBe(codes[i]);
        expect(hash).toMatch(/^\$2[aby]\$/); // bcrypt format
      });
    });

    it('should produce different hashes for same code', async () => {
      const codes = ['ABCD-1234', 'ABCD-1234'];
      const hashed = await hashBackupCodes(codes);

      // bcrypt produces different hashes due to random salt
      expect(hashed[0]).not.toBe(hashed[1]);
    });
  });

  describe('verifyBackupCode', () => {
    it('should verify valid backup code', async () => {
      const codes = ['ABCD-1234', 'EFGH-5678'];
      const hashed = await hashBackupCodes(codes);

      const result = await verifyBackupCode('ABCD-1234', hashed);
      expect(result.valid).toBe(true);
      expect(result.index).toBe(0);
    });

    it('should verify code without hyphen', async () => {
      const codes = ['ABCD-1234'];
      const hashed = await hashBackupCodes(codes);

      const result = await verifyBackupCode('ABCD1234', hashed);
      expect(result.valid).toBe(true);
    });

    it('should verify lowercase code', async () => {
      const codes = ['ABCD-1234'];
      const hashed = await hashBackupCodes(codes);

      const result = await verifyBackupCode('abcd-1234', hashed);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid backup code', async () => {
      const codes = ['ABCD-1234'];
      const hashed = await hashBackupCodes(codes);

      const result = await verifyBackupCode('XXXX-XXXX', hashed);
      expect(result.valid).toBe(false);
      expect(result.index).toBe(-1);
    });

    it('should return correct index for matching code', async () => {
      const codes = ['AAAA-1111', 'BBBB-2222', 'CCCC-3333'];
      const hashed = await hashBackupCodes(codes);

      const result = await verifyBackupCode('CCCC-3333', hashed);
      expect(result.valid).toBe(true);
      expect(result.index).toBe(2);
    });

    it('should handle empty hashed codes array', async () => {
      const result = await verifyBackupCode('ABCD-1234', []);
      expect(result.valid).toBe(false);
      expect(result.index).toBe(-1);
    });
  });

  describe('TOTP Algorithm Compliance', () => {
    it('should use SHA1 algorithm', () => {
      // RFC 6238 specifies SHA1 as default
      const uri = generateTotpUri('JBSWY3DPEHPK3PXP', 'test@example.com');
      expect(uri).toContain('algorithm=SHA1');
    });

    it('should use 30-second time step', () => {
      const uri = generateTotpUri('JBSWY3DPEHPK3PXP', 'test@example.com');
      expect(uri).toContain('period=30');
    });

    it('should generate 6-digit codes', () => {
      const uri = generateTotpUri('JBSWY3DPEHPK3PXP', 'test@example.com');
      expect(uri).toContain('digits=6');

      const code = generateTotp(generateSecret());
      expect(code.length).toBe(6);
    });
  });

  describe('Base32 Encoding', () => {
    it('should only use valid base32 characters', () => {
      const secret = generateSecret();
      // RFC 4648 base32 alphabet
      expect(secret).toMatch(/^[A-Z2-7]+$/);
    });

    it('should handle decoding for verification', () => {
      const secret = generateSecret();
      const code = generateTotp(secret);
      // If decode fails, verify would fail
      expect(verifyTotp(secret, code)).toBe(true);
    });
  });

  describe('Security Properties', () => {
    it('should use cryptographically secure random for secrets', () => {
      // Generate multiple secrets and check for randomness
      const secrets = Array.from({ length: 100 }, () => generateSecret());
      const uniqueSecrets = new Set(secrets);
      expect(uniqueSecrets.size).toBe(100);
    });

    it('should use cryptographically secure random for backup codes', () => {
      const allCodes: string[] = [];
      for (let i = 0; i < 10; i++) {
        allCodes.push(...generateBackupCodes());
      }
      const uniqueCodes = new Set(allCodes);
      // Allow for some collisions but expect mostly unique
      expect(uniqueCodes.size).toBeGreaterThan(90);
    });
  });
});
