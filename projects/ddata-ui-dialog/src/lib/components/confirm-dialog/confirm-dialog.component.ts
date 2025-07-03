import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faExclamationTriangle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DialogType } from '../../models/dialog/dialog.interface';

declare var $: any;
@Component({
    selector: 'dd-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
    standalone: false
})
export class DdataUiConfirmDialogComponent implements OnInit {
  @Input() title = '';
  @Input() content = '';
  @Input() type: DialogType = 'message';
  @Input() showDialog = false;
  @Input() overlayClickCloseDialog = true;
  @Input() successButtonText = 'OK';
  @Input() cancelButtonText = 'Cancel';
  @Input() closeButtonText = 'Close';

  @Output() confirm: EventEmitter<any> = new EventEmitter();
  @Output() pressed: EventEmitter<boolean> = new EventEmitter();

  confirmed = false;

  icon = {
    close: faTimes,
    info: faInfoCircle,
    alert: faExclamationTriangle,
  };

  constructor() { }

  ngOnInit(): void {
  }

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
