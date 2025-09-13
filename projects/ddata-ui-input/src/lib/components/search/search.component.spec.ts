import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DdataInputSearchComponent } from './search.component';
import { DdataCoreModule } from 'ddata-core';

describe('DdataInputSearchComponent', () => {
  let component: DdataInputSearchComponent;
  let fixture: ComponentFixture<DdataInputSearchComponent>;

  beforeEach(async () => {
    // Mock DdataCoreModule.InjectorInstance
    const mockProxyFactoryService = {
      get: jasmine.createSpy('get').and.returnValue({
        loadData: jasmine.createSpy('loadData').and.resolveTo([]),
        getList: jasmine.createSpy('getList').and.returnValue([])
      })
    };
    const mockInjector = {
      get: jasmine.createSpy('get').and.returnValue(mockProxyFactoryService)
    };

    // Set up the mock injector before TestBed configuration
    Object.defineProperty(DdataCoreModule, 'InjectorInstance', {
      value: mockInjector,
      writable: true
    });

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
