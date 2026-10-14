import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DdataUiCommonModule } from '@netdjw/ddata-ui-common';
import { ColorPickerComponent, ColorPickerDirective } from 'ngx-color-picker';
import { MatTimepickerModule, provideNativeDateTimeAdapter } from '@dhutaryan/ngx-mat-timepicker';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DdataInputCheckboxComponent } from './components/checkbox/checkbox.component';
import { DdataInputColorComponent } from './components/color/color-input.component';
import { DdataInputDateComponent } from './components/date/date-input.component';
import { DdataInputComponent } from './components/input/input.component';
import { DdataInputSearchComponent } from './components/search/search.component';
import { DdataAutocompleteSelectComponent } from './components/select/autocomplete-select/autocomplete-select.component';
import { DdataMultipleSelectDialogComponent } from './components/select/multiple-select/dialog/multiple-select-dialog.component';
import { DdataMultipleSelectComponent } from './components/select/multiple-select/multiple-select.component';
import { DdataSelectComponent } from './components/select/select.component';
import { DdataSimpleSelectComponent } from './components/select/simple-select/simple-select.component';
import { DdataTextareaComponent } from './components/textarea/textarea.component';
import { DdataInputTimeComponent } from './components/time/time-input.component';
import { CharacterCounterComponent } from './components/character-counter/character-counter.component';
import { WordCounterComponent } from './components/word-counter/word-counter.component';
import { AutocompleteBoxComponent } from './components/autocomplete-box/autocomplete-box.component';
import { MultilanguageNameComponent } from './components/multilanguage-name/multilanguage-name.component';
import { PasswordStrengthOMeterComponent } from './components/password-strength-o-meter/password-strength-o-meter.component';
import { DescriptionPipe } from './pipes/description/description.pipe';

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
    DdataAutocompleteSelectComponent,
    DdataMultipleSelectComponent,
    DdataMultipleSelectDialogComponent,
    CharacterCounterComponent,
    WordCounterComponent,
    AutocompleteBoxComponent,
    MultilanguageNameComponent,
    PasswordStrengthOMeterComponent,
    DescriptionPipe
  ],
  imports: [
    // Angular modules
    CommonModule,
    FormsModule,

    // Third-party modules
    FontAwesomeModule,
    MatTimepickerModule,
    NgbDatepickerModule,

    // Third-party standalone components (v20.0.0+)
    ColorPickerComponent,
    ColorPickerDirective,

    // Internal modules
    DdataUiCommonModule
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
    DdataSimpleSelectComponent,
    DdataAutocompleteSelectComponent,
    DdataMultipleSelectComponent,
    DdataMultipleSelectDialogComponent,
    CharacterCounterComponent,
    AutocompleteBoxComponent,
    MultilanguageNameComponent,
    PasswordStrengthOMeterComponent,
    DescriptionPipe
  ],
  providers: [provideNativeDateTimeAdapter()]
})
export class DdataUiInputModule {}
