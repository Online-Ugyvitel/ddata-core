import { TestBed } from '@angular/core/testing';
import { Sha1HashService } from './sha1-hash.service';

describe('Sha1HashService', () => {
  it.each([
    ['password', '5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8'],
    ['jelszó', '540D3FF8059AC7042C116EDAB90B6D1CD6BC324C'],
    ['😀🔑', '0ED31FB6443F459E493FCB8EBC5F0E95FE6BFBC2']
  ])('should hash %s as UTF-8 to uppercase hex', async (password, hash) => {
    expect(await TestBed.inject(Sha1HashService).hash(password)).toBe(hash);
  });

  it('should reject without the Web Crypto API', async () => {
    vi.stubGlobal('crypto', undefined);

    try {
      await expect(TestBed.inject(Sha1HashService).hash('password')).rejects.toThrow(
        'Web Crypto API is not available'
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
