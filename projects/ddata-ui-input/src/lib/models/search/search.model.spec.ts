import { BaseSearch } from './base-search.model';
import { Search } from './search.model';
import { SearchInterface } from './search.interface';
import { faCog, IconDefinition } from '@fortawesome/free-solid-svg-icons';

describe('Search Model', () => {
  let model: BaseSearch;

  beforeEach(() => {
    model = new BaseSearch();
  });

  describe('Model Creation', () => {
    it('should create an instance', () => {
      expect(model).toBeTruthy();
      expect(model instanceof BaseSearch).toBe(true);
    });

    it('should be the correct type', () => {
      expect(model instanceof Search).toBe(true);
      expect(model instanceof BaseSearch).toBe(true);
    });

    it('should implement SearchInterface', () => {
      // Type checking - this will fail at compile time if interface is not implemented
      const searchInterface: SearchInterface = model;
      expect(searchInterface).toBeTruthy();
    });
  });

  describe('Required Properties', () => {
    beforeEach(() => {
      // Initialize the model first to ensure properties exist
      model.init();
    });

    it('should have api_endpoint property', () => {
      expect(model.api_endpoint).toBeDefined();
      expect(typeof model.api_endpoint).toBe('string');
      expect(model.api_endpoint).toBe('/search');
    });

    it('should have model_name property', () => {
      expect(model.model_name).toBeDefined();
      expect(typeof model.model_name).toBe('string');
      expect(model.model_name).toBe('Search');
    });

    it('should have searchText property', () => {
      expect(model.hasOwnProperty('searchText') || model.searchText !== undefined).toBe(true);
    });

    it('should have id property', () => {
      expect(model.hasOwnProperty('id') || model.id !== undefined).toBe(true);
    });

    it('should have name property', () => {
      expect(model.hasOwnProperty('name') || model.name !== undefined).toBe(true);
    });

    it('should have description property', () => {
      expect(model.hasOwnProperty('description') || model.description !== undefined).toBe(true);
    });

    it('should have type property', () => {
      expect(model.hasOwnProperty('type') || model.type !== undefined).toBe(true);
    });

    it('should have found_model_name property', () => {
      expect(model.hasOwnProperty('found_model_name') || model.found_model_name !== undefined).toBe(true);
    });

    it('should have icon property', () => {
      expect(model.hasOwnProperty('icon') || model.icon !== undefined).toBe(true);
    });

    it('should have url property', () => {
      expect(model.hasOwnProperty('url') || model.url !== undefined).toBe(true);
    });

    it('should have icons property', () => {
      expect(model.icons).toBeDefined();
      expect(typeof model.icons).toBe('object');
      expect(model.icons.cog).toBe(faCog);
    });
  });

  describe('Property Types', () => {
    beforeEach(() => {
      model.init({
        id: 123,
        searchText: 'test search',
        name: 'test name',
        description: 'test description',
        type: 'test_type',
        found_model_name: 'TestModel'
      });
    });

    it('should have correct type for searchText', () => {
      expect(typeof model.searchText).toBe('string');
    });

    it('should have correct type for id', () => {
      expect(typeof model.id).toBe('number');
    });

    it('should have correct type for name', () => {
      expect(typeof model.name).toBe('string');
    });

    it('should have correct type for description', () => {
      expect(typeof model.description).toBe('string');
    });

    it('should have correct type for type', () => {
      expect(typeof model.type).toBe('string');
    });

    it('should have correct type for found_model_name', () => {
      expect(typeof model.found_model_name).toBe('string');
    });

    it('should have correct type for icon', () => {
      expect(model.icon).toBeDefined();
      expect(typeof model.icon).toBe('object');
      expect(model.icon.iconName).toBeDefined();
    });

    it('should have correct type for url', () => {
      expect(typeof model.url).toBe('string');
    });
  });

  describe('init() method', () => {
    it('should exist', () => {
      expect(typeof model.init).toBe('function');
    });

    it('should return SearchInterface', () => {
      const result = model.init();
      expect(result).toBe(model);
      expect(result).toEqual(jasmine.any(BaseSearch));
    });

    it('should initialize with empty object when no data provided', () => {
      const result = model.init();
      expect(result.searchText).toBe('');
      expect(result.id).toBe(0 as any);
      expect(result.name).toBe('');
      expect(result.description).toBe('');
      expect(result.type).toBe('');
      expect(result.found_model_name).toBe('');
    });

    it('should initialize with undefined data', () => {
      const result = model.init(undefined);
      expect(result.searchText).toBe('');
      expect(result.id).toBe(0 as any);
      expect(result.name).toBe('');
      expect(result.description).toBe('');
      expect(result.type).toBe('');
      expect(result.found_model_name).toBe('');
    });

    it('should initialize with null data', () => {
      const result = model.init(null);
      expect(result.searchText).toBe('');
      expect(result.id).toBe(0 as any);
      expect(result.name).toBe('');
      expect(result.description).toBe('');
      expect(result.type).toBe('');
      expect(result.found_model_name).toBe('');
    });

    it('should initialize with provided data', () => {
      const testData = {
        id: 456,
        searchText: 'search term',
        name: 'Test Name',
        description: 'Test Description',
        type: 'user_profile',
        found_model_name: 'UserProfile'
      };

      const result = model.init(testData);
      expect(result.searchText).toBe('search term');
      expect(result.id).toBe(456 as any);
      expect(result.name).toBe('Test Name');
      expect(result.description).toBe('Test Description');
      expect(result.type).toBe('user_profile');
      expect(result.found_model_name).toBe('UserProfile');
    });

    it('should handle partial data', () => {
      const partialData = {
        searchText: 'partial search',
        name: 'Partial Name'
      };

      const result = model.init(partialData);
      expect(result.searchText).toBe('partial search');
      expect(result.name).toBe('Partial Name');
      expect(result.id).toBe(0 as any);
      expect(result.description).toBe('');
      expect(result.type).toBe('');
      expect(result.found_model_name).toBe('');
    });

    it('should set icon based on type', () => {
      const testData = { type: 'test_type' };
      const result = model.init(testData);
      expect(result.icon).toBe(faCog); // Should default to cog icon
    });

    it('should set url based on type', () => {
      const testData = { type: 'user_profile' };
      const result = model.init(testData);
      expect(result.url).toBe('user/profile');
    });

    it('should handle empty type for url', () => {
      const testData = { type: '' };
      const result = model.init(testData);
      expect(result.url).toBe('');
    });

    it('should convert non-string values to strings', () => {
      const testData = {
        searchText: 123,
        name: true,
        description: null,
        type: undefined,
        found_model_name: { test: 'object' }
      };

      const result = model.init(testData);
      expect(result.searchText).toBe('123');
      expect(result.name).toBe('true');
      expect(result.description).toBe('');
      expect(result.type).toBe('');
      expect(result.found_model_name).toBe('[object Object]');
    });
  });

  describe('prepareToSave() method', () => {
    it('should exist', () => {
      expect(typeof model.prepareToSave).toBe('function');
    });

    it('should return object with term property', () => {
      model.init({ searchText: 'test search' });
      const result = model.prepareToSave();
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(result.hasOwnProperty('term')).toBe(true);
    });

    it('should return term with searchText value', () => {
      model.init({ searchText: 'my search term' });
      const result = model.prepareToSave();
      
      expect(result.term).toBe('my search term');
    });

    it('should return empty string when searchText is empty', () => {
      model.init({ searchText: '' });
      const result = model.prepareToSave();
      
      expect(result.term).toBe('');
    });

    it('should return empty string when searchText is null', () => {
      model.searchText = null;
      const result = model.prepareToSave();
      
      expect(result.term).toBe('');
    });

    it('should return empty string when searchText is undefined', () => {
      model.searchText = undefined;
      const result = model.prepareToSave();
      
      expect(result.term).toBe('');
    });

    it('should return empty string when searchText is falsy', () => {
      model.searchText = false as any;
      const result = model.prepareToSave();
      
      expect(result.term).toBe('');
    });

    it('should preserve whitespace in searchText', () => {
      model.init({ searchText: '  spaced search  ' });
      const result = model.prepareToSave();
      
      expect(result.term).toBe('  spaced search  ');
    });
  });

  describe('Inherited functionality from SearchModelFunctions', () => {
    it('should call super.init() properly', () => {
      const testData = {
        id: 789,
        name: 'Super Test',
        description: 'Super Description',
        type: 'super_type',
        found_model_name: 'SuperModel',
        searchText: 'super search'
      };

      const result = model.init(testData);
      
      // Verify that both Search and SearchModelFunctions init logic was executed
      expect(result.searchText).toBe('super search'); // From Search.init
      expect(result.id).toBe(789 as any); // From SearchModelFunctions.init
      expect(result.name).toBe('Super Test'); // From SearchModelFunctions.init
      expect(result.url).toBe('super/type'); // From SearchModelFunctions.init
      expect(result.icon).toBe(faCog); // From SearchModelFunctions.init
    });
  });

  describe('Protected methods (via inherited functionality)', () => {
    describe('setUrl functionality', () => {
      it('should replace underscores with slashes in type', () => {
        model.init({ type: 'user_profile_settings' });
        expect(model.url).toBe('user/profile/settings');
      });

      it('should handle single underscore', () => {
        model.init({ type: 'user_data' });
        expect(model.url).toBe('user/data');
      });

      it('should handle no underscores', () => {
        model.init({ type: 'profile' });
        expect(model.url).toBe('profile');
      });

      it('should handle multiple consecutive underscores', () => {
        model.init({ type: 'user__profile' });
        expect(model.url).toBe('user//profile');
      });

      it('should handle empty type', () => {
        model.init({ type: '' });
        expect(model.url).toBe('');
      });
    });

    describe('setIcon functionality', () => {
      it('should return cog icon when type is empty', () => {
        model.init({ type: '' });
        expect(model.icon).toBe(faCog);
      });

      it('should return cog icon when type is null', () => {
        model.init({ type: null });
        expect(model.icon).toBe(faCog);
      });

      it('should return cog icon when type is undefined', () => {
        model.init({ type: undefined });
        expect(model.icon).toBe(faCog);
      });

      it('should return cog icon for unknown type', () => {
        model.init({ type: 'unknown_type' });
        expect(model.icon).toBe(faCog);
      });

      it('should return cog icon when type exists but not in icons', () => {
        model.init({ type: 'custom_type' });
        expect(model.icon).toBe(faCog);
      });
    });
  });

  describe('Default property values', () => {
    it('should have correct readonly property values', () => {
      expect(model.api_endpoint).toBe('/search');
      expect(model.model_name).toBe('Search');
    });

    it('should have icons object with cog icon', () => {
      expect(model.icons).toBeDefined();
      expect(model.icons.cog).toBe(faCog);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle complex data structures in init', () => {
      const complexData = {
        searchText: { toString: () => 'complex search' },
        id: '999',
        name: ['array', 'name'],
        nested: {
          deep: {
            value: 'should be ignored'
          }
        }
      };

      const result = model.init(complexData);
      expect(result.searchText).toBe('complex search');
      expect(result.id).toBe(999 as any);
      expect(result.name).toBe('array,name');
    });

    it('should maintain object reference integrity', () => {
      const result1 = model.init();
      const result2 = model.init();
      
      expect(result1).toBe(model);
      expect(result2).toBe(model);
      expect(result1).toBe(result2);
    });

    it('should handle boolean searchText in prepareToSave', () => {
      model.searchText = true as any;
      const result = model.prepareToSave();
      expect(result.term).toBe(true); // The method returns the original value, not string conversion
    });

    it('should handle numeric searchText in prepareToSave', () => {
      model.searchText = 12345 as any;
      const result = model.prepareToSave();
      expect(result.term).toBe(12345); // The method returns the original value, not string conversion
    });
  });
});