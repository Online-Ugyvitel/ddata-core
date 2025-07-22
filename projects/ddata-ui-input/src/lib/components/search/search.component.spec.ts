import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ElementRef } from '@angular/core';
import { DdataInputSearchComponent } from './search.component';
import { ProxyFactoryService, DdataCoreModule, Paginate, SpinnerService } from 'ddata-core';
import { SearchResult } from '../../models/search/result/search-result.model';
import { BaseSearch } from '../../models/search/base-search.model';
import { BaseSearchResult } from '../../models/search/result/base-search-result.model';
import { BehaviorSubject, of, throwError } from 'rxjs';

describe('DdataInputSearchComponent', () => {
  let component: DdataInputSearchComponent;
  let fixture: ComponentFixture<DdataInputSearchComponent>;
  let router: Router;
  let mockElementRef: ElementRef;
  let mockSpinnerService: jasmine.SpyObj<SpinnerService>;
  let mockProxyService: jasmine.SpyObj<any>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
    );
  });

  beforeEach(() => {
    mockSpinnerService = jasmine.createSpyObj('SpinnerService', ['on', 'off']);
    mockProxyService = jasmine.createSpyObj('ProxyService', ['search', 'getPage']);
    mockElementRef = {
      nativeElement: {
        contains: jasmine.createSpy('contains').and.returnValue(false)
      }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [DdataInputSearchComponent],
      providers: [
        ProxyFactoryService,
        HttpClient,
        HttpHandler,
        { provide: SpinnerService, useValue: mockSpinnerService }
      ]
    });
  });

  beforeEach(() => {
    DdataCoreModule.InjectorInstance = TestBed;
    TestBed.inject(ProxyFactoryService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DdataInputSearchComponent);
    component = fixture.componentInstance;
    
    // Set up mocks
    component.service = mockProxyService;
    (component as any).elementRef = mockElementRef;
    
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture?.debugElement?.nativeElement?.parentNode) {
      fixture.debugElement.nativeElement.parentNode.removeChild(fixture.debugElement.nativeElement);
    }
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.model).toBeInstanceOf(BaseSearch);
    expect(component.pageNumber).toBe(0);
    expect(component.service).toBeDefined();
    expect(component.icon.search).toBeDefined();
    expect(component.isActive).toBeInstanceOf(BehaviorSubject);
    expect(component.isActive.value).toBe(false);
    expect(component.models).toEqual([]);
    expect(component.paginate).toBeInstanceOf(Paginate);
  });

  describe('ngOnDestroy', () => {
    it('should set isActive to false', () => {
      component.isActive.next(true);
      component.ngOnDestroy();
      expect(component.isActive.value).toBe(false);
    });
  });

  describe('close', () => {
    it('should reset models and set isActive to false', () => {
      component.models = [new BaseSearchResult()];
      component.isActive.next(true);
      
      component.close();
      
      expect(component.models).toEqual([]);
      expect(component.isActive.value).toBe(false);
    });
  });

  describe('clickout', () => {
    it('should close when clicking outside the component', () => {
      spyOn(component, 'close');
      mockElementRef.nativeElement.contains.and.returnValue(false);
      
      const mockEvent = { target: document.createElement('div') };
      component.clickout(mockEvent);
      
      expect(component.close).toHaveBeenCalled();
    });

    it('should not close when clicking inside the component', () => {
      spyOn(component, 'close');
      mockElementRef.nativeElement.contains.and.returnValue(true);
      
      const mockEvent = { target: document.createElement('div') };
      component.clickout(mockEvent);
      
      expect(component.close).not.toHaveBeenCalled();
    });
  });

  describe('search', () => {
    let mockSearchInput: HTMLInputElement;
    
    beforeEach(() => {
      mockSearchInput = document.createElement('input');
      component.searchInput = { nativeElement: mockSearchInput };
    });

    it('should return undefined and reset state when search text is empty', () => {
      component.model.searchText = '';
      component.models = [new BaseSearchResult()];
      component.isActive.next(true);
      
      const result = component.search();
      
      expect(result).toBeUndefined();
      expect(component.isActive.value).toBe(false);
      expect(component.models).toEqual([]);
    });

    it('should set isActive to false and return observable when search text is not empty', () => {
      component.model.searchText = 'test';
      component.isActive.next(true);
      
      const result = component.search();
      
      expect(component.isActive.value).toBe(false);
      expect(result).toBeDefined();
      expect(result.subscribe).toBeDefined();
    });

    it('should trigger search service with correct parameters', (done) => {
      const mockPaginate = new Paginate([new BaseSearchResult()]);
      mockProxyService.search.and.returnValue(of(mockPaginate));
      
      component.model.searchText = 'test';
      component.pageNumber = 1;
      
      const searchObservable = component.search();
      
      // Simulate keyup event
      const keyupEvent = new Event('keyup');
      mockSearchInput.dispatchEvent(keyupEvent);
      
      setTimeout(() => {
        searchObservable.subscribe({
          next: (result) => {
            expect(mockProxyService.search).toHaveBeenCalledWith(component.model.prepareToSave(), 1);
            expect(mockSpinnerService.on).toHaveBeenCalledWith('search');
            expect(mockSpinnerService.off).toHaveBeenCalledWith('search');
            done();
          }
        });
      }, 600); // Wait for debounce time
    });

    it('should handle search service error', (done) => {
      mockProxyService.search.and.returnValue(throwError('Search error'));
      
      component.model.searchText = 'test';
      
      const searchObservable = component.search();
      
      // Simulate keyup event
      const keyupEvent = new Event('keyup');
      mockSearchInput.dispatchEvent(keyupEvent);
      
      setTimeout(() => {
        searchObservable.subscribe({
          error: (error) => {
            expect(error).toBe('Search error');
            expect(mockSpinnerService.off).toHaveBeenCalledWith('search');
            done();
          }
        });
      }, 600);
    });
  });
  describe('changePage', () => {
    it('should call service.getPage with correct page number', () => {
      const mockPaginate = new Paginate([new BaseSearchResult()]);
      mockProxyService.getPage.and.returnValue(of(mockPaginate));
      
      component.changePage(2);
      
      expect(mockProxyService.getPage).toHaveBeenCalledWith(2);
    });

    it('should turn on and off spinner during page change', () => {
      const mockPaginate = new Paginate([new BaseSearchResult()]);
      mockProxyService.getPage.and.returnValue(of(mockPaginate));
      
      component.changePage(1);
      
      expect(mockSpinnerService.on).toHaveBeenCalledWith('global-search-change-page');
      expect(mockSpinnerService.off).toHaveBeenCalledWith('global-search-change-page');
    });

    it('should call setResult with paginate response', () => {
      const mockPaginate = new Paginate([new BaseSearchResult()]);
      mockProxyService.getPage.and.returnValue(of(mockPaginate));
      spyOn(component as any, 'setResult');
      
      component.changePage(1);
      
      expect((component as any).setResult).toHaveBeenCalledWith(mockPaginate);
    });

    it('should handle getPage service error', () => {
      mockProxyService.getPage.and.returnValue(throwError('Page error'));
      
      component.changePage(1);
      
      expect(mockSpinnerService.off).toHaveBeenCalledWith('global-search-change-page');
    });
  });

  describe('go', () => {
    it('should navigate to correct URL', () => {
      const mockModel = new BaseSearch();
      mockModel.url = '/test';
      mockModel.id = '123';
      
      spyOn(router, 'navigateByUrl');
      spyOn(component, 'close');
      
      component.go(mockModel);
      
      expect(router.navigateByUrl).toHaveBeenCalledWith('/test/edit/123');
    });

    it('should call close method', () => {
      const mockModel = new BaseSearch();
      mockModel.url = '/test';
      mockModel.id = '123';
      
      spyOn(router, 'navigateByUrl');
      spyOn(component, 'close');
      
      component.go(mockModel);
      
      expect(component.close).toHaveBeenCalled();
    });
  });

  describe('setResult', () => {
    it('should store result in paginate property', () => {
      const fakePaginate = new Paginate([new BaseSearchResult()]);
      
      (component as any).setResult(fakePaginate);
      
      expect(component.paginate).toEqual(fakePaginate);
    });

    it('should reset models array', () => {
      component.models = [new BaseSearchResult(), new BaseSearchResult()];
      const fakePaginate = new Paginate([new BaseSearchResult()]);
      
      (component as any).setResult(fakePaginate);
      
      expect(component.models).toEqual([jasmine.any(BaseSearchResult)]);
    });

    it('should process each item in result data', () => {
      const searchResultData = { id: '1', name: 'Test' };
      const fakePaginate = new Paginate([searchResultData]);
      spyOn(BaseSearchResult.prototype, 'init').and.returnValue(new BaseSearchResult());
      
      (component as any).setResult(fakePaginate);
      
      expect(BaseSearchResult.prototype.init).toHaveBeenCalledWith(searchResultData);
      expect(component.models.length).toBe(1);
    });

    it('should handle empty result data', () => {
      const fakePaginate = new Paginate([]);
      
      (component as any).setResult(fakePaginate);
      
      expect(component.paginate).toEqual(fakePaginate);
      expect(component.models).toEqual([]);
    });

    it('should handle multiple items in result data', () => {
      const item1 = { id: '1', name: 'Test1' };
      const item2 = { id: '2', name: 'Test2' };
      const fakePaginate = new Paginate([item1, item2]);
      
      (component as any).setResult(fakePaginate);
      
      expect(component.models.length).toBe(2);
      expect(component.models[0]).toBeInstanceOf(BaseSearchResult);
      expect(component.models[1]).toBeInstanceOf(BaseSearchResult);
    });
  });

  describe('BehaviorSubject interactions', () => {
    it('should allow subscription to isActive changes', () => {
      let receivedValue: boolean;
      
      component.isActive.subscribe(value => {
        receivedValue = value;
      });
      
      component.isActive.next(true);
      expect(receivedValue).toBe(true);
      
      component.isActive.next(false);
      expect(receivedValue).toBe(false);
    });
  });

  describe('Component integration', () => {
    it('should work with real constructor parameters', () => {
      const testComponent = new DdataInputSearchComponent(mockElementRef, router);
      
      expect(testComponent).toBeTruthy();
      expect(testComponent.model).toBeInstanceOf(BaseSearch);
      expect(testComponent.pageNumber).toBe(0);
    });

    it('should handle null/undefined clickout event target', () => {
      spyOn(component, 'close');
      mockElementRef.nativeElement.contains.and.returnValue(false);
      
      const mockEventWithNullTarget = { target: null };
      component.clickout(mockEventWithNullTarget);
      
      expect(component.close).toHaveBeenCalled();
    });

    it('should maintain spinner service reference', () => {
      expect(component.spinner).toBeDefined();
      expect(component.spinner).toBe(mockSpinnerService);
    });

    it('should initialize with correct icon configuration', () => {
      expect(component.icon).toBeDefined();
      expect(component.icon.search).toBeDefined();
    });

    it('should handle view child searchInput reference', () => {
      const mockInput = document.createElement('input');
      component.searchInput = { nativeElement: mockInput };
      
      expect(component.searchInput.nativeElement).toBe(mockInput);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle search when searchInput is not defined', () => {
      component.model.searchText = 'test';
      component.searchInput = undefined;
      
      expect(() => component.search()).not.toThrow();
    });

    it('should handle setResult with null/undefined items', () => {
      const fakePaginate = new Paginate([null, undefined]);
      
      expect(() => (component as any).setResult(fakePaginate)).not.toThrow();
    });

    it('should handle go method with null model', () => {
      spyOn(router, 'navigateByUrl');
      spyOn(component, 'close');
      
      const nullModel = null as any;
      
      expect(() => component.go(nullModel)).toThrow();
    });

    it('should handle changePage with negative page number', () => {
      const mockPaginate = new Paginate([]);
      mockProxyService.getPage.and.returnValue(of(mockPaginate));
      
      component.changePage(-1);
      
      expect(mockProxyService.getPage).toHaveBeenCalledWith(-1);
    });
  });
});
