import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'description',
  standalone: false
})
export class DescriptionPipe implements PipeTransform {
  transform(value: string | null | undefined): unknown {
    const transformValue = !!value ? value : '';
    let result = '';
    const parts = transformValue.split('|');

    parts.forEach((part: string) => {
      let processedPart = part.replace(
        new RegExp(/^tel:(.*?)$/),
        '<a href="tel:$1" class="mr-3">$1</a>'
      );

      processedPart = processedPart.replace(
        new RegExp(/^email:(.*?)$/),
        '<a href="mailto:$1" class="mr-3">$1</a>'
      );
      processedPart = processedPart.replace(
        new RegExp(/^url:(.*?)$/),
        '<a href="$1" class="mr-3" target="_blank">$1</a>'
      );
      processedPart = processedPart.replace(
        new RegExp(/^description:(.*?)$/),
        '<span class="description">$1</span>'
      );

      result += `${processedPart} `;
    });

    return result;
  }
}
