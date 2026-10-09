import { EventEmitter } from '@angular/core';
import { SelectableInterface } from '../../models/selectable/selectable.interface';

export interface DdataSelectableListElementButtonComponentInterface {
  model: SelectableInterface;

  choosed: EventEmitter<SelectableInterface>;

  chooseSelect(model: SelectableInterface): void;
}
