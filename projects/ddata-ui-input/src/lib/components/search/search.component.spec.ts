// @ts-nocheck -- generated spec uses loosely typed mock models, events and private members
import { Injector, ChangeDetectorRef, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DdataInputSearchComponent } from './search.component';
import { ProxyFactoryService, DdataCoreModule, Paginate, SpinnerService } from '@netdjw/ddata-core';
import { SearchResult } from '../../models/search/result/search-result.model';
import { BaseSearch } from '../../models/search/base-search.model';
import { BaseSearchResult } from '../../models/search/result/base-search-result.model';
import { BehaviorSubject, of, throwError } from 'rxjs';
// Components are OnPush by default in Angular 22, so direct property changes need an explicit dirty mark.
const detectChangesOf = (fixture: ComponentFixture<unknown>): void => {
  fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
  fixture.detectChanges();
};
// Paginate takes the model type as constructor argument, the data is set afterwards.
const paginateOf = (data: Array<unknown>): Paginate =>
  Object.assign(new Paginate(BaseSearchResult), { data });

describe('DdataInputSearchComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers({ advanceTimeDelta: 1, shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  let component: DdataInputSearchComponent;
  let fixture: ComponentFixture<DdataInputSearchComponent>;
  let router: Router;
  let mockElementRef: ElementRef;
  let mockSpinnerService: any;
  let mockProxyService: any;

  beforeEach(() => {
    mockSpinnerService = {
      on: vi.fn().mockName('SpinnerService.on'),
      off: vi.fn().mockName('SpinnerService.off')
    };
    mockProxyService = {
      search: vi.fn().mockName('ProxyService.search'),
      getPage: vi.fn().mockName('ProxyService.getPage')
    };
    mockElementRef = {
      nativeElement: {
        contains: vi.fn().mockName('contains').mockReturnValue(false)
      }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [DdataInputSearchComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ProxyFactoryService,
        HttpClient,
        HttpHandler,
        { provide: SpinnerService, useValue: mockSpinnerService }
      ]
    });
  });

  beforeEach(() => {
    DdataCoreModule.InjectorInstance = {
      get: (token: never) => TestBed.inject(token)
    };
    TestBed.inject(ProxyFactoryService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DdataInputSearchComponent);
    component = fixture.componentInstance;

    // Set up mocks
    component.service = mockProxyService;
    (component as any).elementRef = mockElementRef;

    detectChangesOf(fixture);
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
      vi.spyOn(component, 'close').mockReturnValue(undefined);
      mockElementRef.nativeElement.contains.mockReturnValue(false);
      const mockEvent = { target: document.createElement('div') };

      component.clickout(mockEvent);

      expect(component.close).toHaveBeenCalled();
    });

    it('should not close when clicking inside the component', () => {
      vi.spyOn(component, 'close').mockReturnValue(undefined);
      mockElementRef.nativeElement.contains.mockReturnValue(true);
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

    it('should trigger search service with correct parameters', async () => {
      const mockPaginate = paginateOf([new BaseSearchResult()]);
      const results: Array<unknown> = [];

      mockProxyService.search.mockReturnValue(of(mockPaginate));
      component.model.searchText = 'test';
      component.pageNumber = 1;

      component.search().subscribe((result) => results.push(result));
      mockSearchInput.dispatchEvent(new Event('keyup'));
      await vi.advanceTimersByTimeAsync(500);

      expect(mockProxyService.search).toHaveBeenCalledWith(component.model.prepareToSave(), 1);
      expect(mockSpinnerService.on).toHaveBeenCalledWith('search');
      expect(results.length).toBe(1);
    });

    it('should handle search service error', async () => {
      let receivedError: unknown;

      mockProxyService.search.mockReturnValue(throwError(() => 'Search error'));
      component.model.searchText = 'test';

      component.search().subscribe({ error: (error) => (receivedError = error) });
      mockSearchInput.dispatchEvent(new Event('keyup'));
      await vi.advanceTimersByTimeAsync(500);

      expect(receivedError).toBe('Search error');
      expect(mockSpinnerService.off).toHaveBeenCalledWith('search');
    });
  });

  describe('changePage', () => {
    it('should call service.getPage with correct page number', () => {
      const mockPaginate = paginateOf([new BaseSearchResult()]);

      mockProxyService.getPage.mockReturnValue(of(mockPaginate));

      component.changePage(2);

      expect(mockProxyService.getPage).toHaveBeenCalledWith(2);
    });

    it('should turn on and off spinner during page change', () => {
      const mockPaginate = paginateOf([new BaseSearchResult()]);

      mockProxyService.getPage.mockReturnValue(of(mockPaginate));

      component.changePage(1);

      expect(mockSpinnerService.on).toHaveBeenCalledWith('global-search-change-page');
      expect(mockSpinnerService.off).toHaveBeenCalledWith('global-search-change-page');
    });

    it('should call setResult with paginate response', () => {
      const mockPaginate = paginateOf([new BaseSearchResult()]);

      mockProxyService.getPage.mockReturnValue(of(mockPaginate));
      vi.spyOn(component as any, 'setResult').mockReturnValue(undefined);

      component.changePage(1);

      expect((component as any).setResult).toHaveBeenCalledWith(mockPaginate);
    });

    it('should handle getPage service error', () => {
      vi.spyOn(console, 'error').mockReturnValue(undefined);
      mockProxyService.getPage.mockReturnValue(throwError(() => 'Page error'));

      component.changePage(1);

      expect(mockSpinnerService.off).toHaveBeenCalledWith('global-search-change-page');
    });
  });

  describe('go', () => {
    it('should navigate to correct URL', () => {
      const mockModel = new BaseSearch();

      mockModel.url = '/test';
      mockModel.id = '123';

      vi.spyOn(router, 'navigateByUrl').mockReturnValue(undefined);
      vi.spyOn(component, 'close').mockReturnValue(undefined);

      component.go(mockModel);

      expect(router.navigateByUrl).toHaveBeenCalledWith('/test/edit/123');
    });

    it('should call close method', () => {
      const mockModel = new BaseSearch();

      mockModel.url = '/test';
      mockModel.id = '123';

      vi.spyOn(router, 'navigateByUrl').mockReturnValue(undefined);
      vi.spyOn(component, 'close').mockReturnValue(undefined);

      component.go(mockModel);

      expect(component.close).toHaveBeenCalled();
    });
  });

  describe('setResult', () => {
    it('should store result in paginate property', () => {
      const fakePaginate = paginateOf([new BaseSearchResult()]);

      (component as any).setResult(fakePaginate);

      expect(component.paginate).toEqual(fakePaginate);
    });

    it('should reset models array', () => {
      component.models = [new BaseSearchResult(), new BaseSearchResult()];
      const fakePaginate = paginateOf([new BaseSearchResult()]);

      (component as any).setResult(fakePaginate);

      expect(component.models).toEqual([expect.any(BaseSearchResult)]);
    });

    it('should process each item in result data', () => {
      const searchResultData = { id: '1', name: 'Test' };
      const fakePaginate = paginateOf([searchResultData]);

      vi.spyOn(BaseSearchResult.prototype, 'init').mockReturnValue(new BaseSearchResult());

      (component as any).setResult(fakePaginate);

      expect(BaseSearchResult.prototype.init).toHaveBeenCalledWith(searchResultData);
      expect(component.models.length).toBe(1);
    });

    it('should handle empty result data', () => {
      const fakePaginate = paginateOf([]);

      (component as any).setResult(fakePaginate);

      expect(component.paginate).toEqual(fakePaginate);
      expect(component.models).toEqual([]);
    });

    it('should handle multiple items in result data', () => {
      const item1 = { id: '1', name: 'Test1' };
      const item2 = { id: '2', name: 'Test2' };
      const fakePaginate = paginateOf([item1, item2]);

      (component as any).setResult(fakePaginate);

      expect(component.models.length).toBe(2);
      expect(component.models[0]).toBeInstanceOf(BaseSearchResult);
      expect(component.models[1]).toBeInstanceOf(BaseSearchResult);
    });
  });

  describe('BehaviorSubject interactions', () => {
    it('should allow subscription to isActive changes', () => {
      let receivedValue: boolean;

      component.isActive.subscribe((value) => {
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
      vi.spyOn(component, 'close').mockReturnValue(undefined);
      mockElementRef.nativeElement.contains.mockReturnValue(false);
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
      vi.spyOn(router, 'navigateByUrl').mockReturnValue(undefined);
      vi.spyOn(component, 'close').mockReturnValue(undefined);
      const nullModel = null as any;

      expect(() => component.go(nullModel)).toThrow();
    });

    it('should handle changePage with negative page number', () => {
      const mockPaginate = paginateOf([]);

      mockProxyService.getPage.mockReturnValue(of(mockPaginate));

      component.changePage(-1);

      expect(mockProxyService.getPage).toHaveBeenCalledWith(-1);
    });
  });
});
