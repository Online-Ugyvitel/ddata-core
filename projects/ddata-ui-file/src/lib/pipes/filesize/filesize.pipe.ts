import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filesize',
  standalone: false
})
export class FilesizePipe implements PipeTransform {
  transform(value: number, unit?: string, decimals?: number): number | null {
    if (!value) {
      return null;
    }
    let actualDecimals = decimals;

    if (!actualDecimals || actualDecimals < 0) {
      actualDecimals = 0;
    }
    let convertedValue = value;

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
