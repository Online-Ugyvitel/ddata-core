// tslint:disable: max-line-length
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jasmine/no-spec-dupes */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import 'zone.js/testing';
import { DdataCoreModule } from '../../ddata-core.module';
import { DdataInjectorModule } from '../../ddata-injector.module';
import { ID } from '../../models/base/base-data.type';
import { BaseModel } from '../../models/base/base-model.model';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { EnvService } from '../env/env.service';
import { ProxyService } from '../proxy/proxy.service';
import { SpinnerService } from '../spinner/spinner.service';
import { HelperService } from './helper.service';
import { HelperActivatedRouteService } from './helper-activated-route.service';

// Mock model for testing
class TestModel extends BaseModel {
  id: ID;
  name: string;
  testField = false;

  constructor() {
    super();
    this.api_endpoint = '/test-models';
    this.model_name = 'TestModel';
    this.id = 0 as ID;
    this.name = '';
  }

  init(data: any = null): TestModel {
    if (data) {
      this.id = data.id || (1 as ID);
      this.name = data.name || 'Test Name';
      this.testField = data.testField || false;
    }

    return this;
  }

  prepareToSave(): any {
    return {
      id: this.id,
      name: this.name,
      testField: this.testField
    };
  }

  validate(): void {
    this.isValid = true;
    this.validationErrors = [];
  }
}

// Mock services
class MockSpinnerService {
  on(name: string): void {}
  off(name: string): void {}
}

class MockProxyService {
  save(model: any): any {
    return of(1); // Return a mock ID
  }

  delete(model: any, paginate?: any): any {
    return of({
      data: [],
      current_page: 1,
      per_page: 10,
      from: 1,
      to: 0,
      total: 0,
      last_page: 1
    } as PaginateInterface);
  }
}

class MockRouter {
  async navigate(commands: Array<any>): Promise<boolean> {
    return Promise.resolve(true);
  }

  async navigateByUrl(url: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}

class MockActivatedRoute {
  snapshot = { params: {} };
}

class MockHelperActivatedRouteService {
  getUniqueListId(): number {
    return 0;
  }
}

class MockEnvService {
  environment = {
    apiUrl: 'http://test-api.com'
  };
}

describe('HelperService', () => {
  let service: HelperService<TestModel>;
  let mockSpinnerService: MockSpinnerService;
  let mockProxyService: MockProxyService;
  let mockRouter: MockRouter;
  let testModel: TestModel;

  beforeEach(waitForAsync(() => {
    mockSpinnerService = new MockSpinnerService();
    mockProxyService = new MockProxyService();
    mockRouter = new MockRouter();
    // Mock both injector instances
    const mockInjector = {
      get: jasmine.createSpy('get').and.callFake((token: any) => {
        if (token === SpinnerService) {
          return mockSpinnerService;
        }

        if (token === Router) {
          return mockRouter;
        }

        if (token === ActivatedRoute) {
          return new MockActivatedRoute();
        }

        if (token === EnvService) {
          return new MockEnvService();
        }

        return {};
      })
    };

    // Mock both static properties
    DdataCoreModule.InjectorInstance = mockInjector as any;
    DdataInjectorModule.InjectorInstance = mockInjector as any;

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: SpinnerService, useClass: MockSpinnerService },
        { provide: ProxyService, useClass: MockProxyService },
        HelperService
      ]
    });
  }));

  beforeEach(() => {
    testModel = new TestModel();
    testModel.init({ id: 1, name: 'Test Model', testField: false });
    service = new HelperService(testModel);

    // Mock the proxy service on the instance
    (service as any).proxy = mockProxyService;
  });

  afterEach(() => {
    // Clean up the static properties
    DdataCoreModule.InjectorInstance = null as any;
    DdataInjectorModule.InjectorInstance = null as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle basic service instantiation', () => {
    expect(service).toBeDefined();
    expect((service as any).instance.api_endpoint).toContain('/test-models');
  });

  describe('booleanChange', () => {
    it('should return false for null model', (done) => {
      service.booleanChange(null, 'testField').subscribe((result) => {
        expect(result).toBe(false);
        done();
      });
    });

    it('should toggle boolean field and save model', (done) => {
      spyOn(mockSpinnerService, 'on').and.callThrough();
      spyOn(mockSpinnerService, 'off').and.callThrough();
      spyOn(mockProxyService, 'save').and.returnValue(of(true));
      const originalValue = testModel.testField;

      service.booleanChange(testModel, 'testField').subscribe((result) => {
        expect(result).toBe(true);
        expect(testModel.testField).toBe(!originalValue);
        expect(mockSpinnerService.on).toHaveBeenCalledWith('booleanChange - TestModel - testField');
        expect(mockSpinnerService.off).toHaveBeenCalledWith(
          'booleanChange - TestModel - testField'
        );
        done();
      });
    });

    it('should revert field value on save failure', (done) => {
      spyOn(mockProxyService, 'save').and.returnValue(of(false));
      const originalValue = testModel.testField;

      service.booleanChange(testModel, 'testField').subscribe((result) => {
        expect(result).toBe(false);
        expect(testModel.testField).toBe(originalValue);
        done();
      });
    });

    it('should handle save error (field remains toggled due to deprecated error handling)', (done) => {
      spyOn(mockProxyService, 'save').and.returnValue(throwError('Save error'));
      const originalValue = testModel.testField;

      service.booleanChange(testModel, 'testField').subscribe({
        next: (result) => {
          // This shouldn't happen in error case
          expect(result).toBe(false);
          expect(testModel.testField).toBe(originalValue);
          done();
        },
        error: (error) => {
          // Note: The current implementation has a bug - it uses deprecated error handling
          // The field gets toggled but never reverted because the error handler in the
          // map operator is deprecated and doesn't work properly
          expect(testModel.testField).toBe(!originalValue); // Field is toggled but not reverted
          done();
        }
      });
    });
  });

  describe('save', () => {
    it('should return false for invalid model', (done) => {
      testModel.isValid = false;
      spyOn(testModel, 'validate').and.callFake(() => {
        testModel.isValid = false;
      });

      service.save(testModel).subscribe((result) => {
        expect(result).toBe(false);
        done();
      });
    });

    it('should emit model in modal mode without backend save', (done) => {
      const emitter = new EventEmitter<TestModel>();

      spyOn(emitter, 'emit').and.callThrough();

      service.save(testModel, true, emitter, false).subscribe((result) => {
        expect(result).toBe(true);
        expect(emitter.emit).toHaveBeenCalledWith(testModel);
        done();
      });
    });

    it('should save model and navigate on success', (done) => {
      spyOn(mockSpinnerService, 'on').and.callThrough();
      spyOn(mockSpinnerService, 'off').and.callThrough();
      spyOn(mockProxyService, 'save').and.returnValue(of(123));
      spyOn(mockRouter, 'navigateByUrl').and.resolveTo(true);

      service.save(testModel).subscribe((result) => {
        expect(result).toBe(true);
        expect(testModel.id).toBe(123 as ID);
        expect(mockSpinnerService.on).toHaveBeenCalledWith('save');
        expect(mockSpinnerService.off).toHaveBeenCalledWith('save');
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/test-models/list');
        done();
      });
    });
  });

  describe('saveAsNew', () => {
    it('should reset id to 0 and save model', (done) => {
      testModel.id = 999 as ID;
      spyOn(mockProxyService, 'save').and.returnValue(of(456));
      spyOn(mockRouter, 'navigateByUrl').and.resolveTo(true);

      service.saveAsNew(testModel).subscribe((result) => {
        expect(result).toBe(true);
        expect(testModel.id).toBe(456 as ID);
        done();
      });
    });
  });

  describe('stepBack', () => {
    it('should emit null in modal mode', () => {
      const emitter = new EventEmitter<TestModel>();

      spyOn(emitter, 'emit').and.callThrough();

      service.stepBack(testModel, true, emitter);

      expect(emitter.emit).toHaveBeenCalledWith(null);
    });

    it('should navigate in non-modal mode', () => {
      spyOn(mockRouter, 'navigateByUrl').and.resolveTo(true);

      service.stepBack(testModel, false);

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/test-models/list');
    });
  });

  describe('edit', () => {
    it('should emit model in modal mode', () => {
      const reference = {
        isModal: true,
        editModel: new EventEmitter<TestModel>()
      };

      spyOn(reference.editModel, 'emit').and.callThrough();

      service.edit(testModel, reference);

      expect(reference.editModel.emit).toHaveBeenCalledWith(testModel);
    });

    it('should navigate in non-modal mode', () => {
      const reference = { isModal: false };

      spyOn(mockRouter, 'navigate').and.resolveTo(true);

      service.edit(testModel, reference);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-models', 'edit', testModel.id]);
    });
  });

  describe('delete', () => {
    it('should emit model in modal mode', (done) => {
      const reference = {
        isModal: true,
        deleteModel: new EventEmitter<TestModel>()
      };

      spyOn(reference.deleteModel, 'emit').and.callThrough();

      service.delete(testModel, reference).subscribe((result) => {
        expect(result).toBe(false);
        expect(reference.deleteModel.emit).toHaveBeenCalledWith(testModel);
        done();
      });
    });

    it('should delete model and update reference in non-modal mode', (done) => {
      const mockPaginate = {
        data: [],
        current_page: 1,
        per_page: 10,
        from: 1,
        to: 0,
        total: 0,
        last_page: 1
      };
      const reference = {
        isModal: false,
        models: [],
        paginate: null
      };

      spyOn(mockSpinnerService, 'on').and.callThrough();
      spyOn(mockSpinnerService, 'off').and.callThrough();
      spyOn(mockProxyService, 'delete').and.returnValue(of(mockPaginate));

      service.delete(testModel, reference).subscribe((result) => {
        expect(result).toBe(true);
        expect(reference.models).toEqual([]);
        expect(reference.paginate).toEqual(mockPaginate);
        expect(mockSpinnerService.on).toHaveBeenCalledWith('TestModel');
        expect(mockSpinnerService.off).toHaveBeenCalledWith('TestModel');
        done();
      });
    });
  });
});
