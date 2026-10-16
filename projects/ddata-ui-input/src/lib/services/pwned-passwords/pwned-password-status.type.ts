/**
 * State of the online Pwned Passwords check:
 * - `idle`: no check (disabled or empty password)
 * - `checking`: the check is in progress, the password is not known to be safe yet
 * - `compromised`: the password is in the Pwned Passwords database
 * - `not-found`: the password is not in the database
 * - `unavailable`: the check failed (no Web Crypto, network / CORS / HTTP error, invalid response)
 */
export type PwnedPasswordStatus = 'idle' | 'checking' | 'compromised' | 'not-found' | 'unavailable';

/** Result of a finished check. */
export type PwnedPasswordCheckResult = Extract<
  PwnedPasswordStatus,
  'compromised' | 'not-found' | 'unavailable'
>;
