import { Observable } from 'rxjs';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { FileUploadProcessInterface } from '../../models/file/file-upload-process.interface';
import { DataServiceAbstractInterface } from '../data/data-service-abstract.interface';

export interface ProxyServiceInterface<T extends BaseModelInterface<T>>
  extends DataServiceAbstractInterface<T> {
  getOne(id: number): Observable<T>;
  getAll(pageNumber?: number): Observable<PaginateInterface>;
  getAllSortedBy(fieldName?: string): Observable<Array<T>>;
  getAllSortedByDesc(fieldName: string): Observable<Array<T>>;
  getAllWithoutPaginate(): Observable<Array<T>>;
  getPage(pageNumber: number): Observable<PaginateInterface>;
  getUri(uri: string): Observable<any>;

  findById(id: number): Observable<T>;
  findByField(fieldName: string, value: any): Observable<T>;
  filterByField(fieldName: string, value: any): Observable<Array<T>>;
  search(data: any, pageNumber: number): Observable<PaginateInterface>;
  searchWithoutPaginate(data: any): Observable<Array<T>>;

  postUri(data: any, uri: string): Observable<any>;

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
