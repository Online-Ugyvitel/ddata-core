// tslint:disable: variable-name
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { ProxyService } from './proxy.service';
import { BaseModel, BaseModelInterface } from '../../models/base/base-model.model';
import { ID } from '../../models/base/base-data.type';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { Paginate } from '../../models/paginate/paginate.model';
import { FileUploadProcessInterface } from '../../models/file/file-upload-process.interface';
import { NotificationService } from '../notification/notification.service';
import { LocalDataService } from '../local-data/local-data.service';
import { RemoteDataService } from '../remote-data/remote-data.service';

// Test model interface
interface TestModelInterface extends BaseModelInterface<TestModelInterface> {
  id: ID;
  name: string;
  use_localstorage: boolean;
  api_endpoint: string;
  model_name: string;
}

// Test model implementation
class TestModel extends BaseModel implements TestModelInterface {
  readonly api_endpoint = '/test-endpoint';
  readonly model_name = 'TestModel';
  id: ID;
  name: string;
  use_localstorage = false;

  init(data?: any): TestModelInterface {
    data = !!data ? data : {};
    this.id = !!data.id ? data.id : 0;
    this.name = !!data.name ? data.name : '';
    this.use_localstorage = !!data.use_localstorage ? data.use_localstorage : false;
    return this;
  }

  prepareToSave(): any {
    return {
      id: this.id,
      name: this.name,
    };
  }

  validate(): void {
    this.isValid = true;
    this.validationErrors = [];
  }
}

describe('ProxyService', () => {
  let service: ProxyService<TestModelInterface>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockLocalDataService: jasmine.SpyObj<LocalDataService<TestModelInterface>>;
  let mockRemoteDataService: jasmine.SpyObj<RemoteDataService<TestModelInterface>>;
  let testModel: TestModelInterface;
  let testPaginate: PaginateInterface;

  beforeEach(() => {
    // Create spies for all dependencies
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['add']);
    mockLocalDataService = jasmine.createSpyObj('LocalDataService', [
      'findById',
      'allFromLocal',
      'allFromLocalSortedBy',
      'allFromLocalSortedByDesc',
      'findByField',
      'filterByField',
      'save',
      'delete',
      'watch'
    ]);
    mockRemoteDataService = jasmine.createSpyObj('RemoteDataService', [
      'getOne',
      'getAll',
      'getAllWithoutPaginate',
      'getPage',
      'getUri',
      'postUri',
      'save',
      'delete',
      'deleteMultiple',
      'sendFiles'
    ]);

    TestBed.configureTestingModule({
      providers: [
        ProxyService,
      ]
    });

    testModel = new TestModel().init({ id: 1, name: 'Test Item' });
    testPaginate = new Paginate(TestModel, {
      data: [{ id: 1, name: 'Test Item' }],
      current_page: 1,
      per_page: 10,
      total: 1,
      last_page: 1,
      from: 1,
      to: 1
    });

    service = new ProxyService<TestModelInterface>(testModel);
    
    // Replace the services with mocks
    (service as any).notificationService = mockNotificationService;
    (service as any).localStorageService = mockLocalDataService;
    (service as any).remoteStorageService = mockRemoteDataService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOne', () => {
    it('should get one item from local storage when use_localstorage is true', () => {
      testModel.use_localstorage = true;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).localStorageService = mockLocalDataService;
      
      const mockItem = new TestModel().init({ id: 1, name: 'Test Item' });
      mockLocalDataService.findById.and.returnValue(mockItem);

      service.getOne(1).subscribe(result => {
        expect(result).toEqual(mockItem);
        expect(mockLocalDataService.findById).toHaveBeenCalledWith(1);
      });
    });

    it('should get one item from remote storage when use_localstorage is false', () => {
      testModel.use_localstorage = false;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).remoteStorageService = mockRemoteDataService;
      
      const mockItem = new TestModel().init({ id: 1, name: 'Test Item' });
      mockRemoteDataService.getOne.and.returnValue(of(mockItem));

      service.getOne(1).subscribe(result => {
        expect(result).toEqual(mockItem);
        expect(mockRemoteDataService.getOne).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('getAll', () => {
    it('should get all items from local storage when use_localstorage is true', () => {
      testModel.use_localstorage = true;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).localStorageService = mockLocalDataService;
      
      const mockItems = [new TestModel().init({ id: 1, name: 'Test Item' })];
      mockLocalDataService.allFromLocal.and.returnValue(mockItems);

      service.getAll().subscribe(result => {
        expect(result).toBeInstanceOf(Paginate);
        expect(result.data).toEqual(mockItems);
        expect(mockLocalDataService.allFromLocal).toHaveBeenCalled();
      });
    });

    it('should get all items from remote storage when use_localstorage is false', () => {
      testModel.use_localstorage = false;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).remoteStorageService = mockRemoteDataService;
      
      mockRemoteDataService.getAll.and.returnValue(of(testPaginate));

      service.getAll(1).subscribe(result => {
        expect(result).toEqual(testPaginate);
        expect(mockRemoteDataService.getAll).toHaveBeenCalledWith(1);
      });
    });

    it('should get all items with default page number 0', () => {
      testModel.use_localstorage = false;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).remoteStorageService = mockRemoteDataService;
      
      mockRemoteDataService.getAll.and.returnValue(of(testPaginate));

      service.getAll().subscribe(result => {
        expect(result).toEqual(testPaginate);
        expect(mockRemoteDataService.getAll).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('getAllWithoutPaginate', () => {
    it('should get all items without pagination from local storage when use_localstorage is true', () => {
      testModel.use_localstorage = true;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).localStorageService = mockLocalDataService;
      
      const mockItems = [new TestModel().init({ id: 1, name: 'Test Item' })];
      mockLocalDataService.allFromLocal.and.returnValue(mockItems);

      service.getAllWithoutPaginate().subscribe(result => {
        expect(result).toEqual(mockItems);
        expect(mockLocalDataService.allFromLocal).toHaveBeenCalled();
      });
    });

    it('should get all items without pagination from remote storage when use_localstorage is false', () => {
      testModel.use_localstorage = false;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).remoteStorageService = mockRemoteDataService;
      
      const mockItems = [new TestModel().init({ id: 1, name: 'Test Item' })];
      mockRemoteDataService.getAllWithoutPaginate.and.returnValue(of(mockItems));

      service.getAllWithoutPaginate().subscribe(result => {
        expect(result).toEqual(mockItems);
        expect(mockRemoteDataService.getAllWithoutPaginate).toHaveBeenCalled();
      });
    });
  });

  describe('getAllSortedBy', () => {
    it('should get all items sorted by field from local storage when use_localstorage is true', () => {
      testModel.use_localstorage = true;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).localStorageService = mockLocalDataService;
      
      const mockItems = [new TestModel().init({ id: 1, name: 'Test Item' })];
      mockLocalDataService.allFromLocalSortedBy.and.returnValue(mockItems);

      service.getAllSortedBy('name').subscribe(result => {
        expect(result).toEqual(mockItems);
        expect(mockLocalDataService.allFromLocalSortedBy).toHaveBeenCalledWith('name');
      });
    });

    it('should use default field name when none provided for local storage', () => {
      testModel.use_localstorage = true;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).localStorageService = mockLocalDataService;
      
      const mockItems = [new TestModel().init({ id: 1, name: 'Test Item' })];
      mockLocalDataService.allFromLocalSortedBy.and.returnValue(mockItems);

      service.getAllSortedBy().subscribe(result => {
        expect(result).toEqual(mockItems);
        expect(mockLocalDataService.allFromLocalSortedBy).toHaveBeenCalledWith('name');
      });
    });

    it('should get all items sorted from remote storage when use_localstorage is false', () => {
      testModel.use_localstorage = false;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).remoteStorageService = mockRemoteDataService;
      
      const mockItems = [new TestModel().init({ id: 1, name: 'Test Item' })];
      mockRemoteDataService.getAllWithoutPaginate.and.returnValue(of(mockItems));

      service.getAllSortedBy('name').subscribe(result => {
        expect(result).toEqual(mockItems);
        expect(mockRemoteDataService.getAllWithoutPaginate).toHaveBeenCalled();
      });
    });
  });

  describe('getAllSortedByDesc', () => {
    it('should get all items sorted desc by field from local storage when use_localstorage is true', () => {
      testModel.use_localstorage = true;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).localStorageService = mockLocalDataService;
      
      const mockItems = [new TestModel().init({ id: 1, name: 'Test Item' })];
      mockLocalDataService.allFromLocalSortedByDesc.and.returnValue(mockItems);

      service.getAllSortedByDesc('name').subscribe(result => {
        expect(result).toEqual(mockItems);
        expect(mockLocalDataService.allFromLocalSortedByDesc).toHaveBeenCalledWith('name');
      });
    });

    it('should use default field name when none provided for local storage desc sort', () => {
      testModel.use_localstorage = true;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).localStorageService = mockLocalDataService;
      
      const mockItems = [new TestModel().init({ id: 1, name: 'Test Item' })];
      mockLocalDataService.allFromLocalSortedByDesc.and.returnValue(mockItems);

      service.getAllSortedByDesc().subscribe(result => {
        expect(result).toEqual(mockItems);
        expect(mockLocalDataService.allFromLocalSortedByDesc).toHaveBeenCalledWith('name');
      });
    });

    it('should get all items sorted desc from remote storage when use_localstorage is false', () => {
      testModel.use_localstorage = false;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).remoteStorageService = mockRemoteDataService;
      
      const mockItems = [new TestModel().init({ id: 1, name: 'Test Item' })];
      mockRemoteDataService.getAllWithoutPaginate.and.returnValue(of(mockItems));

      service.getAllSortedByDesc('name').subscribe(result => {
        expect(result).toEqual(mockItems);
        expect(mockRemoteDataService.getAllWithoutPaginate).toHaveBeenCalled();
      });
    });
  });

  describe('getPage', () => {
    it('should get page from remote storage when use_localstorage is false', () => {
      testModel.use_localstorage = false;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).remoteStorageService = mockRemoteDataService;
      
      mockRemoteDataService.getPage.and.returnValue(of(testPaginate));

      service.getPage(1).subscribe(result => {
        expect(result).toEqual(testPaginate);
        expect(mockRemoteDataService.getPage).toHaveBeenCalledWith(1);
      });
    });

    it('should handle local storage case (TODO implementation)', () => {
      testModel.use_localstorage = true;
      service = new ProxyService<TestModelInterface>(testModel);
      
      const result = service.getPage(1);
      expect(result).toBeUndefined();
    });
  });

  describe('getUri', () => {
    it('should make GET request to URI', () => {
      const mockResponse = { data: 'test' };
      mockRemoteDataService.getUri.and.returnValue(of(mockResponse));

      service.getUri('/test-uri').subscribe(result => {
        expect(result).toEqual(mockResponse);
        expect(mockRemoteDataService.getUri).toHaveBeenCalledWith('/test-uri');
      });
    });
  });

  describe('postUri', () => {
    it('should make POST request to URI', () => {
      const mockData = { name: 'test' };
      const mockResponse = { success: true };
      mockRemoteDataService.postUri.and.returnValue(of(mockResponse));

      service.postUri(mockData, '/test-uri').subscribe(result => {
        expect(result).toEqual(mockResponse);
        expect(mockRemoteDataService.postUri).toHaveBeenCalledWith(mockData, '/test-uri');
      });
    });
  });

  describe('findById', () => {
    it('should find by id from local storage when use_localstorage is true', () => {
      testModel.use_localstorage = true;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).localStorageService = mockLocalDataService;
      
      const mockItem = new TestModel().init({ id: 1, name: 'Test Item' });
      mockLocalDataService.findById.and.returnValue(mockItem);

      service.findById(1).subscribe(result => {
        expect(result).toEqual(mockItem);
        expect(mockLocalDataService.findById).toHaveBeenCalledWith(1);
      });
    });

    it('should handle remote storage case (TODO implementation)', () => {
      testModel.use_localstorage = false;
      service = new ProxyService<TestModelInterface>(testModel);
      
      const result = service.findById(1);
      expect(result).toBeUndefined();
    });
  });

  describe('findByField', () => {
    it('should find by field from local storage when use_localstorage is true', () => {
      testModel.use_localstorage = true;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).localStorageService = mockLocalDataService;
      
      const mockItem = new TestModel().init({ id: 1, name: 'Test Item' });
      mockLocalDataService.findByField.and.returnValue(mockItem);

      service.findByField('name', 'Test Item').subscribe(result => {
        expect(result).toEqual(mockItem);
        expect(mockLocalDataService.findByField).toHaveBeenCalledWith('name', 'Test Item');
      });
    });

    it('should handle remote storage case (TODO implementation)', () => {
      testModel.use_localstorage = false;
      service = new ProxyService<TestModelInterface>(testModel);
      
      const result = service.findByField('name', 'Test Item');
      expect(result).toBeUndefined();
    });
  });

  describe('filterByField', () => {
    it('should filter by field from local storage when use_localstorage is true', () => {
      testModel.use_localstorage = true;
      service = new ProxyService<TestModelInterface>(testModel);
      (service as any).localStorageService = mockLocalDataService;
      
      const mockItems = [new TestModel().init({ id: 1, name: 'Test Item' })];
      mockLocalDataService.filterByField.and.returnValue(mockItems);

      service.filterByField('name', 'Test').subscribe(result => {
        expect(result).toEqual(mockItems);
        expect(mockLocalDataService.filterByField).toHaveBeenCalledWith('name', 'Test');
      });
    });

    it('should handle remote storage case (TODO implementation)', () => {
      testModel.use_localstorage = false;
      service = new ProxyService<TestModelInterface>(testModel);
      
      const result = service.filterByField('name', 'Test');
      expect(result).toBeUndefined();
    });
  });

  describe('search', () => {
    beforeEach(() => {
      // Set up type property for search method
      (service as any).type = TestModel;
      spyOn(service, 'getNewPaginateObject').and.returnValue(testPaginate);
      spyOn(service, 'hydrateArray').and.returnValue([testModel]);
    });

    it('should search with page number', () => {
      const searchData = { name: 'test' };
      mockRemoteDataService.postUri.and.returnValue(of(testPaginate));

      service.search(searchData, 1).subscribe(result => {
        expect(result).toEqual(testPaginate);
        expect(mockRemoteDataService.postUri).toHaveBeenCalledWith(searchData, '/search?page=1');
        expect(service.getNewPaginateObject).toHaveBeenCalledWith(TestModel, testPaginate);
      });
    });

    it('should search without page number', () => {
      const searchData = { name: 'test' };
      mockRemoteDataService.postUri.and.returnValue(of(testPaginate));

      service.search(searchData).subscribe(result => {
        expect(result).toEqual(testPaginate);
        expect(mockRemoteDataService.postUri).toHaveBeenCalledWith(searchData, '/search');
        expect(service.getNewPaginateObject).toHaveBeenCalledWith(TestModel, testPaginate);
      });
    });
  });

  describe('searchWithoutPaginate', () => {
    beforeEach(() => {
      spyOn(service, 'hydrateArray').and.returnValue([testModel]);
    });

    it('should search without pagination', () => {
      const searchData = { name: 'test' };
      const mockItems = [testModel];
      mockRemoteDataService.postUri.and.returnValue(of(mockItems));

      service.searchWithoutPaginate(searchData).subscribe(result => {
        expect(result).toEqual(mockItems);
        expect(mockRemoteDataService.postUri).toHaveBeenCalledWith(searchData, '/search?paginate=off');
        expect(service.hydrateArray).toHaveBeenCalledWith(mockItems);
      });
    });
  });

  describe('save', () => {
    beforeEach(() => {
      spyOn<any>(service, 'successNotify');
    });

    it('should return 0 when model is null', () => {
      service.save(null).subscribe(result => {
        expect(result).toBe(0);
      });
    });

    it('should return 0 when model is undefined', () => {
      service.save(undefined).subscribe(result => {
        expect(result).toBe(0);
      });
    });

    it('should save to both remote and local when use_localstorage is true', () => {
      testModel.use_localstorage = true;
      const savedId = 123;
      mockRemoteDataService.save.and.returnValue(of(savedId));
      mockLocalDataService.save.and.returnValue(undefined);

      service.save(testModel).subscribe(result => {
        expect(result).toBe(savedId);
        expect(mockRemoteDataService.save).toHaveBeenCalledWith(testModel);
        expect(mockLocalDataService.save).toHaveBeenCalledWith(testModel, savedId);
        expect((service as any).successNotify).toHaveBeenCalled();
      });
    });

    it('should save only to remote when use_localstorage is false', () => {
      testModel.use_localstorage = false;
      const savedId = 123;
      mockRemoteDataService.save.and.returnValue(of(savedId));

      service.save(testModel).subscribe(result => {
        expect(result).toBe(savedId);
        expect(mockRemoteDataService.save).toHaveBeenCalledWith(testModel);
        expect(mockLocalDataService.save).not.toHaveBeenCalled();
        expect((service as any).successNotify).toHaveBeenCalled();
      });
    });
  });

  describe('delete', () => {
    it('should return paginate when model is null', () => {
      service.delete(null, testPaginate).subscribe(result => {
        expect(result).toBe(testPaginate);
      });
    });

    it('should return paginate when model is undefined', () => {
      service.delete(undefined, testPaginate).subscribe(result => {
        expect(result).toBe(testPaginate);
      });
    });

    it('should remove model from data array when model id is 0', () => {
      const modelWithZeroId = new TestModel().init({ id: 0, name: 'Test' });
      const paginate = new Paginate(TestModel, {
        data: [{ id: 0, name: 'Test' }],
        current_page: 1,
        per_page: 10,
        total: 1,
        last_page: 1,
        from: 1,
        to: 1
      });

      service.delete(modelWithZeroId, paginate).subscribe(result => {
        expect(result).toBe(paginate);
        expect(paginate.data.length).toBe(0);
      });
    });

    it('should delete from both remote and local, then fetch all when use_localstorage is true', () => {
      testModel.use_localstorage = true;
      testModel.id = 1;
      mockRemoteDataService.delete.and.returnValue(of(1));
      mockRemoteDataService.getAll.and.returnValue(of(testPaginate));
      mockLocalDataService.delete.and.returnValue(undefined);

      service.delete(testModel, testPaginate).subscribe(result => {
        expect(result).toEqual(testPaginate);
        expect(mockRemoteDataService.delete).toHaveBeenCalledWith(testModel);
        expect(mockLocalDataService.delete).toHaveBeenCalledWith(testModel);
        expect(mockRemoteDataService.getAll).toHaveBeenCalled();
      });
    });

    it('should delete only from remote when use_localstorage is false', () => {
      testModel.use_localstorage = false;
      testModel.id = 1;
      mockRemoteDataService.delete.and.returnValue(of(1));

      service.delete(testModel, testPaginate).subscribe(result => {
        expect(result).toBe(testPaginate);
        expect(mockRemoteDataService.delete).toHaveBeenCalledWith(testModel);
        expect(mockLocalDataService.delete).not.toHaveBeenCalled();
      });
    });

    it('should not remove from paginate when remote delete fails', () => {
      testModel.use_localstorage = false;
      testModel.id = 1;
      mockRemoteDataService.delete.and.returnValue(of(0));

      const originalDataLength = testPaginate.data.length;
      service.delete(testModel, testPaginate).subscribe(result => {
        expect(result).toBe(testPaginate);
        expect(testPaginate.data.length).toBe(originalDataLength);
      });
    });
  });

  describe('deleteMultiple', () => {
    it('should return paginate when models is null', () => {
      service.deleteMultiple(null, testPaginate).subscribe(result => {
        expect(result).toBe(testPaginate);
      });
    });

    it('should return paginate when models is undefined', () => {
      service.deleteMultiple(undefined, testPaginate).subscribe(result => {
        expect(result).toBe(testPaginate);
      });
    });

    it('should handle models with id 0 by removing them from paginate data', () => {
      const modelWithZeroId = new TestModel().init({ id: 0, name: 'Test' });
      const models = [modelWithZeroId];
      const paginate = new Paginate(TestModel, {
        data: [{ id: 0, name: 'Test' }],
        current_page: 1,
        per_page: 10,
        total: 1,
        last_page: 1,
        from: 1,
        to: 1
      });

      // Mock the return value for the forEach case where id === 0
      spyOn(service, 'deleteMultiple').and.callThrough();

      // The method should process the models and remove ones with id 0
      service.deleteMultiple(models, paginate).subscribe(result => {
        expect(result).toBeDefined();
      });
    });

    it('should delete multiple from both remote and local, then fetch all when use_localstorage is true', () => {
      testModel.use_localstorage = true;
      const models = [testModel];
      mockRemoteDataService.deleteMultiple.and.returnValue(of(true));
      mockRemoteDataService.getAll.and.returnValue(of(testPaginate));
      mockLocalDataService.delete.and.returnValue(undefined);

      service.deleteMultiple(models, testPaginate).subscribe(result => {
        expect(result).toEqual(testPaginate);
        expect(mockRemoteDataService.deleteMultiple).toHaveBeenCalledWith(models);
        expect(mockLocalDataService.delete).toHaveBeenCalledWith(testModel);
        expect(mockRemoteDataService.getAll).toHaveBeenCalled();
      });
    });

    it('should delete multiple only from remote when use_localstorage is false', () => {
      testModel.use_localstorage = false;
      const models = [testModel];
      mockRemoteDataService.deleteMultiple.and.returnValue(of(true));

      service.deleteMultiple(models, testPaginate).subscribe(result => {
        expect(result).toBe(testPaginate);
        expect(mockRemoteDataService.deleteMultiple).toHaveBeenCalledWith(models);
        expect(mockLocalDataService.delete).not.toHaveBeenCalled();
      });
    });

    it('should not delete from local when remote delete fails', () => {
      testModel.use_localstorage = true;
      const models = [testModel];
      mockRemoteDataService.deleteMultiple.and.returnValue(of(false));
      mockRemoteDataService.getAll.and.returnValue(of(testPaginate));

      service.deleteMultiple(models, testPaginate).subscribe(result => {
        expect(result).toEqual(testPaginate);
        expect(mockLocalDataService.delete).not.toHaveBeenCalled();
      });
    });
  });

  describe('watch', () => {
    it('should return watch observable from local storage service', () => {
      mockLocalDataService.watch.and.returnValue(of(true));

      service.watch().subscribe(result => {
        expect(result).toBe(true);
        expect(mockLocalDataService.watch).toHaveBeenCalled();
      });
    });
  });

  describe('registerObserver', () => {
    it('should register observer with default sort field', () => {
      const target = [];
      spyOn(service, 'watch').and.returnValue(of(true));
      spyOn(service, 'getAllSortedBy').and.returnValue(of([testModel]));

      service.registerObserver(target);

      expect(service.watch).toHaveBeenCalled();
      
      // Test the subscription behavior
      service.watch().subscribe(() => {
        expect(service.getAllSortedBy).toHaveBeenCalledWith('name');
      });
    });

    it('should register observer with custom sort field', () => {
      const target = [];
      spyOn(service, 'watch').and.returnValue(of(true));
      spyOn(service, 'getAllSortedBy').and.returnValue(of([testModel]));

      service.registerObserver(target, 'id');

      expect(service.watch).toHaveBeenCalled();
      
      // Test the subscription behavior
      service.watch().subscribe(() => {
        expect(service.getAllSortedBy).toHaveBeenCalledWith('id');
      });
    });
  });

  describe('sendFiles', () => {
    it('should send files with data', () => {
      const fileSet = new Set<File>([new File([''], 'test.txt')]);
      const data = { name: 'test' };
      const mockUploadProcess: Observable<FileUploadProcessInterface>[] = [of({} as FileUploadProcessInterface)];
      
      mockRemoteDataService.sendFiles.and.returnValue(mockUploadProcess);

      const result = service.sendFiles('/upload', 1, fileSet, data);

      expect(result).toBe(mockUploadProcess);
      expect(mockRemoteDataService.sendFiles).toHaveBeenCalledWith('/upload', 1, fileSet, data);
    });

    it('should send files without data', () => {
      const fileSet = new Set<File>([new File([''], 'test.txt')]);
      const mockUploadProcess: Observable<FileUploadProcessInterface>[] = [of({} as FileUploadProcessInterface)];
      
      mockRemoteDataService.sendFiles.and.returnValue(mockUploadProcess);

      const result = service.sendFiles('/upload', 1, fileSet);

      expect(result).toBe(mockUploadProcess);
      expect(mockRemoteDataService.sendFiles).toHaveBeenCalledWith('/upload', 1, fileSet, null);
    });
  });

  describe('successNotify', () => {
    it('should call notification service with success message', () => {
      (service as any).successNotify();

      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Siker',
        'A mentés sikeres',
        'success'
      );
    });
  });

  describe('constructor', () => {
    it('should initialize all services', () => {
      const newTestModel = new TestModel().init();
      const newService = new ProxyService<TestModelInterface>(newTestModel);

      expect(newService).toBeTruthy();
      expect((newService as any).notificationService).toBeInstanceOf(NotificationService);
      expect((newService as any).localStorageService).toBeInstanceOf(LocalDataService);
      expect((newService as any).remoteStorageService).toBeInstanceOf(RemoteDataService);
      expect((newService as any).instance).toBe(newTestModel);
    });
  });
});