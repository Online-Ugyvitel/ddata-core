import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { BaseModelInterface, DdataCoreModule, FieldsInterface } from '@netdjw/ddata-core';
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
  @Input() wrapperClass = 'dd-field';
  @Input() inputBlockClass = 'dd-field-control';
  /**
   * @deprecated the input block has no extra class any more, it does nothing
   */
  @Input() inputBlockExtraClass = '';
  @Input() unselectedText = 'Válassz';
  @Input() isRequired = false;
  @Input() disabledAppearance = false;
  @Input() disabled = false;
  @Input() addEmptyOption = true;
  @Input() labelClass = 'form-label';
  @Input() showLabel = true;
  @Input() labelText = '';
  @Input() prepend = '';
  @Input() append = '';
  @Input() model: (BaseModelInterface<unknown> & FieldsInterface<unknown>) | null = null;
  @Input() field = 'id';
  @Input() items: Array<unknown> = [];
  @Input() text = 'name';
  @Input() valueField = 'id';
  @Input() helpText = '';
  @Input() errorText = '';
  @Input() errorSuggestion = '';
  /**
   * Accepted for the API of all fields; a select has no counter, so it does nothing.
   */
  @Input() counterPlacement: 'label' | 'control' = 'label';
  @Input() size: 'md' | 'sm' = 'md';
  @Input() layout: 'stacked' | 'inline' = 'stacked';
  @Input() chevronIcon: IconDefinition = faChevronDown;

  @Output() readonly selected: EventEmitter<unknown> = new EventEmitter();
  @Output() readonly selectModel: EventEmitter<unknown> = new EventEmitter();

  // Private fields after @Input/@Output
  private readonly helperService: InputHelperServiceInterface =
    DdataCoreModule.InjectorInstance.get<InputHelperServiceInterface>(InputHelperService);

  private readonly random: string = this.helperService.randChars();
  private selectedModel: unknown;

  readonly warningIcon = faTriangleExclamation;

  get id(): string {
    return `${this.field}_${this.random}`;
  }

  get helpId(): string {
    return `${this.id}_help`;
  }

  get errorId(): string {
    return `${this.id}_error`;
  }

  get isInvalid(): boolean {
    return !!this.model?.validationErrors?.includes(this.field);
  }

  get helpMessage(): string {
    return this.helpText || (this.model?.fields?.[this.field]?.help ?? '');
  }

  get errorMessage(): string {
    return this.helperService.getErrorText(
      this.model,
      this.field,
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

  selectItem(): void {
    if (!this.model) {
      return;
    }

    this.selectedModel = this.items.find(
      (item) => item[this.valueField] === this.model[this.field]
    );

    this.selected.emit(this.model[this.field]);
    this.selectModel.emit(this.selectedModel);
  }
}
