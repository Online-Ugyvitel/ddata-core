import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { BaseModel, BaseModelInterface, FieldsInterface } from 'ddata-core';

@Component({
  selector: 'dd-input-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DdataInputCheckboxComponent implements OnInit {
  // Input properties
  @Input() disabled = false;
  @Input() showLabel = true;
  @Input() showLabelAfter = true;
  @Input() labelClass = 'col pl-2 col-form-label';
  @Input() wrapperClass = 'd-flex';
  @Input() iconOn: IconDefinition = faCheckSquare;
  @Input() iconOff: IconDefinition = faSquare;

  // Output properties
  @Output() readonly changed: EventEmitter<boolean> = new EventEmitter();

  // tslint:disable: variable-name
  _model: BaseModelInterface<unknown> & FieldsInterface<unknown> = new BaseModel();
  _field = 'isValid';
  _label = '';
  iterable = 0;

  @Input() set model(value: (BaseModelInterface<unknown> & FieldsInterface<unknown>) | null) {
    let actualValue = value;

    if (!actualValue) {
      actualValue = new BaseModel();
    }

    this._model = actualValue;

    if (!!this._model.fields) {
      if (!!this._model.fields[this._field]) {
        this._label = this._model.fields[this._field].label ?? '';
      }
    }
  }

  get model(): BaseModelInterface<unknown> & FieldsInterface<unknown> {
    return this._model;
  }

  @Input() set field(fieldValue: string) {
    let actualValue = fieldValue;

    if (actualValue === 'undefined') {
      actualValue = 'isValid';
    }

    this._field = actualValue;
  }

  get field(): string {
    return this._field;
  }

  constructor() {}

  ngOnInit(): void {
    this.iterable = Math.floor(Math.random() * 100);
  }

  clicked(): void {
    if (!this.disabled) {
      this.model[this._field] = !this.model[this._field];
      this.changed.emit(this.model[this._field]);
    }
  }

  getIcon(): IconDefinition {
    return !!this.model[this._field] ? this.iconOn : this.iconOff;
  }
}
