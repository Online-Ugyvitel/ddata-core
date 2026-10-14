import { InjectionToken } from '@angular/core';
import { PwnedPasswordsConfigInterface } from './pwned-passwords-config.interface';
import { PwnedPasswordsFetch } from './pwned-passwords-fetch.type';

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
