import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Sha1HashService } from '../hash/sha1-hash.service';
import { PwnedPasswordCheckResult } from './pwned-password-status.type';
import { PWNED_PASSWORDS_CONFIG, PWNED_PASSWORDS_FETCH } from './pwned-passwords.const';
import {
  pwnedPasswordsCacheSize,
  pwnedPasswordsHashPattern,
  pwnedPasswordsLinePattern
} from './pwned-passwords-protocol.const';

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
  private readonly sha1 = inject(Sha1HashService);
  // range prefix -> response body, the prefix and the response aren't secret
  private readonly cache = new Map<string, string>();

  /** Never rejects: every failure gives `unavailable`. */
  async check(password: string, signal?: AbortSignal): Promise<PwnedPasswordCheckResult> {
    try {
      const hash = (await this.sha1.hash(password)).toUpperCase();

      if (!pwnedPasswordsHashPattern.test(hash)) {
        return 'unavailable';
      }
      const body = await this.fetchRange(hash.slice(0, 5), signal);

      return this.findCount(body, hash.slice(5)) > 0 ? 'compromised' : 'not-found';
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

  /**
   * Finds the hash suffix in a `HASH_SUFFIX:COUNT` range response (LF or CRLF line endings) and
   * returns its count. The comparison is case insensitive. Padding lines have 0 count, so 0 means
   * not found. Throws on an invalid response.
   */
  findCount(body: string, suffix: string): number {
    const wanted = suffix.toUpperCase();
    let count = 0;

    for (const line of body.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (trimmed === '') {
        continue;
      }
      const match = pwnedPasswordsLinePattern.exec(trimmed);

      if (!match) {
        throw new Error('Invalid Pwned Passwords response');
      }

      if (match[1].toUpperCase() === wanted) {
        count = Math.max(count, Number(match[2]));
      }
    }

    return count;
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
    this.findCount(body, '');
    this.cache.set(prefix, body);

    if (this.cache.size > pwnedPasswordsCacheSize) {
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
