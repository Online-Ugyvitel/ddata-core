import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ComponentRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  AfterViewInit
} from '@angular/core';
import { BaseModelInterface, FieldsInterface } from 'ddata-core';
import { ComponentRendererService } from '../../../../services/select/component-renderer.service';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DialogContentWithOptionsInterface } from '../../../../models/dialog/content/dialog-content.interface';
import { SelectType } from '../../select.type';

@Component({
  selector: 'dd-multiple-select-dialog',
  templateUrl: './multiple-select-dialog.component.html',
  styleUrls: ['./multiple-select-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DdataMultipleSelectDialogComponent implements OnInit, AfterViewInit {
  @Input() settings: DialogContentWithOptionsInterface;
  @Input() method: 'create-edit' | 'list' = 'list';
  @Input() mode: SelectType = 'multiple';

  // for example: an Address model
  @Input() model: BaseModelInterface<unknown> & FieldsInterface<unknown>;

  // for example: tag_id
  @Input() field = 'id';

  // for example: tag's name
  @Input() text = 'name';

  // for example: tag.id
  @Input() valueField = 'id';

  // for example: Array of Tag
  @Input() items: Array<unknown> = [];
  @Input() modalTitle = 'Dialog';

  @Output() readonly selectionFinished: EventEmitter<unknown> = new EventEmitter();
  @Output() readonly selected: EventEmitter<unknown> = new EventEmitter();
  @Output() readonly selectModel: EventEmitter<unknown> = new EventEmitter();

  @ViewChild('dialogHost', { read: ViewContainerRef }) dialogHost: ViewContainerRef;

  private readonly componentRendererService: ComponentRendererService;
  private readonly componentRef: ComponentRef<unknown>;
  private readonly subscription: Subscription = new Subscription();
  private selectedModel: unknown;

  constructor(readonly changeDetector: ChangeDetectorRef) {
    this.componentRendererService = new ComponentRendererService(changeDetector);
  }

  // close dialog on esc
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: KeyboardEvent
  ): void {
    this.selectionFinished.emit();
  }

  ngOnInit(): void {
    // get selected items from model's field
    this.getSelectedItems();
  }

  ngAfterViewInit(): void {
    // render component in dialog
    const instance = this.componentRendererService
      .setMethod(this.method)
      .setSettings(this.settings)
      .setDialogHost(this.dialogHost)
      .setComponentRef(this.componentRef)
      .render();

    if (!instance) {
      console.error('Component for dialog is not defined');

      return;
    }

    if (this.mode === 'single') {
      const selectedModel = this.model[this.getObjectFieldName()];

      if (!!selectedModel) {
        this.componentRendererService.setSelectedModels([selectedModel]);
      }
    }

    if (this.mode === 'multiple') {
      this.componentRendererService.setSelectedModels(this.model[this.field]);
    }

    // for edit component
    this.subscription.add(instance.saveModel.subscribe((model: unknown) => this.setModel(model)));

    this.subscription.add(
      instance.select
        .pipe(
          tap(() => {
            if (this.mode === 'multiple') {
              this.model[this.field] = [];
              this.settings.listOptions.selectedElements = [];
            }
          }),

          map((models: Array<unknown>) => {
            if (models === null) {
              return models;
            }

            this.emitEvents(models);

            return models;
          })
        )
        .subscribe()
    );
  }

  hideModal(): void {
    // get dialog component instance
    const selectedElements = this.componentRendererService.getSelectedModels();

    // emit selected elements
    this.emitEvents(selectedElements);

    // reset selected elements
    this.componentRendererService.resetSelectedModels();
  }

  private getSelectedItems(): void {
    if (this.mode === 'single') {
      this.selectedModel = this.model[this.field];
    }
  }

  private emitEvents(models: Array<unknown>): void {
    models.forEach((model: unknown) => {
      // this must be happen on multiple select and on signle select case too
      this.selectModel.emit(model);
    });

    this.selectionFinished.emit(models);
  }

  private getObjectFieldName(): string {
    return this.field.split('_id')[0];
  }

  private setModel(model: unknown): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unused = model;
    // TODO test this on edit case
  }
}
