import { Injectable } from '@angular/core';

/**
 * SHA-1 with the Web Crypto API. Used by the Pwned Passwords protocol only, it isn't a password
 * storage method.
 */
@Injectable({ providedIn: 'root' })
export class Sha1HashService {
  /**
   * SHA-1 of the UTF-8 encoded text as uppercase hex.
   * Rejects when the Web Crypto API isn't available (e.g. not a secure context).
   */
  async hash(text: string): Promise<string> {
    const subtle = globalThis.crypto?.subtle;

    if (!subtle) {
      throw new Error('Web Crypto API is not available');
    }
    const digest = await subtle.digest('SHA-1', new TextEncoder().encode(text));

    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }
}
