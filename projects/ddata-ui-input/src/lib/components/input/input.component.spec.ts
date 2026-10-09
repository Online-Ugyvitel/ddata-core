import 'zone.js/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  DdataCoreModule,
  ValidatorService,
  BaseModel,
  BaseModelInterface,
  FieldsInterface,
  FieldContainerInterface
} from 'ddata-core';
import { DdataInputComponent } from './input.component';
import { InputHelperService } from '../../services/input/helper/input-helper.service';
import { CharacterCounterComponent } from '../character-counter/character-counter.component';
import { WordCounterComponent } from '../word-counter/word-counter.component';

declare const document: Document;

class FakeModel
  extends BaseModel
  implements
    BaseModelInterface<unknown>,
    FieldsInterface<HasTextFieldInterface>,
    HasTextFieldInterface
{
  textField = 'Hello Dolly';
  is_inactive = false;
  name = 'Test Name';
  fields: FieldContainerInterface<HasTextFieldInterface> = {
    textField: {
      title: 'testField - test title',
      label: 'testField - test label',
      placeholder: 'testField - test placeholder'
    },
    is_inactive: {
      title: 'Inaktív',
      label: 'Inaktív',
      placeholder: 'Inaktív'
    },
    name: {
      title: 'Címke neve',
      label: 'Címke neve',
      placeholder: 'Címke neve'
    }
  };
}

interface HasTextFieldInterface {
  textField: string;
  is_inactive?: boolean;
  name?: string;
}

describe('InputBoxComponent', () => {
  let component: DdataInputComponent;
  let fixture: ComponentFixture<DdataInputComponent>;
  let debugElement;
  let element;

  beforeEach(() => {
    // Mock injector service
    const mockInjector = {
      get: jasmine.createSpy('get').and.returnValue({
        validateFieldValue: jasmine.createSpy('validateFieldValue').and.returnValue([]),
        createUniqueId: jasmine.createSpy('createUniqueId').and.returnValue('test-id-123'),
        randChars: jasmine.createSpy('randChars').and.returnValue('test-random-chars'),
        getTitle: jasmine.createSpy('getTitle').and.callFake((model, field) => {
          if (field === 'name') return 'Címke neve';

          return 'Inaktív';
        }),
        getLabel: jasmine.createSpy('getLabel').and.callFake((model, field) => {
          if (field === 'name') return 'Címke neve';

          return 'Inaktív';
        }),
        getPlaceholder: jasmine.createSpy('getPlaceholder').and.callFake((model, field) => {
          if (field === 'name') return 'Címke neve';

          return 'Inaktív';
        }),
        getPrepend: jasmine.createSpy('getPrepend').and.returnValue(''),
        getAppend: jasmine.createSpy('getAppend').and.returnValue(''),
        isRequired: jasmine.createSpy('isRequired').and.returnValue(false),
        validateField: jasmine.createSpy('validateField').and.returnValue(true)
      })
    };

    // Set up the mock injector before TestBed configuration
    Object.defineProperty(DdataCoreModule, 'InjectorInstance', {
      value: mockInjector,
      writable: true
    });

    TestBed.configureTestingModule({
      declarations: [DdataInputComponent],
      providers: [
        Injector,
        ValidatorService,
        BaseModel,
        { provide: InputHelperService, useValue: mockInjector.get() }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataInputComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('model property should not change anything if the value is null', () => {
    component._model = new BaseModel();
    component.model = null;

    expect(component._model).toEqual(new BaseModel());

    component._field = 'is_inactive';
    component._model = new BaseModel();
    component.model = new FakeModel();

    expect(component._model).toEqual(new FakeModel());
    expect(component._model.fields[component._field].title).toBe('Inaktív');
    expect(component._model.fields[component._field].placeholder).toBe('Inaktív');
    expect(component._model.fields[component._field].label).toBe('Inaktív');
    expect(component._isRequired).toBe(false);

    component._model = new BaseModel();
    component._field = 'name';
    component.model = new FakeModel();

    expect(component._model).toEqual(new FakeModel());
    expect(component._model.fields[component._field].title).toBe('Címke neve');
    expect(component._model.fields[component._field].placeholder).toBe('Címke neve');
    expect(component._model.fields[component._field].label).toBe('Címke neve');
    expect(component._isRequired).toBe(false);
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

describe('DdataInputComponent counters', () => {
  let fixture: ComponentFixture<DdataInputComponent>;
  let component: DdataInputComponent;

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
      declarations: [DdataInputComponent, CharacterCounterComponent, WordCounterComponent],
      imports: [FormsModule],
      providers: [{ provide: InputHelperService, useValue: mockHelper }]
    }).compileComponents();

    fixture = TestBed.createComponent(DdataInputComponent);
    component = fixture.componentInstance;

    const model = new FakeModel();

    model.textField = 'alpha, beta, gamma';
    component.field = 'textField';
    component.model = model as BaseModelInterface<unknown> & FieldsInterface<unknown>;
  });

  it('should not render counters by default', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('character-counter')).toBeNull();
    expect(fixture.nativeElement.querySelector('dd-word-counter')).toBeNull();
  });

  it('should render the character count of the field value', () => {
    fixture.componentRef.setInput('enableCharacterCounter', true);
    fixture.componentRef.setInput('maxLength', 100);
    fixture.detectChanges();

    const counter: HTMLElement = fixture.nativeElement.querySelector('character-counter');

    expect(counter.textContent?.trim()).toBe('18 / 100');
  });

  it('should render the word count and show the warning above maxWords', () => {
    fixture.componentRef.setInput('enableWordCounter', true);
    fixture.componentRef.setInput('maxWords', 2);
    fixture.componentRef.setInput('wordCounterWarningMessage', 'Too many words');
    fixture.detectChanges();

    const counter: HTMLElement = fixture.nativeElement.querySelector('dd-word-counter');

    expect(counter.textContent?.trim()).toBe('3 / 2');
    expect(component.displayWordCounterWarning).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Too many words');
  });

  it('should not show the word counter warning within maxWords', () => {
    fixture.componentRef.setInput('enableWordCounter', true);
    fixture.componentRef.setInput('maxWords', 3);
    fixture.componentRef.setInput('wordCounterWarningMessage', 'Too many words');
    fixture.detectChanges();

    expect(component.isWordLimitExceeded).toBe(false);
    expect(fixture.nativeElement.textContent).not.toContain('Too many words');
  });
});
