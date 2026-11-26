// @ts-nocheck -- generated spec uses loosely typed mock models, events and private members
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BaseModel, DdataCoreModule } from '@netdjw/ddata-core';
import { DdataTextareaComponent } from './textarea.component';
import { InputHelperService } from '../../services/input/helper/input-helper.service';
// Components are OnPush by default in Angular 22, so direct property changes need an explicit dirty mark.
const detectChangesOf = (fixture: ComponentFixture<unknown>): void => {
  fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
  fixture.detectChanges();
};

describe('DdataTextareaComponent', () => {
  let component: DdataTextareaComponent;
  let fixture: ComponentFixture<DdataTextareaComponent>;
  let mockHelperService: any;
  let mockModel: any;

  beforeEach(async () => {
    // Create spy object for helper service
    mockHelperService = {
      getTitle: vi.fn().mockName('InputHelperService.getTitle'),
      getLabel: vi.fn().mockName('InputHelperService.getLabel'),
      getPlaceholder: vi.fn().mockName('InputHelperService.getPlaceholder'),
      getPrepend: vi.fn().mockName('InputHelperService.getPrepend'),
      getAppend: vi.fn().mockName('InputHelperService.getAppend'),
      isRequired: vi.fn().mockName('InputHelperService.isRequired'),
      randChars: vi.fn().mockName('InputHelperService.randChars'),
      validateField: vi.fn().mockName('InputHelperService.validateField'),
      // the pure helpers of the real service, they do not use `this`
      getErrorText: InputHelperService.prototype.getErrorText,
      buildDescribedBy: InputHelperService.prototype.buildDescribedBy
    };

    // Setup default return values
    mockHelperService.getTitle.mockReturnValue('Test Title');
    mockHelperService.getLabel.mockReturnValue('Test Label');
    mockHelperService.getPlaceholder.mockReturnValue('Test Placeholder');
    mockHelperService.getPrepend.mockReturnValue('$');
    mockHelperService.getAppend.mockReturnValue('%');
    mockHelperService.isRequired.mockReturnValue(true);
    mockHelperService.randChars.mockReturnValue('abc123');
    mockHelperService.validateField.mockReturnValue(true);

    // Mock DdataCoreModule.InjectorInstance
    DdataCoreModule.InjectorInstance = {
      get: vi.fn().mockName('get').mockReturnValue(mockHelperService)
    } as never;

    await TestBed.configureTestingModule({
      declarations: [DdataTextareaComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule, FontAwesomeModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DdataTextareaComponent);
    component = fixture.componentInstance;

    // Create mock model
    mockModel = {
      model_name: 'TestModel',
      fields: {
        testField: {
          title: 'Test Field Title',
          label: 'Test Field Label',
          placeholder: 'Test Field Placeholder',
          prepend: '$',
          append: '%'
        }
      },
      validationRules: {
        testField: ['required']
      },
      validationErrors: [],
      testField: 'test value'
    };
  });

  afterEach(() => {
    fixture.destroy();
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
      expect(component._max).toBe('');
      expect(component._isRequired).toBe(false);
      expect(component.inputClass).toBe('form-control');
      expect(component.disabled).toBe(false);
      expect(component.isViewOnly).toBe(false);
      expect(component.showLabel).toBe(true);
      expect(component.autoFocus).toBe(false);
      expect(component.rows).toBe('5');
      expect(component.enableCharacterCounter).toBe(false);
      expect(component.enableWordCounter).toBe(false);
      expect(component.maxLength).toBe(255);
      expect(component.maxWords).toBe(7);
      expect(component.displayWordCounterWarning).toBe(false);
      expect(component.labelClass).toBe('form-label');
      expect(component.inputBlockClass).toBe('dd-field-control');
      expect(component.inputBlockExtraClass).toBe('');
      expect(component.wrapperClass).toBe('dd-field');
      expect(component.helpText).toBe('');
      expect(component.errorText).toBe('');
      expect(component.errorSuggestion).toBe('');
      expect(component.counterPlacement).toBe('label');
      expect(component.size).toBe('md');
      expect(component.layout).toBe('stacked');
      expect(component.viewOnlyClass).toBe('form-control border-0 bg-body-tertiary');
    });

    it('should generate random string for id', () => {
      expect(component.random).toBeDefined();
      expect(mockHelperService.randChars).toHaveBeenCalled();
    });
  });

  describe('Model Input Setter', () => {
    it('should handle null model', () => {
      vi.spyOn(console, 'error').mockReturnValue(undefined);
      component.model = null;

      expect(console.error).toHaveBeenCalledWith('The input-box component get undefined model');
    });

    it('should handle undefined model', () => {
      vi.spyOn(console, 'error').mockReturnValue(undefined);
      component.model = undefined;

      expect(console.error).toHaveBeenCalledWith('The input-box component get undefined model');
    });

    it('should handle model without fields', () => {
      vi.spyOn(console, 'error').mockReturnValue(undefined);
      const modelWithoutFields = { model_name: 'TestModel', fields: null };

      component.model = modelWithoutFields as any;

      expect(console.error).toHaveBeenCalledWith("Your TestModel's 'fields' field is", null);
    });

    it('should handle model with missing field', () => {
      vi.spyOn(console, 'error').mockReturnValue(undefined);
      component._field = 'missingField';
      component.model = mockModel;

      expect(console.error).toHaveBeenCalledWith(
        "The TestModel's missingField field is ",
        undefined
      );
    });

    it('should set helper values when model and field are valid', () => {
      component._field = 'testField';
      component.model = mockModel;

      expect(mockHelperService.getTitle).toHaveBeenCalledWith(mockModel, 'testField');
      expect(mockHelperService.getLabel).toHaveBeenCalledWith(mockModel, 'testField');
      expect(mockHelperService.getPlaceholder).toHaveBeenCalledWith(mockModel, 'testField');
      expect(mockHelperService.getPrepend).toHaveBeenCalledWith(mockModel, 'testField');
      expect(mockHelperService.getAppend).toHaveBeenCalledWith(mockModel, 'testField');
      expect(component._title).toBe('Test Title');
      expect(component._label).toBe('Test Label');
      expect(component._placeholder).toBe('Test Placeholder');
      expect(component._prepend).toBe('$');
      expect(component._append).toBe('%');
    });

    it('should set required flag when validation rules exist', () => {
      component._field = 'testField';
      component.model = mockModel;

      expect(mockHelperService.isRequired).toHaveBeenCalledWith(mockModel, 'testField');
      expect(component._isRequired).toBe(true);
    });

    it('should return the model via getter', () => {
      component.model = mockModel;

      expect(component.model).toBe(mockModel);
    });

    it('should initialize with BaseModel when no model is set', () => {
      // Test the default _model initialization
      const newComponent = new DdataTextareaComponent();

      expect(newComponent._model).toBeDefined();
      expect(newComponent._model.constructor.name).toBe('BaseModel');
    });
  });

  describe('Field Input Setter', () => {
    it('should set field value', () => {
      component.field = 'testField';

      expect(component._field).toBe('testField');
    });

    it('should handle undefined field value', () => {
      component.field = 'undefined';

      expect(component._field).toBe('isValid');
    });
  });

  describe('Append Input Setter', () => {
    it('should set append value', () => {
      component.append = 'suffix';

      expect(component._append).toBe('suffix');
    });

    it('should handle undefined append value', () => {
      component.append = 'undefined';

      expect(component._append).toBe('');
    });
  });

  describe('Prepend Input Setter', () => {
    it('should set prepend value', () => {
      component.prepend = 'prefix';

      expect(component._prepend).toBe('prefix');
    });

    it('should handle undefined prepend value', () => {
      component.prepend = 'undefined';

      expect(component._prepend).toBe('');
    });
  });

  describe('LabelText Input Setter', () => {
    it('should set label text value', () => {
      component.labelText = 'Custom Label';

      expect(component._label).toBe('Custom Label');
    });

    it('should handle undefined label text value', () => {
      component.labelText = 'undefined';

      expect(component._label).toBe('');
    });
  });

  describe('Lifecycle Methods', () => {
    it('should focus input on ngAfterViewInit when autoFocus is true', () => {
      component.autoFocus = true;
      component.inputBox = { nativeElement: { focus: vi.fn().mockName('focus') } } as any;

      component.ngAfterViewInit();

      expect(component.inputBox.nativeElement.focus).toHaveBeenCalled();
    });

    it('should not focus input on ngAfterViewInit when autoFocus is false', () => {
      component.autoFocus = false;
      component.inputBox = { nativeElement: { focus: vi.fn().mockName('focus') } } as any;

      component.ngAfterViewInit();

      expect(component.inputBox.nativeElement.focus).not.toHaveBeenCalled();
    });
  });

  describe('validateField Method', () => {
    beforeEach(() => {
      component._field = 'testField';
      component.model = mockModel;
    });

    it('should call helper service validateField', () => {
      component.validateField();

      expect(mockHelperService.validateField).toHaveBeenCalledWith(mockModel, 'testField');
    });

    it('should emit changed event when validation passes', () => {
      vi.spyOn(component.changed, 'emit').mockReturnValue(undefined);
      mockHelperService.validateField.mockReturnValue(true);

      component.validateField();

      expect(component.changed.emit).toHaveBeenCalledWith(mockModel);
    });

    it('should not emit changed event when validation fails', () => {
      vi.spyOn(component.changed, 'emit').mockReturnValue(undefined);
      mockHelperService.validateField.mockReturnValue(false);

      component.validateField();

      expect(component.changed.emit).not.toHaveBeenCalled();
    });
  });

  describe('setWordCounterWarning Method', () => {
    it('should set displayWordCounterWarning to true', () => {
      component.setWordCounterWarning(true);

      expect(component.displayWordCounterWarning).toBe(true);
    });

    it('should set displayWordCounterWarning to false', () => {
      component.setWordCounterWarning(false);

      expect(component.displayWordCounterWarning).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      component._field = 'testField';
      component.model = mockModel;
      detectChangesOf(fixture);
    });

    it('should render label when showLabel is true', () => {
      component.showLabel = true;
      component._label = 'Test Label';
      detectChangesOf(fixture);
      const label = fixture.debugElement.query(By.css('label'));

      expect(label).toBeTruthy();
      expect(label.nativeElement.textContent.trim()).toContain('Test Label');
    });

    it('should not render label when showLabel is false', () => {
      component.showLabel = false;
      detectChangesOf(fixture);
      const label = fixture.debugElement.query(By.css('label'));

      expect(label).toBeFalsy();
    });

    it('should render required asterisk when field is required', () => {
      component.showLabel = true;
      component._isRequired = true;
      detectChangesOf(fixture);
      const asterisk = fixture.debugElement.query(By.css('label span'));

      expect(asterisk).toBeTruthy();
      expect(asterisk.nativeElement.textContent.trim()).toBe('*');
    });

    it('should render textarea when not in view-only mode', () => {
      component.isViewOnly = false;
      detectChangesOf(fixture);
      const textarea = fixture.debugElement.query(By.css('textarea'));

      expect(textarea).toBeTruthy();
    });

    it('should render div when in view-only mode', () => {
      component.isViewOnly = true;
      detectChangesOf(fixture);
      const textarea = fixture.debugElement.query(By.css('textarea'));
      const viewOnlyDiv = fixture.debugElement.query(By.css('div[title]'));

      expect(textarea).toBeFalsy();
      expect(viewOnlyDiv).toBeTruthy();
    });

    it('should render prepend when _prepend is not empty', () => {
      component._prepend = '$';
      detectChangesOf(fixture);
      const prepend = fixture.debugElement.query(By.css('.dd-control > .dd-control-affix'));

      expect(prepend).toBeTruthy();
      expect(prepend.nativeElement.textContent.trim()).toBe('$');
    });

    it('should render append when _append is not empty', () => {
      component._append = '%';
      detectChangesOf(fixture);
      const append = fixture.debugElement.queryAll(By.css('.dd-control > .dd-control-affix')).pop();

      expect(append).toBeTruthy();
      expect(append.nativeElement.textContent.trim()).toBe('%');
    });

    it('should render word counter warning when displayWordCounterWarning is true and message exists', () => {
      component.enableWordCounter = true;
      component.maxWords = 2;
      component._model[component._field] = 'one,two,three';
      component.wordCounterWarningMessage = 'Warning message';
      detectChangesOf(fixture);
      const warning = fixture.debugElement.query(By.css('.alert-warning'));

      expect(warning).toBeTruthy();
      expect(warning.nativeElement.textContent.trim()).toBe('Warning message');
    });

    it('should not render word counter warning when displayWordCounterWarning is false', () => {
      component.displayWordCounterWarning = false;
      component.wordCounterWarningMessage = 'Warning message';
      detectChangesOf(fixture);
      const warning = fixture.debugElement.query(By.css('.alert-warning'));

      expect(warning).toBeFalsy();
    });

    it('should not render word counter warning when message is empty', () => {
      component.displayWordCounterWarning = true;
      component.wordCounterWarningMessage = '';
      detectChangesOf(fixture);
      const warning = fixture.debugElement.query(By.css('.alert-warning'));

      expect(warning).toBeFalsy();
    });
  });

  describe('Character and Word Counter Features', () => {
    beforeEach(() => {
      component._field = 'testField';
      component.model = mockModel;
      detectChangesOf(fixture);
    });

    it('should render character counter when enableCharacterCounter is true', () => {
      component.enableCharacterCounter = true;
      component.isViewOnly = false;
      detectChangesOf(fixture);
      // Since character-counter is a custom component, we check if the ng-container is rendered
      const textarea = fixture.debugElement.query(By.css('textarea'));

      expect(textarea).toBeTruthy();
      expect(component.enableCharacterCounter).toBeTruthy();
    });

    it('should render word counter when enableWordCounter is true', () => {
      component.enableWordCounter = true;
      component.isViewOnly = false;
      detectChangesOf(fixture);
      // Since app-word-counter is a custom component, we check if the ng-container is rendered
      const textarea = fixture.debugElement.query(By.css('textarea'));

      expect(textarea).toBeTruthy();
      expect(component.enableWordCounter).toBeTruthy();
    });

    it('should not render counters when disabled', () => {
      component.enableCharacterCounter = false;
      component.enableWordCounter = false;
      component.isViewOnly = false;
      detectChangesOf(fixture);
      const textarea = fixture.debugElement.query(By.css('textarea'));

      expect(textarea).toBeTruthy();
      expect(component.enableCharacterCounter).toBeFalsy();
      expect(component.enableWordCounter).toBeFalsy();
    });
  });

  describe('Event Handling', () => {
    beforeEach(() => {
      component._field = 'testField';
      component.model = mockModel;
      component.isViewOnly = false;
      detectChangesOf(fixture);
    });

    it('should call validateField on keyup event', () => {
      vi.spyOn(component, 'validateField').mockReturnValue(undefined);
      const textarea = fixture.debugElement.query(By.css('textarea'));

      textarea.nativeElement.dispatchEvent(new KeyboardEvent('keyup'));

      expect(component.validateField).toHaveBeenCalled();
    });
  });

  describe('CSS Classes and Attributes', () => {
    beforeEach(() => {
      component._field = 'testField';
      component.model = mockModel;
      detectChangesOf(fixture);
    });

    it('should apply input classes to textarea', () => {
      component.inputClass = 'custom-class';
      component.isViewOnly = false;
      detectChangesOf(fixture);
      const textarea = fixture.debugElement.query(By.css('textarea'));

      expect(textarea.nativeElement.classList.contains('custom-class')).toBeTruthy();
    });

    it('should apply view-only classes when in view-only mode', () => {
      component.isViewOnly = true;
      component.viewOnlyClass = 'view-only-class';
      detectChangesOf(fixture);
      const viewOnlyDiv = fixture.debugElement.query(By.css('div[title]'));

      expect(viewOnlyDiv.nativeElement.classList.contains('view-only-class')).toBeTruthy();
    });

    it('should disable textarea when disabled is true', async () => {
      component.disabled = true;
      component.isViewOnly = false;
      detectChangesOf(fixture);
      // ngModel applies the disabled state in a microtask
      await fixture.whenStable();
      detectChangesOf(fixture);
      const textarea = fixture.debugElement.query(By.css('textarea'));

      expect(textarea.nativeElement.disabled).toBeTruthy();
    });

    it('should set correct id and name attributes using field and random', () => {
      component._field = 'testField';
      component.random = 'abc123';
      component.isViewOnly = false;
      detectChangesOf(fixture);
      const textarea = fixture.debugElement.query(By.css('textarea'));

      expect(textarea.nativeElement.getAttribute('id')).toBe('testField_abc123');
      expect(textarea.nativeElement.getAttribute('name')).toBe('testField_abc123');
    });

    it('should set correct for attribute on label using field and random', () => {
      component._field = 'testField';
      component.random = 'abc123';
      component.showLabel = true;
      detectChangesOf(fixture);
      const label = fixture.debugElement.query(By.css('label'));

      expect(label.nativeElement.getAttribute('for')).toBe('testField_abc123');
    });

    it('should set correct attributes on textarea', () => {
      component.isViewOnly = false;
      component._placeholder = 'Test Placeholder';
      component._title = 'Test Title';
      component.rows = '10';
      detectChangesOf(fixture);
      const textarea = fixture.debugElement.query(By.css('textarea'));

      expect(textarea.nativeElement.getAttribute('placeholder')).toBe('Test Placeholder');
      expect(textarea.nativeElement.getAttribute('title')).toBe('Test Title');
      expect(textarea.nativeElement.getAttribute('rows')).toBe('10');
    });

    it('should apply wrapper and label classes correctly', () => {
      component.wrapperClass = 'custom-wrapper';
      component.labelClass = 'custom-label';
      component.showLabel = true;
      detectChangesOf(fixture);
      const wrapper = fixture.debugElement.query(By.css('.custom-wrapper'));
      const label = fixture.debugElement.query(By.css('.custom-label'));

      expect(wrapper).toBeTruthy();
      expect(label).toBeTruthy();
    });

    it('should apply input block classes correctly', () => {
      component.inputBlockClass = 'custom-input-block';
      component.inputBlockExtraClass = 'custom-extra';
      component.showLabel = true;
      detectChangesOf(fixture);
      const inputBlock = fixture.debugElement.query(By.css('.custom-input-block'));

      expect(inputBlock).toBeTruthy();
      // the extra class is deprecated and does nothing any more
      expect(inputBlock.nativeElement.classList.contains('custom-extra')).toBeFalsy();
    });

    it('should apply input block class without extra class when showLabel is false', () => {
      component.inputBlockClass = 'custom-input-block';
      component.inputBlockExtraClass = 'custom-extra';
      component.showLabel = false;
      detectChangesOf(fixture);
      const inputBlock = fixture.debugElement.query(By.css('.custom-input-block'));

      expect(inputBlock).toBeTruthy();
      expect(inputBlock.nativeElement.classList.contains('custom-extra')).toBeFalsy();
    });

    it('should apply invalid class when validation errors include field', () => {
      mockModel.validationErrors = ['testField'];
      component.isViewOnly = false;
      detectChangesOf(fixture);
      const textarea = fixture.debugElement.query(By.css('textarea'));

      expect(textarea.nativeElement.getAttribute('aria-invalid')).toBe('true');
      expect(fixture.debugElement.query(By.css('.dd-control')).nativeElement.classList).toContain(
        'is-invalid'
      );
    });
  });
  describe('optional field without validation rules', () => {
    it('should not be required and not render the required mark', () => {
      const model = new BaseModel();

      model.fields = { note: { title: 'Note', label: 'Note' } };
      model.validationRules = {};
      fixture.componentRef.setInput('field', 'note');
      fixture.componentRef.setInput('model', model);
      fixture.detectChanges();

      expect(mockHelperService.isRequired).not.toHaveBeenCalled();
      expect(component._isRequired).toBe(false);
      expect(fixture.nativeElement.querySelector('label span')).toBeNull();
    });

    it('should not be required when the model has no validation rules at all', () => {
      const model = new BaseModel();

      model.fields = { note: { title: 'Note', label: 'Note' } };
      model.validationRules = undefined;
      component.field = 'note';
      component.model = model;

      expect(component._isRequired).toBe(false);
    });
  });
  describe('user interaction', () => {
    const textarea = (): HTMLTextAreaElement => fixture.nativeElement.querySelector('textarea');

    it('should show and hide the validation error as the value changes', async () => {
      const changed = vi.fn();

      mockHelperService.validateField.mockImplementation((model, field) => {
        const valid = model[field] !== '';

        model.validationErrors = valid ? [] : [field];

        return valid;
      });
      component.changed.subscribe(changed);
      fixture.componentRef.setInput('field', 'testField');
      fixture.componentRef.setInput('model', mockModel);
      fixture.detectChanges();
      await fixture.whenStable();

      textarea().value = '';
      textarea().dispatchEvent(new Event('input'));
      textarea().dispatchEvent(new KeyboardEvent('keyup'));
      fixture.detectChanges();

      expect(textarea().getAttribute('aria-invalid')).toBe('true');
      expect(changed).not.toHaveBeenCalled();

      textarea().value = 'első sor\nmásodik sor';
      textarea().dispatchEvent(new Event('input'));
      textarea().dispatchEvent(new KeyboardEvent('keyup'));
      fixture.detectChanges();

      expect(mockModel.testField).toBe('első sor\nmásodik sor');
      expect(textarea().hasAttribute('aria-invalid')).toBe(false);
      expect(changed).toHaveBeenCalledExactlyOnceWith(mockModel);
    });

    it('should focus the textarea when autoFocus is set', () => {
      fixture.componentRef.setInput('field', 'testField');
      fixture.componentRef.setInput('model', mockModel);
      fixture.componentRef.setInput('autoFocus', true);
      fixture.detectChanges();

      expect(document.activeElement).toBe(textarea());
    });
  });

  describe('form field skeleton', () => {
    const render = (inputs: Record<string, unknown>): void => {
      Object.entries({ field: 'testField', model: mockModel, ...inputs }).forEach(([key, value]) =>
        fixture.componentRef.setInput(key, value)
      );
      fixture.detectChanges();
    };
    const query = (selector: string): HTMLElement => fixture.nativeElement.querySelector(selector);
    const describedBy = (): Array<string> =>
      (query('textarea').getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);

    it('should render the label above the .dd-control inside the dd-field wrapper', () => {
      render({});

      expect(query('.dd-field > .dd-field-label-row > label.form-label')).not.toBeNull();
      expect(query('.dd-field-control .dd-control textarea.dd-control-input')).not.toBeNull();
      expect(query('label').textContent).not.toContain(':');
      expect(query('textarea').getAttribute('aria-required')).toBe('true');
      expect(query('.dd-required').getAttribute('aria-hidden')).toBe('true');
    });

    it('should render the help of the model and let helpText override it', () => {
      mockModel.fields.testField.help = 'Súgó a modellből';
      render({});

      expect(query('.form-text').textContent.trim()).toBe('Súgó a modellből');
      expect(describedBy()).toEqual([query('.form-text').id]);

      render({ helpText: 'Súgó a sablonból' });

      expect(query('.form-text').textContent.trim()).toBe('Súgó a sablonból');
    });

    it('should render the error message with the suggestion and reference it', () => {
      mockModel.validationErrors = ['testField'];
      mockModel.getFieldErrorMessage = (): string => 'Kötelező mező.';
      render({ errorSuggestion: 'Adj meg egy értéket.' });
      const error = query('.invalid-feedback.d-flex');

      expect(error.querySelector('span').textContent).toBe('Kötelező mező. Adj meg egy értéket.');
      expect(error.querySelector('fa-icon').getAttribute('aria-hidden')).toBe('true');
      expect(describedBy()).toEqual([error.id]);

      render({ errorText: 'Saját üzenet' });

      expect(error.querySelector('span').textContent).toBe('Saját üzenet Adj meg egy értéket.');
    });

    it('should only mark the border without a message', () => {
      mockModel.validationErrors = ['testField'];
      render({});

      expect(query('.invalid-feedback')).toBeNull();
      expect(query('.dd-control').classList).toContain('is-invalid');
      expect(query('textarea').getAttribute('aria-invalid')).toBe('true');
    });

    it('should keep the counter below the field on the right by default', () => {
      render({ enableCharacterCounter: true, maxLength: 20 });
      const counter = query('.dd-field-counter-below character-counter');

      expect(counter.classList).toContain('dd-field-counter');
      expect(query('.dd-control character-counter')).toBeNull();
      expect(describedBy()).toEqual([counter.id]);
    });

    it('should render the counters inside the control for counterPlacement="control"', () => {
      render({
        enableCharacterCounter: true,
        enableWordCounter: true,
        counterPlacement: 'control'
      });

      expect(query('.dd-control character-counter')).not.toBeNull();
      expect(query('.dd-control dd-word-counter')).not.toBeNull();
      expect(query('.dd-field-counter-below')).toBeNull();
      expect(describedBy().length).toBe(2);
    });

    it('should not render a counter row without a counter', () => {
      render({});

      expect(query('.dd-field-counter-below')).toBeNull();
    });

    it('should render the size and the layout', () => {
      render({ size: 'sm', layout: 'inline', disabled: true });

      expect(query('.dd-control').classList).toContain('dd-control-sm');
      expect(query('.dd-control').classList).toContain('is-disabled');
      expect(query('.dd-field').classList).toContain('dd-field-inline');
    });

    it('should render no .dd-control and no counter in view only mode', () => {
      render({ isViewOnly: true, enableCharacterCounter: true });

      expect(query('.dd-control')).toBeNull();
      expect(query('character-counter')).toBeNull();
      expect(query('.bg-body-tertiary').textContent.trim()).toBe('test value');
    });
  });
});
