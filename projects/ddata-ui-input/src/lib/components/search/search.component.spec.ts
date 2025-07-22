import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DdataInputSearchComponent } from './search.component';

declare const document: Document;
import { ProxyFactoryService, DdataCoreModule, Paginate } from 'ddata-core';
import { SearchResultAbstract } from '../../models/search/result/search-result.model';

describe('GlobalSearchBarComponent', () => {
  let component: DdataInputSearchComponent;
  let fixture: ComponentFixture<DdataInputSearchComponent>;
  let router: Router;

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
      teardown: { destroyAfterEach: false }
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [DdataInputSearchComponent],
      providers: [ProxyFactoryService, HttpClient, HttpHandler]
    });
  });

  beforeEach(() => {
    DdataCoreModule.InjectorInstance = TestBed;
    TestBed.inject(ProxyFactoryService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DdataInputSearchComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.removeChild(fixture.debugElement.nativeElement);
  });

  it('should create', () => {
    component = new DdataInputSearchComponent(null, null);

    expect(component).toBeTruthy();
  });

  describe('search()', () => {
    it(' empty search string ==> models = []', () => {
      component = new DdataInputSearchComponent(null, null);
      component.model.searchText = '';
      component.search();

      expect(component.models).toEqual([]);
    });

    it(' should make a request', () => {
      component = new DdataInputSearchComponent(null, null);
      const spy = spyOn(component.service, 'search').and.callThrough();

      component.model.searchText = 'a';
      component.search();

      expect(spy).toHaveBeenCalledWith();
    });
  });

  it('changePage() should request another page', () => {
    component = new DdataInputSearchComponent(null, null);
    const spy = spyOn(component.service, 'getPage').and.callThrough();

    component.model.searchText = 'a';
    component.changePage(1);

    expect(spy).toHaveBeenCalledWith();
    expect(spy).toHaveBeenCalledWith(1);
  });

  describe('go() ', () => {
    it('should navigate to model', () => {
      component = new DdataInputSearchComponent(null, router);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spy = spyOn((component as any).router, 'navigateByUrl').and.callThrough();

      component.go(component.model);

      expect(spy).toHaveBeenCalledWith();
      expect(spy).toHaveBeenCalledWith(`${component.model.url}/edit/${component.model.id}`);
    });

    it('should close after navigation', () => {
      component = new DdataInputSearchComponent(null, router);
      const componentSpy = spyOn(component, 'close').and.callThrough();

      component.go(component.model);

      expect(componentSpy).toHaveBeenCalledWith();
    });
  });

  it('setResult() should store result in models', () => {
    component = new DdataInputSearchComponent(null, null);
    const fakePaginate = new Paginate([{} as unknown as SearchResultAbstract]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).setResult(fakePaginate);

    expect(component.paginate).toEqual(fakePaginate);
  });
});
