// tslint:disable: variable-name
import 'zone.js/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DdataCoreModule } from '../../ddata-core.module';
import { ID } from '../../models/base/base-data.type';
import { BaseModel, BaseModelWithoutTypeDefinitionInterface } from '../../models/base/base-model.model';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { Paginate } from '../../models/paginate/paginate.model';
import { RemoteDataService } from './remote-data.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

interface DummyDataInterface extends BaseModelWithoutTypeDefinitionInterface {
  id: ID;
  name: string;

  init(data?: any): DummyDataInterface;
  prepareToSave(): any;
}

class DummyData extends BaseModel implements DummyDataInterface {
  readonly api_endpoint = '/dummy-uri';
  readonly model_name = 'DummyData';
  id: ID;
  name: string;

  init(data?: any): DummyDataInterface {
    data = !!data ? data : {};

    this.id = !!data.id ? data.id : 0;
    this.name = !!data.name ? data.name : '';

    return this;
  }

  prepareToSave(): any {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

xxdescribe('RemoteDataService', () => {
  let service: RemoteDataService<DummyDataInterface>;
  // create a fake paginate response from server
  const fakePlainObject = {
    id: 1,
    name: 'Dummy Name',
  };
  const fakeResponsePaginate = {
    data: [
      JSON.stringify(fakePlainObject),
    ],
  };

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
});
  });

  // set TestBed before each tests
  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        Injector,
        { provide: RemoteDataService, useValue: new DummyData() },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
  }));

  beforeEach(() => {
    DdataCoreModule.InjectorInstance = TestBed;
    TestBed.inject(RemoteDataService);
    service = new RemoteDataService<DummyDataInterface>(new DummyData());
  });


  it('should request all instances from server and get 1 object in paginate format', fakeAsync(inject([
    HttpTestingController,
    RemoteDataService,
  ], (
    httpMock: HttpTestingController,
  ) => {

    // call the service
    service.getAll().subscribe((result: PaginateInterface) => {
      // after processing server response it must be an istance of Paginate
      expect(result).toBeInstanceOf(Paginate);

      // paginate data contains 1 item
      expect(result.data.length).toBe(1);

      // paginate data item must be an istance of DummyData
      expect(result.data[0]).toBeInstanceOf(DummyData);
    });

    // set the expectations for the HttpClient mock
    const req = httpMock.expectOne('http://dummy.test/api/dummy-uri');

    // request was a GET method
    expect(req.request.method).toEqual('GET');

    // request has Authorization in header & it's start with Bearer
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer /);

    // request has Content-Type in header & it's application/json
    expect(req.request.headers.has('Content-Type')).toBe(true);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    // request has Accepted-Encoding in header & it's application/json
    expect(req.request.headers.has('Accepted-Encoding')).toBe(true);
    expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');

    // set the fake data to be returned by the mock
    req.flush(fakeResponsePaginate);
    tick();

    // check if there arent any other not handled requests
    httpMock.verify();
  })));


  it('sendFiles() should post a set of file', fakeAsync(inject([
    HttpTestingController,
    RemoteDataService,
  ], (
    httpMock: HttpTestingController,
  ) => {

    const fileSet = new Set<File>();
    const fakeFile = new File([], 'fake');
    const fakeData = {
      name: 'testfile',
      hidden: true
    };

    fileSet.add(fakeFile);

    localStorage.setItem('token', 'test1');

    service.sendFiles('/', 1, fileSet, fakeData).forEach((item) => {
      item.subscribe((res) => {
        expect(res).toBeTruthy();
      });
    });

    const req = httpMock.expectOne('http://dummy.test/api/dummy-uri/');

    expect(req.request.method).toEqual('POST');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer test1/);
    expect(req.request.headers.get('Content-Type')).toBeTruthy();
    expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');

    req.flush(fileSet);
    tick();

    httpMock.verify();
  })));

  it('deleteMultiple() should post ids of files and make a request to /multiple/delete', fakeAsync(inject([
    HttpTestingController,
    RemoteDataService,
  ], (
    httpMock: HttpTestingController,
  ) => {
    const fake = [
      new DummyData().init({ id: 1 as ID}),
      new DummyData().init({id: 2 as ID}),
    ];

    service.deleteMultiple(fake).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('http://dummy.test/api/dummy-uri/multiple/delete');

    expect(req.request.method).toEqual('POST');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer /);
    expect(req.request.headers.has('Content-Type')).toBeTruthy();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');

    req.flush(req.request);

    tick();

    httpMock.verify();
  })));

  it('delete() should post id if a file', fakeAsync(inject([
    HttpTestingController,
    RemoteDataService,
  ], (
    httpMock: HttpTestingController,
  ) => {
    const fake = new DummyData().init({id: 2 as ID});

    service.delete(fake).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('http://dummy.test/api/dummy-uri/2');

    expect(req.request.method).toEqual('DELETE');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer /);
    expect(req.request.headers.has('Content-Type')).toBeTruthy();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');

    req.flush(JSON.stringify(true));

    tick();

    httpMock.verify();
  })));

  it('postUri() should make POST request', fakeAsync(inject([
    HttpTestingController,
    RemoteDataService,
  ], (
    httpMock: HttpTestingController,
  ) => {
    const fakeDummyData = new DummyData().init({id: 2 as ID});

    service.postUri('fake', '/custom-dummy-suburi').subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('http://dummy.test/api/dummy-uri/custom-dummy-suburi');

    expect(req.request.method).toEqual('POST');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer /);
    expect(req.request.headers.has('Content-Type')).toBeTruthy();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');

    req.flush(fakeDummyData);

    tick();

    httpMock.verify();
  })));

  it('save() should save an instance with a POST request', fakeAsync(inject([
    HttpTestingController,
    RemoteDataService,
  ], (
    httpMock: HttpTestingController,
  ) => {
    const data = { isValid: true };
    const fakeDummyData = new DummyData().init(data);
    const req = httpMock.expectOne('http://dummy.test/api/dummy-uri');

    fakeDummyData.validate = () => {
      return true;
    };

    service.save(fakeDummyData).subscribe();

    expect(req.request.method).toEqual('POST');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer /);
    expect(req.request.headers.has('Content-Type')).toBeTruthy();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');
    expect(req.request.body).toEqual(JSON.stringify(fakeDummyData.prepareToSave()));

    tick(2000);
    req.flush(JSON.stringify(1));

    httpMock.verify();
  })));

  it('save() should update an instance with a PUT request', fakeAsync(inject([
    HttpTestingController,
    RemoteDataService,
  ], (
    httpMock: HttpTestingController,
  ) => {
    const data = { isValid: true };
    const fakeDummyData = new DummyData().init({id: 1});
    const req = httpMock.expectOne('http://dummy.test/api/dummy-uri/1');

    fakeDummyData.validate = () => {
      return true;
    };

    service.save(fakeDummyData).subscribe();

    expect(req.request.method).toEqual('PUT');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer /);
    expect(req.request.headers.has('Content-Type')).toBeTruthy();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');

    req.flush(JSON.stringify(1));

    tick();

    httpMock.verify();
  })));

  it('getUri() should make a GET request', fakeAsync(inject([
    HttpTestingController,
    RemoteDataService,
  ], (
    httpMock: HttpTestingController,
  ) => {

    service.getUri('/custom-dummy-suburi').subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('http://dummy.test/api/custom-dummy-suburi');

    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer /);
    expect(req.request.headers.has('Content-Type')).toBeTruthy();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');

    req.flush(req.request);

    tick();

    httpMock.verify();
  })));

  it('getOne() should return with a model', fakeAsync(inject([
    HttpTestingController,
    RemoteDataService,
  ], (
    httpMock: HttpTestingController,
  ) => {

    service.getOne(1).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toBeInstanceOf(DummyData);
      expect(res.id).toBe(1 as ID);
    });

    const req = httpMock.expectOne('http://dummy.test/api/dummy-uri/1');

    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer /);
    expect(req.request.headers.has('Content-Type')).toBeTruthy();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');

    req.flush(fakePlainObject);

    tick();

    httpMock.verify();
  })));

  it('getAllWithoutPaginate() should request all instances from server', fakeAsync(inject([
    HttpTestingController,
    RemoteDataService,
  ], (
    httpMock: HttpTestingController,
  ) => {
    const fakeData = [
      new DummyData().init(),
      new DummyData().init(),
      new DummyData().init(),
    ];
    service.getAllWithoutPaginate().subscribe((res: DummyDataInterface[]) => {
      expect(res).toBeTruthy();
      expect(res[0]).toEqual(new DummyData().init());
      expect(res.length).toBe(3);
    });

    const req = httpMock.expectOne('http://dummy.test/api/dummy-uri/list');

    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer /);
    expect(req.request.headers.has('Content-Type')).toBeTruthy();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');

    req.flush(fakeData);

    tick();

    httpMock.verify();

  })));

  it('getPage() should request a page of a paginate instance', fakeAsync(inject([
    HttpTestingController,
    RemoteDataService,
  ], (
    httpMock: HttpTestingController,
  ) => {
    service.getPage(1).subscribe((res: PaginateInterface) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('http://dummy.test/api/dummy-uri?page=1');

    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer /);
    expect(req.request.headers.has('Content-Type')).toBeTruthy();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');

    req.flush(new Paginate(DummyData));

    tick();

    httpMock.verify();
  })));

});
