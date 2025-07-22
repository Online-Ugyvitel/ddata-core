import { TestBed } from '@angular/core/testing';
import { faCog, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ID } from 'ddata-core';
import { BaseSearchResult } from './base-search-result.model';
import { SearchResult } from './search-result.model';
import { SearchResultInterface } from './search-result.interface';

describe('SearchResult', () => {
  let model: BaseSearchResult;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
    model = new BaseSearchResult();
  });

  describe('Model Creation', () => {
    it('should be created', () => {
      expect(model).toBeTruthy();
    });

    it('should be created as a correct type', () => {
      expect(model).toBeInstanceOf(BaseSearchResult);
      expect(model).toBeInstanceOf(SearchResult);
      expect(model instanceof SearchResult).toBe(true);
    });

    it('should implement SearchResultInterface', () => {
      // Initialize the model first to ensure properties are set
      model.init();
      
      // Check that model has all interface properties
      expect('id' in model).toBe(true);
      expect('name' in model).toBe(true);
      expect('description' in model).toBe(true);
      expect('type' in model).toBe(true);
      expect('found_model_name' in model).toBe(true);
      expect('icon' in model).toBe(true);
      expect('url' in model).toBe(true);
      expect('init' in model).toBe(true);
    });
  });

  describe('Required Properties', () => {
    beforeEach(() => {
      model.init();
    });

    it('should have id property with correct type', () => {
      expect(model.hasOwnProperty('id')).toBe(true);
      expect(typeof model.id).toBe('number');
      expect(model.id).toBe(0 as ID); // default value from initAsNumberWithDefaults
    });

    it('should have name property with correct type', () => {
      expect(model.hasOwnProperty('name')).toBe(true);
      expect(typeof model.name).toBe('string');
      expect(model.name).toBe(''); // default value from initAsStringWithDefaults
    });

    it('should have description property with correct type', () => {
      expect(model.hasOwnProperty('description')).toBe(true);
      expect(typeof model.description).toBe('string');
      expect(model.description).toBe(''); // default value
    });

    it('should have type property with correct type', () => {
      expect(model.hasOwnProperty('type')).toBe(true);
      expect(typeof model.type).toBe('string');
      expect(model.type).toBe(''); // default value
    });

    it('should have found_model_name property with correct type', () => {
      expect(model.hasOwnProperty('found_model_name')).toBe(true);
      expect(typeof model.found_model_name).toBe('string');
      expect(model.found_model_name).toBe(''); // default value
    });

    it('should have icon property with correct type', () => {
      expect(model.hasOwnProperty('icon')).toBe(true);
      expect(model.icon).toBeDefined();
      expect(model.icon).toEqual(faCog); // default icon when type is empty
    });

    it('should have url property with correct type', () => {
      expect(model.hasOwnProperty('url')).toBe(true);
      expect(typeof model.url).toBe('string');
      expect(model.url).toBe(''); // default value when type is empty
    });
  });

  describe('init() Function', () => {
    it('should have init function', () => {
      expect(typeof model.init).toBe('function');
    });

    it('should provide correct output when called without data', () => {
      const result = model.init();
      
      expect(result).toBeTruthy();
      expect(result).toBe(model); // should return the same instance
      expect(result).toBeInstanceOf(BaseSearchResult);
    });

    it('should provide correct output when called with empty data', () => {
      const result = model.init({});
      
      expect(result).toBeTruthy();
      expect(result).toBe(model);
      expect(result.id).toBe(0 as ID);
      expect(result.name).toBe('');
      expect(result.description).toBe('');
      expect(result.type).toBe('');
      expect(result.found_model_name).toBe('');
      expect(result.icon).toEqual(faCog);
      expect(result.url).toBe('');
    });

    it('should initialize properties with provided data', () => {
      const testData = {
        id: 123,
        name: 'Test Name',
        description: 'Test Description',
        type: 'test_type',
        found_model_name: 'TestModel'
      };

      const result = model.init(testData);

      expect(result.id).toBe(123 as ID);
      expect(result.name).toBe('Test Name');
      expect(result.description).toBe('Test Description');
      expect(result.type).toBe('test_type');
      expect(result.found_model_name).toBe('TestModel');
      expect(result.url).toBe('test/type'); // type converted to url format
      expect(result.icon).toEqual(faCog); // default icon since 'test_type' not in icons
    });

    it('should convert type to url format correctly', () => {
      model.init({ type: 'company_user_profile' });
      expect(model.url).toBe('company/user/profile');
    });

    it('should handle string numbers for id', () => {
      model.init({ id: '456' });
      expect(model.id).toBe(456 as ID);
      expect(typeof model.id).toBe('number');
    });

    it('should handle null/undefined values gracefully', () => {
      const testData = {
        id: null,
        name: undefined,
        description: null,
        type: undefined,
        found_model_name: null
      };

      model.init(testData);

      expect(model.id).toBe(0 as ID); // default for null
      expect(model.name).toBe(''); // default for undefined
      expect(model.description).toBe(''); // default for null
      expect(model.type).toBe(''); // default for undefined
      expect(model.found_model_name).toBe(''); // default for null
    });

    it('should return SearchResultInterface type', () => {
      const result: SearchResultInterface = model.init();
      expect(result).toBeDefined();
      expect(result.init).toBeDefined();
    });
  });

  describe('Inherited Functionality', () => {
    it('should inherit from SearchModelFunctions', () => {
      expect(model.icons).toBeDefined();
      expect(model.icons.cog).toEqual(faCog);
    });

    it('should have setIcon method functionality through init', () => {
      // Test with empty type - should use default cog icon
      model.init({ type: '' });
      expect(model.icon).toEqual(faCog);

      // Test with non-existent type - should fallback to cog icon
      model.init({ type: 'nonexistent' });
      expect(model.icon).toEqual(faCog);
    });

    it('should have setUrl method functionality through init', () => {
      // Test URL generation from type
      model.init({ type: 'user_profile' });
      expect(model.url).toBe('user/profile');

      model.init({ type: 'company_data_export' });
      expect(model.url).toBe('company/data/export');

      model.init({ type: 'simple' });
      expect(model.url).toBe('simple');
    });
  });
});