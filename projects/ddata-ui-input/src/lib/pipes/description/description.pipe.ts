import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'description',
    standalone: false
})
export class DescriptionPipe implements PipeTransform {

  transform(value: string): any {
    value = !!value ? value : '';
    let result = '';
    const parts = value.split('|');

    parts.forEach((part: string) => {
      part = part.replace(new RegExp(/^tel:(.*?)$/), '<a href="tel:$1" class="mr-3">$1</a>');
      part = part.replace(new RegExp(/^email:(.*?)$/), '<a href="mailto:$1" class="mr-3">$1</a>');
      part = part.replace(new RegExp(/^url:(.*?)$/), '<a href="$1" class="mr-3" target="_blank">$1</a>');
      part = part.replace(new RegExp(/^description:(.*?)$/), '<span class="description">$1</span>');

      result += part + ' ';
    });

    return result;
  }

}
