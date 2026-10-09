import { ProxyServiceInterface } from './proxy-service.interface';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { ProxyService } from './proxy.service';

export class ProxyFactoryService<T extends BaseModelInterface<T>> {
  constructor() {}

  get(newable: new () => T): ProxyServiceInterface<T> {
    const instance = new newable();

    return new ProxyService<T>(instance);
  }
}
