import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseModelInterface, DdataCoreModule, FieldsInterface } from 'ddata-core';
import { InputHelperServiceInterface } from '../../../services/input/helper/input-helper-service.interface';
import { InputHelperService } from '../../../services/input/helper/input-helper.service';

@Component({
  selector: 'dd-simple-select',
  templateUrl: './simple-select.component.html',
  styleUrls: ['./simple-select.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdataSimpleSelectComponent {
  // All @Input and @Output properties first
  @Input() wrapperClass = 'd-flex flex-wrap';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() unselectedText = 'Válassz';
  @Input() isRequire = false;
  @Input() disabledAppearance = false;
  @Input() disabled = false;
  @Input() addEmptyOption = true;
  @Input() labelClass = 'col-12 col-md-3 px-0 col-form-label';
  @Input() showLabel = true;
  @Input() labelText = '';
  @Input() prepend = '';
  @Input() append = '';
  @Input() model: BaseModelInterface<unknown> & FieldsInterface<unknown>;
  @Input() field = 'id';
  @Input() items: Array<unknown> = [];
  @Input() text = 'name';
  @Input() valueField = 'id';

  @Output() readonly selected: EventEmitter<unknown> = new EventEmitter();
  @Output() readonly selectModel: EventEmitter<unknown> = new EventEmitter();

  // Private fields after @Input/@Output
  private readonly helperService: InputHelperServiceInterface =
    DdataCoreModule.InjectorInstance.get<InputHelperServiceInterface>(InputHelperService);

  private readonly random: string = this.helperService.randChars();
  private selectedModel: unknown;

  get id(): string {
    return `${this.field}_${this.random}`;
  }

  selectItem(): void {
    this.selectedModel = this.items.find((item) => item[this.field] === this.model[this.field]);

    this.selected.emit(this.model[this.field]);
    this.selectModel.emit(this.selectedModel);
  }
}
