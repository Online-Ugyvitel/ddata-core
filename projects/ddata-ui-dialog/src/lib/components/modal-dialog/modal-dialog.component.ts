// tslint:disable-next-line: max-line-length
import { ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { BaseCreateEditComponent, BaseModel, BaseModelInterface, BaseModelWithoutTypeDefinitionInterface } from 'ddata-core';
import { DdataUiNoDataComponent } from 'ddata-ui-common';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogContentItem } from '../../models/dialog/content/dialog-content-item';
import { DialogContentInterface } from '../../models/dialog/content/dialog-content.interface';

@Component({
    selector: 'dd-modal-dialog',
    templateUrl: './modal-dialog.component.html',
    styleUrls: ['./modal-dialog.component.scss'],
    standalone: false
})
export class DdataUiModalDialogComponent implements OnInit {
  isModalVisible = false;
  componentSubscription: Subscription;
  @Input() title = '';
  @Input() model: BaseModelWithoutTypeDefinitionInterface = new BaseModel();
  @Input() dialogContent: DialogContentItem = new DialogContentItem(DdataUiNoDataComponent, {});
  @Input() set showDialog(value: boolean) {
    if (!!value) {
      this.showModal();
    } else {
      this.close();
    }
  }
  @Input() overlayClickCloseDialog = true;
  @Input() closeButtonText = 'Close';

  // tslint:disable-next-line: no-output-native
  @Output() success: EventEmitter<BaseModelWithoutTypeDefinitionInterface> = new EventEmitter();
  @Output() fail: EventEmitter<string> = new EventEmitter();

  @ViewChild('dialogHost', { read: ViewContainerRef }) dialogHost: ViewContainerRef;
  componentRef: any;
  icon = {
    close: faTimes,
  };

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  close(emit: boolean = true): void {
    this.changeModalStatus(false);
    this.componentSubscription?.unsubscribe();

    if (emit) {
      this.fail.emit('close');
    }
  }

  closeWithoutEmit(): void {
    this.close(false);
  }

  showModal(): void {
    this.changeModalStatus(true);
    this.renderComponent();
  }

  private changeModalStatus(isVisible: boolean = false): void {
    this.isModalVisible = isVisible;
    this.changeDetector.detectChanges();
  }

  renderComponent(): void {
    if (!this.dialogContent) {
      return;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.dialogContent.component);

    this.dialogHost.clear();

    this.componentRef = this.dialogHost.createComponent(componentFactory);
    if (!!this.dialogContent.data.model) {
      // tslint:disable-next-line: max-line-length
      (this.componentRef.instance as BaseCreateEditComponent<BaseModelInterface<any>>).model = this.dialogContent.data.model;
    }
    (this.componentRef.instance as DialogContentInterface).data = this.dialogContent.data;
    (this.componentRef.instance as DialogContentInterface).isModal = true;
    if (!!(this.componentRef.instance as DialogContentInterface).saveModel) {
      this.componentSubscription = (this.componentRef.instance as DialogContentInterface).saveModel
        .subscribe((model: any) => this.save(model));
    }

    if (!!this.dialogContent.data) {
      (this.componentRef.instance as DialogContentInterface).isModal = true;
      (this.componentRef.instance as DialogContentInterface).multipleSelectEnabled = this.dialogContent.data.multipleSelectEnabled;
      (this.componentRef.instance as DialogContentInterface).isSelectionList = this.dialogContent.data.isSelectionList;
      (this.componentRef.instance as DialogContentInterface).loadData = this.dialogContent.data.loadData;
      (this.componentRef.instance as DialogContentInterface).filter = this.dialogContent.data.filter ?? {};

      // if the list component has preloaded datas
      if (!this.dialogContent.data.loadData && !!this.dialogContent.data.models) {
        (this.componentRef.instance as DialogContentInterface).models = this.dialogContent.data.models;
      }

      // if there are previously selected elements
      if (!!this.dialogContent.data.selectedElements) {
        (this.componentRef.instance as DialogContentInterface).selectedElements = [...this.dialogContent.data.selectedElements];
      }

      // if component hasn't select observable we finish setting process here
      if (!(this.componentRef.instance as DialogContentInterface).select) {
        return;
      }

      // if component has select observable we need to handle it's events
      this.componentSubscription = (this.componentRef.instance as DialogContentInterface).select.pipe(
        map((models: any[]) => {
          // always return an array, even if there is only one selected item
          models.forEach((model: any) => {
            // do emit with all selected elements
            this.success.emit(model);
          });

          this.close();
        }),
      ).subscribe();
    }
  }

  save(model: any): void {
    this.success.emit(model);
    this.closeWithoutEmit();
  }

  clickOnOverlay(): void {
    if (this.overlayClickCloseDialog) {
      this.closeWithoutEmit();
    }
  }
}
