import { Type } from '@angular/core';

export class DialogContentWithOptions {
  constructor(
    public component: Type<unknown>,
    public options: unknown
  ) {}
}
