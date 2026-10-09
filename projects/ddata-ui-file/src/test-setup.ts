// The file components are not declared in DdataUiFileModule yet, so the template compiler would not know the elements their templates use.
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DdataUiCommonModule } from '@netdjw/ddata-ui-common';
import { DdataUiDialogModule } from '@netdjw/ddata-ui-dialog';
import { DdataUiFileListComponent } from './lib/components/file-list/file-list.component';
import { DdataUiFileUploadComponent } from './lib/components/file-upload/file-upload.component';

@NgModule({
  declarations: [DdataUiFileListComponent, DdataUiFileUploadComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule, DdataUiCommonModule, DdataUiDialogModule]
})
export class DdataUiFileTestModule {}
