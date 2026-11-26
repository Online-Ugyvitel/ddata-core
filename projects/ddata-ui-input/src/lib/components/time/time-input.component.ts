import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { faClock, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import {
  FieldsInterface,
  DdataCoreModule,
  BaseModelInterface,
  BaseModel
} from '@netdjw/ddata-core';
import { InputHelperServiceInterface } from '../../services/input/helper/input-helper-service.interface';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

@Component({
  selector: 'dd-input-time',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdataInputTimeComponent implements AfterViewInit {
  // All @Input and @Output properties first
  @Input() disabled = false;
  @Input() isViewOnly = false;
  @Input() type = 'text';
  @Input() inputClass = 'form-control';
  @Input() labelClass = 'form-label';
  @Input() inputBlockClass = 'dd-field-control';
  /**
   * @deprecated the input block has no extra class any more, it does nothing
   */
  @Input() inputBlockExtraClass = '';
  @Input() viewOnlyClass = 'form-control border-0 bg-body-tertiary';
  @Input() showLabel = true;
  @Input() autoFocus = false;
  @Input() wrapperClass = 'dd-field';
  @Input() helpText = '';
  @Input() errorText = '';
  @Input() errorSuggestion = '';
  /**
   * Accepted for the API of all fields; this field has no counter, so it does nothing.
   */
  @Input() counterPlacement: 'label' | 'control' = 'label';
  @Input() size: 'md' | 'sm' = 'md';
  @Input() layout: 'stacked' | 'inline' = 'stacked';
  @Input() format: 12 | 24 = 24;

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
  _help = '';
  _isRequired = false;
  _model: BaseModelInterface<unknown> & FieldsInterface<unknown> = new BaseModel();

  random: string = this.helperService.randChars();
  readonly icon = { clock: faClock, warning: faTriangleExclamation };
  timeValue: Date | null = null;

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

    this._title = this.helperService.getTitle(this._model, this._field);
    this._placeholder = this.helperService.getPlaceholder(this._model, this._field);
    this._prepend = this.helperService.getPrepend(this._model, this._field);
    this._append = this.helperService.getAppend(this._model, this._field);
    this._label = this.helperService.getLabel(this._model, this._field);
    this._help = this._model.fields[this._field].help ?? '';

    if (this._model.validationRules?.[this._field]) {
      this._isRequired = this.helperService.isRequired(this._model, this._field);
    }

    this.timeValue = this.parseTime(this._model[this._field]);
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
    this.timeValue = this.parseTime(this._model[this._field]);
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

  get inputId(): string {
    return `${this._field}_${this.random}`;
  }

  get helpId(): string {
    return `${this.inputId}_help`;
  }

  get errorId(): string {
    return `${this.inputId}_error`;
  }

  get isInvalid(): boolean {
    return !!this._model.validationErrors?.includes(this._field);
  }

  get helpMessage(): string {
    return this.helpText || this._help;
  }

  get errorMessage(): string {
    return this.helperService.getErrorText(
      this._model,
      this._field,
      this.errorText,
      this.errorSuggestion
    );
  }

  get showError(): boolean {
    return this.errorMessage !== '';
  }

  get describedBy(): string | null {
    return this.helperService.buildDescribedBy(
      this.helpMessage !== '' ? this.helpId : null,
      this.showError ? this.errorId : null,
      null
    );
  }

  constructor() {}

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.inputBox?.nativeElement.focus();
    }
  }

  validateField(): void {
    const isValid = this.helperService.validateField(this._model, this._field);

    if (isValid) {
      this.changed.emit(this._model);
    }
  }

  setTime(time: Date | null | string): void {
    this.timeValue = typeof time === 'string' ? this.parseTime(time) : time;
    this._model[this._field] = typeof time === 'string' ? time : time ? this.formatTime(time) : '';

    this.validateField();
  }

  private parseTime(value: unknown): Date | null {
    if (typeof value !== 'string' || !/^\d{1,2}:\d{2}$/.test(value)) {
      return null;
    }
    const [hours, minutes] = value.split(':').map(Number);

    // reject out of range values (e.g. 24:00 or 12:60) instead of rolling them over
    if (hours > 23 || minutes > 59) {
      return null;
    }
    const result = new Date();

    result.setHours(hours, minutes, 0, 0);

    return result;
  }

  private formatTime(value: Date): string {
    return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
  }
}
