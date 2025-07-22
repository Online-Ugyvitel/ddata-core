import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyJson',
  standalone: true
})
export class PrettyJsonPipe implements PipeTransform {
  transform(json: unknown): string {
    let jsonString: string;

    if (typeof json !== 'string') {
      jsonString = JSON.stringify(json, null, 2);
    } else {
      jsonString = json;
    }
    const escapedJson = jsonString
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escapedJson;
  }
}
