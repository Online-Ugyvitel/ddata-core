import { Type } from '@angular/core';

export class DialogContentItem {
  constructor(
    public component: Type<unknown>,
    public data: unknown
  ) {}
}
