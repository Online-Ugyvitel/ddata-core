import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

export interface SelectableListComponentInterface<T> {
  isModal: boolean;
  multipleSelectEnabled: boolean;
  isSelectionList: boolean;
  loadData: boolean;
  selectedElements: Array<T>;

  removeSelection: EventEmitter<Array<T>>;
  setSelection: EventEmitter<Array<T>>;
  emitSelected: EventEmitter<Array<T>>;

  datasArrived: Observable<number>;
  select: Observable<Array<T>>;

  toggleSelect(model: T): void;
  chooseSelect(): void;
}
