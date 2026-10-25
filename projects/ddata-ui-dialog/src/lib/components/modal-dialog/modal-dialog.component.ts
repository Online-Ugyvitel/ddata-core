// tslint:disable-next-line: max-line-length
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
  ComponentRef,
  ElementRef,
  HostListener,
  OnDestroy,
  inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  BaseCreateEditComponent,
  BaseModel,
  BaseModelInterface,
  BaseModelWithoutTypeDefinitionInterface
} from '@netdjw/ddata-core';
import { DdataUiNoDataComponent } from '@netdjw/ddata-ui-common';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogContentItem } from '../../models/dialog/content/dialog-content-item';
import { DialogContentInterface } from '../../models/dialog/content/dialog-content.interface';
import { DialogFocusHandler } from '../../helpers/dialog-focus-handler';
let nextModalDialogId = 0;

@Component({
  selector: 'dd-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DdataUiModalDialogComponent implements OnDestroy {
  @Input() title = '';
  @Input() model: BaseModelWithoutTypeDefinitionInterface = new BaseModel();
  @Input() dialogContent: DialogContentItem = new DialogContentItem(DdataUiNoDataComponent, {});
  @Input() overlayClickCloseDialog = true;
  @Input() closeButtonText = 'Close';
  @Input() closeButtonClass = 'btn dd-btn-neutral close';

  /**
   * Opens (true) or closes (false) the dialog. Setting false closes only an open dialog, so a
   * dialog that starts hidden does not emit `fail`. The dialog emits `showDialogChange` with false
   * whenever it closes, so `[(showDialog)]` keeps the parent's value in sync.
   */
  @Input() set showDialog(value: boolean) {
    if (!!value) {
      this.showModal();
    } else if (this.isModalVisible) {
      this.close();
    }
  }

  // tslint:disable-next-line: no-output-native
  @Output() readonly success: EventEmitter<BaseModelWithoutTypeDefinitionInterface> =
    new EventEmitter();

  @Output() readonly fail: EventEmitter<string> = new EventEmitter();

  @Output() readonly showDialogChange: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('dialogHost', { read: ViewContainerRef }) dialogHost!: ViewContainerRef;

  @ViewChild('dialogElement') dialogElement?: ElementRef<HTMLElement>;

  private readonly focusHandler = new DialogFocusHandler(inject(DOCUMENT));

  isModalVisible = false;
  componentSubscription!: Subscription;

  componentRef!: ComponentRef<any>;

  readonly titleId = `dd-modal-dialog-title-${nextModalDialogId++}`;
  icon = {
    close: faTimes
  };

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (this.focusHandler.handleKeydown(event, this.dialogElement?.nativeElement)) {
      this.close();
    }
  }

  close(emit: boolean = true): void {
    const wasVisible = this.isModalVisible;

    this.changeModalStatus(false);
    this.componentSubscription?.unsubscribe();

    if (wasVisible) {
      this.focusHandler.close();
      this.showDialogChange.emit(false);
    }

    if (emit) {
      this.fail.emit('close');
    }
  }

  closeWithoutEmit(): void {
    this.close(false);
  }

  showModal(): void {
    this.focusHandler.open();
    this.changeModalStatus(true);
    this.renderComponent();
    this.focusHandler.focusFirst(this.dialogElement?.nativeElement);
  }

  renderComponent(): void {
    if (!this.dialogContent) {
      return;
    }

    this.dialogHost.clear();

    this.componentRef = this.dialogHost.createComponent(this.dialogContent.component);

    if (!!this.dialogContent.data?.model) {
      // Assign provided model (could be plain object in tests) with relaxed casting

      (this.componentRef.instance as BaseCreateEditComponent<BaseModelInterface<any>>).model = this
        .dialogContent.data.model as any;
    }

    (this.componentRef.instance as DialogContentInterface).data = this.dialogContent.data;
    (this.componentRef.instance as DialogContentInterface).isModal = true;

    if (!!(this.componentRef.instance as DialogContentInterface).saveModel) {
      this.componentSubscription = (
        this.componentRef.instance as DialogContentInterface
      ).saveModel.subscribe((model: BaseModelWithoutTypeDefinitionInterface) => this.save(model));
    }

    if (!!this.dialogContent.data) {
      (this.componentRef.instance as DialogContentInterface).isModal = true;
      (this.componentRef.instance as DialogContentInterface).multipleSelectEnabled = this
        .dialogContent.data.multipleSelectEnabled as any;
      (this.componentRef.instance as DialogContentInterface).isSelectionList = this.dialogContent
        .data.isSelectionList as any;
      (this.componentRef.instance as DialogContentInterface).loadData = this.dialogContent.data
        .loadData as any;
      (this.componentRef.instance as DialogContentInterface).filter =
        (this.dialogContent.data.filter as any) ?? {};

      // if the list component has preloaded datas
      if (!this.dialogContent.data.loadData && !!this.dialogContent.data.models) {
        (this.componentRef.instance as DialogContentInterface).models = this.dialogContent.data
          .models as any;
      }

      // if there are previously selected elements
      if (!!this.dialogContent.data.selectedElements) {
        (this.componentRef.instance as DialogContentInterface).selectedElements = [
          ...(this.dialogContent.data.selectedElements as Array<any>)
        ];
      }

      // if component hasn't select observable we finish setting process here
      if (!(this.componentRef.instance as DialogContentInterface).select) {
        return;
      }

      // if component has select observable we need to handle it's events
      this.componentSubscription = (this.componentRef.instance as DialogContentInterface).select
        .pipe(
          map((model: BaseModelWithoutTypeDefinitionInterface) => {
            this.success.emit(model);
            this.close();
          })
        )
        .subscribe();
    }
  }

  save(model: BaseModelWithoutTypeDefinitionInterface): void {
    this.success.emit(model);
    this.closeWithoutEmit();
  }

  clickOnOverlay(): void {
    if (this.overlayClickCloseDialog) {
      this.closeWithoutEmit();
    }
  }

  /** A click on the full-screen `.modal` element outside of the dialog box acts as an overlay click. */
  clickOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.clickOnOverlay();
    }
  }

  ngOnDestroy(): void {
    this.focusHandler.close();
    this.componentSubscription?.unsubscribe();
  }

  private changeModalStatus(isVisible: boolean = false): void {
    this.isModalVisible = isVisible;
    this.changeDetector.detectChanges();
  }
}
