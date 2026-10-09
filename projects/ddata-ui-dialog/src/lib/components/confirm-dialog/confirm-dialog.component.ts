import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { faExclamationTriangle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DialogType } from '../../models/dialog/dialog.interface';

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
