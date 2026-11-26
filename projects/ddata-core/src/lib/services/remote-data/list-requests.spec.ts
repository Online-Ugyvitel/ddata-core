import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { DdataInjectorModule } from '../../ddata-injector.module';
import { ID } from '../../models/base/base-data.type';
import { BaseModel } from '../../models/base/base-model.model';
import { ListQueryInterface } from '../../models/list/list-query.interface';
import { EnvService } from '../env/env.service';
import { DdataCoreError } from '../error-handler/ddata-core-error';
import { ProxyServiceInterface } from '../proxy/proxy-service.interface';
import { ProxyService } from '../proxy/proxy.service';
import { RemoteDataServiceInterface } from './remote-data-service.interface';
import { RemoteDataService } from './remote-data.service';
const api = 'http://dummy.test/api/post';
const ids = [1 as ID, 2 as ID];

for (const serviceType of [RemoteDataService, ProxyService]) {
  describe(`${serviceType.name} list requests`, () => {
    let service: RemoteDataServiceInterface<BaseModel> | ProxyServiceInterface<BaseModel>;
    let httpMock: HttpTestingController;
    let originalInjector: Injector;
    let originalToken: string | null;
    let debug: boolean;
    let model: BaseModel;

    beforeEach(() => {
      debug = false;
      originalInjector = DdataInjectorModule.InjectorInstance;
      originalToken = localStorage.getItem('token');
      localStorage.setItem('token', 'list-test-token');
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: EnvService,
            useValue: {
              get environment(): { apiUrl: string; debug: boolean } {
                return { apiUrl: 'http://dummy.test/api', debug };
              }
            }
          }
        ]
      });
      DdataInjectorModule.InjectorInstance = TestBed.inject(Injector);
      httpMock = TestBed.inject(HttpTestingController);
      model = new BaseModel();
      model.api_endpoint = '/post';
      model.model_name = 'ListRequestTest';
      model.id = 42 as ID;
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
    const expectGet = (url: string) => {
      const req = httpMock.expectOne((request) => request.url === url);

      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer list-test-token');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.responseType).toBe('json');

      return req;
    };
    const expectPost = (url: string, body: string | null) => {
      const req = httpMock.expectOne(url);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      expect(req.request.headers.get('Authorization')).toBe('Bearer list-test-token');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');

      return req;
    };

    describe('views()', () => {
      it('sends GET {r}/views and returns the views', () => {
        const views = [{ key: 'all', label: 'Mind', count: 12 }];
        const response = vi.fn();

        service.views().subscribe(response);
        const req = expectGet(`${api}/views`);

        expect(req.request.params.keys()).toEqual([]);
        req.flush(views);

        expect(response).toHaveBeenCalledWith(views);
      });

      it('sends the list query as parameters so the counts follow the term and the filters', () => {
        service.views({ term: 'news', filters: { lang_id: 1 } }).subscribe();
        const req = expectGet(`${api}/views`);

        expect(req.request.urlWithParams).toBe(`${api}/views?term=news&filters%5Blang_id%5D=1`);
        req.flush([]);
      });
    });

    describe('facets()', () => {
      it('repeats fields[] per field and returns the facets', () => {
        const facets = { lang_id: [{ value: 1, label: 'Magyar', count: 8 }] };
        const response = vi.fn();

        service.facets(['lang_id', 'category_id']).subscribe(response);
        const req = expectGet(`${api}/facets`);

        expect(req.request.params.getAll('fields[]')).toEqual(['lang_id', 'category_id']);
        expect(req.request.urlWithParams).toBe(
          `${api}/facets?fields%5B%5D=lang_id&fields%5B%5D=category_id`
        );
        req.flush(facets);

        expect(response).toHaveBeenCalledWith(facets);
      });

      it('sends no fields[] for an empty field list without throwing', () => {
        const response = vi.fn();

        service.facets([]).subscribe(response);
        const req = expectGet(`${api}/facets`);

        expect(req.request.params.has('fields[]')).toBe(false);
        req.flush({});

        expect(response).toHaveBeenCalledWith({});
      });

      it('adds the list query after the fields', () => {
        service.facets(['lang_id'], { view: 'active' }).subscribe();
        const req = expectGet(`${api}/facets`);

        expect(req.request.params.keys()).toEqual(['fields[]', 'view']);
        expect(req.request.params.get('view')).toBe('active');
        req.flush({});
      });
    });

    describe('neighbors()', () => {
      it('sends GET {r}/{id}/neighbors with the whole list query', () => {
        const query: ListQueryInterface = {
          term: 'news',
          view: 'active',
          sort: { field: 'name', direction: 'desc' },
          filters: { lang_id: [1, 2], is_inactive: false }
        };
        const neighbors = { previous_id: 6, next_id: 8, position: 3, total: 17 };
        const response = vi.fn();

        service.neighbors(7 as ID, query).subscribe(response);
        const req = expectGet(`${api}/7/neighbors`);

        expect(req.request.params.get('term')).toBe('news');
        expect(req.request.params.get('view')).toBe('active');
        expect(req.request.params.get('sort[field]')).toBe('name');
        expect(req.request.params.get('sort[direction]')).toBe('desc');
        expect(req.request.params.getAll('filters[lang_id][]')).toEqual(['1', '2']);
        expect(req.request.params.get('filters[is_inactive]')).toBe('0');
        req.flush(neighbors);

        expect(response).toHaveBeenCalledWith(neighbors);
      });

      it('sends filters[field][] for every item of a list filter', () => {
        service.neighbors(7 as ID, { filters: { lang_id: [1, 2] } }).subscribe();
        const req = expectGet(`${api}/7/neighbors`);

        expect(req.request.urlWithParams).toBe(
          `${api}/7/neighbors?filters%5Blang_id%5D%5B%5D=1&filters%5Blang_id%5D%5B%5D=2`
        );
        req.flush({ previous_id: null, next_id: null, position: null, total: 0 });
      });
    });

    describe('restore()', () => {
      it('sends POST {r}/{id}/restore with an empty body and returns true', () => {
        const response = vi.fn();

        service.restore(model).subscribe(response);
        expectPost(`${api}/42/restore`, null).flush({ id: 42 });

        expect(response).toHaveBeenCalledWith(true);
      });
    });

    describe('restoreMultiple()', () => {
      it('sends POST {r}/multiple/restore with the ids and returns true', () => {
        const response = vi.fn();

        service.restoreMultiple(ids).subscribe(response);
        expectPost(`${api}/multiple/restore`, '{"data":[1,2]}').flush({ ids: [1, 2] });

        expect(response).toHaveBeenCalledWith(true);
      });

      it('sends an empty id list unchanged', () => {
        service.restoreMultiple([]).subscribe();
        expectPost(`${api}/multiple/restore`, '{"data":[]}').flush({ ids: [] });
      });
    });

    describe('updateMultiple()', () => {
      it('sends POST {r}/multiple/update with the ids and values and returns true', () => {
        const response = vi.fn();

        service.updateMultiple(ids, { is_inactive: true }).subscribe(response);
        expectPost(`${api}/multiple/update`, '{"data":[1,2],"values":{"is_inactive":true}}').flush({
          ids: [1, 2],
          updated: 2
        });

        expect(response).toHaveBeenCalledWith(true);
      });
    });

    describe('error responses', () => {
      const requests: Array<{
        name: string;
        method: string;
        url: string;
        send: () => Observable<unknown>;
      }> = [
        { name: 'views', method: 'GET', url: `${api}/views`, send: () => service.views() },
        { name: 'facets', method: 'GET', url: `${api}/facets`, send: () => service.facets(['a']) },
        {
          name: 'neighbors',
          method: 'GET',
          url: `${api}/7/neighbors`,
          send: () => service.neighbors(7 as ID, {})
        },
        {
          name: 'restore',
          method: 'POST',
          url: `${api}/42/restore`,
          send: () => service.restore(model)
        },
        {
          name: 'restoreMultiple',
          method: 'POST',
          url: `${api}/multiple/restore`,
          send: () => service.restoreMultiple(ids)
        },
        {
          name: 'updateMultiple',
          method: 'POST',
          url: `${api}/multiple/update`,
          send: () => service.updateMultiple(ids, { is_inactive: true })
        }
      ];

      for (const request of requests) {
        for (const status of [403, 404, 422, 500]) {
          it(`${request.name}() reports a ${status} response through handleError, not as a result`, () => {
            const next = vi.fn();
            let received: unknown;

            request.send().subscribe({
              next,
              error: (error: unknown) => {
                received = error;
              }
            });
            const req = httpMock.expectOne((item) => item.url === request.url);

            expect(req.request.method).toBe(request.method);
            req.flush({ message: 'Hiba' }, { status, statusText: 'Error' });

            expect(next).not.toHaveBeenCalled();
            expect(received).toBeInstanceOf(DdataCoreError);
            expect((received as DdataCoreError).originalError.status).toBe(status);
          });
        }
      }
    });

    it('logs the request in debug mode', () => {
      const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      debug = true;
      service.views({ term: 'a' }).subscribe();
      service.restore(model).subscribe();
      httpMock.expectOne((request) => request.url === `${api}/views`).flush([]);
      httpMock.expectOne(`${api}/42/restore`).flush({});

      expect(log).toHaveBeenCalledWith('URL - views()', `${api}/views`, 'term=a');
      expect(log).toHaveBeenCalledWith('URL - restore()', `${api}/42/restore`, null);
      log.mockRestore();
    });
  });
}

describe('ProxyService list queries', () => {
  it('accepts a ListQueryInterface in search() and searchWithoutPaginate()', () => {
    const proxy = new ProxyService(new BaseModel());
    const postUri = vi
      .spyOn(
        (proxy as unknown as { remoteStorageService: RemoteDataService<BaseModel> })
          .remoteStorageService,
        'postUri'
      )
      .mockReturnValue(new Observable((subscriber) => subscriber.next([])));
    const query: ListQueryInterface = {
      term: 'a',
      view: 'active',
      sort: { field: 'name', direction: 'asc' }
    };

    proxy.search(query, 2).subscribe();
    proxy.searchWithoutPaginate(query).subscribe();

    expect(postUri).toHaveBeenCalledWith(query, '/search?page=2');
    expect(postUri).toHaveBeenCalledWith(query, '/search?paginate=off');
  });
});
