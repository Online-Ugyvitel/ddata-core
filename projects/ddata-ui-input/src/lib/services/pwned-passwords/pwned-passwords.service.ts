import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * State of the online Pwned Passwords check:
 * - `idle`: no check (disabled or empty password)
 * - `checking`: the check is in progress, the password is not known to be safe yet
 * - `compromised`: the password is in the Pwned Passwords database
 * - `not-found`: the password is not in the database
 * - `unavailable`: the check failed (no Web Crypto, network / CORS / HTTP error, invalid response)
 */
export type PwnedPasswordStatus = 'idle' | 'checking' | 'compromised' | 'not-found' | 'unavailable';

export type PwnedPasswordCheckResult = Extract<
  PwnedPasswordStatus,
  'compromised' | 'not-found' | 'unavailable'
>;

export interface PwnedPasswordsConfigInterface {
  /** The range endpoint, the 5 character hash prefix is appended to it. */
  apiUrl: string;
  /** Sends the `Add-Padding: true` header, so the size of the response doesn't leak the prefix. */
  addPadding: boolean;
}

export type PwnedPasswordsFetch = (input: string, init?: RequestInit) => Promise<Response>;

/** Returns the uppercase hexadecimal SHA-1 hash of the UTF-8 encoded password. */
export type PwnedPasswordsHasher = (password: string) => Promise<string>;

export const defaultPwnedPasswordsConfig: PwnedPasswordsConfigInterface = {
  apiUrl: 'https://api.pwnedpasswords.com/range/',
  addPadding: true
};

// eslint-disable-next-line @typescript-eslint/naming-convention -- Angular injection token naming
export const PWNED_PASSWORDS_CONFIG = new InjectionToken<PwnedPasswordsConfigInterface>(
  'PWNED_PASSWORDS_CONFIG',
  { providedIn: 'root', factory: (): PwnedPasswordsConfigInterface => defaultPwnedPasswordsConfig }
);

/** The `fetch` implementation of the check, replaceable in the tests. */
// eslint-disable-next-line @typescript-eslint/naming-convention -- Angular injection token naming
export const PWNED_PASSWORDS_FETCH = new InjectionToken<PwnedPasswordsFetch | null>(
  'PWNED_PASSWORDS_FETCH',
  {
    providedIn: 'root',
    factory: (): PwnedPasswordsFetch | null =>
      typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : null
  }
);

/** The SHA-1 implementation of the check, replaceable in the tests. */
// eslint-disable-next-line @typescript-eslint/naming-convention -- Angular injection token naming
export const PWNED_PASSWORDS_HASHER = new InjectionToken<PwnedPasswordsHasher>(
  'PWNED_PASSWORDS_HASHER',
  { providedIn: 'root', factory: (): PwnedPasswordsHasher => sha1Hex }
);
const hashPattern = /^[\dA-F]{40}$/;
const linePattern = /^([\dA-F]{35}):(\d+)$/i;
const cacheSize = 20;

/**
 * SHA-1 of the UTF-8 encoded password as uppercase hex with the Web Crypto API.
 * SHA-1 is required by the Pwned Passwords protocol only, it isn't a password storage method.
 * Rejects when the Web Crypto API isn't available (e.g. not a secure context).
 */
export async function sha1Hex(password: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;

  if (!subtle) {
    throw new Error('Web Crypto API is not available');
  }
  const digest = await subtle.digest('SHA-1', new TextEncoder().encode(password));

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

/**
 * Finds the hash suffix in a `HASH_SUFFIX:COUNT` range response (LF or CRLF line endings) and
 * returns its count. The comparison is case insensitive. Padding lines have 0 count, so 0 means
 * not found. Throws on an invalid response.
 */
export function findPwnedCount(body: string, suffix: string): number {
  const wanted = suffix.toUpperCase();
  let count = 0;

  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (trimmed === '') {
      continue;
    }
    const match = linePattern.exec(trimmed);

    if (!match) {
      throw new Error('Invalid Pwned Passwords response');
    }

    if (match[1].toUpperCase() === wanted) {
      count = Math.max(count, Number(match[2]));
    }
  }

  return count;
}

/**
 * Checks a password against the Have I Been Pwned Pwned Passwords API with k-anonymity: only the
 * first 5 characters of the SHA-1 hash leave the browser, the rest of the hash is compared locally.
 * The password and the hash are never logged or stored, only the responses of the last range
 * prefixes are kept in memory to avoid repeated requests.
 */
@Injectable({ providedIn: 'root' })
export class PwnedPasswordsService {
  private readonly config = inject(PWNED_PASSWORDS_CONFIG);
  private readonly fetchFn = inject(PWNED_PASSWORDS_FETCH);
  private readonly hasher = inject(PWNED_PASSWORDS_HASHER);
  // range prefix -> response body, the prefix and the response aren't secret
  private readonly cache = new Map<string, string>();

  /** Never rejects: every failure gives `unavailable`. */
  async check(password: string, signal?: AbortSignal): Promise<PwnedPasswordCheckResult> {
    try {
      const hash = (await this.hasher(password)).toUpperCase();

      if (!hashPattern.test(hash)) {
        return 'unavailable';
      }
      const body = await this.fetchRange(hash.slice(0, 5), signal);

      return findPwnedCount(body, hash.slice(5)) > 0 ? 'compromised' : 'not-found';
    } catch {
      return 'unavailable';
    }
  }

  /** Cancellable version of `check()`: unsubscribing aborts the request. */
  check$(password: string): Observable<PwnedPasswordCheckResult> {
    return new Observable<PwnedPasswordCheckResult>((subscriber) => {
      const controller = new AbortController();

      this.check(password, controller.signal).then((result) => {
        subscriber.next(result);
        subscriber.complete();
      });

      return (): void => controller.abort();
    });
  }

  private async fetchRange(prefix: string, signal?: AbortSignal): Promise<string> {
    const cached = this.cache.get(prefix);

    if (cached !== undefined) {
      return cached;
    }

    if (!this.fetchFn) {
      throw new Error('fetch is not available');
    }
    const url = this.config.apiUrl + prefix;
    let response: Response;

    try {
      response = await this.fetchFn(url, this.requestInit(this.config.addPadding, signal));
    } catch (error) {
      // the padding header needs a CORS preflight; when it is rejected, the request is repeated
      // once without the header (a simple CORS request)
      if (!this.config.addPadding || signal?.aborted) {
        throw error;
      }

      response = await this.fetchFn(url, this.requestInit(false, signal));
    }

    if (!response.ok) {
      throw new Error(`Pwned Passwords HTTP ${response.status}`);
    }
    const body = await response.text();

    // validates before caching
    findPwnedCount(body, '');
    this.cache.set(prefix, body);

    if (this.cache.size > cacheSize) {
      this.cache.delete(this.cache.keys().next().value as string);
    }

    return body;
  }

  private requestInit(addPadding: boolean, signal?: AbortSignal): RequestInit {
    return {
      method: 'GET',
      // the User-Agent is set by the browser, it mustn't be set from JavaScript
      headers: addPadding ? { 'Add-Padding': 'true' } : {},
      cache: 'no-store',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal
    };
  }
}
