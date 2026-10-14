import { InjectionToken } from '@angular/core';

export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong';

/**
 * Commonly used passwords. A password from this list is always rated to 0.
 */
export const defaultWeakPasswords: ReadonlyArray<string> = [
  '123456',
  'password',
  '123456789',
  '12345678',
  '12345',
  '111111',
  '1234567',
  'sunshine',
  'qwerty',
  'qwertz',
  'iloveyou',
  'princess',
  'admin',
  'welcome',
  '666666',
  'abc123',
  'football',
  '123123',
  'monkey',
  '654321',
  '!@#$%^&*',
  'charlie',
  'aa123456',
  'donald',
  'password1',
  'qwerty123',
  'qwertz123',
  'asdf1234',
  'asdfghjkl',
  'jelszo',
  'jelszo1',
  'jelszó',
  'mindegy',
  'mind1'
];

/**
 * Application wide list of the weak passwords. Provide it to replace or extend the default list:
 *
 * `{ provide: WEAK_PASSWORDS, useValue: [...defaultWeakPasswords, 'company2024'] }`
 */
// eslint-disable-next-line @typescript-eslint/naming-convention -- Angular injection token naming
export const WEAK_PASSWORDS = new InjectionToken<ReadonlyArray<string>>('WEAK_PASSWORDS', {
  providedIn: 'root',
  factory: (): ReadonlyArray<string> => defaultWeakPasswords
});

export const passwordMinLength = 6;
const ruleCount = 8;
const lowercase = /\p{Ll}/u;
const uppercase = /\p{Lu}/u;
const number = /\p{Nd}/u;
const specialCharacter = /[^\p{L}\p{N}]/u;

/**
 * Rates a password from 0 to 100. Every rule gives 12.5 points:
 * lowercase letter, uppercase letter, number, special character, longer than 8, 10 and 12
 * characters, and not in the weak password list.
 *
 * Shorter than 6 characters or a password from the weak password list is always 0.
 * Letters are checked Unicode aware (`á` is a lowercase letter), the length counts characters,
 * not UTF-16 code units (an emoji is one character).
 */
export function calculatePasswordStrength(
  password: string | null | undefined,
  weakPasswords: ReadonlyArray<string> = defaultWeakPasswords
): number {
  const value = password ?? '';
  const length = Array.from(value).length;

  if (length < passwordMinLength || isWeakPassword(value, weakPasswords)) {
    return 0;
  }
  const rules = [
    lowercase.test(value),
    uppercase.test(value),
    number.test(value),
    specialCharacter.test(value),
    length > 8,
    length > 10,
    length > 12,
    // not a weak password
    true
  ];

  return (rules.filter(Boolean).length / ruleCount) * 100;
}

export function isWeakPassword(password: string, weakPasswords: ReadonlyArray<string>): boolean {
  const value = password.toLowerCase();

  return weakPasswords.some((item) => item.toLowerCase() === value);
}

export function getPasswordStrengthLevel(strength: number): PasswordStrengthLevel {
  if (strength < 50) {
    return 'weak';
  }

  if (strength < 70) {
    return 'medium';
  }

  return 'strong';
}
