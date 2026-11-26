import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  BaseModel,
  BaseModelInterface,
  DdataCoreModule,
  FieldsInterface,
  ValidatorService
} from '@netdjw/ddata-core';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

@Component({
  selector: 'dd-input-color',
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdataInputColorComponent implements OnInit {
  @Input() disabled = false;
  @Input() type = 'text';
  @Input() inputClass = 'form-control';
  @Input() labelClass = 'form-label';
  @Input() inputBlockClass = 'dd-field-control';
  /**
   * @deprecated the input block has no extra class any more, it does nothing
   */
  @Input() inputBlockExtraClass = '';
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

  @Output() readonly changed: EventEmitter<BaseModelInterface<unknown> & FieldsInterface<unknown>> =
    new EventEmitter();

  @ViewChild('inputBox') inputBox: ElementRef;

  // tslint:disable: variable-name
  _field = '';
  _title = '';
  _label = '';
  _placeholder = '';
  _prepend = '';
  _append = '';
  _help = '';
  _isRequired = false;
  _model: BaseModelInterface<unknown> & FieldsInterface<unknown> = new BaseModel();

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
      this._help = this._model.fields[this._field].help ?? '';
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

  random: string = this.helperService.randChars();
  readonly icon = { warning: faTriangleExclamation };
  toggle = false;
  validatorService: ValidatorService =
    DdataCoreModule.InjectorInstance.get<ValidatorService>(ValidatorService);

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

  constructor(private readonly helperService: InputHelperService) {}

  ngOnInit(): void {
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
}
