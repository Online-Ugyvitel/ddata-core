// tslint:disable: max-line-length
import { TestBed } from '@angular/core/testing';
import { BaseModel } from './base-model.model';
import { DdataCoreModule } from '../../ddata-core.module';
import { ValidatorService } from '../../services/validator/validator.service';
import { ValidationError } from '../error/validation-error.model';
import { ID, ISODate } from './base-data.type';

describe('BaseModel', () => {
  let model: BaseModel;
  let mockValidatorService: jasmine.SpyObj<ValidatorService>;

  beforeEach(() => {
    // Create a spy object for ValidatorService
    mockValidatorService = jasmine.createSpyObj('ValidatorService', ['validateObject']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: ValidatorService, useValue: mockValidatorService }
      ]
    });

    // Mock the DdataCoreModule.InjectorInstance
    const injector = TestBed.inject(ValidatorService);
    DdataCoreModule.InjectorInstance = {
      get: jasmine.createSpy('get').and.returnValue(mockValidatorService)
    } as any;

    model = new BaseModel();
  });

  describe('Model Creation and Type', () => {
    it('should create an instance', () => {
      expect(model).toBeTruthy();
      expect(model instanceof BaseModel).toBe(true);
    });

    it('should be the correct type', () => {
      expect(model.constructor.name).toBe('BaseModel');
    });
  });

  describe('Required Properties', () => {
    it('should have id property with correct type', () => {
      // Test that the id property can be set and accessed
      model.id = 123 as ID;
      expect(model.id).toBe(123 as ID);
      expect(typeof model.id).toBe('number');
    });

    it('should have api_endpoint property with correct type and default value', () => {
      expect(model.hasOwnProperty('api_endpoint')).toBe(true);
      expect(typeof model.api_endpoint).toBe('string');
      expect(model.api_endpoint).toBe('/you/must/be/define/api_endpoint/in/your/model');
    });

    it('should have use_localstorage property with correct type and default value', () => {
      expect(model.hasOwnProperty('use_localstorage')).toBe(true);
      expect(typeof model.use_localstorage).toBe('boolean');
      expect(model.use_localstorage).toBe(false);
    });

    it('should have model_name property with correct type and default value', () => {
      expect(model.hasOwnProperty('model_name')).toBe(true);
      expect(typeof model.model_name).toBe('string');
      expect(model.model_name).toBe('NotDefined');
    });

    it('should have isValid property with correct type and default value', () => {
      expect(model.hasOwnProperty('isValid')).toBe(true);
      expect(typeof model.isValid).toBe('boolean');
      expect(model.isValid).toBe(false);
    });

    it('should have validationErrors property with correct type and default value', () => {
      expect(model.hasOwnProperty('validationErrors')).toBe(true);
      expect(Array.isArray(model.validationErrors)).toBe(true);
      expect(model.validationErrors.length).toBe(0);
    });

    it('should have validationRules property with correct type and default value', () => {
      expect(model.hasOwnProperty('validationRules')).toBe(true);
      expect(typeof model.validationRules).toBe('object');
      expect(model.validationRules).toEqual({});
    });

    it('should have fields property with correct type and default value', () => {
      expect(model.hasOwnProperty('fields')).toBe(true);
      expect(typeof model.fields).toBe('object');
      expect(model.fields).toEqual({});
    });
  });

  describe('Method Existence', () => {
    it('should have init method', () => {
      expect(typeof model.init).toBe('function');
    });

    it('should have prepareToSave method', () => {
      expect(typeof model.prepareToSave).toBe('function');
    });

    it('should have validate method', () => {
      expect(typeof model.validate).toBe('function');
    });

    it('should have getValidatedErrorFields method', () => {
      expect(typeof model.getValidatedErrorFields).toBe('function');
    });

    it('should have setDate method', () => {
      expect(typeof model.setDate).toBe('function');
    });

    it('should have getCurrentISODate method', () => {
      expect(typeof model.getCurrentISODate).toBe('function');
    });

    it('should have toISODate method', () => {
      expect(typeof model.toISODate).toBe('function');
    });

    it('should have toISODatetime method', () => {
      expect(typeof model.toISODatetime).toBe('function');
    });

    it('should have toISOTime method', () => {
      expect(typeof model.toISOTime).toBe('function');
    });

    it('should have getCurrentUserId method', () => {
      expect(typeof model.getCurrentUserId).toBe('function');
    });

    it('should have getDefaultDevizaId method', () => {
      expect(typeof model.getDefaultDevizaId).toBe('function');
    });

    it('should have calculateDateWithoutWeekend method', () => {
      expect(typeof model.calculateDateWithoutWeekend).toBe('function');
    });

    it('should have prepareFieldsToSaveAsString method', () => {
      expect(typeof model.prepareFieldsToSaveAsString).toBe('function');
    });

    it('should have prepareFieldsToSaveAsNumber method', () => {
      expect(typeof model.prepareFieldsToSaveAsNumber).toBe('function');
    });

    it('should have prepareFieldsToSaveAsBoolean method', () => {
      expect(typeof model.prepareFieldsToSaveAsBoolean).toBe('function');
    });

    it('should have initModelOrNull method', () => {
      expect(typeof model.initModelOrNull).toBe('function');
    });

    it('should have initAsBoolean method', () => {
      expect(typeof model.initAsBoolean).toBe('function');
    });

    it('should have initAsBooleanWithDefaults method', () => {
      expect(typeof model.initAsBooleanWithDefaults).toBe('function');
    });

    it('should have fieldAsBoolean method', () => {
      expect(typeof model.fieldAsBoolean).toBe('function');
    });

    it('should have initAsString method', () => {
      expect(typeof model.initAsString).toBe('function');
    });

    it('should have initAsStringWithDefaults method', () => {
      expect(typeof model.initAsStringWithDefaults).toBe('function');
    });

    it('should have fieldAsString method', () => {
      expect(typeof model.fieldAsString).toBe('function');
    });

    it('should have initAsNumber method', () => {
      expect(typeof model.initAsNumber).toBe('function');
    });

    it('should have initAsNumberWithDefaults method', () => {
      expect(typeof model.initAsNumberWithDefaults).toBe('function');
    });

    it('should have fieldAsNumber method', () => {
      expect(typeof model.fieldAsNumber).toBe('function');
    });

    it('should have getCurrentTime method', () => {
      expect(typeof model.getCurrentTime).toBe('function');
    });
  });

  describe('init method', () => {
    it('should throw error with correct message', () => {
      expect(() => model.init()).toThrowError('init() function is not implemented');
    });

    it('should throw error with any parameter', () => {
      expect(() => model.init({ id: 1 })).toThrowError('init() function is not implemented');
    });

    it('should throw error with null parameter', () => {
      expect(() => model.init(null)).toThrowError('init() function is not implemented');
    });
  });

  describe('prepareToSave method', () => {
    it('should throw error with correct message', () => {
      expect(() => model.prepareToSave()).toThrowError('prepareToSave() function is not implemented');
    });
  });

  describe('validate method', () => {
    it('should call ValidatorService.validateObject with correct parameters', () => {
      // Setup mock to return valid result
      mockValidatorService.validateObject.and.returnValue([true, []]);
      
      // Mock prepareToSave to avoid error
      spyOn(model, 'prepareToSave').and.returnValue({ id: 1 });
      
      model.validate();
      
      expect(mockValidatorService.validateObject).toHaveBeenCalledWith(
        { id: 1 },
        model.validationRules,
        true,
        { message: 'Validation Error' }
      );
    });

    it('should set isValid and validationErrors from ValidatorService result', () => {
      const mockErrors = ['field1', 'field2'];
      mockValidatorService.validateObject.and.returnValue([false, mockErrors]);
      spyOn(model, 'prepareToSave').and.returnValue({ id: 1 });
      
      model.validate();
      
      expect(model.isValid).toBe(false);
      expect(model.validationErrors).toEqual(mockErrors);
    });

    it('should use preparedData parameter when provided', () => {
      mockValidatorService.validateObject.and.returnValue([true, []]);
      const preparedData = { id: 123, name: 'test' };
      
      model.validate(preparedData);
      
      expect(mockValidatorService.validateObject).toHaveBeenCalledWith(
        preparedData,
        model.validationRules,
        true,
        { message: 'Validation Error' }
      );
    });

    it('should handle ValidationError thrown by ValidatorService', () => {
      const errorInvalids = ['error1', 'error2'];
      const validationError = new ValidationError({ message: 'Test error', invalids: errorInvalids });
      mockValidatorService.validateObject.and.throwError(validationError);
      spyOn(model, 'prepareToSave').and.returnValue({ id: 1 });
      spyOn(model, 'getValidatedErrorFields').and.returnValue(['Error 1', 'Error 2']);
      
      expect(() => model.validate()).toThrowError(ValidationError);
      expect(model.validationErrors).toEqual(errorInvalids);
      expect(model.isValid).toBe(false);
    });

    it('should rethrow non-ValidationError errors', () => {
      const genericError = new Error('Generic error');
      mockValidatorService.validateObject.and.throwError(genericError);
      spyOn(model, 'prepareToSave').and.returnValue({ id: 1 });
      
      expect(() => model.validate()).toThrowError('Generic error');
    });
  });

  describe('getValidatedErrorFields method', () => {
    beforeEach(() => {
      model.fields = {
        field1: { label: 'Field One', title: 'Field One Title' },
        field2: { label: 'Field Two', title: 'Field Two Title' }
      };
    });

    it('should return labels for existing fields', () => {
      model.validationErrors = ['field1', 'field2'];
      const result = model.getValidatedErrorFields();
      expect(result).toEqual(['Field One', 'Field Two']);
    });

    it('should return field name for non-existing fields', () => {
      model.validationErrors = ['field1', 'nonexistent'];
      spyOn(console, 'error'); // Suppress console error for test
      const result = model.getValidatedErrorFields();
      expect(result).toEqual(['Field One', 'nonexistent']);
    });

    it('should log error for non-existing fields', () => {
      model.validationErrors = ['nonexistent'];
      spyOn(console, 'error');
      model.getValidatedErrorFields();
      expect(console.error).toHaveBeenCalledWith(
        'nonexistent nevű mező nem található ezen a model-en: NotDefined',
        model
      );
    });

    it('should return empty array when no validation errors', () => {
      model.validationErrors = [];
      const result = model.getValidatedErrorFields();
      expect(result).toEqual([]);
    });
  });

  describe('setDate method', () => {
    it('should return date as ISO string with 0 days offset', () => {
      const testDate = new Date('2023-05-15T12:00:00Z');
      const result = model.setDate(testDate, 0);
      expect(result).toBe('2023-05-15');
    });

    it('should add days correctly', () => {
      const testDate = new Date('2023-05-15T12:00:00Z');
      const result = model.setDate(testDate, 5);
      expect(result).toBe('2023-05-20');
    });

    it('should subtract days correctly', () => {
      const testDate = new Date('2023-05-15T12:00:00Z');
      const result = model.setDate(testDate, -5);
      expect(result).toBe('2023-05-10');
    });

    it('should handle month boundary correctly', () => {
      const testDate = new Date('2023-05-31T12:00:00Z');
      const result = model.setDate(testDate, 1);
      expect(result).toBe('2023-06-01');
    });

    it('should use default days parameter of 0', () => {
      const testDate = new Date('2023-05-15T12:00:00Z');
      const result = model.setDate(testDate);
      expect(result).toBe('2023-05-15');
    });
  });

  describe('getCurrentISODate method', () => {
    it('should return current date in ISO format', () => {
      const beforeCall = new Date().toISOString().split('T')[0];
      const result = model.getCurrentISODate();
      const afterCall = new Date().toISOString().split('T')[0];
      
      // Result should be between before and after call (same day)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect([beforeCall, afterCall]).toContain(result);
    });
  });

  describe('toISODate method', () => {
    it('should convert Date to ISO date string', () => {
      const testDate = new Date('2023-05-15T14:30:25.123Z');
      const result = model.toISODate(testDate);
      expect(result).toBe('2023-05-15');
    });

    it('should handle different dates correctly', () => {
      const testDate = new Date('2022-12-31T23:59:59Z');
      const result = model.toISODate(testDate);
      expect(result).toBe('2022-12-31');
    });
  });

  describe('toISODatetime method', () => {
    it('should return date and time in YYYY-MM-DD hh:mm:ss format', () => {
      const testDate = new Date('2023-05-15T14:30:25Z');
      const result = model.toISODatetime(testDate);
      expect(result).toBe('2023-05-15 14:30:25');
    });

    it('should handle edge cases with zeros', () => {
      const testDate = new Date('2023-01-01T00:00:00Z');
      const result = model.toISODatetime(testDate);
      expect(result).toBe('2023-01-01 00:00:00');
    });
  });

  describe('toISOTime method', () => {
    it('should return time in hh:mm:ss format', () => {
      const testDate = new Date('2023-05-15T14:30:25Z');
      const result = model.toISOTime(testDate);
      expect(result).toBe('14:30:25');
    });

    it('should pad single digits with zeros', () => {
      const testDate = new Date('2023-05-15T09:05:03Z');
      const result = model.toISOTime(testDate);
      expect(result).toBe('09:05:03');
    });

    it('should handle midnight correctly', () => {
      const testDate = new Date('2023-05-15T00:00:00Z');
      const result = model.toISOTime(testDate);
      expect(result).toBe('00:00:00');
    });
  });

  describe('getCurrentUserId method', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    afterEach(() => {
      // Clean up after each test
      localStorage.clear();
    });

    it('should return user ID from localStorage', () => {
      localStorage.setItem('current_user_id', '123');
      const result = model.getCurrentUserId();
      expect(result).toBe(123 as ID);
    });

    it('should return NaN when localStorage value is not a number', () => {
      localStorage.setItem('current_user_id', 'not-a-number');
      const result = model.getCurrentUserId();
      expect(isNaN(result as any)).toBe(true);
    });

    it('should return 0 when localStorage item does not exist', () => {
      const result = model.getCurrentUserId();
      expect(result).toBe(0 as ID);
    });
  });

  describe('getDefaultDevizaId method', () => {
    it('should return 45', () => {
      const result = model.getDefaultDevizaId();
      expect(result).toBe(45 as ID);
    });
  });

  describe('calculateDateWithoutWeekend method', () => {
    it('should add business days going up', () => {
      // Starting from Monday 2023-05-15, adding 1 business day should give Tuesday
      const result = model.calculateDateWithoutWeekend('2023-05-15', 1, 'up');
      expect(result).toBe('2023-05-16');
    });

    it('should subtract business days going down', () => {
      // Starting from Tuesday 2023-05-16, subtracting 1 business day should give Monday
      const result = model.calculateDateWithoutWeekend('2023-05-16', 1, 'down');
      expect(result).toBe('2023-05-15');
    });

    it('should skip weekends when adding days', () => {
      // Starting from Friday 2023-05-19, adding 1 business day should skip weekend and give Monday
      const result = model.calculateDateWithoutWeekend('2023-05-19', 1, 'up');
      expect(result).toBe('2023-05-22');
    });

    it('should skip weekends when subtracting days', () => {
      // Starting from Monday 2023-05-22, subtracting 1 business day should skip weekend and give Friday
      const result = model.calculateDateWithoutWeekend('2023-05-22', 1, 'down');
      expect(result).toBe('2023-05-19');
    });

    it('should return original date when days is 0', () => {
      const result = model.calculateDateWithoutWeekend('2023-05-15', 0, 'up');
      expect(result).toBe('2023-05-15');
    });

    it('should handle multiple days correctly', () => {
      // Starting from Monday 2023-05-15, adding 5 business days should give Monday next week
      const result = model.calculateDateWithoutWeekend('2023-05-15', 5, 'up');
      expect(result).toBe('2023-05-22');
    });
  });

  describe('prepareFieldsToSaveAsString method', () => {
    it('should convert fields to string values using model properties', () => {
      model['field1'] = 'existing';
      model['field2'] = 'another';
      
      const fields = { field1: 123, field2: true, field3: 'test' };
      const result = model.prepareFieldsToSaveAsString(fields);
      
      expect(result).toEqual({
        field1: 'existing',  // Uses model property
        field2: 'another',   // Uses model property
        field3: 'test'       // Uses field value since model property doesn't exist
      });
    });

    it('should use String conversion when model property is not set', () => {
      const fields = { field1: 123, field2: true, field3: null };
      const result = model.prepareFieldsToSaveAsString(fields);
      
      expect(result).toEqual({
        field1: '123',
        field2: 'true',
        field3: 'null'
      });
    });

    it('should handle empty fields object', () => {
      const result = model.prepareFieldsToSaveAsString({});
      expect(result).toEqual({});
    });
  });

  describe('prepareFieldsToSaveAsNumber method', () => {
    it('should convert fields to number values using model properties', () => {
      model['field1'] = 100;
      model['field2'] = 200;
      
      const fields = { field1: '123', field2: true, field3: '456' };
      const result = model.prepareFieldsToSaveAsNumber(fields);
      
      expect(result).toEqual({
        field1: 100,  // Uses model property
        field2: 200,  // Uses model property
        field3: 456   // Uses field value since model property doesn't exist
      });
    });

    it('should use Number conversion when model property is not set', () => {
      const fields = { field1: '123', field2: true, field3: 'invalid' };
      const result = model.prepareFieldsToSaveAsNumber(fields);
      
      expect(result).toEqual({
        field1: 123,
        field2: 1,
        field3: NaN
      });
    });

    it('should handle empty fields object', () => {
      const result = model.prepareFieldsToSaveAsNumber({});
      expect(result).toEqual({});
    });
  });

  describe('prepareFieldsToSaveAsBoolean method', () => {
    it('should convert fields to boolean values using model properties', () => {
      model['field1'] = true;
      model['field2'] = false;
      
      const fields = { field1: 0, field2: 'test', field3: 1 };
      const result = model.prepareFieldsToSaveAsBoolean(fields);
      
      expect(result).toEqual({
        field1: true,   // Uses model property
        field2: false,  // Uses model property
        field3: true    // Uses field value since model property doesn't exist
      });
    });

    it('should use Boolean conversion when model property is not set', () => {
      const fields = { field1: 1, field2: 0, field3: 'test', field4: null };
      const result = model.prepareFieldsToSaveAsBoolean(fields);
      
      expect(result).toEqual({
        field1: true,
        field2: false,
        field3: true,
        field4: false
      });
    });

    it('should handle empty fields object', () => {
      const result = model.prepareFieldsToSaveAsBoolean({});
      expect(result).toEqual({});
    });
  });

  describe('initModelOrNull method', () => {
    it('should initialize model fields with init method when available', () => {
      const mockModel = { init: jasmine.createSpy('init').and.returnValue('initialized') };
      const fields = { field1: mockModel };
      const data = { field1: { id: 1 } };
      
      model.initModelOrNull(fields, data);
      
      expect(mockModel.init).toHaveBeenCalledWith({ id: 1 });
      expect(model['field1']).toBe('initialized');
    });

    it('should set field to null when init method is not available', () => {
      const fields = { field1: null };
      const data = { field1: { id: 1 } };
      
      model.initModelOrNull(fields, data);
      
      expect(model['field1']).toBe(null);
    });

    it('should handle missing data properties', () => {
      const mockModel = { init: jasmine.createSpy('init').and.returnValue('initialized') };
      const fields = { field1: mockModel };
      const data = {};
      
      model.initModelOrNull(fields, data);
      
      expect(mockModel.init).toHaveBeenCalledWith(undefined);
    });
  });

  describe('initAsBoolean method', () => {
    it('should call fieldAsBoolean for each field', () => {
      spyOn(model, 'fieldAsBoolean');
      const fields = { field1: true, field2: false };
      const data = { field1: false, field2: true };
      
      model.initAsBoolean(fields, data);
      
      expect(model.fieldAsBoolean).toHaveBeenCalledWith('field1', true, data);
      expect(model.fieldAsBoolean).toHaveBeenCalledWith('field2', false, data);
    });
  });

  describe('initAsBooleanWithDefaults method', () => {
    it('should call fieldAsBoolean with false default for each field', () => {
      spyOn(model, 'fieldAsBoolean');
      const fields = ['field1', 'field2'];
      const data = { field1: true };
      
      model.initAsBooleanWithDefaults(fields, data);
      
      expect(model.fieldAsBoolean).toHaveBeenCalledWith('field1', false, data);
      expect(model.fieldAsBoolean).toHaveBeenCalledWith('field2', false, data);
    });
  });

  describe('fieldAsBoolean method', () => {
    it('should set field to data value when data value is boolean', () => {
      const data = { field1: true };
      model.fieldAsBoolean('field1', false, data);
      expect(model['field1']).toBe(true);
    });

    it('should set field to default when data value is not boolean', () => {
      const data = { field1: 'not boolean' };
      model.fieldAsBoolean('field1', true, data);
      expect(model['field1']).toBe(true);
    });

    it('should set field to default when data value is undefined', () => {
      const data = {};
      model.fieldAsBoolean('field1', true, data);
      expect(model['field1']).toBe(true);
    });

    it('should set field to default when data value is null', () => {
      const data = { field1: null };
      model.fieldAsBoolean('field1', true, data);
      expect(model['field1']).toBe(true);
    });
  });

  describe('initAsString method', () => {
    it('should call fieldAsString for each field', () => {
      spyOn(model, 'fieldAsString');
      const fields = { field1: 'default1', field2: 'default2' };
      const data = { field1: 'value1', field2: 'value2' };
      
      model.initAsString(fields, data);
      
      expect(model.fieldAsString).toHaveBeenCalledWith('field1', 'default1', data);
      expect(model.fieldAsString).toHaveBeenCalledWith('field2', 'default2', data);
    });
  });

  describe('initAsStringWithDefaults method', () => {
    it('should call fieldAsString with empty string default for each field', () => {
      spyOn(model, 'fieldAsString');
      const fields = ['field1', 'field2'];
      const data = { field1: 'value1' };
      
      model.initAsStringWithDefaults(fields, data);
      
      expect(model.fieldAsString).toHaveBeenCalledWith('field1', '', data);
      expect(model.fieldAsString).toHaveBeenCalledWith('field2', '', data);
    });
  });

  describe('fieldAsString method', () => {
    it('should set field to string value of data when available', () => {
      const data = { field1: 123 };
      model.fieldAsString('field1', 'default', data);
      expect(model['field1']).toBe('123');
    });

    it('should set field to default when data field is null', () => {
      const data = { field1: null };
      model.fieldAsString('field1', 'default', data);
      expect(model['field1']).toBe('default');
    });

    it('should set field to default when data field is undefined', () => {
      const data = {};
      model.fieldAsString('field1', 'default', data);
      expect(model['field1']).toBe('default');
    });

    it('should handle objects with toString method', () => {
      const data = { field1: { toString: () => 'object string' } };
      model.fieldAsString('field1', 'default', data);
      expect(model['field1']).toBe('object string');
    });
  });

  describe('initAsNumber method', () => {
    it('should call fieldAsNumber for each field', () => {
      spyOn(model, 'fieldAsNumber');
      const fields = { field1: 10, field2: 20 };
      const data = { field1: 100, field2: 200 };
      
      model.initAsNumber(fields, data);
      
      expect(model.fieldAsNumber).toHaveBeenCalledWith('field1', 10, data);
      expect(model.fieldAsNumber).toHaveBeenCalledWith('field2', 20, data);
    });
  });

  describe('initAsNumberWithDefaults method', () => {
    it('should call fieldAsNumber with 0 default for each field', () => {
      spyOn(model, 'fieldAsNumber');
      const fields = ['field1', 'field2'];
      const data = { field1: 100 };
      
      model.initAsNumberWithDefaults(fields, data);
      
      expect(model.fieldAsNumber).toHaveBeenCalledWith('field1', 0, data);
      expect(model.fieldAsNumber).toHaveBeenCalledWith('field2', 0, data);
    });
  });

  describe('fieldAsNumber method', () => {
    it('should set field to number value when data is truthy', () => {
      const data = { field1: '123' };
      model.fieldAsNumber('field1', 0, data);
      expect(model['field1']).toBe(123);
    });

    it('should set field to default when data field is falsy', () => {
      const data = { field1: 0 };
      model.fieldAsNumber('field1', 999, data);
      expect(model['field1']).toBe(999);
    });

    it('should set field to default when data field is undefined', () => {
      const data = {};
      model.fieldAsNumber('field1', 999, data);
      expect(model['field1']).toBe(999);
    });

    it('should set field to default when data field is null', () => {
      const data = { field1: null };
      model.fieldAsNumber('field1', 999, data);
      expect(model['field1']).toBe(999);
    });

    it('should convert string numbers correctly', () => {
      const data = { field1: '456.78' };
      model.fieldAsNumber('field1', 0, data);
      expect(model['field1']).toBe(456.78);
    });
  });

  describe('getCurrentTime method', () => {
    it('should return current time in h:m format', () => {
      const result = model.getCurrentTime();
      expect(result).toMatch(/^\d{1,2}:\d{1,2}$/);
    });

    it('should return valid time format', () => {
      const result = model.getCurrentTime();
      const parts = result.split(':');
      expect(parts.length).toBe(2);
      
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThanOrEqual(23);
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(minutes).toBeLessThanOrEqual(59);
    });
  });
});