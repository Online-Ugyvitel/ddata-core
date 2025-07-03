import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filesize',
    standalone: false
})
export class FilesizePipe implements PipeTransform {

  transform(value: number, unit?: string, decimals?: number): any {
    if (!value) {
      return null;
    }
    if (!decimals || decimals < 0) {
      decimals = 0;
    }

    if ( unit === 'kb' ) {
      value = value / 1024;
    }

    if ( unit === 'mb' ) {
      value = value / 1024 / 1024;
    }

    if ( unit === 'gb' ) {
      value = value / 1024 / 1024 / 1024;
    }

    value = Number( value.toFixed(decimals) );

    return value;
  }

}
