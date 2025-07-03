import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseModel, BaseModelInterface, DdataCoreModule, FieldsInterface, ValidatorService } from 'ddata-core';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

@Component({
    selector: 'dd-input-color',
    templateUrl: './color-input.component.html',
    styleUrls: ['./color-input.component.scss'],
    standalone: false
})
export class DdataInputColorComponent implements OnInit {

  // tslint:disable: variable-name
  _field = '';
  _title = '';
  _label = '';
  _placeholder = '';
  _prepend = '';
  _append = '';
  _isRequired = false;
  _model: BaseModelInterface<any> & FieldsInterface<any> = new BaseModel();

  @Input() set model(value: BaseModelInterface<any> & FieldsInterface<any> | null) {
    if (!value) {
      value = new BaseModel();
    }

    this._model = value;

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
  get model(): BaseModelInterface<any> & FieldsInterface<any> {
    return this._model;
  }
  @Input() set field(value: string) {
    if (value === 'undefined') {
      value = 'isValid';
    }

    this._field = value;
  }
  @Input() set append(value: string) {
    if (value === 'undefined') {
      value = '';
    }

    this._append = value;
  }
  @Input() set prepend(value: string) {
    if (value === 'undefined') {
      value = '';
    }

    this._prepend = value;
  }
  @Input() set labelText(value: string) {
    if (value === 'undefined') {
      value = '';
    }

    this._label = value;
  }
  @Input() disabled = false;
  @Input() type = 'text';
  @Input() inputClass = 'form-control';
  @Input() labelClass = 'col-12 col-md-3 px-0 col-form-label';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() showLabel = true;
  @Input() autoFocus = false;
  @Input() wrapperClass = 'd-flex flex-wrap';

  @Output() changed: EventEmitter<BaseModelInterface<any> & FieldsInterface<any>> = new EventEmitter();

  @ViewChild('inputBox') inputBox: ElementRef;

  random: string = this.helperService.randChars();
  toggle = false;
  validatorService: ValidatorService = DdataCoreModule.InjectorInstance.get<ValidatorService>(ValidatorService);

  constructor(
    private helperService: InputHelperService,
  ) { }

  ngOnInit(): void {
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
}
