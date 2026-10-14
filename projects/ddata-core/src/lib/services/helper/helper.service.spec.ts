import { EventEmitter, Injector } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of, Subject, throwError } from 'rxjs';
import { DdataCoreModule } from '../../ddata-core.module';
import { ID } from '../../models/base/base-data.type';
import { BaseModel } from '../../models/base/base-model.model';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { Paginate } from '../../models/paginate/paginate.model';
import { ProxyService } from '../proxy/proxy.service';
import { SpinnerService } from '../spinner/spinner.service';
import { HelperService } from './helper.service';

class TestModel extends BaseModel {
  readonly api_endpoint = '/test-models';
  readonly model_name = 'TestModel';
  id: ID = 0 as ID;
  name = '';
  testField = false;

  init(data: any = null): TestModel {
    const incoming = data ?? {};

    this.id = (incoming.id ?? 0) as ID;
    this.name = incoming.name ?? '';
    this.testField = incoming.testField ?? false;

    return this;
  }

  prepareToSave(): any {
    return { id: this.id, name: this.name, testField: this.testField };
  }

  validate(): void {
    this.isValid = true;
    this.validationErrors = [];
  }
}
const paginateOf = (data: Array<any>, page = 1): PaginateInterface => ({
  current_page: page,
  per_page: 10,
  from: 1,
  to: data.length,
  total: data.length,
  last_page: page,
  data
});

describe('HelperService', () => {
  let service: HelperService<TestModel>;
  let spinner: { on: ReturnType<typeof vi.fn>; off: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn>; navigateByUrl: ReturnType<typeof vi.fn> };
  let activatedRoute: { snapshot: { queryParams: Params } };
  let route: { params: ReturnType<typeof vi.fn>; getUniqueListId: ReturnType<typeof vi.fn> };
  let proxy: Record<string, ReturnType<typeof vi.fn>>;
  let model: TestModel;

  beforeEach(() => {
    spinner = { on: vi.fn(), off: vi.fn() };
    router = {
      navigate: vi.fn().mockResolvedValue(true),
      navigateByUrl: vi.fn().mockResolvedValue(true)
    };
    activatedRoute = { snapshot: { queryParams: {} } };
    DdataCoreModule.InjectorInstance = {
      get: (token: unknown): unknown => {
        const services = new Map<unknown, unknown>([
          [SpinnerService, spinner],
          [Router, router],
          [ActivatedRoute, activatedRoute]
        ]);

        return services.get(token);
      }
    };

    model = new TestModel().init({ id: 1, name: 'Test Model' });
    service = new HelperService<TestModel>(new TestModel().init());

    route = { params: vi.fn().mockReturnValue(of({ id: 0 })), getUniqueListId: vi.fn(() => 0) };
    proxy = {
      save: vi.fn().mockReturnValue(of(1)),
      delete: vi.fn(),
      deleteMultiple: vi.fn(),
      getPage: vi.fn(),
      getOne: vi.fn(),
      getAll: vi.fn(),
      search: vi.fn(),
      searchWithoutPaginate: vi.fn()
    };
    (service as any).route = route;
    (service as any).proxy = proxy;
  });

  describe('constructor', () => {
    it('should take the spinner, the router and the activated route from the static injector', () => {
      const created = new HelperService<TestModel>(new TestModel());

      expect((created as any).spinner).toBe(spinner);
      expect((created as any).router).toBe(router);
      expect((created as any).activatedRoute).toBe(activatedRoute);
      expect((created as any).proxy).toBeInstanceOf(ProxyService);
    });
  });

  describe('booleanChange', () => {
    const spinnerName = 'booleanChange - TestModel - testField';

    it('should return false without saving for a null model', () => {
      let result: unknown;

      service.booleanChange(null, 'testField').subscribe((value) => (result = value));

      expect(result).toBe(false);
      expect(proxy.save).not.toHaveBeenCalled();
      expect(spinner.on).not.toHaveBeenCalled();
    });

    it('should toggle the field, save the model and keep the new value on success', () => {
      let savedValue: boolean;
      let result: unknown;

      proxy.save.mockImplementation((saved: TestModel) => {
        savedValue = saved.testField;

        return of(1);
      });

      service.booleanChange(model, 'testField').subscribe((value) => (result = value));

      // the model is saved with the already toggled value
      expect(savedValue).toBe(true);
      expect(result).toBe(true);
      expect(model.testField).toBe(true);
      expect(proxy.save).toHaveBeenCalledWith(model);
      expect(spinner.on).toHaveBeenCalledWith(spinnerName);
      expect(spinner.off).toHaveBeenCalledWith(spinnerName);
    });

    it('should toggle a true field to false', () => {
      model.testField = true;

      service.booleanChange(model, 'testField').subscribe();

      expect(model.testField).toBe(false);
    });

    it.each([false, 0, null])(
      'should revert the field when the save responds with %s',
      (response) => {
        let result: unknown;

        proxy.save.mockReturnValue(of(response));

        service.booleanChange(model, 'testField').subscribe((value) => (result = value));

        expect(result).toBe(false);
        expect(model.testField).toBe(false);
        expect(spinner.off).toHaveBeenCalledWith(spinnerName);
      }
    );

    it('should revert the field, stop the spinner and rethrow when the save fails', () => {
      const error = { status: 500 };
      let received: unknown;
      let emitted = false;

      proxy.save.mockReturnValue(throwError(() => error));

      service.booleanChange(model, 'testField').subscribe({
        next: () => (emitted = true),
        error: (err: unknown) => (received = err)
      });

      expect(emitted).toBe(false);
      expect(received).toBe(error);
      expect(model.testField).toBe(false);
      expect(spinner.on).toHaveBeenCalledTimes(1);
      expect(spinner.off).toHaveBeenCalledWith(spinnerName);
    });
  });

  describe('save', () => {
    it('should return false without saving when the model is invalid', () => {
      let result: unknown;

      vi.spyOn(model, 'validate').mockImplementation(() => {
        model.isValid = false;
      });

      service.save(model).subscribe((value) => (result = value));

      expect(result).toBe(false);
      expect(model.validate).toHaveBeenCalledTimes(1);
      expect(proxy.save).not.toHaveBeenCalled();
      expect(spinner.on).not.toHaveBeenCalled();
    });

    it('should only emit the model in modal mode without backend save', () => {
      const emitter = new EventEmitter<TestModel>();
      const emitted: Array<TestModel> = [];
      let result: unknown;

      emitter.subscribe((value: TestModel) => emitted.push(value));

      service.save(model, true, emitter, false).subscribe((value) => (result = value));

      expect(result).toBe(true);
      expect(emitted).toEqual([model]);
      expect(proxy.save).not.toHaveBeenCalled();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should save, set the new id and navigate to the list by default', () => {
      let result: unknown;

      proxy.save.mockReturnValue(of(123));

      service.save(model).subscribe((value) => (result = value));

      expect(result).toBe(true);
      expect(proxy.save).toHaveBeenCalledWith(model);
      expect(model.id).toBe(123);
      expect(spinner.on).toHaveBeenCalledWith('save');
      expect(spinner.off).toHaveBeenCalledWith('save');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/test-models/list');
    });

    it('should navigate back to the unique list id of the current URL', () => {
      route.getUniqueListId.mockReturnValue(7);

      service.save(model).subscribe();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/test-models/list/7');
    });

    it('should navigate to the given URL after success', () => {
      route.getUniqueListId.mockReturnValue(7);

      service.save(model, false, new EventEmitter(), true, '/somewhere/else').subscribe();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/somewhere/else');
    });

    it('should save in modal mode, emit the saved model and not navigate', () => {
      const emitter = new EventEmitter<TestModel>();
      const emitted: Array<{ id: ID; name: string }> = [];
      let result: unknown;

      emitter.subscribe((value: TestModel) => emitted.push({ id: value.id, name: value.name }));
      proxy.save.mockReturnValue(of(55));

      service.save(model, true, emitter, true).subscribe((value) => (result = value));

      expect(result).toBe(true);
      expect(emitted).toEqual([{ id: 55, name: 'Test Model' }]);
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(spinner.off).toHaveBeenCalledWith('save');
    });

    it('should propagate a save error without navigating', () => {
      const error = { status: 422 };
      let received: unknown;

      proxy.save.mockReturnValue(throwError(() => error));

      service.save(model).subscribe({ error: (err: unknown) => (received = err) });

      expect(received).toBe(error);
      expect(model.id).toBe(1);
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('saveAsNew', () => {
    it('should reset the id before saving, so the model is created again', () => {
      let savedId: ID;
      let result: unknown;

      model.id = 999 as ID;
      proxy.save.mockImplementation((saved: TestModel) => {
        savedId = saved.id;

        return of(456);
      });

      service.saveAsNew(model).subscribe((value) => (result = value));

      expect(savedId).toBe(0);
      expect(model.id).toBe(456);
      expect(result).toBe(true);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/test-models/list');
    });
  });

  describe('stepBack', () => {
    it('should emit null in modal mode without navigating', () => {
      const emitter = new EventEmitter<TestModel>();
      const emitted: Array<TestModel> = [];

      emitter.subscribe((value: TestModel) => emitted.push(value));

      service.stepBack(model, true, emitter);

      expect(emitted).toEqual([null]);
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should navigate to the list in non-modal mode', () => {
      service.stepBack(model, false);

      expect(router.navigateByUrl).toHaveBeenCalledWith('/test-models/list');
    });
  });

  describe('edit', () => {
    it('should emit the model on the editModel output in modal mode', () => {
      const reference = { isModal: true, editModel: new EventEmitter<TestModel>() };
      const emitted: Array<TestModel> = [];

      reference.editModel.subscribe((value: TestModel) => emitted.push(value));

      service.edit(model, reference);

      expect(emitted).toEqual([model]);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to the edit page in non-modal mode', () => {
      service.edit(model, { isModal: false });

      expect(router.navigate).toHaveBeenCalledWith(['/test-models', 'edit', 1]);
    });
  });

  describe('delete', () => {
    it('should emit the model on the deleteModel output in modal mode', () => {
      const reference = { isModal: true, deleteModel: new EventEmitter<TestModel>() };
      const emitted: Array<TestModel> = [];
      let result: unknown;

      reference.deleteModel.subscribe((value: TestModel) => emitted.push(value));

      service.delete(model, reference).subscribe((value) => (result = value));

      expect(result).toBe(false);
      expect(emitted).toEqual([model]);
      expect(proxy.delete).not.toHaveBeenCalled();
    });

    it('should delete and refresh the models and paginate of the reference', () => {
      const remaining = new TestModel().init({ id: 2 });
      const oldPaginate = paginateOf([model, remaining]);
      const newPaginate = paginateOf([remaining]);
      const reference = { isModal: false, models: [model, remaining], paginate: oldPaginate };
      let result: unknown;

      proxy.delete.mockReturnValue(of(newPaginate));

      service.delete(model, reference).subscribe((value) => (result = value));

      expect(result).toBe(true);
      expect(proxy.delete).toHaveBeenCalledWith(model, oldPaginate);
      expect(reference.models).toEqual([remaining]);
      expect(reference.paginate).toBe(newPaginate);
      expect(spinner.on).toHaveBeenCalledWith('TestModel');
      expect(spinner.off).toHaveBeenCalledWith('TestModel');
    });

    it('should leave the reference untouched when the delete fails', () => {
      const oldPaginate = paginateOf([model]);
      const reference = { isModal: false, models: [model], paginate: oldPaginate };
      let received: unknown;

      proxy.delete.mockReturnValue(throwError(() => ({ status: 403 })));

      service.delete(model, reference).subscribe({ error: (err: unknown) => (received = err) });

      expect(received).toEqual({ status: 403 });
      expect(reference.models).toEqual([model]);
      expect(reference.paginate).toBe(oldPaginate);
    });
  });

  describe('deleteMultiple', () => {
    it('should emit the models on the deleteMultiple output in modal mode', () => {
      const reference = { isModal: true, deleteMultiple: new EventEmitter<Array<TestModel>>() };
      const emitted: Array<Array<TestModel>> = [];
      let result: unknown;

      reference.deleteMultiple.subscribe((value: Array<TestModel>) => emitted.push(value));

      service.deleteMultiple([model], reference).subscribe((value) => (result = value));

      expect(result).toBe(false);
      expect(emitted).toEqual([[model]]);
      expect(proxy.deleteMultiple).not.toHaveBeenCalled();
    });

    it('should delete the models and refresh the reference', () => {
      const second = new TestModel().init({ id: 2 });
      const oldPaginate = paginateOf([model, second]);
      const newPaginate = paginateOf([]);
      const reference = { isModal: false, models: [model, second], paginate: oldPaginate };
      let result: unknown;

      proxy.deleteMultiple.mockReturnValue(of(newPaginate));

      service.deleteMultiple([model, second], reference).subscribe((value) => (result = value));

      expect(result).toBe(true);
      expect(proxy.deleteMultiple).toHaveBeenCalledWith([model, second], oldPaginate);
      expect(reference.models).toEqual([]);
      expect(reference.paginate).toBe(newPaginate);
      expect(spinner.on).toHaveBeenCalledWith('TestModel');
      expect(spinner.off).toHaveBeenCalledWith('TestModel');
    });

    it('should use the NotSet spinner name for an empty array', () => {
      const reference = { isModal: false, models: [], paginate: paginateOf([]) };

      proxy.deleteMultiple.mockReturnValue(of(paginateOf([])));

      service.deleteMultiple([], reference).subscribe();

      expect(proxy.deleteMultiple).toHaveBeenCalledWith([], paginateOf([]));
      expect(spinner.on).toHaveBeenCalledWith('NotSet');
      expect(spinner.off).toHaveBeenCalledWith('NotSet');
    });
  });

  describe('changeToPage', () => {
    it.each([0, null, undefined])('should not request anything for page %s', (page) => {
      let result: unknown;

      service.changeToPage(page, paginateOf([]), []).subscribe((value) => (result = value));

      expect(result).toBe(false);
      expect(proxy.getPage).not.toHaveBeenCalled();
      expect(spinner.on).not.toHaveBeenCalled();
    });

    it.each([1, 2, 99999])('should request page %s', (page) => {
      let result: unknown;

      proxy.getPage.mockReturnValue(of(paginateOf([], page)));

      service.changeToPage(page, paginateOf([]), []).subscribe((value) => (result = value));

      expect(result).toBe(true);
      expect(proxy.getPage).toHaveBeenCalledWith(page);
      expect(spinner.on).toHaveBeenCalledWith('changeToPage');
      expect(spinner.off).toHaveBeenCalledWith('changeToPage');
    });
  });

  describe('getOne', () => {
    it('should return false for a null model', () => {
      let result: unknown;

      service.getOne(null, false).subscribe((value) => (result = value));

      expect(result).toBe(false);
      expect(route.params).not.toHaveBeenCalled();
    });

    it.each([0, null, undefined])('should return false in modal mode for id %s', (id) => {
      let result: unknown;

      model.id = id as ID;

      service.getOne(model, true).subscribe((value) => (result = value));

      expect(result).toBe(false);
      expect(proxy.getOne).not.toHaveBeenCalled();
      expect(route.params).not.toHaveBeenCalled();
    });

    it('should load the model by its own id in modal mode', () => {
      let result: unknown;

      model.id = 42 as ID;
      proxy.getOne.mockReturnValue(of({ id: 42, name: 'Loaded' }));

      service.getOne(model, true).subscribe((value) => (result = value));

      expect(result).toBe(true);
      expect(proxy.getOne).toHaveBeenCalledWith(42);
      expect(model.name).toBe('Loaded');
      expect(spinner.on).toHaveBeenCalledWith('getOne modal mode TestModel');
      expect(spinner.off).toHaveBeenCalledWith('getOne modal mode TestModel');
    });

    it('should not touch the spinner in modal mode when the loader is not handled', () => {
      model.id = 42 as ID;
      proxy.getOne.mockReturnValue(of({ id: 42, name: 'Loaded' }));

      service.getOne(model, true, false).subscribe();

      expect(model.name).toBe('Loaded');
      expect(spinner.on).not.toHaveBeenCalled();
      expect(spinner.off).not.toHaveBeenCalled();
    });

    it('should load the model by the id of the URL in route mode', () => {
      let result: unknown;

      route.params.mockReturnValue(of({ id: 42 }));
      proxy.getOne.mockReturnValue(of({ id: 42, name: 'From route' }));

      service.getOne(model, false).subscribe((value) => (result = value));

      // the route mode loads the model in the background and always emits false
      expect(result).toBe(false);
      expect(proxy.getOne).toHaveBeenCalledWith(42);
      expect(model.name).toBe('From route');
      expect(spinner.on).toHaveBeenCalledWith('getOne Route mode TestModel');
      expect(spinner.off).toHaveBeenCalledWith('getOne Route mode TestModel');
    });

    it('should convert a string id of the URL to a number', () => {
      route.params.mockReturnValue(of({ id: '17' }));
      proxy.getOne.mockReturnValue(of({ id: 17 }));

      service.getOne(model, false).subscribe();

      expect(proxy.getOne).toHaveBeenCalledWith(17);
    });

    it('should not touch the spinner in route mode when the loader is not handled', () => {
      route.params.mockReturnValue(of({ id: 42 }));
      proxy.getOne.mockReturnValue(of({ id: 42, name: 'From route' }));

      service.getOne(model, false, false).subscribe();

      expect(model.name).toBe('From route');
      expect(spinner.on).not.toHaveBeenCalled();
      expect(spinner.off).not.toHaveBeenCalled();
    });

    it.each([{ id: 0 }, {}])('should not load anything when the route params are %o', (params) => {
      let result: unknown;

      route.params.mockReturnValue(of(params));

      service.getOne(model, false).subscribe((value) => (result = value));

      expect(result).toBe(false);
      expect(proxy.getOne).not.toHaveBeenCalled();
      expect(model.name).toBe('Test Model');
    });

    it('should use the route mode when not modal even if the model has an id', () => {
      service.getOne(model, false).subscribe();

      expect(route.params).toHaveBeenCalledTimes(1);
      expect(proxy.getOne).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should load the given page into the paginate and models references', () => {
      const loaded = [new TestModel().init({ id: 2 }), new TestModel().init({ id: 3 })];
      const response = paginateOf(loaded, 3);
      const paginate = new Paginate(TestModel);
      const models = [model];
      let result: PaginateInterface;

      proxy.getAll.mockReturnValue(of(response));

      service.getAll(paginate, models, false, 3).subscribe((value) => (result = value));

      expect(proxy.getAll).toHaveBeenCalledWith(3);
      expect(result).toBe(response);
      expect(paginate.current_page).toBe(3);
      expect(paginate.data).toBe(loaded);
      // the same array instance is refilled, so bindings to it see the new models
      expect(models).toEqual(loaded);
      expect(spinner.on).toHaveBeenCalledTimes(1);
      expect(spinner.on.mock.calls[0][0]).toMatch(/^getAll /);
      expect(spinner.off).toHaveBeenCalledWith(spinner.on.mock.calls[0][0]);
    });

    it('should load the first page by default and handle an empty response', () => {
      const models = [model];

      proxy.getAll.mockReturnValue(of(paginateOf([])));

      service.getAll(new Paginate(TestModel), models).subscribe();

      expect(proxy.getAll).toHaveBeenCalledWith(0);
      expect(models).toEqual([]);
    });

    it('should use a unique spinner name for concurrent requests', () => {
      proxy.getAll.mockReturnValue(of(paginateOf([])));

      service.getAll(new Paginate(TestModel), []).subscribe();
      service.getAll(new Paginate(TestModel), []).subscribe();

      expect(spinner.on).toHaveBeenCalledTimes(2);
      expect(spinner.on.mock.calls[0][0]).not.toBe(spinner.on.mock.calls[1][0]);
    });

    it('should search with the filter of the query params', () => {
      const response = paginateOf([new TestModel().init({ id: 5 })]);
      const models = [model];
      let result: PaginateInterface;

      activatedRoute.snapshot.queryParams = { filter: JSON.stringify({ name: 'foo' }) };
      proxy.search.mockReturnValue(of(response));

      service
        .getAll(new Paginate(TestModel), models, false, 4)
        .subscribe((value) => (result = value));

      expect(proxy.getAll).not.toHaveBeenCalled();
      // a filtered list always starts from the first page
      expect(proxy.search).toHaveBeenCalledWith({ name: 'foo' }, 0);
      expect(result).toBe(response);
      expect(models).toEqual([model]);
      expect(spinner.off).toHaveBeenCalledWith(spinner.on.mock.calls[0][0]);
    });

    it('should search with an empty filter when the filter query param is null', () => {
      activatedRoute.snapshot.queryParams = { filter: 'null' };
      proxy.search.mockReturnValue(of(paginateOf([])));

      service.getAll(new Paginate(TestModel), []).subscribe();

      expect(proxy.search).toHaveBeenCalledWith({}, 0);
    });

    it('should throw on an invalid JSON filter', () => {
      activatedRoute.snapshot.queryParams = { filter: '{invalid' };

      expect(() => service.getAll(new Paginate(TestModel), [])).toThrow(SyntaxError);
      expect(proxy.search).not.toHaveBeenCalled();
    });

    it('should return an empty paginate in modal mode with a filter in the URL', () => {
      const models = [model];
      let result: PaginateInterface;

      activatedRoute.snapshot.queryParams = { filter: '{"name":"foo"}' };

      service.getAll(new Paginate(TestModel), models, true).subscribe((value) => (result = value));

      expect(result).toBeInstanceOf(Paginate);
      expect(result.data).toEqual([]);
      expect(models).toEqual([model]);
      expect(proxy.getAll).not.toHaveBeenCalled();
      expect(proxy.search).not.toHaveBeenCalled();
      expect(spinner.off).toHaveBeenCalledWith(spinner.on.mock.calls[0][0]);
    });

    it('should propagate a request error', () => {
      const error = { status: 500 };
      let received: unknown;

      proxy.getAll.mockReturnValue(throwError(() => error));

      service
        .getAll(new Paginate(TestModel), [])
        .subscribe({ error: (err: unknown) => (received = err) });

      expect(received).toBe(error);
    });
  });

  describe('search', () => {
    it('should search on the given page', () => {
      const response = paginateOf([model], 2);
      let result: PaginateInterface;

      proxy.search.mockReturnValue(of(response));

      service.search({ name: 'Test' }, 2).subscribe((value) => (result = value));

      expect(proxy.search).toHaveBeenCalledWith({ name: 'Test' }, 2);
      expect(result).toBe(response);
      expect(spinner.on).toHaveBeenCalledWith('search');
      expect(spinner.off).toHaveBeenCalledWith('search');
    });

    it('should keep the spinner on until the response arrives', () => {
      const response = new Subject<PaginateInterface>();

      proxy.search.mockReturnValue(response);

      service.search({}, 1).subscribe();

      expect(spinner.on).toHaveBeenCalledWith('search');
      expect(spinner.off).not.toHaveBeenCalled();

      response.next(paginateOf([]));

      expect(spinner.off).toHaveBeenCalledWith('search');
    });
  });

  describe('searchWithoutPaginate', () => {
    it('should return the found models', () => {
      let result: Array<TestModel>;

      proxy.searchWithoutPaginate.mockReturnValue(of([model]));

      service.searchWithoutPaginate({ name: 'Test' }).subscribe((value) => (result = value));

      expect(proxy.searchWithoutPaginate).toHaveBeenCalledWith({ name: 'Test' });
      expect(result).toEqual([model]);
      expect(spinner.on).toHaveBeenCalledWith('searchWithoutPaginate');
      expect(spinner.off).toHaveBeenCalledWith('searchWithoutPaginate');
    });

    it('should return an empty array as it is', () => {
      let result: Array<TestModel>;

      proxy.searchWithoutPaginate.mockReturnValue(of([]));

      service.searchWithoutPaginate({}).subscribe((value) => (result = value));

      expect(result).toEqual([]);
    });
  });
});
