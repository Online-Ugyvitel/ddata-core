import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { HelperFactoryService } from '../../services/helper/helper-service.factory';
import { HelperServiceInterface } from '../../services/helper/helper-service.interface';
import { BaseCreateEditComponentInterface } from './base-create-edit-component.interface';

/**
 * This abscract class extend your create/edit component some basic functionality, like `load()`, `save()`,
 * `saveAsNew()` and `stepBack()`.
 *
 * In this abstract class we some inputs what you can use or simply overwrite in your component to a static
 * variable. This inputs are:
 *
 * @param isModal `boolean`, default `false` - define this component show as a modal dialog or an a child
 * component. Affect is on all functions. If this is true, then `load()` isn't load datas, but wait a `model`
 * input and `save()` isn't send HTTP requests.
 *
 * @param saveToStorage `boolean`, default `true` - set the `save()` method must send to the storage to
 * save model or just simply emit on `saveModel` output.
 *
 * @param model `T`, defaut an empty `T` model - set an instance of `T` model.
 *
 * @param data `{}`, default null - you can set any properties of the component with `data`.
 *
 * @output `saveModel` `EventEmitter<T>`
 *
 * @see HelperService
 */
// @dynamic
@Component({
  template: '',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @typescript-eslint/naming-convention
export abstract class BaseCreateEditComponent<T extends BaseModelInterface<T>>
  implements OnInit, BaseCreateEditComponentInterface<T>
{
  @Input() isModal = false;
  @Input() saveToStorage = true;
  @Input() model: T = new this.type().init();
  @Input() set data(value: unknown) {
    if (!!value) {
      Object.keys(value).forEach((key: string) => {
        if (!!value[key] && key !== 'model' && key !== 'loadData') {
          this[key] = value[key];
        }
      });
    }
  }

  @Output() readonly saveModel: EventEmitter<T> = new EventEmitter();

  helperService: HelperServiceInterface<T> = new HelperFactoryService<T>().get(this.type);

  constructor(@Inject('type') private readonly type: new () => T) {}

  ngOnInit(): void {
    this.load();
  }

  /**
   * Load one instance of model with a given `id`.
   */
  load(): void {
    this.helperService.getOne(this.model, this.isModal).subscribe();
  }

  /**
   * Save the current model.
   */
  save(): void {
    this.helperService
      .save(this.model, this.isModal, this.saveModel, this.saveToStorage)
      .subscribe();
  }

  /**
   * Save model as a new instance.
   */
  saveAsNew(): void {
    this.helperService.saveAsNew(this.model).subscribe();
  }

  /**
   * If this is a modal dialog emits `null` in `saveModel` output. Otherwise navigate to the
   * `{model.api_endpoint}/list` URL.
   */
  stepBack(): void {
    this.helperService.stepBack(this.model, this.isModal, this.saveModel);
  }
}
