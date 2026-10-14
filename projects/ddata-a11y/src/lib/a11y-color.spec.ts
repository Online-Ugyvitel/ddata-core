import { A11yColor, TextColorsEnum } from './a11y-color';

describe('A11yColor', () => {
  let a11yColor: A11yColor;

  beforeEach(() => {
    a11yColor = new A11yColor();
  });

  describe('TextColorsEnum', () => {
    it('should expose black and white as 6 digit hex strings without "#"', () => {
      expect(TextColorsEnum.BLACK).toBe('000000');
      expect(TextColorsEnum.WHITE).toBe('ffffff');
      expect(Object.values(TextColorsEnum)).toEqual(['000000', 'ffffff']);
    });
  });

  describe('initial state', () => {
    it('should have no background color before setBackgroundColor is called', () => {
      expect(a11yColor.hex).toBeUndefined();
    });

    it('should throw a TypeError when luminance is requested without a background color', () => {
      expect(() => a11yColor.luminance()).toThrow(TypeError);
    });

    it('should throw a TypeError when the text color is requested without a background color', () => {
      expect(() => a11yColor.getTextColor()).toThrow(TypeError);
    });

    it('should throw a TypeError when a contrast ratio is requested without a background color', () => {
      expect(() => a11yColor.getContrastRatioWith('ffffff')).toThrow(TypeError);
    });
  });

  describe('setBackgroundColor', () => {
    it('should store the hex value and return the same instance for chaining', () => {
      const result = a11yColor.setBackgroundColor('ff0000');

      expect(a11yColor.hex).toBe('ff0000');
      expect(result).toBe(a11yColor);
    });

    it('should store the value verbatim (no normalisation of case or "#")', () => {
      a11yColor.setBackgroundColor('#ABCDEF');

      expect(a11yColor.hex).toBe('#ABCDEF');
    });

    it('should override the previous value on repeated calls', () => {
      a11yColor.setBackgroundColor('000000');

      expect(a11yColor.getTextColor()).toBe(TextColorsEnum.WHITE);

      a11yColor.setBackgroundColor('ffffff');

      expect(a11yColor.hex).toBe('ffffff');
      expect(a11yColor.luminance()).toBe(1);
      expect(a11yColor.getTextColor()).toBe(TextColorsEnum.BLACK);
    });

    it('should give the same results when set repeatedly to the same value', () => {
      a11yColor.setBackgroundColor('123456');
      const first = a11yColor.luminance();

      a11yColor.setBackgroundColor('123456');

      expect(a11yColor.luminance()).toBe(first);
      expect(a11yColor.hex).toBe('123456');
    });

    it('should accept null / undefined but subsequent calculations throw a TypeError', () => {
      a11yColor.setBackgroundColor(null);

      expect(a11yColor.hex).toBeNull();
      expect(() => a11yColor.luminance()).toThrow(TypeError);

      a11yColor.setBackgroundColor(undefined);

      expect(a11yColor.hex).toBeUndefined();
      expect(() => a11yColor.getTextColor()).toThrow(TypeError);
    });
  });

  describe('luminance', () => {
    it.each([
      ['ffffff', 1],
      ['000000', 0],
      ['ff0000', 0.2126],
      ['00ff00', 0.7152],
      ['0000ff', 0.0722],
      ['ffff00', 0.9278],
      ['808080', 0.21586050011389923],
      ['123456', 0.03256466884775973],
      ['abcdef', 0.5855256521034803]
    ])('should return the WCAG relative luminance of %s', (hex: string, expected: number) => {
      a11yColor.setBackgroundColor(hex);

      expect(a11yColor.luminance()).toBeCloseTo(expected, 10);
    });

    it('should use the linear segment (c / 12.92) for channel values <= 0.03928', () => {
      // 0x0a / 255 = 0.0392... <= 0.03928 -> linear
      a11yColor.setBackgroundColor('0a0a0a');

      expect(a11yColor.luminance()).toBeCloseTo(10 / 255 / 12.92, 12);
    });

    it('should use the gamma segment for channel values > 0.03928', () => {
      // 0x0b / 255 = 0.0431... > 0.03928 -> gamma curve
      a11yColor.setBackgroundColor('0b0b0b');

      expect(a11yColor.luminance()).toBeCloseTo(Math.pow((11 / 255 + 0.055) / 1.055, 2.4), 12);
    });

    it('should treat upper case and mixed case hex the same as lower case', () => {
      a11yColor.setBackgroundColor('abcdef');
      const lower = a11yColor.luminance();

      a11yColor.setBackgroundColor('ABCDEF');

      expect(a11yColor.luminance()).toBe(lower);

      a11yColor.setBackgroundColor('AbCdEf');

      expect(a11yColor.luminance()).toBe(lower);
    });

    it('should ignore characters after the 6th (e.g. an alpha channel)', () => {
      a11yColor.setBackgroundColor('ffffff00');

      expect(a11yColor.luminance()).toBe(1);
    });

    it.each([
      ['empty string', ''],
      ['3 digit shorthand', 'fff'],
      ['leading "#"', '#ffffff'],
      ['non hex characters', 'zzzzzz']
    ])('should return NaN for invalid input: %s', (_label: string, hex: string) => {
      a11yColor.setBackgroundColor(hex);

      expect(a11yColor.luminance()).toBeNaN();
    });

    it('should return the same value on repeated calls (no internal state mutation)', () => {
      a11yColor.setBackgroundColor('888888');
      const first = a11yColor.luminance();

      expect(a11yColor.luminance()).toBe(first);
      expect(a11yColor.hex).toBe('888888');
    });
  });

  describe('getContrastRatioBetween', () => {
    it('should return the maximum ratio 21 for white and black', () => {
      expect(a11yColor.getContrastRatioBetween('ffffff', '000000')).toBe(21);
    });

    it('should return the minimum ratio 1 for identical colors', () => {
      expect(a11yColor.getContrastRatioBetween('ff0000', 'ff0000')).toBe(1);
      expect(a11yColor.getContrastRatioBetween('000000', '000000')).toBe(1);
    });

    it('should compute the WCAG ratio (L1 + 0.05) / (L2 + 0.05) for arbitrary colors', () => {
      expect(a11yColor.getContrastRatioBetween('ff0000', '00ff00')).toBeCloseTo(
        (0.7152 + 0.05) / (0.2126 + 0.05),
        10
      );
      expect(a11yColor.getContrastRatioBetween('0000ff', 'ffffff')).toBeCloseTo(
        1.05 / (0.0722 + 0.05),
        10
      );
    });

    it('should be symmetric (argument order does not matter)', () => {
      expect(a11yColor.getContrastRatioBetween('ff0000', '00ff00')).toBe(
        a11yColor.getContrastRatioBetween('00ff00', 'ff0000')
      );
    });

    it('should work without a background color being set', () => {
      expect(a11yColor.hex).toBeUndefined();
      expect(a11yColor.getContrastRatioBetween('000000', 'ffffff')).toBe(21);
    });

    it('should not change the stored background color', () => {
      a11yColor.setBackgroundColor('123456');
      a11yColor.getContrastRatioBetween('ffffff', '000000');

      expect(a11yColor.hex).toBe('123456');
    });

    it('should return NaN when either color is invalid', () => {
      expect(a11yColor.getContrastRatioBetween('', 'ffffff')).toBeNaN();
      expect(a11yColor.getContrastRatioBetween('ffffff', '#000000')).toBeNaN();
    });

    it('should throw a TypeError for null / undefined colors', () => {
      expect(() => a11yColor.getContrastRatioBetween(null, 'ffffff')).toThrow(TypeError);
      expect(() => a11yColor.getContrastRatioBetween('ffffff', undefined)).toThrow(TypeError);
    });
  });

  describe('getContrastRatioWith', () => {
    it('should return the ratio between the background color and the given color', () => {
      a11yColor.setBackgroundColor('ffffff');

      expect(a11yColor.getContrastRatioWith('000000')).toBe(21);
    });

    it('should return 1 for the same color', () => {
      a11yColor.setBackgroundColor('ff0000');

      expect(a11yColor.getContrastRatioWith('ff0000')).toBe(1);
    });

    it('should equal getContrastRatioBetween(background, color)', () => {
      a11yColor.setBackgroundColor('808080');

      expect(a11yColor.getContrastRatioWith('ffffff')).toBe(
        a11yColor.getContrastRatioBetween('808080', 'ffffff')
      );
      expect(a11yColor.getContrastRatioWith('ffffff')).toBeCloseTo(3.9494396480491156, 10);
    });

    it('should delegate to getContrastRatioBetween with the stored background', () => {
      const spy = vi.spyOn(a11yColor, 'getContrastRatioBetween');

      a11yColor.setBackgroundColor('abcdef');
      a11yColor.getContrastRatioWith('000000');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('abcdef', '000000');
    });
  });

  describe('getTextColor', () => {
    it.each([
      ['ffffff', TextColorsEnum.BLACK],
      ['cccccc', TextColorsEnum.BLACK],
      ['ffff00', TextColorsEnum.BLACK],
      ['00ff00', TextColorsEnum.BLACK],
      ['ff0000', TextColorsEnum.BLACK],
      ['000000', TextColorsEnum.WHITE],
      ['333333', TextColorsEnum.WHITE],
      ['0000ff', TextColorsEnum.WHITE],
      ['123456', TextColorsEnum.WHITE]
    ])(
      'should return the higher contrast text color for %s',
      (hex: string, expected: TextColorsEnum) => {
        a11yColor.setBackgroundColor(hex);

        expect(a11yColor.getTextColor()).toBe(expected);
      }
    );

    it('should switch from WHITE to BLACK exactly at the grey boundary 757575 / 767676', () => {
      a11yColor.setBackgroundColor('757575');

      expect(a11yColor.getTextColor()).toBe(TextColorsEnum.WHITE);

      a11yColor.setBackgroundColor('767676');

      expect(a11yColor.getTextColor()).toBe(TextColorsEnum.BLACK);
    });

    it('should return the color with the strictly higher contrast ratio', () => {
      a11yColor.setBackgroundColor('777777');
      const black = a11yColor.getContrastRatioWith(TextColorsEnum.BLACK);
      const white = a11yColor.getContrastRatioWith(TextColorsEnum.WHITE);

      expect(black).toBeGreaterThan(white);
      expect(a11yColor.getTextColor()).toBe(TextColorsEnum.BLACK);
    });

    it('should fall back to WHITE when the contrast ratios are equal', () => {
      vi.spyOn(a11yColor, 'getContrastRatioWith').mockReturnValue(4.5);
      a11yColor.setBackgroundColor('777777');

      expect(a11yColor.getTextColor()).toBe(TextColorsEnum.WHITE);
    });

    it('should fall back to WHITE for an invalid (NaN luminance) background', () => {
      a11yColor.setBackgroundColor('');

      expect(a11yColor.getTextColor()).toBe(TextColorsEnum.WHITE);
    });

    it('should support chaining from setBackgroundColor', () => {
      expect(new A11yColor().setBackgroundColor('fafafa').getTextColor()).toBe(
        TextColorsEnum.BLACK
      );
    });
  });

  describe('multiple instances', () => {
    it('should keep the background color per instance', () => {
      const dark = new A11yColor().setBackgroundColor('000000');
      const light = new A11yColor().setBackgroundColor('ffffff');

      expect(dark.hex).toBe('000000');
      expect(light.hex).toBe('ffffff');
      expect(dark.getTextColor()).toBe(TextColorsEnum.WHITE);
      expect(light.getTextColor()).toBe(TextColorsEnum.BLACK);
    });

    it('should not affect other instances when one is changed', () => {
      const first = new A11yColor().setBackgroundColor('ff0000');
      const second = new A11yColor().setBackgroundColor('ff0000');

      second.setBackgroundColor('0000ff');

      expect(first.hex).toBe('ff0000');
      expect(first.luminance()).toBeCloseTo(0.2126, 10);
      expect(second.luminance()).toBeCloseTo(0.0722, 10);
    });
  });
});
