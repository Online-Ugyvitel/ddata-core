import { Pipe } from "@angular/core";

@Pipe({
    name: "prettyJson",
    standalone: false
})
export class PrettyJsonPipe {
  transform(json: any, args?: any): string {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }

    json = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return json;
  }
}
