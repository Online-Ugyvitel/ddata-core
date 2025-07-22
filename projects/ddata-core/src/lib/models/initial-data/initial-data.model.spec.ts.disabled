import { InitialData } from './initial-data.model';
import { InitialDataInterface } from './initial-data.interface';

describe('InitialData', () => {
  let model: InitialData;

  beforeEach(() => {
    model = new InitialData();
  });

  describe('Model Creation', () => {
    it('should be created', () => {
      expect(model).toBeTruthy();
    });

    it('should be created as correct type', () => {
      expect(model).toBeInstanceOf(InitialData);
    });

    it('should implement InitialDataInterface', () => {
      expect(model).toEqual(jasmine.any(Object));
      // Check if it has all required interface properties
      expect(model.api_endpoint).toBeDefined();
      expect(model.model_name).toBeDefined();
      expect(model.loaded).toBeDefined();
      expect(typeof model.data).toBe('undefined'); // data is declared but not initialized
      expect(model.refreshTime).toBeDefined();
    });
  });

  describe('Properties', () => {
    it('should have api_endpoint property with correct type and value', () => {
      expect(model.api_endpoint).toEqual('/init');
      expect(typeof model.api_endpoint).toBe('string');
    });

    it('should have model_name property with correct type and value', () => {
      expect(model.model_name).toEqual('Init');
      expect(typeof model.model_name).toBe('string');
    });

    it('should have loaded property with correct type and default value', () => {
      expect(model.loaded).toEqual(true);
      expect(typeof model.loaded).toBe('boolean');
    });

    it('should have data property declared (but undefined until initialized)', () => {
      // The data property is declared but not initialized in constructor
      expect(model.data).toBeUndefined();
      // Once we assign a value, it should work correctly
      model.data = {};
      expect(model.data).toBeDefined();
      expect(typeof model.data).toBe('object');
    });

    it('should have refreshTime property with correct type and default value', () => {
      expect(model.refreshTime).toEqual(5000);
      expect(typeof model.refreshTime).toBe('number');
    });
  });

  describe('readonly properties', () => {
    it('readonly properties can be modified at runtime (TypeScript readonly is compile-time only)', () => {
      const originalApiEndpoint = model.api_endpoint;
      const originalModelName = model.model_name;
      
      // At runtime, readonly properties can still be modified
      (model as any).api_endpoint = '/new-endpoint';
      (model as any).model_name = 'NewModel';
      
      expect(model.api_endpoint).toEqual('/new-endpoint');
      expect(model.model_name).toEqual('NewModel');
      
      // Note: This demonstrates that TypeScript's readonly is only enforced at compile time
      // In a real application, TypeScript would prevent this modification
    });
  });

  describe('refreshTime getter', () => {
    it('should return the correct default value', () => {
      expect(model.refreshTime).toEqual(5000);
    });

    it('should return the correct value after setting', () => {
      model.refreshTime = 10000;
      expect(model.refreshTime).toEqual(10000);
    });

    it('should return correct type', () => {
      expect(typeof model.refreshTime).toBe('number');
    });
  });

  describe('refreshTime setter', () => {
    it('should set valid values correctly (>= 5000)', () => {
      model.refreshTime = 5000;
      expect(model.refreshTime).toEqual(5000);

      model.refreshTime = 10000;
      expect(model.refreshTime).toEqual(10000);

      model.refreshTime = 30000;
      expect(model.refreshTime).toEqual(30000);
    });

    it('should default to 60000 when value is null', () => {
      model.refreshTime = null;
      expect(model.refreshTime).toEqual(60000);
    });

    it('should default to 60000 when value is less than 5000', () => {
      model.refreshTime = 0;
      expect(model.refreshTime).toEqual(60000);

      model.refreshTime = 1000;
      expect(model.refreshTime).toEqual(60000);

      model.refreshTime = 4999;
      expect(model.refreshTime).toEqual(60000);
    });

    it('should handle edge case exactly at 5000', () => {
      model.refreshTime = 5000;
      expect(model.refreshTime).toEqual(5000);
    });

    it('should handle undefined values (undefined does not trigger the default logic)', () => {
      // The setter only checks for null or < 5000, undefined will be passed directly
      model.refreshTime = undefined;
      expect(model.refreshTime).toBeUndefined();
    });

    it('should handle negative values by defaulting to 60000', () => {
      model.refreshTime = -1000;
      expect(model.refreshTime).toEqual(60000);
    });

    it('should handle very large valid values', () => {
      model.refreshTime = 1000000;
      expect(model.refreshTime).toEqual(1000000);
    });

    it('should handle decimal values correctly', () => {
      model.refreshTime = 5000.5;
      expect(model.refreshTime).toEqual(5000.5);

      model.refreshTime = 4999.9;
      expect(model.refreshTime).toEqual(60000);
    });
  });

  describe('Data persistence', () => {
    it('should maintain refreshTime value across multiple operations', () => {
      model.refreshTime = 15000;
      expect(model.refreshTime).toEqual(15000);
      
      // Perform some other operations
      model.loaded = false;
      model.data = { test: 'value' };
      
      // refreshTime should remain unchanged
      expect(model.refreshTime).toEqual(15000);
    });

    it('should allow modification of loaded property', () => {
      expect(model.loaded).toBe(true);
      model.loaded = false;
      expect(model.loaded).toBe(false);
    });

    it('should allow modification of data property', () => {
      const testData = { key: 'value', number: 42 };
      model.data = testData;
      expect(model.data).toEqual(testData);
    });
  });

  describe('Interface compliance', () => {
    it('should satisfy InitialDataInterface contract', () => {
      const interfaceModel: InitialDataInterface = model;
      
      expect(typeof interfaceModel.api_endpoint).toBe('string');
      expect(typeof interfaceModel.model_name).toBe('string');
      expect(typeof interfaceModel.loaded).toBe('boolean');
      expect(typeof interfaceModel.data).toBe('undefined'); // data is declared but not initialized
      expect(typeof interfaceModel.refreshTime).toBe('number');
    });
  });

  describe('Constructor', () => {
    it('should initialize with correct default values', () => {
      const newModel = new InitialData();
      
      expect(newModel.api_endpoint).toEqual('/init');
      expect(newModel.model_name).toEqual('Init');
      expect(newModel.loaded).toEqual(true);
      expect(newModel.data).toBeUndefined(); // data is declared but not initialized
      expect(newModel.refreshTime).toEqual(5000);
    });

    it('should create independent instances', () => {
      const model1 = new InitialData();
      const model2 = new InitialData();
      
      model1.refreshTime = 10000;
      model1.loaded = false;
      
      expect(model2.refreshTime).toEqual(5000);
      expect(model2.loaded).toEqual(true);
    });
  });
});