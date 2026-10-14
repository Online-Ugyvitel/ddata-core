import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { faExclamationTriangle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DialogType } from '../../models/dialog/dialog.interface';
let nextConfirmDialogId = 0;

@Component({
  selector: 'dd-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DdataUiConfirmDialogComponent {
  @Input() title = '';
  @Input() content = '';
  @Input() type: DialogType = 'message';
  @Input() showDialog = false;
  @Input() overlayClickCloseDialog = true;
  @Input() successButtonText = 'OK';
  @Input() cancelButtonText = 'Cancel';
  @Input() closeButtonText = 'Close';

  @Output() readonly confirm: EventEmitter<void> = new EventEmitter();
  @Output() readonly pressed: EventEmitter<boolean> = new EventEmitter();

  confirmed = false;

  readonly titleId = `dd-confirm-dialog-title-${nextConfirmDialogId++}`;

  icon = {
    close: faTimes,
    info: faInfoCircle,
    alert: faExclamationTriangle
  };

  cancel(): void {
    this.showDialog = false;
    this.pressed.emit(false);
  }

  confirmModal(): void {
    // A closed dialog cannot be confirmed: this ignores the second click of a fast double click,
    // which arrives before change detection has removed the button.
    if (!this.showDialog) {
      return;
    }

    this.pressed.emit(true);
    this.showDialog = false;
    this.confirm.emit();
  }

  clickOnOverlay(): void {
    if (this.overlayClickCloseDialog) {
      this.cancel();
    }
  }
}
