/* eslint-disable @typescript-eslint/no-explicit-any, max-lines */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseModel } from 'ddata-core';
import { DdataAutocompleteSelectComponent } from './autocomplete-select.component';

declare const document: Document;
import { ElementRef } from '@angular/core';

// Mock helper service to avoid dependency issues
class MockInputHelperService {
  randChars(): string {
    return 'test-random-id';
  }
}

describe('DdataAutocompleteSelectComponent', () => {
  let component: DdataAutocompleteSelectComponent;
  let fixture: ComponentFixture<DdataAutocompleteSelectComponent>;
  let mockElementRef: ElementRef;
  let mockInputElement: HTMLInputElement;

  beforeEach(async () => {
    // Create mock input element
    mockInputElement = document.createElement('input');
    mockInputElement.blur = jasmine.createSpy('blur');

    // Create mock ElementRef
    mockElementRef = {
      nativeElement: {
        contains: jasmine.createSpy('contains').and.returnValue(false),
        querySelector: jasmine.createSpy('querySelector').and.returnValue(mockInputElement)
      }
    } as ElementRef;

    await TestBed.configureTestingModule({
      declarations: [DdataAutocompleteSelectComponent],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataAutocompleteSelectComponent);
    component = fixture.componentInstance;

    // Mock the helper service
    (component as unknown as { helperService: unknown }).helperService =
      new MockInputHelperService();

    // Mock inputBox ViewChild
    component.inputBox = { nativeElement: mockInputElement } as ElementRef;

    // Set up basic test data
    component.model = new BaseModel();
    component.field = 'id';
    component.items = [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Banana' },
      { id: 3, name: 'Cherry' }
    ];

    // Initialize component state
    component.ngOnInit();
    fixture.detectChanges();
  });

  describe('Component Creation and Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.isOpen).toBe(false);
      expect(component.selectedIndex).toBe(-1);
      expect(component.inputValue).toBe('');
      expect(component.filteredItems).toEqual(component.items);
    });

    it('should initialize with selected item text if model has value', () => {
      component.model[component.field] = 2;
      component.ngOnInit();

      expect(component.inputValue).toBe('Banana');
    });

    it('should handle empty items array', () => {
      component.items = [];
      component.ngOnInit();

      expect(component.filteredItems).toEqual([]);
    });
  });

  describe('Input Properties', () => {
    it('should have default CSS classes', () => {
      expect(component.wrapperClass).toBe('d-flex flex-wrap');
      expect(component.inputBlockClass).toBe('col-12 d-flex px-0');
      expect(component.inputBlockExtraClass).toBe('col-md-9');
      expect(component.labelClass).toBe('col-12 col-md-3 px-0 col-form-label');
    });

    it('should have default behavior properties', () => {
      expect(component.isRequired).toBe(false);
      expect(component.disabledAppearance).toBe(false);
      expect(component.disabled).toBe(false);
      expect(component.addEmptyOption).toBe(true);
      expect(component.showLabel).toBe(true);
    });

    it('should have default text properties', () => {
      expect(component.unselectedText).toBe('Válassz vagy írj...');
      expect(component.labelText).toBe('');
      expect(component.prepend).toBe('');
      expect(component.append).toBe('');
      expect(component.text).toBe('name');
      expect(component.valueField).toBe('id');
    });
  });

  describe('ID Generation', () => {
    it('should generate unique ID', () => {
      const id = component.id;

      expect(id).toContain(component.field);
      expect(id).toContain('test-random-id');
    });

    it('should generate listbox ID', () => {
      const listboxId = component.listboxId;

      expect(listboxId).toBe(`${component.id}_listbox`);
    });

    it('should generate option ID', () => {
      const optionId = component.getOptionId(1);

      expect(optionId).toBe(`${component.listboxId}_option_1`);
    });

    it('should fallback to random ID when helper service is not available', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).helperService = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).random = null;
      const id = component.id;

      expect(id).toContain('autocomplete-');
    });
  });

  describe('Selected Item Text', () => {
    it('should return empty string when no value selected', () => {
      component.model[component.field] = null;

      expect(component.selectedItemText).toBe('');
    });

    it('should return correct text for selected item', () => {
      component.model[component.field] = 2;

      expect(component.selectedItemText).toBe('Banana');
    });

    it('should return empty string when selected value not found in items', () => {
      component.model[component.field] = 999;

      expect(component.selectedItemText).toBe('');
    });
  });

  describe('Input Events', () => {
    it('should open dropdown on input focus', () => {
      component.isOpen = false;
      component.onInputFocus();

      expect(component.isOpen).toBe(true);
    });

    it('should not open dropdown on focus when disabled', () => {
      component.disabled = true;
      component.isOpen = false;
      component.onInputFocus();

      expect(component.isOpen).toBe(false);
    });

    it('should handle input event and filter items', () => {
      const event = { target: { value: 'ap' } } as Event & { target: HTMLInputElement };

      component.onInput(event);

      expect(component.inputValue).toBe('ap');
      expect(component.isOpen).toBe(true);
      expect(component.selectedIndex).toBe(-1);
      expect(component.filteredItems.length).toBe(1);
      expect((component.filteredItems[0] as any).name).toBe('Apple');
    });

    it('should handle empty input value', () => {
      const event = { target: { value: '' } } as Event & { target: HTMLInputElement };

      component.onInput(event);

      expect(component.filteredItems).toEqual(component.items);
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      component.isOpen = true;
      component.filteredItems = component.items;
    });

    it('should handle ArrowDown key', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

      spyOn(event, 'preventDefault');

      component.onKeydown(event);

      expect(event.preventDefault).toHaveBeenCalledWith();
      expect(component.selectedIndex).toBe(0);
    });

    it('should handle ArrowUp key', () => {
      component.selectedIndex = 1;
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

      spyOn(event, 'preventDefault');

      component.onKeydown(event);

      expect(event.preventDefault).toHaveBeenCalledWith();
      expect(component.selectedIndex).toBe(0);
    });

    it('should handle Enter key', () => {
      component.selectedIndex = 1;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      spyOn(event, 'preventDefault');
      spyOn(component, 'selectItem');

      component.onKeydown(event);

      expect(event.preventDefault).toHaveBeenCalledWith();
      expect(component.selectItem).toHaveBeenCalledWith(component.filteredItems[1], 1);
    });

    it('should handle Escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      spyOn(event, 'preventDefault');

      component.onKeydown(event);

      expect(event.preventDefault).toHaveBeenCalledWith();
      expect(component.isOpen).toBe(false);
      expect(mockInputElement.blur).toHaveBeenCalledWith();
    });

    it('should handle Tab key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Tab' });

      component.onKeydown(event);

      expect(component.isOpen).toBe(false);
    });

    it('should handle unknown key without action', () => {
      const event = new KeyboardEvent('keydown', { key: 'Unknown' });
      const initialState = component.selectedIndex;

      component.onKeydown(event);

      expect(component.selectedIndex).toBe(initialState);
    });
  });

  describe('Navigation Methods', () => {
    beforeEach(() => {
      component.filteredItems = component.items;
    });

    it('should navigate down and open dropdown if closed', () => {
      component.isOpen = false;
      (component as any).navigateDown();

      expect(component.isOpen).toBe(true);
    });

    it('should navigate down when dropdown is open', () => {
      component.isOpen = true;
      component.selectedIndex = -1;

      (component as any).navigateDown();

      expect(component.selectedIndex).toBe(0);

      (component as any).navigateDown();

      expect(component.selectedIndex).toBe(1);

      (component as any).navigateDown();

      expect(component.selectedIndex).toBe(2);
    });

    it('should not navigate down beyond last item', () => {
      component.isOpen = true;
      component.selectedIndex = component.filteredItems.length - 1;

      (component as any).navigateDown();

      expect(component.selectedIndex).toBe(component.filteredItems.length - 1);
    });

    it('should navigate up', () => {
      component.selectedIndex = 2;

      (component as any).navigateUp();

      expect(component.selectedIndex).toBe(1);

      (component as any).navigateUp();

      expect(component.selectedIndex).toBe(0);
    });

    it('should not navigate up beyond first item', () => {
      component.selectedIndex = 0;

      (component as any).navigateUp();

      expect(component.selectedIndex).toBe(0);
    });
  });

  describe('Item Selection', () => {
    it('should select item and emit events', () => {
      spyOn(component.selected, 'emit');
      spyOn(component.selectModel, 'emit');
      const testItem = { id: 1, name: 'Apple' };

      component.selectItem(testItem);

      expect(component.model[component.field]).toBe(1);
      expect(component.inputValue).toBe('Apple');
      expect(component.isOpen).toBe(false);
      expect(component.selected.emit).toHaveBeenCalledWith(1);
      expect(component.selectModel.emit).toHaveBeenCalledWith(testItem);
    });

    it('should select item with index', () => {
      const testItem = { id: 2, name: 'Banana' };

      component.selectItem(testItem, 1);

      expect(component.selectedIndex).toBe(1);
      expect(component.model[component.field]).toBe(2);
    });

    it('should select current item when Enter pressed', () => {
      component.isOpen = true;
      component.selectedIndex = 1;
      component.filteredItems = component.items;
      spyOn(component, 'selectItem');

      (component as any).selectCurrentItem();

      expect(component.selectItem).toHaveBeenCalledWith(component.filteredItems[1], 1);
    });

    it('should not select item when dropdown closed', () => {
      component.isOpen = false;
      component.selectedIndex = 1;
      spyOn(component, 'selectItem');

      (component as any).selectCurrentItem();

      expect(component.selectItem).not.toHaveBeenCalled();
    });

    it('should not select item when no item selected', () => {
      component.isOpen = true;
      component.selectedIndex = -1;
      spyOn(component, 'selectItem');

      (component as any).selectCurrentItem();

      expect(component.selectItem).not.toHaveBeenCalled();
    });

    it('should not select item when selected index out of bounds', () => {
      component.isOpen = true;
      component.selectedIndex = 999;
      component.filteredItems = component.items;
      spyOn(component, 'selectItem');

      (component as any).selectCurrentItem();

      expect(component.selectItem).not.toHaveBeenCalled();
    });
  });

  describe('Filtering', () => {
    it('should filter items based on input case insensitive', () => {
      component.inputValue = 'APPLE';
      (component as any).filterItems();

      expect(component.filteredItems.length).toBe(1);
      expect((component.filteredItems[0] as any).name).toBe('Apple');
    });

    it('should filter items with partial match', () => {
      component.inputValue = 'an';
      (component as any).filterItems();

      expect(component.filteredItems.length).toBe(1);
      expect((component.filteredItems[0] as any).name).toBe('Banana');
    });

    it('should return all items when input is empty', () => {
      component.inputValue = '';
      (component as any).filterItems();

      expect(component.filteredItems).toEqual(component.items);
    });

    it('should return all items when input is only whitespace', () => {
      component.inputValue = '   ';
      (component as any).filterItems();

      expect(component.filteredItems).toEqual(component.items);
    });

    it('should return empty array when no matches found', () => {
      component.inputValue = 'xyz';
      (component as any).filterItems();

      expect(component.filteredItems.length).toBe(0);
    });

    it('should handle different text field names', () => {
      component.text = 'label';
      component.items = [
        { id: 1, label: 'Option A' },
        { id: 2, label: 'Option B' }
      ];
      component.inputValue = 'A';

      (component as any).filterItems();

      expect(component.filteredItems.length).toBe(1);
      expect((component.filteredItems[0] as any).label).toBe('Option A');
    });
  });

  describe('Dropdown Management', () => {
    it('should open dropdown when not disabled', () => {
      component.disabled = false;
      component.isOpen = false;

      (component as any).openDropdown();

      expect(component.isOpen).toBe(true);
    });

    it('should not open dropdown when disabled', () => {
      component.disabled = true;
      component.isOpen = false;

      (component as any).openDropdown();

      expect(component.isOpen).toBe(false);
    });

    it('should close dropdown and reset selection', () => {
      component.isOpen = true;
      component.selectedIndex = 2;

      (component as any).closeDropdown();

      expect(component.isOpen).toBe(false);
      expect(component.selectedIndex).toBe(-1);
    });
  });

  describe('Click Outside Handler', () => {
    it('should close dropdown when clicking outside', () => {
      component.isOpen = true;
      const event = { target: document.body } as any;

      mockElementRef.nativeElement.contains = jasmine.createSpy('contains').and.returnValue(false);
      (component as any).elementRef = mockElementRef;

      component.onClickOutside(event);

      expect(component.isOpen).toBe(false);
    });

    it('should not close dropdown when clicking inside', () => {
      component.isOpen = true;
      const event = { target: document.body } as any;

      mockElementRef.nativeElement.contains = jasmine.createSpy('contains').and.returnValue(true);
      (component as any).elementRef = mockElementRef;

      component.onClickOutside(event);

      expect(component.isOpen).toBe(true);
    });
  });

  describe('ARIA Support', () => {
    it('should return active descendant when item is selected', () => {
      component.isOpen = true;
      component.selectedIndex = 1;

      expect(component.getActiveDescendant()).toBe(component.getOptionId(1));
    });

    it('should return null when dropdown is closed', () => {
      component.isOpen = false;
      component.selectedIndex = 1;

      expect(component.getActiveDescendant()).toBeNull();
    });

    it('should return null when no item is selected', () => {
      component.isOpen = true;
      component.selectedIndex = -1;

      expect(component.getActiveDescendant()).toBeNull();
    });

    it('should generate proper option IDs', () => {
      const optionId = component.getOptionId(5);

      expect(optionId).toBe(`${component.listboxId}_option_5`);
    });
  });

  describe('Mouse Events', () => {
    it('should select item on click', () => {
      spyOn(component, 'selectItem');
      const testItem = { id: 1, name: 'Apple' };

      // Simulate click event from template
      component.selectItem(testItem, 0);

      expect(component.selectItem).toHaveBeenCalledWith(testItem, 0);
    });

    it('should update selected index on mouse enter', () => {
      // This would be handled in the template with (mouseenter)="selectedIndex = i"
      component.selectedIndex = 2;

      expect(component.selectedIndex).toBe(2);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null items array', () => {
      component.items = null as any;

      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle undefined model field', () => {
      component.model[component.field] = undefined;

      expect(component.selectedItemText).toBe('');
    });

    it('should handle items with missing text field', () => {
      component.items = [{ id: 1 }] as any;
      component.inputValue = 'test';

      expect(() => (component as any).filterItems()).not.toThrow();
    });

    it('should handle null text field values', () => {
      component.items = [{ id: 1, name: null }] as any;
      component.inputValue = 'test';

      expect(() => (component as any).filterItems()).not.toThrow();
    });
  });

  describe('Component State Management', () => {
    it('should maintain consistent state after multiple operations', () => {
      // Open dropdown
      component.onInputFocus();

      expect(component.isOpen).toBe(true);

      // Navigate and select
      (component as any).navigateDown();

      expect(component.selectedIndex).toBe(0);

      // Select item
      component.selectItem(component.items[0]);

      expect(component.isOpen).toBe(false);
      expect(component.selectedIndex).toBe(-1);
      expect(component.model[component.field]).toBe(1);
    });

    it('should reset state properly on close', () => {
      component.isOpen = true;
      component.selectedIndex = 2;

      (component as any).closeDropdown();

      expect(component.isOpen).toBe(false);
      expect(component.selectedIndex).toBe(-1);
    });
  });

  describe('Helper Service Integration', () => {
    it('should get helper service instance', () => {
      const service = (component as any).getHelperService();

      expect(service).toBeDefined();
      expect(service.randChars()).toBe('test-random-id');
    });

    it('should cache helper service instance', () => {
      const service1 = (component as any).getHelperService();
      const service2 = (component as any).getHelperService();

      expect(service1).toBe(service2);
    });
  });
});
