import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseModel } from 'ddata-core';
import { DdataAutocompleteSelectComponent } from './autocomplete-select.component';

// Mock helper service to avoid dependency issues
class MockInputHelperService {
  randChars(): string {
    return 'test-random-id';
  }
}

describe('DdataAutocompleteSelectComponent', () => {
  let component: DdataAutocompleteSelectComponent;
  let fixture: ComponentFixture<DdataAutocompleteSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DdataAutocompleteSelectComponent],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataAutocompleteSelectComponent);
    component = fixture.componentInstance;
    
    // Mock the helper service
    (component as any).helperService = new MockInputHelperService();
    
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter items based on input', () => {
    component.inputValue = 'a';
    component['filterItems']();
    
    expect(component.filteredItems.length).toBe(2); // Apple, Banana
    expect(component.filteredItems[0].name).toBe('Apple');
    expect(component.filteredItems[1].name).toBe('Banana');
  });

  it('should handle keyboard navigation', () => {
    component.isOpen = true;
    component.filteredItems = component.items;
    
    // Navigate down
    component['navigateDown']();
    expect(component.selectedIndex).toBe(0);
    
    component['navigateDown']();
    expect(component.selectedIndex).toBe(1);
    
    // Navigate up
    component['navigateUp']();
    expect(component.selectedIndex).toBe(0);
  });

  it('should select item and emit events', () => {
    spyOn(component.selected, 'emit');
    spyOn(component.selectModel, 'emit');
    
    const testItem = { id: 1, name: 'Apple' };
    component.selectItem(testItem);
    
    expect(component.model[component.field]).toBe(1);
    expect(component.inputValue).toBe('Apple');
    expect(component.selected.emit).toHaveBeenCalledWith(1);
    expect(component.selectModel.emit).toHaveBeenCalledWith(testItem);
  });

  it('should generate proper ARIA attributes', () => {
    component.isOpen = true;
    component.selectedIndex = 1;
    
    expect(component.getActiveDescendant()).toBe(component.getOptionId(1));
    expect(component.getOptionId(1)).toContain('option_1');
  });
});