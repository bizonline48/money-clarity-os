import { describe, it, expect } from 'vitest';
import {
  centsToDecimal,
  decimalToCents,
  add,
  subtract,
  multiply,
  divide,
  formatCurrency,
  formatCurrencyCompact,
} from '../../src/services/money';

describe('Money Service', () => {
  describe('centsToDecimal', () => {
    it('converts cents to decimal correctly', () => {
      expect(centsToDecimal(1250).toNumber()).toBe(12.5);
      expect(centsToDecimal(100).toNumber()).toBe(1);
      expect(centsToDecimal(0).toNumber()).toBe(0);
      expect(centsToDecimal(-500).toNumber()).toBe(-5);
    });
  });

  describe('decimalToCents', () => {
    it('converts decimal to cents correctly', () => {
      expect(decimalToCents(12.5)).toBe(1250);
      expect(decimalToCents(1)).toBe(100);
      expect(decimalToCents(0)).toBe(0);
      expect(decimalToCents(-5)).toBe(-500);
    });

    it('handles string input', () => {
      expect(decimalToCents('12.50')).toBe(1250);
      expect(decimalToCents('0.99')).toBe(99);
    });
  });

  describe('add', () => {
    it('adds two amounts correctly', () => {
      expect(add(1000, 500)).toBe(1500);
      expect(add(1250, 750)).toBe(2000);
      expect(add(0, 100)).toBe(100);
    });

    it('handles negative amounts', () => {
      expect(add(1000, -500)).toBe(500);
      expect(add(-1000, -500)).toBe(-1500);
    });

    it('handles zero', () => {
      expect(add(0, 0)).toBe(0);
      expect(add(1000, 0)).toBe(1000);
    });
  });

  describe('subtract', () => {
    it('subtracts two amounts correctly', () => {
      expect(subtract(1000, 500)).toBe(500);
      expect(subtract(2000, 1250)).toBe(750);
      expect(subtract(100, 100)).toBe(0);
    });

    it('handles negative results', () => {
      expect(subtract(500, 1000)).toBe(-500);
      expect(subtract(0, 500)).toBe(-500);
    });

    it('handles negative amounts', () => {
      expect(subtract(-1000, -500)).toBe(-500);
      expect(subtract(-500, -1000)).toBe(500);
    });
  });

  describe('multiply', () => {
    it('multiplies correctly', () => {
      expect(multiply(1000, 2)).toBe(2000);
      expect(multiply(1250, 3)).toBe(3750);
      expect(multiply(100, 0.5)).toBe(50);
    });

    it('handles zero multiplier', () => {
      expect(multiply(1000, 0)).toBe(0);
      expect(multiply(0, 5)).toBe(0);
    });

    it('handles negative multiplier', () => {
      expect(multiply(1000, -2)).toBe(-2000);
      expect(multiply(-1000, 2)).toBe(-2000);
    });
  });

  describe('divide', () => {
    it('divides correctly', () => {
      expect(divide(1000, 2)).toBe(500);
      expect(divide(1500, 3)).toBe(500);
      expect(divide(100, 4)).toBe(25);
    });

    it('throws error on division by zero', () => {
      expect(() => divide(1000, 0)).toThrow('Cannot divide by zero');
    });

    it('handles negative divisor', () => {
      expect(divide(1000, -2)).toBe(-500);
      expect(divide(-1000, 2)).toBe(-500);
    });
  });

  describe('formatCurrency', () => {
    it('formats SGD correctly', () => {
      const result = formatCurrency(1250, 'SGD');
      expect(result).toContain('12.50');
      expect(formatCurrency(100000, 'SGD')).toContain('1,000.00');
      expect(formatCurrency(0, 'SGD')).toContain('0.00');
    });

    it('formats negative amounts correctly', () => {
      const result = formatCurrency(-1250, 'SGD');
      expect(result).toContain('-');
      expect(result).toContain('12.50');
    });

    it('formats different currencies', () => {
      expect(formatCurrency(1250, 'USD', 'en-US')).toBe('$12.50');
      expect(formatCurrency(1250, 'EUR', 'en-GB')).toBe('€12.50');
    });
  });

  describe('formatCurrencyCompact', () => {
    it('formats small amounts normally', () => {
      const result1 = formatCurrencyCompact(1250, 'SGD');
      const result2 = formatCurrencyCompact(99900, 'SGD');
      expect(result1).toContain('12.50');
      expect(result2).toContain('999');
    });

    it('formats thousands compactly', () => {
      const result = formatCurrencyCompact(100000, 'SGD');
      expect(result).toMatch(/1[.,]?0?[kK]/);
    });

    it('formats millions compactly', () => {
      const result = formatCurrencyCompact(1500000, 'SGD');
      expect(result.toLowerCase()).toContain('1');
      expect(result.toLowerCase()).toContain('5');
    });

    it('handles zero', () => {
      const result = formatCurrencyCompact(0, 'SGD');
      expect(result).toContain('0.00');
    });

    it('handles negative amounts', () => {
      const result = formatCurrencyCompact(-100000, 'SGD');
      expect(result).toContain('-');
    });
  });
});
