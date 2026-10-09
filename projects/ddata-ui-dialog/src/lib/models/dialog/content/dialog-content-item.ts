import { Type } from '@angular/core';

export interface DialogContentDataInterface {
  [key: string]: unknown;
}

export class DialogContentItem {
  constructor(
    public component: Type<unknown>,
    public data: DialogContentDataInterface
  ) {}
}
