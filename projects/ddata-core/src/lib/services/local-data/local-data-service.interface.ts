import { Observable } from 'rxjs';
import { DataServiceAbstractInterface } from '../data/data-service-abstract.interface';

export interface LocalDataServiceInterface<T> extends DataServiceAbstractInterface<T> {
  watch(): Observable<any>;
  allFromLocal(): Array<T>;
  save(model: T, id: number): void;
  delete(model: T): boolean;
  updateLocalstorage(data: Array<T>): void;
  allFromLocalSortedBy(fieldName: string): Array<T>;
  allFromLocalSortedByDesc(fieldName: string): Array<T>;
  findById(id: number): T;
  findByField(field: string, value: any): T;
  filterByField(field: string, value: any): Array<T>;
}
