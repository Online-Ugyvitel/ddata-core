import { Observable, BehaviorSubject } from 'rxjs';
import { Type } from '@angular/core';

export interface OptionsInterface {
  saveModel?: Observable<unknown>;
  select?: Observable<unknown>;
  isModal?: boolean;
  multipleSelectEnabled?: boolean;
  isSelectionList?: boolean;
  selectedElements?: Array<unknown>;
  models?: Array<unknown>;
  loadData?: boolean;
  filter?: unknown;
  datasArrived?: BehaviorSubject<number>;
}

export interface DialogContentInterface extends OptionsInterface {
  component: unknown;
  data: unknown;
}

export interface DialogContentWithOptionsInterface {
  createEditComponent?: Type<unknown>;
  createEditOptions?: OptionsInterface;
  listComponent?: Type<unknown>;
  listOptions?: OptionsInterface;
}
