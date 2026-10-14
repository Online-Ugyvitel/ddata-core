import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Sha1HashService } from '../hash/sha1-hash.service';
import {
  PWNED_PASSWORDS_CONFIG,
  PWNED_PASSWORDS_FETCH,
  defaultPwnedPasswordsConfig
} from './pwned-passwords.const';
import { PwnedPasswordsFetch } from './pwned-passwords-fetch.type';
import { PwnedPasswordsService } from './pwned-passwords.service';
// SHA-1('password') = 5BAA6 1E4C9B93F3F0682250B6CF8331B7EE68FD8
const passwordSuffix = '1E4C9B93F3F0682250B6CF8331B7EE68FD8';
const otherSuffix = '0018A45C4D1DEF81644B54AB7F969B88D65';
// replaces the Sha1HashService
const hasherOf = (hash: () => Promise<string>): Pick<Sha1HashService, 'hash'> => ({ hash });
const response = (body: string, status = 200): Response => new Response(body, { status });

describe('PwnedPasswordsService.findCount()', () => {
  const findPwnedCount = (body: string, suffix: string): number =>
    TestBed.inject(PwnedPasswordsService).findCount(body, suffix);

  it('should find the exact suffix case insensitively', () => {
    expect(
      findPwnedCount(`${otherSuffix}:3\n${passwordSuffix.toLowerCase()}:42`, passwordSuffix)
    ).toBe(42);
    expect(findPwnedCount(`${passwordSuffix}:7`, passwordSuffix.toLowerCase())).toBe(7);
  });

  it('should handle CRLF, LF and empty lines', () => {
    expect(findPwnedCount(`${otherSuffix}:1\r\n${passwordSuffix}:5\r\n`, passwordSuffix)).toBe(5);
    expect(findPwnedCount(`\n${otherSuffix}:1\n\n`, passwordSuffix)).toBe(0);
    expect(findPwnedCount('', passwordSuffix)).toBe(0);
  });

  it('should give 0 for a different suffix with the same prefix and for padding lines', () => {
    expect(findPwnedCount(`${otherSuffix}:12`, passwordSuffix)).toBe(0);
    expect(findPwnedCount(`${passwordSuffix}:0`, passwordSuffix)).toBe(0);
  });

  it.each(['<html>error</html>', `${passwordSuffix}`, `${passwordSuffix}:x`, 'ABC:1'])(
    'should throw on an invalid response (%s)',
    (body) => {
      expect(() => findPwnedCount(body, passwordSuffix)).toThrow(
        'Invalid Pwned Passwords response'
      );
    }
  );
});

describe('PwnedPasswordsService', () => {
  let fetchMock: ReturnType<typeof vi.fn<PwnedPasswordsFetch>>;
  const setup = (providers: Array<unknown> = []): PwnedPasswordsService => {
    TestBed.configureTestingModule({
      providers: [{ provide: PWNED_PASSWORDS_FETCH, useValue: fetchMock }, ...(providers as [])]
    });

    return TestBed.inject(PwnedPasswordsService);
  };

  beforeEach(() => {
    fetchMock = vi.fn<PwnedPasswordsFetch>();
  });

  it('should send only the 5 character prefix with padding and without credentials', async () => {
    fetchMock.mockResolvedValue(response(`${passwordSuffix}:10`));
    const service = setup();

    expect(await service.check('password')).toBe('compromised');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toBe('https://api.pwnedpasswords.com/range/5BAA6');
    expect(init?.headers).toEqual({ 'Add-Padding': 'true' });
    expect(init?.headers).not.toHaveProperty('User-Agent');
    expect(init?.credentials).toBe('omit');
    expect(JSON.stringify(init)).not.toContain('password');
    expect(JSON.stringify(init)).not.toContain(passwordSuffix);
  });

  it('should give not-found for a different suffix or a 0 count', async () => {
    const service = setup();

    fetchMock.mockResolvedValueOnce(response(`${otherSuffix}:10\r\n${passwordSuffix}:0`));

    expect(await service.check('password')).toBe('not-found');
  });

  it('should cache the range response of a prefix', async () => {
    fetchMock.mockImplementation(async () => response(`${otherSuffix}:1`));
    const service = setup();

    expect(await service.check('password')).toBe('not-found');
    expect(await service.check('password')).toBe('not-found');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should keep only the last range responses', async () => {
    fetchMock.mockImplementation(async () => response(`${otherSuffix}:1`));
    let index = 0;
    // a new prefix for every call
    const hasher = async (): Promise<string> =>
      `${(index++).toString(16).toUpperCase().padStart(5, '0')}${passwordSuffix}`;
    const service = setup([{ provide: Sha1HashService, useValue: hasherOf(hasher) }]);

    for (let i = 0; i < 22; i++) {
      await service.check('x');
    }

    index = 0;
    await service.check('x');

    expect(fetchMock).toHaveBeenCalledTimes(23);
  });

  it('should use the configured url and no padding header', async () => {
    fetchMock.mockResolvedValue(response(''));
    const service = setup([
      {
        provide: PWNED_PASSWORDS_CONFIG,
        useValue: { apiUrl: 'https://example.com/r/', addPadding: false }
      }
    ]);

    expect(await service.check('password')).toBe('not-found');
    expect(fetchMock.mock.calls[0][0]).toBe('https://example.com/r/5BAA6');
    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({});
  });

  it('should repeat the request once without padding when it is rejected (CORS)', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    fetchMock.mockResolvedValueOnce(response(`${passwordSuffix}:2`));
    const service = setup();

    expect(await service.check('password')).toBe('compromised');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1]?.headers).toEqual({});
  });

  it('should give unavailable when the request fails twice, without more retries', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    const service = setup();

    expect(await service.check('password')).toBe('unavailable');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('should not retry without padding when it is disabled', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    const service = setup([
      {
        provide: PWNED_PASSWORDS_CONFIG,
        useValue: { ...defaultPwnedPasswordsConfig, addPadding: false }
      }
    ]);

    expect(await service.check('password')).toBe('unavailable');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([403, 429, 500, 503])('should give unavailable for HTTP %i', async (status) => {
    fetchMock.mockResolvedValue(response(`${passwordSuffix}:10`, status));
    const service = setup();

    expect(await service.check('password')).toBe('unavailable');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should give unavailable for an invalid response and not cache it', async () => {
    fetchMock.mockImplementation(async () => response('<html></html>'));
    const service = setup();

    expect(await service.check('password')).toBe('unavailable');
    expect(await service.check('password')).toBe('unavailable');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('should give unavailable without fetch', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PWNED_PASSWORDS_FETCH, useValue: null }]
    });

    expect(await TestBed.inject(PwnedPasswordsService).check('password')).toBe('unavailable');
  });

  it('should give unavailable when hashing fails or gives an invalid hash', async () => {
    let service = setup([
      {
        provide: Sha1HashService,
        useValue: hasherOf(async () => Promise.reject(new Error('no crypto')))
      }
    ]);

    expect(await service.check('password')).toBe('unavailable');

    TestBed.resetTestingModule();
    service = setup([{ provide: Sha1HashService, useValue: hasherOf(async () => 'nothex') }]);

    expect(await service.check('password')).toBe('unavailable');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should accept a lowercase hash from the hasher', async () => {
    fetchMock.mockResolvedValue(response(`${passwordSuffix}:1`));
    const service = setup([
      {
        provide: Sha1HashService,
        useValue: hasherOf(async () => `5baa6${passwordSuffix.toLowerCase()}`)
      }
    ]);

    expect(await service.check('password')).toBe('compromised');
    expect(fetchMock.mock.calls[0][0]).toMatch(/5BAA6$/);
  });

  it('check$() should emit the result and abort the request on unsubscribe', async () => {
    fetchMock.mockResolvedValue(response(`${passwordSuffix}:1`));
    const service = setup();

    expect(await firstValueFrom(service.check$('password'))).toBe('compromised');
    let signal: AbortSignal | undefined;

    fetchMock.mockImplementation(
      async (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          signal = init?.signal ?? undefined;
          signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError'))
          );
        })
    );
    const next = vi.fn();
    const subscription = service.check$('other password').subscribe(next);

    await vi.waitFor(() => expect(signal).toBeDefined());
    subscription.unsubscribe();
    await Promise.resolve();

    expect(signal?.aborted).toBe(true);
    // the aborted request isn't repeated without padding
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(next).not.toHaveBeenCalled();
  });

  it('should use the global fetch and the default config', () => {
    expect(typeof TestBed.inject(PWNED_PASSWORDS_FETCH)).toBe('function');
    expect(TestBed.inject(PWNED_PASSWORDS_CONFIG)).toBe(defaultPwnedPasswordsConfig);
  });

  it('should have no default fetch without the global fetch', () => {
    vi.stubGlobal('fetch', undefined);

    try {
      expect(TestBed.inject(PWNED_PASSWORDS_FETCH)).toBeNull();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
