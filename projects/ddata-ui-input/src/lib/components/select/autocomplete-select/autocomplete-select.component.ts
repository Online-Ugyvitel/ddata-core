import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
import { BaseModelInterface, DdataCoreModule, FieldsInterface } from 'ddata-core';
import { InputHelperServiceInterface } from '../../../services/input/helper/input-helper-service.interface';
import { InputHelperService } from '../../../services/input/helper/input-helper.service';

@Component({
  selector: 'autocomplete-select',
  templateUrl: './autocomplete-select.component.html',
  styleUrls: ['./autocomplete-select.component.scss']
})
export class DdataAutocompleteSelectComponent implements OnInit {
  private helperService: InputHelperServiceInterface;
  private random: string;
  private selectedModel: any;

  // Internal state
  @ViewChild('inputBox') inputBox: ElementRef;
  isOpen = false;
  filteredItems: any[] = [];
  selectedIndex = -1;
  inputValue = '';

  // look & feel
  @Input() wrapperClass = 'd-flex flex-wrap';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() unselectedText = 'Válassz vagy írj...';

  // behavior
  @Input() isRequired = false;
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  constructor(private elementRef: ElementRef) {}

  private getHelperService(): InputHelperServiceInterface {
    if (!this.helperService) {
      this.helperService = DdataCoreModule.InjectorInstance?.get<InputHelperServiceInterface>(InputHelperService);
    }
    return this.helperService;
  }

  get id(): string {
    if (!this.random) {
      this.random = this.getHelperService()?.randChars() || 'autocomplete-' + Math.random().toString(36).substr(2, 9);
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
    const selectedItem = this.items.find(item => item[this.valueField] === this.model[this.field]);
    return selectedItem ? selectedItem[this.text] : '';
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
    }
  }

  private filterItems(): void {
    if (!this.inputValue.trim()) {
      this.filteredItems = [...this.items];
      return;
    }

    const searchText = this.inputValue.toLowerCase();
    this.filteredItems = this.items.filter(item =>
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

  selectItem(item: any, index?: number): void {
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

  private selectCurrentItem(): void {
    if (this.isOpen && this.selectedIndex >= 0 && this.selectedIndex < this.filteredItems.length) {
      this.selectItem(this.filteredItems[this.selectedIndex], this.selectedIndex);
    }
  }

  getOptionId(index: number): string {
    return `${this.listboxId}_option_${index}`;
  }

  getActiveDescendant(): string | null {
    return this.isOpen && this.selectedIndex >= 0 ? this.getOptionId(this.selectedIndex) : null;
  }
}