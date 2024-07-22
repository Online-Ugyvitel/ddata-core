import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FieldsInterface, DdataCoreModule, BaseModelInterface, BaseModel } from 'ddata-core';
import { InputHelperServiceInterface } from '../../services/input/helper/input-helper-service.interface';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

@Component({
  selector: 'dd-input-time',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss']
})
export class DdataInputTimeComponent implements OnInit, AfterViewInit {
  helperService: InputHelperServiceInterface = DdataCoreModule.InjectorInstance.get<InputHelperServiceInterface>(InputHelperService);

  // tslint:disable: variable-name
  _field = '';
  _title = '';
  _label = '';
  _placeholder = '';
  _prepend = '';
  _append = '';
  _max = '';
  _isRequired = false;
  _model: BaseModelInterface<any> & FieldsInterface<any> = new BaseModel();

  @Input() set model(value: BaseModelInterface<any> & FieldsInterface<any> | null) {
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
      console.error(`The ${this._model.model_name}'s ${this._field} field is `, this._model.fields[this._field]);

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
  @Input() isViewOnly = false;
  @Input() type = 'text';
  @Input() inputClass = 'form-control';
  @Input() labelClass = 'col-12 col-md-3 px-0 col-form-label';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() viewOnlyClass = 'form-control border-0 bg-light';
  @Input() showLabel = true;
  @Input() autoFocus = false;
  @Input() wrapperClass = 'd-flex flex-wrap';
  @Input() format: 12 | 24 = 24;

  @Output() changed: EventEmitter<any> = new EventEmitter();

  @ViewChild('inputBox') inputBox: ElementRef;

  random: string = this.helperService.randChars();


  constructor() { }

  ngOnInit(): void {
  }

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

  setTime(time: string): void {
    this._model[this._field] = time;

    this.validateField();
  }
}
