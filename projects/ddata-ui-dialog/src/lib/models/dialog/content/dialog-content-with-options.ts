import { Type } from '@angular/core';

export interface DialogContentOptionsInterface {
  [key: string]: unknown;
}

export class DialogContentWithOptions {
  constructor(
    public component: Type<unknown>,
    public options: DialogContentOptionsInterface
  ) {}
}
