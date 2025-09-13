import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DdataInputCheckboxComponent } from './checkbox.component';
import { DdataCoreModule, BaseModel } from 'ddata-core';

describe('DdataInputCheckboxComponent', () => {
  let component: DdataInputCheckboxComponent;
  let fixture: ComponentFixture<DdataInputCheckboxComponent>;

  beforeEach(async () => {
    // Mock DdataCoreModule.InjectorInstance to prevent runtime errors
    const mockInjector = {
      get: jasmine.createSpy('get').and.returnValue({
        randChars: jasmine.createSpy('randChars').and.returnValue('mock-random'),
        getTitle: jasmine.createSpy('getTitle').and.returnValue('Test Title'),
        getLabel: jasmine.createSpy('getLabel').and.returnValue('Test Label'),
        getPlaceholder: jasmine.createSpy('getPlaceholder').and.returnValue('Test Placeholder'),
        getPrepend: jasmine.createSpy('getPrepend').and.returnValue('Test Prepend'),
        getAppend: jasmine.createSpy('getAppend').and.returnValue('Test Append'),
        isRequired: jasmine.createSpy('isRequired').and.returnValue(true),
        validateField: jasmine.createSpy('validateField').and.returnValue(true)
      })
    };

    // Set up the mock injector before TestBed configuration
    Object.defineProperty(DdataCoreModule, 'InjectorInstance', {
      value: mockInjector,
      writable: true
    });

    await TestBed.configureTestingModule({
      declarations: [DdataInputCheckboxComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // To handle fa-icon elements
    }).compileComponents();

    fixture = TestBed.createComponent(DdataInputCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit() method should set iterable to be not 0', () => {
    component.ngOnInit();

    expect(component.iterable).toBeGreaterThanOrEqual(0);
    expect(component.iterable).toBeLessThanOrEqual(100);
  });

  it("model property should set model to be Instance if Basemodel when it's null or refresh it's value", () => {
    component._model = null;
    component.model = null;

    expect(component._model).toBeInstanceOf(BaseModel);
  });

  it("field property should set field to be 'isValid' when it's undefined or refresh it's value", () => {
    component._field = '';
    component.field = 'undefined';

    expect(component._field).toBe('isValid');

    component = fixture.componentInstance;
    component._field = '';
    component.field = undefined;

    expect(component._field).not.toBe('');

    component = fixture.componentInstance;
    component._field = '';
    component.field = 'something';

    expect(component._field).toBe('something');
  });

  it('getIcon() method should return faCheckSquare or faSquare', () => {
    expect(component.getIcon()).toBeTruthy();
    expect(component.getIcon()).toEqual(component.iconOff);

    component.model.isValid = true;

    expect(component.getIcon()).toBeTruthy();
    expect(component.getIcon()).toEqual(component.iconOn);
  });

  it("clicked() method should change the isValid if it's not disabled", () => {
    component.disabled = false;
    component.model.isValid = false;
    component.clicked();

    expect(component.model.isValid).toBe(true);

    component.disabled = true;
    component.model.isValid = false;
    component.clicked();

    expect(component.model.isValid).toBe(false);
  });
});
