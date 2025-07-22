import { EventEmitter } from '@angular/core';

export interface DdataChooseSelectedButtonComponentInterface {
  multipleSelectEnabled;
  choosed: EventEmitter<void>;

  chooseSelect(): void;
}
