// tslint:disable: variable-name
import { PaginateInterface } from './paginate.interface';

export class Paginate implements PaginateInterface {
  current_page: number;
  per_page: number;
  from: number;
  to: number;
  data: Array<any> = [];
  total: number;
  last_page: number;

  constructor(type: any, data?: any) {
    if (!type) {
      return null;
    }

    data = !!data ? data : {};

    this.current_page = !!data.current_page ? data.current_page : 1;
    this.per_page = !!data.per_page ? data.per_page : 1;
    this.from = !!data.from ? data.from : 1;
    this.to = !!data.to ? data.to : 1;
    this.total = !!data.total ? data.total : 1;
    this.last_page = !!data.last_page ? data.last_page : 1;

    if (!!data.data) {
      data.data.forEach((item: any) => {
        this.data.push(new type().init(item));
      });
    }
  }
}
