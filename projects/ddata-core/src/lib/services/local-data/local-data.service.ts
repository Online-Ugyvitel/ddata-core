import { Observable, Subject } from 'rxjs';
import { ID } from '../../models/base/base-data.type';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { DataServiceAbstract } from '../data/data-service.abstract';
import { SorterServiceInterface } from '../sorter/sorter-service.interface';
import { SorterService } from '../sorter/sorter.service';
import { StorageServiceInterface } from '../storage/storage-service.interface';
import { StorageService } from '../storage/storage.service';
import { LocalDataServiceInterface } from './local-data-service.interface';
import pluralize from 'pluralize';
import { Injectable } from '@angular/core';

// @dynamic
@Injectable({
  providedIn: 'root'
})
export class LocalDataService<T extends BaseModelInterface<T>>
  extends DataServiceAbstract<T>
  implements LocalDataServiceInterface<T>
{
  private readonly storageService: StorageServiceInterface = new StorageService();
  private readonly sorterService: SorterServiceInterface<T> = new SorterService<T>();
  private readonly storageSubject = new Subject<boolean>();
  private readonly localStorageItemName: string = '';
  private db: Array<T> = [];
  private readonly copyOfModel: T;

  constructor(model: T) {
    super(model);
    this.localStorageItemName = this.convertTitleCaseToSnakeCase(pluralize(model.model_name));
    this.allFromLocal();
    this.copyOfModel = { ...model };
  }

  private convertTitleCaseToSnakeCase(str: string): string {
    return str.replace(/\.?([A-Z]+)/g, (x, y) => `_${y.toLowerCase()}`).replace(/^_/, '');
  }

  watch(): Observable<any> {
    return this.storageSubject.asObservable();
  }

  /**
   * Get all items from localStorage as T[]
   */
  allFromLocal(): Array<T> {
    const data = JSON.parse(localStorage.getItem(this.localStorageItemName)) || [];

    this.db = this.hydrateArray(data);

    return this.db;
  }

  /**
   * Delete current id from database,  and refresh localstorage.
   *
   * @param item T object
   * @param paginate Paginate object
   *
   * @return Paginate object or null - if null returns, LocalStorage isn't updated
   */
  delete(model: T): boolean {
    if (!model) {
      return false;
    }
    const index = this.db.indexOf(model);

    this.db.splice(index, 1);
    this.updateLocalstorage(this.db);

    return true;
  }

  updateLocalstorage(data: Array<T>): void {
    this.storageService.setItem(this.localStorageItemName, JSON.stringify(data));
    this.allFromLocal();
    this.storageSubject.next(true);
  }

  /**
   * Get all sorted(asc) items from localStroage as T[]
   *
   * @param fieldName string
   */
  allFromLocalSortedBy(fieldName: string): Array<T> {
    return this.sorterService.sortBy(this.db, fieldName);
  }

  /**
   * Get all sorted(desc) items from localStroage as T[]
   *
   * @param fieldName string
   */
  allFromLocalSortedByDesc(fieldName: string): Array<T> {
    return this.sorterService.sortByDesc(this.db, fieldName);
  }

  /**
   * Find one item by ID in localStorage, return as T object.
   *
   * @param id unique ID of item
   */
  findById(id: number): T {
    return this.db.find((item) => item.id === Number(id)) || this.copyOfModel.init();
  }

  /**
   * Find one item by the given field, return as T object.
   *
   * @param field field name where search the expression.
   * @param value the value what search in the given field.
   */
  findByField(field: string, value: any): T {
    return this.db.find((obj) => obj[field] === value) || null;
  }

  /**
   * Find one item by the given field, return as T object
   *
   * @param field field name where search the expression.
   * @param value the value what search in the given field.
   */
  filterByField(field: string, value: any): Array<T> {
    return this.db.filter((obj) => obj[field] === value) || null;
  }

  /**
   * Save a model into localstorage.
   *
   * @param model model to save
   * @param id ID of model
   */
  save(model: T, id: number): void {
    if (model.id === 0) {
      model.id = id as ID;
      this.db.push(model);
      this.updateLocalstorage(this.db);
    } else {
      const oldModel = this.db.find((m) => m.id === model.id);
      const index = this.db.indexOf(oldModel);

      this.db[index] = model;
      this.updateLocalstorage(this.db);
    }
  }
}
