import { Observable } from 'rxjs';
import { Type } from '@angular/core';

interface DialogOptionsInterface {
  saveModel?: Observable<any>;
  select?: Observable<any>;
  isModal?: boolean;
  multipleSelectEnabled?: boolean;
  isSelectionList?: boolean;
  selectedElements?: any[];
  models?: any[];
  loadData?: boolean;
  filter?: any;
  datasArrived?: number;
}

export interface DialogContentInterface extends DialogOptionsInterface {
  component: any;
  data: any;
}

export interface DialogContentWithOptionsInterface {
  createEditComponent?: Type<any>;
  createEditOptions?: DialogOptionsInterface;
  listComponent?: Type<any>;
  listOptions?: DialogOptionsInterface;
}
