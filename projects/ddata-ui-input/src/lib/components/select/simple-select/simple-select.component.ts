import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseModelInterface, DdataCoreModule, FieldsInterface } from 'ddata-core';
import { InputHelperServiceInterface } from '../../../services/input/helper/input-helper-service.interface';
import { InputHelperService } from '../../../services/input/helper/input-helper.service';

@Component({
    selector: 'simple-select',
    templateUrl: './simple-select.component.html',
    styleUrls: ['./simple-select.component.scss'],
    standalone: false
})
export class DdataSimpleSelectComponent {
  private helperService: InputHelperServiceInterface =
    DdataCoreModule.InjectorInstance.get<InputHelperServiceInterface>(InputHelperService);
  private random: string = this.helperService.randChars();
  private selectedModel: any;


  // look & feel
  @Input() wrapperClass = 'd-flex flex-wrap';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() unselectedText = 'Válassz';

  // behavior
  @Input() isRequire = false;
  @Input() disabledAppearance = false;
  @Input() disabled = false;
  @Input() addEmptyOption = true;

  // label
  @Input() labelClass = 'col-12 col-md-3 px-0 col-form-label';
  @Input() showLabel = true;
  @Input() labelText = '';

  // additional texts
  @Input() prepend = '';
  @Input() append = '';

  // data
  @Input() model: BaseModelInterface<any> & FieldsInterface<any>;
  @Input() field = 'id';
  @Input() items: any[] = [];
  @Input() text = 'name';
  @Input() valueField = 'id';

  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() selectModel: EventEmitter<any> = new EventEmitter();

  get id(): string {
    return `${this.field}_${this.random}`;
  }

  selectItem(): void {
    this.selectedModel = this.items.find(item => item[this.field] === this.model[this.field]);

    this.selected.emit(this.model[this.field]);
    this.selectModel.emit(this.selectedModel);
  }
}
