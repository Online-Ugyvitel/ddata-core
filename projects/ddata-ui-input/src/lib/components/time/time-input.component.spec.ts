import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DdataCoreModule } from 'ddata-core';
import { DdataInputTimeComponent } from './time-input.component';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

describe('DdataInputTimeComponent', () => {
  let component: DdataInputTimeComponent;
  let fixture: ComponentFixture<DdataInputTimeComponent>;

  beforeEach(async () => {
    // Mock DdataCoreModule.InjectorInstance
    const mockInputHelperService = {
      validateFieldValue: jasmine.createSpy('validateFieldValue').and.callFake((model, field) => {
        return field === 'country_id' ? 'valid-value' : 'mock-validated-value';
      }),
      createUniqueId: jasmine.createSpy('createUniqueId').and.returnValue('mock-unique-id'),
      randChars: jasmine.createSpy('randChars').and.returnValue('mock-random'),
      getTitle: jasmine.createSpy('getTitle').and.callFake((model, field) => {
        return field === 'country_id' ? 'Country' : 'Test Title';
      }),
      getLabel: jasmine.createSpy('getLabel').and.callFake((model, field) => {
        return field === 'country_id' ? 'Country Label' : 'Test Label';
      }),
      getPlaceholder: jasmine.createSpy('getPlaceholder').and.returnValue('Test Placeholder'),
      getPrepend: jasmine.createSpy('getPrepend').and.returnValue('Test Prepend'),
      getAppend: jasmine.createSpy('getAppend').and.returnValue('Test Append'),
      isRequired: jasmine.createSpy('isRequired').and.callFake((model, field) => {
        return field === 'country_id' ? true : false;
      }),
      validateField: jasmine.createSpy('validateField').and.returnValue(true)
    };
    const mockInjector = {
      get: jasmine.createSpy('get').and.returnValue(mockInputHelperService)
    };

    Object.defineProperty(DdataCoreModule, 'InjectorInstance', {
      value: mockInjector,
      writable: true
    });

    await TestBed.configureTestingModule({
      declarations: [DdataInputTimeComponent],
      imports: [FormsModule],
      providers: [{ provide: InputHelperService, useValue: mockInputHelperService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DdataInputTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('should set the time', () => {
    component.field = 'api_endpoint';
    const fakeparameter = 'test';

    expect((component.model as any).api_endpoint).toBe(
      '/you/must/be/define/api_endpoint/in/your/model'
    );
    component.setTime(fakeparameter);

    expect((component.model as any).api_endpoint).toBe(fakeparameter);
  });
});
