import { faCog } from '@fortawesome/free-solid-svg-icons';
import { SearchModelFunctions } from './search-model-functions';

describe('SearchModelFunctions', () => {
  let model: SearchModelFunctions;

  beforeEach(() => {
    model = new SearchModelFunctions();
  });

  describe('Model creation', () => {
    it('should be created', () => {
      expect(model).toBeTruthy();
      expect(model).toBeInstanceOf(SearchModelFunctions);
    });
  });

  describe('Properties', () => {
    it('should have all required properties after init', () => {
      model.init();

      expect(Object.prototype.hasOwnProperty.call(model, 'id')).toBeTruthy();
      expect(Object.prototype.hasOwnProperty.call(model, 'name')).toBeTruthy();
      expect(Object.prototype.hasOwnProperty.call(model, 'description')).toBeTruthy();
      expect(Object.prototype.hasOwnProperty.call(model, 'type')).toBeTruthy();
      expect(Object.prototype.hasOwnProperty.call(model, 'found_model_name')).toBeTruthy();
      expect(Object.prototype.hasOwnProperty.call(model, 'icon')).toBeTruthy();
      expect(Object.prototype.hasOwnProperty.call(model, 'url')).toBeTruthy();
      expect(Object.prototype.hasOwnProperty.call(model, 'icons')).toBeTruthy();
    });

    it('should have icons property with correct default value', () => {
      expect(model.icons).toBeDefined();
      expect(model.icons.cog).toBe(faCog);
    });

    it('should have correct property types after initialization', () => {
      model.init();

      expect(typeof model.id).toBe('number');
      expect(typeof model.name).toBe('string');
      expect(typeof model.description).toBe('string');
      expect(typeof model.type).toBe('string');
      expect(typeof model.found_model_name).toBe('string');
      expect(typeof model.url).toBe('string');
      expect(model.icon).toBeDefined();
    });
  });

  describe('init() method', () => {
    it('should initialize with default values when no data provided', () => {
      const result = model.init();

      expect(result).toBe(model);
      expect(model.name).toBe('');
      expect(model.description).toBe('');
      expect(model.type).toBe('');
      expect(model.found_model_name).toBe('');
      expect(model.icon).toBe(faCog);
      expect(model.url).toBe('');
    });

    it('should initialize with default values when empty object provided', () => {
      const result = model.init({});

      expect(result).toBe(model);
      expect(model.name).toBe('');
      expect(model.description).toBe('');
      expect(model.type).toBe('');
      expect(model.found_model_name).toBe('');
      expect(model.icon).toBe(faCog);
      expect(model.url).toBe('');
    });

    it('should initialize with provided values', () => {
      const testData = {
        id: 123,
        name: 'Test Name',
        description: 'Test Description',
        type: 'test_type',
        found_model_name: 'TestModel'
      };
      const result = model.init(testData);

      expect(result).toBe(model);
      expect(model.name).toBe('Test Name');
      expect(model.description).toBe('Test Description');
      expect(model.type).toBe('test_type');
      expect(model.found_model_name).toBe('TestModel');
      expect(model.url).toBe('test/type');
      expect(model.icon).toBe(faCog); // Should use default icon for unknown type
    });

    it('should handle undefined data parameter', () => {
      const result = model.init(undefined);

      expect(result).toBe(model);
      expect(model.name).toBe('');
      expect(model.description).toBe('');
      expect(model.type).toBe('');
      expect(model.found_model_name).toBe('');
      expect(model.icon).toBe(faCog);
      expect(model.url).toBe('');
    });

    it('should handle null data parameter', () => {
      const result = model.init(null);

      expect(result).toBe(model);
      expect(model.name).toBe('');
      expect(model.description).toBe('');
      expect(model.type).toBe('');
      expect(model.found_model_name).toBe('');
      expect(model.icon).toBe(faCog);
      expect(model.url).toBe('');
    });

    it('should set icon and url correctly based on type', () => {
      const testData = {
        type: 'user_profile'
      };

      model.init(testData);

      expect(model.url).toBe('user/profile');
      expect(model.icon).toBe(faCog); // Since 'user_profile' is not in icons, should default to cog
    });
  });

  describe('setUrl() method', () => {
    it('should replace underscores with forward slashes', () => {
      const result = model['setUrl']('test_type');

      expect(result).toBe('test/type');
    });

    it('should handle multiple underscores', () => {
      const result = model['setUrl']('user_profile_settings');

      expect(result).toBe('user/profile/settings');
    });

    it('should handle type without underscores', () => {
      const result = model['setUrl']('simple');

      expect(result).toBe('simple');
    });

    it('should handle empty string', () => {
      const result = model['setUrl']('');

      expect(result).toBe('');
    });

    it('should handle type with consecutive underscores', () => {
      const result = model['setUrl']('test__double__underscore');

      expect(result).toBe('test/double/underscore');
    });
  });

  describe('setIcon() method', () => {
    it('should return cog icon for empty type', () => {
      const result = model['setIcon']('');

      expect(result).toBe(faCog);
    });

    it('should return cog icon for null type', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = model['setIcon'](null as any);

      expect(result).toBe(faCog);
    });

    it('should return cog icon for undefined type', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = model['setIcon'](undefined as any);

      expect(result).toBe(faCog);
    });

    it('should return cog icon for unknown type', () => {
      const result = model['setIcon']('unknown_type');

      expect(result).toBe(faCog);
    });

    it('should return specific icon if type exists in icons', () => {
      // First add an icon to the icons collection
      model.icons['test'] = faCog;
      const result = model['setIcon']('test');

      expect(result).toBe(faCog);
    });

    it('should return cog icon as fallback when type exists but has falsy value', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      model.icons['test'] = null as any;
      const result = model['setIcon']('test');

      expect(result).toBe(faCog);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle non-string values in data fields gracefully', () => {
      const testData = {
        id: '456', // String that should be converted to number
        name: 123, // Number that should be converted to string
        description: null,
        type: undefined,
        found_model_name: false
      };
      const result = model.init(testData);

      expect(result).toBe(model);
      expect(typeof model.name).toBe('string');
      expect(typeof model.description).toBe('string');
      expect(typeof model.type).toBe('string');
      expect(typeof model.found_model_name).toBe('string');
    });

    it('should maintain method chaining capability', () => {
      const result = model.init({ name: 'Test' });

      expect(result).toBe(model);
      expect(result.name).toBe('Test');
    });
  });
});
