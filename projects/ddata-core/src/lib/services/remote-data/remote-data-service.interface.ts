/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ID } from '../../models/base/base-data.type';
import { FileUploadProcessInterface } from '../../models/file/file-upload-process.interface';
import {
  BulkUpdateValuesInterface,
  ListFacetsInterface,
  ListNeighborsInterface,
  ListQueryInterface,
  ListViewInterface
} from '../../models/list/list-query.interface';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { DataServiceAbstractInterface } from '../data/data-service-abstract.interface';
import { RequestHeaders } from './request-headers.type';

export interface RemoteDataServiceInterface<T> extends DataServiceAbstractInterface<T> {
  setupHeaders(): void;

  getAll(pageNumber?: number): Observable<PaginateInterface>;
  getAllWithoutPaginate(): Observable<Array<T>>;
  getPage(pageNumber: number, uniqueUrl?: string): Observable<PaginateInterface>;
  getOne(id: number): Observable<T>;
  getUri(uri: string, headers?: RequestHeaders): Observable<T>;

  save(data: T): Observable<number | boolean>;

  //  deepcode ignore no-any: we can't predict what type of data will be returned
  postUri(resource: any, uri: string, headers?: RequestHeaders): Observable<any>;
  putUri(resource: any, uri: string, headers?: RequestHeaders): Observable<any>;

  delete(model: T): Observable<number>;
  deleteMultiple(models: Array<T>): Observable<{}>;

  views(query?: ListQueryInterface): Observable<Array<ListViewInterface>>;
  facets(fields: Array<string>, query?: ListQueryInterface): Observable<ListFacetsInterface>;
  neighbors(id: ID, query?: ListQueryInterface): Observable<ListNeighborsInterface>;
  restore(model: T): Observable<boolean>;
  restoreMultiple(ids: Array<ID>): Observable<boolean>;
  updateMultiple(ids: Array<ID>, values: BulkUpdateValuesInterface): Observable<boolean>;

  //  deepcode ignore no-any: we can't predict what type of data will be send as 'data'
  sendFiles(
    uri: string,
    id: number,
    files: Set<File>,
    data?: any
  ): Array<Observable<FileUploadProcessInterface>>;

  handleError(error: HttpErrorResponse): void;
}
