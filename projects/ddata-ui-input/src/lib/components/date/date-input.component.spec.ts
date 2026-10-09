// tslint:disable: max-line-length
import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BaseModel,
  BaseModelInterface,
  DdataCoreModule,
  ID,
  ISODate,
  ValidatorService
} from 'ddata-core';
import { DdataUiInputModule } from '../../ddata-ui-input.module';
import { InputHelperService } from '../../services/input/helper/input-helper.service';
import { DdataInputDateComponent } from './date-input.component';

interface MockModelInterface extends BaseModelInterface<MockModelInterface> {
  // name: string;
  date: ISODate;
  requiredDate: ISODate;
}

class MockModel extends BaseModel implements MockModelInterface {
  id: ID;
  date: ISODate;
  requiredDate: ISODate;

  init(data?: unknown): this {
    const modelData = !!data ? (data as { id?: unknown; date?: unknown }) : {};

    this.id = (modelData.id || 0) as ID;
    // this.name = !!data.name ? data.name : '';
    this.date = (modelData.date || '') as ISODate;

    return this;
  }
}

describe('DateFieldComponent', () => {
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
      ]
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

  it('type in the field change model value', fakeAsync(() => {
    component._model = new MockModel().init({ date: '2022-02-19' });
    component._field = 'date';

    fixture.detectChanges();
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const newDate = '2022-12-12';

    input.value = newDate;
    fixture.debugElement.query(By.css('input')).triggerEventHandler('change', { target: input });
    fixture.detectChanges();

      it('should create new BaseModel when null provided', () => {
        component.model = null;
        expect(component._model).toBeInstanceOf(BaseModel);
      });

  // it('ngOnInit() should change selectedValue', () => {
  //   component.model = testModel;

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

  // it('labelText input should set _label', () => {});
  // it('labelText input should set _label on falsy to empty string', () => {});
});
