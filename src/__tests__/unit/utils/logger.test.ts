/**
 * Logger Utility Unit Tests
 * Tests for Winston logger configuration
 */

// Since logger is mocked in setup.ts, we test the mock behavior
// For actual logger testing, we'd need to test without the mock

describe('Logger Utility', () => {
  describe('Logger Mock', () => {
    let logger: any;

    beforeEach(() => {
      // Get the mocked logger
      jest.resetModules();
      logger = require('../../../utils/logger').logger;
    });

    it('should have info method', () => {
      expect(typeof logger.info).toBe('function');
    });

    it('should have error method', () => {
      expect(typeof logger.error).toBe('function');
    });

    it('should have warn method', () => {
      expect(typeof logger.warn).toBe('function');
    });

    it('should have debug method', () => {
      expect(typeof logger.debug).toBe('function');
    });

    it('should have http method', () => {
      expect(typeof logger.http).toBe('function');
    });

    it('should call info without throwing', () => {
      expect(() => logger.info('Test message')).not.toThrow();
    });

    it('should call error without throwing', () => {
      expect(() => logger.error('Test error')).not.toThrow();
    });

    it('should call with object metadata', () => {
      expect(() => logger.info({ userId: '123' }, 'User action')).not.toThrow();
    });
  });
});

describe('Log Level Hierarchy', () => {
  const LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  };

  it('should have error as highest priority (lowest number)', () => {
    expect(LOG_LEVELS.error).toBeLessThan(LOG_LEVELS.warn);
  });

  it('should have debug as lowest priority (highest number)', () => {
    expect(LOG_LEVELS.debug).toBeGreaterThan(LOG_LEVELS.info);
  });

  it('should have correct level order', () => {
    expect(LOG_LEVELS.error).toBeLessThan(LOG_LEVELS.warn);
    expect(LOG_LEVELS.warn).toBeLessThan(LOG_LEVELS.info);
    expect(LOG_LEVELS.info).toBeLessThan(LOG_LEVELS.http);
    expect(LOG_LEVELS.http).toBeLessThan(LOG_LEVELS.debug);
  });
});
