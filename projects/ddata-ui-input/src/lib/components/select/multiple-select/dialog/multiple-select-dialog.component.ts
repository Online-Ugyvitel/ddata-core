import {
  ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewContainerRef
} from '@angular/core';
import { BaseModelInterface, FieldsInterface } from 'ddata-core';
import { ComponentRendererService } from '../../../../services/select/component-renderer.service';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DialogContentWithOptionsInterface } from '../../../../models/dialog/content/dialog-content.interface';
import { SelectType } from '../../select.type';

@Component({
    selector: 'multiple-select-dialog',
    templateUrl: './multiple-select-dialog.component.html',
    styleUrls: ['./multiple-select-dialog.component.scss'],
    standalone: false
})
export class DdataMultipleSelectDialogComponent implements OnInit {
  private componentRendererService: ComponentRendererService;
  private componentRef: any;
  private subscription: Subscription = new Subscription();
  private selectedModel: any;

  @Input() settings: DialogContentWithOptionsInterface;
  @Input() method: 'create-edit' | 'list' = 'list';
  @Input() mode: SelectType = 'multiple';

  // for example: an Address model
  @Input() model: BaseModelInterface<any> & FieldsInterface<any>;

  // for example: tag_id
  @Input() field = 'id';

  // for example: tag's name
  @Input() text = 'name';

  // for example: tag.id
  @Input() valueField = 'id';

  // for example: Array of Tag
  @Input() items: any[] = [];
  @Input() modalTitle = 'Dialog';

  @Output() selectionFinished: EventEmitter<any> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() selectModel: EventEmitter<any> = new EventEmitter();

  @ViewChild('dialogHost', { read: ViewContainerRef }) dialogHost: ViewContainerRef;

  // close dialog on esc
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    this.selectionFinished.emit();
  }

  constructor(readonly changeDetector: ChangeDetectorRef) {
    this.componentRendererService = new ComponentRendererService(changeDetector);
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
        this.componentRendererService.setSelectedModels([
          selectedModel
        ]);
      }
    }

    if (this.mode === 'multiple') {
      this.componentRendererService.setSelectedModels(
        this.model[this.field]
      );
    }

    // for edit component
    this.subscription.add(instance.saveModel.subscribe((model: any) => this.setModel(model)));

    this.subscription.add(
      instance.select.pipe(
        tap(() => {
          if (this.mode === 'multiple') {
            this.model[this.field] = [];
            this.settings.listOptions.selectedElements = [];
          }
        }),

        map((models: any[]) => {
          if (models === null) {
            return models;
          }

          this.emitEvents(models);

          return models;
        }),
      ).subscribe()
    );
  }

  private getSelectedItems(): void {
    if (this.mode === 'single') {
      this.selectedModel = this.model[this.field];
    }
  }

  hideModal(): void {
    // get dialog component instance
    const selectedElements = this.componentRendererService.getSelectedModels();

    // emit selected elements
    this.emitEvents(selectedElements);

    // reset selected elements
    this.componentRendererService.resetSelectedModels();
  }

  private emitEvents(models: any[]): void {
    models.forEach((model: any) => {
      // this must be happen on multiple select and on signle select case too
      this.selectModel.emit(model);
    });

    this.selectionFinished.emit(models);
  }

  private getObjectFieldName(): string {
    return this.field.split('_id')[0];
  }

  private setModel(model: any): any {
    // TODO test this on edit case
  }
}
