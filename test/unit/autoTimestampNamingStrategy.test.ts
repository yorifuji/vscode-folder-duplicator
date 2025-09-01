import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AutoTimestampNamingStrategy } from '../../src/services/namingService';

describe('AutoTimestampNamingStrategy', () => {
  let strategy: AutoTimestampNamingStrategy;
  
  beforeEach(() => {
    strategy = new AutoTimestampNamingStrategy();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateName', () => {
    it('should add timestamp to folder name', () => {
      // Mock Date to get consistent timestamp
      const mockDate = new Date('2025-01-01T10:30:45');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = strategy.generateName('project1');
      
      expect(result).toBe('project1.20250101103045');
    });

    it('should replace existing timestamp with new one', () => {
      const mockDate = new Date('2025-01-01T12:30:45');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = strategy.generateName('project1.20250101103045');
      
      expect(result).toBe('project1.20250101123045');
    });

    it('should handle names with dots correctly', () => {
      const mockDate = new Date('2025-01-01T10:30:45');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = strategy.generateName('my.project.v2');
      
      expect(result).toBe('my.project.v2.20250101103045');
    });

    it('should only remove valid timestamp patterns', () => {
      const mockDate = new Date('2025-01-01T10:30:45');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate);

      // .123 is not 14 digits, so it should not be removed
      const result1 = strategy.generateName('project.123');
      expect(result1).toBe('project.123.20250101103045');

      // .12345678901234 is 14 digits, so it should be removed
      const result2 = strategy.generateName('project.12345678901234');
      expect(result2).toBe('project.20250101103045');
    });

    it('should handle edge cases', () => {
      const mockDate = new Date('2025-01-01T10:30:45');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate);

      // Empty name
      expect(strategy.generateName('')).toBe('.20250101103045');
      
      // Dot only
      expect(strategy.generateName('.')).toBe('..20250101103045');
      
      // Timestamp only
      expect(strategy.generateName('20250101103045')).toBe('20250101103045.20250101103045');
    });
  });

  describe('timestamp format', () => {
    it('should format single digit months correctly', () => {
      const mockDate = new Date('2025-03-05T08:05:09');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = strategy.generateName('test');
      
      expect(result).toBe('test.20250305080509');
    });

    it('should format midnight correctly', () => {
      const mockDate = new Date('2025-12-31T00:00:00');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = strategy.generateName('test');
      
      expect(result).toBe('test.20251231000000');
    });
  });
});
