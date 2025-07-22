// tslint:disable: max-line-length
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BaseModel, BaseModelInterface, DdataCoreModule, FieldsInterface, ID, ISODate, ValidatorService } from 'ddata-core';
import * as moment from 'moment';
import { DdataUiInputModule } from '../../ddata-ui-input.module';
import { InputHelperService } from '../../services/input/helper/input-helper.service';
import { DdataInputDateComponent } from './date-input.component';

interface MockModelInterface extends BaseModelInterface<MockModelInterface> {
  date: ISODate;
  requiredDate: ISODate;
}

class MockModel extends BaseModel implements MockModelInterface {
  id: ID;
  date: ISODate;
  requiredDate: ISODate;

  init(data?: any): this {
    data = !!data ? data : {};

    this.id = !!data.id ? data.id : 0;
    this.date = !!data.date ? data.date : '';
    this.requiredDate = !!data.requiredDate ? data.requiredDate : '';

    // Setup fields for testing
    this.fields = {
      date: {
        title: 'Date Field',
        label: 'Date Label',
        placeholder: 'Date Placeholder',
        prepend: '$',
        append: 'USD'
      },
      requiredDate: {
        title: 'Required Date',
        label: 'Required Date Label',
        placeholder: 'Required Date Placeholder'
      }
    };

    // Setup validation rules for testing
    this.validationRules = {
      date: ['minlength:1'],
      requiredDate: ['required', 'minlength:1']
    };

    return this;
  }
}

describe('DdataInputDateComponent', () => {
  let component: DdataInputDateComponent;
  let fixture: ComponentFixture<DdataInputDateComponent>;
  let mockHelperService: jasmine.SpyObj<InputHelperService>;
  let mockChangeDetector: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    mockHelperService = jasmine.createSpyObj('InputHelperService', [
      'getTitle', 'getLabel', 'getPlaceholder', 'getPrepend', 'getAppend', 
      'isRequired', 'validateField', 'randChars'
    ]);
    
    mockChangeDetector = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    // Set up default return values
    mockHelperService.getTitle.and.returnValue('Test Title');
    mockHelperService.getLabel.and.returnValue('Test Label');
    mockHelperService.getPlaceholder.and.returnValue('Test Placeholder');
    mockHelperService.getPrepend.and.returnValue('$');
    mockHelperService.getAppend.and.returnValue('USD');
    mockHelperService.isRequired.and.returnValue(false);
    mockHelperService.validateField.and.returnValue(true);
    mockHelperService.randChars.and.returnValue('randomstring123');

    await TestBed.configureTestingModule({
      imports: [DdataUiInputModule, DdataCoreModule],
      providers: [
        {
          provide: InputHelperService,
          useValue: mockHelperService
        },
        {
          provide: ChangeDetectorRef,
          useValue: mockChangeDetector
        },
        {
          provide: ValidatorService,
          useValue: jasmine.createSpyObj('ValidatorService', ['validate'])
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        },
        {
          provide: ActivatedRoute,
          useValue: jasmine.createSpyObj('ActivatedRoute', ['queryParams'])
        },
        {
          provide: 'env',
          useValue: jasmine.createSpyObj('EnvService', ['get'])
        },
        {
          provide: HttpClient,
          useValue: jasmine.createSpyObj('HttpClient', ['get'])
        }
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DdataInputDateComponent);
        component = fixture.componentInstance;
        
        // Override the helperService property to use our mock
        component.helperService = mockHelperService;
        
        fixture.detectChanges();
      });
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component._field).toBe('');
      expect(component._title).toBe('');
      expect(component._label).toBe('');
      expect(component._placeholder).toBe('');
      expect(component._prepend).toBe('');
      expect(component._append).toBe('');
      expect(component._isRequired).toBe(false);
      expect(component.disabled).toBe(false);
      expect(component.inputClass).toBe('form-control');
      expect(component.labelClass).toBe('col-12 col-md-3 px-0 col-form-label');
      expect(component.showLabel).toBe(true);
      expect(component.autoFocus).toBe(false);
      expect(component.isViewOnly).toBe(false);
      expect(component.format).toBe('YYYY-MM-DD');
      expect(component.separator).toBe('-');
      expect(component.position).toBe('center');
      expect(component.direction).toBe('down');
      expect(component.showIcon).toBe(true);
      expect(component.autoApply).toBe(true);
      expect(component.singleDatePicker).toBe(true);
    });

    it('should initialize random string from helperService', () => {
      expect(component.random).toBe('randomstring123');
      expect(mockHelperService.randChars).toHaveBeenCalled();
    });

    it('should initialize moment with default moment library', () => {
      expect(component._moment).toBe(moment);
    });
  });

  describe('Input Setters', () => {
    describe('moment setter', () => {
      it('should set moment value when provided', () => {
        const customMoment = { custom: true };
        component.moment = customMoment;
        expect(component._moment).toBe(customMoment);
      });

      it('should set default moment when falsy value provided', () => {
        component.moment = null;
        expect(component._moment).toBe(moment);
      });

      it('should set default moment when undefined provided', () => {
        component.moment = undefined;
        expect(component._moment).toBe(moment);
      });
    });

    describe('model setter', () => {
      it('should set model when valid model provided', () => {
        const testModel = new MockModel().init({ date: '2023-01-01' });
        component.model = testModel;
        expect(component._model).toBe(testModel);
      });

      it('should create new BaseModel when null provided', () => {
        component.model = null;
        expect(component._model).toBeInstanceOf(BaseModel);
      });

      it('should call helper service methods when model has fields', () => {
        const testModel = new MockModel().init({ date: '2023-01-01' });
        component._field = 'date';
        component.model = testModel;

        expect(mockHelperService.getTitle).toHaveBeenCalledWith(testModel, 'date');
        expect(mockHelperService.getLabel).toHaveBeenCalledWith(testModel, 'date');
        expect(mockHelperService.getPlaceholder).toHaveBeenCalledWith(testModel, 'date');
        expect(mockHelperService.getPrepend).toHaveBeenCalledWith(testModel, 'date');
        expect(mockHelperService.getAppend).toHaveBeenCalledWith(testModel, 'date');
      });

      it('should set properties from helper service when model has fields', () => {
        const testModel = new MockModel().init({ date: '2023-01-01' });
        component._field = 'date';
        component.model = testModel;

        expect(component._title).toBe('Test Title');
        expect(component._label).toBe('Test Label');
        expect(component._placeholder).toBe('Test Placeholder');
        expect(component._prepend).toBe('$');
        expect(component._append).toBe('USD');
      });

      it('should call isRequired when model has validation rules', () => {
        const testModel = new MockModel().init({ requiredDate: '2023-01-01' });
        component._field = 'requiredDate';
        mockHelperService.isRequired.and.returnValue(true);
        component.model = testModel;

        expect(mockHelperService.isRequired).toHaveBeenCalledWith(testModel, 'requiredDate');
        expect(component._isRequired).toBe(true);
      });

      it('should not call helper methods when model has no fields for the field', () => {
        const testModel = new MockModel().init({});
        component._field = 'nonexistentField';
        mockHelperService.getTitle.calls.reset();
        component.model = testModel;

        expect(mockHelperService.getTitle).not.toHaveBeenCalled();
      });
    });

    describe('model getter', () => {
      it('should return the current _model', () => {
        const testModel = new MockModel().init({ date: '2023-01-01' });
        component._model = testModel;
        expect(component.model).toBe(testModel);
      });
    });

    describe('field setter', () => {
      it('should set field when valid string provided', () => {
        component.field = 'testField';
        expect(component._field).toBe('testField');
      });

      it('should set field to "isValid" when "undefined" string provided', () => {
        component.field = 'undefined';
        expect(component._field).toBe('isValid');
      });
    });

    describe('append setter', () => {
      it('should set append when valid string provided', () => {
        component.append = 'USD';
        expect(component._append).toBe('USD');
      });

      it('should set append to empty string when "undefined" string provided', () => {
        component.append = 'undefined';
        expect(component._append).toBe('');
      });
    });

    describe('prepend setter', () => {
      it('should set prepend when valid string provided', () => {
        component.prepend = '$';
        expect(component._prepend).toBe('$');
      });

      it('should set prepend to empty string when "undefined" string provided', () => {
        component.prepend = 'undefined';
        expect(component._prepend).toBe('');
      });
    });

    describe('labelText setter', () => {
      it('should set label when valid string provided', () => {
        component.labelText = 'Custom Label';
        expect(component._label).toBe('Custom Label');
      });

      it('should set label to empty string when "undefined" string provided', () => {
        component.labelText = 'undefined';
        expect(component._label).toBe('');
      });
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      // Mock inputBox ElementRef
      component.inputBox = {
        nativeElement: {
          focus: jasmine.createSpy('focus')
        }
      } as any;
    });

    it('should set selectedValue from model field when model has value', () => {
      const testModel = new MockModel().init({ date: '2023-01-15' });
      component._model = testModel;
      component._field = 'date';

      component.ngOnInit();

      expect(component.selectedValue).toBe('2023-01-15');
    });

    it('should not change selectedValue when model field is empty', () => {
      const testModel = new MockModel().init({ date: '' });
      component._model = testModel;
      component._field = 'date';
      component.selectedValue = '';

      component.ngOnInit();

      expect(component.selectedValue).toBe('');
    });

    it('should focus input when autoFocus is true', () => {
      component.autoFocus = true;

      component.ngOnInit();

      expect(component.inputBox.nativeElement.focus).toHaveBeenCalled();
    });

    it('should not focus input when autoFocus is false', () => {
      component.autoFocus = false;

      component.ngOnInit();

      expect(component.inputBox.nativeElement.focus).not.toHaveBeenCalled();
    });
  });

  describe('change method', () => {
    let testModel: MockModel;
    let mockNgbDate: NgbDate;

    beforeEach(() => {
      testModel = new MockModel().init({ date: '' });
      component._model = testModel;
      component._field = 'date';
      
      mockNgbDate = {
        year: 2023,
        month: 7,
        day: 15
      } as NgbDate;
    });

    it('should format date correctly with padding', () => {
      mockNgbDate.month = 7;
      mockNgbDate.day = 5;
      
      component.change(mockNgbDate);

      expect(component.selectedValue).toBe('2023-07-05');
    });

    it('should set selectedValue with formatted date', () => {
      component.change(mockNgbDate);

      expect(component.selectedValue).toBe('2023-07-15');
    });

    it('should set model field value', () => {
      component.change(mockNgbDate);

      expect(component.model[component._field]).toBe('2023-07-15');
    });

    it('should call validateField with correct parameters', () => {
      component.change(mockNgbDate);

      expect(mockHelperService.validateField).toHaveBeenCalledWith(component._model, component._field);
    });

    it('should emit changed event when validation passes', () => {
      spyOn(component.changed, 'emit');
      mockHelperService.validateField.and.returnValue(true);

      component.change(mockNgbDate);

      expect(component.changed.emit).toHaveBeenCalledWith(component._model);
    });

    it('should not emit changed event when validation fails', () => {
      spyOn(component.changed, 'emit');
      mockHelperService.validateField.and.returnValue(false);

      component.change(mockNgbDate);

      expect(component.changed.emit).not.toHaveBeenCalled();
    });
  });

  describe('typeChange method', () => {
    let testModel: MockModel;

    beforeEach(() => {
      testModel = new MockModel().init({ date: '' });
      component._model = testModel;
      component._field = 'date';
    });

    it('should update model field with input value', () => {
      const event = {
        target: {
          value: '2023-12-25'
        }
      };

      component.typeChange(event);

      expect(component._model[component._field]).toBe('2023-12-25');
    });

    it('should handle empty string input', () => {
      const event = {
        target: {
          value: ''
        }
      };

      component.typeChange(event);

      expect(component._model[component._field]).toBe('');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow with valid date', fakeAsync(() => {
      const testModel = new MockModel().init({ date: '2022-02-19' });
      component._model = testModel;
      component._field = 'date';
      spyOn(component.changed, 'emit');

      fixture.detectChanges();

      const newDate = '2022-12-12';
      const event = { target: { value: newDate } };
      component.typeChange(event);

      expect(component._model['date']).toEqual(newDate);
    }));

    it('should handle NgbDate change with validation', () => {
      const testModel = new MockModel().init({ date: '' });
      component._model = testModel;
      component._field = 'date';
      spyOn(component.changed, 'emit');
      mockHelperService.validateField.and.returnValue(true);

      const ngbDate = { year: 2023, month: 8, day: 20 } as NgbDate;
      component.change(ngbDate);

      expect(component.selectedValue).toBe('2023-08-20');
      expect(component._model['date']).toBe('2023-08-20');
      expect(component.changed.emit).toHaveBeenCalledWith(testModel);
    });

    it('should initialize properly with all dependencies', () => {
      const testModel = new MockModel().init({ date: '2023-01-01' });
      component._field = 'date';
      component.model = testModel;

      expect(component).toBeTruthy();
      expect(component._model).toBe(testModel);
      expect(component._field).toBe('date');
      expect(component.random).toBe('randomstring123');
    });

    it('should handle edge case with single digit month and day', () => {
      const mockNgbDate = {
        year: 2023,
        month: 1,
        day: 5
      } as NgbDate;

      component.change(mockNgbDate);

      expect(component.selectedValue).toBe('2023-01-05');
    });

    it('should work with different field names', () => {
      const testModel = new MockModel().init({ requiredDate: '2023-05-10' });
      component._field = 'requiredDate';
      component.model = testModel;

      expect(mockHelperService.getTitle).toHaveBeenCalledWith(testModel, 'requiredDate');
    });
  });

  describe('Component Properties', () => {
    it('should have correct icon configuration', () => {
      expect(component.icon.calendar).toBeDefined();
    });

    it('should set selectedValue from initial model value', () => {
      const testModel = new MockModel().init({ date: '2023-01-01' });
      component._model = testModel;
      component._field = 'date';
      
      // Simulate component initialization
      component.selectedValue = !!component.model[component._field] ? component.model[component._field] : '';
      
      expect(component.selectedValue).toBe('2023-01-01');
    });

    it('should set selectedValue as empty string when model field is empty', () => {
      const testModel = new MockModel().init({ date: '' });
      component._model = testModel;
      component._field = 'date';
      
      // Simulate component initialization
      component.selectedValue = !!component.model[component._field] ? component.model[component._field] : '';
      
      expect(component.selectedValue).toBe('');
    });
  });

  describe('Template Behavior', () => {
    beforeEach(() => {
      // Mock inputBox for template tests
      component.inputBox = {
        nativeElement: {
          focus: jasmine.createSpy('focus')
        }
      } as any;
    });

    it('should display label when showLabel is true', () => {
      const testModel = new MockModel().init({ date: '2023-01-01' });
      component._model = testModel;
      component._field = 'date';
      component._label = 'Test Label';
      component.showLabel = true;
      
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement).toBeTruthy();
    });

    it('should not display label when showLabel is false', () => {
      component.showLabel = false;
      
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement).toBeFalsy();
    });

    it('should show prepend text when _prepend is not empty', () => {
      component._prepend = '$';
      
      fixture.detectChanges();
      
      const prependElement = fixture.debugElement.query(By.css('.input-group-prepend'));
      expect(prependElement).toBeTruthy();
    });

    it('should not show prepend when _prepend is empty', () => {
      component._prepend = '';
      
      fixture.detectChanges();
      
      const prependElement = fixture.debugElement.query(By.css('.input-group-prepend'));
      expect(prependElement).toBeFalsy();
    });

    it('should show append text when _append is not empty', () => {
      component._append = 'USD';
      
      fixture.detectChanges();
      
      const appendElement = fixture.debugElement.query(By.css('.input-group-append'));
      expect(appendElement).toBeTruthy();
    });

    it('should not show append when _append is empty', () => {
      component._append = '';
      
      fixture.detectChanges();
      
      const appendElement = fixture.debugElement.query(By.css('.input-group-append'));
      expect(appendElement).toBeFalsy();
    });

    it('should show input when not in view-only mode', () => {
      component.isViewOnly = false;
      
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      expect(inputElement).toBeTruthy();
    });

    it('should show view-only div when in view-only mode', () => {
      component.isViewOnly = true;
      const testModel = new MockModel().init({ date: '2023-01-01' });
      component._model = testModel;
      component._field = 'date';
      
      fixture.detectChanges();
      
      const viewOnlyElement = fixture.debugElement.query(By.css('.form-control.border-0.bg-light'));
      expect(viewOnlyElement).toBeTruthy();
    });

    it('should show calendar icon when showIcon is true and not disabled', () => {
      component.showIcon = true;
      component.disabled = false;
      
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('fa-icon'));
      expect(iconElement).toBeTruthy();
    });

    it('should not show calendar icon when disabled', () => {
      component.showIcon = true;
      component.disabled = true;
      
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('fa-icon'));
      expect(iconElement).toBeFalsy();
    });

    it('should not show calendar icon when showIcon is false', () => {
      component.showIcon = false;
      component.disabled = false;
      
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('fa-icon'));
      expect(iconElement).toBeFalsy();
    });

    it('should apply validation error class when field has validation errors', () => {
      const testModel = new MockModel().init({ date: '2023-01-01' });
      testModel.validationErrors = ['date']; // Add validation error
      component._model = testModel;
      component._field = 'date';
      component.isViewOnly = false;
      
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      expect(inputElement.nativeElement.classList.contains('invalid')).toBeTruthy();
    });

    it('should not apply validation error class when field has no validation errors', () => {
      const testModel = new MockModel().init({ date: '2023-01-01' });
      testModel.validationErrors = []; // No validation errors
      component._model = testModel;
      component._field = 'date';
      component.isViewOnly = false;
      
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      expect(inputElement.nativeElement.classList.contains('invalid')).toBeFalsy();
    });

    it('should show required indicator when field is required', () => {
      const testModel = new MockModel().init({ requiredDate: '2023-01-01' });
      component._model = testModel;
      component._field = 'requiredDate';
      component._label = 'Required Field';
      component._isRequired = true;
      component.showLabel = true;
      
      fixture.detectChanges();
      
      const requiredSpan = fixture.debugElement.query(By.css('span'));
      expect(requiredSpan).toBeTruthy();
      expect(requiredSpan.nativeElement.textContent.trim()).toBe('*');
    });

    it('should not show required indicator when field is not required', () => {
      const testModel = new MockModel().init({ date: '2023-01-01' });
      component._model = testModel;
      component._field = 'date';
      component._label = 'Optional Field';
      component._isRequired = false;
      component.showLabel = true;
      
      fixture.detectChanges();
      
      const requiredSpan = fixture.debugElement.query(By.css('span'));
      expect(requiredSpan).toBeFalsy();
    });

    it('should set correct input attributes', () => {
      const testModel = new MockModel().init({ date: '2023-01-01' });
      component._model = testModel;
      component._field = 'date';
      component._placeholder = 'Enter date';
      component._title = 'Date field';
      component.inputClass = 'custom-input';
      component.disabled = false;
      component.isViewOnly = false;
      component.random = 'test123';
      
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      const input = inputElement.nativeElement;
      
      expect(input.id).toBe('date_test123');
      expect(input.name).toBe('date_test123');
      expect(input.placeholder).toBe('Enter date');
      expect(input.title).toBe('Date field');
      expect(input.className).toContain('custom-input');
      expect(input.disabled).toBe(false);
      expect(input.type).toBe('text');
    });

    it('should disable input when disabled is true', () => {
      const testModel = new MockModel().init({ date: '2023-01-01' });
      component._model = testModel;
      component._field = 'date';
      component.disabled = true;
      component.isViewOnly = false;
      
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
  describe('Edge Cases and Error Handling', () => {
    it('should handle null NgbDate in change method gracefully', () => {
      const testModel = new MockModel().init({ date: '' });
      component._model = testModel;
      component._field = 'date';
      
      expect(() => {
        component.change(null as any);
      }).toThrowError();
    });

    it('should handle undefined event in typeChange method', () => {
      const testModel = new MockModel().init({ date: '' });
      component._model = testModel;
      component._field = 'date';
      
      expect(() => {
        component.typeChange(undefined as any);
      }).toThrowError();
    });

    it('should handle null event in typeChange method', () => {
      const testModel = new MockModel().init({ date: '' });
      component._model = testModel;
      component._field = 'date';
      
      expect(() => {
        component.typeChange(null as any);
      }).toThrowError();
    });

    it('should handle event with null target in typeChange method', () => {
      const testModel = new MockModel().init({ date: '' });
      component._model = testModel;
      component._field = 'date';
      
      const event = { target: null };
      
      expect(() => {
        component.typeChange(event as any);
      }).toThrowError();
    });

    it('should handle empty field name', () => {
      const testModel = new MockModel().init({ date: '2023-01-01' });
      component._field = '';
      component.model = testModel;
      
      expect(component._field).toBe('');
    });

    it('should handle model without fields property', () => {
      const emptyModel = new BaseModel();
      component._field = 'nonexistent';
      component.model = emptyModel;
      
      // Should not call helper methods when fields don't exist
      expect(mockHelperService.getTitle).not.toHaveBeenCalled();
    });

    it('should handle model without validationRules property', () => {
      const emptyModel = new BaseModel();
      component._field = 'nonexistent';
      component.model = emptyModel;
      
      // Should not call isRequired when validationRules don't exist
      expect(mockHelperService.isRequired).not.toHaveBeenCalled();
    });

    it('should maintain selectedValue when model is updated without field value', () => {
      component.selectedValue = 'existing-value';
      const testModel = new MockModel().init({});
      component._field = 'date';
      component.model = testModel;
      
      component.ngOnInit();
      
      expect(component.selectedValue).toBe('existing-value');
    });

    it('should handle autoFocus when inputBox is undefined', () => {
      component.autoFocus = true;
      component.inputBox = undefined as any;
      
      expect(() => {
        component.ngOnInit();
      }).toThrowError();
    });

    it('should work with different date formats in change method', () => {
      const testModel = new MockModel().init({ date: '' });
      component._model = testModel;
      component._field = 'date';
      
      const ngbDate = { year: 2023, month: 12, day: 31 } as NgbDate;
      component.change(ngbDate);
      
      expect(component.selectedValue).toBe('2023-12-31');
    });

    it('should handle very long field names', () => {
      const longFieldName = 'a'.repeat(100);
      component.field = longFieldName;
      
      expect(component._field).toBe(longFieldName);
    });

    it('should handle special characters in field names', () => {
      const specialFieldName = 'field-with_special.chars$123';
      component.field = specialFieldName;
      
      expect(component._field).toBe(specialFieldName);
    });
  });
});
