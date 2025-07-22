export interface RgbInterface {
  r: number;
  g: number;
  b: number;
}

export enum TextColorsEnum {
  BLACK = '000000',
  WHITE = 'ffffff'
}

export class A11yColor {
  hex: string;

  /**
   * Takes in hex string without '#'
   */
  setBackgroundColor(hex: string): A11yColor {
    this.hex = hex;

    return this;
  }

  /**
   * Returns either TextColorsEnum.BLACK / WHITE
   *
   * @returns TextColorsEnum
   */
  getTextColor(): TextColorsEnum {
    return this.getContrastRatioWith(TextColorsEnum.BLACK) >
      this.getContrastRatioWith(TextColorsEnum.WHITE)
      ? TextColorsEnum.BLACK
      : TextColorsEnum.WHITE;
  }

  /**
   * Returns contrast ratio with a second color
   * @param hex string
   * @returns number
   */
  getContrastRatioWith(hex: string): number {
    return this.getContrastRatioBetween(this.hex, hex);
  }

  /**
   * Calculates contrast ratio between two hex strings
   *
   * @param hex1 string
   * @param hex2 string
   * @returns number
   */
  getContrastRatioBetween(hex1: string, hex2: string): number {
    const lum1 = this.getLuminance(hex1);
    const lum2 = this.getLuminance(hex2);

    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  }

  /**
   * Returns luminance as a number between 0 and 1
   */
  luminance(): number {
    return this.getLuminance(this.hex);
  }

  /**
   * Calculates relative luminance given a hex string
   *
   * @param hex string
   * @returns number
   */
  private getLuminance(hex: string): number {
    const rgb: RgbInterface = this.hexToRGB(hex);

    Object.keys(rgb).forEach((key: string) => {
      let color: number = rgb[key];

      color /= 255;

      color = color > 0.03928 ? Math.pow((color + 0.055) / 1.055, 2.4) : (color /= 12.92);

      rgb[key] = color;
    });

    return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
  }

  /**
   * Converts a hex string to RgbInterface
   * as the keys and their respective values
   *
   * @param hex string
   * @returns RgbInterface
   */
  private hexToRGB(hex: string): RgbInterface {
    const r = this.hexToDecimal(hex.substring(0, 2));
    const g = this.hexToDecimal(hex.substring(2, 4));
    const b = this.hexToDecimal(hex.substring(4, 6));

    return { r, g, b };
  }

  /**
   * Converts hex string to decimal number
   *
   * @param hex string
   * @returns number
   */
  private hexToDecimal(hex: string): number {
    return parseInt(hex, 16);
  }
}
