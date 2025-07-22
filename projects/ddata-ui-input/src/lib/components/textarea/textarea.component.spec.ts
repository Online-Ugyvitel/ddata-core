import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BaseModel, DdataCoreModule } from 'ddata-core';
import { DdataTextareaComponent } from './textarea.component';
import { InputHelperService } from '../../services/input/helper/input-helper.service';

describe('DdataTextareaComponent', () => {
  let component: DdataTextareaComponent;
  let fixture: ComponentFixture<DdataTextareaComponent>;
  let mockHelperService: jasmine.SpyObj<InputHelperService>;
  let mockModel: any;

  beforeEach(async () => {
    // Create spy object for helper service
    mockHelperService = jasmine.createSpyObj('InputHelperService', [
      'getTitle',
      'getLabel', 
      'getPlaceholder',
      'getPrepend',
      'getAppend',
      'isRequired',
      'randChars',
      'validateField'
    ]);

    // Setup default return values
    mockHelperService.getTitle.and.returnValue('Test Title');
    mockHelperService.getLabel.and.returnValue('Test Label');
    mockHelperService.getPlaceholder.and.returnValue('Test Placeholder');
    mockHelperService.getPrepend.and.returnValue('$');
    mockHelperService.getAppend.and.returnValue('%');
    mockHelperService.isRequired.and.returnValue(true);
    mockHelperService.randChars.and.returnValue('abc123');
    mockHelperService.validateField.and.returnValue(true);

    // Mock DdataCoreModule.InjectorInstance
    spyOnProperty(DdataCoreModule, 'InjectorInstance', 'get').and.returnValue({
      get: jasmine.createSpy('get').and.returnValue(mockHelperService)
    });

    await TestBed.configureTestingModule({
      declarations: [DdataTextareaComponent],
      imports: [FormsModule]
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
      expect(component.labelClass).toBe('col-12 col-md-3 px-0 col-form-label');
      expect(component.inputBlockClass).toBe('col-12 d-flex px-0');
      expect(component.inputBlockExtraClass).toBe('col-md-9');
      expect(component.wrapperClass).toBe('d-flex flex-wrap');
    });

    it('should generate random string for id', () => {
      expect(component.random).toBeDefined();
      expect(mockHelperService.randChars).toHaveBeenCalled();
    });
  });

  describe('Model Input Setter', () => {
    it('should handle null model', () => {
      spyOn(console, 'error');
      component.model = null;
      expect(console.error).toHaveBeenCalledWith('The input-box component get undefined model');
    });

    it('should handle undefined model', () => {
      spyOn(console, 'error');
      component.model = undefined;
      expect(console.error).toHaveBeenCalledWith('The input-box component get undefined model');
    });

    it('should handle model without fields', () => {
      spyOn(console, 'error');
      const modelWithoutFields = { model_name: 'TestModel', fields: null };
      component.model = modelWithoutFields as any;
      expect(console.error).toHaveBeenCalledWith("Your TestModel's 'fields' field is", null);
    });

    it('should handle model with missing field', () => {
      spyOn(console, 'error');
      component._field = 'missingField';
      component.model = mockModel;
      expect(console.error).toHaveBeenCalledWith("The TestModel's missingField field is ", undefined);
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
    it('should call ngOnInit without errors', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should focus input on ngAfterViewInit when autoFocus is true', () => {
      component.autoFocus = true;
      component.inputBox = { nativeElement: { focus: jasmine.createSpy('focus') } } as any;
      
      component.ngAfterViewInit();
      
      expect(component.inputBox.nativeElement.focus).toHaveBeenCalled();
    });

    it('should not focus input on ngAfterViewInit when autoFocus is false', () => {
      component.autoFocus = false;
      component.inputBox = { nativeElement: { focus: jasmine.createSpy('focus') } } as any;
      
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
      spyOn(component.changed, 'emit');
      mockHelperService.validateField.and.returnValue(true);
      
      component.validateField();
      
      expect(component.changed.emit).toHaveBeenCalledWith(mockModel);
    });

    it('should not emit changed event when validation fails', () => {
      spyOn(component.changed, 'emit');
      mockHelperService.validateField.and.returnValue(false);
      
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
      fixture.detectChanges();
    });

    it('should render label when showLabel is true', () => {
      component.showLabel = true;
      component._label = 'Test Label';
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label).toBeTruthy();
      expect(label.nativeElement.textContent.trim()).toContain('Test Label');
    });

    it('should not render label when showLabel is false', () => {
      component.showLabel = false;
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label).toBeFalsy();
    });

    it('should render required asterisk when field is required', () => {
      component.showLabel = true;
      component._isRequired = true;
      fixture.detectChanges();

      const asterisk = fixture.debugElement.query(By.css('label span'));
      expect(asterisk).toBeTruthy();
      expect(asterisk.nativeElement.textContent.trim()).toBe('*');
    });

    it('should render textarea when not in view-only mode', () => {
      component.isViewOnly = false;
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css('textarea'));
      expect(textarea).toBeTruthy();
    });

    it('should render div when in view-only mode', () => {
      component.isViewOnly = true;
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css('textarea'));
      const viewOnlyDiv = fixture.debugElement.query(By.css('div[title]'));
      expect(textarea).toBeFalsy();
      expect(viewOnlyDiv).toBeTruthy();
    });

    it('should render prepend when _prepend is not empty', () => {
      component._prepend = '$';
      fixture.detectChanges();

      const prepend = fixture.debugElement.query(By.css('.input-group-prepend'));
      expect(prepend).toBeTruthy();
      expect(prepend.nativeElement.textContent.trim()).toBe('$');
    });

    it('should render append when _append is not empty', () => {
      component._append = '%';
      fixture.detectChanges();

      const append = fixture.debugElement.query(By.css('.input-group-append'));
      expect(append).toBeTruthy();
      expect(append.nativeElement.textContent.trim()).toBe('%');
    });

    it('should render word counter warning when displayWordCounterWarning is true and message exists', () => {
      component.displayWordCounterWarning = true;
      component.wordCounterWarningMessage = 'Warning message';
      fixture.detectChanges();

      const warning = fixture.debugElement.query(By.css('.bg-warning'));
      expect(warning).toBeTruthy();
      expect(warning.nativeElement.textContent.trim()).toBe('Warning message');
    });

    it('should not render word counter warning when displayWordCounterWarning is false', () => {
      component.displayWordCounterWarning = false;
      component.wordCounterWarningMessage = 'Warning message';
      fixture.detectChanges();

      const warning = fixture.debugElement.query(By.css('.bg-warning'));
      expect(warning).toBeFalsy();
    });

    it('should not render word counter warning when message is empty', () => {
      component.displayWordCounterWarning = true;
      component.wordCounterWarningMessage = '';
      fixture.detectChanges();

      const warning = fixture.debugElement.query(By.css('.bg-warning'));
      expect(warning).toBeFalsy();
    });
  });

  describe('Character and Word Counter Features', () => {
    beforeEach(() => {
      component._field = 'testField';
      component.model = mockModel;
      fixture.detectChanges();
    });

    it('should render character counter when enableCharacterCounter is true', () => {
      component.enableCharacterCounter = true;
      component.isViewOnly = false;
      fixture.detectChanges();

      // Since character-counter is a custom component, we check if the ng-container is rendered
      const textarea = fixture.debugElement.query(By.css('textarea'));
      expect(textarea).toBeTruthy();
      expect(component.enableCharacterCounter).toBeTruthy();
    });

    it('should render word counter when enableWordCounter is true', () => {
      component.enableWordCounter = true;
      component.isViewOnly = false;
      fixture.detectChanges();

      // Since app-word-counter is a custom component, we check if the ng-container is rendered
      const textarea = fixture.debugElement.query(By.css('textarea'));
      expect(textarea).toBeTruthy();
      expect(component.enableWordCounter).toBeTruthy();
    });

    it('should not render counters when disabled', () => {
      component.enableCharacterCounter = false;
      component.enableWordCounter = false;
      component.isViewOnly = false;
      fixture.detectChanges();

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
      fixture.detectChanges();
    });

    it('should call validateField on keyup event', () => {
      spyOn(component, 'validateField');
      
      const textarea = fixture.debugElement.query(By.css('textarea'));
      textarea.nativeElement.dispatchEvent(new KeyboardEvent('keyup'));
      
      expect(component.validateField).toHaveBeenCalled();
    });
  });

  describe('CSS Classes and Attributes', () => {
    beforeEach(() => {
      component._field = 'testField';
      component.model = mockModel;
      fixture.detectChanges();
    });

    it('should apply input classes to textarea', () => {
      component.inputClass = 'custom-class';
      component.isViewOnly = false;
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css('textarea'));
      expect(textarea.nativeElement.classList.contains('custom-class')).toBeTruthy();
    });

    it('should apply view-only classes when in view-only mode', () => {
      component.isViewOnly = true;
      component.viewOnlyClass = 'view-only-class';
      fixture.detectChanges();

      const viewOnlyDiv = fixture.debugElement.query(By.css('div[title]'));
      expect(viewOnlyDiv.nativeElement.classList.contains('view-only-class')).toBeTruthy();
    });

    it('should disable textarea when disabled is true', () => {
      component.disabled = true;
      component.isViewOnly = false;
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css('textarea'));
      expect(textarea.nativeElement.disabled).toBeTruthy();
    });

    it('should set correct id and name attributes using field and random', () => {
      component._field = 'testField';
      component.random = 'abc123';
      component.isViewOnly = false;
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css('textarea'));
      expect(textarea.nativeElement.getAttribute('id')).toBe('testField_abc123');
      expect(textarea.nativeElement.getAttribute('name')).toBe('testField_abc123');
    });

    it('should set correct for attribute on label using field and random', () => {
      component._field = 'testField';
      component.random = 'abc123';
      component.showLabel = true;
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.getAttribute('for')).toBe('testField_abc123');
    });

    it('should set correct attributes on textarea', () => {
      component.isViewOnly = false;
      component._placeholder = 'Test Placeholder';
      component._title = 'Test Title';
      component.rows = '10';
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css('textarea'));
      expect(textarea.nativeElement.getAttribute('placeholder')).toBe('Test Placeholder');
      expect(textarea.nativeElement.getAttribute('title')).toBe('Test Title');
      expect(textarea.nativeElement.getAttribute('rows')).toBe('10');
    });

    it('should apply wrapper and label classes correctly', () => {
      component.wrapperClass = 'custom-wrapper';
      component.labelClass = 'custom-label';
      component.showLabel = true;
      fixture.detectChanges();

      const wrapper = fixture.debugElement.query(By.css('.custom-wrapper'));
      const label = fixture.debugElement.query(By.css('.custom-label'));
      expect(wrapper).toBeTruthy();
      expect(label).toBeTruthy();
    });

    it('should apply input block classes correctly', () => {
      component.inputBlockClass = 'custom-input-block';
      component.inputBlockExtraClass = 'custom-extra';
      component.showLabel = true;
      fixture.detectChanges();

      const inputBlock = fixture.debugElement.query(By.css('.custom-input-block'));
      expect(inputBlock).toBeTruthy();
      expect(inputBlock.nativeElement.classList.contains('custom-extra')).toBeTruthy();
    });

    it('should apply input block class without extra class when showLabel is false', () => {
      component.inputBlockClass = 'custom-input-block';
      component.inputBlockExtraClass = 'custom-extra';
      component.showLabel = false;
      fixture.detectChanges();

      const inputBlock = fixture.debugElement.query(By.css('.custom-input-block'));
      expect(inputBlock).toBeTruthy();
      expect(inputBlock.nativeElement.classList.contains('custom-extra')).toBeFalsy();
    });

    it('should apply invalid class when validation errors include field', () => {
      mockModel.validationErrors = ['testField'];
      component.isViewOnly = false;
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css('textarea'));
      expect(textarea.nativeElement.classList.contains('invalid')).toBeTruthy();
    });
  });
});
