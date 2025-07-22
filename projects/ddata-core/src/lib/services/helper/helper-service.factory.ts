import { HelperServiceInterface } from './helper-service.interface';
import { HelperService } from './helper.service';
import { BaseModelInterface } from '../../models/base/base-model.model';

export class HelperFactoryService<T extends BaseModelInterface<T>> {
  constructor() {}

  get(newable: new () => T): HelperServiceInterface<T> {
    const instance = new newable();

    return new HelperService<T>(instance);
  }
}
