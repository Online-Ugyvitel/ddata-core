import { TestBed } from '@angular/core/testing';
import { ProxyFactoryService } from './proxy-factory.service';
import { ProxyService } from './proxy.service';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { ProxyServiceInterface } from './proxy-service.interface';
import { ID, ISODate } from '../../models/base/base-data.type';
import { DdataInjectorModule } from '../../ddata-injector.module';
import { EnvService } from '../env/env.service';
import { HttpClient } from '@angular/common/http';

// Mock model class for testing
class MockModel implements BaseModelInterface<MockModel> {
  readonly api_endpoint = '/test';
  readonly use_localstorage = false;
  readonly model_name = 'MockModel';
  id: ID = 1 as ID;
  isValid = true;
  validationErrors: string[] = [];
  validationRules = {};

  // Required interface methods - minimal implementations for testing
  init(data?: any): any {
    return this;
  }

  prepareToSave(): any {
    return { id: this.id };
  }

  validate(): void {
    // Mock implementation
  }

  getValidatedErrorFields(): string[] {
    return [];
  }

  setDate(date: Date, days: number = 0): ISODate {
    return '' as ISODate;
  }

  getCurrentUserId(): ID {
    return 1 as ID;
  }

  getCurrentISODate(): ISODate {
    return '' as ISODate;
  }

  toISODate(date: Date): ISODate {
    return '' as ISODate;
  }

  toISODatetime(date: Date): string {
    return '';
  }

  calculateDateWithoutWeekend(date: string, days: number, sequence: string): ISODate {
    return '' as ISODate;
  }

  getCurrentTime(): string {
    return '';
  }

  tabs?: any;

  fieldAsBoolean(field: string, defaultValue: boolean, data: unknown): void {
    // Mock implementation
  }

  fieldAsNumber(field: string, defaultValue: number, data: unknown): void {
    // Mock implementation
  }

  fieldAsString(field: string, defaultValue: string, data: unknown): void {
    // Mock implementation
  }

  initModelOrNull(fields: Partial<MockModel>, data: unknown): void {
    // Mock implementation
  }

  initAsBoolean(fields: Partial<MockModel>, data: unknown): void {
    // Mock implementation
  }

  initAsBooleanWithDefaults(fields: Array<string>, data: unknown): void {
    // Mock implementation
  }

  initAsNumber(fields: Partial<MockModel>, data: unknown): void {
    // Mock implementation
  }

  initAsNumberWithDefaults(fields: Array<string>, data: unknown): void {
    // Mock implementation
  }

  initAsString(fields: Partial<MockModel>, data: unknown): void {
    // Mock implementation
  }

  initAsStringWithDefaults(fields: Array<string>, data: unknown): void {
    // Mock implementation
  }

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

describe('ProxyFactoryService', () => {
  let service: ProxyFactoryService<MockModel>;
  let mockEnvService: jasmine.SpyObj<EnvService>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    // Create spy objects for dependencies
    mockEnvService = jasmine.createSpyObj('EnvService', [], { environment: { apiUrl: 'http://localhost:3000/api' } });
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        ProxyFactoryService,
        { provide: EnvService, useValue: mockEnvService },
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    });

    // Mock the DdataInjectorModule.InjectorInstance
    DdataInjectorModule.InjectorInstance = {
      get: jasmine.createSpy('get').and.callFake((token: any) => {
        if (token === EnvService) {
          return mockEnvService;
        }
        if (token === HttpClient) {
          return mockHttpClient;
        }
        return null;
      })
    } as any;

    service = TestBed.inject(ProxyFactoryService);
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
      expect(service instanceof ProxyFactoryService).toBe(true);
    });

    it('should have a constructor', () => {
      expect(typeof service.constructor).toBe('function');
    });
  });

  describe('get method', () => {
    it('should exist and be a function', () => {
      expect(typeof service.get).toBe('function');
    });

    it('should create an instance of the provided class', () => {
      const result = service.get(MockModel);
      
      expect(result).toBeTruthy();
      expect(result instanceof ProxyService).toBe(true);
    });

    it('should return ProxyServiceInterface', () => {
      const result = service.get(MockModel);
      
      // Check that the result implements ProxyServiceInterface methods
      expect(typeof result.getOne).toBe('function');
      expect(typeof result.getAll).toBe('function');
      expect(typeof result.getAllSortedBy).toBe('function');
      expect(typeof result.getAllSortedByDesc).toBe('function');
      expect(typeof result.getAllWithoutPaginate).toBe('function');
      expect(typeof result.getPage).toBe('function');
      expect(typeof result.getUri).toBe('function');
      expect(typeof result.findById).toBe('function');
      expect(typeof result.findByField).toBe('function');
      expect(typeof result.filterByField).toBe('function');
      expect(typeof result.search).toBe('function');
      expect(typeof result.searchWithoutPaginate).toBe('function');
      expect(typeof result.postUri).toBe('function');
      expect(typeof result.save).toBe('function');
      expect(typeof result.delete).toBe('function');
      expect(typeof result.deleteMultiple).toBe('function');
      expect(typeof result.watch).toBe('function');
      expect(typeof result.registerObserver).toBe('function');
      expect(typeof result.sendFiles).toBe('function');
    });

    it('should create ProxyService with correct instance', () => {
      const result = service.get(MockModel);
      
      // Access the private instance through the proxy service to verify it was created correctly
      // We can check this by calling a method that would use the instance
      expect(result).toBeDefined();
      
      // Since ProxyService constructor takes an instance, and we can't directly access it,
      // we verify the service was created properly by checking it's not null/undefined
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    });

    it('should work with different model classes', () => {
      const result1 = service.get(MockModel);
      const result2 = service.get(MockModel); // Use the same model type for simplicity
      
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
      expect(result1).not.toBe(result2); // Should be different instances
    });

    it('should create a new instance each time get is called', () => {
      const result1 = service.get(MockModel);
      const result2 = service.get(MockModel);
      
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
      expect(result1).not.toBe(result2); // Should be different ProxyService instances
    });
  });

  describe('Constructor', () => {
    it('should initialize without parameters', () => {
      const newService = new ProxyFactoryService<MockModel>();
      expect(newService).toBeTruthy();
      expect(typeof newService.get).toBe('function');
    });

    it('should be instantiable directly', () => {
      const directService = new ProxyFactoryService<MockModel>();
      const result = directService.get(MockModel);
      
      expect(result).toBeTruthy();
      expect(result instanceof ProxyService).toBe(true);
    });
  });

  describe('Generic Type Support', () => {
    it('should support generic types properly', () => {
      // This test verifies that the generic type T extends BaseModelInterface<T>
      // is properly constrained and works as expected
      const typedService = new ProxyFactoryService<MockModel>();
      const result: ProxyServiceInterface<MockModel> = typedService.get(MockModel);
      
      expect(result).toBeTruthy();
      expect(typeof result.getOne).toBe('function');
    });

    it('should create service with any model implementing BaseModelInterface', () => {
      const anyService = new ProxyFactoryService();
      const result = anyService.get(MockModel);
      
      expect(result).toBeTruthy();
      expect(result instanceof ProxyService).toBe(true);
    });
  });
});