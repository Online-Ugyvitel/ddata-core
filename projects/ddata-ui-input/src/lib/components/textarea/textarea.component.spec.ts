import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DdataTextareaComponent } from './textarea.component';
import { BaseModel, DdataCoreModule, BaseModelInterface, FieldsInterface } from 'ddata-core';
import { InputHelperService } from '../../services/input/helper/input-helper.service';
import { CharacterCounterComponent } from '../character-counter/character-counter.component';
import { WordCounterComponent } from '../word-counter/word-counter.component';

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

describe('DdataTextareaComponent counters', () => {
  let fixture: ComponentFixture<DdataTextareaComponent>;
  let component: DdataTextareaComponent;

  beforeEach(async () => {
    const mockHelper = {
      randChars: jasmine.createSpy('randChars').and.returnValue('rnd'),
      getTitle: jasmine.createSpy('getTitle').and.returnValue(''),
      getLabel: jasmine.createSpy('getLabel').and.returnValue(''),
      getPlaceholder: jasmine.createSpy('getPlaceholder').and.returnValue(''),
      getPrepend: jasmine.createSpy('getPrepend').and.returnValue(''),
      getAppend: jasmine.createSpy('getAppend').and.returnValue(''),
      isRequired: jasmine.createSpy('isRequired').and.returnValue(false),
      validateField: jasmine.createSpy('validateField').and.returnValue(true)
    };

    Object.defineProperty(DdataCoreModule, 'InjectorInstance', {
      value: { get: jasmine.createSpy('get').and.returnValue(mockHelper) },
      writable: true
    });

    await TestBed.configureTestingModule({
      declarations: [DdataTextareaComponent, CharacterCounterComponent, WordCounterComponent],
      imports: [FormsModule],
      providers: [{ provide: InputHelperService, useValue: mockHelper }]
    }).compileComponents();

    fixture = TestBed.createComponent(DdataTextareaComponent);
    component = fixture.componentInstance;

    const model = new BaseModel() as BaseModelInterface<unknown> & FieldsInterface<unknown>;

    (model as unknown as Record<string, string>)['description'] = 'one, two, three';
    model.fields = {};
    model.validationRules = {};
    component.field = 'description';
    component.model = model;
  });

  it('should render the counters outside of the textarea element', () => {
    fixture.componentRef.setInput('enableCharacterCounter', true);
    fixture.componentRef.setInput('enableWordCounter', true);
    fixture.componentRef.setInput('maxLength', 50);
    fixture.componentRef.setInput('maxWords', 5);
    fixture.detectChanges();

    const characterCounter: HTMLElement = fixture.nativeElement.querySelector('character-counter');
    const wordCounter: HTMLElement = fixture.nativeElement.querySelector('dd-word-counter');

    expect(characterCounter.closest('textarea')).toBeNull();
    expect(characterCounter.textContent?.trim()).toBe('15 / 50');
    expect(wordCounter.textContent?.trim()).toBe('3 / 5');
    expect(component.displayWordCounterWarning).toBe(false);
  });

  it('should show the word counter warning above maxWords', () => {
    fixture.componentRef.setInput('enableWordCounter', true);
    fixture.componentRef.setInput('maxWords', 2);
    fixture.detectChanges();

    expect(component.displayWordCounterWarning).toBe(true);
  });
});
