import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { NgbDate, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { BaseModel, BaseModelInterface, DdataCoreModule, FieldsInterface } from 'ddata-core';
import * as moment from 'moment';
import { InputHelperServiceInterface } from '../../services/input/helper/input-helper-service.interface';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

@Component({
  selector: 'dd-input-date',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss']
})
export class DdataInputDateComponent implements OnInit {
  helperService: InputHelperServiceInterface = DdataCoreModule.InjectorInstance.get<InputHelperServiceInterface>(InputHelperService);

  // tslint:disable: variable-name
  _field = '';
  _title = '';
  _label = '';
  _placeholder = '';
  _prepend = '';
  _append = '';
  _isRequired = false;
  _model: BaseModelInterface<any> & FieldsInterface<any> = new BaseModel();
  _moment = moment;

  @Input() set moment(value: any) {
    if (!value) {
      value = moment;
    }

    this._moment = value;
  }
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
  @Input() inputClass = 'form-control';
  @Input() labelClass = 'col-12 col-md-3 px-0 col-form-label';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() showLabel = true;
  @Input() autoFocus = false;
  @Input() isViewOnly = false;
  @Input() viewOnlyClass = 'form-control border-0 bg-light';
  @Input() buttonClass = 'input-group-prepend btn btn-light mb-0';
  @Input() wrapperClass = 'd-flex flex-wrap';
  @Input() format = 'YYYY-MM-DD';
  @Input() separator = '-';
  @Input() labelApply = 'OK';
  @Input() labelCancel = 'Cancel';
  @Input() position: 'left' | 'center' | 'right' = 'center';
  @Input() direction: 'up' | 'down' = 'down';
  @Input() showIcon = true;
  @Input() autoApply = true;
  @Input() singleDatePicker = true;

  @Output() changed: EventEmitter<BaseModelInterface<any> & FieldsInterface<any>> = new EventEmitter();

  @ViewChild('inputBox') inputBox: ElementRef;

  icon = {
    calendar: faCalendar,
  };
  random: string = this.helperService.randChars();
  selectedValue = !!this.model[this._field] ? this.model[this._field] : '';

  constructor(
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    if (!!this.model[this._field]) {
      this.selectedValue = this.model[this._field];
    }

    if (this.autoFocus) {
      this.inputBox.nativeElement.focus();
    }
  }


  change(value: NgbDate): void {
    this.selectedValue = value.year + '-' + value.month.toString().padStart(2, '0') + '-' + value.day.toString().padStart(2, '0');

    this.model[this._field] = this.selectedValue;

    const isValid = this.helperService.validateField(this._model, this._field);

    if (isValid) {
      this.changed.emit(this._model);
    }
  }

  typeChange(event: any): void {
    this._model[this._field] = event.target.value;
  }
}
