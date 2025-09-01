import { describe, it, expect } from 'vitest';
import {
  TimestampNamingStrategy,
  SequentialNamingStrategy,
  CustomNamingStrategy
} from '../../src/services/namingService';

describe('NamingService', () => {
  describe('TimestampNamingStrategy', () => {
    it('should generate name with timestamp', () => {
      const strategy = new TimestampNamingStrategy();
      const result = strategy.generateName('myFolder');
      
      expect(result).toMatch(/^myFolder_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/);
    });
  });

  describe('SequentialNamingStrategy', () => {
    it('should add _1 to name without number', () => {
      const strategy = new SequentialNamingStrategy();
      const result = strategy.generateName('myFolder');
      
      expect(result).toBe('myFolder_1');
    });

    it('should increment existing number', () => {
      const strategy = new SequentialNamingStrategy();
      const result = strategy.generateName('myFolder_5');
      
      expect(result).toBe('myFolder_6');
    });
  });

  describe('CustomNamingStrategy', () => {
    it('should return custom name', () => {
      const strategy = new CustomNamingStrategy('customName');
      const result = strategy.generateName('ignoredName');
      
      expect(result).toBe('customName');
    });
  });
});