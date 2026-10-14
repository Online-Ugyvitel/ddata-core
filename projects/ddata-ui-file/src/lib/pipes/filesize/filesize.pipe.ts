import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filesize',
  standalone: false
})
export class FilesizePipe implements PipeTransform {
  transform(value: number, unit?: string, decimals?: number): number | null {
    // a template can pass the size as a string too, and a file size can not be negative or infinite
    const numericValue = Number(value);

    if (!value || !Number.isFinite(numericValue) || numericValue < 0) {
      return null;
    }
    let actualDecimals = decimals;

    if (!actualDecimals || actualDecimals < 0) {
      actualDecimals = 0;
    }
    let convertedValue = numericValue;

    if (unit === 'kb') {
      convertedValue = convertedValue / 1024;
    }

    if (unit === 'mb') {
      convertedValue = convertedValue / 1024 / 1024;
    }

    if (unit === 'gb') {
      convertedValue = convertedValue / 1024 / 1024 / 1024;
    }
    const finalValue = Number(convertedValue.toFixed(actualDecimals));

    return finalValue;
  }
}
