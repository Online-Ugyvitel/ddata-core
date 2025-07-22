import 'zone.js/testing';
import { Injector, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DdataInputColorComponent } from './color-input.component';
import { BaseModel, ValidatorService, DdataCoreModule, BaseModelInterface, FieldsInterface, FieldContainerInterface } from 'ddata-core';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

// Mock model for testing
class MockColorModel extends BaseModel implements BaseModelInterface<any>, FieldsInterface<HasColorField>, HasColorField {
  color = '#ff0000';
  fields: FieldContainerInterface<HasColorField> = {
    color: {
      title: 'Color Field Title',
      label: 'Color Field Label',
      placeholder: 'Color Field Placeholder',
      prepend: 'Color Prepend',
      append: 'Color Append'
    }
  };
  validationRules = {
    color: ['required', 'color_code']
  };
}

interface HasColorField {
  color: string;
}

describe('DdataInputColorComponent', () => {
  let component: DdataInputColorComponent;
  let fixture: ComponentFixture<DdataInputColorComponent>;
  let debugElement;
  let element;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DdataInputColorComponent],
      providers: [
        Injector,
        ValidatorService,
        BaseModel,
        InputHelperService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    DdataCoreModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(DdataInputColorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
    
    // Mock the ViewChild inputBox
    const mockInputElement = document.createElement('input');
    component.inputBox = new ElementRef(mockInputElement);
  });
  
  afterEach(() => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('model setter', () => {
    it('should set _model to new BaseModel when value is null', () => {
      component.model = null;
      expect(component._model).toEqual(jasmine.any(BaseModel));
    });

    it('should set _model to new BaseModel when value is undefined', () => {
      component.model = undefined;
      expect(component._model).toEqual(jasmine.any(BaseModel));
    });

    it('should set _model and update field properties when model has fields', () => {
      const mockModel = new MockColorModel();
      component._field = 'color';
      component.model = mockModel;
      
      expect(component._model).toBe(mockModel);
      expect(component._title).toBe('Color Field Title');
      expect(component._placeholder).toBe('Color Field Placeholder');
      expect(component._prepend).toBe('Color Prepend');
      expect(component._append).toBe('Color Append');
      expect(component._label).toBe('Color Field Label');
    });

    it('should set _isRequired when model has validation rules', () => {
      const mockModel = new MockColorModel();
      component._field = 'color';
      component.model = mockModel;
      
      expect(component._isRequired).toBe(true);
    });

    it('should not set field properties when model has no fields for the field', () => {
      const mockModel = new BaseModel();
      component._field = 'nonexistentField';
      const originalTitle = component._title;
      const originalPlaceholder = component._placeholder;
      const originalPrepend = component._prepend;
      const originalAppend = component._append;
      const originalLabel = component._label;
      
      component.model = mockModel;
      
      expect(component._model).toBe(mockModel);
      expect(component._title).toBe(originalTitle);
      expect(component._placeholder).toBe(originalPlaceholder);
      expect(component._prepend).toBe(originalPrepend);
      expect(component._append).toBe(originalAppend);
      expect(component._label).toBe(originalLabel);
    });

    it('should not set _isRequired when model has no validation rules for the field', () => {
      const mockModel = new BaseModel();
      mockModel.fields = {
        color: {
          title: 'Color Title',
          label: 'Color Label',
          placeholder: 'Color Placeholder'
        }
      };
      component._field = 'color';
      const originalIsRequired = component._isRequired;
      
      component.model = mockModel;
      
      expect(component._model).toBe(mockModel);
      expect(component._isRequired).toBe(originalIsRequired);
    });

    it('should handle model with fields but no field for current _field', () => {
      const mockModel = new BaseModel();
      mockModel.fields = {
        otherField: {
          title: 'Other Title',
          label: 'Other Label',
          placeholder: 'Other Placeholder'
        }
      };
      component._field = 'color';
      
      component.model = mockModel;
      
      expect(component._model).toBe(mockModel);
    });

    it('should handle model with validation rules but no rule for current _field', () => {
      const mockModel = new BaseModel();
      mockModel.validationRules = {
        otherField: ['required']
      };
      component._field = 'color';
      
      component.model = mockModel;
      
      expect(component._model).toBe(mockModel);
    });
  });

  describe('model getter', () => {
    it('should return the current _model', () => {
      const mockModel = new MockColorModel();
      component._model = mockModel;
      
      expect(component.model).toBe(mockModel);
    });
  });

  describe('field setter', () => {
    it('should set _field to "isValid" when value is "undefined"', () => {
      component._field = '';
      component.field = 'undefined';
      expect(component._field).toBe('isValid');
    });

    it('should set _field to the provided value when not "undefined"', () => {
      component._field = '';
      component.field = 'color';
      expect(component._field).toBe('color');
    });

    it('should handle undefined value', () => {
      component._field = '';
      component.field = undefined;
      expect(component._field).toBe(undefined);
    });
  });

  describe('append setter', () => {
    it('should set _append to empty string when value is "undefined"', () => {
      component._append = 'initial';
      component.append = 'undefined';
      expect(component._append).toBe('');
    });

    it('should set _append to the provided value when not "undefined"', () => {
      component._append = '';
      component.append = 'suffix';
      expect(component._append).toBe('suffix');
    });

    it('should handle undefined value', () => {
      component._append = '';
      component.append = undefined;
      expect(component._append).toBe(undefined);
    });
  });

  describe('prepend setter', () => {
    it('should set _prepend to empty string when value is "undefined"', () => {
      component._prepend = 'initial';
      component.prepend = 'undefined';
      expect(component._prepend).toBe('');
    });

    it('should set _prepend to the provided value when not "undefined"', () => {
      component._prepend = '';
      component.prepend = 'prefix';
      expect(component._prepend).toBe('prefix');
    });

    it('should handle undefined value', () => {
      component._prepend = '';
      component.prepend = undefined;
      expect(component._prepend).toBe(undefined);
    });
  });

  describe('labelText setter', () => {
    it('should set _label to empty string when value is "undefined"', () => {
      component._label = 'initial';
      component.labelText = 'undefined';
      expect(component._label).toBe('');
    });

    it('should set _label to the provided value when not "undefined"', () => {
      component._label = '';
      component.labelText = 'Test Label';
      expect(component._label).toBe('Test Label');
    });

    it('should handle undefined value', () => {
      component._label = '';
      component.labelText = undefined;
      expect(component._label).toBe(undefined);
    });
  });

  describe('Input properties', () => {
    it('should have default values for all input properties', () => {
      expect(component.disabled).toBe(false);
      expect(component.type).toBe('text');
      expect(component.inputClass).toBe('form-control');
      expect(component.labelClass).toBe('col-12 col-md-3 px-0 col-form-label');
      expect(component.inputBlockClass).toBe('col-12 d-flex px-0');
      expect(component.inputBlockExtraClass).toBe('col-md-9');
      expect(component.showLabel).toBe(true);
      expect(component.autoFocus).toBe(false);
      expect(component.wrapperClass).toBe('d-flex flex-wrap');
    });

    it('should allow setting input properties', () => {
      component.disabled = true;
      component.type = 'color';
      component.inputClass = 'custom-input';
      component.labelClass = 'custom-label';
      component.inputBlockClass = 'custom-block';
      component.inputBlockExtraClass = 'custom-extra';
      component.showLabel = false;
      component.autoFocus = true;
      component.wrapperClass = 'custom-wrapper';

      expect(component.disabled).toBe(true);
      expect(component.type).toBe('color');
      expect(component.inputClass).toBe('custom-input');
      expect(component.labelClass).toBe('custom-label');
      expect(component.inputBlockClass).toBe('custom-block');
      expect(component.inputBlockExtraClass).toBe('custom-extra');
      expect(component.showLabel).toBe(false);
      expect(component.autoFocus).toBe(true);
      expect(component.wrapperClass).toBe('custom-wrapper');
    });
  });

  describe('Component initialization', () => {
    it('should initialize all private properties with default values', () => {
      expect(component._field).toBe('');
      expect(component._title).toBe('');
      expect(component._label).toBe('');
      expect(component._placeholder).toBe('');
      expect(component._prepend).toBe('');
      expect(component._append).toBe('');
      expect(component._isRequired).toBe(false);
      expect(component._model).toEqual(jasmine.any(BaseModel));
    });

    it('should inject InputHelperService through constructor', () => {
      expect(component.helperService).toBeDefined();
      expect(component.helperService).toEqual(jasmine.any(InputHelperService));
    });
  });

  describe('Component properties', () => {
    it('should initialize random property with a string from helperService.randChars()', () => {
      expect(component.random).toBeDefined();
      expect(typeof component.random).toBe('string');
      expect(component.random.length).toBe(50);
      // Verify it matches the pattern expected from randChars
      expect(component.random).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should initialize toggle property as false', () => {
      expect(component.toggle).toBe(false);
    });

    it('should have validatorService instance from DdataCoreModule', () => {
      expect(component.validatorService).toBeDefined();
      expect(component.validatorService).toEqual(jasmine.any(ValidatorService));
    });
  });

  describe('ngOnInit', () => {
    it('should focus input element when autoFocus is true', () => {
      component.autoFocus = true;
      spyOn(component.inputBox.nativeElement, 'focus');
      
      component.ngOnInit();
      
      expect(component.inputBox.nativeElement.focus).toHaveBeenCalled();
    });

    it('should not focus input element when autoFocus is false', () => {
      component.autoFocus = false;
      spyOn(component.inputBox.nativeElement, 'focus');
      
      component.ngOnInit();
      
      expect(component.inputBox.nativeElement.focus).not.toHaveBeenCalled();
    });
  });

  describe('validateField', () => {
    it('should emit changed event when validation passes', () => {
      const mockModel = new MockColorModel();
      component._model = mockModel;
      component._field = 'color';
      
      spyOn(component.helperService, 'validateField').and.returnValue(true);
      spyOn(component.changed, 'emit');
      
      component.validateField();
      
      expect(component.helperService.validateField).toHaveBeenCalledWith(mockModel, 'color');
      expect(component.changed.emit).toHaveBeenCalledWith(mockModel);
    });

    it('should not emit changed event when validation fails', () => {
      const mockModel = new MockColorModel();
      component._model = mockModel;
      component._field = 'color';
      
      spyOn(component.helperService, 'validateField').and.returnValue(false);
      spyOn(component.changed, 'emit');
      
      component.validateField();
      
      expect(component.helperService.validateField).toHaveBeenCalledWith(mockModel, 'color');
      expect(component.changed.emit).not.toHaveBeenCalled();
    });
  });

  describe('changed EventEmitter', () => {
    it('should be defined and be an EventEmitter', () => {
      expect(component.changed).toBeDefined();
      expect(component.changed.emit).toBeDefined();
    });
  });

  describe('ViewChild inputBox', () => {
    it('should be defined', () => {
      expect(component.inputBox).toBeDefined();
      expect(component.inputBox.nativeElement).toBeDefined();
    });
  });

  // Additional edge case tests
  describe('Edge cases', () => {
    it('should handle model with empty fields object', () => {
      const mockModel = new BaseModel();
      mockModel.fields = {};
      component._field = 'testField';
      
      component.model = mockModel;
      
      expect(component._model).toBe(mockModel);
    });

    it('should handle model with empty validationRules object', () => {
      const mockModel = new BaseModel();
      mockModel.validationRules = {};
      component._field = 'testField';
      
      component.model = mockModel;
      
      expect(component._model).toBe(mockModel);
    });

    it('should handle toggle property changes', () => {
      expect(component.toggle).toBe(false);
      component.toggle = true;
      expect(component.toggle).toBe(true);
    });

    it('should handle model where fields[_field] exists but is falsy', () => {
      const mockModel = new BaseModel();
      mockModel.fields = {
        color: null as any
      };
      component._field = 'color';
      
      component.model = mockModel;
      
      expect(component._model).toBe(mockModel);
    });

    it('should handle model where validationRules[_field] exists but is falsy', () => {
      const mockModel = new BaseModel();
      mockModel.validationRules = {
        color: null as any
      };
      component._field = 'color';
      
      component.model = mockModel;
      
      expect(component._model).toBe(mockModel);
    });

    it('should handle setting field to empty string', () => {
      component._field = 'initial';
      component.field = '';
      expect(component._field).toBe('');
    });

    it('should handle setting append to empty string', () => {
      component._append = 'initial';
      component.append = '';
      expect(component._append).toBe('');
    });

    it('should handle setting prepend to empty string', () => {
      component._prepend = 'initial';
      component.prepend = '';
      expect(component._prepend).toBe('');
    });

    it('should handle setting labelText to empty string', () => {
      component._label = 'initial';
      component.labelText = '';
      expect(component._label).toBe('');
    });
  });

  // Test the random string generation indirectly through the random property
  it('should generate random string of length 50', () => {
    expect(component.random).toBeDefined();
    expect(typeof component.random).toBe('string');
    expect(component.random.length).toBe(50);
    expect(component.random).toMatch(/^[A-Za-z0-9]+$/);
  });

});
