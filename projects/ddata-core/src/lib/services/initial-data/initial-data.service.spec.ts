import 'zone.js/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Injector } from '@angular/core';

import { InitialDataService } from './initial-data.service';
import { StorageService } from '../storage/storage.service';
import { SpinnerService } from '../spinner/spinner.service';
import { DdataCoreModule } from '../../ddata-core.module';
import { DdataInjectorModule } from '../../ddata-injector.module';
import { EnvService } from '../env/env.service';
import { InitialData } from '../../models/initial-data/initial-data.model';

describe('InitialDataService', () => {
  let service: InitialDataService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let spinnerServiceSpy: jasmine.SpyObj<SpinnerService>;
  let httpMock: HttpTestingController;
  let envServiceMock: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(), {
        teardown: { destroyAfterEach: false }
      }
    );
  });

  beforeEach(() => {
    // Create spies for dependencies
    const storageServiceSpyObj = jasmine.createSpyObj('StorageService', ['setItem']);
    const spinnerServiceSpyObj = jasmine.createSpyObj('SpinnerService', ['on', 'off']);
    envServiceMock = { environment: { apiUrl: 'http://dummy.test/api', debug: false } };

    TestBed.configureTestingModule({
      providers: [
        InitialDataService,
        { provide: StorageService, useValue: storageServiceSpyObj },
        { provide: SpinnerService, useValue: spinnerServiceSpyObj },
        { provide: EnvService, useValue: envServiceMock },
        { provide: 'env', useValue: { apiUrl: 'http://dummy.test/api', debug: false } },
        Injector,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    // Set up the module injectors
    DdataCoreModule.InjectorInstance = TestBed;
    DdataInjectorModule.InjectorInstance = TestBed;

    service = TestBed.inject(InitialDataService);
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    spinnerServiceSpy = TestBed.inject(SpinnerService) as jasmine.SpyObj<SpinnerService>;
    httpMock = TestBed.inject(HttpTestingController);

    // Set up localStorage mock token for authentication headers
    spyOn(Storage.prototype, 'getItem').and.returnValue('test-token');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service).toBeInstanceOf(InitialDataService);
  });

  it('should initialize with correct dependencies', () => {
    expect((service as any).initModel).toBeInstanceOf(InitialData);
    expect((service as any).initModel.api_endpoint).toBe('/init');
    expect((service as any).storageService).toBe(storageServiceSpy);
    expect((service as any).spinner).toBeTruthy();
  });

  describe('refresh()', () => {
    it('should call spinner on/off and make HTTP request to /init endpoint', fakeAsync(() => {
      const mockResponse = {
        users: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
        settings: { theme: 'dark', language: 'en' },
        permissions: ['read', 'write']
      };

      let observableResult: boolean | undefined;

      // Subscribe to the refresh observable
      service.refresh().subscribe(result => {
        observableResult = result;
      });

      // Verify that spinner.on was called
      expect((service as any).spinner.on).toHaveBeenCalledWith('dashboard-init');

      // Handle the HTTP request
      const req = httpMock.expectOne('http://dummy.test/api/init');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toMatch(/^Bearer test-token/);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');
      
      // Flush the response
      req.flush(mockResponse);
      tick();

      // Verify that storage service was called for each key in the response
      expect(storageServiceSpy.setItem).toHaveBeenCalledTimes(3);
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('users', JSON.stringify(mockResponse.users));
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('settings', JSON.stringify(mockResponse.settings));
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('permissions', JSON.stringify(mockResponse.permissions));

      // Verify that spinner.off was called
      expect((service as any).spinner.off).toHaveBeenCalledWith('dashboard-init');

      // Verify that the observable returns true
      expect(observableResult).toBe(true);
    }));

    it('should handle empty response object correctly', fakeAsync(() => {
      const mockResponse = {};

      let observableResult: boolean | undefined;

      service.refresh().subscribe(result => {
        observableResult = result;
      });

      // Verify spinner.on was called
      expect((service as any).spinner.on).toHaveBeenCalledWith('dashboard-init');

      // Handle the HTTP request
      const req = httpMock.expectOne('http://dummy.test/api/init');
      expect(req.request.method).toBe('GET');
      
      // Flush empty response
      req.flush(mockResponse);
      tick();

      // Verify that storage service was not called since response is empty
      expect(storageServiceSpy.setItem).not.toHaveBeenCalled();

      // Verify spinner.off was called
      expect((service as any).spinner.off).toHaveBeenCalledWith('dashboard-init');

      // Verify the observable returns true
      expect(observableResult).toBe(true);
    }));

    it('should handle response with single key-value pair', fakeAsync(() => {
      const mockResponse = {
        singleKey: 'singleValue'
      };

      let observableResult: boolean | undefined;

      service.refresh().subscribe(result => {
        observableResult = result;
      });

      // Verify spinner.on was called
      expect((service as any).spinner.on).toHaveBeenCalledWith('dashboard-init');

      // Handle the HTTP request
      const req = httpMock.expectOne('http://dummy.test/api/init');
      expect(req.request.method).toBe('GET');
      
      // Flush the response
      req.flush(mockResponse);
      tick();

      // Verify storage service was called once
      expect(storageServiceSpy.setItem).toHaveBeenCalledTimes(1);
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('singleKey', JSON.stringify('singleValue'));

      // Verify spinner.off was called
      expect((service as any).spinner.off).toHaveBeenCalledWith('dashboard-init');

      // Verify the observable returns true
      expect(observableResult).toBe(true);
    }));

    it('should handle complex nested objects in response', fakeAsync(() => {
      const mockResponse = {
        complexData: {
          nested: {
            deeply: {
              value: 'test',
              array: [1, 2, 3],
              object: { key: 'value' }
            }
          }
        }
      };

      let observableResult: boolean | undefined;

      service.refresh().subscribe(result => {
        observableResult = result;
      });

      // Verify spinner.on was called
      expect((service as any).spinner.on).toHaveBeenCalledWith('dashboard-init');

      // Handle the HTTP request
      const req = httpMock.expectOne('http://dummy.test/api/init');
      expect(req.request.method).toBe('GET');
      
      // Flush the response
      req.flush(mockResponse);
      tick();

      // Verify storage service was called with proper JSON stringification
      expect(storageServiceSpy.setItem).toHaveBeenCalledTimes(1);
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('complexData', JSON.stringify(mockResponse.complexData));

      // Verify spinner.off was called
      expect((service as any).spinner.off).toHaveBeenCalledWith('dashboard-init');

      // Verify the observable returns true
      expect(observableResult).toBe(true);
    }));

    it('should handle response with null and undefined values', fakeAsync(() => {
      const mockResponse = {
        nullValue: null,
        undefinedValue: undefined,
        zeroValue: 0,
        emptyString: '',
        falseValue: false
      };

      let observableResult: boolean | undefined;

      service.refresh().subscribe(result => {
        observableResult = result;
      });

      // Verify spinner.on was called
      expect((service as any).spinner.on).toHaveBeenCalledWith('dashboard-init');

      // Handle the HTTP request
      const req = httpMock.expectOne('http://dummy.test/api/init');
      expect(req.request.method).toBe('GET');
      
      // Flush the response
      req.flush(mockResponse);
      tick();

      // Verify storage service was called for each key (including falsy values)
      expect(storageServiceSpy.setItem).toHaveBeenCalledTimes(5);
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('nullValue', JSON.stringify(null));
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('undefinedValue', JSON.stringify(undefined));
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('zeroValue', JSON.stringify(0));
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('emptyString', JSON.stringify(''));
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('falseValue', JSON.stringify(false));

      // Verify spinner.off was called
      expect((service as any).spinner.off).toHaveBeenCalledWith('dashboard-init');

      // Verify the observable returns true
      expect(observableResult).toBe(true);
    }));

    it('should be idempotent - multiple calls should work correctly', fakeAsync(() => {
      const mockResponse1 = { data1: 'value1' };
      const mockResponse2 = { data2: 'value2' };

      // First call
      service.refresh().subscribe();
      let req = httpMock.expectOne('http://dummy.test/api/init');
      req.flush(mockResponse1);
      tick();

      // Reset spy call counts
      storageServiceSpy.setItem.calls.reset();
      (service as any).spinner.on.calls.reset();
      (service as any).spinner.off.calls.reset();

      // Second call
      service.refresh().subscribe();
      req = httpMock.expectOne('http://dummy.test/api/init');
      req.flush(mockResponse2);
      tick();

      // Verify second call worked correctly
      expect(storageServiceSpy.setItem).toHaveBeenCalledTimes(1);
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('data2', JSON.stringify('value2'));
      expect((service as any).spinner.on).toHaveBeenCalledWith('dashboard-init');
      expect((service as any).spinner.off).toHaveBeenCalledWith('dashboard-init');
    }));
  });
});