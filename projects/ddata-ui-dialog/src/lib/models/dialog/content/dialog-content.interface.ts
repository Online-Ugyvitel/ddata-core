import { Observable } from 'rxjs';
import { Type } from '@angular/core';
import { BaseModelWithoutTypeDefinitionInterface } from 'ddata-core';

interface DialogOptionsInterface {
  saveModel?: Observable<BaseModelWithoutTypeDefinitionInterface>;
  select?: Observable<BaseModelWithoutTypeDefinitionInterface>;
  isModal?: boolean;
  multipleSelectEnabled?: boolean;
  isSelectionList?: boolean;
  selectedElements?: Array<BaseModelWithoutTypeDefinitionInterface>;
  models?: Array<BaseModelWithoutTypeDefinitionInterface>;
  loadData?: boolean;
  filter?: Record<string, unknown>;
  datasArrived?: number;
}

export interface DialogContentInterface extends DialogOptionsInterface {
  component: Type<unknown>;
  data: Record<string, unknown>;
}

export interface DialogContentWithOptionsInterface {
  createEditComponent?: Type<unknown>;
  createEditOptions?: DialogOptionsInterface;
  listComponent?: Type<unknown>;
  listOptions?: DialogOptionsInterface;
}
