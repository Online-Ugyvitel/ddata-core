import { Component, EventEmitter, Inject, Injectable, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DdataCoreModule } from '../../ddata-core.module';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { Paginate } from '../../models/paginate/paginate.model';
import { HelperFactoryService } from '../../services/helper/helper-service.factory';
import { HelperServiceInterface } from '../../services/helper/helper-service.interface';
import { BaseListComponentInterface } from './base-list-component.interface';

// @dynamic
@Component({
    template: '',
    standalone: false
})
export abstract class BaseListComponent<T extends BaseModelInterface<T>>
  implements OnInit, BaseListComponentInterface<T> {

  @Input() isModal = false;
  @Input() isEmbed = false;
  @Input() loadData = true;
  @Input() models: T[] = [];
  @Input() filter: any = {};
  @Input() set data(value: any) {
    if (!!value) {
      Object.keys(value).forEach((key: string) => {
        if (!!value[key] && key !== 'model' && key !== 'loadData') {
          this[key] = value[key];
        }
      });
    }
  }

  @Output() editModel: EventEmitter<T> = new EventEmitter();
  @Output() deleteModel: EventEmitter<T> = new EventEmitter();
  @Output() deleteMultipleModels: EventEmitter<T[]> = new EventEmitter();
  @Output() saveModel: EventEmitter<T> = new EventEmitter();

  model: T = new this.type().init();
  paginate: PaginateInterface = new Paginate(this.model);
  transformToLowerCase = true;
  helperService: HelperServiceInterface<T> = new HelperFactoryService<T>().get(this.type);
  activatedRoute: ActivatedRoute = DdataCoreModule.InjectorInstance.get<ActivatedRoute>(ActivatedRoute);
  currentPageNumber = 0;

  constructor(
    @Inject('type') private type: new () => T,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  /**
   * Load datas. If you set `filter` options the request will be a "search" (POST request), otherwise the request
   * will be a "get all" (GET request). Of course only if the model not use the LocalStorage.
   */
  load(): void {
    if (!this.loadData) {
      return;
    }

    this.setGetRequest().subscribe((result: PaginateInterface) => {
      this.paginate = result;
      this.models = this.paginate.data;
    });
  }

  /**
   * Set the data loader request based on filter and paginate state.
   */
  private setGetRequest(): Observable<any> {
    if (this.isEmptyObject(this.filter)) {
      // it hasn't got filter options
      return this.helperService.getAll(this.paginate, this.models, this.isModal, this.currentPageNumber);
    } else {
      // it has got filter options
      return this.helperService.search(this.filter, this.currentPageNumber);
    }
  }

  /**
   * Return true if object has any keys. Helps to find out filter has any key or not.
   *
   * @param object JSON object
   */
  private isEmptyObject(object: any): boolean {
    return Object.keys(object).length === 0 && object.constructor === Object;
  }

  /**
   * Reverse the model's boolean value and send to the storage the change to save.
   *
   * @param model any model
   * @param field model's field
   */
  toggleCheckbox(model: T, field: string): void {
    this.helperService.booleanChange(model, field).subscribe();
  }

  /**
   * Call on start editing a model. If model use LocalStorage it will present an emit, otherwise it will navigate
   * to the `/{model.api_endpoint}/edit/{model.id}`. Use only if the model has `id` and it's not `0`.
   */
  edit(model: T): void {
    this.helperService.edit(model, this);
  }

  /**
   * Delete a model instance. If the component used as child (`isEmbed`) it will do a splice only and nothing to
   * save. Otherwise it will send a delete request to the storage.
   *
   * @param model instance to delete
   */
  delete(model: T): void {
    if (this.isEmbed) {
      // delete model from models if the component is an embed child component
      this.models.splice(this.models.indexOf(model), 1);
    } else {
      // delete model via services if component is a main component
      this.helperService.delete(model, this).subscribe();
    }
  }

  /**
   * Delete multiple models in one move.
   *
   * @param models instances of model
   */
  deleteMultiple(models: T[]): void {
    this.helperService.deleteMultiple(models, this).subscribe();
  }

  /**
   * Change the page and looad datas. If you set `filter` options the request will be a "search" (POST request),
   * otherwise the request will be a "get all" (GET request). Of course only if the model not use the LocalStorage.
   *
   * @param turnToPage number of new page
   */
  changePage(turnToPage: number): void {
    this.currentPageNumber = turnToPage;
    this.setGetRequest().subscribe();
  }

  /**
   * Save the model.
   *
   * @param model instance of model
   */
  save(model: T): void {
    this.helperService.save(model, this.isModal, this.saveModel).subscribe();
  }

}
