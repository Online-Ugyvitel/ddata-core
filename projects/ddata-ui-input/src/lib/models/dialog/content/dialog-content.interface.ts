import { Observable, BehaviorSubject } from 'rxjs';
import { Type } from '@angular/core';

export interface OptionsInterface {
  saveModel?: Observable<any>;
  select?: Observable<any>;
  isModal?: boolean;
  multipleSelectEnabled?: boolean;
  isSelectionList?: boolean;
  selectedElements?: any[];
  models?: any[];
  loadData?: boolean;
  filter?: any;
  datasArrived?: BehaviorSubject<number>;
}

export interface DialogContentInterface extends OptionsInterface {
  component: any;
  data: any;
}

export interface DialogContentWithOptionsInterface {
  createEditComponent?: Type<any>;
  createEditOptions?: OptionsInterface;
  listComponent?: Type<any>;
  listOptions?: OptionsInterface;
}
