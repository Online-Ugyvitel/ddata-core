import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { BaseModelInterface, FieldsInterface, FieldContainerInterface, FieldInterface, ValidationRuleInterface, DdataCoreModule, ValidatorService, ValidatorServiceInterface } from 'ddata-core';
import { InputHelperService } from './input-helper.service';

// Mock model interface for testing
interface TestModelData {
  testField: string;
  requiredField: string;
  optionalField: string;
}

// Mock model class that implements both BaseModelInterface and FieldsInterface
class MockModel implements BaseModelInterface<TestModelData>, FieldsInterface<TestModelData> {
  // BaseModelInterface properties
  api_endpoint = '/test';
  use_localstorage = false;
  model_name = 'TestModel';
  id = 1;
  isValid = true;
  validationErrors: string[] = [];
  validationRules: ValidationRuleInterface = {
    testField: ['required', 'string'],
    requiredField: ['required'],
    optionalField: ['string']
  };

  // Test data properties
  testField = 'test value';
  requiredField = 'required value';
  optionalField = 'optional value';

  // FieldsInterface properties
  fields: FieldContainerInterface<TestModelData> = {
    testField: {
      title: 'Test Field Title',
      label: 'Test Field Label',
      placeholder: 'Test Field Placeholder',
      prepend: 'Test Prepend',
      append: 'Test Append'
    },
    requiredField: {
      title: 'Required Field Title',
      label: 'Required Field Label',
      placeholder: 'Required Field Placeholder'
    },
    optionalField: {
      title: 'Optional Field Title',
      label: 'Optional Field Label'
    }
  };

  // BaseModelInterface methods
  init(data?: any): any { return this; }
  prepareToSave(): any { return this; }
  validate(): void {}
  getValidatedErrorFields(): string[] { return []; }
  setDate(date: Date, days: number): any { return ''; }
  getCurrentUserId(): any { return 1; }
  getCurrentISODate(): any { return ''; }
  toISODate(date: Date): any { return ''; }
  toISODatetime(date: Date): string { return ''; }
  calculateDateWithoutWeekend(date: string, days: number, sequence: string): any { return ''; }
  getCurrentTime(): string { return ''; }
  
  // BaseModelInterface<T> methods
  fieldAsBoolean(field: string, defaultValue: boolean, data: unknown): void {}
  fieldAsNumber(field: string, defaultValue: number, data: unknown): void {}
  fieldAsString(field: string, defaultValue: string, data: unknown): void {}
  initModelOrNull(fields: Partial<TestModelData>, data: unknown): void {}
  initAsBoolean(fields: Partial<TestModelData>, data: unknown): void {}
  initAsBooleanWithDefaults(fields: Array<string>, data: unknown): void {}
  initAsNumber(fields: Partial<TestModelData>, data: unknown): void {}
  initAsNumberWithDefaults(fields: Array<string>, data: unknown): void {}
  initAsString(fields: Partial<TestModelData>, data: unknown): void {}
  initAsStringWithDefaults(fields: Array<string>, data: unknown): void {}
  prepareFieldsToSaveAsBoolean(fields: Partial<TestModelData>): Partial<TestModelData> { return {}; }
  prepareFieldsToSaveAsNumber(fields: Partial<TestModelData>): Partial<TestModelData> { return {}; }
  prepareFieldsToSaveAsString(fields: Partial<TestModelData>): Partial<TestModelData> { return {}; }
}

// Mock ValidatorService
class MockValidatorService implements ValidatorServiceInterface {
  validate(value: any, rules: string[]): boolean {
    // Mock validation logic for testing
    if (rules.includes('required') && (!value || value === '')) {
      return false;
    }
    return true;
  }

  validateObject(object: any, rules: any, throwOnError?: boolean, errorSettings?: any): [boolean, string[]] {
    return [true, []];
  }
}

describe('InputHelperService', () => {
  let service: InputHelperService;
  let mockValidatorService: MockValidatorService;
  let mockModel: MockModel;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(), {
        teardown: { destroyAfterEach: false }
      }
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InputHelperService,
        { provide: ValidatorService, useClass: MockValidatorService }
      ]
    });

    // Mock the DdataCoreModule.InjectorInstance
    mockValidatorService = new MockValidatorService();
    DdataCoreModule.InjectorInstance = {
      get: jasmine.createSpy('get').and.returnValue(mockValidatorService)
    } as any;

    service = TestBed.inject(InputHelperService);
    // Create a fresh mock model for each test to avoid interference between tests
    mockModel = new MockModel();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateField', () => {
    it('should return false and log error when validation rule is missing', () => {
      const consoleSpy = spyOn(console, 'error');
      const result = service.validateField(mockModel, 'nonExistentField');
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Missing validation rule:nonExistentField from model: TestModel');
    });

    it('should throw error when model is null', () => {
      expect(() => {
        service.validateField(null as any, 'testField');
      }).toThrow();
    });

    it('should return true when field is valid and not in validation errors', () => {
      spyOn(mockValidatorService, 'validate').and.returnValue(true);
      mockModel.validationErrors = [];
      
      const result = service.validateField(mockModel, 'testField');
      
      expect(result).toBe(true);
      expect(mockModel.validationErrors).toEqual([]);
    });

    it('should return false and add field to validation errors when validation fails', () => {
      spyOn(mockValidatorService, 'validate').and.returnValue(false);
      mockModel.validationErrors = [];
      
      const result = service.validateField(mockModel, 'testField');
      
      expect(result).toBe(false);
      expect(mockModel.validationErrors).toContain('testField');
    });

    it('should return false and not add field to validation errors when validation fails and field is already in errors', () => {
      spyOn(mockValidatorService, 'validate').and.returnValue(false);
      mockModel.validationErrors = ['testField'];
      
      const result = service.validateField(mockModel, 'testField');
      
      expect(result).toBe(false);
      expect(mockModel.validationErrors).toEqual(['testField']); // should not duplicate
    });

    it('should return true and remove field from validation errors when field becomes valid', () => {
      spyOn(mockValidatorService, 'validate').and.returnValue(true);
      mockModel.validationErrors = ['testField'];
      
      const result = service.validateField(mockModel, 'testField');
      
      expect(result).toBe(true);
      expect(mockModel.validationErrors).not.toContain('testField');
    });
  });

  describe('getTitle', () => {
    it('should return empty string and log error when model is null', () => {
      const consoleSpy = spyOn(console, 'error');
      const result = service.getTitle(null as any, 'testField');
      
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(`The model not contains the 'testField' field's title. You need to set in your model the fields.testField.title field.`);
    });

    it('should return empty string and log error when model.fields is null', () => {
      const consoleSpy = spyOn(console, 'error');
      const modelWithNullFields = { ...mockModel };
      modelWithNullFields.fields = null as any;
      const result = service.getTitle(modelWithNullFields, 'testField');
      
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(`The model not contains the 'testField' field's title. You need to set in your model the fields.testField.title field.`);
    });

    it('should return empty string and log error when model.fields[field] is missing', () => {
      const consoleSpy = spyOn(console, 'error');
      const result = service.getTitle(mockModel, 'nonExistentField');
      
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(`The model not contains the 'nonExistentField' field's title. You need to set in your model the fields.nonExistentField.title field.`);
    });

    it('should return empty string and log error when model.fields[field].title is missing', () => {
      const consoleSpy = spyOn(console, 'error');
      delete mockModel.fields.testField.title;
      const result = service.getTitle(mockModel, 'testField');
      
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(`The model not contains the 'testField' field's title. You need to set in your model the fields.testField.title field.`);
    });

    it('should return the title when everything is valid', () => {
      const result = service.getTitle(mockModel, 'testField');
      
      expect(result).toBe('Test Field Title');
    });
  });

  describe('getLabel', () => {
    it('should return empty string and log error when model is null', () => {
      const consoleSpy = spyOn(console, 'error');
      const result = service.getLabel(null as any, 'testField');
      
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(`The model not contains the 'testField' field's label. You need to set in your model the fields.testField.label field.`);
    });

    it('should return empty string and log error when model.fields is null', () => {
      const consoleSpy = spyOn(console, 'error');
      const modelWithNullFields = { ...mockModel };
      modelWithNullFields.fields = null as any;
      const result = service.getLabel(modelWithNullFields, 'testField');
      
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(`The model not contains the 'testField' field's label. You need to set in your model the fields.testField.label field.`);
    });

    it('should return empty string and log error when model.fields[field] is missing', () => {
      const consoleSpy = spyOn(console, 'error');
      const result = service.getLabel(mockModel, 'nonExistentField');
      
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(`The model not contains the 'nonExistentField' field's label. You need to set in your model the fields.nonExistentField.label field.`);
    });

    it('should return empty string and log error when model.fields[field].label is missing', () => {
      const consoleSpy = spyOn(console, 'error');
      delete mockModel.fields.testField.label;
      const result = service.getLabel(mockModel, 'testField');
      
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(`The model not contains the 'testField' field's label. You need to set in your model the fields.testField.label field.`);
    });

    it('should return the label when everything is valid', () => {
      const result = service.getLabel(mockModel, 'testField');
      
      expect(result).toBe('Test Field Label');
    });
  });

  describe('getPlaceholder', () => {
    it('should return empty string and log error when model is null', () => {
      const consoleSpy = spyOn(console, 'error');
      const result = service.getPlaceholder(null as any, 'testField');
      
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(`The model not contains the 'testField' field's placeholder. You need to set in your model the fields.testField.placeholder field.`);
    });

    it('should return empty string and log error when model.fields is null', () => {
      const consoleSpy = spyOn(console, 'error');
      const modelWithNullFields = { ...mockModel };
      modelWithNullFields.fields = null as any;
      const result = service.getPlaceholder(modelWithNullFields, 'testField');
      
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(`The model not contains the 'testField' field's placeholder. You need to set in your model the fields.testField.placeholder field.`);
    });

    it('should return empty string and log error when model.fields[field] is missing', () => {
      const consoleSpy = spyOn(console, 'error');
      const result = service.getPlaceholder(mockModel, 'nonExistentField');
      
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(`The model not contains the 'nonExistentField' field's placeholder. You need to set in your model the fields.nonExistentField.placeholder field.`);
    });

    it('should return empty string and log error when model.fields[field].placeholder is missing', () => {
      const consoleSpy = spyOn(console, 'error');
      delete mockModel.fields.testField.placeholder;
      const result = service.getPlaceholder(mockModel, 'testField');
      
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(`The model not contains the 'testField' field's placeholder. You need to set in your model the fields.testField.placeholder field.`);
    });

    it('should return the title when everything is valid (bug: returns title instead of placeholder)', () => {
      const result = service.getPlaceholder(mockModel, 'testField');
      
      // Note: This tests the current implementation which has a bug - it returns title instead of placeholder
      // The correct implementation should return model.fields[field].placeholder instead of model.fields[field].title
      expect(result).toBe('Test Field Title'); // Should be 'Test Field Placeholder' when bug is fixed
    });
  });

  describe('getPrepend', () => {
    it('should return empty string when model is null', () => {
      const result = service.getPrepend(null as any, 'testField');
      
      expect(result).toBe('');
    });

    it('should return empty string when model.fields is null', () => {
      const modelWithNullFields = { ...mockModel };
      modelWithNullFields.fields = null as any;
      const result = service.getPrepend(modelWithNullFields, 'testField');
      
      expect(result).toBe('');
    });

    it('should return empty string when model.fields[field] is missing', () => {
      const result = service.getPrepend(mockModel, 'nonExistentField');
      
      expect(result).toBe('');
    });

    it('should return empty string when model.fields[field].prepend is missing', () => {
      delete mockModel.fields.testField.prepend;
      const result = service.getPrepend(mockModel, 'testField');
      
      expect(result).toBe('');
    });

    it('should return the prepend when everything is valid', () => {
      const result = service.getPrepend(mockModel, 'testField');
      
      expect(result).toBe('Test Prepend');
    });
  });

  describe('getAppend', () => {
    it('should return empty string when model is null', () => {
      const result = service.getAppend(null as any, 'testField');
      
      expect(result).toBe('');
    });

    it('should return empty string when model.fields is null', () => {
      const modelWithNullFields = { ...mockModel };
      modelWithNullFields.fields = null as any;
      const result = service.getAppend(modelWithNullFields, 'testField');
      
      expect(result).toBe('');
    });

    it('should return empty string when model.fields[field] is missing', () => {
      const result = service.getAppend(mockModel, 'nonExistentField');
      
      expect(result).toBe('');
    });

    it('should return empty string when model.fields[field].append is missing', () => {
      delete mockModel.fields.testField.append;
      const result = service.getAppend(mockModel, 'testField');
      
      expect(result).toBe('');
    });

    it('should return the append when everything is valid', () => {
      const result = service.getAppend(mockModel, 'testField');
      
      expect(result).toBe('Test Append');
    });
  });

  describe('isRequired', () => {
    it('should return true when field has required validation rule', () => {
      const result = service.isRequired(mockModel, 'testField');
      
      expect(result).toBe(true);
    });

    it('should return false when field does not have required validation rule', () => {
      const result = service.isRequired(mockModel, 'optionalField');
      
      expect(result).toBe(false);
    });

    it('should throw error when field validation rules do not exist', () => {
      expect(() => {
        service.isRequired(mockModel, 'nonExistentField');
      }).toThrow();
    });

    it('should throw error when model is null', () => {
      expect(() => {
        service.isRequired(null as any, 'testField');
      }).toThrow();
    });

    it('should throw error when model.validationRules is null', () => {
      const modelWithNullRules = { ...mockModel };
      modelWithNullRules.validationRules = null as any;
      expect(() => {
        service.isRequired(modelWithNullRules, 'testField');
      }).toThrow();
    });
  });

  describe('randChars', () => {
    it('should return a string of 50 characters', () => {
      const result = service.randChars();
      
      expect(result.length).toBe(50);
    });

    it('should return a string containing only valid characters', () => {
      const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const result = service.randChars();
      
      for (const char of result) {
        expect(validChars).toContain(char);
      }
    });

    it('should return different strings on multiple calls', () => {
      const result1 = service.randChars();
      const result2 = service.randChars();
      
      // While theoretically possible to be the same, the probability is extremely low
      expect(result1).not.toBe(result2);
    });
  });
});