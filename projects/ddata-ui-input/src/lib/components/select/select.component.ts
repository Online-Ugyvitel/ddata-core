/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
  signal
} from '@angular/core';
import { BaseModelInterface, DdataCoreModule, FieldsInterface } from 'ddata-core';
import { DialogContentWithOptionsInterface } from '../../models/dialog/content/dialog-content.interface';
import { InputHelperServiceInterface } from '../../services/input/helper/input-helper-service.interface';
import { InputHelperService } from '../../services/input/helper/input-helper.service';
import { SelectType } from './select.type';

@Component({
  selector: 'dd-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DdataSelectComponent {
  /**
   * @deprecated use `mode` input attribute
   */
  @Input() set fakeSingleSelect(value: boolean) {
    if (value === true) {
      this.mode$.set('single');
    }
  }

  /**
   * @deprecated use `mode` input attribute
   */
  get fakeSingleSelect(): boolean {
    return this.mode$() === 'single';
  }

  /**
   * @deprecated use `mode` input attribute
   */
  @Input() set multipleSelect(value: boolean) {
    if (value === true) {
      this.mode$.set('multiple');
    }
  }

  /**
   * @deprecated use `mode` input attribute
   */
  get multipleSelect(): boolean {
    return this.mode$() === 'multiple';
  }

  @Input() set mode(value: SelectType) {
    this.mode$.set(value ?? 'simple');
  }

  get mode(): SelectType {
    return this.mode$();
  }

  @Input() set model(value: (BaseModelInterface<any> & FieldsInterface<any>) | null) {
    if (!value) {
      return;
    }

    this.model$.set(value);
    // Type guard to check if it's a full model with fields
    const hasFields = (obj: any): obj is BaseModelInterface<any> & FieldsInterface<any> => {
      return obj && typeof obj === 'object' && 'fields' in obj && 'model_name' in obj;
    };

    // Try to set labels, prepend, append, and other field-derived properties for all modes
    if (hasFields(value) && value.fields && value.fields[this.field$()]) {
      this.title$.set(this.helperService.getTitle(value, this.field$()));
      this.prepend$.set(this.helperService.getPrepend(value, this.field$()));
      this.append$.set(this.helperService.getAppend(value, this.field$()));
      this.label$.set(this.helperService.getLabel(value, this.field$()));

      if (value.validationRules && value.validationRules[this.field$()]) {
        this.isRequired$.set(this.helperService.isRequired(value, this.field$()));
      }
    }

    // For simple mode, we don't require the full fields structure
    if (this.mode$() === 'simple') {
      return;
    }

    if (!hasFields(value)) {
      console.warn(
        'Model is missing fields or model_name properties required for non-simple modes'
      );

      return;
    }
    const fullModel = value;

    // if model's 'fields' is not defined or null
    if (!fullModel.fields) {
      console.error(`Your ${fullModel.model_name}'s 'fields' field is`, fullModel.fields);

      return;
    }

    // if model's used field is not defined or null
    if (!fullModel.fields[this.field$()]) {
      console.error(
        `The ${fullModel.model_name}'s ${this.field$()} field is `,
        fullModel.fields[this.field$()]
      );

      return;
    }

    // add 'name' property as default value on fake single select mode if model is set
    if (!!fullModel && this.fakeSingleSelect) {
      this.selectedModelName$.set((fullModel as { name?: string }).name ?? '');
    }
  }

  get model(): (BaseModelInterface<any> & FieldsInterface<any>) | null {
    return this.model$() as BaseModelInterface<any> & FieldsInterface<any>;
  }

  @Input() set field(value: string) {
    const fieldValue = value === 'undefined' ? 'id' : value;

    this.field$.set(fieldValue);
    // Recalculate meta information (label, prepend, append, required) if model already present
    const currentModel = this.model$();
    
    if (currentModel) {
      try {
        if (currentModel.fields && currentModel.fields[fieldValue]) {
          this.title$.set(this.helperService.getTitle(currentModel, fieldValue));
          this.prepend$.set(this.helperService.getPrepend(currentModel, fieldValue));
          this.append$.set(this.helperService.getAppend(currentModel, fieldValue));
          this.label$.set(this.helperService.getLabel(currentModel, fieldValue));
        }

        if (currentModel.validationRules) {
          const hasRule = !!currentModel.validationRules[fieldValue];

          this.isRequired$.set(
            hasRule ? this.helperService.isRequired(currentModel, fieldValue) : false
          );
        }
      } catch {
        // swallow – non-blocking recalculation
      }
    }
  }

  get field(): string {
    return this.field$();
  }

  @Input() set items(value: Array<any> | null) {
    if (!value) {
      return;
    }

    this.items$.set(value);
  }

  get items(): Array<any> {
    return this.items$();
  }

  // Public API getters for external access
  get label(): string {
    return this.label$();
  }

  get prepend(): string {
    return this.prepend$();
  }

  get append(): string {
    return this.append$();
  }

  get isRequired(): boolean {
    return this.isRequired$();
  }

  get selectedModelName(): string {
    return this.selectedModelName$();
  }

  @Input() wrapperClass = 'd-flex flex-wrap';
  @Input() labelClass = 'col-12 col-md-3 px-0 col-form-label';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() showLabel = true;
  @Input() disabledAppearance = false;
  @Input() disabled = false;
  @Input() addEmptyOption = true;
  @Input() dialogSettings: DialogContentWithOptionsInterface;
  @Input() text = 'name';
  @Input() valueField = 'id';
  @Input() unselectedText = 'Válassz';

  // selected items
  @Input() disableShowSelectedItems = false;
  @Input() showIcon = false;
  @Input() selectedElementsBlockClass = 'col-12 d-flex flex-wrap px-0';
  @Input() selectedElementsBlockExtraClass = 'col-md-9 d-flex flex-wrap';

  @Output() readonly selected: EventEmitter<any> = new EventEmitter();
  @Output() readonly selectModel: EventEmitter<any> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() readonly change: EventEmitter<any> = new EventEmitter();

  private readonly helperService: InputHelperServiceInterface =
    DdataCoreModule.InjectorInstance.get<InputHelperServiceInterface>(InputHelperService);

  protected readonly field$ = signal('id');
  protected readonly title$ = signal('');
  protected readonly label$ = signal('');
  protected readonly prepend$ = signal('');
  protected readonly append$ = signal('');
  protected readonly isRequired$ = signal(false);
  protected readonly items$ = signal<Array<any>>([]);
  protected readonly model$ = signal<any | null>(null);
  protected readonly selectedModelName$ = signal('');
  protected readonly mode$ = signal<SelectType>('simple');

  selectedEmit(value: any): void {
    this.selected.emit(value);
    this.change.emit(value);
  }

  selectModelEmit(value: any): void {
    this.selectModel.emit(value);
  }
}
