/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { HelperServiceInterface } from '../../services/helper/helper-service.interface';

export interface BaseListComponentInterface<T extends BaseModelInterface<T>> {
  isModal: boolean;
  isEmbed: boolean;
  loadData: boolean;
  models: Array<T>;
  filter: any;
  data: any;

  editModel: EventEmitter<T>;
  deleteModel: EventEmitter<T>;
  deleteMultipleModels: EventEmitter<Array<T>>;
  saveModel: EventEmitter<T>;

  model: T;
  paginate: PaginateInterface;
  transformToLowerCase: boolean;
  helperService: HelperServiceInterface<T>;
  activatedRoute: ActivatedRoute;
  currentPageNumber: number;

  /**
   * Load datas. If you set `filter` options the request will be a "search" (POST request), otherwise the request
   * will be a "get all" (GET request). Of course only if the model not use the LocalStorage.
   */
  load(): void;

  /**
   * Reverse the model's boolean value and send to the storage the change to save.
   *
   * @param model any model
   * @param field model's field
   */
  toggleCheckbox(model: T, field: string): void;

  /**
   * Call on start editing a model. If model use LocalStorage it will present an emit, otherwise it will navigate
   * to the `/{model.api_endpoint}/edit/{model.id}`. Use only if the model has `id` and it's not `0`.
   */
  edit(model: T): void;

  /**
   * Delete a model instance. If the component used as child (`isEmbed`) it will do a splice only and nothing to
   * save. Otherwise it will send a delete request to the storage.
   *
   * @param model instance to delete
   */
  delete(model: T): void;

  /**
   * Delete multiple models in one move.
   *
   * @param models instances of model
   */
  deleteMultiple(models: Array<T>): void;

  /**
   * Change the page and looad datas. If you set `filter` options the request will be a "search" (POST request),
   * otherwise the request will be a "get all" (GET request). Of course only if the model not use the LocalStorage.
   *
   * @param turnToPage number of new page
   */
  changePage(turnToPage: number): void;

  /**
   * Save the model.
   *
   * @param model instance of model
   */
  save(model: T): void;
}
