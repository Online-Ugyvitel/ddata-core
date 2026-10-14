import { TestBed } from '@angular/core/testing';
import {
  defaultWeakPasswords,
  WEAK_PASSWORDS,
  calculatePasswordStrength,
  getPasswordStrengthLevel,
  isWeakPassword
} from './password-strength';

describe('password strength', () => {
  describe('calculatePasswordStrength()', () => {
    // 'xxxxxx' is the base: 6 lowercase characters gives 'lowercase' + 'not weak' = 2 / 8
    it('should give 25 for a lowercase only password', () => {
      expect(calculatePasswordStrength('xxxxxx')).toBe(25);
    });

    it.each([
      ['uppercase', 'xxxxxX'],
      ['number', 'xxxxx1'],
      ['special character', 'xxxxx@']
    ])('should give 12.5 points for a(n) %s', (_rule, password) => {
      expect(calculatePasswordStrength(password)).toBe(37.5);
    });

    it('should give 12.5 points for a lowercase letter', () => {
      expect(calculatePasswordStrength('XXXXXX')).toBe(25);
      expect(calculatePasswordStrength('XXXXXx')).toBe(37.5);
    });

    it.each([
      [8, 25],
      [9, 37.5],
      [10, 37.5],
      [11, 50],
      [12, 50],
      [13, 62.5]
    ])('should rate a password of %i characters to %d', (length, expected) => {
      expect(calculatePasswordStrength('x'.repeat(length))).toBe(expected);
    });

    it('should rate a password shorter than 6 characters to 0', () => {
      expect(calculatePasswordStrength('Ab1@x')).toBe(0);
      expect(calculatePasswordStrength('Ab1@xy')).toBe(62.5);
    });

    it.each(['mindegy', 'Password', 'QWERTY', 'JelSzó'])(
      'should rate a password from the weak password list to 0 (%s)',
      (password) => {
        expect(calculatePasswordStrength(password)).toBe(0);
      }
    );

    it.each([null, undefined, ''])('should rate %s to 0', (password) => {
      expect(calculatePasswordStrength(password)).toBe(0);
    });

    it('should rate a password with spaces only as special characters', () => {
      expect(calculatePasswordStrength('      ')).toBe(25);
    });

    it('should handle the accented letters as letters', () => {
      expect(calculatePasswordStrength('árvíztűrő')).toBe(37.5);
      expect(calculatePasswordStrength('ÁRVÍZTŰRŐ')).toBe(37.5);
    });

    it('should count an emoji as one character', () => {
      // 5 characters, 10 UTF-16 code units
      expect(calculatePasswordStrength('😀😀😀😀😀')).toBe(0);
      expect(calculatePasswordStrength('😀😀😀😀😀😀')).toBe(25);
    });

    it('should rate a strong password to 100', () => {
      expect(calculatePasswordStrength('TeszTelesJelszo2@')).toBe(100);
    });

    it('should use the given weak password list', () => {
      expect(calculatePasswordStrength('mindegy', [])).toBe(25);
      expect(calculatePasswordStrength('Company2024', ['company2024'])).toBe(0);
    });
  });

  it('isWeakPassword() should compare case insensitively on both sides', () => {
    expect(isWeakPassword('secret', ['SeCrEt'])).toBe(true);
    expect(isWeakPassword('secret1', ['secret'])).toBe(false);
  });

  it.each([
    [0, 'weak'],
    [49, 'weak'],
    [50, 'medium'],
    [69, 'medium'],
    [70, 'strong'],
    [100, 'strong']
  ])('getPasswordStrengthLevel(%d) should be %s', (strength, level) => {
    expect(getPasswordStrengthLevel(strength)).toBe(level);
  });

  it('WEAK_PASSWORDS should default to the built-in list', () => {
    expect(TestBed.inject(WEAK_PASSWORDS)).toBe(defaultWeakPasswords);
  });
});
