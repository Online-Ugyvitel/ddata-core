import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BaseModel, BaseModelInterface, DdataCoreModule, FieldsInterface } from 'ddata-core';
import * as moment from 'moment';
import { InputHelperServiceInterface } from '../../services/input/helper/input-helper-service.interface';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

@Component({
  selector: 'dd-input-date',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdataInputDateComponent implements OnInit {
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

  @Output() readonly changed: EventEmitter<BaseModelInterface<unknown> & FieldsInterface<unknown>> =
    new EventEmitter();

  @ViewChild('inputBox') inputBox: ElementRef;

  helperService: InputHelperServiceInterface =
    DdataCoreModule.InjectorInstance.get<InputHelperServiceInterface>(InputHelperService);

  // tslint:disable: variable-name
  _field = '';
  _title = '';
  _label = '';
  _placeholder = '';
  _prepend = '';
  _append = '';
  _isRequired = false;
  _model: BaseModelInterface<unknown> & FieldsInterface<unknown> = new BaseModel();
  _moment = moment;

  @Input() set moment(value: unknown) {
    let momentValue = value;

    if (!momentValue) {
      momentValue = moment;
    }

    this._moment = momentValue;
  }

  @Input() set model(value: (BaseModelInterface<unknown> & FieldsInterface<unknown>) | null) {
    let modelValue = value;

    if (!modelValue) {
      modelValue = new BaseModel();
    }

    this._model = modelValue;

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

  icon = {
    calendar: faCalendar
  };

  random: string = this.helperService.randChars();
  selectedValue = !!this.model[this._field] ? this.model[this._field] : '';

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!!this.model[this._field]) {
      this.selectedValue = this.model[this._field];
    }

    if (this.autoFocus) {
      this.inputBox.nativeElement.focus();
    }
  }

  change(value: NgbDate): void {
    this.selectedValue = `${value.year}-${value.month.toString().padStart(2, '0')}-${value.day
      .toString()
      .padStart(2, '0')}`;

    this.model[this._field] = this.selectedValue;
    const isValid = this.helperService.validateField(this._model, this._field);

    if (isValid) {
      this.changed.emit(this._model);
    }
  }

  typeChange(event: Event): void {
    this._model[this._field] = (event.target as HTMLInputElement).value;
  }
}
