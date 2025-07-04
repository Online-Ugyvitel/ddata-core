import { BaseSearch } from './base-search.model';
import { Search } from './search.model';
import { SearchInterface } from './search.interface';
import { faUser } from '@fortawesome/free-solid-svg-icons';

describe('BaseSearch', () => {
  let model: BaseSearch;

  beforeEach(() => {
    model = new BaseSearch();
  });

  describe('Model Creation', () => {
    it('should be created', () => {
      expect(model).toBeTruthy();
    });

    it('should be an instance of BaseSearch', () => {
      expect(model instanceof BaseSearch).toBe(true);
    });

    it('should be an instance of Search', () => {
      expect(model instanceof Search).toBe(true);
    });

    it('should implement SearchInterface', () => {
      // Check that the model has required SearchInterface properties
      expect(model).toEqual(jasmine.objectContaining({
        api_endpoint: jasmine.any(String),
        model_name: jasmine.any(String)
      }));
    });
  });

  describe('Inherited Functionality', () => {
    it('should have init method', () => {
      expect(typeof model.init).toBe('function');
    });

    it('should have prepareToSave method', () => {
      expect(typeof model.prepareToSave).toBe('function');
    });

    it('should initialize with empty data', () => {
      const result = model.init();
      expect(result).toBe(model);
      expect(model.searchText).toBe('');
    });

    it('should initialize with provided data', () => {
      const testData = { searchText: 'test search' };
      const result = model.init(testData);
      expect(result).toBe(model);
      expect(model.searchText).toBe('test search');
    });

    it('should initialize with null data', () => {
      const result = model.init(null);
      expect(result).toBe(model);
      expect(model.searchText).toBe('');
    });

    it('should initialize with undefined data', () => {
      const result = model.init(undefined);
      expect(result).toBe(model);
      expect(model.searchText).toBe('');
    });

    it('should initialize inherited properties with data', () => {
      const testData = { 
        searchText: 'test search',
        id: 123,
        name: 'test name',
        description: 'test description',
        type: 'test_type',
        found_model_name: 'TestModel'
      };
      const result = model.init(testData);
      expect(result).toBe(model);
      expect(model.searchText).toBe('test search');
      expect(model.id).toBeDefined();
      expect(model.name).toBe('test name');
      expect(model.description).toBe('test description');
      expect(model.type).toBe('test_type');
      expect(model.found_model_name).toBe('TestModel');
      expect(model.url).toBe('test/type'); // setUrl converts underscores to slashes
      expect(model.icon).toBeDefined();
    });

    it('should set default icon when type is empty', () => {
      const testData = { type: '' };
      model.init(testData);
      expect(model.icon).toBe(model.icons.cog);
    });

    it('should set default icon when type is not in icons', () => {
      const testData = { type: 'unknown_type' };
      model.init(testData);
      expect(model.icon).toBe(model.icons.cog);
    });

    it('should set custom icon when type matches icons property', () => {
      // First, add a custom icon to the model's icons
      model.icons['user'] = faUser;
      
      const testData = { type: 'user' };
      model.init(testData);
      expect(model.icon).toBe(faUser);
      expect(model.icon).not.toBe(model.icons.cog);
    });

    it('should handle type with underscores in URL generation', () => {
      const testData = { type: 'test_type_with_underscores' };
      model.init(testData);
      expect(model.url).toBe('test/type/with/underscores');
    });

    it('should set cog icon when type is not provided', () => {
      const testData = {};
      model.init(testData);
      expect(model.icon).toBe(model.icons.cog);
    });

    it('should prepare data for save with empty searchText', () => {
      model.searchText = '';
      const result = model.prepareToSave();
      expect(result).toEqual({ term: '' });
    });

    it('should prepare data for save with searchText', () => {
      model.searchText = 'test search';
      const result = model.prepareToSave();
      expect(result).toEqual({ term: 'test search' });
    });

    it('should prepare data for save with null searchText', () => {
      model.searchText = null as any;
      const result = model.prepareToSave();
      expect(result).toEqual({ term: '' });
    });

    it('should prepare data for save with undefined searchText', () => {
      model.searchText = undefined as any;
      const result = model.prepareToSave();
      expect(result).toEqual({ term: '' });
    });
  });

  describe('Properties', () => {
    it('should have correct api_endpoint', () => {
      expect(model.api_endpoint).toBe('/search');
    });

    it('should have correct model_name', () => {
      expect(model.model_name).toBe('Search');
    });

    it('should have searchText property after init', () => {
      model.init();
      expect('searchText' in model).toBe(true);
    });
  });
});