export interface DataServiceAbstractInterface<T> {
  hydrateArray(data: Array<any>): Array<T>;
  hydrate(fromModel: any, datas: any): any;
}
