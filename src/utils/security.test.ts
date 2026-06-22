import { describe, it, expect } from 'vitest';
import { sanitizeString, sanitizeNumber, sanitizeEmail, sanitizePhone, escapeHTML, isValidAmount } from './security';

describe('Security Utilities', () => {
  
  describe('sanitizeString', () => {
    it('removes XSS characters', () => {
      const input = '<script>alert("hello")</script>';
      const sanitized = sanitizeString(input);
      expect(sanitized).toBe('scriptalert(hello)/script');
    });

    it('trims leading and trailing whitespace', () => {
      expect(sanitizeString('  hello world  ')).toBe('hello world');
    });

    it('enforces maximum length', () => {
      const longString = 'a'.repeat(600);
      expect(sanitizeString(longString)).toHaveLength(500);
    });
  });

  describe('sanitizeNumber', () => {
    it('parses valid numbers', () => {
      expect(sanitizeNumber('123')).toBe(123);
      expect(sanitizeNumber(123)).toBe(123);
      expect(sanitizeNumber('123.45')).toBe(123.45);
    });

    it('returns 0 for invalid numbers', () => {
      expect(sanitizeNumber('abc')).toBe(0);
      expect(sanitizeNumber(NaN)).toBe(0);
    });

    it('enforces min and max bounds', () => {
      expect(sanitizeNumber(-10, 0, 100)).toBe(0);
      expect(sanitizeNumber(200, 0, 100)).toBe(100);
    });
  });

  describe('sanitizeEmail', () => {
    it('returns valid email', () => {
      expect(sanitizeEmail('test@example.com')).toBe('test@example.com');
    });

    it('returns empty string for invalid email', () => {
      expect(sanitizeEmail('test@.com')).toBe('');
      expect(sanitizeEmail('invalid-email')).toBe('');
      expect(sanitizeEmail('<script>test@test.com</script>')).toBe('');
    });
  });

  describe('sanitizePhone', () => {
    it('extracts digits and limits to 10 characters', () => {
      expect(sanitizePhone('+91 98765 43210')).toBe('9198765432');
      expect(sanitizePhone('abcd1234567890efg')).toBe('1234567890');
    });
  });

  describe('escapeHTML', () => {
    it('escapes standard HTML entities', () => {
      const input = '<div class="test">Bob & Alice\'s "cafe"</div>';
      const escaped = escapeHTML(input);
      expect(escaped).toBe('&lt;div class=&quot;test&quot;&gt;Bob &amp; Alice&#x27;s &quot;cafe&quot;&lt;&#x2F;div&gt;');
    });
  });

  describe('isValidAmount', () => {
    it('validates positive finite numbers within range', () => {
      expect(isValidAmount(0)).toBe(true);
      expect(isValidAmount(100.5)).toBe(true);
      expect(isValidAmount(10000000)).toBe(true);
    });

    it('rejects invalid amounts', () => {
      expect(isValidAmount(-1)).toBe(false);
      expect(isValidAmount(10000001)).toBe(false);
      expect(isValidAmount(NaN)).toBe(false);
      expect(isValidAmount(Infinity)).toBe(false);
      // @ts-expect-error Testing invalid type
      expect(isValidAmount('100')).toBe(false);
    });
  });

});
