/* eslint-env browser */
import { HttpErrorResponse, HttpHeaders, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { DdataInjectorModule } from '../../ddata-injector.module';
import { BaseModel } from '../../models/base/base-model.model';
import { EnvService } from '../env/env.service';
import { ProxyServiceInterface } from '../proxy/proxy-service.interface';
import { ProxyService } from '../proxy/proxy.service';
import { RemoteDataServiceInterface } from './remote-data-service.interface';
import { RemoteDataService } from './remote-data.service';
import { RequestHeaders } from './request-headers.type';

for (const serviceType of [RemoteDataService, ProxyService]) {
  describe(`${serviceType.name} URI requests`, () => {
    let service: RemoteDataServiceInterface<BaseModel> | ProxyServiceInterface<BaseModel>;
    let httpMock: HttpTestingController;
    let originalInjector: Injector;
    let originalToken: string | null;
    const resource = { name: 'Updated name' };

    beforeEach(() => {
      originalInjector = DdataInjectorModule.InjectorInstance;
      originalToken = localStorage.getItem('token');
      localStorage.setItem('token', 'uri-test-token');
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: EnvService, useValue: { environment: { apiUrl: 'http://dummy.test/api' } } }
        ]
      });
      DdataInjectorModule.InjectorInstance = TestBed.inject(Injector);
      httpMock = TestBed.inject(HttpTestingController);
      const model = new BaseModel();

      model.api_endpoint = '/uri-model';
      model.model_name = 'UriRequestTest';
      service = new serviceType(model);
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
    const requests = [
      {
        method: 'GET',
        url: 'http://dummy.test/api/custom',
        body: null,
        send: (headers?: RequestHeaders): Observable<unknown> => service.getUri('/custom', headers)
      },
      {
        method: 'POST',
        url: 'http://dummy.test/api/uri-model/custom',
        body: JSON.stringify(resource),
        send: (headers?: RequestHeaders): Observable<unknown> =>
          service.postUri(resource, '/custom', headers)
      },
      {
        method: 'PUT',
        url: 'http://dummy.test/api/uri-model/custom',
        body: JSON.stringify(resource),
        send: (headers?: RequestHeaders): Observable<unknown> =>
          service.putUri(resource, '/custom', headers)
      }
    ];

    for (const request of requests) {
      describe(request.method, () => {
        it('uses the expected URL, body and default headers when headers are omitted', () => {
          const response = jasmine.createSpy('response');

          request.send().subscribe(response);
          const req = httpMock.expectOne(request.url);

          expect(req.request.method).toBe(request.method);
          expect(req.request.body).toEqual(request.body);
          expect(req.request.responseType).toBe('json');
          expect(req.request.headers.get('Authorization')).toBe('Bearer uri-test-token');
          expect(req.request.headers.get('Content-Type')).toBe('application/json');
          expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');
          req.flush({ updated: true });

          expect(response).toHaveBeenCalledOnceWith({ updated: true });
        });

        it('merges header objects without changing their values or dropping defaults', () => {
          const headers = { 'X-Request-Id': 'custom-id', 'X-Tag': ['first', 'second'] };

          request.send(headers).subscribe();
          const req = httpMock.expectOne(request.url);

          expect(req.request.headers.get('X-Request-Id')).toBe('custom-id');
          expect(req.request.headers.getAll('X-Tag')).toEqual(['first', 'second']);
          expect(req.request.headers.get('Authorization')).toBe('Bearer uri-test-token');
          expect(req.request.headers.get('Content-Type')).toBe('application/json');
          expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');
          expect(headers).toEqual({ 'X-Request-Id': 'custom-id', 'X-Tag': ['first', 'second'] });
          req.flush({});
        });

        it('accepts immutable HttpHeaders and overrides defaults case-insensitively', () => {
          const headers = new HttpHeaders({
            authorization: 'Bearer custom-token',
            'content-type': 'application/merge-patch+json',
            'X-Tag': ['first', 'second']
          });

          request.send(headers).subscribe();
          const req = httpMock.expectOne(request.url);

          expect(req.request.headers.getAll('Authorization')).toEqual(['Bearer custom-token']);
          expect(req.request.headers.getAll('Content-Type')).toEqual([
            'application/merge-patch+json'
          ]);

          expect(req.request.headers.getAll('X-Tag')).toEqual(['first', 'second']);
          expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');
          expect(headers.has('Accepted-Encoding')).toBeFalse();
          expect(headers.getAll('X-Tag')).toEqual(['first', 'second']);
          req.flush({});
        });

        it('accepts empty headers without removing the defaults', () => {
          request.send({}).subscribe();
          const req = httpMock.expectOne(request.url);

          expect(req.request.headers.get('Authorization')).toBe('Bearer uri-test-token');
          expect(req.request.headers.get('Content-Type')).toBe('application/json');
          expect(req.request.headers.get('Accepted-Encoding')).toBe('application/json');
          req.flush({});
        });

        it('isolates overlapping requests and refreshes the default authentication token', () => {
          request
            .send({ authorization: 'Bearer custom-token', 'X-Request-Id': 'first' })
            .subscribe();
          const first = httpMock.expectOne(request.url);

          localStorage.setItem('token', 'refreshed-token');
          request.send().subscribe();
          const second = httpMock.expectOne(request.url);

          expect(first.request.headers.get('Authorization')).toBe('Bearer custom-token');
          expect(first.request.headers.get('X-Request-Id')).toBe('first');
          expect(second.request.headers.get('Authorization')).toBe('Bearer refreshed-token');
          expect(second.request.headers.has('X-Request-Id')).toBeFalse();
          second.flush({});
          first.flush({});
        });

        it('does not leak custom headers into a later non-URI request', () => {
          request.send({ 'X-Request-Id': 'uri-only' }).subscribe();
          httpMock.expectOne(request.url).flush({});
          service.getAll().subscribe();
          const req = httpMock.expectOne('http://dummy.test/api/uri-model');

          expect(req.request.headers.has('X-Request-Id')).toBeFalse();
          expect(req.request.headers.get('Authorization')).toBe('Bearer uri-test-token');
          req.flush({ data: [] });
        });

        it('propagates HTTP errors to the subscriber', () => {
          let receivedError: HttpErrorResponse | undefined;

          request.send().subscribe({
            error: (error: HttpErrorResponse) => {
              receivedError = error;
            }
          });
          httpMock
            .expectOne(request.url)
            .flush('Failed', { status: 500, statusText: 'Server error' });

          expect(receivedError?.status).toBe(500);
        });
      });
    }
  });
}
