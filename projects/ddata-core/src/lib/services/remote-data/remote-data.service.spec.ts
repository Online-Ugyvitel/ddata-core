/* eslint-disable no-param-reassign */

// tslint:disable: variable-name
import { HttpErrorResponse, HttpEventType, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DdataInjectorModule } from '../../ddata-injector.module';
import { ID } from '../../models/base/base-data.type';
import {
  BaseModel,
  BaseModelWithoutTypeDefinitionInterface
} from '../../models/base/base-model.model';
import { FileUploadProcessInterface } from '../../models/file/file-upload-process.interface';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { Paginate } from '../../models/paginate/paginate.model';
import { EnvService } from '../env/env.service';
import { DdataCoreError } from '../error-handler/ddata-core-error';
import { RemoteDataService } from './remote-data.service';

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
      name: this.name
    };
  }

  // the validation is not part of the remote data service, every model is valid here
  validate(): void {}
}

describe('RemoteDataService', () => {
  const apiUrl = 'http://dummy.test/api';
  const fakePlainObject = {
    id: 1,
    name: 'Dummy Name'
  };
  let service: RemoteDataService<any>;
  let httpMock: HttpTestingController;
  let originalInjector: Injector;
  let originalToken: string | null;
  const expectDefaultHeaders = (headers: any): void => {
    expect(headers.get('Authorization')).toBe('Bearer test-token');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Accepted-Encoding')).toBe('application/json');
  };

  beforeEach(() => {
    originalInjector = DdataInjectorModule.InjectorInstance;
    originalToken = localStorage.getItem('token');
    localStorage.setItem('token', 'test-token');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: EnvService, useValue: { environment: { apiUrl } } }
      ]
    });
    DdataInjectorModule.InjectorInstance = TestBed.inject(Injector);
    httpMock = TestBed.inject(HttpTestingController);
    service = new RemoteDataService<any>(new DummyData().init());
  });

  afterEach(() => {
    try {
      httpMock.verify();
    } finally {
      DdataInjectorModule.InjectorInstance = originalInjector;

      if (originalToken === null) {
        localStorage.removeItem('token');
      } else {
        localStorage.setItem('token', originalToken);
      }
    }
  });

  it('should be created with the API URL of the environment', () => {
    expect(service).toBeTruthy();
    expect(service.url).toBe(apiUrl);
  });

  it('should fall back to an empty API URL without an injector', () => {
    DdataInjectorModule.InjectorInstance = undefined;

    expect(new RemoteDataService<any>(new DummyData().init()).url).toBe('');
  });

  it('getAll() should request all instances from server and get them in paginate format', () => {
    let result: PaginateInterface;

    service.getAll().subscribe((response: PaginateInterface) => {
      result = response;
    });
    const req = httpMock.expectOne(`${apiUrl}/dummy-uri`);

    expect(req.request.method).toBe('GET');
    expectDefaultHeaders(req.request.headers);

    req.flush({ current_page: 1, total: 1, data: [fakePlainObject] });

    expect(result).toBeInstanceOf(Paginate);
    expect(result.total).toBe(1);
    expect(result.data.length).toBe(1);
    expect(result.data[0]).toBeInstanceOf(DummyData);
    expect(result.data[0].name).toBe('Dummy Name');
  });

  it('getAll() should request the given page', () => {
    service.getAll(3).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/dummy-uri?page=3`);

    expect(req.request.method).toBe('GET');

    req.flush({ data: [] });
  });

  it('getPage() should request a page of a paginate instance', () => {
    let result: PaginateInterface;

    service.getPage(2, '/get-page').subscribe((response: PaginateInterface) => {
      result = response;
    });
    const req = httpMock.expectOne(`${apiUrl}/dummy-uri/get-page?page=2`);

    expect(req.request.method).toBe('GET');
    expectDefaultHeaders(req.request.headers);

    req.flush({ current_page: 2, data: [fakePlainObject, { id: 2, name: 'Second' }] });

    expect(result.current_page).toBe(2);
    expect(result.data.map((item: DummyData) => item.id)).toEqual([1, 2]);
  });

  it('getAllWithoutPaginate() should request all instances from server', () => {
    let result: Array<DummyDataInterface>;

    service.getAllWithoutPaginate().subscribe((response: Array<DummyDataInterface>) => {
      result = response;
    });
    const req = httpMock.expectOne(`${apiUrl}/dummy-uri/list`);

    expect(req.request.method).toBe('GET');
    expectDefaultHeaders(req.request.headers);

    req.flush([fakePlainObject, { id: 2, name: 'Second' }, { id: 3, name: 'Third' }]);

    expect(result.length).toBe(3);
    expect(result[0]).toBeInstanceOf(DummyData);
    expect(result.map((item: DummyDataInterface) => item.name)).toEqual([
      'Dummy Name',
      'Second',
      'Third'
    ]);
  });

  it('getOne() should return with a model', () => {
    let result: DummyDataInterface;

    service.getOne(1).subscribe((response: DummyDataInterface) => {
      result = response;
    });
    const req = httpMock.expectOne(`${apiUrl}/dummy-uri/1`);

    expect(req.request.method).toBe('GET');
    expectDefaultHeaders(req.request.headers);

    req.flush(fakePlainObject);

    expect(result).toBeInstanceOf(DummyData);
    expect(result.id).toBe(1);
    expect(result.name).toBe('Dummy Name');
  });

  it('save() should create a new instance with a POST request', () => {
    const model = new DummyData().init({ name: 'New' });
    let result: number | boolean;

    service.save(model).subscribe((response: number | boolean) => {
      result = response;
    });
    const req = httpMock.expectOne(`${apiUrl}/dummy-uri`);

    expect(req.request.method).toBe('POST');
    expectDefaultHeaders(req.request.headers);
    expect(req.request.body).toBe(JSON.stringify(model.prepareToSave()));

    req.flush({ id: 5 });

    expect(result).toBe(5);
  });

  it('save() should update an existing instance with a PUT request', () => {
    const model = new DummyData().init({ id: 1, name: 'Updated' });
    let result: number | boolean;

    service.save(model).subscribe((response: number | boolean) => {
      result = response;
    });
    const req = httpMock.expectOne(`${apiUrl}/dummy-uri/1`);

    expect(req.request.method).toBe('PUT');
    expectDefaultHeaders(req.request.headers);
    expect(req.request.body).toBe(JSON.stringify(model.prepareToSave()));

    req.flush({ id: 1 });

    expect(result).toBe(1);
  });

  it('save() should not send a request when the model is invalid', () => {
    const model = new DummyData().init({ name: 'Invalid' });
    const validationError = new Error('invalid');
    let receivedError: unknown;

    model.validate = (): void => {
      throw validationError;
    };

    service.save(model).subscribe({
      error: (error: unknown) => {
        receivedError = error;
      }
    });

    httpMock.expectNone(`${apiUrl}/dummy-uri`);
    expect(receivedError).toBe(validationError);
  });

  it('save() should store the invalid fields of a backend validation error', () => {
    const model = new DummyData().init({ name: 'Invalid' });
    let receivedError: HttpErrorResponse;

    service.save(model).subscribe({
      error: (error: HttpErrorResponse) => {
        receivedError = error;
      }
    });
    httpMock
      .expectOne(`${apiUrl}/dummy-uri`)
      .flush({ errors: { name: ['required'] } }, { status: 480, statusText: 'Invalid' });

    expect(receivedError.status).toBe(480);
    expect(model.validationErrors).toEqual(['name']);
  });

  it('delete() should send a DELETE request with the id of the model', () => {
    let result: number;

    service.delete(new DummyData().init({ id: 2 })).subscribe((response: number) => {
      result = response;
    });
    const req = httpMock.expectOne(`${apiUrl}/dummy-uri/2`);

    expect(req.request.method).toBe('DELETE');
    expectDefaultHeaders(req.request.headers);

    req.flush(200);

    expect(result).toBe(200);
  });

  it('deleteMultiple() should post the ids of the models to /multiple/delete', () => {
    const models = [new DummyData().init({ id: 1 }), new DummyData().init({ id: 2 })];
    let result: unknown;

    service.deleteMultiple(models).subscribe((response: unknown) => {
      result = response;
    });
    const req = httpMock.expectOne(`${apiUrl}/dummy-uri/multiple/delete`);

    expect(req.request.method).toBe('POST');
    expectDefaultHeaders(req.request.headers);
    expect(req.request.body).toBe(JSON.stringify({ data: [1, 2] }));

    req.flush({ deleted: 2 });

    expect(result).toEqual({ deleted: 2 });
  });

  it('deleteMultiple() should convert HTTP errors to DdataCoreError', () => {
    let receivedError: unknown;

    service.deleteMultiple([new DummyData().init({ id: 1 })]).subscribe({
      error: (error: unknown) => {
        receivedError = error;
      }
    });
    httpMock
      .expectOne(`${apiUrl}/dummy-uri/multiple/delete`)
      .flush('Failed', { status: 500, statusText: 'Server error' });

    expect(receivedError).toBeInstanceOf(DdataCoreError);
    expect((receivedError as DdataCoreError).originalError.status).toBe(500);
  });

  it('sendFiles() should post every file as form data and report the upload progress', () => {
    const files = new Set<File>([
      new File(['first'], 'first.txt'),
      new File(['second'], 'second.txt')
    ]);
    const extraData = { name: 'testfile', hidden: true };
    const uploads = service.sendFiles('/file', 1, files, extraData);
    const results: Array<FileUploadProcessInterface> = [];
    const progress: Array<number> = [];
    let progressCompleted = 0;
    let watchedProgress = false;

    expect(uploads.length).toBe(2);

    uploads.forEach((upload) => {
      upload.subscribe((result: FileUploadProcessInterface) => {
        results.push(result);

        // every event of a file carries the same progress observable, so it is watched only once
        if (result.file === 'first.txt' && !watchedProgress) {
          watchedProgress = true;
          result.progress.subscribe({
            next: (percent: number) => progress.push(percent),
            complete: () => progressCompleted++
          });
        }
      });
    });
    const requests = httpMock.match(`${apiUrl}/dummy-uri/file`);

    expect(requests.length).toBe(2);
    requests.forEach((req, index) => {
      const body = req.request.body as FormData;

      expect(req.request.method).toBe('POST');
      expect(req.request.reportProgress).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');
      // the browser sets the multipart content type with the boundary
      expect(req.request.headers.has('Content-Type')).toBe(false);
      expect((body.get('file') as File).name).toBe(index === 0 ? 'first.txt' : 'second.txt');
      expect(body.get('data')).toBe(JSON.stringify(extraData));
    });

    requests[0].event({ type: HttpEventType.UploadProgress, loaded: 5, total: 10 });
    requests[0].flush('remote/first.txt');
    requests[1].flush('remote/second.txt');

    expect(progress).toEqual([50]);
    expect(progressCompleted).toBe(1);
    const uploaded = results.filter((result) => result.remoteFileDatas !== null);

    expect(uploaded.map((result) => [result.file, result.remoteFileDatas])).toEqual([
      ['first.txt', 'remote/first.txt'],
      ['second.txt', 'remote/second.txt']
    ]);
  });
});
