import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DdataInputSearchComponent } from './search.component';
import { DdataCoreModule } from 'ddata-core';
import { DdataInjectorModule } from '../../../../../../projects/ddata-core/src/lib/ddata-injector.module';

// Additional core service mocks used indirectly through RemoteDataService chain
class MockEnvService {
  environment = { apiUrl: 'http://localhost/', debug: false };
}

describe('DdataInputSearchComponent', () => {
  let component: DdataInputSearchComponent;
  let fixture: ComponentFixture<DdataInputSearchComponent>;

  beforeEach(async () => {
    // Mock HttpClient
    const mockHttpClient = {
      get: jasmine.createSpy('get').and.returnValue({
        subscribe: jasmine.createSpy('subscribe')
      })
    };
    // Mock SpinnerService
    const mockSpinnerService = {
      show: jasmine.createSpy('show'),
      hide: jasmine.createSpy('hide'),
      isVisible: jasmine.createSpy('isVisible').and.returnValue(false)
    };
    // Mock ProxyService
    const mockProxyService = {
      get: jasmine.createSpy('get').and.returnValue({
        subscribe: jasmine.createSpy('subscribe')
      }),
      list: jasmine.createSpy('list').and.returnValue({
        subscribe: jasmine.createSpy('subscribe')
      })
    };
    // Mock ProxyFactoryService
    const mockProxyFactoryService = {
      get: jasmine.createSpy('get').and.returnValue(mockProxyService)
    };
    // Mock the injector to return appropriate services
    const mockEnvService = new MockEnvService();
    const mockInjector = {
      get: jasmine.createSpy('get').and.callFake((token: unknown) => {
        const tokenStr = token?.toString() || '';

        if (tokenStr.includes('SpinnerService')) {
          return mockSpinnerService;
        }
        if (tokenStr.includes('ProxyFactoryService')) {
          return mockProxyFactoryService;
        }

        if (tokenStr.includes('HttpClient')) {
          return mockHttpClient;
        }

        if (tokenStr.includes('EnvService')) {
          return mockEnvService;
        }

        return mockHttpClient;
      })
    };

  // Set the mock injectors (core + injector module used by RemoteDataService)
    DdataCoreModule.InjectorInstance = mockInjector;
    (DdataInjectorModule as unknown as { InjectorInstance: unknown }).InjectorInstance =
      mockInjector;

    await TestBed.configureTestingModule({
      declarations: [DdataInputSearchComponent],
      imports: [RouterTestingModule, FormsModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DdataInputSearchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
