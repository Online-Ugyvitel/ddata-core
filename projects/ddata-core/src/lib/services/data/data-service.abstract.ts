/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-ordering */
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { Paginate } from '../../models/paginate/paginate.model';

export abstract class DataServiceAbstract<T> {
  constructor(public model: T) {}

  /**
   * Create a new PaginateInterface object with returned datas. This function will be convert datas to living
   * models.
   *
   * @param type data instance type in paginator
   * @param result returned data from backend
   *
   * @returns PaginateInterface
   */
  protected getNewPaginateObject(type: any, returnedPaginateObject: any): PaginateInterface {
    const paginate = this.hydrate(new Paginate(type), returnedPaginateObject);

    paginate.data = this.hydrateArray(returnedPaginateObject.data);

    return paginate;
  }

  /**
   * Create a living models from any JSON data.
   *
   * @param data any JSON object
   */
  hydrateArray(data: Array<any>): Array<T> {
    const models: Array<T> = [];

    data.forEach((item: any) => {
      // to deep clone we need to clear this.model's arrays
      for (const key of Object.keys(this.model)) {
        if (this.model[key] instanceof Array) {
          this.model[key] = [];
        }
      }
      // copy `this.model` into a clone object
      const newModel = this.hydrate(this.model, this.model);

      // initialize the new model with the instance of datas
      newModel.init(item);

      // push new model into the initialized, clone models array
      models.push(newModel);
    });

    return models;
  }

  /**
   * Create new clone instance from any object.
   *
   * @param fromModel object what you want to clone
   * @param datas datas what you want to put into the clone object
   */
  hydrate = (fromModel: any, datas: any): any =>
    Object.assign(Object.create(Object.getPrototypeOf(fromModel)), datas);
}
