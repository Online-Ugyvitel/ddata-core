import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { PaginateInterface } from '../../models/paginate/paginate.interface';

export interface HelperServiceInterface<T extends BaseModelInterface<T>> {
  booleanChange(model: T, fieldName: string): Observable<boolean | Observable<boolean>>;
  save(
    model: T,
    isModal: boolean,
    emitter: EventEmitter<T>,
    saveBackend?: boolean,
    navigateAfterSuccess?: string
  ): Observable<boolean | Observable<boolean> | number | Observable<number>>;
  saveAsNew(model: T): Observable<boolean | Observable<boolean> | number | Observable<number>>;

  edit(model: T, reference: any): void;

  delete(model: T, reference: any): Observable<boolean>;
  deleteMultiple(models: Array<T>, reference: any): Observable<boolean>;

  stepBack(model: T, isModal: boolean, emitter: EventEmitter<T>): void;
  changeToPage(
    turnToPage: number,
    paginate: PaginateInterface,
    models: Array<T>
  ): Observable<boolean>;

  getOne(
    model: T,
    isModal: boolean,
    handleLoader?: boolean
  ): Observable<boolean | Observable<boolean>>;
  getAll(
    paginate: PaginateInterface,
    models: Array<T>,
    isModal?: boolean,
    pageNumber?: number
  ): Observable<PaginateInterface>;

  search(data: any, pageNumber?: number): Observable<PaginateInterface>;
  searchWithoutPaginate(data: any): Observable<Array<T>>;
}
