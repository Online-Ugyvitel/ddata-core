// @ts-nocheck -- generated spec uses loosely typed mock models, events and private members
// tslint:disable: max-line-length
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import {
  BaseModel,
  BaseModelInterface,
  DdataCoreModule,
  FieldsInterface,
  ID,
  ISODate,
  ValidatorService
} from '@netdjw/ddata-core';
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

  init(initData?: any): this {
    const data = !!initData ? initData : {};

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
// Components are OnPush by default in Angular 22, so direct property changes need an explicit dirty mark.
const detectChangesOf = (fixture: ComponentFixture<unknown>): void => {
  fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
  fixture.detectChanges();
};

describe('DdataInputDateComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers({ advanceTimeDelta: 1, shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  let component: DdataInputDateComponent;
  let fixture: ComponentFixture<DdataInputDateComponent>;
  let mockHelperService: any;
  let mockChangeDetector: any;

  beforeEach(async () => {
    mockHelperService = {
      getTitle: vi.fn().mockName('InputHelperService.getTitle'),
      getLabel: vi.fn().mockName('InputHelperService.getLabel'),
      getPlaceholder: vi.fn().mockName('InputHelperService.getPlaceholder'),
      getPrepend: vi.fn().mockName('InputHelperService.getPrepend'),
      getAppend: vi.fn().mockName('InputHelperService.getAppend'),
      isRequired: vi.fn().mockName('InputHelperService.isRequired'),
      validateField: vi.fn().mockName('InputHelperService.validateField'),
      randChars: vi.fn().mockName('InputHelperService.randChars')
    };

    mockChangeDetector = {
      detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges')
    };

    // Set up default return values
    mockHelperService.getTitle.mockReturnValue('Test Title');
    mockHelperService.getLabel.mockReturnValue('Test Label');
    mockHelperService.getPlaceholder.mockReturnValue('Test Placeholder');
    mockHelperService.getPrepend.mockReturnValue('$');
    mockHelperService.getAppend.mockReturnValue('USD');
    mockHelperService.isRequired.mockReturnValue(false);
    mockHelperService.validateField.mockReturnValue(true);
    mockHelperService.randChars.mockReturnValue('randomstring123');

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
          useValue: {
            validate: vi.fn().mockName('ValidatorService.validate')
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn().mockName('Router.navigate')
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: vi.fn().mockName('ActivatedRoute.queryParams')
          }
        },
        {
          provide: 'env',
          useValue: {
            get: vi.fn().mockName('EnvService.get')
          }
        },
        {
          provide: HttpClient,
          useValue: {
            get: vi.fn().mockName('HttpClient.get')
          }
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DdataInputDateComponent);
        component = fixture.componentInstance;

        // Override the helperService property to use our mock
        component.helperService = mockHelperService;

        detectChangesOf(fixture);
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
        mockHelperService.isRequired.mockReturnValue(true);
        component.model = testModel;

        expect(mockHelperService.isRequired).toHaveBeenCalledWith(testModel, 'requiredDate');
        expect(component._isRequired).toBe(true);
      });

      it('should not call helper methods when model has no fields for the field', () => {
        const testModel = new MockModel().init({});

        component._field = 'nonexistentField';
        mockHelperService.getTitle.mockClear();
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
          focus: vi.fn().mockName('focus')
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

      expect(mockHelperService.validateField).toHaveBeenCalledWith(
        component._model,
        component._field
      );
    });

    it('should emit changed event when validation passes', () => {
      vi.spyOn(component.changed, 'emit').mockReturnValue(undefined);
      mockHelperService.validateField.mockReturnValue(true);

      component.change(mockNgbDate);

      expect(component.changed.emit).toHaveBeenCalledWith(component._model);
    });

    it('should not emit changed event when validation fails', () => {
      vi.spyOn(component.changed, 'emit').mockReturnValue(undefined);
      mockHelperService.validateField.mockReturnValue(false);

      component.change(mockNgbDate);

      expect(component.changed.emit).not.toHaveBeenCalled();
    });
  });

  describe('date boundaries', () => {
    let testModel: MockModel;

    beforeEach(() => {
      testModel = new MockModel().init({ date: '' });
      component._model = testModel;
      component._field = 'date';
    });

    it.each([
      [2024, 2, 29, '2024-02-29'],
      [2000, 2, 29, '2000-02-29'],
      [2023, 12, 31, '2023-12-31'],
      [2024, 1, 1, '2024-01-01'],
      [2024, 1, 31, '2024-01-31'],
      [2024, 3, 1, '2024-03-01'],
      [1, 1, 1, '1-01-01'],
      [9999, 12, 31, '9999-12-31']
    ])('should store %i-%i-%i as %s', (year, month, day, expected) => {
      component.change(new NgbDate(year, month, day));

      expect(testModel.date).toBe(expected);
      expect(component.selectedValue).toBe(expected);
    });

    it('should not shift the selected day by the time zone', () => {
      const realDate = new NgbDate(2024, 3, 31);

      vi.setSystemTime(new Date('2024-03-31T23:30:00Z'));
      component.change(realDate);

      expect(testModel.date).toBe('2024-03-31');
    });

    it('should store the selected date of the datepicker', () => {
      const changed = vi.fn();

      component.changed.subscribe(changed);
      fixture.componentRef.setInput('field', 'date');
      fixture.componentRef.setInput('model', testModel);
      detectChangesOf(fixture);

      fixture.debugElement
        .query(By.css('input'))
        .triggerEventHandler('dateSelect', new NgbDate(2024, 2, 29));

      expect(testModel.date).toBe('2024-02-29');
      expect(changed).toHaveBeenCalledExactlyOnceWith(testModel);
    });

    it('should keep an invalid typed date as it is and let the validator decide', () => {
      const input = document.createElement('input');

      input.value = '2023-02-30';
      component.typeChange({ target: input } as unknown as Event);

      expect(testModel.date).toBe('2023-02-30');

      input.value = 'not a date';
      component.typeChange({ target: input } as unknown as Event);

      expect(testModel.date).toBe('not a date');
    });

    it('should render the stored date in the input', () => {
      testModel.date = '2024-02-29';
      fixture.componentRef.setInput('field', 'date');
      fixture.componentRef.setInput('model', testModel);
      detectChangesOf(fixture);

      expect(fixture.nativeElement.querySelector('input').value).toBe('2024-02-29');
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
    it('should handle complete workflow with valid date', async () => {
      const testModel = new MockModel().init({ date: '2022-02-19' });

      component._model = testModel;
      component._field = 'date';
      vi.spyOn(component.changed, 'emit').mockReturnValue(undefined);

      detectChangesOf(fixture);
      const newDate = '2022-12-12';
      const event = { target: { value: newDate } };

      component.typeChange(event);

      expect(component._model['date']).toEqual(newDate);
    });

    it('should handle NgbDate change with validation', () => {
      const testModel = new MockModel().init({ date: '' });

      component._model = testModel;
      component._field = 'date';
      vi.spyOn(component.changed, 'emit').mockReturnValue(undefined);
      mockHelperService.validateField.mockReturnValue(true);
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
      component.selectedValue = !!component.model[component._field]
        ? component.model[component._field]
        : '';

      expect(component.selectedValue).toBe('2023-01-01');
    });

    it('should set selectedValue as empty string when model field is empty', () => {
      const testModel = new MockModel().init({ date: '' });

      component._model = testModel;
      component._field = 'date';

      // Simulate component initialization
      component.selectedValue = !!component.model[component._field]
        ? component.model[component._field]
        : '';

      expect(component.selectedValue).toBe('');
    });
  });

  describe('Template Behavior', () => {
    beforeEach(() => {
      // Mock inputBox for template tests
      component.inputBox = {
        nativeElement: {
          focus: vi.fn().mockName('focus')
        }
      } as any;
    });

    it('should display label when showLabel is true', () => {
      const testModel = new MockModel().init({ date: '2023-01-01' });

      component._model = testModel;
      component._field = 'date';
      component._label = 'Test Label';
      component.showLabel = true;

      detectChangesOf(fixture);
      const labelElement = fixture.debugElement.query(By.css('label'));

      expect(labelElement).toBeTruthy();
    });

    it('should not display label when showLabel is false', () => {
      component.showLabel = false;

      detectChangesOf(fixture);
      const labelElement = fixture.debugElement.query(By.css('label.col-form-label'));

      expect(labelElement).toBeFalsy();
    });

    it('should show prepend text when _prepend is not empty', () => {
      component._prepend = '$';

      detectChangesOf(fixture);
      const prependElement = fixture.debugElement.query(By.css('.input-group-prepend'));

      expect(prependElement).toBeTruthy();
    });

    it('should not show prepend when _prepend is empty', () => {
      component._prepend = '';

      detectChangesOf(fixture);
      const prependElement = fixture.debugElement.query(By.css('div.input-group-prepend'));

      expect(prependElement).toBeFalsy();
    });

    it('should show append text when _append is not empty', () => {
      component._append = 'USD';

      detectChangesOf(fixture);
      const appendElement = fixture.debugElement.query(By.css('.input-group-append'));

      expect(appendElement).toBeTruthy();
    });

    it('should not show append when _append is empty', () => {
      component._append = '';

      detectChangesOf(fixture);
      const appendElement = fixture.debugElement.query(By.css('.input-group-append'));

      expect(appendElement).toBeFalsy();
    });

    it('should show input when not in view-only mode', () => {
      component.isViewOnly = false;

      detectChangesOf(fixture);
      const inputElement = fixture.debugElement.query(By.css('input'));

      expect(inputElement).toBeTruthy();
    });

    it('should show view-only div when in view-only mode', () => {
      component.isViewOnly = true;
      const testModel = new MockModel().init({ date: '2023-01-01' });

      component._model = testModel;
      component._field = 'date';

      detectChangesOf(fixture);
      const viewOnlyElement = fixture.debugElement.query(By.css('.form-control.border-0.bg-light'));

      expect(viewOnlyElement).toBeTruthy();
    });

    it('should show calendar icon when showIcon is true and not disabled', () => {
      component.showIcon = true;
      component.disabled = false;

      detectChangesOf(fixture);
      const iconElement = fixture.debugElement.query(By.css('fa-icon'));

      expect(iconElement).toBeTruthy();
    });

    it('should not show calendar icon when disabled', () => {
      component.showIcon = true;
      component.disabled = true;

      detectChangesOf(fixture);
      const iconElement = fixture.debugElement.query(By.css('fa-icon'));

      expect(iconElement).toBeFalsy();
    });

    it('should not show calendar icon when showIcon is false', () => {
      component.showIcon = false;
      component.disabled = false;

      detectChangesOf(fixture);
      const iconElement = fixture.debugElement.query(By.css('fa-icon'));

      expect(iconElement).toBeFalsy();
    });

    it('should apply validation error class when field has validation errors', () => {
      const testModel = new MockModel().init({ date: '2023-01-01' });

      testModel.validationErrors = ['date']; // Add validation error
      component._model = testModel;
      component._field = 'date';
      component.isViewOnly = false;

      detectChangesOf(fixture);
      const inputElement = fixture.debugElement.query(By.css('input'));

      expect(inputElement.nativeElement.classList.contains('invalid')).toBeTruthy();
    });

    it('should not apply validation error class when field has no validation errors', () => {
      const testModel = new MockModel().init({ date: '2023-01-01' });

      testModel.validationErrors = []; // No validation errors
      component._model = testModel;
      component._field = 'date';
      component.isViewOnly = false;

      detectChangesOf(fixture);
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

      detectChangesOf(fixture);
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

      detectChangesOf(fixture);
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

      detectChangesOf(fixture);
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

      detectChangesOf(fixture);
      const inputElement = fixture.debugElement.query(By.css('input'));

      expect(inputElement.nativeElement.disabled).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null NgbDate in change method gracefully', () => {
      const testModel = new MockModel().init({ date: '' });

      component._model = testModel;
      component._field = 'date';

      expect(() => {
        component.change(null);
      }).toThrowError();
    });

    it('should handle undefined event in typeChange method', () => {
      const testModel = new MockModel().init({ date: '' });

      component._model = testModel;
      component._field = 'date';

      expect(() => {
        component.typeChange(undefined);
      }).toThrowError();
    });

    it('should handle null event in typeChange method', () => {
      const testModel = new MockModel().init({ date: '' });

      component._model = testModel;
      component._field = 'date';

      expect(() => {
        component.typeChange(null);
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
  describe('min and max', () => {
    let testModel: MockModel;
    let changed: ReturnType<typeof vi.fn>;
    const input = (): HTMLInputElement => fixture.nativeElement.querySelector('input');
    const picker = (): NgbInputDatepicker =>
      fixture.debugElement.query(By.css('input')).injector.get(NgbInputDatepicker);
    const render = (inputs: Record<string, unknown>): void => {
      Object.entries(inputs).forEach(([key, value]) => fixture.componentRef.setInput(key, value));
      fixture.detectChanges();
    };
    const type = (value: string): void => {
      input().value = value;
      input().dispatchEvent(new Event('change'));
      fixture.detectChanges();
    };
    const pick = (year: number, month: number, day: number): void => {
      fixture.debugElement
        .query(By.css('input'))
        .triggerEventHandler('dateSelect', new NgbDate(year, month, day));
      fixture.detectChanges();
    };

    beforeEach(() => {
      testModel = new MockModel().init({ date: '2024-06-15' });
      changed = vi.fn();
      component.changed.subscribe(changed);
      vi.spyOn(console, 'warn').mockReturnValue(undefined);
      render({ field: 'date', model: testModel });
    });

    it('should not restrict anything without min and max', () => {
      expect(component.minDate).toBeNull();
      expect(component.maxDate).toBeNull();

      type('1900-01-01');

      expect(testModel.date).toBe('1900-01-01');

      pick(2999, 12, 31);

      expect(testModel.date).toBe('2999-12-31');
      expect(testModel.validationErrors).toEqual([]);
    });

    it.each([null, undefined, ''])('should not restrict anything with %j limits', (limit) => {
      render({ min: limit, max: limit });

      expect(component.minDate).toBeNull();
      expect(component.maxDate).toBeNull();

      type('1900-01-01');

      expect(testModel.date).toBe('1900-01-01');
    });

    it('should pass string limits to the datepicker in the given format', () => {
      render({ format: 'DD.MM.YYYY', min: '01.02.2024', max: '29.02.2024' });

      expect(component.minDate).toEqual({ year: 2024, month: 2, day: 1 });
      expect(component.maxDate).toEqual({ year: 2024, month: 2, day: 29 });
      expect(picker().minDate).toEqual({ year: 2024, month: 2, day: 1 });
      expect(picker().maxDate).toEqual({ year: 2024, month: 2, day: 29 });
    });

    it('should accept Date limits', () => {
      render({ min: new Date(2024, 0, 1), max: new Date(2024, 11, 31, 23, 59) });

      expect(component.minDate).toEqual({ year: 2024, month: 1, day: 1 });
      expect(component.maxDate).toEqual({ year: 2024, month: 12, day: 31 });
    });

    it('should work with a callable moment factory', () => {
      render({
        moment: (moment as unknown as { default: typeof moment }).default,
        min: '2024-01-01'
      });

      expect(component.minDate).toEqual({ year: 2024, month: 1, day: 1 });
    });

    it('should ignore an invalid limit with a warning', () => {
      render({ min: '2024-13-45', max: 'tomorrow' });

      expect(component.minDate).toBeNull();
      expect(component.maxDate).toBeNull();
      expect(console.warn).toHaveBeenCalledWith(
        'Invalid min date: "2024-13-45", the min limit is ignored.'
      );
      expect(console.warn).toHaveBeenCalledWith(
        'Invalid max date: "tomorrow", the max limit is ignored.'
      );

      type('1900-01-01');

      expect(testModel.date).toBe('1900-01-01');
    });

    describe('with both limits', () => {
      beforeEach(() => {
        render({ min: '2024-01-10', max: '2024-01-20' });
      });

      it.each(['2024-01-10', '2024-01-15', '2024-01-20'])(
        'should accept the typed value %s',
        (value) => {
          type(value);

          expect(testModel.date).toBe(value);
          expect(input().classList).not.toContain('invalid');
        }
      );

      it.each([
        [2024, 1, 10, '2024-01-10'],
        [2024, 1, 20, '2024-01-20']
      ])('should accept the picked boundary %i-%i-%i', (year, month, day, expected) => {
        pick(year, month, day);

        expect(testModel.date).toBe(expected);
        expect(changed).toHaveBeenCalledExactlyOnceWith(testModel);
      });

      it.each(['2024-01-09', '2024-01-21', '2023-12-31', '2025-01-15'])(
        'should reject the typed value %s and mark the field invalid',
        (value) => {
          type(value);

          expect(testModel.date).toBe('2024-06-15');
          expect(testModel.validationErrors).toEqual(['date']);
          expect(input().classList).toContain('invalid');
        }
      );

      it('should reject a picked date outside of the range without emitting', () => {
        pick(2024, 1, 9);

        expect(testModel.date).toBe('2024-06-15');
        expect(testModel.validationErrors).toEqual(['date']);
        expect(changed).not.toHaveBeenCalled();

        pick(2024, 1, 21);

        expect(testModel.validationErrors).toEqual(['date']);
      });

      it('should clear the range error when a value in range follows', () => {
        type('2024-01-01');

        expect(input().classList).toContain('invalid');

        type('2024-01-12');

        expect(testModel.date).toBe('2024-01-12');
        expect(testModel.validationErrors).toEqual([]);
        expect(input().classList).not.toContain('invalid');
      });

      it('should not fail when the range error was already removed by the validator', () => {
        type('2024-01-01');
        testModel.validationErrors = [];

        type('2024-01-12');

        expect(testModel.date).toBe('2024-01-12');
        expect(testModel.validationErrors).toEqual([]);
      });

      it('should keep the error of other validation untouched for a value in range', () => {
        testModel.validationErrors = ['date'];

        type('2024-01-12');

        expect(testModel.validationErrors).toEqual(['date']);
      });

      it('should leave an unparsable value to the validator', () => {
        type('not a date');

        expect(testModel.date).toBe('not a date');
        expect(testModel.validationErrors).toEqual([]);
      });
    });

    it('should only restrict the past with only min', () => {
      render({ min: '2024-01-10' });

      expect(component.maxDate).toBeNull();

      type('2024-01-09');

      expect(testModel.date).toBe('2024-06-15');

      type('2999-01-01');

      expect(testModel.date).toBe('2999-01-01');
    });

    it('should only restrict the future with only max', () => {
      render({ max: '2024-01-20' });

      expect(component.minDate).toBeNull();

      type('2024-01-21');

      expect(testModel.date).toBe('2024-06-15');

      type('1900-01-01');

      expect(testModel.date).toBe('1900-01-01');
    });

    it('should follow min and max changes after init', () => {
      render({ min: '2024-01-10', max: '2024-01-20' });
      type('2024-02-01');

      expect(testModel.date).toBe('2024-06-15');

      render({ max: '2024-02-28' });

      expect(picker().maxDate).toEqual({ year: 2024, month: 2, day: 28 });

      type('2024-02-01');

      expect(testModel.date).toBe('2024-02-01');

      render({ min: null, max: null });
      type('1999-01-01');

      expect(testModel.date).toBe('1999-01-01');
      expect(picker().minDate).toBeNull();
    });

    it('should not recalculate the range for other input changes', () => {
      render({ min: '2024-01-10' });
      const minDate = component.minDate;

      render({ disabled: true });

      expect(component.minDate).toBe(minDate);
    });
  });
});
