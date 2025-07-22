import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DdataCoreModule } from 'ddata-core';
import { DdataUiCommonModule } from 'ddata-ui-common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DdataUiConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DdataUiModalDialogComponent } from './components/modal-dialog/modal-dialog.component';

@NgModule({
  declarations: [DdataUiConfirmDialogComponent, DdataUiModalDialogComponent],
  imports: [CommonModule, DdataCoreModule, DdataUiCommonModule, FontAwesomeModule],
  exports: [DdataUiConfirmDialogComponent, DdataUiModalDialogComponent]
})
export class DdataUiDialogModule {}
