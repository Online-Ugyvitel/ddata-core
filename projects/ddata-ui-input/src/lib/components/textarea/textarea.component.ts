import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { BaseModel, BaseModelInterface, DdataCoreModule, FieldsInterface } from 'ddata-core';
import { InputHelperServiceInterface } from '../../services/input/helper/input-helper-service.interface';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

@Component({
  selector: 'dd-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdataTextareaComponent implements AfterViewInit {
  // All @Input and @Output properties first
  @Input() inputClass = 'form-control';
  @Input() disabled = false;
  @Input() isViewOnly = false;
  @Input() labelClass = 'col-12 col-md-3 px-0 col-form-label';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() viewOnlyClass = 'form-control border-0 bg-light';
  @Input() showLabel = true;
  @Input() autoFocus = false;
  @Input() wrapperClass = 'd-flex flex-wrap';
  @Input() rows = '5';
  @Input() enableCharacterCounter = false;
  @Input() enableWordCounter = false;
  @Input() maxLength = 255;
  @Input() maxWords = 7;
  @Input() wordCounterWarningMessage = '';

  @Output() readonly changed: EventEmitter<unknown> = new EventEmitter();

  @ViewChild('inputBox') inputBox: ElementRef;

  // Private and internal fields after @Input/@Output
  helperService: InputHelperServiceInterface =
    DdataCoreModule.InjectorInstance.get<InputHelperServiceInterface>(InputHelperService);

  // tslint:disable: variable-name
  _field = '';
  _title = '';
  _label = '';
  _placeholder = '';
  _prepend = '';
  _append = '';
  _max = '';
  _isRequired = false;
  _model: BaseModelInterface<unknown> & FieldsInterface<unknown> = new BaseModel();

  random: string = this.helperService.randChars();
  displayWordCounterWarning = false;

  @Input() set model(value: (BaseModelInterface<unknown> & FieldsInterface<unknown>) | null) {
    // prevent undefined
    if (!value) {
      console.error('The input-box component get undefined model');

      return;
    }

    this._model = value;

    if (!this._model.fields) {
      console.error(`Your ${this._model.model_name}'s 'fields' field is`, this._model.fields);

      return;
    }

    if (!this._model.fields[this._field]) {
      console.error(
        `The ${this._model.model_name}'s ${this._field} field is `,
        this._model.fields[this._field]
      );

      return;
    }

    if (!!this._model && !!this._model.fields[this._field]) {
      this._title = this.helperService.getTitle(this._model, this._field);
      this._placeholder = this.helperService.getPlaceholder(this._model, this._field);
      this._prepend = this.helperService.getPrepend(this._model, this._field);
      this._append = this.helperService.getAppend(this._model, this._field);
      this._label = this.helperService.getLabel(this._model, this._field);
    }

    if (!!this._model && !!this._model.validationRules[this._field]) {
      this._isRequired = this.helperService.isRequired(this._model, this._field);
    }
  }

  get model(): BaseModelInterface<unknown> & FieldsInterface<unknown> {
    return this._model;
  }

  @Input() set field(value: string) {
    let fieldValue = value;

    if (fieldValue === 'undefined') {
      fieldValue = 'isValid';
    }

    this._field = fieldValue;
  }

  @Input() set append(value: string) {
    let appendValue = value;

    if (appendValue === 'undefined') {
      appendValue = '';
    }

    this._append = appendValue;
  }

  @Input() set prepend(value: string) {
    let prependValue = value;

    if (prependValue === 'undefined') {
      prependValue = '';
    }

    this._prepend = prependValue;
  }

  @Input() set labelText(value: string) {
    let labelValue = value;

    if (labelValue === 'undefined') {
      labelValue = '';
    }

    this._label = labelValue;
  }

  constructor() {}

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.inputBox.nativeElement.focus();
    }
  }

  validateField(): void {
    const isValid = this.helperService.validateField(this._model, this._field);

    if (isValid) {
      this.changed.emit(this._model);
    }
  }

  setWordCounterWarning(value: boolean): void {
    this.displayWordCounterWarning = value;
  }
}
