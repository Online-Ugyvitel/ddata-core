import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { BaseModelInterface, DdataCoreModule, FieldsInterface } from 'ddata-core';
import { DialogContentWithOptionsInterface } from '../../../models/dialog/content/dialog-content.interface';
import { InputHelperServiceInterface } from '../../../services/input/helper/input-helper-service.interface';
import { InputHelperService } from '../../../services/input/helper/input-helper.service';
import { SelectType } from '../select.type';

@Component({
  selector: 'dd-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdataMultipleSelectComponent {
  // look & feel
  @Input() wrapperClass = 'd-flex flex-wrap';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() unselectedText = 'Válassz';

  // behavior
  @Input() mode: SelectType = 'multiple';
  @Input() set isRequired(value: boolean) {
    this._isRequired = value;
    // ensure OnPush view picks up external or direct changes
    this.changeDetector.markForCheck();
  }

  get isRequired(): boolean {
    return this._isRequired;
  }

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
  @Input() model: BaseModelInterface<unknown> & FieldsInterface<unknown>;
  @Input() field = 'id';
  @Input() items: Array<unknown> = [];
  @Input() text = 'name';
  @Input() valueField = 'id';

  // selected items
  @Input() disableShowSelectedItems = false;
  @Input() showIcon = false;
  @Input() selectedElementsBlockClass = 'col-12 d-flex flex-wrap px-0';
  @Input() selectedElementsBlockExtraClass = 'col-md-9 d-flex flex-wrap';

  // dialog
  @Input() set dialogSettings(value: DialogContentWithOptionsInterface) {
    if (!value) {
      console.error(
        `You try to use dd-select as multiple select, but not defined dialogSettings. Please define it.`
      );

      return;
    }

    this.internalDialogSettings = value;
  }

  get dialogSettings(): DialogContentWithOptionsInterface {
    return this.internalDialogSettings;
  }

  @Output() readonly selected: EventEmitter<unknown> = new EventEmitter<unknown>();
  @Output() readonly selectModel: EventEmitter<unknown> = new EventEmitter<unknown>();

  private readonly helperService: InputHelperServiceInterface =
    DdataCoreModule.InjectorInstance.get<InputHelperServiceInterface>(InputHelperService);

  // tslint:disable-next-line:variable-name  (intentionally using leading underscore for backing field of Input setter)
  private _isRequired = false;
  private readonly random: string = this.helperService.randChars();
  private internalDialogSettings: DialogContentWithOptionsInterface;
  isModalVisible = false;

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  get id(): string {
    return `${this.field}_${this.random}`;
  }

  get selectedModelName(): string {
    return this.model[this.getObjectFieldName()][this.text];
  }

  showModal(): void {
    if (!this.internalDialogSettings) {
      console.error('dialogSettings is not defined. Cannot show modal.');

      return;
    }

    this.isModalVisible = true;
    this.changeDetector.detectChanges();
  }

  hideModal(): void {
    this.isModalVisible = false;
  }

  selectedEmit(event: unknown): void {
    this.selected.emit(event);
  }

  selectModelEmit(event: unknown): void {
    const record = event as Record<string, unknown>;

    record.is_selected = true;

    if (this.mode === 'single') {
      this.model[this.getObjectFieldName()] = record;
      this.model[this.field] = record.id;
    }

    if (this.mode === 'multiple') {
      // TODO avoid duplicate add
      this.model[this.field].push(record);
    }

    this.selectModel.emit(record);
  }

  deleteFromMultipleSelectedList(item: BaseModelInterface<unknown>): void {
    // Remove from model field array
    if (this.model && this.model[this.field] && Array.isArray(this.model[this.field])) {
      const index = this.model[this.field].indexOf(item);

      if (index !== -1) {
        this.model[this.field].splice(index, 1);
      }
    }

    // Remove from dialog selected elements
    if (
      this.dialogSettings &&
      this.dialogSettings.listOptions &&
      Array.isArray(this.dialogSettings.listOptions.selectedElements)
    ) {
      const dialogIndex = this.dialogSettings.listOptions.selectedElements.indexOf(item);

      if (dialogIndex !== -1) {
        this.dialogSettings.listOptions.selectedElements.splice(dialogIndex, 1);
      }
    }
  }

  getObjectFieldName(): string {
    return this.field.split('_id')[0];
  }

  trackByFn(index: number, item: unknown): unknown {
    return item || index;
  }
}
