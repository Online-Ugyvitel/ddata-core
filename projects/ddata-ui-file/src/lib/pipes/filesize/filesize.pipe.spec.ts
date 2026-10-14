import { FilesizePipe } from './filesize.pipe';

describe('filesize.pipe', () => {
  let pipe: FilesizePipe;

  beforeEach(() => {
    pipe = new FilesizePipe();
  });

  describe('when value is falsy (should return null)', () => {
    it('should return null when value is null', () => {
      expect(pipe.transform(null, 'gb', 0)).toBe(null);
    });

    it('should return null when value is undefined', () => {
      expect(pipe.transform(undefined, 'gb', 0)).toBe(null);
    });

    it('should return null when value is 0', () => {
      expect(pipe.transform(0, 'gb', 0)).toBe(null);
    });

    it('should return null when value is false', () => {
      expect(pipe.transform(false as unknown as number, 'gb', 0)).toBe(null);
    });

    it('should return null when value is empty string', () => {
      expect(pipe.transform('' as unknown as number, 'gb', 0)).toBe(null);
    });

    it('should return null when value is NaN', () => {
      expect(pipe.transform(NaN, 'gb', 0)).toBe(null);
    });
  });

  describe('when decimals parameter is handled', () => {
    it('should default to 0 decimals when decimals is undefined', () => {
      expect(pipe.transform(1048576, 'mb', undefined)).toBe(1);
    });

    it('should default to 0 decimals when decimals is null', () => {
      expect(pipe.transform(1048576, 'mb', null)).toBe(1);
    });

    it('should default to 0 decimals when decimals is 0', () => {
      expect(pipe.transform(1048576, 'mb', 0)).toBe(1);
    });

    it('should default to 0 decimals when decimals is negative', () => {
      expect(pipe.transform(1048576, 'mb', -1)).toBe(1);
    });

    it('should default to 0 decimals when decimals is false', () => {
      expect(pipe.transform(1048576, 'mb', false as unknown as number)).toBe(1);
    });

    it('should use specified decimals when valid positive number', () => {
      expect(pipe.transform(214748, 'mb', 3)).toBe(0.205);
    });

    it('should handle 1 decimal place', () => {
      expect(pipe.transform(214748, 'kb', 1)).toBe(209.7);
    });

    it('should handle multiple decimal places', () => {
      expect(pipe.transform(1000, 'kb', 3)).toBe(0.977);
    });
  });

  describe('when unit conversions are applied', () => {
    it('should convert bytes to KB correctly', () => {
      expect(pipe.transform(1024, 'kb', 0)).toBe(1);
    });

    it('should convert bytes to MB correctly', () => {
      expect(pipe.transform(1048576, 'mb', 0)).toBe(1);
    });

    it('should convert bytes to GB correctly', () => {
      expect(pipe.transform(1073741824, 'gb', 0)).toBe(1);
    });

    it('should return original value when unit is not recognized', () => {
      expect(pipe.transform(2147483648, 'll', 0)).toBe(2147483648);
    });

    it('should return original value when no unit is provided', () => {
      expect(pipe.transform(1024, undefined, 0)).toBe(1024);
    });

    it('should return original value when unit is empty string', () => {
      expect(pipe.transform(1024, '', 0)).toBe(1024);
    });
  });

  describe('when value is not divisible by 1024', () => {
    it('should handle non-divisible values for KB conversion', () => {
      expect(pipe.transform(1000, 'kb', 2)).toBe(0.98);
    });

    it('should handle non-divisible values for MB conversion', () => {
      expect(pipe.transform(1000000, 'mb', 2)).toBe(0.95);
    });

    it('should handle non-divisible values for GB conversion', () => {
      expect(pipe.transform(1000000000, 'gb', 3)).toBe(0.931);
    });
  });

  describe('edge cases for complete coverage', () => {
    it('should handle very small positive numbers', () => {
      expect(pipe.transform(1, 'gb', 10)).toBe(9e-10);
    });

    it('should handle large numbers with decimals', () => {
      expect(pipe.transform(999999999999, 'gb', 2)).toBe(931.32);
    });

    it('should handle exact conversions', () => {
      expect(pipe.transform(2147483648, 'gb', 0)).toBe(2);
    });

    it('should handle fractional results with proper rounding', () => {
      expect(pipe.transform(214748, 'mb', 3)).toBe(0.205);
    });
  });

  describe('boundaries and invalid input', () => {
    it('should keep 1023 bytes under 1 KB', () => {
      expect(pipe.transform(1023, 'kb', 3)).toBe(0.999);
      expect(pipe.transform(1023, 'kb', 0)).toBe(1);
      expect(pipe.transform(1023, undefined, 0)).toBe(1023);
    });

    it('should convert exactly 1024 bytes to 1 KB', () => {
      expect(pipe.transform(1024, 'kb', 2)).toBe(1);
    });

    it('should convert 1 byte less than 1 MB and 1 GB under the boundary', () => {
      expect(pipe.transform(1048575, 'mb', 6)).toBe(0.999999);
      expect(pipe.transform(1073741823, 'gb', 2)).toBe(1);
    });

    it('should convert very large sizes', () => {
      expect(pipe.transform(1024 ** 4, 'gb', 0)).toBe(1024);
      expect(pipe.transform(Number.MAX_SAFE_INTEGER, 'gb', 0)).toBe(8388608);
    });

    it('should return null for a negative size', () => {
      expect(pipe.transform(-1, 'kb', 2)).toBe(null);
      expect(pipe.transform(-1024, undefined, 0)).toBe(null);
    });

    it('should return null for an infinite size', () => {
      expect(pipe.transform(Infinity, 'mb', 2)).toBe(null);
      expect(pipe.transform(-Infinity, 'mb', 2)).toBe(null);
    });

    it('should convert a numeric string', () => {
      expect(pipe.transform('2048' as unknown as number, 'kb', 0)).toBe(2);
      expect(pipe.transform('2048' as unknown as number, undefined, 0)).toBe(2048);
    });

    it('should return null for a not numeric input', () => {
      expect(pipe.transform('big' as unknown as number, 'kb', 0)).toBe(null);
      expect(pipe.transform({} as unknown as number, 'kb', 0)).toBe(null);
      expect(pipe.transform([1, 2] as unknown as number, 'kb', 0)).toBe(null);
    });

    it('should treat the unit case sensitively', () => {
      expect(pipe.transform(2048, 'KB', 0)).toBe(2048);
    });
  });
});
