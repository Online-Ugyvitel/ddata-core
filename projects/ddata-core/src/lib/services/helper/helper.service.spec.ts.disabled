// tslint:disable: max-line-length
import 'zone.js/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { AppModule } from 'src/app/app.module';
import { ID, TagName } from 'src/app/models/base-model/base-data-type.model';
import { PaginateInterface } from 'src/app/models/paginate/paginate.interface';
import { Paginate } from 'src/app/models/paginate/paginate.model';
import { TagInterface } from 'src/app/models/tag/tag.interface';
import { Tag } from 'src/app/models/tag/tag.model';
import { HelperService } from './helper.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ProxyService } from '../proxy/proxy.service';
import { tag_type } from 'src/app/i18n/tag.lang';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { request } from 'http';
import { EventEmitter } from 'protractor';
import { model } from 'src/app/i18n/product-category.lang';
import { emit } from 'process';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


class FakeProxy {
  changeToPage(num: number) {
    return of(num);
  }
  getPage(num: number) {
    return of(num);
  }
  getAll(parameterTag: TagInterface[]) {
    const testPaginate = new Paginate(Tag, new Tag().init(parameterTag));
    testPaginate.data = [new Tag().init()];
    return of(testPaginate);
  }
  deleteMultiple(reference: object) {
    return of(reference);
  }
  delete(reference: any) {
    return of(reference);
  }
  getOne(parameterTag: Tag) {
    if (parameterTag == null) {
      return of(false);
    }
    return of(true);
  }
  save(parameterTag: Tag) {

    return of(parameterTag);
  }
}

xdescribe('HelperService', () => {
  const routerSpy = {navigateByUrl: jasmine.createSpy('navigateByUrl')};

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
});
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    providers: [
        Injector,
        { provide: HelperService, useValue: new Tag() },
        { provide: ProxyService, useClass: FakeProxy },
        { provide: RouterTestingModule, useValue: routerSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  }));

  beforeEach(() => {
    AppModule.InjectorInstance = TestBed;
    TestBed.inject(HelperService);
    TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: HelperService<Tag> = TestBed.inject(HelperService);
    expect(service).toBeTruthy();
  });

  it('searchWithoutPaginate() should make a request', fakeAsync(inject([
    HelperService,
    HttpTestingController,
    RouterTestingModule,
  ], (
    done,
    httpMock: HttpTestingController
  ) => {
    const fakeData: TagInterface[] = [
      new Tag().init(),
      new Tag().init()
    ];
    const service = new HelperService(new Tag());
    const id = 0 as ID;
    service.searchWithoutPaginate(id).subscribe((result: TagInterface[]) => {
      expect(result).toBeTruthy();
      expect(result[0]).toBeInstanceOf(Tag);
    });

    const req = httpMock.expectOne('http://licon.test/api/settings/tag/search?paginate=off');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toBeDefined();
    req.flush(fakeData);
    tick();
    httpMock.verify();
  })));

  it('search() should make a request', fakeAsync(inject([
    HelperService,
    HttpTestingController,
    RouterTestingModule
  ], (done, httpMock: HttpTestingController  ) => {
    const fakeData: PaginateInterface = new Paginate(Tag, new Tag().init());
    const service = new HelperService(new Tag());
    const id = 0 as ID;
    const pagenumber = 0;
    service.search(id, pagenumber).subscribe((result: PaginateInterface) => {
      expect(result).toBeTruthy();
      expect(result).toBeInstanceOf(Paginate);
    });

    const req = httpMock.expectOne('http://licon.test/api/settings/tag/search');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toBeDefined();
    req.flush(fakeData);
    tick();
    httpMock.verify();
  })));

  it('getAll() should give back observable', fakeAsync(inject([
    HttpTestingController,
    HelperService
  ], () => {
    const service = new HelperService<TagInterface>(new Tag().init());
    (service as any).proxy = new FakeProxy();
    const parameterPaginate = new Paginate(Tag, new Tag().init());
    const parameterTag = [
      new Tag().init()
    ];
    const ismodal = true;

    service.getAll(parameterPaginate, parameterTag, ismodal).subscribe((result: PaginateInterface) => {
      expect(result).toBeTruthy();
      expect(result).toBeInstanceOf(Paginate);
      expect(result.data.length).toBe(1);
      expect(result.data[0]).toBeInstanceOf(Tag);
    });
    tick();
  })));

  it('changeToPage() should give back observable', fakeAsync(inject([
    HelperService,
    HttpTestingController,
    RouterTestingModule,
    ProxyService
  ], () => {
    const service = new HelperService(new Tag());
    (service as any).proxy = new FakeProxy();
    const models: Tag[] = [
      new Tag().init(),
      new Tag().init()
    ];
    const fakeData: PaginateInterface = new Paginate(Tag, models);
    const pagenumber = 0;
    const realpagenumber = 1;

    service.changeToPage(pagenumber, fakeData, models).subscribe((result: boolean) => {
      expect(result).toBe(false);
      expect(result).toBeFalse();
    });

    tick();

    service.changeToPage(realpagenumber, fakeData, models).subscribe((result: boolean) => {
      expect(result).toBeTruthy();
      expect(result).toBe(true);
    });
  })));

  it('deleteMultiple() should give back observable', fakeAsync(inject([
    HelperService,
    HttpTestingController,
    RouterTestingModule
  ], (done, httpMock: HttpTestingController) => {
    const fakeData: Tag[] = [
      new Tag().init(),
      new Tag().init()
    ];
    const service = new HelperService(new Tag().init());
    (service as any).proxy = new FakeProxy();
    const reference = {
      isModal: false,
      models: null,
      paginate: null
    };

    service.deleteMultiple(fakeData, reference).subscribe((result: boolean) => {
      expect(result).toBeTruthy();
      expect(result).toBe(true);
    });
    tick();
    httpMock.verify();
  })));

  it('delete() should give back observable', fakeAsync(inject([
    HelperService,
    HttpTestingController,
    RouterTestingModule
  ], () => {
    const fakeData: Tag = new Tag().init();
    const service = new HelperService(new Tag().init());
    (service as any).proxy = new FakeProxy();
    const reference = {
      isModal: false,
    };
    service.delete(fakeData, reference).subscribe((result: boolean) => {
      expect(result).toBeTruthy();
      expect(result).toBe(true);
    });

    tick();
  })));

  it('getOne() should give back observable', fakeAsync(inject([
    HttpTestingController,
    HelperService
  ], () => {
    const service = new HelperService<TagInterface>(new Tag().init());
    (service as any).proxy = new FakeProxy();
    const parameterTag = new Tag().init();
    const ismodal = true;
    parameterTag.id = 0 as ID;
    service.getOne(parameterTag, ismodal).subscribe((result: boolean) => {
      expect(result).toBeFalse();
      expect(result).toBe(false);
    });

    parameterTag.id = 1 as ID;
    service.getOne(parameterTag, ismodal).subscribe((result: boolean) => {
      expect(result).toBeTruthy();
      expect(result).toBe(true);
    });
    tick();
  })));

  it('saveAsNew() should give back observable', fakeAsync(inject([
    HttpTestingController,
    HelperService
  ], () => {
    const service = new HelperService<TagInterface>(new Tag().init());
    (service as any).proxy = new FakeProxy();
    const parameterTag = new Tag().init();
    parameterTag.id = 1 as ID;
    parameterTag.validate = () => {
      return true;
    };

    parameterTag.isValid = false;
    service.saveAsNew(parameterTag).subscribe((result: boolean) => {
      expect(result).toBeFalse();
      expect(result).toBe(false);
      expect(parameterTag.id).toBe(0 as ID);
    });

    tick();
  })));

  it('save() should give back observable', fakeAsync(inject([
    HttpTestingController,
    HelperService
  ], () => {
    const service = new HelperService<TagInterface>(new Tag().init());
    (service as any).proxy = new FakeProxy();
    const parameterTag = new Tag().init();
    parameterTag.validate = () => {
      return true;
    };
    parameterTag.isValid = false;

    service.save(parameterTag).subscribe((result: boolean) => {
      expect(result).toBeFalse();
      expect(result).toBe(false);
    });

    parameterTag.isValid = true;

    service.save(parameterTag, true, undefined, false).subscribe((result: boolean) => {
      expect(result).toBeTruthy();
      expect(result).toBe(true);
    });

    service.save(parameterTag, true).subscribe((result: boolean) => {
      expect(result).toBeTruthy();
      expect(result).toBe(true);
    });

    tick();
  })));

  it('booleanChange() should give back observable', fakeAsync(inject([
    HttpTestingController,
    HelperService
  ], () => {
    const service = new HelperService<TagInterface>(new Tag().init());
    (service as any).proxy = new FakeProxy();
    const parameterTag = new Tag().init();

    service.booleanChange(null, 'For test').subscribe((result: boolean) => {
      expect(result).toBeFalse();
      expect(result).toBe(false);
    });

    service.booleanChange(parameterTag, '').subscribe((result: boolean) => {
      expect(result).toBeTruthy();
      expect(result).toBe(true);
    });

    tick();
  })));

  it('navigateByUrl shoud be called in stepBack() ', fakeAsync(inject([
    HttpTestingController,
    HelperService
  ], () => {
    const service = new HelperService<TagInterface>(new Tag().init());
    const parameterTag = new Tag().init();
    spyOn((service as any).router, 'navigateByUrl').and.returnValue(true);

    service.stepBack(parameterTag, false);

    expect ((service as any).router.navigateByUrl).toHaveBeenCalledWith('/settings/tag/list');

    tick();
  })));

  it('navigate shoud be called in edit() ', fakeAsync(inject([
    HttpTestingController,
    HelperService
  ], () => {
    const service = new HelperService<TagInterface>(new Tag().init());
    const parameterTag = new Tag().init();
    spyOn((service as any).router, 'navigate').and.returnValue(true);
    const reference = {};

    service.edit(parameterTag, reference);

    expect ((service as any).router.navigate).toHaveBeenCalledWith([parameterTag.api_endpoint, 'edit', parameterTag.id]);

    tick();
  })));

});
