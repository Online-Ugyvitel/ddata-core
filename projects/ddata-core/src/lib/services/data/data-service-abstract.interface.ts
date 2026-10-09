/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DataServiceAbstractInterface<T> {
  hydrateArray(data: Array<any>): Array<T>;
  hydrate(fromModel: any, datas: any): any;
}
