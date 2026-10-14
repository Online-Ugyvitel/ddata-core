import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  BaseModel,
  BaseModelInterface,
  DdataCoreModule,
  FieldsInterface
} from '@netdjw/ddata-core';
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
export class DdataInputDateComponent implements OnInit, OnChanges {
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
  // earliest / latest allowed date (inclusive), a Date or a string in `format`
  @Input() min: Date | string | null = null;
  @Input() max: Date | string | null = null;

  @Output() readonly changed: EventEmitter<BaseModelInterface<unknown> & FieldsInterface<unknown>> =
    new EventEmitter();

  @ViewChild('inputBox') inputBox: ElementRef;

  private minMoment: moment.Moment | null = null;
  private maxMoment: moment.Moment | null = null;
  private isOutOfRange = false;

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

  @Input() set moment(value: typeof moment) {
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

    if (!!this._model && !!this._model.validationRules?.[this._field]) {
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
  selectedValue: unknown = '';
  minDate: NgbDateStruct | null = null;
  maxDate: NgbDateStruct | null = null;

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['min'] || changes['max'] || changes['format'] || changes['moment']) {
      this.updateRange();
    }
  }

  ngOnInit(): void {
    this.updateRange();

    if (!!this.model[this._field]) {
      this.selectedValue = this.model[this._field];
    }

    if (this.autoFocus) {
      this.inputBox?.nativeElement.focus();
    }
  }

  change(value: NgbDate): void {
    const selected = `${value.year}-${value.month.toString().padStart(2, '0')}-${value.day
      .toString()
      .padStart(2, '0')}`;

    if (!this.acceptInRange(this.parseDate(selected, 'YYYY-MM-DD'))) {
      return;
    }

    this.selectedValue = selected;
    this.model[this._field] = this.selectedValue;
    const isValid = this.helperService.validateField(this._model, this._field);

    if (isValid) {
      this.changed.emit(this._model);
    }
  }

  typeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    if (!this.acceptInRange(this.parseDate(value, this.format))) {
      return;
    }

    this._model[this._field] = value;
  }

  private updateRange(): void {
    this.minMoment = this.toMoment(this.min, 'min');
    this.maxMoment = this.toMoment(this.max, 'max');
    this.minDate = this.toDateStruct(this.minMoment);
    this.maxDate = this.toDateStruct(this.maxMoment);
  }

  private toMoment(value: Date | string | null | undefined, name: string): moment.Moment | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const result = this.parseDate(value, this.format);

    if (!result.isValid()) {
      console.warn(`Invalid ${name} date: "${String(value)}", the ${name} limit is ignored.`);

      return null;
    }

    return result;
  }

  // a namespace import of moment is not callable, its factory is the default export then
  private parseDate(value: Date | string, format: string): moment.Moment {
    type MomentFactory = (input: Date | string, format?: string, strict?: boolean) => moment.Moment;
    const source = this._moment as unknown as MomentFactory | { default: MomentFactory };
    const factory = typeof source === 'function' ? source : source.default;

    return value instanceof Date ? factory(value) : factory(value, format, true);
  }

  private toDateStruct(value: moment.Moment | null): NgbDateStruct | null {
    return value ? { year: value.year(), month: value.month() + 1, day: value.date() } : null;
  }

  // out of range dates are not written to the model, the field is marked as invalid instead;
  // values that can't be parsed are left to the validator, like before
  private acceptInRange(value: moment.Moment): boolean {
    const isOutside =
      value.isValid() &&
      ((!!this.minMoment && value.isBefore(this.minMoment, 'day')) ||
        (!!this.maxMoment && value.isAfter(this.maxMoment, 'day')));
    const errors = this._model.validationErrors;

    if (isOutside) {
      if (!errors.includes(this._field)) {
        errors.push(this._field);
      }

      this.isOutOfRange = true;

      return false;
    }

    if (this.isOutOfRange) {
      this.isOutOfRange = false;

      if (errors.includes(this._field)) {
        errors.splice(errors.indexOf(this._field), 1);
      }
    }

    return true;
  }
}
