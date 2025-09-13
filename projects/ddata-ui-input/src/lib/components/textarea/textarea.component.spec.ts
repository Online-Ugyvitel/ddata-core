import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DdataTextareaComponent } from './textarea.component';
import { BaseModel, DdataCoreModule, BaseModelInterface, FieldsInterface } from 'ddata-core';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

describe('DdataTextareaComponent', () => {
  let component: DdataTextareaComponent;
  let fixture: ComponentFixture<DdataTextareaComponent>;
  let mockInputHelperService: jasmine.SpyObj<InputHelperService>;

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

    mockInputHelperService = mockInjector.get() as jasmine.SpyObj<InputHelperService>;

    await TestBed.configureTestingModule({
      declarations: [DdataTextareaComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DdataTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set model and all required fields', () => {
    const model = new BaseModel();

    model.fields = { test: 'testField' };
    model.validationRules = {};

    component.field = 'test';
    component.model = model;

    expect(component._title).toBe('Test Title');
    expect(component._label).toBe('Test Label');
    expect(component._placeholder).toBe('Test Placeholder');
  });

  it('should set field properly', () => {
    component.field = 'testField';

    expect(component._field).toBe('testField');
  });

  it('should handle undefined field value', () => {
    component.field = 'undefined';

    expect(component._field).toBe('isValid');
  });

  it('should set append value', () => {
    component.append = 'test append';

    expect(component._append).toBe('test append');
  });

  it('should handle undefined append value', () => {
    component.append = 'undefined';

    expect(component._append).toBe('');
  });

  it('should set prepend value', () => {
    component.prepend = 'test prepend';

    expect(component._prepend).toBe('test prepend');
  });

  it('should handle undefined prepend value', () => {
    component.prepend = 'undefined';

    expect(component._prepend).toBe('');
  });

  it('should set label text', () => {
    component.labelText = 'test label';

    expect(component._label).toBe('test label');
  });

  it('should handle undefined label text', () => {
    component.labelText = 'undefined';

    expect(component._label).toBe('');
  });

  it('should emit changed event when field is valid', () => {
    const model = new BaseModel();

    model.fields = { test: 'testField' };
    component.field = 'test';
    component.model = model;

    spyOn(component.changed, 'emit');
    mockInputHelperService.validateField.and.returnValue(true);

    component.validateField();

    expect(component.changed.emit).toHaveBeenCalledWith(model);
  });

  it('should not emit changed event when field is invalid', () => {
    const model = new BaseModel();

    model.fields = { test: 'testField' };
    component.field = 'test';
    component.model = model;

    spyOn(component.changed, 'emit');
    mockInputHelperService.validateField.and.returnValue(false);

    component.validateField();

    expect(component.changed.emit).not.toHaveBeenCalled();
  });

  it('should set word counter warning', () => {
    component.setWordCounterWarning(true);

    expect(component.displayWordCounterWarning).toBe(true);

    component.setWordCounterWarning(false);

    expect(component.displayWordCounterWarning).toBe(false);
  });

  // Test legacy behavior for compatibility with existing tests
  it('getTitle() should return title', () => {
    const model = new BaseModel();

    model.fields = { fake: { title: 'a' } };

    component.field = 'fake';
    component.model = model as BaseModelInterface<unknown> & FieldsInterface<unknown>;

    expect(component._title).toBe('Test Title');

    model.fields = {};
    component.model = model as BaseModelInterface<unknown> & FieldsInterface<unknown>;

    expect(mockInputHelperService.getTitle).toHaveBeenCalledWith(jasmine.any(BaseModel), 'fake');
  });

  it('getLabel() should return label', () => {
    const model = new BaseModel();

    model.fields = { fake: { label: 'a' } };

    component.field = 'fake';
    component.model = model as BaseModelInterface<unknown> & FieldsInterface<unknown>;

    expect(component._label).toBe('Test Label');

    model.fields = {};
    component.model = model as BaseModelInterface<unknown> & FieldsInterface<unknown>;

    expect(mockInputHelperService.getLabel).toHaveBeenCalledWith(jasmine.any(BaseModel), 'fake');
  });

  it('getPlaceholder() should return placeholder', () => {
    const model = new BaseModel();

    model.fields = { fake: { placeholder: 'a' } };

    component.field = 'fake';
    component.model = model as BaseModelInterface<unknown> & FieldsInterface<unknown>;

    expect(component._placeholder).toBe('Test Placeholder');

    model.fields = {};
    component.model = model as BaseModelInterface<unknown> & FieldsInterface<unknown>;

    expect(mockInputHelperService.getPlaceholder).toHaveBeenCalledWith(
      jasmine.any(BaseModel),
      'fake'
    );
  });
});
