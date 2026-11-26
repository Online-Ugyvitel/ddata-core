// @ts-nocheck -- generated spec uses loosely typed mock models, events and private members
import { EventEmitter, Injector, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { By } from '@angular/platform-browser';
import {
  DdataCoreModule,
  ValidatorService,
  BaseModel,
  BaseModelInterface,
  FieldsInterface,
  FieldContainerInterface
} from '@netdjw/ddata-core';
import { DdataInputComponent } from './input.component';
import { CharacterCounterComponent } from '../character-counter/character-counter.component';
import { WordCounterComponent } from '../word-counter/word-counter.component';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

class FakeModel
  extends BaseModel
  implements BaseModelInterface<any>, FieldsInterface<HasTextField>, HasTextField
{
  textField = 'Hello Dolly';
  testField = 'Test Value';
  is_inactive = false;
  name = 'Test Name';

  fields: FieldContainerInterface<HasTextField> = {
    textField: {
      title: 'textField - test title',
      label: 'textField - test label',
      placeholder: 'textField - test placeholder'
    },
    testField: {
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

  validationRules = {
    textField: ['maxLength:255'],
    testField: ['maxLength:255'],
    is_inactive: ['boolean'],
    name: ['required', 'maxLength:255']
  };
}

interface HasTextField {
  textField: string;
  testField: string;
  is_inactive: boolean;
  name: string;
}

describe('InputBoxComponent', () => {
  let component: DdataInputComponent;
  let fixture: ComponentFixture<DdataInputComponent>;
  let debugElement;
  let element;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DdataInputComponent, CharacterCounterComponent, WordCounterComponent],
      imports: [FormsModule, FontAwesomeModule],
      providers: [Injector, ValidatorService, BaseModel, InputHelperService]
    }).compileComponents();
  });

  beforeEach(() => {
    DdataCoreModule.InjectorInstance = {
      get: (token: never) => TestBed.inject(token)
    };
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
    expect(component._isRequired).toBe(true);
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

  // Test ngAfterViewInit lifecycle hook
  it('should focus input element when autoFocus is true in ngAfterViewInit', () => {
    component.autoFocus = true;
    const mockElement = { focus: vi.fn().mockName('focus') };

    component.inputBox = { nativeElement: mockElement } as ElementRef;

    component.ngAfterViewInit();

    expect(mockElement.focus).toHaveBeenCalled();
  });

  it('should not focus input element when autoFocus is false in ngAfterViewInit', () => {
    component.autoFocus = false;
    const mockElement = { focus: vi.fn().mockName('focus') };

    component.inputBox = { nativeElement: mockElement } as ElementRef;

    component.ngAfterViewInit();

    expect(mockElement.focus).not.toHaveBeenCalled();
  });

  // Test validateField method
  it('should call validateField and emit changed event when validation passes', () => {
    vi.spyOn(component.changed, 'emit').mockReturnValue(undefined);
    vi.spyOn(component.helperService, 'validateField').mockReturnValue(true);
    component._model = new FakeModel();
    component._field = 'textField';

    component.validateField();

    expect(component.helperService.validateField).toHaveBeenCalledWith(
      component._model,
      component._field
    );

    expect(component.changed.emit).toHaveBeenCalledWith(component._model);
  });

  it('should call validateField and not emit changed event when validation fails', () => {
    vi.spyOn(component.changed, 'emit').mockReturnValue(undefined);
    vi.spyOn(component.helperService, 'validateField').mockReturnValue(false);
    component._model = new FakeModel();
    component._field = 'textField';

    component.validateField();

    expect(component.helperService.validateField).toHaveBeenCalledWith(
      component._model,
      component._field
    );

    expect(component.changed.emit).not.toHaveBeenCalled();
  });

  // Test setWordCounterWarning method
  it('should set displayWordCounterWarning to true when setWordCounterWarning is called with true', () => {
    component.setWordCounterWarning(true);

    expect(component.displayWordCounterWarning).toBe(true);
  });

  it('should set displayWordCounterWarning to false when setWordCounterWarning is called with false', () => {
    component.setWordCounterWarning(false);

    expect(component.displayWordCounterWarning).toBe(false);
  });

  // Test model getter
  it('should return the internal _model via getter', () => {
    const testModel = new FakeModel();

    component._model = testModel;

    expect(component.model).toBe(testModel);
  });

  // Test model setter comprehensive error scenarios
  it('should log error and return early when model is null', () => {
    vi.spyOn(console, 'error').mockReturnValue(undefined);
    const originalModel = component._model;

    component.model = null;

    expect(console.error).toHaveBeenCalledWith('The input-box component get undefined model');
    expect(component._model).toBe(originalModel);
  });

  it('should log error and return early when model fields is undefined', () => {
    vi.spyOn(console, 'error').mockReturnValue(undefined);
    const modelWithoutFields = new BaseModel();

    modelWithoutFields.fields = undefined;

    component.model = modelWithoutFields;

    expect(console.error).toHaveBeenCalledWith(
      `Your ${modelWithoutFields.model_name}'s 'fields' field is`,
      undefined
    );
  });

  it('should log error and return early when model field is undefined', () => {
    vi.spyOn(console, 'error').mockReturnValue(undefined);
    const model = new FakeModel();

    component._field = 'nonExistentField';

    component.model = model;

    expect(console.error).toHaveBeenCalledWith(
      `The ${model.model_name}'s nonExistentField field is `,
      undefined
    );
  });

  it('should set helper service values when model and field are valid', () => {
    vi.spyOn(component.helperService, 'getTitle').mockReturnValue('Test Title');
    vi.spyOn(component.helperService, 'getPlaceholder').mockReturnValue('Test Placeholder');
    vi.spyOn(component.helperService, 'getPrepend').mockReturnValue('Test Prepend');
    vi.spyOn(component.helperService, 'getAppend').mockReturnValue('Test Append');
    vi.spyOn(component.helperService, 'getLabel').mockReturnValue('Test Label');
    vi.spyOn(component.helperService, 'isRequired').mockReturnValue(true);
    const model = new FakeModel();

    component._field = 'textField';
    component.model = model;

    expect(component.helperService.getTitle).toHaveBeenCalledWith(model, 'textField');
    expect(component.helperService.getPlaceholder).toHaveBeenCalledWith(model, 'textField');
    expect(component.helperService.getPrepend).toHaveBeenCalledWith(model, 'textField');
    expect(component.helperService.getAppend).toHaveBeenCalledWith(model, 'textField');
    expect(component.helperService.getLabel).toHaveBeenCalledWith(model, 'textField');
    expect(component.helperService.isRequired).toHaveBeenCalledWith(model, 'textField');

    expect(component._title).toBe('Test Title');
    expect(component._placeholder).toBe('Test Placeholder');
    expect(component._prepend).toBe('Test Prepend');
    expect(component._append).toBe('Test Append');
    expect(component._label).toBe('Test Label');
    expect(component._isRequired).toBe(true);
  });

  it('should not call isRequired when validationRules field is missing', () => {
    vi.spyOn(component.helperService, 'isRequired').mockReturnValue(undefined);
    const model = new FakeModel();

    delete model.validationRules['textField'];
    component._field = 'textField';
    component.model = model;

    expect(component.helperService.isRequired).not.toHaveBeenCalled();
  });

  // Test component initialization and default values
  it('should initialize with default values', () => {
    expect(component.disabled).toBe(false);
    expect(component.isViewOnly).toBe(false);
    expect(component.type).toBe('text');
    expect(component.inputClass).toBe('form-control');
    expect(component.labelClass).toBe('form-label');
    expect(component.inputBlockClass).toBe('dd-field-control');
    expect(component.inputBlockExtraClass).toBe('');
    expect(component.viewOnlyClass).toBe('form-control border-0 bg-body-tertiary');
    expect(component.wrapperClass).toBe('dd-field');
    expect(component.showLabel).toBe(true);
    expect(component.autoFocus).toBe(false);
    expect(component.enableCharacterCounter).toBe(false);
    expect(component.enableWordCounter).toBe(false);
    expect(component.maxLength).toBe(255);
    expect(component.maxWords).toBe(7);
    expect(component.wordCounterWarningMessage).toBe('');
    expect(component.displayWordCounterWarning).toBe(false);
  });

  it('should initialize random string property', () => {
    expect(component.random).toBeDefined();
    expect(typeof component.random).toBe('string');
    expect(component.random.length).toBeGreaterThan(0);
  });

  // Test all input setters edge cases
  it('should handle undefined values in field setter', () => {
    component.field = undefined;

    expect(component._field).toBe(undefined);
  });

  it('should handle undefined values in append setter', () => {
    component.append = undefined;

    expect(component._append).toBe(undefined);
  });

  it('should handle undefined values in prepend setter', () => {
    component.prepend = undefined;

    expect(component._prepend).toBe(undefined);
  });

  it('should handle undefined values in labelText setter', () => {
    component.labelText = undefined;

    expect(component._label).toBe(undefined);
  });

  // Test EventEmitter initialization
  it('should initialize EventEmitters', () => {
    expect(component.changed).toBeDefined();
    expect(component.maxLengthReached).toBeDefined();
    expect(component.changed instanceof EventEmitter).toBe(true);
    expect(component.maxLengthReached instanceof EventEmitter).toBe(true);
  });

  // Test private properties initialization
  it('should initialize private properties with default values', () => {
    expect(component._field).toBe('');
    expect(component._title).toBe('');
    expect(component._label).toBe('');
    expect(component._placeholder).toBe('');
    expect(component._prepend).toBe('');
    expect(component._append).toBe('');
    expect(component._max).toBe('');
    expect(component._isRequired).toBe(false);
    expect(component._model).toEqual(new BaseModel());
  });

  // Test helperService initialization
  it('should initialize helperService', () => {
    expect(component.helperService).toBeDefined();
    expect(component.helperService).toEqual(expect.any(InputHelperService));
  });

  // Test model setter when fields exist but validationRules don't exist for field
  it('should handle model setter when validationRules is missing for field', () => {
    const model = new FakeModel();

    component._field = 'textField';

    // Remove validation rules for this field
    delete model.validationRules['textField'];

    component.model = model;

    // Should still set the helper service values but not call isRequired
    expect(component._model).toBe(model);
  });

  // Test model setter when validationRules exist but field doesn't exist in validationRules
  it('should not call isRequired when validationRules field does not exist', () => {
    vi.spyOn(component.helperService, 'isRequired').mockReturnValue(undefined);
    const model = new FakeModel();

    component._field = 'nonExistentValidationField';

    component.model = model;

    expect(component.helperService.isRequired).not.toHaveBeenCalled();
  });

  // Test edge case where model and fields exist but _field is empty
  it('should handle model setter when _field is empty', () => {
    vi.spyOn(console, 'error').mockReturnValue(undefined);
    const model = new FakeModel();

    component._field = '';

    component.model = model;

    expect(console.error).toHaveBeenCalledWith(`The ${model.model_name}'s  field is `, undefined);
  });

  // Test edge case where model.validationRules is undefined
  it('should handle model setter when validationRules is undefined', () => {
    const model = new FakeModel();

    model.validationRules = undefined;
    component._field = 'textField';

    // Should not throw error and should not call isRequired
    expect(() => (component.model = model)).not.toThrow();
  });

  // Test constructor
  it('should create component via constructor', () => {
    const newComponent = new DdataInputComponent();

    expect(newComponent).toBeTruthy();
  });

  // Test when autoFocus is true but inputBox is undefined
  it('should handle ngAfterViewInit when inputBox is undefined', () => {
    component.autoFocus = true;
    component.inputBox = undefined;

    expect(() => component.ngAfterViewInit()).not.toThrow();
  });
  describe('rendering', () => {
    const render = (inputs: Record<string, unknown>): void => {
      Object.entries(inputs).forEach(([key, value]) => fixture.componentRef.setInput(key, value));
      fixture.detectChanges();
    };
    const input = (): HTMLInputElement => element.querySelector('input');
    const type = (value: string): void => {
      input().value = value;
      input().dispatchEvent(new Event('input'));
      input().dispatchEvent(new KeyboardEvent('keyup'));
      fixture.detectChanges();
    };

    it('should render the label with the required mark from the model', () => {
      render({ field: 'name', model: new FakeModel() });
      const label: HTMLLabelElement = element.querySelector('label');

      expect(label.textContent).toContain('Címke neve');
      expect(label.textContent).not.toContain(':');
      expect(label.querySelector('span').textContent).toBe(' *');
      expect(label.querySelector('span').getAttribute('aria-hidden')).toBe('true');
      expect(label.getAttribute('for')).toBe(input().id);
      expect(input().placeholder).toBe('Címke neve');
      expect(input().title).toBe('Címke neve');
    });

    it('should not render the required mark for an optional field', () => {
      render({ field: 'textField', model: new FakeModel() });

      expect(element.querySelector('label span')).toBeNull();
    });

    it('should render nothing from the model for a field without description', () => {
      vi.spyOn(console, 'error').mockReturnValue(undefined);
      render({ field: 'missing', model: new FakeModel() });

      expect(element.querySelector('label').textContent.trim()).toBe('');
      expect(input().placeholder).toBe('');
      expect(console.error).toHaveBeenCalledWith(
        `The ${new FakeModel().model_name}'s missing field is `,
        undefined
      );
    });

    it('should render the prepend and the append texts and follow their changes', () => {
      render({ field: 'name', model: new FakeModel(), prepend: 'Ft', append: '%' });
      const affixes = (): Array<string> =>
        Array.from(element.querySelectorAll('.dd-control > .dd-control-affix')).map((affix) =>
          (affix as HTMLElement).textContent.trim()
        );

      expect(affixes()).toEqual(['Ft', '%']);

      render({ prepend: 'EUR', append: 'db', labelText: 'Új címke' });

      expect(affixes()).toEqual(['EUR', 'db']);
      expect(element.querySelector('label').textContent).toContain('Új címke');
    });

    it('should not render empty prepend, append and the hidden label', () => {
      render({ field: 'name', model: new FakeModel(), showLabel: false });

      expect(element.querySelector('label')).toBeNull();
      expect(element.querySelector('.dd-field-label-row')).toBeNull();
      expect(element.querySelector('.dd-control-affix')).toBeNull();
    });

    it('should disable the input', async () => {
      render({ field: 'name', model: new FakeModel(), disabled: true });
      await fixture.whenStable();
      fixture.detectChanges();

      expect(input().disabled).toBe(true);
    });

    it('should render the value as text in view only mode', () => {
      const model = new FakeModel();

      render({ field: 'name', model, isViewOnly: true });

      expect(input()).toBeNull();
      expect(element.querySelector('.bg-body-tertiary').textContent.trim()).toBe('Test Name');
      const updated = new FakeModel();

      updated.name = 'Updated';
      render({ model: updated });

      expect(element.querySelector('.bg-body-tertiary').textContent.trim()).toBe('Updated');
    });

    it('should show and hide the validation error while typing', async () => {
      const model = new FakeModel();
      const changed = vi.fn();

      model.validationRules.name = ['required'];

      component.changed.subscribe(changed);
      render({ field: 'name', model });
      await fixture.whenStable();

      type('');

      expect(model.validationErrors).toEqual(['name']);
      expect(input().classList).not.toContain('invalid');
      expect(element.querySelector('.dd-control').classList).toContain('is-invalid');
      expect(changed).not.toHaveBeenCalled();

      type('Valid name');

      expect(model.name).toBe('Valid name');
      expect(model.validationErrors).toEqual([]);
      expect(element.querySelector('.dd-control').classList).not.toContain('is-invalid');
      expect(changed).toHaveBeenCalledExactlyOnceWith(model);
    });

    it('should focus the input when autoFocus is set', () => {
      render({ field: 'name', model: new FakeModel(), autoFocus: true });

      expect(document.activeElement).toBe(input());
    });

    it('should not focus the input without autoFocus', () => {
      render({ field: 'name', model: new FakeModel() });

      expect(document.activeElement).not.toBe(input());
    });

    it('should render the character counter', async () => {
      render({
        field: 'name',
        model: new FakeModel(),
        enableCharacterCounter: true,
        maxLength: 20
      });
      await fixture.whenStable();
      fixture.detectChanges();

      expect(element.querySelector('character-counter').textContent.trim()).toBe('9 / 20');
    });

    describe('word counter', () => {
      const keywords = (value: string): FakeModel => {
        const model = new FakeModel();

        model.name = value;

        return model;
      };
      const warning = (): HTMLElement => element.querySelector('.alert-warning');

      it('should not warn at the limit', () => {
        render({
          field: 'name',
          model: keywords('a,b,c'),
          enableWordCounter: true,
          maxWords: 3,
          wordCounterWarningMessage: 'Too many keywords'
        });

        expect(component.isWordLimitExceeded).toBe(false);
        expect(warning()).toBeNull();
        expect(element.querySelector('dd-word-counter').textContent.trim()).toBe('3 / 3');
      });

      it('should warn over the limit and stop warning when it is fixed', () => {
        render({
          field: 'name',
          model: keywords('a,b,c,d'),
          enableWordCounter: true,
          maxWords: 3,
          wordCounterWarningMessage: 'Too many keywords'
        });

        expect(component.isWordLimitExceeded).toBe(true);
        expect(component.displayWordCounterWarning).toBe(true);
        expect(warning().textContent.trim()).toBe('Too many keywords');

        render({ model: keywords('a,b') });

        expect(component.isWordLimitExceeded).toBe(false);
        expect(warning()).toBeNull();
      });

      it('should not warn without a message', () => {
        render({ field: 'name', model: keywords('a,b,c,d'), enableWordCounter: true, maxWords: 3 });

        expect(component.isWordLimitExceeded).toBe(true);
        expect(warning()).toBeNull();
      });

      it('should never be exceeded without limit or when the counter is disabled', () => {
        render({ field: 'name', model: keywords('a,b,c,d'), enableWordCounter: true, maxWords: 0 });

        expect(component.isWordLimitExceeded).toBe(false);

        render({ enableWordCounter: false, maxWords: 3 });

        expect(component.isWordLimitExceeded).toBe(false);
      });

      it('should not be exceeded for an empty value', () => {
        render({ field: 'name', model: keywords(''), enableWordCounter: true, maxWords: 3 });

        expect(component.isWordLimitExceeded).toBe(false);
      });
    });
  });

  describe('form field skeleton', () => {
    const render = (inputs: Record<string, unknown>): void => {
      Object.entries(inputs).forEach(([key, value]) => fixture.componentRef.setInput(key, value));
      fixture.detectChanges();
    };
    const input = (): HTMLInputElement => element.querySelector('input');
    const describedBy = (): Array<string> =>
      (input().getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
    const invalidModel = (): FakeModel => {
      const model = new FakeModel();

      model.fields.name.help = 'Ebből találja meg a vásárló.';
      model.name = '';
      model.validationErrors = ['name'];

      return model;
    };

    it('should render the label above the control, without a colon, before the .dd-control', () => {
      render({ field: 'name', model: new FakeModel() });
      const wrapper: HTMLElement = element.firstElementChild;
      const label: HTMLLabelElement = element.querySelector('label.form-label');

      expect(wrapper.classList).toContain('dd-field');
      expect(wrapper.firstElementChild.classList).toContain('dd-field-label-row');
      expect(label.textContent.replace(/\s+/g, ' ').trim()).toBe('Címke neve *');
      expect(label.compareDocumentPosition(element.querySelector('.dd-control'))).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
      expect(
        element.querySelector('.dd-field-control .dd-control input.dd-control-input')
      ).not.toBeNull();
    });

    it('should mark a required field with aria-required and keep the asterisk out of the name', () => {
      render({ field: 'name', model: new FakeModel() });

      expect(input().getAttribute('aria-required')).toBe('true');
      expect(element.querySelector('.dd-required').getAttribute('aria-hidden')).toBe('true');

      render({ field: 'textField', model: new FakeModel() });

      expect(input().hasAttribute('aria-required')).toBe(false);
    });

    it('should render the help text of the input over the help of the model', () => {
      const model = new FakeModel();

      model.fields.name.help = 'Súgó a modellből';
      render({ field: 'name', model });
      const help: HTMLElement = element.querySelector('.form-text');

      expect(help.textContent.trim()).toBe('Súgó a modellből');
      expect(describedBy()).toEqual([help.id]);

      render({ helpText: 'Súgó a sablonból' });

      expect(element.querySelector('.form-text').textContent.trim()).toBe('Súgó a sablonból');
    });

    it('should not render an empty help text and should not reference it', () => {
      render({ field: 'name', model: new FakeModel(), helpText: '' });

      expect(element.querySelector('.form-text')).toBeNull();
      expect(input().hasAttribute('aria-describedby')).toBe(false);
    });

    it('should render the message of the model with an icon for an invalid field', () => {
      const model = invalidModel();

      render({ field: 'name', model });
      const error: HTMLElement = element.querySelector('.invalid-feedback.d-flex');

      expect(error.textContent.trim()).toBe(model.getFieldErrorMessage('name'));
      expect(error.textContent.trim()).not.toBe('');
      expect(error.querySelector('fa-icon').getAttribute('aria-hidden')).toBe('true');
      expect(input().getAttribute('aria-invalid')).toBe('true');
      expect(element.querySelector('.dd-control').classList).toContain('is-invalid');
      expect(describedBy()).toEqual([element.querySelector('.form-text').id, error.id]);
    });

    it('should let errorText override the message and append the suggestion after a space', () => {
      render({
        field: 'name',
        model: invalidModel(),
        errorText: 'Add meg a nevet.',
        errorSuggestion: 'Javaslat: „Név – 2. résztvevő”.'
      });

      expect(element.querySelector('.invalid-feedback span').textContent).toBe(
        'Add meg a nevet. Javaslat: „Név – 2. résztvevő”.'
      );
    });

    it('should only mark the border when no message exists', () => {
      const model = invalidModel();

      model.getFieldErrorMessage = undefined;
      render({ field: 'name', model });

      expect(element.querySelector('.invalid-feedback')).toBeNull();
      expect(input().getAttribute('aria-invalid')).toBe('true');
      expect(element.querySelector('.dd-control').classList).toContain('is-invalid');
    });

    it('should not render an error for a valid field', () => {
      render({ field: 'name', model: new FakeModel(), errorText: 'Nem látszhat' });

      expect(element.querySelector('.invalid-feedback')).toBeNull();
      expect(input().hasAttribute('aria-invalid')).toBe(false);
    });

    it('should render the character counter in the label row by default as "N / M"', () => {
      render({
        field: 'name',
        model: new FakeModel(),
        enableCharacterCounter: true,
        maxLength: 20
      });
      const counter: HTMLElement = element.querySelector('.dd-field-label-row character-counter');

      expect(counter.classList).toContain('dd-field-counter');
      expect(counter.textContent.trim()).toBe('9 / 20');
      expect(describedBy()).toEqual([counter.id]);
    });

    it('should render the counter inside the control for counterPlacement="control"', () => {
      render({
        field: 'name',
        model: new FakeModel(),
        enableCharacterCounter: true,
        enableWordCounter: true,
        counterPlacement: 'control'
      });

      expect(element.querySelector('.dd-field-label-row character-counter')).toBeNull();
      expect(element.querySelector('.dd-control character-counter')).not.toBeNull();
      expect(element.querySelector('.dd-control dd-word-counter')).not.toBeNull();
      expect(describedBy().length).toBe(2);
    });

    it('should render the counter inside the control without a label', () => {
      render({
        field: 'name',
        model: new FakeModel(),
        enableCharacterCounter: true,
        showLabel: false
      });

      expect(element.querySelector('.dd-control character-counter')).not.toBeNull();
    });

    it('should mark the counter when the max length is exceeded', async () => {
      const model = new FakeModel();

      model.name = 'x'.repeat(262);
      render({ field: 'name', model, enableCharacterCounter: true, maxLength: 255 });
      await fixture.whenStable();
      fixture.detectChanges();

      expect(element.querySelector('.dd-counter-exceeded').textContent.trim()).toBe('262 / 255');
    });

    it('should render the small size and the inline layout', () => {
      render({ field: 'name', model: new FakeModel(), size: 'sm', layout: 'inline' });

      expect(element.querySelector('.dd-control').classList).toContain('dd-control-sm');
      expect(element.firstElementChild.classList).toContain('dd-field-inline');

      render({ size: 'md', layout: 'stacked' });

      expect(element.querySelector('.dd-control').classList).not.toContain('dd-control-sm');
      expect(element.firstElementChild.classList).not.toContain('dd-field-inline');
    });

    it('should mark the control as disabled', () => {
      render({ field: 'name', model: new FakeModel(), disabled: true });

      expect(element.querySelector('.dd-control').classList).toContain('is-disabled');
    });

    it('should render no .dd-control in view only mode', () => {
      render({ field: 'name', model: new FakeModel(), isViewOnly: true, prepend: 'Ft' });

      expect(element.querySelector('.dd-control')).toBeNull();
      expect(element.querySelector('.dd-control-affix').textContent.trim()).toBe('Ft');
    });

    it('should apply the overridden legacy classes', () => {
      render({
        field: 'name',
        model: new FakeModel(),
        wrapperClass: 'my-wrapper',
        labelClass: 'my-label',
        inputBlockClass: 'my-block',
        inputBlockExtraClass: 'ignored'
      });

      expect(element.firstElementChild.classList).toContain('my-wrapper');
      expect(element.querySelector('label').classList).toContain('my-label');
      expect(element.querySelector('.my-block')).not.toBeNull();
      expect(element.querySelector('.ignored')).toBeNull();
    });

    it('should not throw without the field of the model', () => {
      vi.spyOn(console, 'error').mockReturnValue(undefined);
      const model = invalidModel();

      model.validationErrors = ['missing'];

      expect(() => render({ field: 'missing', model })).not.toThrow();
      expect(element.querySelector('.form-text')).toBeNull();
    });
  });
});
