import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DdataSimpleSelectComponent } from './simple-select.component';

describe('DdataSimpleSelectComponent', () => {
  let component: DdataSimpleSelectComponent;
  let fixture: ComponentFixture<DdataSimpleSelectComponent>;

  // Mock objects for testing
  const mockCountry1 = { id: 1, name: 'United States' };
  const mockCountry2 = { id: 2, name: 'Canada' };
  const mockCountry3 = { id: 3, name: 'Mexico' };
  const mockCountries = [mockCountry1, mockCountry2, mockCountry3];

  const mockModel = {
    country_id: 2
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DdataSimpleSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DdataSimpleSelectComponent);
    component = fixture.componentInstance;

    // Set up component with mock data
    component.model = mockModel as any;
    component.field = 'country_id';
    component.items = mockCountries;
    component.text = 'name';
    component.valueField = 'id';
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values for inputs', () => {
      const newComponent = new DdataSimpleSelectComponent();
      
      expect(newComponent.wrapperClass).toBe('d-flex flex-wrap');
      expect(newComponent.inputBlockClass).toBe('col-12 d-flex px-0');
      expect(newComponent.inputBlockExtraClass).toBe('col-md-9');
      expect(newComponent.unselectedText).toBe('Válassz');
      expect(newComponent.isRequire).toBe(false);
      expect(newComponent.disabledAppearance).toBe(false);
      expect(newComponent.disabled).toBe(false);
      expect(newComponent.addEmptyOption).toBe(true);
      expect(newComponent.field).toBe('id');
      expect(newComponent.text).toBe('name');
      expect(newComponent.valueField).toBe('id');
    });

    it('should generate unique id', () => {
      component.field = 'test_field';
      const id1 = component.id;
      
      const newComponent = new DdataSimpleSelectComponent();
      newComponent.field = 'test_field';
      const id2 = newComponent.id;
      
      expect(id1).toContain('test_field_');
      expect(id2).toContain('test_field_');
      expect(id1).not.toBe(id2);
    });
  });

  describe('selectItem', () => {
    beforeEach(() => {
      component.model = { country_id: 2 } as any;
      component.field = 'country_id';
      component.items = mockCountries;
      component.valueField = 'id';
    });

    it('should find and set selected model based on field value', () => {
      spyOn(component.selected, 'emit');
      spyOn(component.selectModel, 'emit');
      
      component.selectItem();
      
      expect(component.selectModel.emit).toHaveBeenCalledWith(mockCountry2);
    });

    it('should emit selected event with field value', () => {
      spyOn(component.selected, 'emit');
      spyOn(component.selectModel, 'emit');
      
      component.selectItem();
      
      expect(component.selected.emit).toHaveBeenCalledWith(2);
    });

    it('should emit selectModel event with found model', () => {
      spyOn(component.selected, 'emit');
      spyOn(component.selectModel, 'emit');
      
      component.selectItem();
      
      expect(component.selectModel.emit).toHaveBeenCalledWith(mockCountry2);
    });

    it('should handle when no matching item is found', () => {
      component.model = { country_id: 999 } as any;
      spyOn(component.selected, 'emit');
      spyOn(component.selectModel, 'emit');
      
      component.selectItem();
      
      expect(component.selected.emit).toHaveBeenCalledWith(999);
      expect(component.selectModel.emit).toHaveBeenCalledWith(undefined);
    });

    it('should work with different field configurations', () => {
      component.model = { tag_id: 1 } as any;
      component.field = 'tag_id';
      component.items = [
        { id: 1, tag_id: 1, name: 'Tag 1' },
        { id: 2, tag_id: 2, name: 'Tag 2' }
      ];
      spyOn(component.selected, 'emit');
      spyOn(component.selectModel, 'emit');
      
      component.selectItem();
      
      expect(component.selectModel.emit).toHaveBeenCalledWith({ id: 1, tag_id: 1, name: 'Tag 1' });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null model gracefully', () => {
      component.model = null;
      
      expect(() => component.selectItem()).not.toThrow();
    });

    it('should handle empty items array', () => {
      component.items = [];
      component.model = { country_id: 1 } as any;
      spyOn(component.selected, 'emit');
      spyOn(component.selectModel, 'emit');
      
      component.selectItem();
      
      expect(component.selected.emit).toHaveBeenCalledWith(1);
      expect(component.selectModel.emit).toHaveBeenCalledWith(undefined);
    });

    it('should handle null items array', () => {
      component.items = null as any;
      component.model = { country_id: 1 } as any;
      
      expect(() => component.selectItem()).not.toThrow();
    });

    it('should handle undefined field in model', () => {
      component.model = {} as any;
      component.field = 'nonexistent_field';
      spyOn(component.selected, 'emit');
      spyOn(component.selectModel, 'emit');
      
      component.selectItem();
      
      expect(component.selected.emit).toHaveBeenCalledWith(undefined);
      expect(component.selectModel.emit).toHaveBeenCalledWith(undefined);
    });

    it('should handle items with missing field values', () => {
      component.items = [
        { name: 'Item 1' }, // missing id
        { id: 2, name: 'Item 2' }
      ];
      component.model = { country_id: 2 } as any;
      component.field = 'country_id';
      spyOn(component.selected, 'emit');
      spyOn(component.selectModel, 'emit');
      
      component.selectItem();
      
      expect(component.selectModel.emit).toHaveBeenCalledWith({ id: 2, name: 'Item 2' });
    });
  });

  describe('Component Configuration', () => {
    it('should allow custom wrapper class', () => {
      component.wrapperClass = 'custom-wrapper';
      
      expect(component.wrapperClass).toBe('custom-wrapper');
    });

    it('should allow custom input block classes', () => {
      component.inputBlockClass = 'custom-input';
      component.inputBlockExtraClass = 'custom-extra';
      
      expect(component.inputBlockClass).toBe('custom-input');
      expect(component.inputBlockExtraClass).toBe('custom-extra');
    });

    it('should allow custom label configuration', () => {
      component.labelClass = 'custom-label';
      component.showLabel = false;
      component.labelText = 'Custom Label';
      
      expect(component.labelClass).toBe('custom-label');
      expect(component.showLabel).toBe(false);
      expect(component.labelText).toBe('Custom Label');
    });

    it('should allow custom text elements', () => {
      component.prepend = 'Before';
      component.append = 'After';
      component.unselectedText = 'Choose one';
      
      expect(component.prepend).toBe('Before');
      expect(component.append).toBe('After');
      expect(component.unselectedText).toBe('Choose one');
    });

    it('should allow behavior configuration', () => {
      component.isRequire = true;
      component.disabledAppearance = true;
      component.disabled = true;
      component.addEmptyOption = false;
      
      expect(component.isRequire).toBe(true);
      expect(component.disabledAppearance).toBe(true);
      expect(component.disabled).toBe(true);
      expect(component.addEmptyOption).toBe(false);
    });

    it('should allow field configuration', () => {
      component.text = 'title';
      component.valueField = 'key';
      
      expect(component.text).toBe('title');
      expect(component.valueField).toBe('key');
    });
  });

  describe('Integration Tests', () => {
    it('should work with complex object structures', () => {
      const complexItems = [
        { id: 1, name: 'Item 1', metadata: { category: 'A' } },
        { id: 2, name: 'Item 2', metadata: { category: 'B' } },
        { id: 3, name: 'Item 3', metadata: { category: 'A' } }
      ];
      
      component.items = complexItems;
      component.model = { item_id: 2 } as any;
      component.field = 'item_id';
      component.valueField = 'id';
      
      spyOn(component.selectModel, 'emit');
      
      component.selectItem();
      
      expect(component.selectModel.emit).toHaveBeenCalledWith(complexItems[1]);
    });

    it('should handle multiple select operations', () => {
      spyOn(component.selected, 'emit');
      spyOn(component.selectModel, 'emit');
      
      // First selection
      component.model = { country_id: 1 } as any;
      component.selectItem();
      
      expect(component.selected.emit).toHaveBeenCalledWith(1);
      expect(component.selectModel.emit).toHaveBeenCalledWith(mockCountry1);
      
      // Second selection
      component.model = { country_id: 3 } as any;
      component.selectItem();
      
      expect(component.selected.emit).toHaveBeenCalledWith(3);
      expect(component.selectModel.emit).toHaveBeenCalledWith(mockCountry3);
    });
  });
});