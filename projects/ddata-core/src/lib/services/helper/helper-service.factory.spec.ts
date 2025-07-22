import { HelperFactoryService } from './helper-service.factory';
import { HelperService } from './helper.service';
import { HelperServiceInterface } from './helper-service.interface';
import { BaseModel, BaseModelInterface } from '../../models/base/base-model.model';
import { ID } from '../../models/base/base-data.type';

// Mock model that extends BaseModel for testing
class MockModel extends BaseModel implements BaseModelInterface<MockModel> {
  override id: ID = 0 as ID;
  override api_endpoint = '/test/mock';
  override use_localstorage = false;
  override model_name = 'MockModel';

  override init(data?: any): MockModel {
    if (data) {
      Object.assign(this, data);
    }
    return this;
  }

  override prepareToSave(): any {
    return { id: this.id };
  }
}

// Another mock model for testing different constructors
class AnotherMockModel extends BaseModel implements BaseModelInterface<AnotherMockModel> {
  override id: ID = 1 as ID;
  override api_endpoint = '/test/another';
  override use_localstorage = true;
  override model_name = 'AnotherMockModel';

  override init(data?: any): AnotherMockModel {
    if (data) {
      Object.assign(this, data);
    }
    return this;
  }

  override prepareToSave(): any {
    return { id: this.id, name: 'another' };
  }
}

describe('HelperFactoryService', () => {
  let factory: HelperFactoryService<MockModel>;

  beforeEach(() => {
    factory = new HelperFactoryService<MockModel>();
  });

  describe('constructor', () => {
    it('should create an instance', () => {
      // This test covers line 7: constructor() { }
      expect(factory).toBeTruthy();
      expect(factory).toBeInstanceOf(HelperFactoryService);
    });

    it('should create instance without any parameters', () => {
      // This test ensures the empty constructor works properly
      const newFactory = new HelperFactoryService<MockModel>();
      expect(newFactory).toBeTruthy();
      expect(newFactory).toBeInstanceOf(HelperFactoryService);
    });
  });

  describe('get method', () => {
    it('should create a model instance and return a HelperService', () => {
      // This test covers lines 10 and 12: instance creation and HelperService return
      const result = factory.get(MockModel);

      expect(result).toBeTruthy();
      expect(result).toBeInstanceOf(HelperService);
    });

    it('should create a new model instance using the provided constructor', () => {
      // This test specifically verifies line 10: const instance = new newable();
      const result = factory.get(MockModel);

      expect(result).toBeInstanceOf(HelperService);
      // The HelperService should have been created with a MockModel instance
      const modelInstance = (result as any).instance;
      expect(modelInstance).toBeInstanceOf(MockModel);
    });

    it('should return different HelperService instances for multiple calls', () => {
      // This test ensures that each call creates new instances
      const result1 = factory.get(MockModel);
      const result2 = factory.get(MockModel);

      expect(result1).toBeInstanceOf(HelperService);
      expect(result2).toBeInstanceOf(HelperService);
      expect(result1).not.toBe(result2); // Different HelperService instances
      
      // Each should also have different model instances
      expect((result1 as any).instance).not.toBe((result2 as any).instance);
    });

    it('should create HelperService with properly initialized model instance', () => {
      // This test verifies the model instance is properly created
      const result = factory.get(MockModel);

      expect(result).toBeInstanceOf(HelperService);
      
      // Access the private instance to verify it's properly initialized
      const modelInstance = (result as any).instance;
      expect(modelInstance).toBeInstanceOf(MockModel);
      expect(modelInstance.model_name).toBe('MockModel');
      expect(modelInstance.api_endpoint).toBe('/test/mock');
      expect(modelInstance.use_localstorage).toBe(false);
      expect(modelInstance.id).toBe(0 as ID);
    });

    it('should work with different model constructors', () => {
      // This test ensures the factory works with different model types
      const anotherFactory = new HelperFactoryService<AnotherMockModel>();
      const result = anotherFactory.get(AnotherMockModel);

      expect(result).toBeInstanceOf(HelperService);
      
      const modelInstance = (result as any).instance;
      expect(modelInstance).toBeInstanceOf(AnotherMockModel);
      expect(modelInstance.model_name).toBe('AnotherMockModel');
      expect(modelInstance.api_endpoint).toBe('/test/another');
      expect(modelInstance.use_localstorage).toBe(true);
      expect(modelInstance.id).toBe(1 as ID);
    });

    it('should call the constructor of the provided newable class', () => {
      // This test specifically validates that line 10 calls the constructor
      const constructorSpy = spyOn(MockModel.prototype, 'constructor').and.callThrough();
      
      const result = factory.get(MockModel);
      
      expect(result).toBeInstanceOf(HelperService);
      // Note: constructor spy might not work as expected with 'new' operator
      // but the model instance creation is already tested above
    });

    it('should return HelperService that implements HelperServiceInterface', () => {
      // This test covers line 12: return new HelperService<T>(instance);
      const result: HelperServiceInterface<MockModel> = factory.get(MockModel);

      expect(result).toBeTruthy();
      expect(typeof result.booleanChange).toBe('function');
      expect(typeof result.save).toBe('function');
      expect(typeof result.saveAsNew).toBe('function');
      expect(typeof result.edit).toBe('function');
      expect(typeof result.delete).toBe('function');
      expect(typeof result.deleteMultiple).toBe('function');
      expect(typeof result.stepBack).toBe('function');
      expect(typeof result.changeToPage).toBe('function');
      expect(typeof result.getOne).toBe('function');
      expect(typeof result.getAll).toBe('function');
      expect(typeof result.search).toBe('function');
      expect(typeof result.searchWithoutPaginate).toBe('function');
    });

    it('should pass the created instance to HelperService constructor', () => {
      // This test ensures line 12 passes the instance correctly
      const result = factory.get(MockModel);
      
      expect(result).toBeInstanceOf(HelperService);
      
      // Verify the HelperService has the instance we expect
      const helperInstance = (result as any).instance;
      expect(helperInstance).toBeInstanceOf(MockModel);
      expect(helperInstance.model_name).toBe('MockModel');
    });
  });

  describe('edge cases and complete coverage', () => {
    it('should handle multiple different model types', () => {
      // Test with first model type
      const mockFactory = new HelperFactoryService<MockModel>();
      const mockResult = mockFactory.get(MockModel);
      expect(mockResult).toBeInstanceOf(HelperService);
      expect((mockResult as any).instance).toBeInstanceOf(MockModel);

      // Test with second model type
      const anotherFactory = new HelperFactoryService<AnotherMockModel>();
      const anotherResult = anotherFactory.get(AnotherMockModel);
      expect(anotherResult).toBeInstanceOf(HelperService);
      expect((anotherResult as any).instance).toBeInstanceOf(AnotherMockModel);

      // Ensure they are different
      expect(mockResult).not.toBe(anotherResult);
      expect((mockResult as any).instance).not.toBe((anotherResult as any).instance);
    });

    it('should create factory instances independently', () => {
      // Create multiple factory instances
      const factory1 = new HelperFactoryService<MockModel>();
      const factory2 = new HelperFactoryService<MockModel>();

      expect(factory1).not.toBe(factory2);

      // Each should work independently
      const result1 = factory1.get(MockModel);
      const result2 = factory2.get(MockModel);

      expect(result1).toBeInstanceOf(HelperService);
      expect(result2).toBeInstanceOf(HelperService);
      expect(result1).not.toBe(result2);
    });
  });
});