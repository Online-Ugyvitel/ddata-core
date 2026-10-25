// @ts-nocheck -- generated spec uses loosely typed mock models, events and private members
import { Injector, ChangeDetectorRef, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { DdataCoreModule, BaseModel } from '@netdjw/ddata-core';
import { DdataInputTimeComponent } from './time-input.component';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

describe('DdataInputTimeComponent', () => {
  let component: DdataInputTimeComponent;
  let fixture: ComponentFixture<DdataInputTimeComponent>;
  let debugElement: any;
  let element: any;
  let helperServiceSpy: any;

  beforeEach(() => {
    const spy = {
      validateField: vi.fn().mockName('InputHelperService.validateField'),
      getTitle: vi.fn().mockName('InputHelperService.getTitle'),
      getLabel: vi.fn().mockName('InputHelperService.getLabel'),
      getPlaceholder: vi.fn().mockName('InputHelperService.getPlaceholder'),
      getPrepend: vi.fn().mockName('InputHelperService.getPrepend'),
      getAppend: vi.fn().mockName('InputHelperService.getAppend'),
      isRequired: vi.fn().mockName('InputHelperService.isRequired'),
      randChars: vi.fn().mockName('InputHelperService.randChars')
    };

    TestBed.configureTestingModule({
      declarations: [DdataInputTimeComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: InputHelperService, useValue: spy }]
    }).compileComponents();

    helperServiceSpy = TestBed.inject(InputHelperService) as any;
  });

  beforeEach(() => {
    DdataCoreModule.InjectorInstance = {
      get: (token: never) => TestBed.inject(token)
    };
    helperServiceSpy.randChars.mockReturnValue('random123');
    fixture = TestBed.createComponent(DdataInputTimeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;

    // Setup default spy returns
    helperServiceSpy.getTitle.mockReturnValue('Test Title');
    helperServiceSpy.getLabel.mockReturnValue('Test Label');
    helperServiceSpy.getPlaceholder.mockReturnValue('Test Placeholder');
    helperServiceSpy.getPrepend.mockReturnValue('Prepend');
    helperServiceSpy.getAppend.mockReturnValue('Append');
    helperServiceSpy.isRequired.mockReturnValue(true);
    helperServiceSpy.validateField.mockReturnValue(true);
  });

  afterEach(() => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  describe('Component Creation', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component._field).toBe('');
      expect(component._title).toBe('');
      expect(component._label).toBe('');
      expect(component._placeholder).toBe('');
      expect(component._prepend).toBe('');
      expect(component._append).toBe('');
      expect(component._max).toBe('');
      expect(component._isRequired).toBe(false);
      expect(component.disabled).toBe(false);
      expect(component.isViewOnly).toBe(false);
      expect(component.type).toBe('text');
      expect(component.format).toBe(24);
      expect(component.autoFocus).toBe(false);
      expect(component.showLabel).toBe(true);
    });

    it('should initialize random string from helper service', () => {
      expect(component.random).toBe('random123');
      expect(helperServiceSpy.randChars).toHaveBeenCalled();
    });
  });

  describe('Input Property Setters', () => {
    describe('model setter', () => {
      it('should handle null/undefined model', () => {
        vi.spyOn(console, 'error').mockReturnValue(undefined);
        component.model = null;

        expect(console.error).toHaveBeenCalledWith('The input-box component get undefined model');
      });

      it('should handle model without fields', () => {
        vi.spyOn(console, 'error').mockReturnValue(undefined);
        const invalidModel = new BaseModel();

        invalidModel.fields = null;
        component.model = invalidModel;

        expect(console.error).toHaveBeenCalledWith(
          `Your ${invalidModel.model_name}'s 'fields' field is`,
          null
        );
      });

      it('should handle model without specific field', () => {
        vi.spyOn(console, 'error').mockReturnValue(undefined);
        const model = new BaseModel();

        component._field = 'nonexistent';
        component.model = model;

        expect(console.error).toHaveBeenCalledWith(
          `The ${model.model_name}'s nonexistent field is `,
          undefined
        );
      });

      it('should set model properties when valid model and field exist', () => {
        const model = new BaseModel();

        model.fields = { testField: { title: 'Test', label: 'Label' } };
        model.validationRules = { testField: ['required'] };
        component._field = 'testField';

        component.model = model;

        expect(component._model).toBe(model);
        expect(helperServiceSpy.getTitle).toHaveBeenCalledWith(model, 'testField');
        expect(helperServiceSpy.getPlaceholder).toHaveBeenCalledWith(model, 'testField');
        expect(helperServiceSpy.getPrepend).toHaveBeenCalledWith(model, 'testField');
        expect(helperServiceSpy.getAppend).toHaveBeenCalledWith(model, 'testField');
        expect(helperServiceSpy.getLabel).toHaveBeenCalledWith(model, 'testField');
        expect(helperServiceSpy.isRequired).toHaveBeenCalledWith(model, 'testField');
      });

      it('should get model correctly', () => {
        const model = new BaseModel();

        component._model = model;

        expect(component.model).toBe(model);
      });
    });

    describe('field setter', () => {
      it('should set field value', () => {
        component.field = 'testField';

        expect(component._field).toBe('testField');
      });

      it('should handle undefined field by setting to isValid', () => {
        component.field = 'undefined';

        expect(component._field).toBe('isValid');
      });
    });

    describe('append setter', () => {
      it('should set append value', () => {
        component.append = 'appendText';

        expect(component._append).toBe('appendText');
      });

      it('should handle undefined append by setting to empty string', () => {
        component.append = 'undefined';

        expect(component._append).toBe('');
      });
    });

    describe('prepend setter', () => {
      it('should set prepend value', () => {
        component.prepend = 'prependText';

        expect(component._prepend).toBe('prependText');
      });

      it('should handle undefined prepend by setting to empty string', () => {
        component.prepend = 'undefined';

        expect(component._prepend).toBe('');
      });
    });

    describe('labelText setter', () => {
      it('should set label value', () => {
        component.labelText = 'labelText';

        expect(component._label).toBe('labelText');
      });

      it('should handle undefined labelText by setting to empty string', () => {
        component.labelText = 'undefined';

        expect(component._label).toBe('');
      });
    });
  });

  describe('Lifecycle Methods', () => {
    describe('ngAfterViewInit', () => {
      it('should focus input when autoFocus is true', () => {
        component.autoFocus = true;
        const mockElement = { focus: vi.fn().mockName('focus') };

        component.inputBox = { nativeElement: mockElement } as ElementRef;

        component.ngAfterViewInit();

        expect(mockElement.focus).toHaveBeenCalled();
      });

      it('should not focus input when autoFocus is false', () => {
        component.autoFocus = false;
        const mockElement = { focus: vi.fn().mockName('focus') };

        component.inputBox = { nativeElement: mockElement } as ElementRef;

        component.ngAfterViewInit();

        expect(mockElement.focus).not.toHaveBeenCalled();
      });

      it('should handle missing inputBox reference', () => {
        component.autoFocus = true;
        component.inputBox = undefined;

        expect(() => component.ngAfterViewInit()).not.toThrow();
      });
    });
  });

  describe('validateField Method', () => {
    it('should call helper service validateField and emit changed event when valid', () => {
      vi.spyOn(component.changed, 'emit').mockReturnValue(undefined);
      helperServiceSpy.validateField.mockReturnValue(true);
      const model = new BaseModel();

      component._model = model;
      component._field = 'testField';

      component.validateField();

      expect(helperServiceSpy.validateField).toHaveBeenCalledWith(model, 'testField');
      expect(component.changed.emit).toHaveBeenCalledWith(model);
    });

    it('should call helper service validateField but not emit when invalid', () => {
      vi.spyOn(component.changed, 'emit').mockReturnValue(undefined);
      helperServiceSpy.validateField.mockReturnValue(false);
      const model = new BaseModel();

      component._model = model;
      component._field = 'testField';

      component.validateField();

      expect(helperServiceSpy.validateField).toHaveBeenCalledWith(model, 'testField');
      expect(component.changed.emit).not.toHaveBeenCalled();
    });
  });

  describe('setTime Method', () => {
    it('should set time value on model field and validate', () => {
      vi.spyOn(component, 'validateField').mockReturnValue(undefined);
      const model = new BaseModel();

      component._model = model;
      component._field = 'timeField';

      component.setTime('12:30');

      expect(model['timeField']).toBe('12:30');
      expect(component.validateField).toHaveBeenCalled();
    });

    it('should handle empty time string', () => {
      vi.spyOn(component, 'validateField').mockReturnValue(undefined);
      const model = new BaseModel();

      component._model = model;
      component._field = 'timeField';

      component.setTime('');

      expect(model['timeField']).toBe('');
      expect(component.validateField).toHaveBeenCalled();
    });

    it('should handle null time', () => {
      vi.spyOn(component, 'validateField').mockReturnValue(undefined);
      const model = new BaseModel();

      component._model = model;
      component._field = 'timeField';

      component.setTime(null);

      expect(model['timeField']).toBe('');
      expect(component.validateField).toHaveBeenCalled();
    });
  });

  describe('Component Properties', () => {
    it('should handle all input properties correctly', () => {
      component.disabled = true;
      component.isViewOnly = true;
      component.type = 'time';
      component.inputClass = 'custom-input';
      component.labelClass = 'custom-label';
      component.inputBlockClass = 'custom-block';
      component.inputBlockExtraClass = 'custom-extra';
      component.viewOnlyClass = 'custom-view';
      component.showLabel = false;
      component.autoFocus = true;
      component.wrapperClass = 'custom-wrapper';
      component.format = 12;

      expect(component.disabled).toBe(true);
      expect(component.isViewOnly).toBe(true);
      expect(component.type).toBe('time');
      expect(component.inputClass).toBe('custom-input');
      expect(component.labelClass).toBe('custom-label');
      expect(component.inputBlockClass).toBe('custom-block');
      expect(component.inputBlockExtraClass).toBe('custom-extra');
      expect(component.viewOnlyClass).toBe('custom-view');
      expect(component.showLabel).toBe(false);
      expect(component.autoFocus).toBe(true);
      expect(component.wrapperClass).toBe('custom-wrapper');
      expect(component.format).toBe(12);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow with valid model', () => {
      const model = new BaseModel();

      model.fields = {
        testTime: {
          title: 'Time Field',
          label: 'Select Time',
          placeholder: 'HH:MM',
          prepend: 'Time:',
          append: 'hrs'
        }
      };
      model.validationRules = { testTime: ['required'] };
      component.field = 'testTime';

      vi.spyOn(component.changed, 'emit').mockReturnValue(undefined);
      helperServiceSpy.validateField.mockReturnValue(true);

      component.model = model;
      component.setTime('14:30');

      expect(component._title).toBe('Test Title');
      expect(component._label).toBe('Test Label');
      expect(component._placeholder).toBe('Test Placeholder');
      expect(component._prepend).toBe('Prepend');
      expect(component._append).toBe('Append');
      expect(component._isRequired).toBe(true);
      expect(model.testTime).toBe('14:30');
      expect(component.changed.emit).toHaveBeenCalledWith(model);
    });

    it('should handle edge cases with model setter', () => {
      vi.spyOn(console, 'error').mockReturnValue(undefined);

      // Test null model
      component.model = null;

      expect(console.error).toHaveBeenCalledWith('The input-box component get undefined model');
      // Test model without fields
      const modelWithoutFields = new BaseModel();

      modelWithoutFields.fields = null;
      component.model = modelWithoutFields;

      expect(console.error).toHaveBeenCalledWith(
        `Your ${modelWithoutFields.model_name}'s 'fields' field is`,
        null
      );
      // Test model without specific field
      const modelWithFields = new BaseModel();

      modelWithFields.fields = {};
      component._field = 'missingField';
      component.model = modelWithFields;

      expect(console.error).toHaveBeenCalledWith(
        `The ${modelWithFields.model_name}'s missingField field is `,
        undefined
      );
    });

    it('should handle model with fields but no validation rules for field', () => {
      const model = new BaseModel();

      model.fields = { testField: { title: 'Test' } };
      model.validationRules = {}; // No validation rules for testField
      component._field = 'testField';

      component.model = model;

      // Should call helper methods for field properties but not for validation
      expect(helperServiceSpy.getTitle).toHaveBeenCalledWith(model, 'testField');
      expect(helperServiceSpy.isRequired).not.toHaveBeenCalled();
    });

    it('should handle model with validation rules but no field definitions', () => {
      vi.spyOn(console, 'error').mockReturnValue(undefined);
      const model = new BaseModel();

      model.fields = {}; // No fields defined
      model.validationRules = { testField: ['required'] };
      component._field = 'testField';

      component.model = model;

      expect(console.error).toHaveBeenCalledWith(
        `The ${model.model_name}'s testField field is `,
        undefined
      );
    });

    it('should not call helper methods when model field does not exist', () => {
      vi.spyOn(console, 'error').mockReturnValue(undefined);
      const model = new BaseModel();

      model.fields = {};
      component._field = 'nonExistentField';

      component.model = model;

      // Should not call helper methods when field doesn't exist
      expect(helperServiceSpy.getTitle).not.toHaveBeenCalled();
      expect(helperServiceSpy.getLabel).not.toHaveBeenCalled();
      expect(helperServiceSpy.getPlaceholder).not.toHaveBeenCalled();
      expect(helperServiceSpy.getPrepend).not.toHaveBeenCalled();
      expect(helperServiceSpy.getAppend).not.toHaveBeenCalled();
    });

    it('should handle undefined passed to various setters correctly', () => {
      // Test all undefined cases
      component.field = 'undefined';

      expect(component._field).toBe('isValid');

      component.append = 'undefined';

      expect(component._append).toBe('');

      component.prepend = 'undefined';

      expect(component._prepend).toBe('');

      component.labelText = 'undefined';

      expect(component._label).toBe('');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle setTime with various data types', () => {
      vi.spyOn(component, 'validateField').mockReturnValue(undefined);
      const model = new BaseModel();

      component._model = model;
      component._field = 'timeField';

      // Test with undefined
      component.setTime(undefined);

      expect(model['timeField']).toBe('');
      expect(component.validateField).toHaveBeenCalled();
    });

    it('should handle ngAfterViewInit when inputBox is null', () => {
      component.autoFocus = true;
      component.inputBox = null as any;

      expect(() => component.ngAfterViewInit()).not.toThrow();
    });

    it('should handle model setter when model has null validationRules', () => {
      const model = new BaseModel();

      model.fields = { testField: { title: 'Test' } };
      model.validationRules = null;
      component._field = 'testField';

      expect(() => (component.model = model)).not.toThrow();
      expect(helperServiceSpy.isRequired).not.toHaveBeenCalled();
    });

    it('should handle all class properties correctly', () => {
      // Test that all properties can be set and retrieved
      expect(component.inputClass).toBe('form-control');
      expect(component.labelClass).toBe('col-12 col-md-3 px-0 col-form-label');
      expect(component.inputBlockClass).toBe('col-12 d-flex px-0');
      expect(component.inputBlockExtraClass).toBe('col-md-9');
      expect(component.viewOnlyClass).toBe('form-control border-0 bg-body-tertiary');
      expect(component.wrapperClass).toBe('d-flex flex-wrap');

      // Test that changed event emitter is initialized
      expect(component.changed).toBeDefined();
      expect(component.changed.emit).toBeDefined();
    });

    it('should handle helper service injection correctly', () => {
      expect(component.helperService).toBeDefined();
      expect(component.random).toBe('random123');
    });
  });
  describe('time parsing', () => {
    const modelWith = (value: unknown): BaseModel => {
      const model = new BaseModel();

      model.fields = { start: { title: 'Start', label: 'Start' } };
      model['start'] = value;

      return model;
    };
    const parsed = (value: unknown): Date | null => {
      component.field = 'start';
      component.model = modelWith(value);

      return component.timeValue;
    };

    it.each(['00:00', '9:05', '23:59', '12:30'])('should parse the valid time %s', (value) => {
      const [hours, minutes] = value.split(':').map(Number);
      const result = parsed(value);

      expect(result).toBeInstanceOf(Date);
      expect(result.getHours()).toBe(hours);
      expect(result.getMinutes()).toBe(minutes);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it.each(['24:00', '12:60', '99:99', '12:5', '123:00', '12-30', 'noon', '', ' 12:30'])(
      'should reject the invalid time %j',
      (value) => {
        expect(parsed(value)).toBeNull();
      }
    );

    it.each([null, undefined, 1230, new Date(2024, 1, 29, 10, 0)])(
      'should reject the non string value %j',
      (value) => {
        expect(parsed(value)).toBeNull();
      }
    );

    it('should parse the value again when the field changes', () => {
      const model = modelWith('08:15');

      model.fields['end'] = { title: 'End', label: 'End' };
      model['end'] = '17:45';
      component.field = 'start';
      component.model = model;

      expect(component.timeValue.getHours()).toBe(8);

      component.field = 'end';

      expect(component.timeValue.getHours()).toBe(17);
      expect(component.timeValue.getMinutes()).toBe(45);
    });

    it('should store a picked Date as zero padded local HH:mm', () => {
      const model = modelWith('');
      const picked = new Date(2024, 1, 29, 7, 5);

      component.field = 'start';
      component.model = model;
      component.setTime(picked);

      expect(model['start']).toBe('07:05');
      expect(component.timeValue).toBe(picked);
      expect(helperServiceSpy.validateField).toHaveBeenCalledWith(model, 'start');
    });

    it('should store midnight and the last minute of the day', () => {
      const model = modelWith('');

      component.field = 'start';
      component.model = model;
      component.setTime(new Date(2023, 11, 31, 23, 59));

      expect(model['start']).toBe('23:59');

      component.setTime(new Date(2024, 0, 1, 0, 0));

      expect(model['start']).toBe('00:00');
    });

    it('should keep a typed string and parse it', () => {
      const model = modelWith('');

      component.field = 'start';
      component.model = model;
      component.setTime('25:00');

      expect(model['start']).toBe('25:00');
      expect(component.timeValue).toBeNull();
    });
  });

  describe('rendering', () => {
    const createModel = (): BaseModel => {
      const model = new BaseModel();

      model.fields = { start: { title: 'Start', label: 'Start' } };
      model.validationRules = { start: ['required'] };
      model['start'] = '10:00';

      return model;
    };
    const render = (inputs: Record<string, unknown>): void => {
      Object.entries(inputs).forEach(([key, value]) => fixture.componentRef.setInput(key, value));
      fixture.detectChanges();
    };

    it('should render label, required mark, prepend and append and follow their changes', () => {
      render({ field: 'start', model: createModel() });

      expect(element.querySelector('label').textContent).toContain('Test Label:');
      expect(element.querySelector('label span').textContent).toBe(' *');
      expect(element.querySelector('.input-group-prepend').textContent.trim()).toBe('Prepend');
      expect(element.querySelector('.input-group-append').textContent.trim()).toBe('Append');

      render({ labelText: 'Kezdés', prepend: 'P2', append: 'A2' });

      expect(element.querySelector('label').textContent).toContain('Kezdés:');
      expect(element.querySelector('.input-group-prepend').textContent.trim()).toBe('P2');
      expect(element.querySelector('.input-group-append').textContent.trim()).toBe('A2');
    });

    it('should hide the optional parts', () => {
      helperServiceSpy.isRequired.mockReturnValue(false);
      helperServiceSpy.getPrepend.mockReturnValue('');
      helperServiceSpy.getAppend.mockReturnValue('');
      render({ field: 'start', model: createModel(), showLabel: false });

      expect(element.querySelector('label')).toBeNull();
      expect(element.querySelector('.input-group-prepend')).toBeNull();
      expect(element.querySelector('.input-group-append')).toBeNull();
    });

    it('should disable the input', () => {
      render({ field: 'start', model: createModel(), disabled: true });

      expect(element.querySelector('input').disabled).toBe(true);
    });

    it('should show the value as text in view only mode', () => {
      const model = createModel();

      render({ field: 'start', model, isViewOnly: true });

      expect(element.querySelector('input')).toBeNull();
      expect(element.querySelector('.bg-body-tertiary').textContent.trim()).toBe('10:00');

      model['start'] = '11:00';
      render({ model: Object.assign(new BaseModel(), model) });

      expect(element.querySelector('.bg-body-tertiary').textContent.trim()).toBe('11:00');
    });

    it('should toggle the invalid class as the validation error appears and disappears', () => {
      const model = createModel();

      helperServiceSpy.validateField.mockImplementation((m: BaseModel, field: string) => {
        const valid = m[field] !== '';

        m.validationErrors = valid ? [] : [field];

        return valid;
      });
      render({ field: 'start', model });
      const input = (): HTMLInputElement => element.querySelector('input');

      model['start'] = '';
      input().dispatchEvent(new KeyboardEvent('keyup'));
      fixture.detectChanges();

      expect(input().classList).toContain('invalid');

      model['start'] = '12:00';
      input().dispatchEvent(new KeyboardEvent('keyup'));
      fixture.detectChanges();

      expect(input().classList).not.toContain('invalid');
    });

    it('should focus the input on init when autoFocus is set', () => {
      render({ field: 'start', model: createModel(), autoFocus: true });

      expect(document.activeElement).toBe(element.querySelector('input'));
    });
  });
});
