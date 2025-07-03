import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DdataUiCommonModule } from 'ddata-ui-common';
import { ColorPickerComponent, ColorPickerDirective } from 'ngx-color-picker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DdataInputCheckboxComponent } from './components/checkbox/checkbox.component';
import { DdataInputColorComponent } from './components/color/color-input.component';
import { DdataInputDateComponent } from './components/date/date-input.component';
import { DdataInputComponent } from './components/input/input.component';
import { DdataInputSearchComponent } from './components/search/search.component';
import { DdataMultipleSelectDialogComponent } from './components/select/multiple-select/dialog/multiple-select-dialog.component';
import { DdataMultipleSelectComponent } from './components/select/multiple-select/multiple-select.component';
import { DdataSelectComponent } from './components/select/select.component';
import { DdataSimpleSelectComponent } from './components/select/simple-select/simple-select.component';
import { DdataTextareaComponent } from './components/textarea/textarea.component';
import { DdataInputTimeComponent } from './components/time/time-input.component';


@NgModule({
  declarations: [
    DdataInputCheckboxComponent,
    DdataInputColorComponent,
    DdataInputComponent,
    DdataInputDateComponent,
    DdataInputSearchComponent,
    DdataInputTimeComponent,
    DdataSelectComponent,
    DdataTextareaComponent,
    DdataSimpleSelectComponent,
    DdataMultipleSelectComponent,
    DdataMultipleSelectDialogComponent,
  ],
  imports: [
    ColorPickerComponent,
    ColorPickerDirective,
    CommonModule,
    FormsModule,
    NgxMaterialTimepickerModule,
    DdataUiCommonModule,
    NgbDatepickerModule
  ],
  exports: [
    DdataInputCheckboxComponent,
    DdataInputColorComponent,
    DdataInputComponent,
    DdataInputDateComponent,
    DdataInputSearchComponent,
    DdataInputTimeComponent,
    DdataSelectComponent,
    DdataTextareaComponent,
  ]
})
export class DdataUiInputModule { }
