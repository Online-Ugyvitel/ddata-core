import { FileModel } from './file.model';

describe('FileModel', () => {
  let model: FileModel;

  beforeEach(() => {
    model = new FileModel();
  });

  describe('1. Model Creation', () => {
    it('should create the model', () => {
      expect(model).toBeTruthy();
      expect(model).toBeDefined();
    });
  });

  describe('2. Model Type Validation', () => {
    it('should be created as correct type', () => {
      expect(model).toBeInstanceOf(FileModel);
      expect(model.constructor.name).toBe('FileModel');
    });
  });

  describe('3. Required Properties', () => {
    it('should have all required properties', () => {
      // Core BaseModel properties
      expect('api_endpoint' in model).toBeTruthy();
      expect('model_name' in model).toBeTruthy();
      expect('validationRules' in model).toBeTruthy();
      expect('fields' in model).toBeTruthy();
      
      // FileModel specific properties
      expect('id' in model).toBeTruthy();
      expect('file_name_and_path' in model).toBeTruthy();
      expect('file_name_slug' in model).toBeTruthy();
      expect('name' in model).toBeTruthy();
      expect('size' in model).toBeTruthy();
      expect('mimetype' in model).toBeTruthy();
      expect('folder_id' in model).toBeTruthy();
      expect('is_image' in model).toBeTruthy();
      expect('is_primary' in model).toBeTruthy();
      expect('folder' in model).toBeTruthy();
      expect('order' in model).toBeTruthy();
      expect('title' in model).toBeTruthy();
    });

    it('should have correct readonly properties values', () => {
      expect(model.api_endpoint).toBe('/file/');
      expect(model.model_name).toBe('FileModel');
      expect(model.is_primary).toBe(false);
      expect(model.title).toBe('Fájl');
    });

    it('should have validation rules defined', () => {
      expect(model.validationRules).toBeDefined();
      expect(typeof model.validationRules).toBe('object');
      
      // Verify specific validation rules
      expect(model.validationRules.id).toEqual(['required', 'integer']);
      expect(model.validationRules.file_name_and_path).toEqual(['required', 'string']);
      expect(model.validationRules.file_name_slug).toEqual(['required', 'string']);
      expect(model.validationRules.name).toEqual(['required', 'string']);
      expect(model.validationRules.size).toEqual(['required', 'integer', 'not_zero']);
      expect(model.validationRules.mimetype).toEqual(['required', 'string']);
      expect(model.validationRules.folder_id).toEqual(['required', 'integer']);
    });
  });

  describe('4. Property Types', () => {
    beforeEach(() => {
      // Initialize with sample data to verify types
      model.init({
        id: 1,
        file_name_and_path: '/path/to/file.txt',
        file_name_slug: 'file-txt',
        name: 'file.txt',
        size: 1024,
        mimetype: 'text/plain',
        folder_id: 2,
        is_primary: true
      });
    });

    it('should have correct property types', () => {
      expect(typeof model.api_endpoint).toBe('string');
      expect(typeof model.model_name).toBe('string');
      expect(typeof model.id).toBe('number');
      expect(typeof model.file_name_and_path).toBe('string');
      expect(typeof model.file_name_slug).toBe('string');
      expect(typeof model.name).toBe('string');
      expect(typeof model.size).toBe('number');
      expect(typeof model.mimetype).toBe('string');
      expect(typeof model.folder_id).toBe('number');
      expect(typeof model.is_image).toBe('boolean');
      expect(typeof model.is_primary).toBe('boolean');
    });
  });

  describe('5. init() Function', () => {
    it('should have init function', () => {
      expect(typeof model.init).toBe('function');
      expect(model.init).toBeDefined();
    });

    it('should provide correct output - handle undefined data', () => {
      const result = model.init(undefined);
      
      // Should return FileModel instance
      expect(result).toBeInstanceOf(FileModel);
      expect(result).toBe(model);
      
      // Should set default values
      expect(result.id).toBe(0);
      expect(result.folder_id).toBe(0);
      expect(result.name).toBe('');
      expect(result.file_name_and_path).toBe('');
      expect(result.file_name_slug).toBe('');
      expect(result.size).toBe(0);
      expect(result.mimetype).toBe('');
      expect(result.is_primary).toBe(false);
      expect(result.is_image).toBe(false);
    });

    it('should provide correct output - handle null data', () => {
      const result = model.init(null);
      
      expect(result).toBeInstanceOf(FileModel);
      expect(result.id).toBe(0);
      expect(result.folder_id).toBe(0);
      expect(result.name).toBe('');
      expect(result.file_name_and_path).toBe('');
      expect(result.file_name_slug).toBe('');
      expect(result.size).toBe(0);
      expect(result.mimetype).toBe('');
      expect(result.is_primary).toBe(false);
      expect(result.is_image).toBe(false);
    });

    it('should provide correct output - handle empty object', () => {
      const result = model.init({});
      
      expect(result).toBeInstanceOf(FileModel);
      expect(result.id).toBe(0);
      expect(result.folder_id).toBe(0);
      expect(result.name).toBe('');
      expect(result.file_name_and_path).toBe('');
      expect(result.file_name_slug).toBe('');
      expect(result.size).toBe(0);
      expect(result.mimetype).toBe('');
      expect(result.is_primary).toBe(false);
      expect(result.is_image).toBe(false);
    });

    it('should provide correct output - initialize with valid data', () => {
      const testData = {
        id: 42,
        folder_id: 10,
        name: 'test-file.jpg',
        file_name_and_path: '/uploads/test-file.jpg',
        file_name_slug: 'test-file-jpg',
        size: 2048,
        mimetype: 'image/jpeg',
        is_primary: true
      };

      const result = model.init(testData);
      
      expect(result).toBeInstanceOf(FileModel);
      expect(result.id).toBe(42);
      expect(result.folder_id).toBe(10);
      expect(result.name).toBe('test-file.jpg');
      expect(result.file_name_and_path).toBe('/uploads/test-file.jpg');
      expect(result.file_name_slug).toBe('test-file-jpg');
      expect(result.size).toBe(2048);
      expect(result.mimetype).toBe('image/jpeg');
      expect(result.is_primary).toBe(true);
      expect(result.is_image).toBe(true); // Should detect image mimetype
    });

    it('should provide correct output - handle partial data', () => {
      const testData = {
        id: 5,
        name: 'partial-file.txt',
        mimetype: 'text/plain'
      };

      const result = model.init(testData);
      
      expect(result.id).toBe(5);
      expect(result.name).toBe('partial-file.txt');
      expect(result.mimetype).toBe('text/plain');
      expect(result.folder_id).toBe(0); // Default value
      expect(result.file_name_and_path).toBe(''); // Default value
      expect(result.file_name_slug).toBe(''); // Default value
      expect(result.size).toBe(0); // Default value
      expect(result.is_primary).toBe(false); // Default value
      expect(result.is_image).toBe(false); // text/plain is not image
    });

    it('should correctly detect image mimetypes', () => {
      const imageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'image/webp'
      ];

      imageTypes.forEach(mimetype => {
        const result = model.init({ mimetype });
        expect(result.is_image).toBe(true, `Should detect ${mimetype} as image`);
      });
    });

    it('should correctly detect non-image mimetypes', () => {
      const nonImageTypes = [
        'text/plain',
        'application/pdf',
        'video/mp4',
        'audio/mp3',
        'application/json',
        ''
      ];

      nonImageTypes.forEach(mimetype => {
        const result = model.init({ mimetype });
        expect(result.is_image).toBe(false, `Should detect ${mimetype} as non-image`);
      });
    });

    it('should handle is_primary boolean conversion', () => {
      // Test truthy values
      const truthyValues = [true, 1, 'true', 'yes', {}, []];
      truthyValues.forEach(value => {
        const result = model.init({ is_primary: value });
        expect(result.is_primary).toBe(true, `${value} should convert to true`);
      });

      // Test falsy values
      const falsyValues = [false, 0, '', null, undefined];
      falsyValues.forEach(value => {
        const result = model.init({ is_primary: value });
        expect(result.is_primary).toBe(false, `${value} should convert to false`);
      });
    });
  });

  describe('6. prepareToSave() Function', () => {
    it('should have prepareToSave function', () => {
      expect(typeof model.prepareToSave).toBe('function');
      expect(model.prepareToSave).toBeDefined();
    });

    it('should provide correct output - default values', () => {
      const result = model.prepareToSave();
      
      expect(result).toEqual({
        id: 0,
        folder_id: 0,
        name: '',
        file_name_and_path: '',
        file_name_slug: '',
        size: 0,
        mimetype: 'unknown',
        is_primary: false
      });
    });

    it('should provide correct output - with initialized data', () => {
      const testData = {
        id: 42,
        folder_id: 10,
        name: 'test-file.jpg',
        file_name_and_path: '/uploads/test-file.jpg',
        file_name_slug: 'test-file-jpg',
        size: 2048,
        mimetype: 'image/jpeg',
        is_primary: true
      };

      model.init(testData);
      const result = model.prepareToSave();
      
      expect(result).toEqual({
        id: 42,
        folder_id: 10,
        name: 'test-file.jpg',
        file_name_and_path: '/uploads/test-file.jpg',
        file_name_slug: 'test-file-jpg',
        size: 2048,
        mimetype: 'image/jpeg',
        is_primary: true
      });
    });

    it('should provide correct output - handle null/undefined values', () => {
      // Set properties to null/undefined
      model.id = null as any;
      model.folder_id = undefined as any;
      model.name = null as any;
      model.file_name_and_path = undefined as any;
      model.file_name_slug = null as any;
      model.size = undefined as any;
      model.mimetype = null as any;
      model.is_primary = null as any;

      const result = model.prepareToSave();
      
      expect(result).toEqual({
        id: 0,
        folder_id: 0,
        name: '',
        file_name_and_path: '',
        file_name_slug: '',
        size: 0,
        mimetype: 'unknown',
        is_primary: false
      });
    });

    it('should provide correct output - return plain object', () => {
      model.init({ id: 1, name: 'test.txt' });
      const result = model.prepareToSave();
      
      expect(result).not.toBeInstanceOf(FileModel);
      expect(result.constructor).toBe(Object);
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    });

    it('should provide correct output - only include save-relevant properties', () => {
      model.init({
        id: 1,
        name: 'test.txt',
        mimetype: 'text/plain'
      });
      // These properties should not be in the save output
      (model as any).is_image = true;
      (model as any).order = 5;
      (model as any).title = 'Test';

      const result = model.prepareToSave();
      const expectedKeys = [
        'id', 'folder_id', 'name', 'file_name_and_path', 
        'file_name_slug', 'size', 'mimetype', 'is_primary'
      ];
      
      expect(Object.keys(result).sort()).toEqual(expectedKeys.sort());
      expect('is_image' in result).toBe(false);
      expect('order' in result).toBe(false);
      expect('title' in result).toBe(false);
    });
  });

  describe('Additional Function Tests', () => {
    it('should support method chaining', () => {
      const result = model.init({}).prepareToSave();
      expect(result).toEqual({
        id: 0,
        folder_id: 0,
        name: '',
        file_name_and_path: '',
        file_name_slug: '',
        size: 0,
        mimetype: 'unknown',
        is_primary: false
      });
    });

    it('should handle edge cases gracefully', () => {
      // Test with invalid data types
      const invalidData = {
        id: 'not-a-number',
        size: 'also-not-a-number',
        is_primary: 'string-value'
      };

      expect(() => {
        model.init(invalidData);
      }).not.toThrow();

      // Values should still be set (truthy check behavior)
      expect(model.id).toBe('not-a-number');
      expect(model.size).toBe('also-not-a-number');
      expect(model.is_primary).toBe(true); // Truthy string becomes true
    });

    it('should handle missing mimetype for is_image detection', () => {
      model.init({ mimetype: '' });
      expect(model.is_image).toBe(false);
      
      model.init({ mimetype: null });
      expect(model.is_image).toBe(false);
      
      model.init({ mimetype: undefined });
      expect(model.is_image).toBe(false);
    });
  });
});

  describe('Model Creation', () => {
    it('should create an instance', () => {
      expect(model).toBeTruthy();
    });

    it('should be created as correct type', () => {
      expect(model).toBeInstanceOf(FileModel);
    });

    it('should implement required interface properties', () => {
      expect(model).toBeDefined();
      // Check that the model has all interface properties
      expect('id' in model).toBeTruthy();
      expect('file_name_and_path' in model).toBeTruthy();
      expect('file_name_slug' in model).toBeTruthy();
      expect('name' in model).toBeTruthy();
      expect('size' in model).toBeTruthy();
      expect('mimetype' in model).toBeTruthy();
      expect('folder_id' in model).toBeTruthy();
      expect('is_image' in model).toBeTruthy();
      expect('is_primary' in model).toBeTruthy();
    });
  });

  describe('Required Properties', () => {
    it('should have all required properties defined', () => {
      expect(model.hasOwnProperty('api_endpoint')).toBeTruthy();
      expect(model.hasOwnProperty('model_name')).toBeTruthy();
      expect(model.hasOwnProperty('id')).toBeTruthy();
      expect(model.hasOwnProperty('file_name_and_path')).toBeTruthy();
      expect(model.hasOwnProperty('file_name_slug')).toBeTruthy();
      expect(model.hasOwnProperty('name')).toBeTruthy();
      expect(model.hasOwnProperty('size')).toBeTruthy();
      expect(model.hasOwnProperty('mimetype')).toBeTruthy();
      expect(model.hasOwnProperty('folder_id')).toBeTruthy();
      expect(model.hasOwnProperty('is_image')).toBeTruthy();
      expect(model.hasOwnProperty('is_primary')).toBeTruthy();
      expect(model.hasOwnProperty('validationRules')).toBeTruthy();
      expect(model.hasOwnProperty('fields')).toBeTruthy();
    });

    it('should have correct readonly properties', () => {
      expect(model.api_endpoint).toBe('/file/');
      expect(model.model_name).toBe('FileModel');
    });

    it('should have validation rules defined', () => {
      expect(model.validationRules).toBeDefined();
      expect(typeof model.validationRules).toBe('object');
      expect(model.validationRules.id).toEqual(['required', 'integer']);
      expect(model.validationRules.file_name_and_path).toEqual(['required', 'string']);
      expect(model.validationRules.file_name_slug).toEqual(['required', 'string']);
      expect(model.validationRules.name).toEqual(['required', 'string']);
      expect(model.validationRules.size).toEqual(['required', 'integer', 'not_zero']);
      expect(model.validationRules.mimetype).toEqual(['required', 'string']);
      expect(model.validationRules.folder_id).toEqual(['required', 'integer']);
    });
  });

  describe('Property Types', () => {
    beforeEach(() => {
      // Initialize model with sample data to test types
      model.init({
        id: 1,
        file_name_and_path: '/path/to/file.txt',
        file_name_slug: 'file-txt',
        name: 'file.txt',
        size: 1024,
        mimetype: 'text/plain',
        folder_id: 2,
        is_primary: true
      });
    });

    it('should have correct types for all properties', () => {
      expect(typeof model.id).toBe('number');
      expect(typeof model.file_name_and_path).toBe('string');
      expect(typeof model.file_name_slug).toBe('string');
      expect(typeof model.name).toBe('string');
      expect(typeof model.size).toBe('number');
      expect(typeof model.mimetype).toBe('string');
      expect(typeof model.folder_id).toBe('number');
      expect(typeof model.is_image).toBe('boolean');
      expect(typeof model.is_primary).toBe('boolean');
    });

    it('should have correct types for readonly properties', () => {
      expect(typeof model.api_endpoint).toBe('string');
      expect(typeof model.model_name).toBe('string');
    });
  });

  describe('init() function', () => {
    it('should exist and be a function', () => {
      expect(typeof model.init).toBe('function');
    });

    it('should return FileModel instance', () => {
      const result = model.init({});
      expect(result).toBeInstanceOf(FileModel);
      expect(result).toBe(model); // Should return the same instance
    });

    it('should handle undefined data', () => {
      const result = model.init(undefined);
      
      expect(result.id).toEqual(0);
      expect(result.folder_id).toEqual(0);
      expect(result.name).toEqual('');
      expect(result.file_name_and_path).toEqual('');
      expect(result.file_name_slug).toEqual('');
      expect(result.size).toEqual(0);
      expect(result.mimetype).toBe('');
      expect(result.is_primary).toBe(false);
      expect(result.is_image).toBe(false);
    });

    it('should handle null data', () => {
      const result = model.init(null);
      
      expect(result.id).toEqual(0);
      expect(result.folder_id).toEqual(0);
      expect(result.name).toEqual('');
      expect(result.file_name_and_path).toEqual('');
      expect(result.file_name_slug).toEqual('');
      expect(result.size).toEqual(0);
      expect(result.mimetype).toBe('');
      expect(result.is_primary).toBe(false);
      expect(result.is_image).toBe(false);
    });

    it('should handle empty object', () => {
      const result = model.init({});
      
      expect(result.id).toEqual(0);
      expect(result.folder_id).toEqual(0);
      expect(result.name).toEqual('');
      expect(result.file_name_and_path).toEqual('');
      expect(result.file_name_slug).toEqual('');
      expect(result.size).toEqual(0);
      expect(result.mimetype).toBe('');
      expect(result.is_primary).toBe(false);
      expect(result.is_image).toBe(false);
    });

    it('should initialize with valid data', () => {
      const testData = {
        id: 42,
        folder_id: 10,
        name: 'test-file.jpg',
        file_name_and_path: '/uploads/test-file.jpg',
        file_name_slug: 'test-file-jpg',
        size: 2048,
        mimetype: 'image/jpeg',
        is_primary: true
      };

      const result = model.init(testData);
      
      expect(result.id).toEqual(42);
      expect(result.folder_id).toEqual(10);
      expect(result.name).toBe('test-file.jpg');
      expect(result.file_name_and_path).toBe('/uploads/test-file.jpg');
      expect(result.file_name_slug).toBe('test-file-jpg');
      expect(result.size).toEqual(2048);
      expect(result.mimetype).toBe('image/jpeg');
      expect(result.is_primary).toBe(true);
      expect(result.is_image).toBe(true); // Should be true for image mimetype
    });

    it('should initialize with partial data', () => {
      const testData = {
        id: 5,
        name: 'partial-file.txt',
        mimetype: 'text/plain'
      };

      const result = model.init(testData);
      
      expect(result.id).toEqual(5);
      expect(result.name).toBe('partial-file.txt');
      expect(result.mimetype).toBe('text/plain');
      expect(result.folder_id).toEqual(0); // Should use default
      expect(result.file_name_and_path).toBe(''); // Should use default
      expect(result.file_name_slug).toBe(''); // Should use default
      expect(result.size).toEqual(0); // Should use default
      expect(result.is_primary).toBe(false); // Should use default
      expect(result.is_image).toBe(false); // Should be false for non-image mimetype
    });

    it('should set is_image to true for image mimetypes', () => {
      const imageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'image/webp'
      ];

      imageTypes.forEach(mimetype => {
        const testData = { mimetype };
        const result = model.init(testData);
        expect(result.is_image).toBe(true, `Should be true for ${mimetype}`);
      });
    });

    it('should set is_image to false for non-image mimetypes', () => {
      const nonImageTypes = [
        'text/plain',
        'application/pdf',
        'video/mp4',
        'audio/mp3',
        'application/json'
      ];

      nonImageTypes.forEach(mimetype => {
        const testData = { mimetype };
        const result = model.init(testData);
        expect(result.is_image).toBe(false, `Should be false for ${mimetype}`);
      });
    });

    it('should handle is_primary boolean conversion correctly', () => {
      // Test truthy values
      const truthyValues = [true, 1, 'true', 'yes', {}, []];
      truthyValues.forEach(value => {
        const result = model.init({ is_primary: value });
        expect(result.is_primary).toBe(true, `Should be true for ${value}`);
      });

      // Test falsy values
      const falsyValues = [false, 0, '', null, undefined];
      falsyValues.forEach(value => {
        const result = model.init({ is_primary: value });
        expect(result.is_primary).toBe(false, `Should be false for ${value}`);
      });
    });
  });

  describe('prepareToSave() function', () => {
    it('should exist and be a function', () => {
      expect(typeof model.prepareToSave).toBe('function');
    });

    it('should return correct structure with default values', () => {
      const result = model.prepareToSave();
      
      expect(result).toEqual({
        id: 0,
        folder_id: 0,
        name: '',
        file_name_and_path: '',
        file_name_slug: '',
        size: 0,
        mimetype: 'unknown',
        is_primary: false
      });
    });

    it('should return correct structure with initialized data', () => {
      const testData = {
        id: 42,
        folder_id: 10,
        name: 'test-file.jpg',
        file_name_and_path: '/uploads/test-file.jpg',
        file_name_slug: 'test-file-jpg',
        size: 2048,
        mimetype: 'image/jpeg',
        is_primary: true
      };

      model.init(testData);
      const result = model.prepareToSave();
      
      expect(result).toEqual({
        id: 42,
        folder_id: 10,
        name: 'test-file.jpg',
        file_name_and_path: '/uploads/test-file.jpg',
        file_name_slug: 'test-file-jpg',
        size: 2048,
        mimetype: 'image/jpeg',
        is_primary: true
      });
    });

    it('should handle null/undefined values correctly', () => {
      // Set some properties to null/undefined
      model.id = null as any;
      model.folder_id = undefined as any;
      model.name = null as any;
      model.file_name_and_path = undefined as any;
      model.file_name_slug = null as any;
      model.size = undefined as any;
      model.mimetype = null as any;
      model.is_primary = null as any;

      const result = model.prepareToSave();
      
      expect(result).toEqual({
        id: 0,
        folder_id: 0,
        name: '',
        file_name_and_path: '',
        file_name_slug: '',
        size: 0,
        mimetype: 'unknown',
        is_primary: false
      });
    });

    it('should handle partial data correctly', () => {
      model.init({
        id: 5,
        name: 'partial.txt',
        mimetype: 'text/plain'
      });

      const result = model.prepareToSave();
      
      expect(result).toEqual({
        id: 5,
        folder_id: 0,
        name: 'partial.txt',
        file_name_and_path: '',
        file_name_slug: '',
        size: 0,
        mimetype: 'text/plain',
        is_primary: false
      });
    });

    it('should return a plain object (not a model instance)', () => {
      const result = model.prepareToSave();
      
      expect(result).not.toBeInstanceOf(FileModel);
      expect(result.constructor).toBe(Object);
    });

    it('should only include save-relevant properties', () => {
      model.init({
        id: 1,
        name: 'test.txt',
        mimetype: 'text/plain',
        is_image: true, // This should not be in the result
        order: 5, // This should not be in the result
        title: 'Test' // This should not be in the result
      });

      const result = model.prepareToSave();
      const expectedKeys = [
        'id', 'folder_id', 'name', 'file_name_and_path', 
        'file_name_slug', 'size', 'mimetype', 'is_primary'
      ];
      
      expect(Object.keys(result).sort()).toEqual(expectedKeys.sort());
      expect(result.hasOwnProperty('is_image')).toBe(false);
      expect(result.hasOwnProperty('order')).toBe(false);
      expect(result.hasOwnProperty('title')).toBe(false);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle invalid data types gracefully in init', () => {
      const invalidData = {
        id: 'not-a-number',
        size: 'also-not-a-number',
        is_primary: 'not-a-boolean'
      };

      expect(() => {
        model.init(invalidData);
      }).not.toThrow();

      // Should still set values (truthy check handles conversion)
      expect(model.id).toEqual('not-a-number'); // Truthy string
      expect(model.size).toEqual('also-not-a-number'); // Truthy string
      expect(model.is_primary).toBe(true); // Truthy string converted to true
    });

    it('should handle missing mimetype gracefully', () => {
      model.init({ mimetype: '' });
      expect(model.is_image).toBe(false);
      
      model.init({ mimetype: null });
      expect(model.is_image).toBe(false);
      
      model.init({ mimetype: undefined });
      expect(model.is_image).toBe(false);
    });

    it('should be chainable', () => {
      const result = model.init({}).prepareToSave();
      expect(result).toEqual({
        id: 0,
        folder_id: 0,
        name: '',
        file_name_and_path: '',
        file_name_slug: '',
        size: 0,
        mimetype: 'unknown',
        is_primary: false
      });
    });
  });

  describe('Function Behavior', () => {
    it('should provide correct output from init function', () => {
      const testData = {
        id: 123,
        folder_id: 456,
        name: 'example.pdf',
        file_name_and_path: '/documents/example.pdf',
        file_name_slug: 'example-pdf',
        size: 4096,
        mimetype: 'application/pdf',
        is_primary: false
      };

      const result = model.init(testData);
      
      // Verify all properties are set correctly
      expect(result.id).toEqual(testData.id);
      expect(result.folder_id).toEqual(testData.folder_id);
      expect(result.name).toBe(testData.name);
      expect(result.file_name_and_path).toBe(testData.file_name_and_path);
      expect(result.file_name_slug).toBe(testData.file_name_slug);
      expect(result.size).toEqual(testData.size);
      expect(result.mimetype).toBe(testData.mimetype);
      expect(result.is_primary).toBe(testData.is_primary);
      expect(result.is_image).toBe(false); // PDF is not an image
    });

    it('should provide correct output from prepareToSave function', () => {
      const testData = {
        id: 789,
        folder_id: 101,
        name: 'image.png',
        file_name_and_path: '/images/image.png',
        file_name_slug: 'image-png',
        size: 8192,
        mimetype: 'image/png',
        is_primary: true
      };

      model.init(testData);
      const result = model.prepareToSave();
      
      // Verify the exact structure and values
      expect(result).toEqual({
        id: 789,
        folder_id: 101,
        name: 'image.png',
        file_name_and_path: '/images/image.png',
        file_name_slug: 'image-png',
        size: 8192,
        mimetype: 'image/png',
        is_primary: true
      });

      // Verify it's a plain object
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    });
  });
});