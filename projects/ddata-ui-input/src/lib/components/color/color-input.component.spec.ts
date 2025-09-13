import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DdataInputColorComponent } from './color-input.component';
import { DdataCoreModule } from 'ddata-core';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

describe('DdataInputColorComponent', () => {
  let component: DdataInputColorComponent;
  let fixture: ComponentFixture<DdataInputColorComponent>;

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
      declarations: [DdataInputColorComponent],
      imports: [FormsModule],
      providers: [{ provide: InputHelperService, useValue: mockInputHelperService }],
      schemas: [NO_ERRORS_SCHEMA] // To handle colorPicker and cpToggle properties
    }).compileComponents();

    fixture = TestBed.createComponent(DdataInputColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('model property should set _model to be null', () => {
    component.model = null;

    expect(component._model).toBeDefined();
    expect(component._model.model_name).toBe('NotDefined');
  });

  it("field property should set _field to be 'isValid' when it's undefined or refresh it's value", () => {
    component._field = '';
    component.field = 'undefined';

    expect(component._field).toBe('isValid');

    component._field = '';
    component.field = undefined;

    expect(component._field).not.toBe('');

    component._field = '';
    component.field = 'something';

    expect(component._field).toBe('something');
  });

  it("append property should set _append to be '' when it's undefined or refresh it's value", () => {
    component._append = '';
    component.append = 'undefined';

    expect(component._append).toBe('');

    component._append = '';
    component.append = undefined;

    expect(component._append).not.toBe('');

    component._append = '';
    component.append = 'something';

    expect(component._append).toBe('something');
  });

  it("prepend property should set _prepend to be '' when it's undefined or refresh it's value", () => {
    component._prepend = '';
    component.prepend = 'undefined';

    expect(component._prepend).toBe('');

    component._prepend = '';
    component.prepend = undefined;

    expect(component._prepend).not.toBe('');

    component._prepend = '';
    component.prepend = 'something';

    expect(component._prepend).toBe('something');
  });

  it("labelText property should set _label to be '' when it's undefined or refresh it's value", () => {
    component._label = '';
    component.labelText = 'undefined';

    expect(component._label).toBe('');

    component._label = '';
    component.labelText = undefined;

    expect(component._label).not.toBe('');

    component._label = '';
    component.labelText = 'something';

    expect(component._label).toBe('something');
  });
});
