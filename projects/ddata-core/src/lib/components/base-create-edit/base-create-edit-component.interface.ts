import { BaseModelInterface } from '../../models/base/base-model.model';
import { EventEmitter } from '@angular/core';
import { HelperServiceInterface } from '../../services/helper/helper-service.interface';

export interface BaseCreateEditComponentInterface<T extends BaseModelInterface<T>> {
  isModal: boolean;
  saveToStorage: boolean;
  model: T;
  data: unknown;
  saveModel: EventEmitter<T>;
  helperService: HelperServiceInterface<T>;

  load(): void;
  save(): void;
  saveAsNew(): void;
  stepBack(): void;
}
