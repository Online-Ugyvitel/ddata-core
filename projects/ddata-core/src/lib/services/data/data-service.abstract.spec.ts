import { DataServiceAbstract } from './data-service.abstract';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { Paginate } from '../../models/paginate/paginate.model';
import { MockModel } from './mock-model';
import { TestDataService } from './test-data-service';

describe('DataServiceAbstract', () => {
  let service: TestDataService;
  let mockModel: MockModel;

  beforeEach(() => {
    mockModel = new MockModel();
    service = new TestDataService(mockModel);
  });

  describe('Constructor', () => {
    it('should create an instance', () => {
      expect(service).toBeTruthy();
      expect(service instanceof DataServiceAbstract).toBe(true);
    });

    it('should set the model property', () => {
      expect(service.model).toBe(mockModel);
      expect(service.model instanceof MockModel).toBe(true);
    });

    it('should store reference to the same model instance', () => {
      const anotherModel = new MockModel();
      const anotherService = new TestDataService(anotherModel);
      
      expect(anotherService.model).toBe(anotherModel);
      expect(anotherService.model).not.toBe(mockModel);
    });
  });

  describe('hydrate method', () => {
    it('should create a clone of the source object', () => {
      const source = { id: 1, name: 'test' };
      const data = { id: 2, name: 'updated', extra: 'field' };
      
      const result = service.hydrate(source, data);
      
      expect(result).not.toBe(source);
      expect(result).not.toBe(data);
      expect(result.id).toBe(2);
      expect(result.name).toBe('updated');
      expect(result.extra).toBe('field');
    });

    it('should maintain prototype chain', () => {
      const source = new MockModel();
      const data = { id: 123, name: 'cloned' };
      
      const result = service.hydrate(source, data);
      
      expect(Object.getPrototypeOf(result)).toBe(Object.getPrototypeOf(source));
      expect(result instanceof MockModel).toBe(true);
    });

    it('should handle empty data object', () => {
      const source = { id: 1, name: 'test' };
      const data = {};
      
      const result = service.hydrate(source, data);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('should handle null values', () => {
      const source = { id: 1, name: 'test' };
      const data = { id: null, name: null };
      
      const result = service.hydrate(source, data);
      
      expect(result.id).toBe(null);
      expect(result.name).toBe(null);
    });

    it('should copy all properties from data', () => {
      const source = new MockModel();
      const data = {
        id: 42,
        name: 'test model',
        items: [1, 2, 3],
        tags: ['tag1', 'tag2'],
        newProperty: 'new value'
      };
      
      const result = service.hydrate(source, data);
      
      expect(result.id).toBe(42);
      expect(result.name).toBe('test model');
      expect(result.items).toEqual([1, 2, 3]);
      expect(result.tags).toEqual(['tag1', 'tag2']);
      expect(result.newProperty).toBe('new value');
    });
  });

  describe('hydrateArray method', () => {
    it('should return empty array when input is empty', () => {
      const result = service.hydrateArray([]);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should hydrate single item', () => {
      const data = [{ id: 1, name: 'item1' }];
      spyOn(mockModel, 'init').and.returnValue(new MockModel());
      
      const result = service.hydrateArray(data);
      
      expect(result.length).toBe(1);
      expect(mockModel.init).toHaveBeenCalledWith({ id: 1, name: 'item1' });
    });

    it('should hydrate multiple items', () => {
      const data = [
        { id: 1, name: 'item1' },
        { id: 2, name: 'item2' },
        { id: 3, name: 'item3' }
      ];
      spyOn(mockModel, 'init').and.returnValue(new MockModel());
      
      const result = service.hydrateArray(data);
      
      expect(result.length).toBe(3);
      expect(mockModel.init).toHaveBeenCalledTimes(3);
      expect(mockModel.init).toHaveBeenCalledWith({ id: 1, name: 'item1' });
      expect(mockModel.init).toHaveBeenCalledWith({ id: 2, name: 'item2' });
      expect(mockModel.init).toHaveBeenCalledWith({ id: 3, name: 'item3' });
    });

    it('should clear array properties in model before cloning', () => {
      // Set up model with array properties
      mockModel.items = [1, 2, 3];
      mockModel.tags = ['existing', 'tags'];
      
      const data = [{ id: 1, name: 'item1' }];
      spyOn(mockModel, 'init').and.returnValue(new MockModel());
      
      service.hydrateArray(data);
      
      // Arrays should be cleared
      expect(mockModel.items).toEqual([]);
      expect(mockModel.tags).toEqual([]);
    });

    it('should handle model with no array properties', () => {
      // Create a model without array properties
      const simpleModel = { id: 1, name: 'test' };
      const simpleService = new TestDataService(simpleModel as any);
      
      const data = [{ id: 1, name: 'item1' }];
      
      // Should not throw error
      expect(() => {
        simpleService.hydrateArray(data);
      }).not.toThrow();
    });

    it('should handle items with different structures', () => {
      const data = [
        { id: 1, name: 'item1', extra: 'field1' },
        { id: 2, title: 'item2' }, // different structure
        { name: 'item3' }, // missing id
        {} // empty object
      ];
      spyOn(mockModel, 'init').and.returnValue(new MockModel());
      
      const result = service.hydrateArray(data);
      
      expect(result.length).toBe(4);
      expect(mockModel.init).toHaveBeenCalledTimes(4);
    });

    it('should create separate clones for each item', () => {
      const data = [
        { id: 1, name: 'item1' },
        { id: 2, name: 'item2' }
      ];
      
      const model1 = new MockModel();
      const model2 = new MockModel();
      spyOn(mockModel, 'init').and.returnValues(model1, model2);
      
      const result = service.hydrateArray(data);
      
      expect(result.length).toBe(2);
      expect(result[0]).toBe(model1);
      expect(result[1]).toBe(model2);
      expect(result[0]).not.toBe(result[1]);
    });

    it('should handle null and undefined values in data', () => {
      const data = [
        { id: 1, name: null },
        { id: null, name: 'item2' },
        { id: undefined, name: undefined }
      ];
      spyOn(mockModel, 'init').and.returnValue(new MockModel());
      
      const result = service.hydrateArray(data);
      
      expect(result.length).toBe(3);
      expect(mockModel.init).toHaveBeenCalledTimes(3);
    });

    it('should preserve the order of items', () => {
      const data = [
        { id: 3, name: 'third' },
        { id: 1, name: 'first' },
        { id: 2, name: 'second' }
      ];
      
      const models = [
        Object.assign(new MockModel(), { id: 3, name: 'third' }),
        Object.assign(new MockModel(), { id: 1, name: 'first' }),
        Object.assign(new MockModel(), { id: 2, name: 'second' })
      ];
      
      spyOn(mockModel, 'init').and.returnValues(...models);
      
      const result = service.hydrateArray(data);
      
      expect(result[0]).toBe(models[0]);
      expect(result[1]).toBe(models[1]);
      expect(result[2]).toBe(models[2]);
    });
  });

  describe('getNewPaginateObject method', () => {
    let mockPaginateData: any;

    beforeEach(() => {
      mockPaginateData = {
        current_page: 1,
        per_page: 10,
        from: 1,
        to: 10,
        total: 100,
        last_page: 10,
        data: [
          { id: 1, name: 'item1' },
          { id: 2, name: 'item2' }
        ]
      };
    });

    it('should create a PaginateInterface object', () => {
      spyOn(service, 'hydrateArray').and.returnValue([]);
      
      const result = service.getNewPaginateObject(MockModel, mockPaginateData);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('should hydrate paginate object with provided data', () => {
      spyOn(service, 'hydrateArray').and.returnValue([]);
      spyOn(service, 'hydrate').and.callThrough();
      
      const result = service.getNewPaginateObject(MockModel, mockPaginateData);
      
      expect(service.hydrate).toHaveBeenCalledWith(jasmine.any(Paginate), mockPaginateData);
    });

    it('should call hydrateArray with data property', () => {
      spyOn(service, 'hydrateArray').and.returnValue([]);
      
      service.getNewPaginateObject(MockModel, mockPaginateData);
      
      expect(service.hydrateArray).toHaveBeenCalledWith(mockPaginateData.data);
    });

    it('should set data property with hydrated array', () => {
      const hydratedModels = [new MockModel(), new MockModel()];
      spyOn(service, 'hydrateArray').and.returnValue(hydratedModels);
      
      const result = service.getNewPaginateObject(MockModel, mockPaginateData);
      
      expect(result.data).toBe(hydratedModels);
      expect(result.data.length).toBe(2);
    });

    it('should preserve paginate metadata', () => {
      spyOn(service, 'hydrateArray').and.returnValue([]);
      
      const result = service.getNewPaginateObject(MockModel, mockPaginateData);
      
      expect(result.current_page).toBe(1);
      expect(result.per_page).toBe(10);
      expect(result.from).toBe(1);
      expect(result.to).toBe(10);
      expect(result.total).toBe(100);
      expect(result.last_page).toBe(10);
    });

    it('should handle empty data array', () => {
      const emptyPaginateData = {
        ...mockPaginateData,
        data: []
      };
      spyOn(service, 'hydrateArray').and.returnValue([]);
      
      const result = service.getNewPaginateObject(MockModel, emptyPaginateData);
      
      expect(result.data).toEqual([]);
      expect(service.hydrateArray).toHaveBeenCalledWith([]);
    });

    it('should handle missing data property', () => {
      const noPaginateData = {
        current_page: 1,
        per_page: 10,
        total: 0
        // no data property
      };
      spyOn(service, 'hydrateArray').and.returnValue([]);
      
      const result = service.getNewPaginateObject(MockModel, noPaginateData);
      
      expect(service.hydrateArray).toHaveBeenCalledWith(undefined);
    });

    it('should return object that implements PaginateInterface', () => {
      spyOn(service, 'hydrateArray').and.returnValue([]);
      
      const result = service.getNewPaginateObject(MockModel, mockPaginateData);
      
      // Check that result has all PaginateInterface properties
      expect(result.hasOwnProperty('current_page')).toBe(true);
      expect(result.hasOwnProperty('per_page')).toBe(true);
      expect(result.hasOwnProperty('from')).toBe(true);
      expect(result.hasOwnProperty('to')).toBe(true);
      expect(result.hasOwnProperty('data')).toBe(true);
      expect(result.hasOwnProperty('total')).toBe(true);
      expect(result.hasOwnProperty('last_page')).toBe(true);
    });

    it('should handle complex paginate data structure', () => {
      const complexPaginateData = {
        current_page: 2,
        per_page: 5,
        from: 6,
        to: 10,
        total: 50,
        last_page: 10,
        data: [
          { id: 6, name: 'item6', tags: ['tag1', 'tag2'] },
          { id: 7, name: 'item7', items: [1, 2, 3] },
          { id: 8, name: 'item8' },
          { id: 9, name: 'item9' },
          { id: 10, name: 'item10' }
        ]
      };
      
      const hydratedModels = complexPaginateData.data.map(item => {
        const model = new MockModel();
        return model.init(item);
      });
      
      spyOn(service, 'hydrateArray').and.returnValue(hydratedModels);
      
      const result = service.getNewPaginateObject(MockModel, complexPaginateData);
      
      expect(result.current_page).toBe(2);
      expect(result.per_page).toBe(5);
      expect(result.data.length).toBe(5);
      expect(service.hydrateArray).toHaveBeenCalledWith(complexPaginateData.data);
    });
  });

  describe('Integration tests', () => {
    it('should work with real workflow - paginate with data hydration', () => {
      const paginateData = {
        current_page: 1,
        per_page: 2,
        from: 1,
        to: 2,
        total: 4,
        last_page: 2,
        data: [
          { id: 1, name: 'Real Item 1', items: ['a', 'b'], tags: ['important'] },
          { id: 2, name: 'Real Item 2', items: ['c', 'd'], tags: ['normal'] }
        ]
      };
      
      // Don't mock anything, test the real flow
      const result = service.getNewPaginateObject(MockModel, paginateData);
      
      expect(result.current_page).toBe(1);
      expect(result.data.length).toBe(2);
      expect(result.data[0].id).toBe(1);
      expect(result.data[0].name).toBe('Real Item 1');
      expect(result.data[1].id).toBe(2);
      expect(result.data[1].name).toBe('Real Item 2');
    });

    it('should handle array properties clearing correctly in real scenario', () => {
      // Start with contaminated model
      mockModel.items = ['old', 'data'];
      mockModel.tags = ['old', 'tags'];
      
      const data = [
        { id: 1, name: 'item1', items: ['new1'], tags: ['new1'] },
        { id: 2, name: 'item2', items: ['new2'], tags: ['new2'] }
      ];
      
      const result = service.hydrateArray(data);
      
      expect(result.length).toBe(2);
      // Arrays should have been cleared during processing
      expect(mockModel.items).toEqual([]);
      expect(mockModel.tags).toEqual([]);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle model without constructor gracefully', () => {
      const plainModel = { id: 0, name: '', init: jasmine.createSpy('init') };
      const plainService = new TestDataService(plainModel as any);
      
      expect(() => {
        plainService.hydrateArray([{ id: 1 }]);
      }).not.toThrow();
    });

    it('should handle deeply nested object cloning', () => {
      const deepObject = {
        level1: {
          level2: {
            level3: {
              value: 'deep'
            }
          }
        }
      };
      
      const result = service.hydrate(mockModel, deepObject);
      
      expect(result.level1.level2.level3.value).toBe('deep');
    });

    it('should handle circular references in hydrate', () => {
      const circularObject: any = { name: 'circular' };
      circularObject.self = circularObject;
      
      // This should not throw an error (Object.assign handles circular refs)
      expect(() => {
        service.hydrate(mockModel, circularObject);
      }).not.toThrow();
    });

    it('should handle undefined and null models', () => {
      const nullService = new TestDataService(null as any);
      const undefinedService = new TestDataService(undefined as any);
      
      expect(nullService.model).toBe(null);
      expect(undefinedService.model).toBe(undefined);
    });
  });
});
