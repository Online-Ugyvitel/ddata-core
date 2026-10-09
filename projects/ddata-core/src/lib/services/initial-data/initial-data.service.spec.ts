import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
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
  beforeEach(() => {
    vi.useFakeTimers({ advanceTimeDelta: 1, shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  let service: InitialDataService;
  let storageServiceSpy: any;
  let spinnerServiceSpy: any;
  let httpMock: HttpTestingController;
  let envServiceMock: any;

  beforeEach(() => {
    // Create spies for dependencies
    const storageServiceSpyObj = {
      setItem: vi.fn().mockName('StorageService.setItem')
    };
    const spinnerServiceSpyObj = {
      on: vi.fn().mockName('SpinnerService.on'),
      off: vi.fn().mockName('SpinnerService.off')
    };

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
    DdataCoreModule.InjectorInstance = {
      get: (token: never) => TestBed.inject(token)
    };
    DdataInjectorModule.InjectorInstance = {
      get: (token: never) => TestBed.inject(token)
    };

    service = TestBed.inject(InitialDataService);
    storageServiceSpy = TestBed.inject(StorageService) as any;
    spinnerServiceSpy = TestBed.inject(SpinnerService) as any;
    httpMock = TestBed.inject(HttpTestingController);

    // Set up localStorage mock token for authentication headers
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('test-token');
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
    it('should call spinner on/off and make HTTP request to /init endpoint', async () => {
      const mockResponse = {
        users: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' }
        ],
        settings: { theme: 'dark', language: 'en' },
        permissions: ['read', 'write']
      };
      let observableResult: boolean | undefined;

      // Subscribe to the refresh observable
      service.refresh().subscribe((result) => {
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
      await vi.advanceTimersByTimeAsync(0);

      // Verify that storage service was called for each key in the response
      expect(storageServiceSpy.setItem).toHaveBeenCalledTimes(3);
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith(
        'users',
        JSON.stringify(mockResponse.users)
      );

      expect(storageServiceSpy.setItem).toHaveBeenCalledWith(
        'settings',
        JSON.stringify(mockResponse.settings)
      );

      expect(storageServiceSpy.setItem).toHaveBeenCalledWith(
        'permissions',
        JSON.stringify(mockResponse.permissions)
      );

      // Verify that spinner.off was called
      expect((service as any).spinner.off).toHaveBeenCalledWith('dashboard-init');

      // Verify that the observable returns true
      expect(observableResult).toBe(true);
    });

    it('should handle empty response object correctly', async () => {
      const mockResponse = {};
      let observableResult: boolean | undefined;

      service.refresh().subscribe((result) => {
        observableResult = result;
      });

      // Verify spinner.on was called
      expect((service as any).spinner.on).toHaveBeenCalledWith('dashboard-init');
      // Handle the HTTP request
      const req = httpMock.expectOne('http://dummy.test/api/init');

      expect(req.request.method).toBe('GET');

      // Flush empty response
      req.flush(mockResponse);
      await vi.advanceTimersByTimeAsync(0);

      // Verify that storage service was not called since response is empty
      expect(storageServiceSpy.setItem).not.toHaveBeenCalled();

      // Verify spinner.off was called
      expect((service as any).spinner.off).toHaveBeenCalledWith('dashboard-init');

      // Verify the observable returns true
      expect(observableResult).toBe(true);
    });

    it('should handle response with single key-value pair', async () => {
      const mockResponse = {
        singleKey: 'singleValue'
      };
      let observableResult: boolean | undefined;

      service.refresh().subscribe((result) => {
        observableResult = result;
      });

      // Verify spinner.on was called
      expect((service as any).spinner.on).toHaveBeenCalledWith('dashboard-init');
      // Handle the HTTP request
      const req = httpMock.expectOne('http://dummy.test/api/init');

      expect(req.request.method).toBe('GET');

      // Flush the response
      req.flush(mockResponse);
      await vi.advanceTimersByTimeAsync(0);

      // Verify storage service was called once
      expect(storageServiceSpy.setItem).toHaveBeenCalledTimes(1);
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith(
        'singleKey',
        JSON.stringify('singleValue')
      );

      // Verify spinner.off was called
      expect((service as any).spinner.off).toHaveBeenCalledWith('dashboard-init');

      // Verify the observable returns true
      expect(observableResult).toBe(true);
    });

    it('should handle complex nested objects in response', async () => {
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

      service.refresh().subscribe((result) => {
        observableResult = result;
      });

      // Verify spinner.on was called
      expect((service as any).spinner.on).toHaveBeenCalledWith('dashboard-init');
      // Handle the HTTP request
      const req = httpMock.expectOne('http://dummy.test/api/init');

      expect(req.request.method).toBe('GET');

      // Flush the response
      req.flush(mockResponse);
      await vi.advanceTimersByTimeAsync(0);

      // Verify storage service was called with proper JSON stringification
      expect(storageServiceSpy.setItem).toHaveBeenCalledTimes(1);
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith(
        'complexData',
        JSON.stringify(mockResponse.complexData)
      );

      // Verify spinner.off was called
      expect((service as any).spinner.off).toHaveBeenCalledWith('dashboard-init');

      // Verify the observable returns true
      expect(observableResult).toBe(true);
    });

    it('should handle response with null and undefined values', async () => {
      const mockResponse = {
        nullValue: null,
        undefinedValue: undefined,
        zeroValue: 0,
        emptyString: '',
        falseValue: false
      };
      let observableResult: boolean | undefined;

      service.refresh().subscribe((result) => {
        observableResult = result;
      });

      // Verify spinner.on was called
      expect((service as any).spinner.on).toHaveBeenCalledWith('dashboard-init');
      // Handle the HTTP request
      const req = httpMock.expectOne('http://dummy.test/api/init');

      expect(req.request.method).toBe('GET');

      // Flush the response
      req.flush(mockResponse);
      await vi.advanceTimersByTimeAsync(0);

      // Verify storage service was called for each key (including falsy values)
      expect(storageServiceSpy.setItem).toHaveBeenCalledTimes(5);
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('nullValue', JSON.stringify(null));
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith(
        'undefinedValue',
        JSON.stringify(undefined)
      );

      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('zeroValue', JSON.stringify(0));
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('emptyString', JSON.stringify(''));
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('falseValue', JSON.stringify(false));

      // Verify spinner.off was called
      expect((service as any).spinner.off).toHaveBeenCalledWith('dashboard-init');

      // Verify the observable returns true
      expect(observableResult).toBe(true);
    });

    it('should handle HTTP error and propagate it correctly', async () => {
      let errorOccurred = false;
      let observableResult: boolean | undefined;

      service.refresh().subscribe({
        next: (result) => {
          observableResult = result;
        },
        error: (error) => {
          errorOccurred = true;

          expect(error.status).toBe(500);
        }
      });

      // Verify spinner.on was called
      expect((service as any).spinner.on).toHaveBeenCalledWith('dashboard-init');
      // Handle the HTTP request and simulate an error
      const req = httpMock.expectOne('http://dummy.test/api/init');

      expect(req.request.method).toBe('GET');

      // Flush an error response
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      await vi.advanceTimersByTimeAsync(0);

      // Verify that error was propagated
      expect(errorOccurred).toBe(true);
      expect(observableResult).toBeUndefined();

      // Verify storage service was not called due to error
      expect(storageServiceSpy.setItem).not.toHaveBeenCalled();

      // Note: spinner.off would not be called in error scenarios since the map operator wouldn't execute
      // This is the actual behavior of the service - it only calls spinner.off on success
    });

    it('should be idempotent - multiple calls should work correctly', async () => {
      const mockResponse1 = { data1: 'value1' };
      const mockResponse2 = { data2: 'value2' };

      // First call
      service.refresh().subscribe();
      let req = httpMock.expectOne('http://dummy.test/api/init');

      req.flush(mockResponse1);
      await vi.advanceTimersByTimeAsync(0);

      // Reset spy call counts
      storageServiceSpy.setItem.mockClear();
      (service as any).spinner.on.mockClear();
      (service as any).spinner.off.mockClear();

      // Second call
      service.refresh().subscribe();
      req = httpMock.expectOne('http://dummy.test/api/init');
      req.flush(mockResponse2);
      await vi.advanceTimersByTimeAsync(0);

      // Verify second call worked correctly
      expect(storageServiceSpy.setItem).toHaveBeenCalledTimes(1);
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('data2', JSON.stringify('value2'));
      expect((service as any).spinner.on).toHaveBeenCalledWith('dashboard-init');
      expect((service as any).spinner.off).toHaveBeenCalledWith('dashboard-init');
    });
  });
});
