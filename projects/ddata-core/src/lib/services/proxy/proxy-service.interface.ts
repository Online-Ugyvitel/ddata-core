/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';
import { ID } from '../../models/base/base-data.type';
import { BaseModelInterface } from '../../models/base/base-model.model';
import {
  BulkUpdateValuesInterface,
  ListFacetsInterface,
  ListNeighborsInterface,
  ListQueryInterface,
  ListViewInterface
} from '../../models/list/list-query.interface';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { FileUploadProcessInterface } from '../../models/file/file-upload-process.interface';
import { DataServiceAbstractInterface } from '../data/data-service-abstract.interface';
import { RequestHeaders } from '../remote-data/request-headers.type';

export interface ProxyServiceInterface<
  T extends BaseModelInterface<T>
> extends DataServiceAbstractInterface<T> {
  getOne(id: number): Observable<T>;
  getAll(pageNumber?: number): Observable<PaginateInterface>;
  getAllSortedBy(fieldName?: string): Observable<Array<T>>;
  getAllSortedByDesc(fieldName: string): Observable<Array<T>>;
  getAllWithoutPaginate(): Observable<Array<T>>;
  getPage(pageNumber: number): Observable<PaginateInterface>;
  getUri(uri: string, headers?: RequestHeaders): Observable<any>;

  findById(id: number): Observable<T>;
  findByField(fieldName: string, value: any): Observable<T>;
  filterByField(fieldName: string, value: any): Observable<Array<T>>;
  search(data: ListQueryInterface | any, pageNumber?: number): Observable<PaginateInterface>;
  searchWithoutPaginate(data: ListQueryInterface | any): Observable<Array<T>>;

  views(query?: ListQueryInterface): Observable<Array<ListViewInterface>>;
  facets(fields: Array<string>, query?: ListQueryInterface): Observable<ListFacetsInterface>;
  neighbors(id: ID, query?: ListQueryInterface): Observable<ListNeighborsInterface>;
  restore(model: T): Observable<boolean>;
  restoreMultiple(ids: Array<ID>): Observable<boolean>;
  updateMultiple(ids: Array<ID>, values: BulkUpdateValuesInterface): Observable<boolean>;

  postUri(data: any, uri: string, headers?: RequestHeaders): Observable<any>;
  putUri(data: any, uri: string, headers?: RequestHeaders): Observable<any>;

  save(model: T): Observable<number>;

  delete(model: T, paginate: PaginateInterface): Observable<PaginateInterface>;
  deleteMultiple(
    models: Array<T>,
    paginate: PaginateInterface
  ): Observable<PaginateInterface | Observable<PaginateInterface>>;

  watch(): Observable<boolean>;
  registerObserver(target: Array<T>, sortBy?: string): void;

  sendFiles(
    subUri: string,
    id: number,
    files: Set<File>,
    data?: any
  ): Array<Observable<FileUploadProcessInterface>>;
}
