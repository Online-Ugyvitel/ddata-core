import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { faExclamationTriangle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DialogType } from '../../models/dialog/dialog.interface';
import { DialogFocusHandler } from '../../helpers/dialog-focus-handler';
let nextConfirmDialogId = 0;

@Component({
  selector: 'dd-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DdataUiConfirmDialogComponent implements OnDestroy {
  @Input() title = '';
  @Input() content = '';
  @Input() type: DialogType = 'message';
  @Input() overlayClickCloseDialog = true;
  @Input() successButtonText = 'OK';
  @Input() cancelButtonText = 'Cancel';
  @Input() closeButtonText = 'Close';
  @Input() closeButtonClass = 'btn dd-btn-neutral close';

  /**
   * Opens (true) or closes (false) the dialog. The dialog emits `showDialogChange` with false
   * whenever it closes itself (confirm, cancel, close button, Escape, overlay click), so with
   * `[(showDialog)]` the parent's value follows the dialog and setting it to true opens it again.
   */
  @Input() set showDialog(value: boolean) {
    if (!!value) {
      this.open();
    } else {
      this.hide();
    }
  }

  get showDialog(): boolean {
    return this.visible;
  }

  @Output() readonly confirm: EventEmitter<void> = new EventEmitter();
  @Output() readonly pressed: EventEmitter<boolean> = new EventEmitter();
  @Output() readonly showDialogChange: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('dialogElement') dialogElement?: ElementRef<HTMLElement>;

  private visible = false;
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly focusHandler = new DialogFocusHandler(inject(DOCUMENT));

  confirmed = false;

  readonly titleId = `dd-confirm-dialog-title-${nextConfirmDialogId++}`;

  icon = {
    close: faTimes,
    info: faInfoCircle,
    alert: faExclamationTriangle
  };

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (this.focusHandler.handleKeydown(event, this.dialogElement?.nativeElement)) {
      this.cancel();
    }
  }

  cancel(): void {
    this.closeByUser();
    this.pressed.emit(false);
  }

  confirmModal(): void {
    // A closed dialog cannot be confirmed: this ignores the second click of a fast double click,
    // which arrives before change detection has removed the button.
    if (!this.showDialog) {
      return;
    }

    this.pressed.emit(true);
    this.closeByUser();
    this.confirm.emit();
  }

  clickOnOverlay(): void {
    if (this.overlayClickCloseDialog) {
      this.cancel();
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
  }

  private open(): void {
    if (this.visible) {
      return;
    }

    this.focusHandler.open();
    this.visible = true;
    this.changeDetector.detectChanges();
    this.focusHandler.focusFirst(this.dialogElement?.nativeElement);
  }

  private hide(): boolean {
    if (!this.visible) {
      return false;
    }

    this.visible = false;
    this.changeDetector.markForCheck();
    this.focusHandler.close();

    return true;
  }

  private closeByUser(): void {
    if (this.hide()) {
      this.showDialogChange.emit(false);
    }
  }
}
