import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  HostListener,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { BaseModelInterface, DdataCoreModule, FieldsInterface } from 'ddata-core';
import { InputHelperServiceInterface } from '../../../services/input/helper/input-helper-service.interface';
import { InputHelperService } from '../../../services/input/helper/input-helper.service';

@Component({
  selector: 'dd-autocomplete-select',
  templateUrl: './autocomplete-select.component.html',
  styleUrls: ['./autocomplete-select.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdataAutocompleteSelectComponent implements OnInit {
  // All @Input and @Output properties first
  @Input() wrapperClass = 'd-flex flex-wrap';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() unselectedText = 'Válassz vagy írj...';
  @Input() isRequired = false;
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

  @ViewChild('inputBox') inputBox: ElementRef;

  // Private and internal fields after @Input/@Output
  private helperService: InputHelperServiceInterface;
  private random: string;
  private selectedModel: unknown;

  // Internal state
  isOpen = false;
  filteredItems: Array<unknown> = [];
  selectedIndex = -1;
  inputValue = '';

  constructor(private readonly elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  ngOnInit(): void {
    this.inputValue = this.selectedItemText;
    this.filteredItems = [...this.items];
  }

  onInputFocus(): void {
    this.openDropdown();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;

    this.inputValue = target.value;
    this.filterItems();
    this.openDropdown();
    this.selectedIndex = -1;
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateDown();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateUp();
        break;
      case 'Enter':
        event.preventDefault();
        this.selectCurrentItem();
        break;
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        this.inputBox.nativeElement.blur();
        break;
      case 'Tab':
        this.closeDropdown();
        break;
      default:
        // Handle other key presses if needed
        break;
    }
  }

  selectItem(item: unknown, index?: number): void {
    this.selectedModel = item;
    this.model[this.field] = item[this.valueField];
    this.inputValue = item[this.text];

    if (typeof index === 'number') {
      this.selectedIndex = index;
    }

    this.closeDropdown();

    this.selected.emit(this.model[this.field]);
    this.selectModel.emit(this.selectedModel);
  }

  getOptionId(index: number): string {
    return `${this.listboxId}_option_${index}`;
  }

  getActiveDescendant(): string | null {
    return this.isOpen && this.selectedIndex >= 0 ? this.getOptionId(this.selectedIndex) : null;
  }

  private getHelperService(): InputHelperServiceInterface {
    if (!this.helperService) {
      this.helperService =
        DdataCoreModule.InjectorInstance?.get<InputHelperServiceInterface>(InputHelperService);
    }

    return this.helperService;
  }

  get id(): string {
    if (!this.random) {
      const helperRandom = this.getHelperService()?.randChars();
      const randomBase = Math.random().toString(36);
      const fallbackRandom = randomBase.substr(2, 9);

      this.random = helperRandom || `autocomplete-${fallbackRandom}`;
    }

    return `${this.field}_${this.random}`;
  }

  get listboxId(): string {
    return `${this.id}_listbox`;
  }

  get selectedItemText(): string {
    if (!this.model[this.field]) {
      return '';
    }
    const selectedItem = this.items.find(
      (item) => item[this.valueField] === this.model[this.field]
    );

    return selectedItem ? selectedItem[this.text] : '';
  }

  private filterItems(): void {
    if (!this.inputValue.trim()) {
      this.filteredItems = [...this.items];

      return;
    }
    const searchText = this.inputValue.toLowerCase();

    this.filteredItems = this.items.filter((item) =>
      item[this.text].toLowerCase().includes(searchText)
    );
  }

  private openDropdown(): void {
    if (!this.disabled) {
      this.isOpen = true;
    }
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.selectedIndex = -1;
  }

  private navigateDown(): void {
    if (!this.isOpen) {
      this.openDropdown();

      return;
    }

    if (this.selectedIndex < this.filteredItems.length - 1) {
      this.selectedIndex++;
    }
  }

  private navigateUp(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  private selectCurrentItem(): void {
    if (this.isOpen && this.selectedIndex >= 0 && this.selectedIndex < this.filteredItems.length) {
      this.selectItem(this.filteredItems[this.selectedIndex], this.selectedIndex);
    }
  }
}
