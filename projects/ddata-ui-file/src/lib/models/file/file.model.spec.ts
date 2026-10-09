import type { Assertion } from 'vitest';
import { FileModel } from './file.model';
// The branded field types (ID, FileSizeInByte, ...) are not assignable from plain literals, so the matchers are untyped.
const expectLoose = (actual: unknown): Assertion<any> => expect(actual as any);

describe('FileModel', () => {
  let model: FileModel;

  beforeEach(() => {
    model = new FileModel();
  });

  describe('1. Model Creation', () => {
    it('should create the model', () => {
      expectLoose(model).toBeTruthy();
      expectLoose(model).toBeDefined();
    });
  });

  describe('2. Model Type Validation', () => {
    it('should be created as correct type', () => {
      expectLoose(model).toBeInstanceOf(FileModel);
      expectLoose(model.constructor.name).toBe('FileModel');
    });
  });

  describe('3. Required Properties', () => {
    it('should have all required properties', () => {
      // declared-only fields are created by init()
      model.init({});

      // Core BaseModel properties
      expectLoose('api_endpoint' in model).toBeTruthy();
      expectLoose('model_name' in model).toBeTruthy();
      expectLoose('validationRules' in model).toBeTruthy();
      expectLoose('fields' in model).toBeTruthy();

      // FileModel specific properties
      expectLoose('id' in model).toBeTruthy();
      expectLoose('file_name_and_path' in model).toBeTruthy();
      expectLoose('file_name_slug' in model).toBeTruthy();
      expectLoose('name' in model).toBeTruthy();
      expectLoose('size' in model).toBeTruthy();
      expectLoose('mimetype' in model).toBeTruthy();
      expectLoose('folder_id' in model).toBeTruthy();
      expectLoose('is_image' in model).toBeTruthy();
      expectLoose('is_primary' in model).toBeTruthy();
      // `folder` and `order` are UI-only fields that are declared but not initialized
      expectLoose('title' in model).toBeTruthy();
    });

    it('should have correct readonly properties values', () => {
      expectLoose(model.api_endpoint).toBe('/file/');
      expectLoose(model.model_name).toBe('FileModel');
      expectLoose(model.is_primary).toBe(false);
      expectLoose(model.title).toBe('Fájl');
    });

    it('should have validation rules defined', () => {
      expectLoose(model.validationRules).toBeDefined();
      expectLoose(typeof model.validationRules).toBe('object');

      // Verify specific validation rules
      expectLoose(model.validationRules.id).toEqual(['required', 'integer']);
      expectLoose(model.validationRules.file_name_and_path).toEqual(['required', 'string']);
      expectLoose(model.validationRules.file_name_slug).toEqual(['required', 'string']);
      expectLoose(model.validationRules.name).toEqual(['required', 'string']);
      expectLoose(model.validationRules.size).toEqual(['required', 'integer', 'not_zero']);
      expectLoose(model.validationRules.mimetype).toEqual(['required', 'string']);
      expectLoose(model.validationRules.folder_id).toEqual(['required', 'integer']);
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
      expectLoose(typeof model.api_endpoint).toBe('string');
      expectLoose(typeof model.model_name).toBe('string');
      expectLoose(typeof model.id).toBe('number');
      expectLoose(typeof model.file_name_and_path).toBe('string');
      expectLoose(typeof model.file_name_slug).toBe('string');
      expectLoose(typeof model.name).toBe('string');
      expectLoose(typeof model.size).toBe('number');
      expectLoose(typeof model.mimetype).toBe('string');
      expectLoose(typeof model.folder_id).toBe('number');
      expectLoose(typeof model.is_image).toBe('boolean');
      expectLoose(typeof model.is_primary).toBe('boolean');
    });
  });

  describe('5. init() Function', () => {
    it('should have init function', () => {
      expectLoose(typeof model.init).toBe('function');
      expectLoose(model.init).toBeDefined();
    });

    it('should provide correct output - handle undefined data', () => {
      const result = model.init(undefined);

      // Should return FileModel instance
      expectLoose(result).toBeInstanceOf(FileModel);
      expectLoose(result).toBe(model);

      // Should set default values
      expectLoose(result.id).toBe(0);
      expectLoose(result.folder_id).toBe(0);
      expectLoose(result.name).toBe('');
      expectLoose(result.file_name_and_path).toBe('');
      expectLoose(result.file_name_slug).toBe('');
      expectLoose(result.size).toBe(0);
      expectLoose(result.mimetype).toBe('');
      expectLoose(result.is_primary).toBe(false);
      expectLoose(result.is_image).toBe(false);
    });

    it('should provide correct output - handle null data', () => {
      const result = model.init(null);

      expectLoose(result).toBeInstanceOf(FileModel);
      expectLoose(result.id).toBe(0);
      expectLoose(result.folder_id).toBe(0);
      expectLoose(result.name).toBe('');
      expectLoose(result.file_name_and_path).toBe('');
      expectLoose(result.file_name_slug).toBe('');
      expectLoose(result.size).toBe(0);
      expectLoose(result.mimetype).toBe('');
      expectLoose(result.is_primary).toBe(false);
      expectLoose(result.is_image).toBe(false);
    });

    it('should provide correct output - handle empty object', () => {
      const result = model.init({});

      expectLoose(result).toBeInstanceOf(FileModel);
      expectLoose(result.id).toBe(0);
      expectLoose(result.folder_id).toBe(0);
      expectLoose(result.name).toBe('');
      expectLoose(result.file_name_and_path).toBe('');
      expectLoose(result.file_name_slug).toBe('');
      expectLoose(result.size).toBe(0);
      expectLoose(result.mimetype).toBe('');
      expectLoose(result.is_primary).toBe(false);
      expectLoose(result.is_image).toBe(false);
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

      expectLoose(result).toBeInstanceOf(FileModel);
      expectLoose(result.id).toBe(42);
      expectLoose(result.folder_id).toBe(10);
      expectLoose(result.name).toBe('test-file.jpg');
      expectLoose(result.file_name_and_path).toBe('/uploads/test-file.jpg');
      expectLoose(result.file_name_slug).toBe('test-file-jpg');
      expectLoose(result.size).toBe(2048);
      expectLoose(result.mimetype).toBe('image/jpeg');
      expectLoose(result.is_primary).toBe(true);
      expectLoose(result.is_image).toBe(true); // Should detect image mimetype
    });

    it('should provide correct output - handle partial data', () => {
      const testData = {
        id: 5,
        name: 'partial-file.txt',
        mimetype: 'text/plain'
      };
      const result = model.init(testData);

      expectLoose(result.id).toBe(5);
      expectLoose(result.name).toBe('partial-file.txt');
      expectLoose(result.mimetype).toBe('text/plain');
      expectLoose(result.folder_id).toBe(0); // Default value
      expectLoose(result.file_name_and_path).toBe(''); // Default value
      expectLoose(result.file_name_slug).toBe(''); // Default value
      expectLoose(result.size).toBe(0); // Default value
      expectLoose(result.is_primary).toBe(false); // Default value
      expectLoose(result.is_image).toBe(false); // text/plain is not image
    });

    it('should correctly detect image mimetypes', () => {
      const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];

      imageTypes.forEach((mimetype) => {
        const result = model.init({ mimetype });

        expectLoose(result.is_image).toBe(true);
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

      nonImageTypes.forEach((mimetype) => {
        const result = model.init({ mimetype });

        expectLoose(result.is_image).toBe(false);
      });
    });

    it('should handle is_primary boolean conversion', () => {
      // Test truthy values
      const truthyValues = [true, 1, 'true', 'yes', {}, []];

      truthyValues.forEach((value) => {
        const result = model.init({ is_primary: value });

        expectLoose(result.is_primary).toBe(true);
      });
      // Test falsy values
      const falsyValues = [false, 0, '', null, undefined];

      falsyValues.forEach((value) => {
        const result = model.init({ is_primary: value });

        expectLoose(result.is_primary).toBe(false);
      });
    });
  });

  describe('6. prepareToSave() Function', () => {
    it('should have prepareToSave function', () => {
      expectLoose(typeof model.prepareToSave).toBe('function');
      expectLoose(model.prepareToSave).toBeDefined();
    });

    it('should provide correct output - default values', () => {
      const result = model.prepareToSave();

      expectLoose(result).toEqual({
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

      expectLoose(result).toEqual({
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
      model.id = null;
      model.folder_id = undefined;
      model.name = null;
      model.file_name_and_path = undefined;
      model.file_name_slug = null;
      model.size = undefined;
      model.mimetype = null;
      model.is_primary = null;
      const result = model.prepareToSave();

      expectLoose(result).toEqual({
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

      expectLoose(result).not.toBeInstanceOf(FileModel);
      expectLoose(result.constructor).toBe(Object);
      expectLoose(Object.getPrototypeOf(result)).toBe(Object.prototype);
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
        'id',
        'folder_id',
        'name',
        'file_name_and_path',
        'file_name_slug',
        'size',
        'mimetype',
        'is_primary'
      ];

      expectLoose(Object.keys(result).sort()).toEqual(expectedKeys.sort());
      expectLoose('is_image' in result).toBe(false);
      expectLoose('order' in result).toBe(false);
      expectLoose('title' in result).toBe(false);
    });
  });

  describe('Additional Function Tests', () => {
    it('should support method chaining', () => {
      const result = model.init({}).prepareToSave();

      expectLoose(result).toEqual({
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

      expectLoose(() => {
        model.init(invalidData);
      }).not.toThrow();

      // Values should still be set (truthy check behavior)
      expectLoose(model.id).toBe('not-a-number');
      expectLoose(model.size).toBe('also-not-a-number');
      expectLoose(model.is_primary).toBe(true); // Truthy string becomes true
    });

    it('should handle missing mimetype for is_image detection', () => {
      model.init({ mimetype: '' });
      expectLoose(model.is_image).toBe(false);

      model.init({ mimetype: null });
      expectLoose(model.is_image).toBe(false);

      model.init({ mimetype: undefined });
      expectLoose(model.is_image).toBe(false);
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
      expectLoose(result.id).toEqual(testData.id);
      expectLoose(result.folder_id).toEqual(testData.folder_id);
      expectLoose(result.name).toBe(testData.name);
      expectLoose(result.file_name_and_path).toBe(testData.file_name_and_path);
      expectLoose(result.file_name_slug).toBe(testData.file_name_slug);
      expectLoose(result.size).toEqual(testData.size);
      expectLoose(result.mimetype).toBe(testData.mimetype);
      expectLoose(result.is_primary).toBe(testData.is_primary);
      expectLoose(result.is_image).toBe(false); // PDF is not an image
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
      expectLoose(result).toEqual({
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
      expectLoose(Object.getPrototypeOf(result)).toBe(Object.prototype);
    });
  });
});
