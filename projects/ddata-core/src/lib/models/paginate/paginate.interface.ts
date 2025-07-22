// tslint:disable: variable-name
/* eslint-disable @typescript-eslint/no-explicit-any */

export class PaginateInterface {
  current_page: number;
  per_page: number;
  from: number;
  to: number;
  data: Array<any> = [];
  total: number;
  last_page: number;
}
