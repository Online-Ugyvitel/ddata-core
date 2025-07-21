import { A11yColor, TextColorsEnum, RgbInterface } from './a11y-color';

describe('A11yColor', () => {
  let a11yColor: A11yColor;

  beforeEach(() => {
    a11yColor = new A11yColor();
  });

  describe('TextColorsEnum', () => {
    it('should have correct enum values', () => {
      expect(TextColorsEnum.BLACK).toBe('000000');
      expect(TextColorsEnum.WHITE).toBe('ffffff');
    });
  });

  describe('setBackgroundColor', () => {
    it('should set hex property and return instance', () => {
      const result = a11yColor.setBackgroundColor('ff0000');
      expect(a11yColor.hex).toBe('ff0000');
      expect(result).toBe(a11yColor);
    });

    it('should handle different hex values', () => {
      a11yColor.setBackgroundColor('123456');
      expect(a11yColor.hex).toBe('123456');
    });
  });

  describe('getTextColor', () => {
    it('should return BLACK for light backgrounds', () => {
      a11yColor.setBackgroundColor('ffffff'); // white background
      const textColor = a11yColor.getTextColor();
      expect(textColor).toBe(TextColorsEnum.BLACK);
    });

    it('should return WHITE for dark backgrounds', () => {
      a11yColor.setBackgroundColor('000000'); // black background
      const textColor = a11yColor.getTextColor();
      expect(textColor).toBe(TextColorsEnum.WHITE);
    });

    it('should return WHITE for medium-dark backgrounds', () => {
      a11yColor.setBackgroundColor('333333'); // dark gray
      const textColor = a11yColor.getTextColor();
      expect(textColor).toBe(TextColorsEnum.WHITE);
    });

    it('should return BLACK for medium-light backgrounds', () => {
      a11yColor.setBackgroundColor('cccccc'); // light gray
      const textColor = a11yColor.getTextColor();
      expect(textColor).toBe(TextColorsEnum.BLACK);
    });
  });

  describe('getContrastRatioWith', () => {
    it('should return contrast ratio with another color', () => {
      a11yColor.setBackgroundColor('ffffff');
      const ratio = a11yColor.getContrastRatioWith('000000');
      expect(ratio).toBeCloseTo(21, 0); // White vs Black has max contrast ratio of 21
    });

    it('should return 1 for same colors', () => {
      a11yColor.setBackgroundColor('ff0000');
      const ratio = a11yColor.getContrastRatioWith('ff0000');
      expect(ratio).toBe(1);
    });
  });

  describe('getContrastRatioBetween', () => {
    it('should calculate contrast ratio between white and black', () => {
      const ratio = a11yColor.getContrastRatioBetween('ffffff', '000000');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should calculate contrast ratio between same colors', () => {
      const ratio = a11yColor.getContrastRatioBetween('ff0000', 'ff0000');
      expect(ratio).toBe(1);
    });

    it('should calculate contrast ratio for different colors', () => {
      const ratio = a11yColor.getContrastRatioBetween('ff0000', '00ff00');
      expect(ratio).toBeGreaterThan(1);
    });

    it('should be commutative (order should not matter)', () => {
      const ratio1 = a11yColor.getContrastRatioBetween('ff0000', '00ff00');
      const ratio2 = a11yColor.getContrastRatioBetween('00ff00', 'ff0000');
      expect(ratio1).toBe(ratio2);
    });
  });

  describe('luminance', () => {
    it('should return luminance of current hex', () => {
      a11yColor.setBackgroundColor('ffffff');
      const luminance = a11yColor.luminance();
      expect(luminance).toBe(1);
    });

    it('should return 0 for black', () => {
      a11yColor.setBackgroundColor('000000');
      const luminance = a11yColor.luminance();
      expect(luminance).toBe(0);
    });

    it('should return values between 0 and 1 for other colors', () => {
      a11yColor.setBackgroundColor('808080');
      const luminance = a11yColor.luminance();
      expect(luminance).toBeGreaterThan(0);
      expect(luminance).toBeLessThan(1);
    });
  });

  describe('private method coverage through public methods', () => {
    describe('getLuminance', () => {
      it('should handle low color values (<=0.03928 branch)', () => {
        // Test with very dark colors to trigger the <= 0.03928 branch
        a11yColor.setBackgroundColor('010101'); // Very dark gray
        const luminance = a11yColor.luminance();
        expect(luminance).toBeGreaterThan(0);
        expect(luminance).toBeLessThan(0.1);
      });

      it('should handle high color values (>0.03928 branch)', () => {
        // Test with brighter colors to trigger the > 0.03928 branch
        a11yColor.setBackgroundColor('808080'); // Medium gray
        const luminance = a11yColor.luminance();
        expect(luminance).toBeGreaterThan(0.1);
      });

      it('should calculate luminance for pure red', () => {
        a11yColor.setBackgroundColor('ff0000');
        const luminance = a11yColor.luminance();
        expect(luminance).toBeCloseTo(0.2126, 3);
      });

      it('should calculate luminance for pure green', () => {
        a11yColor.setBackgroundColor('00ff00');
        const luminance = a11yColor.luminance();
        expect(luminance).toBeCloseTo(0.7152, 3);
      });

      it('should calculate luminance for pure blue', () => {
        a11yColor.setBackgroundColor('0000ff');
        const luminance = a11yColor.luminance();
        expect(luminance).toBeCloseTo(0.0722, 3);
      });
    });

    describe('hexToRGB', () => {
      it('should convert hex to RGB correctly through contrast calculation', () => {
        // Test through getContrastRatioBetween to cover hexToRGB
        const ratio = a11yColor.getContrastRatioBetween('ff0000', '00ff00');
        expect(ratio).toBeGreaterThan(1);
      });

      it('should handle different hex formats', () => {
        a11yColor.setBackgroundColor('123456');
        const luminance = a11yColor.luminance();
        expect(luminance).toBeGreaterThan(0);
      });
    });

    describe('hexToDecimal', () => {
      it('should convert hex to decimal through RGB conversion', () => {
        // Test various hex values to ensure hexToDecimal works correctly
        a11yColor.setBackgroundColor('abcdef');
        const luminance = a11yColor.luminance();
        expect(luminance).toBeGreaterThan(0);
        expect(luminance).toBeLessThan(1);
      });

      it('should handle single digit hex values', () => {
        a11yColor.setBackgroundColor('010203');
        const luminance = a11yColor.luminance();
        expect(luminance).toBeGreaterThan(0);
      });

      it('should handle maximum hex values', () => {
        a11yColor.setBackgroundColor('ffffff');
        const luminance = a11yColor.luminance();
        expect(luminance).toBe(1);
      });
    });
  });

  describe('edge cases and complex scenarios', () => {
    it('should handle borderline contrast ratios for text color selection', () => {
      // Test colors that are close to the decision boundary
      a11yColor.setBackgroundColor('777777');
      const textColor = a11yColor.getTextColor();
      expect([TextColorsEnum.BLACK, TextColorsEnum.WHITE]).toContain(textColor);
    });

    it('should work with method chaining', () => {
      const result = a11yColor.setBackgroundColor('ff0000').getTextColor();
      expect([TextColorsEnum.BLACK, TextColorsEnum.WHITE]).toContain(result);
    });

    it('should maintain consistency in calculations', () => {
      a11yColor.setBackgroundColor('888888');
      const luminance1 = a11yColor.luminance();
      const luminance2 = a11yColor.luminance();
      expect(luminance1).toBe(luminance2);
    });

    it('should handle all color channel combinations', () => {
      // Test to ensure all RGB channels are processed in luminance calculation
      const testColors = ['ff0000', '00ff00', '0000ff', 'ffff00', 'ff00ff', '00ffff'];
      
      testColors.forEach(color => {
        a11yColor.setBackgroundColor(color);
        const luminance = a11yColor.luminance();
        expect(luminance).toBeGreaterThanOrEqual(0);
        expect(luminance).toBeLessThanOrEqual(1);
      });
    });
  });
});