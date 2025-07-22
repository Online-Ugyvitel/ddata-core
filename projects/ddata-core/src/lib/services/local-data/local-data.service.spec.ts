// tslint:disable: max-line-length
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { LocalDataService } from './local-data.service';
import { StorageService } from '../storage/storage.service';
import { SorterService } from '../sorter/sorter.service';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { ID } from '../../models/base/base-data.type';

// Mock model for testing
class MockModel implements BaseModelInterface<MockModel> {
  id: ID = 0 as ID;
  api_endpoint = '/mock';
  use_localstorage = true;
  model_name = 'MockModel';
  isValid = false;
  validationErrors: string[] = [];
  validationRules = {};

  name = '';
  value = 0;

  init(data?: any): MockModel {
    if (data) {
      this.id = (data.id || 0) as ID;
      this.name = data.name || '';
      this.value = data.value || 0;
    }
    return this;
  }

  prepareToSave(): any {
    return {
      id: this.id,
      name: this.name,
      value: this.value
    };
  }

  validate(): void {
    // Mock validation
  }

  getValidatedErrorFields(): string[] {
    return [];
  }

  setDate(date: Date, days: number): any {
    return '' as any;
  }

  getCurrentUserId(): ID {
    return 1 as ID;
  }

  getCurrentISODate(): any {
    return '' as any;
  }

  toISODate(date: Date): any {
    return '' as any;
  }

  toISODatetime(date: Date): string {
    return '';
  }

  calculateDateWithoutWeekend(date: string, days: number, sequence: string): any {
    return '' as any;
  }

  getCurrentTime(): string {
    return '';
  }

  fieldAsBoolean(field: string, defaultValue: boolean, data: unknown): void {}
  fieldAsNumber(field: string, defaultValue: number, data: unknown): void {}
  fieldAsString(field: string, defaultValue: string, data: unknown): void {}
  initModelOrNull(fields: Partial<MockModel>, data: unknown): void {}
  initAsBoolean(fields: Partial<MockModel>, data: unknown): void {}
  initAsBooleanWithDefaults(fields: Array<string>, data: unknown): void {}
  initAsNumber(fields: Partial<MockModel>, data: unknown): void {}
  initAsNumberWithDefaults(fields: Array<string>, data: unknown): void {}
  initAsString(fields: Partial<MockModel>, data: unknown): void {}
  initAsStringWithDefaults(fields: Array<string>, data: unknown): void {}
  prepareFieldsToSaveAsBoolean(fields: Partial<MockModel>): Partial<MockModel> {
    return {};
  }
  prepareFieldsToSaveAsNumber(fields: Partial<MockModel>): Partial<MockModel> {
    return {};
  }
  prepareFieldsToSaveAsString(fields: Partial<MockModel>): Partial<MockModel> {
    return {};
  }
}

describe('LocalDataService', () => {
  let service: LocalDataService<MockModel>;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let mockSorterService: jasmine.SpyObj<SorterService<MockModel>>;
  let mockModel: MockModel;

  beforeEach(() => {
    // Create spy objects for dependencies
    mockStorageService = jasmine.createSpyObj('StorageService', ['setItem', 'removeItem', 'clear', 'watchStorage']);
    mockSorterService = jasmine.createSpyObj('SorterService', ['sortBy', 'sortByDesc']);

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: mockStorageService },
        { provide: SorterService, useValue: mockSorterService }
      ]
    });

    mockModel = new MockModel();
    
    // Mock localStorage
    let store: { [key: string]: string } = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => store[key] = value);
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => delete store[key]);
    spyOn(localStorage, 'clear').and.callFake(() => store = {});

    // Create service with mock model
    service = new LocalDataService(mockModel);
    
    // Replace the private dependencies with our mocks
    service['storageService'] = mockStorageService;
    service['sorterService'] = mockSorterService;
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Service Creation and Initialization', () => {
    it('should create an instance', () => {
      expect(service).toBeTruthy();
      expect(service instanceof LocalDataService).toBe(true);
    });

    it('should be the correct type', () => {
      expect(service.constructor.name).toBe('LocalDataService');
    });

    it('should initialize with correct storage item name', () => {
      expect(service['localStorageItemName']).toBe('mock_models');
    });

    it('should initialize empty database from localStorage', () => {
      expect(service['db']).toEqual([]);
    });

    it('should create a copy of the model', () => {
      expect(service['copyOfModel']).toEqual(jasmine.objectContaining({
        model_name: 'MockModel'
      }));
    });
  });

  describe('convertTitleCaseToSnakeCase method', () => {
    it('should convert single word correctly', () => {
      const result = service['convertTitleCaseToSnakeCase']('MockModel');
      expect(result).toBe('mock_model');
    });

    it('should convert multiple words correctly', () => {
      const result = service['convertTitleCaseToSnakeCase']('UserDataModel');
      expect(result).toBe('user_data_model');
    });

    it('should handle consecutive uppercase letters', () => {
      const result = service['convertTitleCaseToSnakeCase']('XMLHTTPRequest');
      expect(result).toBe('xmlhttprequest');
    });

    it('should handle strings starting with lowercase', () => {
      const result = service['convertTitleCaseToSnakeCase']('mockModel');
      expect(result).toBe('mock_model');
    });

    it('should handle empty string', () => {
      const result = service['convertTitleCaseToSnakeCase']('');
      expect(result).toBe('');
    });

    it('should handle single character', () => {
      const result = service['convertTitleCaseToSnakeCase']('A');
      expect(result).toBe('a');
    });
  });

  describe('watch method', () => {
    it('should return an Observable', () => {
      const result = service.watch();
      expect(result).toBeDefined();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should emit when storage subject emits', (done) => {
      service.watch().subscribe(value => {
        expect(value).toBe(true);
        done();
      });
      
      service['storageSubject'].next(true);
    });
  });

  describe('allFromLocal method', () => {
    it('should return empty array when localStorage is empty', () => {
      const result = service.allFromLocal();
      expect(result).toEqual([]);
    });

    it('should parse and hydrate data from localStorage', () => {
      const mockData = [
        { id: 1, name: 'Test 1', value: 10 },
        { id: 2, name: 'Test 2', value: 20 }
      ];
      localStorage.setItem('mock_models', JSON.stringify(mockData));

      const result = service.allFromLocal();
      
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(MockModel);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Test 1');
      expect(result[1].id).toBe(2);
      expect(result[1].name).toBe('Test 2');
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('mock_models', 'invalid json');
      
      const result = service.allFromLocal();
      expect(result).toEqual([]);
    });

    it('should handle null localStorage value', () => {
      localStorage.removeItem('mock_models');
      
      const result = service.allFromLocal();
      expect(result).toEqual([]);
    });

    it('should update internal db property', () => {
      const mockData = [{ id: 1, name: 'Test', value: 5 }];
      localStorage.setItem('mock_models', JSON.stringify(mockData));

      service.allFromLocal();
      
      expect(service['db'].length).toBe(1);
      expect(service['db'][0].id).toBe(1);
    });
  });

  describe('delete method', () => {
    beforeEach(() => {
      const mockData = [
        { id: 1, name: 'Test 1', value: 10 },
        { id: 2, name: 'Test 2', value: 20 },
        { id: 3, name: 'Test 3', value: 30 }
      ];
      localStorage.setItem('mock_models', JSON.stringify(mockData));
      service.allFromLocal();
    });

    it('should return false when model is null', () => {
      const result = service.delete(null);
      expect(result).toBe(false);
    });

    it('should return false when model is undefined', () => {
      const result = service.delete(undefined);
      expect(result).toBe(false);
    });

    it('should delete existing model and return true', () => {
      const modelToDelete = service['db'][1]; // Test 2
      const initialLength = service['db'].length;
      
      const result = service.delete(modelToDelete);
      
      expect(result).toBe(true);
      expect(service['db'].length).toBe(initialLength - 1);
      expect(service['db'].find(m => m.id === 2)).toBeUndefined();
    });

    it('should call updateLocalstorage after successful deletion', () => {
      spyOn(service, 'updateLocalstorage');
      const modelToDelete = service['db'][0];
      
      service.delete(modelToDelete);
      
      expect(service.updateLocalstorage).toHaveBeenCalledWith(service['db']);
    });

    it('should handle deletion of first item', () => {
      const modelToDelete = service['db'][0];
      const secondItemId = service['db'][1].id;
      
      service.delete(modelToDelete);
      
      expect(service['db'][0].id).toBe(secondItemId);
    });

    it('should handle deletion of last item', () => {
      const modelToDelete = service['db'][2];
      const originalLength = service['db'].length;
      
      service.delete(modelToDelete);
      
      expect(service['db'].length).toBe(originalLength - 1);
      expect(service['db'][service['db'].length - 1].id).toBe(2);
    });
  });

  describe('updateLocalstorage method', () => {
    it('should call storageService setItem with correct parameters', () => {
      const testData = [new MockModel().init({ id: 1, name: 'Test' })];
      
      service.updateLocalstorage(testData);
      
      expect(mockStorageService.setItem).toHaveBeenCalledWith(
        'mock_models',
        JSON.stringify(testData)
      );
    });

    it('should call allFromLocal to refresh internal data', () => {
      spyOn(service, 'allFromLocal');
      const testData = [];
      
      service.updateLocalstorage(testData);
      
      expect(service.allFromLocal).toHaveBeenCalled();
    });

    it('should emit to storage subject', () => {
      spyOn(service['storageSubject'], 'next');
      const testData = [];
      
      service.updateLocalstorage(testData);
      
      expect(service['storageSubject'].next).toHaveBeenCalledWith(true);
    });

    it('should handle empty data array', () => {
      service.updateLocalstorage([]);
      
      expect(mockStorageService.setItem).toHaveBeenCalledWith(
        'mock_models',
        JSON.stringify([])
      );
    });
  });

  describe('allFromLocalSortedBy method', () => {
    beforeEach(() => {
      const mockData = [
        { id: 3, name: 'Charlie', value: 30 },
        { id: 1, name: 'Alice', value: 10 },
        { id: 2, name: 'Bob', value: 20 }
      ];
      localStorage.setItem('mock_models', JSON.stringify(mockData));
      service.allFromLocal();
    });

    it('should call sorterService.sortBy with correct parameters', () => {
      const mockSortedData = [...service['db']];
      mockSorterService.sortBy.and.returnValue(mockSortedData);
      
      service.allFromLocalSortedBy('name');
      
      expect(mockSorterService.sortBy).toHaveBeenCalledWith(service['db'], 'name');
    });

    it('should return sorted data from sorterService', () => {
      const mockSortedData = [service['db'][1], service['db'][2], service['db'][0]];
      mockSorterService.sortBy.and.returnValue(mockSortedData);
      
      const result = service.allFromLocalSortedBy('name');
      
      expect(result).toBe(mockSortedData);
    });

    it('should work with different field names', () => {
      service.allFromLocalSortedBy('value');
      expect(mockSorterService.sortBy).toHaveBeenCalledWith(service['db'], 'value');
      
      service.allFromLocalSortedBy('id');
      expect(mockSorterService.sortBy).toHaveBeenCalledWith(service['db'], 'id');
    });
  });

  describe('allFromLocalSortedByDesc method', () => {
    beforeEach(() => {
      const mockData = [
        { id: 1, name: 'Alice', value: 10 },
        { id: 2, name: 'Bob', value: 20 },
        { id: 3, name: 'Charlie', value: 30 }
      ];
      localStorage.setItem('mock_models', JSON.stringify(mockData));
      service.allFromLocal();
    });

    it('should call sorterService.sortByDesc with correct parameters', () => {
      const mockSortedData = [...service['db']].reverse();
      mockSorterService.sortByDesc.and.returnValue(mockSortedData);
      
      service.allFromLocalSortedByDesc('name');
      
      expect(mockSorterService.sortByDesc).toHaveBeenCalledWith(service['db'], 'name');
    });

    it('should return descending sorted data from sorterService', () => {
      const mockSortedData = [service['db'][2], service['db'][1], service['db'][0]];
      mockSorterService.sortByDesc.and.returnValue(mockSortedData);
      
      const result = service.allFromLocalSortedByDesc('value');
      
      expect(result).toBe(mockSortedData);
    });
  });

  describe('findById method', () => {
    beforeEach(() => {
      const mockData = [
        { id: 1, name: 'Alice', value: 10 },
        { id: 2, name: 'Bob', value: 20 },
        { id: 3, name: 'Charlie', value: 30 }
      ];
      localStorage.setItem('mock_models', JSON.stringify(mockData));
      service.allFromLocal();
    });

    it('should find existing model by id', () => {
      const result = service.findById(2);
      
      expect(result).toBeDefined();
      expect(result.id).toBe(2);
      expect(result.name).toBe('Bob');
    });

    it('should return initialized copy when model not found', () => {
      spyOn(service['copyOfModel'], 'init').and.returnValue(new MockModel());
      
      const result = service.findById(999);
      
      expect(service['copyOfModel'].init).toHaveBeenCalled();
      expect(result).toBeInstanceOf(MockModel);
    });

    it('should handle string id by converting to number', () => {
      const result = service.findById('2' as any);
      
      expect(result.id).toBe(2);
      expect(result.name).toBe('Bob');
    });

    it('should find first item', () => {
      const result = service.findById(1);
      expect(result.name).toBe('Alice');
    });

    it('should find last item', () => {
      const result = service.findById(3);
      expect(result.name).toBe('Charlie');
    });

    it('should handle zero id', () => {
      spyOn(service['copyOfModel'], 'init').and.returnValue(new MockModel());
      const result = service.findById(0);
      expect(service['copyOfModel'].init).toHaveBeenCalled();
    });

    it('should handle negative id', () => {
      spyOn(service['copyOfModel'], 'init').and.returnValue(new MockModel());
      const result = service.findById(-1);
      expect(service['copyOfModel'].init).toHaveBeenCalled();
    });
  });

  describe('findByField method', () => {
    beforeEach(() => {
      const mockData = [
        { id: 1, name: 'Alice', value: 10 },
        { id: 2, name: 'Bob', value: 20 },
        { id: 3, name: 'Charlie', value: 10 }
      ];
      localStorage.setItem('mock_models', JSON.stringify(mockData));
      service.allFromLocal();
    });

    it('should find existing model by string field', () => {
      const result = service.findByField('name', 'Bob');
      
      expect(result).toBeDefined();
      expect(result.id).toBe(2);
      expect(result.name).toBe('Bob');
    });

    it('should find existing model by number field', () => {
      const result = service.findByField('value', 20);
      
      expect(result).toBeDefined();
      expect(result.id).toBe(2);
    });

    it('should return null when field value not found', () => {
      const result = service.findByField('name', 'NonExistent');
      
      expect(result).toBe(null);
    });

    it('should return null when field does not exist', () => {
      const result = service.findByField('nonExistentField', 'anything');
      
      expect(result).toBe(null);
    });

    it('should find first matching item when multiple matches exist', () => {
      const result = service.findByField('value', 10);
      
      expect(result.id).toBe(1); // First match (Alice)
      expect(result.name).toBe('Alice');
    });

    it('should handle boolean values', () => {
      service['db'][0]['active'] = true;
      service['db'][1]['active'] = false;
      
      const result = service.findByField('active', true);
      expect(result.id).toBe(1);
    });

    it('should handle null values', () => {
      service['db'][0]['nullField'] = null;
      
      const result = service.findByField('nullField', null);
      expect(result.id).toBe(1);
    });
  });

  describe('filterByField method', () => {
    beforeEach(() => {
      const mockData = [
        { id: 1, name: 'Alice', value: 10, category: 'A' },
        { id: 2, name: 'Bob', value: 20, category: 'B' },
        { id: 3, name: 'Charlie', value: 10, category: 'A' },
        { id: 4, name: 'David', value: 30, category: 'A' }
      ];
      localStorage.setItem('mock_models', JSON.stringify(mockData));
      service.allFromLocal();
    });

    it('should filter models by string field', () => {
      const result = service.filterByField('category', 'A');
      
      expect(result.length).toBe(3);
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Charlie');
      expect(result[2].name).toBe('David');
    });

    it('should filter models by number field', () => {
      const result = service.filterByField('value', 10);
      
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Charlie');
    });

    it('should return empty array when no matches found', () => {
      const result = service.filterByField('category', 'Z');
      
      expect(result).toEqual([]);
    });

    it('should return empty array when field does not exist', () => {
      const result = service.filterByField('nonExistentField', 'anything');
      
      expect(result).toEqual([]);
    });

    it('should filter single match', () => {
      const result = service.filterByField('name', 'Bob');
      
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(2);
    });

    it('should handle boolean filtering', () => {
      service['db'][0]['active'] = true;
      service['db'][1]['active'] = true;
      service['db'][2]['active'] = false;
      service['db'][3]['active'] = true;
      
      const result = service.filterByField('active', true);
      expect(result.length).toBe(3);
    });

    it('should handle null filtering', () => {
      service['db'][0]['optionalField'] = null;
      service['db'][1]['optionalField'] = 'value';
      service['db'][2]['optionalField'] = null;
      
      const result = service.filterByField('optionalField', null);
      expect(result.length).toBe(2);
    });
  });

  describe('save method', () => {
    beforeEach(() => {
      const mockData = [
        { id: 1, name: 'Alice', value: 10 },
        { id: 2, name: 'Bob', value: 20 }
      ];
      localStorage.setItem('mock_models', JSON.stringify(mockData));
      service.allFromLocal();
      spyOn(service, 'updateLocalstorage');
    });

    describe('Creating new model (id = 0)', () => {
      it('should add new model to database', () => {
        const newModel = new MockModel();
        newModel.id = 0;
        newModel.name = 'Charlie';
        newModel.value = 30;
        
        const initialLength = service['db'].length;
        service.save(newModel, 3);
        
        expect(service['db'].length).toBe(initialLength + 1);
        expect(newModel.id).toBe(3 as ID);
      });

      it('should call updateLocalstorage after adding new model', () => {
        const newModel = new MockModel();
        newModel.id = 0;
        
        service.save(newModel, 3);
        
        expect(service.updateLocalstorage).toHaveBeenCalledWith(service['db']);
      });

      it('should assign provided id to new model', () => {
        const newModel = new MockModel();
        newModel.id = 0;
        newModel.name = 'NewModel';
        
        service.save(newModel, 999);
        
        expect(newModel.id).toBe(999 as ID);
      });

      it('should preserve model data when creating', () => {
        const newModel = new MockModel();
        newModel.id = 0;
        newModel.name = 'TestName';
        newModel.value = 42;
        
        service.save(newModel, 100);
        
        const savedModel = service['db'].find(m => m.id === 100);
        expect(savedModel.name).toBe('TestName');
        expect(savedModel.value).toBe(42);
      });
    });

    describe('Updating existing model (id > 0)', () => {
      it('should update existing model in database', () => {
        const existingModel = service['db'][0];
        existingModel.name = 'UpdatedAlice';
        existingModel.value = 99;
        
        service.save(existingModel, 0); // id parameter ignored for updates
        
        const updatedModel = service['db'][0];
        expect(updatedModel.name).toBe('UpdatedAlice');
        expect(updatedModel.value).toBe(99);
      });

      it('should call updateLocalstorage after updating model', () => {
        const existingModel = service['db'][0];
        existingModel.name = 'Updated';
        
        service.save(existingModel, 0);
        
        expect(service.updateLocalstorage).toHaveBeenCalledWith(service['db']);
      });

      it('should maintain database length when updating', () => {
        const initialLength = service['db'].length;
        const existingModel = service['db'][1];
        existingModel.name = 'UpdatedBob';
        
        service.save(existingModel, 0);
        
        expect(service['db'].length).toBe(initialLength);
      });

      it('should update correct model by id', () => {
        const modelToUpdate = service['db'][1]; // Bob
        const originalFirstModel = service['db'][0]; // Alice
        
        modelToUpdate.name = 'UpdatedBob';
        service.save(modelToUpdate, 0);
        
        expect(service['db'][0].name).toBe(originalFirstModel.name); // Alice unchanged
        expect(service['db'][1].name).toBe('UpdatedBob'); // Bob updated
      });

      it('should handle updating last model', () => {
        const lastModel = service['db'][service['db'].length - 1];
        lastModel.name = 'UpdatedLast';
        
        service.save(lastModel, 0);
        
        const updatedLastModel = service['db'][service['db'].length - 1];
        expect(updatedLastModel.name).toBe('UpdatedLast');
      });

      it('should replace entire model object at correct index', () => {
        const originalModel = service['db'][0];
        const originalId = originalModel.id;
        
        // Create a new model with same id but different data
        const updatedModel = new MockModel();
        updatedModel.id = originalId;
        updatedModel.name = 'CompletelyNew';
        updatedModel.value = 999;
        
        service.save(updatedModel, 0);
        
        expect(service['db'][0]).toBe(updatedModel);
        expect(service['db'][0].name).toBe('CompletelyNew');
        expect(service['db'][0].value).toBe(999);
      });
    });

    describe('Edge cases', () => {
      it('should handle saving when database is empty', () => {
        service['db'] = [];
        const newModel = new MockModel();
        newModel.id = 0;
        newModel.name = 'FirstModel';
        
        service.save(newModel, 1);
        
        expect(service['db'].length).toBe(1);
        expect(service['db'][0].name).toBe('FirstModel');
        expect(newModel.id).toBe(1 as ID);
      });

      it('should handle negative id for new model', () => {
        const newModel = new MockModel();
        newModel.id = 0;
        
        service.save(newModel, -1);
        
        expect(newModel.id).toBe(-1 as ID);
        expect(service['db'].length).toBe(3); // original 2 + 1 new
      });

      it('should handle very large id for new model', () => {
        const newModel = new MockModel();
        newModel.id = 0;
        
        service.save(newModel, 999999);
        
        expect(newModel.id).toBe(999999 as ID);
      });
    });
  });

  describe('Integration tests', () => {
    it('should maintain data consistency through multiple operations', () => {
      // Start with empty database
      service['db'] = [];
      
      // Add some models
      const model1 = new MockModel().init({ id: 0, name: 'First', value: 10 });
      const model2 = new MockModel().init({ id: 0, name: 'Second', value: 20 });
      
      service.save(model1, 1);
      service.save(model2, 2);
      
      expect(service['db'].length).toBe(2);
      
      // Find and update
      const found = service.findById(1);
      found.name = 'Updated First';
      service.save(found, 0);
      
      expect(service.findById(1).name).toBe('Updated First');
      
      // Delete
      service.delete(service.findById(2));
      
      expect(service['db'].length).toBe(1);
      expect(service.findById(2)).toEqual(jasmine.any(MockModel)); // Returns copy when not found
    });

    it('should handle localStorage round-trip correctly', () => {
      // Clear and add test data
      service['db'] = [];
      const testModel = new MockModel().init({ id: 0, name: 'Test', value: 123 });
      
      service.save(testModel, 1);
      
      // Verify it was saved and storage service was called
      expect(service.updateLocalstorage).toHaveBeenCalled();
      
      // Simulate loading from localStorage
      const mockData = [{ id: 1, name: 'Test', value: 123 }];
      localStorage.setItem('mock_models', JSON.stringify(mockData));
      
      const loaded = service.allFromLocal();
      
      expect(loaded.length).toBe(1);
      expect(loaded[0].name).toBe('Test');
      expect(loaded[0].value).toBe(123);
    });

    it('should handle sorting after CRUD operations', () => {
      // Setup data
      service['db'] = [];
      const models = [
        new MockModel().init({ id: 0, name: 'Charlie', value: 30 }),
        new MockModel().init({ id: 0, name: 'Alice', value: 10 }),
        new MockModel().init({ id: 0, name: 'Bob', value: 20 })
      ];
      
      models.forEach((model, index) => service.save(model, index + 1));
      
      // Mock sorter service to return predictable results
      mockSorterService.sortBy.and.returnValue([...service['db']].sort((a, b) => a.name.localeCompare(b.name)));
      mockSorterService.sortByDesc.and.returnValue([...service['db']].sort((a, b) => b.name.localeCompare(a.name)));
      
      const sortedAsc = service.allFromLocalSortedBy('name');
      const sortedDesc = service.allFromLocalSortedByDesc('name');
      
      expect(sortedAsc[0].name).toBe('Alice');
      expect(sortedDesc[0].name).toBe('Charlie');
    });
  });

  describe('Observable behavior', () => {
    it('should emit updates when updateLocalstorage is called', (done) => {
      let emissionCount = 0;
      
      service.watch().subscribe(() => {
        emissionCount++;
        if (emissionCount === 1) {
          done();
        }
      });
      
      service.updateLocalstorage([]);
    });

    it('should emit updates on save operations', (done) => {
      let emissionCount = 0;
      
      service.watch().subscribe(() => {
        emissionCount++;
        if (emissionCount === 1) {
          done();
        }
      });
      
      const newModel = new MockModel();
      newModel.id = 0;
      service.save(newModel, 1);
    });

    it('should emit updates on delete operations', (done) => {
      // Setup initial data
      const mockData = [{ id: 1, name: 'Test', value: 10 }];
      localStorage.setItem('mock_models', JSON.stringify(mockData));
      service.allFromLocal();
      
      let emissionCount = 0;
      
      service.watch().subscribe(() => {
        emissionCount++;
        if (emissionCount === 1) {
          done();
        }
      });
      
      service.delete(service['db'][0]);
    });
  });
});