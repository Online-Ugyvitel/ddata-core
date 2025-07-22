import 'zone.js/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { DdataInputCheckboxComponent } from './checkbox.component';
import { DdataCoreModule, BaseModel } from 'ddata-core';

describe('DdataInputCheckboxComponent', () => {
  let component: DdataInputCheckboxComponent;
  let fixture: ComponentFixture<DdataInputCheckboxComponent>;

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
      declarations: [DdataInputCheckboxComponent],
      imports: [FontAwesomeModule],
      providers: [
        Injector,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    try {
      DdataCoreModule.InjectorInstance = TestBed.inject(Injector);
    } catch (e) {
      // Fallback for compatibility
      DdataCoreModule.InjectorInstance = TestBed as any;
    }
    fixture = TestBed.createComponent(DdataInputCheckboxComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.disabled).toBe(false);
    expect(component.showLabel).toBe(true);
    expect(component.showLabelAfter).toBe(true);
    expect(component.labelClass).toBe('col pl-2 col-form-label');
    expect(component.wrapperClass).toBe('d-flex');
    expect(component.iconOn).toBe(faCheckSquare);
    expect(component.iconOff).toBe(faSquare);
    expect(component._field).toBe('isValid');
    expect(component._label).toBe('');
    expect(component._model).toBeInstanceOf(BaseModel);
  });

  describe('ngOnInit', () => {
    it('should set iterable to a random number between 0 and 100', () => {
      component.ngOnInit();
      expect(component.iterable).toBeGreaterThanOrEqual(0);
      expect(component.iterable).toBeLessThanOrEqual(100);
    });
  });

  describe('model property', () => {
    it('should set model to be instance of BaseModel when null', () => {
      component.model = null;
      expect(component._model).toBeInstanceOf(BaseModel);
    });

    it('should accept and set a valid model', () => {
      const testModel = new BaseModel();
      testModel.isValid = true;
      component.model = testModel;
      expect(component._model).toBe(testModel);
    });

    it('should set label from model fields when model has fields', () => {
      const testModel = new BaseModel();
      testModel.fields = {
        isValid: {
          label: 'Test Label',
          title: 'Test Title'
        }
      };
      component.model = testModel;
      expect(component._label).toBe('Test Label');
    });

    it('should set label to empty string when model fields do not have label', () => {
      const testModel = new BaseModel();
      testModel.fields = {
        isValid: {
          title: 'Test Title'
        }
      };
      component.model = testModel;
      expect(component._label).toBe('');
    });

    it('should handle model without fields property', () => {
      const testModel = new BaseModel();
      component.model = testModel;
      expect(component._model).toBe(testModel);
      expect(component._label).toBe('');
    });

    it('should handle model with fields but without the current field', () => {
      const testModel = new BaseModel();
      testModel.fields = {
        otherField: {
          label: 'Other Label',
          title: 'Other Title'
        }
      };
      component.model = testModel;
      expect(component._model).toBe(testModel);
      expect(component._label).toBe('');
    });

    it('should return the current model', () => {
      const testModel = new BaseModel();
      component._model = testModel;
      expect(component.model).toBe(testModel);
    });
  });

  describe('field property', () => {
    it('should set field to "isValid" when value is "undefined"', () => {
      component.field = 'undefined';
      expect(component._field).toBe('isValid');
    });

    it('should set field to the provided value when it is not "undefined"', () => {
      component.field = 'customField';
      expect(component._field).toBe('customField');
    });

    it('should return the current field', () => {
      component._field = 'testField';
      expect(component.field).toBe('testField');
    });

    it('should update label when field changes and model has fields', () => {
      const testModel = new BaseModel();
      testModel.fields = {
        customField: {
          label: 'Custom Label',
          title: 'Custom Title'
        }
      };
      component.model = testModel;
      component.field = 'customField';
      expect(component._label).toBe('Custom Label');
    });
  });

  describe('clicked method', () => {
    it('should toggle model field value when not disabled', () => {
      component.disabled = false;
      component.model.isValid = false;
      component.clicked();
      expect(component.model.isValid).toBe(true);
    });

    it('should not change model field value when disabled', () => {
      component.disabled = true;
      component.model.isValid = false;
      component.clicked();
      expect(component.model.isValid).toBe(false);
    });

    it('should emit changed event when not disabled', () => {
      spyOn(component.changed, 'emit');
      component.disabled = false;
      component.model.isValid = false;
      component.clicked();
      expect(component.changed.emit).toHaveBeenCalledWith(true);
    });

    it('should not emit changed event when disabled', () => {
      spyOn(component.changed, 'emit');
      component.disabled = true;
      component.model.isValid = false;
      component.clicked();
      expect(component.changed.emit).not.toHaveBeenCalled();
    });

    it('should work with custom field names', () => {
      component.field = 'customField';
      component.disabled = false;
      (component.model as any)['customField'] = false;
      component.clicked();
      expect((component.model as any)['customField']).toBe(true);
    });
  });

  describe('getIcon method', () => {
    it('should return iconOff when model field is false', () => {
      component.model.isValid = false;
      expect(component.getIcon()).toBe(component.iconOff);
    });

    it('should return iconOn when model field is true', () => {
      component.model.isValid = true;
      expect(component.getIcon()).toBe(component.iconOn);
    });

    it('should return iconOff when model field is null or undefined', () => {
      (component.model as any).isValid = null;
      expect(component.getIcon()).toBe(component.iconOff);
      
      (component.model as any).isValid = undefined;
      expect(component.getIcon()).toBe(component.iconOff);
    });

    it('should work with custom field names', () => {
      component.field = 'customField';
      (component.model as any)['customField'] = true;
      expect(component.getIcon()).toBe(component.iconOn);
      
      (component.model as any)['customField'] = false;
      expect(component.getIcon()).toBe(component.iconOff);
    });

    it('should work with custom icons', () => {
      const customIconOn = faCheckSquare;
      const customIconOff = faSquare;
      component.iconOn = customIconOn;
      component.iconOff = customIconOff;
      
      component.model.isValid = true;
      expect(component.getIcon()).toBe(customIconOn);
      
      component.model.isValid = false;
      expect(component.getIcon()).toBe(customIconOff);
    });
  });

  describe('input properties', () => {
    it('should accept disabled input', () => {
      component.disabled = true;
      expect(component.disabled).toBe(true);
    });

    it('should accept showLabel input', () => {
      component.showLabel = false;
      expect(component.showLabel).toBe(false);
    });

    it('should accept showLabelAfter input', () => {
      component.showLabelAfter = false;
      expect(component.showLabelAfter).toBe(false);
    });

    it('should accept labelClass input', () => {
      component.labelClass = 'custom-class';
      expect(component.labelClass).toBe('custom-class');
    });

    it('should accept wrapperClass input', () => {
      component.wrapperClass = 'custom-wrapper';
      expect(component.wrapperClass).toBe('custom-wrapper');
    });

    it('should accept iconOn input', () => {
      const customIcon = faCheckSquare;
      component.iconOn = customIcon;
      expect(component.iconOn).toBe(customIcon);
    });

    it('should accept iconOff input', () => {
      const customIcon = faSquare;
      component.iconOff = customIcon;
      expect(component.iconOff).toBe(customIcon);
    });
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      const newComponent = new DdataInputCheckboxComponent();
      expect(newComponent._model).toBeInstanceOf(BaseModel);
      expect(newComponent._field).toBe('isValid');
      expect(newComponent._label).toBe('');
      expect(newComponent.disabled).toBe(false);
      expect(newComponent.showLabel).toBe(true);
      expect(newComponent.showLabelAfter).toBe(true);
      expect(newComponent.iterable).toBe(0);
    });
  });
});
