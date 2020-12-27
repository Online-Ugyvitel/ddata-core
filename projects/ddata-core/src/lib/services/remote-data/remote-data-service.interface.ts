import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadProcessInterface } from '../../models/file/file-upload-process.interface';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { DataServiceAbstractInterface } from '../data/data-service-abstract.interface';

export interface RemoteDataServiceInterface<T> extends DataServiceAbstractInterface<T> {
  setupHeaders(): void;

  getAll(pageNumber?: number): Observable<PaginateInterface>;
  getAllWithoutPaginate(): Observable<T[]>;
  getPage(pageNumber: number, uniqueUrl?: string): Observable<PaginateInterface>;
  getOne(id: number): Observable<T>;
  getUri(uri: string): Observable<T>;

  save(data: T): Observable<number | boolean>;

  //  deepcode ignore no-any: we can't predict what type of data will be returned
  postUri(resource: any, uri: string): Observable<any>;

  delete(model: T): Observable<number>;
  deleteMultiple(models: T[]): Observable<{}>;

  //  deepcode ignore no-any: we can't predict what type of data will be send as 'data'
  sendFiles(uri: string, id: number, files: Set<File>, data?: any): Observable<FileUploadProcessInterface>[];

  handleError(error: HttpErrorResponse): void;
}
