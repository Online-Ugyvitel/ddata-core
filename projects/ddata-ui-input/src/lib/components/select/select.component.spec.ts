import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DdataSelectComponent } from './select.component';
import { BaseModel } from 'ddata-core';

describe('DdataSelectComponent', () => {
  let component: DdataSelectComponent;
  let fixture: ComponentFixture<DdataSelectComponent>;

  // Mock objects for testing
  const mockCountry1 = { id: 1, name: 'United States' };
  const mockCountry2 = { id: 2, name: 'Canada' };
  const mockCountries = [mockCountry1, mockCountry2];

  const mockModel = {
    country_id: 1,
    country: mockCountry1,
    fields: {
      country_id: {
        label: 'Country',
        title: 'Select a country'
      }
    },
    validationRules: {
      country_id: { required: true }
    },
    model_name: 'Address'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DdataSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DdataSelectComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values for inputs', () => {
      expect(component.wrapperClass).toBe('d-flex flex-wrap');
      expect(component.labelClass).toBe('col-12 col-md-3 px-0 col-form-label');
      expect(component.inputBlockClass).toBe('col-12 d-flex px-0');
      expect(component.inputBlockExtraClass).toBe('col-md-9');
      expect(component.showLabel).toBe(true);
      expect(component.disabledAppearance).toBe(false);
      expect(component.disabled).toBe(false);
      expect(component.addEmptyOption).toBe(true);
      expect(component.text).toBe('name');
      expect(component.valueField).toBe('id');
      expect(component.unselectedText).toBe('Válassz');
    });

    it('should initialize with default mode as simple', () => {
      expect(component['_mode']).toBe('simple');
    });
  });

  describe('Deprecated Properties', () => {
    it('should set mode to single when fakeSingleSelect is true', () => {
      component.fakeSingleSelect = true;
      
      expect(component['_mode']).toBe('single');
      expect(component.fakeSingleSelect).toBe(true);
    });

    it('should return true when mode is single for fakeSingleSelect getter', () => {
      component.mode = 'single';
      
      expect(component.fakeSingleSelect).toBe(true);
    });

    it('should set mode to multiple when multipleSelect is true', () => {
      component.multipleSelect = true;
      
      expect(component['_mode']).toBe('multiple');
      expect(component.multipleSelect).toBe(true);
    });

    it('should return true when mode is multiple for multipleSelect getter', () => {
      component.mode = 'multiple';
      
      expect(component.multipleSelect).toBe(true);
    });
  });

  describe('Mode Property', () => {
    it('should set mode correctly', () => {
      component.mode = 'single';
      expect(component['_mode']).toBe('single');
      
      component.mode = 'multiple';
      expect(component['_mode']).toBe('multiple');
      
      component.mode = 'simple';
      expect(component['_mode']).toBe('simple');
    });

    it('should default to simple mode when null is provided', () => {
      component.mode = null as any;
      
      expect(component['_mode']).toBe('simple');
    });

    it('should default to simple mode when undefined is provided', () => {
      component.mode = undefined as any;
      
      expect(component['_mode']).toBe('simple');
    });
  });

  describe('Model Property', () => {
    it('should return early when null model is provided', () => {
      component.model = null;
      
      expect(component.model).toBeInstanceOf(BaseModel);
    });

    it('should set model and extract field information', () => {
      component.field = 'country_id';
      component.model = mockModel as any;
      
      expect(component.model).toEqual(mockModel as any);
      expect(component['_title']).toBeDefined();
      expect(component['_label']).toBeDefined();
    });

    it('should handle model without fields', () => {
      spyOn(console, 'error');
      const modelWithoutFields = { ...mockModel, fields: null };
      
      component.model = modelWithoutFields as any;
      
      expect(console.error).toHaveBeenCalledWith(
        `Your ${modelWithoutFields.model_name}'s 'fields' field is`,
        null
      );
    });

    it('should handle model with missing field definition', () => {
      spyOn(console, 'error');
      const modelWithMissingField = {
        ...mockModel,
        fields: {}
      };
      component.field = 'missing_field';
      
      component.model = modelWithMissingField as any;
      
      expect(console.error).toHaveBeenCalledWith(
        `The ${modelWithMissingField.model_name}'s missing_field field is `,
        undefined
      );
    });

    it('should set required flag from validation rules', () => {
      component.field = 'country_id';
      component.model = mockModel as any;
      
      expect(component['_isRequired']).toBe(true);
    });

    it('should set selected model name for fake single select mode', () => {
      component.fakeSingleSelect = true;
      const modelWithName = { ...mockModel, name: 'Test Name' };
      component.model = modelWithName as any;
      
      expect(component['_selectedModelName']).toBe('Test Name');
    });

    it('should handle model without name for fake single select', () => {
      component.fakeSingleSelect = true;
      component.model = mockModel as any;
      
      expect(component['_selectedModelName']).toBe('');
    });
  });

  describe('Field Property', () => {
    it('should set field correctly', () => {
      component.field = 'test_field';
      
      expect(component['_field']).toBe('test_field');
    });

    it('should default to id when undefined is provided', () => {
      component.field = 'undefined';
      
      expect(component['_field']).toBe('id');
    });
  });

  describe('Items Property', () => {
    it('should set items when provided', () => {
      component.items = mockCountries;
      
      expect(component['_items']).toBe(mockCountries);
    });

    it('should return early when null items are provided', () => {
      const originalItems = component['_items'];
      component.items = null;
      
      expect(component['_items']).toBe(originalItems);
    });
  });

  describe('Event Emission', () => {
    it('should emit selected event', () => {
      spyOn(component.selected, 'emit');
      const testValue = { test: 'data' };
      
      component.selectedEmit(testValue);
      
      expect(component.selected.emit).toHaveBeenCalledWith(testValue);
    });

    it('should emit selectModel event', () => {
      spyOn(component.selectModel, 'emit');
      const testValue = { test: 'data' };
      
      component.selectModelEmit(testValue);
      
      expect(component.selectModel.emit).toHaveBeenCalledWith(testValue);
    });
  });

  describe('Component Configuration', () => {
    it('should allow custom CSS classes', () => {
      component.wrapperClass = 'custom-wrapper';
      component.labelClass = 'custom-label';
      component.inputBlockClass = 'custom-input';
      component.inputBlockExtraClass = 'custom-extra';
      
      expect(component.wrapperClass).toBe('custom-wrapper');
      expect(component.labelClass).toBe('custom-label');
      expect(component.inputBlockClass).toBe('custom-input');
      expect(component.inputBlockExtraClass).toBe('custom-extra');
    });

    it('should allow behavior configuration', () => {
      component.showLabel = false;
      component.disabledAppearance = true;
      component.disabled = true;
      component.addEmptyOption = false;
      
      expect(component.showLabel).toBe(false);
      expect(component.disabledAppearance).toBe(true);
      expect(component.disabled).toBe(true);
      expect(component.addEmptyOption).toBe(false);
    });

    it('should allow text configuration', () => {
      component.text = 'title';
      component.valueField = 'key';
      component.unselectedText = 'Pick one';
      
      expect(component.text).toBe('title');
      expect(component.valueField).toBe('key');
      expect(component.unselectedText).toBe('Pick one');
    });

    it('should allow selected items configuration', () => {
      component.disableShowSelectedItems = true;
      component.showIcon = true;
      component.selectedElementsBlockClass = 'custom-selected';
      component.selectedElementsBlockExtraClass = 'custom-selected-extra';
      
      expect(component.disableShowSelectedItems).toBe(true);
      expect(component.showIcon).toBe(true);
      expect(component.selectedElementsBlockClass).toBe('custom-selected');
      expect(component.selectedElementsBlockExtraClass).toBe('custom-selected-extra');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow for single mode', () => {
      component.mode = 'single';
      component.field = 'country_id';
      component.model = mockModel as any;
      component.items = mockCountries;
      
      spyOn(component.selected, 'emit');
      spyOn(component.selectModel, 'emit');
      
      component.selectedEmit(1);
      component.selectModelEmit(mockCountry1);
      
      expect(component.selected.emit).toHaveBeenCalledWith(1);
      expect(component.selectModel.emit).toHaveBeenCalledWith(mockCountry1);
    });

    it('should handle complete workflow for multiple mode', () => {
      component.mode = 'multiple';
      component.field = 'countries';
      component.model = { countries: [] } as any;
      component.items = mockCountries;
      
      spyOn(component.selected, 'emit');
      spyOn(component.selectModel, 'emit');
      
      component.selectedEmit([1, 2]);
      component.selectModelEmit([mockCountry1, mockCountry2]);
      
      expect(component.selected.emit).toHaveBeenCalledWith([1, 2]);
      expect(component.selectModel.emit).toHaveBeenCalledWith([mockCountry1, mockCountry2]);
    });

    it('should handle mode changes during runtime', () => {
      // Start as simple
      expect(component['_mode']).toBe('simple');
      
      // Change to single
      component.mode = 'single';
      expect(component['_mode']).toBe('single');
      expect(component.fakeSingleSelect).toBe(true);
      
      // Change to multiple
      component.mode = 'multiple';
      expect(component['_mode']).toBe('multiple');
      expect(component.multipleSelect).toBe(true);
      
      // Change back to simple
      component.mode = 'simple';
      expect(component['_mode']).toBe('simple');
      expect(component.fakeSingleSelect).toBe(false);
      expect(component.multipleSelect).toBe(false);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing helper service gracefully', () => {
      component.model = mockModel as any;
      component.field = 'country_id';
      
      // This should not throw an error
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle model with undefined validation rules', () => {
      const modelWithoutValidation = {
        ...mockModel,
        validationRules: undefined
      };
      component.field = 'country_id';
      
      expect(() => component.model = modelWithoutValidation as any).not.toThrow();
    });

    it('should handle model with empty validation rules', () => {
      const modelWithEmptyValidation = {
        ...mockModel,
        validationRules: {}
      };
      component.field = 'country_id';
      
      expect(() => component.model = modelWithEmptyValidation as any).not.toThrow();
    });

    it('should handle multiple rapid mode changes', () => {
      const modes = ['single', 'multiple', 'simple', 'single', 'multiple'];
      
      modes.forEach(mode => {
        component.mode = mode as any;
        expect(component['_mode']).toBe(mode);
      });
    });

    it('should handle invalid mode values gracefully', () => {
      (component as any).mode = 'invalid_mode';
      
      expect(component['_mode']).toBe('invalid_mode');
    });
  });
});