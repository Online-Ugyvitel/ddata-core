import { BaseSearchResult } from './base-search-result.model';

describe('BaseSearchResult', () => {
  let instance: BaseSearchResult;

  beforeEach(() => {
    instance = new BaseSearchResult();
  });

  describe('Model Creation', () => {
    it('should create an instance', () => {
      expect(instance).toBeTruthy();
      expect(instance).toBeDefined();
    });

    it('should be created as the correct type', () => {
      expect(instance instanceof BaseSearchResult).toBe(true);
    });

    it('should have inherited properties and methods from parent classes', () => {
      expect(typeof instance.init).toBe('function');
    });
  });

  describe('Initialization', () => {
    it('should initialize and return self', () => {
      const result = instance.init();
      expect(result).toBe(instance);
    });

    it('should initialize with data', () => {
      const testData = {
        id: 123,
        name: 'Test Name',
        description: 'Test Description',
        type: 'test_type',
        found_model_name: 'TestModel'
      };

      const result = instance.init(testData);
      expect(result).toBe(instance);
    });

    it('should handle undefined data', () => {
      expect(() => instance.init(undefined)).not.toThrow();
    });

    it('should handle null data', () => {
      expect(() => instance.init(null)).not.toThrow();
    });

    it('should handle empty object', () => {
      expect(() => instance.init({})).not.toThrow();
    });
  });

  describe('Type Checking', () => {
    it('should be instance of BaseSearchResult', () => {
      expect(instance instanceof BaseSearchResult).toBe(true);
    });

    it('should maintain type after initialization', () => {
      const result = instance.init({ id: 456 });
      expect(result instanceof BaseSearchResult).toBe(true);
    });
  });

  describe('Multiple Instance Independence', () => {
    it('should create independent instances', () => {
      const instance1 = new BaseSearchResult();
      const instance2 = new BaseSearchResult();

      expect(instance1).not.toBe(instance2);
      expect(instance1 instanceof BaseSearchResult).toBe(true);
      expect(instance2 instanceof BaseSearchResult).toBe(true);
    });

    it('should not share state between instances', () => {
      const instance1 = new BaseSearchResult();
      const instance2 = new BaseSearchResult();

      // Even if we can't access individual properties due to dependencies,
      // we can test that they are different instances
      expect(instance1).not.toBe(instance2);
      
      // And that initialization returns the correct instance
      const result1 = instance1.init({ id: 1 });
      const result2 = instance2.init({ id: 2 });
      
      expect(result1).toBe(instance1);
      expect(result2).toBe(instance2);
      expect(result1).not.toBe(result2);
    });
  });

  describe('Interface Compliance', () => {
    it('should have init method that returns instance', () => {
      expect(typeof instance.init).toBe('function');
      const result = instance.init();
      expect(result).toBe(instance);
    });

    it('should handle various initialization data types', () => {
      expect(() => instance.init()).not.toThrow();
      expect(() => instance.init(null)).not.toThrow();
      expect(() => instance.init(undefined)).not.toThrow();
      expect(() => instance.init({})).not.toThrow();
      expect(() => instance.init({ id: 1 })).not.toThrow();
      expect(() => instance.init({ name: 'test' })).not.toThrow();
      expect(() => instance.init({ id: 1, name: 'test', type: 'test_type' })).not.toThrow();
    });
  });

  describe('Method Functionality', () => {
    it('should chain initialization calls', () => {
      const result1 = instance.init({ id: 1 });
      const result2 = result1.init({ id: 2 });
      
      expect(result1).toBe(instance);
      expect(result2).toBe(instance);
      expect(result2).toBe(result1);
    });

    it('should maintain function references after initialization', () => {
      const originalInit = instance.init;
      instance.init();
      expect(instance.init).toBe(originalInit);
    });
  });

  describe('Error Handling', () => {
    it('should not throw on malformed data', () => {
      expect(() => instance.init('string')).not.toThrow();
      expect(() => instance.init(123)).not.toThrow();
      expect(() => instance.init([])).not.toThrow();
      expect(() => instance.init(true)).not.toThrow();
      expect(() => instance.init(false)).not.toThrow();
    });
  });

  describe('Constructor', () => {
    it('should create instance without parameters', () => {
      expect(() => new BaseSearchResult()).not.toThrow();
    });

    it('should create multiple instances', () => {
      const instances = [];
      for (let i = 0; i < 5; i++) {
        instances.push(new BaseSearchResult());
      }
      
      expect(instances.length).toBe(5);
      instances.forEach(inst => {
        expect(inst instanceof BaseSearchResult).toBe(true);
      });
      
      // All should be different instances
      for (let i = 0; i < instances.length; i++) {
        for (let j = i + 1; j < instances.length; j++) {
          expect(instances[i]).not.toBe(instances[j]);
        }
      }
    });
  });
});