import { ValidationError, ValidationErrorInterface } from './validation-error.model';
import { ValidationErrorSettingsInterface } from './validation-error-settings.model';

describe('ValidationError', () => {

  describe('Model Creation', () => {
    it('should create an instance with valid settings', () => {
      const settings: ValidationErrorSettingsInterface = {
        message: 'Test error message',
        invalids: ['field1', 'field2']
      };
      const error = new ValidationError(settings);
      
      expect(error).toBeTruthy();
      expect(error).toBeInstanceOf(ValidationError);
    });

    it('should create an instance with empty settings object', () => {
      const settings: ValidationErrorSettingsInterface = {};
      const error = new ValidationError(settings);
      
      expect(error).toBeTruthy();
      expect(error).toBeInstanceOf(ValidationError);
    });

    it('should handle settings object with undefined message', () => {
      const settings: ValidationErrorSettingsInterface = { message: undefined };
      const error = new ValidationError(settings);
      
      expect(error).toBeTruthy();
      expect(error).toBeInstanceOf(ValidationError);
    });

    it('should handle settings object with defined message', () => {
      const settings: ValidationErrorSettingsInterface = { message: 'Test message' };
      const error = new ValidationError(settings);
      
      expect(error).toBeTruthy();
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Test message');
    });
  });

  describe('Type Verification', () => {
    let error: ValidationError;

    beforeEach(() => {
      error = new ValidationError({ message: 'Test message' });
    });

    it('should be an instance of ValidationError', () => {
      expect(error).toBeInstanceOf(ValidationError);
    });

    it('should be an instance of Error', () => {
      expect(error).toBeInstanceOf(Error);
    });

    it('should implement ValidationErrorInterface', () => {
      // Verify it has all required interface properties
      expect(error.name).toBeDefined();
      expect(error.message).toBeDefined();
      expect(error.invalids).toBeDefined();
      expect(error.status).toBeDefined();
      expect(error.originalError).toBeDefined();
    });

    it('should have correct prototype chain', () => {
      expect(Object.getPrototypeOf(error)).toBe(ValidationError.prototype);
    });
  });

  describe('Required Properties', () => {
    let error: ValidationError;

    beforeEach(() => {
      error = new ValidationError({ message: 'Test message' });
    });

    it('should have name property', () => {
      expect(error.hasOwnProperty('name') || 'name' in error).toBe(true);
      expect(error.name).toBeDefined();
    });

    it('should have message property', () => {
      expect(error.hasOwnProperty('message') || 'message' in error).toBe(true);
      expect(error.message).toBeDefined();
    });

    it('should have invalids property', () => {
      expect(error.hasOwnProperty('invalids') || 'invalids' in error).toBe(true);
      expect(error.invalids).toBeDefined();
    });

    it('should have status property', () => {
      expect(error.hasOwnProperty('status') || 'status' in error).toBe(true);
      expect(error.status).toBeDefined();
    });

    it('should have originalError property', () => {
      expect(error.hasOwnProperty('originalError') || 'originalError' in error).toBe(true);
      expect(error.originalError).toBeDefined();
    });
  });

  describe('Property Types', () => {
    let error: ValidationError;

    beforeEach(() => {
      error = new ValidationError({
        message: 'Test message',
        invalids: ['field1', 'field2']
      });
    });

    it('should have name as string type', () => {
      expect(typeof error.name).toBe('string');
    });

    it('should have message as string type', () => {
      expect(typeof error.message).toBe('string');
    });

    it('should have invalids as array type', () => {
      expect(Array.isArray(error.invalids)).toBe(true);
    });

    it('should have invalids array containing only strings', () => {
      error.invalids.forEach(invalid => {
        expect(typeof invalid).toBe('string');
      });
    });

    it('should have status as number type', () => {
      expect(typeof error.status).toBe('number');
    });

    it('should have originalError as object type', () => {
      expect(typeof error.originalError).toBe('object');
      expect(error.originalError).not.toBeNull();
    });
  });

  describe('Default Values', () => {
    it('should have correct default name', () => {
      const error = new ValidationError({});
      expect(error.name).toBe('ValidationError');
    });

    it('should have correct default status', () => {
      const error = new ValidationError({});
      expect(error.status).toBe(480);
    });

    it('should have empty array as default invalids', () => {
      const error = new ValidationError({});
      expect(error.invalids).toEqual([]);
    });

    it('should have default originalError structure', () => {
      const error = new ValidationError({});
      expect(error.originalError).toEqual({
        status: 480,
        error: {
          name: 'ValidationError',
          message: error.message,
          invalids: [],
          trace: []
        }
      });
    });
  });

  describe('Readonly Properties', () => {
    let error: ValidationError;

    beforeEach(() => {
      error = new ValidationError({ message: 'Test message' });
    });

    it('should have name property that is declared as readonly in TypeScript', () => {
      // The readonly modifier in TypeScript only provides compile-time protection
      // At runtime, we can verify the property exists and has the expected value
      expect(error.name).toBe('ValidationError');
      
      // At runtime, the properties are actually writable (readonly is only TypeScript)
      const descriptor = Object.getOwnPropertyDescriptor(error, 'name');
      if (descriptor) {
        expect(descriptor.writable).toBe(true);
      }
    });

    it('should have status property that is declared as readonly in TypeScript', () => {
      // The readonly modifier in TypeScript only provides compile-time protection
      // At runtime, we can verify the property exists and has the expected value
      expect(error.status).toBe(480);
      
      // At runtime, the properties are actually writable (readonly is only TypeScript)
      const descriptor = Object.getOwnPropertyDescriptor(error, 'status');
      if (descriptor) {
        expect(descriptor.writable).toBe(true);
      }
    });
  });

  describe('Constructor Parameter Handling', () => {
    it('should use provided message', () => {
      const testMessage = 'Custom error message';
      const error = new ValidationError({ message: testMessage });
      expect(error.message).toBe(testMessage);
    });

    it('should use provided invalids', () => {
      const testInvalids = ['field1', 'field2', 'field3'];
      const error = new ValidationError({ invalids: testInvalids });
      expect(error.invalids).toEqual(testInvalids);
    });

    it('should handle empty message in settings', () => {
      const error = new ValidationError({ message: '' });
      expect(error.message).toBe('');
    });

    it('should handle null invalids in settings', () => {
      const error = new ValidationError({ invalids: null as any });
      expect(error.invalids).toEqual([]);
    });

    it('should handle undefined message in settings', () => {
      const error = new ValidationError({ message: undefined });
      // When undefined is passed, it falls back to this.message from Error, which is empty string
      expect(error.message).toBe('');
    });

    it('should handle undefined invalids in settings', () => {
      const error = new ValidationError({ invalids: undefined });
      expect(error.invalids).toEqual([]);
    });

    it('should handle false values for message and invalids', () => {
      const error = new ValidationError({ message: false as any, invalids: false as any });
      expect(error.invalids).toEqual([]);
    });

    it('should handle falsy but not boolean values for invalids', () => {
      const error = new ValidationError({ invalids: 0 as any });
      expect(error.invalids).toEqual([]);
    });
  });

  describe('OriginalError Property Synchronization', () => {
    it('should sync invalids to originalError.error.invalids', () => {
      const testInvalids = ['field1', 'field2'];
      const error = new ValidationError({ invalids: testInvalids });
      
      expect(error.originalError.error.invalids).toEqual(testInvalids);
    });

    it('should maintain originalError structure', () => {
      const error = new ValidationError({
        message: 'Test message',
        invalids: ['field1']
      });
      
      expect(error.originalError.status).toBeDefined();
      expect(error.originalError.error).toBeDefined();
      expect(error.originalError.error.name).toBeDefined();
      expect(error.originalError.error.message).toBeDefined();
      expect(error.originalError.error.invalids).toBeDefined();
      expect(error.originalError.error.trace).toBeDefined();
    });

    it('should have correct values in originalError', () => {
      const testMessage = 'Test message';
      const testInvalids = ['field1', 'field2'];
      const error = new ValidationError({
        message: testMessage,
        invalids: testInvalids
      });
      
      expect(error.originalError.status).toBe(480);
      expect(error.originalError.error.name).toBe('ValidationError');
      expect(error.originalError.error.message).toBe(testMessage);
      expect(error.originalError.error.invalids).toEqual(testInvalids);
      expect(error.originalError.error.trace).toEqual([]);
    });
  });

  describe('Error Inheritance', () => {
    it('should call super constructor with message', () => {
      const testMessage = 'Test error message';
      const error = new ValidationError({ message: testMessage });
      
      // The Error constructor sets the message
      expect(error.message).toBe(testMessage);
    });

    it('should inherit Error properties', () => {
      const error = new ValidationError({ message: 'Test' });
      
      expect(error.name).toBeDefined();
      expect(error.message).toBeDefined();
      expect(error.stack).toBeDefined();
    });

    it('should be throwable like a standard Error', () => {
      const error = new ValidationError({ message: 'Test error' });
      
      expect(() => {
        throw error;
      }).toThrowError(Error);
      
      expect(() => {
        throw error;
      }).toThrowError(ValidationError);
    });
  });

  describe('Edge Cases', () => {
    it('should handle settings with extra properties', () => {
      const settings = {
        message: 'Test message',
        invalids: ['field1'],
        extraProperty: 'should be ignored'
      } as any;
      
      const error = new ValidationError(settings);
      expect(error.message).toBe('Test message');
      expect(error.invalids).toEqual(['field1']);
    });

    it('should handle settings with boolean false values', () => {
      const settings = {
        message: false,
        invalids: false
      } as any;
      
      const error = new ValidationError(settings);
      // Based on the !! check in constructor, false is falsy so defaults are used
      expect(error.invalids).toEqual([]);
    });

    it('should handle settings with number values', () => {
      const settings = {
        message: 123,
        invalids: 456
      } as any;
      
      const error = new ValidationError(settings);
      // Based on the !! check in constructor, truthy numbers are used
      expect(error.message as any).toBe(123);
      expect(error.invalids as any).toBe(456);
    });

    it('should handle zero values correctly', () => {
      const settings = {
        message: 0,
        invalids: 0
      } as any;
      
      const error = new ValidationError(settings);
      // Based on the !! check in constructor, 0 is falsy so defaults are used
      expect(error.invalids).toEqual([]);
    });
  });
});