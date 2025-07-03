import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { BaseModel, BaseModelInterface, FieldsInterface } from 'ddata-core';

@Component({
    selector: 'dd-input-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.css'],
    standalone: false
})
export class DdataInputCheckboxComponent implements OnInit {
  // tslint:disable: variable-name
  _model: BaseModelInterface<any> & FieldsInterface<any> = new BaseModel();
  _field = 'isValid';
  _label = '';

  @Input() disabled = false;
  @Input() set model(value: BaseModelInterface<any> & FieldsInterface<any> | null) {
    if (!value) {
      value = new BaseModel();
    }

    this._model = value;

    if (!!this._model.fields) {
      if (!!this._model.fields[this._field]) {
        this._label = this._model.fields[this._field].label ?? '';
      }
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
  get field(): string {
    return this._field;
  }
  @Input() showLabel = true;
  @Input() showLabelAfter = true;
  @Input() labelClass = 'col pl-2 col-form-label';
  @Input() wrapperClass = 'd-flex';
  @Input() iconOn: IconDefinition = faCheckSquare;
  @Input() iconOff: IconDefinition = faSquare;

  @Output() changed: EventEmitter<boolean> = new EventEmitter();

  iterable = 0;

  constructor() { }

  ngOnInit(): void {
    this.iterable = Math.floor(Math.random() * 100);
  }

  clicked(): void {
    if (!this.disabled) {
      this.model[this._field] = !this.model[this._field];
      this.changed.emit( this.model[this._field] );
    }
  }

  getIcon(): IconDefinition {
    return !!this.model[this._field] ? this.iconOn : this.iconOff;
  }
}
