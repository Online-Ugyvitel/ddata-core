import 'zone.js/testing';
import { Component, EventEmitter, Injector } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { BaseListComponent } from './base-list.component';
import { BaseModelInterface, ValidationRuleInterface } from '../../models/base/base-model.model';
import { HelperServiceInterface } from '../../services/helper/helper-service.interface';
import { HelperFactoryService } from '../../services/helper/helper-service.factory';
import { ID, ISODate } from '../../models/base/base-data.type';
import { DdataCoreModule } from '../../ddata-core.module';
import { PaginateInterface } from '../../models/paginate/paginate.interface';

// Test model interface
interface TestModelInterface extends BaseModelInterface<TestModelInterface> {
  name: string;
}

// Test model implementation
class TestModel implements TestModelInterface {
  readonly api_endpoint = '/test';
  readonly model_name = 'TestModel';
  readonly use_localstorage = false;
  
  id: ID = 0 as ID;
  name: string = '';
  tabs?: any;
  isValid = false;
  validationErrors: string[] = [];
  validationRules: ValidationRuleInterface = {};

  init(data?: any): TestModelInterface {
    const incoming = !!data ? data : {};
    this.id = !!incoming.id ? incoming.id as ID : 0 as ID;
    this.name = !!incoming.name ? incoming.name : '';
    return this;
  }

  // Implement all required methods from BaseModelInterface
  fieldAsBoolean(field: string, defaultValue: boolean, data: unknown): void {
    this[field] = data && data[field] !== undefined ? data[field] : defaultValue;
  }

  fieldAsNumber(field: string, defaultValue: number, data: unknown): void {
    this[field] = data && data[field] !== undefined ? data[field] : defaultValue;
  }

  fieldAsString(field: string, defaultValue: string, data: unknown): void {
    this[field] = data && data[field] !== undefined ? data[field] : defaultValue;
  }

  initModelOrNull(fields: Partial<TestModelInterface>, data: unknown): void {
    Object.keys(fields).forEach((field: string) => {
      this[field] = fields[field]?.init(data[field]) ?? null;
    });
  }

  initAsBoolean(fields: Partial<TestModelInterface>, data: unknown): void {
    Object.keys(fields).forEach((field: string) => {
      this.fieldAsBoolean(field, fields[field], data);
    });
  }

  initAsBooleanWithDefaults(fields: Array<string>, data: unknown): void {
    fields.forEach((field: string) => {
      this.fieldAsBoolean(field, false, data);
    });
  }

  initAsNumber(fields: Partial<TestModelInterface>, data: unknown): void {
    Object.keys(fields).forEach((field: string) => {
      this.fieldAsNumber(field, fields[field], data);
    });
  }

  initAsNumberWithDefaults(fields: Array<string>, data: unknown): void {
    fields.forEach((field: string) => {
      this.fieldAsNumber(field, 0, data);
    });
  }

  initAsString(fields: Partial<TestModelInterface>, data: unknown): void {
    Object.keys(fields).forEach((field: string) => {
      this.fieldAsString(field, fields[field], data);
    });
  }

  initAsStringWithDefaults(fields: Array<string>, data: unknown): void {
    fields.forEach((field: string) => {
      this.fieldAsString(field, '', data);
    });
  }

  prepareFieldsToSaveAsBoolean(fields: Partial<TestModelInterface>): Partial<TestModelInterface> {
    return fields;
  }

  prepareFieldsToSaveAsNumber(fields: Partial<TestModelInterface>): Partial<TestModelInterface> {
    return fields;
  }

  prepareFieldsToSaveAsString(fields: Partial<TestModelInterface>): Partial<TestModelInterface> {
    return fields;
  }

  prepareToSave(): any {
    return {
      id: this.id,
      name: this.name
    };
  }

  validate(): void {
    this.isValid = true;
  }

  getValidatedErrorFields(): string[] {
    return this.validationErrors;
  }

  setDate(date: Date, days: number): ISODate {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate.toISOString().split('T')[0] as ISODate;
  }

  getCurrentUserId(): ID {
    return 1 as ID;
  }

  getCurrentISODate(): ISODate {
    return new Date().toISOString().split('T')[0] as ISODate;
  }

  toISODate(date: Date): ISODate {
    return date.toISOString().split('T')[0] as ISODate;
  }

  toISODatetime(date: Date): string {
    return date.toISOString();
  }

  calculateDateWithoutWeekend(date: string, days: number, sequence: string): ISODate {
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() + days);
    return startDate.toISOString().split('T')[0] as ISODate;
  }

  getCurrentTime(): string {
    return new Date().toTimeString();
  }
}

// Mock PaginateInterface implementation
const mockPaginate: PaginateInterface = {
  current_page: 1,
  per_page: 10,
  from: 1,
  to: 10,
  total: 100,
  last_page: 10,
  data: []
};

const mockPaginateWithData: PaginateInterface = {
  current_page: 1,
  per_page: 10,
  from: 1,
  to: 10,
  total: 100,
  last_page: 10,
  data: [new TestModel().init({ id: 1, name: 'Test Item' })]
};

// Mock HelperService
class MockHelperService implements HelperServiceInterface<TestModelInterface> {
  booleanChange(model: TestModelInterface, fieldName: string) {
    return of(true);
  }

  save(model: TestModelInterface, isModal: boolean, emitter: EventEmitter<TestModelInterface>, saveBackend?: boolean, navigateAfterSuccess?: string) {
    if (isModal && !saveBackend) {
      emitter.emit(model);
    }
    return of(true);
  }

  saveAsNew(model: TestModelInterface) {
    model.id = 0 as ID;
    return of(true);
  }

  edit(model: TestModelInterface, reference: any): void {
    if (reference && reference.editModel) {
      reference.editModel.emit(model);
    }
  }

  delete(model: TestModelInterface, reference: any) {
    if (reference && reference.deleteModel) {
      reference.deleteModel.emit(model);
    }
    return of(true);
  }

  deleteMultiple(models: TestModelInterface[], reference: any) {
    if (reference && reference.deleteMultipleModels) {
      reference.deleteMultipleModels.emit(models);
    }
    return of(true);
  }

  stepBack(model: TestModelInterface, isModal: boolean, emitter: EventEmitter<TestModelInterface>): void {
    if (isModal) {
      emitter.emit(null);
    }
  }

  changeToPage(turnToPage: number, paginate: any, models: TestModelInterface[]) {
    return of(true);
  }

  getOne(model: TestModelInterface, isModal: boolean, handleLoader?: boolean) {
    return of(true);
  }

  getAll(paginate: any, models: TestModelInterface[], isModal?: boolean, pageNumber?: number) {
    return of(mockPaginateWithData);
  }

  search(data: any, pageNumber?: number) {
    return of(mockPaginateWithData);
  }

  searchWithoutPaginate(data: any) {
    return of([]);
  }
}

// Mock HelperFactoryService
class MockHelperFactoryService extends HelperFactoryService<TestModelInterface> {
  get(newable: new() => TestModelInterface): HelperServiceInterface<TestModelInterface> {
    return new MockHelperService();
  }
}

// Mock ActivatedRoute
const mockActivatedRoute = {
  snapshot: {
    params: { id: '1' },
    queryParams: {},
    data: {}
  },
  params: of({ id: '1' }),
  queryParams: of({}),
  data: of({})
};

// Concrete test component extending the abstract BaseListComponent
@Component({
  template: '<div>Test List Component</div>',
  standalone: false
})
class TestListComponent extends BaseListComponent<TestModelInterface> {
  constructor() {
    super(TestModel);
  }
}

describe('BaseListComponent', () => {
  let component: TestListComponent;
  let fixture: ComponentFixture<TestListComponent>;
  let mockHelperService: MockHelperService;
  let mockHelperFactoryService: MockHelperFactoryService;

  beforeEach(() => {
    mockHelperService = new MockHelperService();
    mockHelperFactoryService = new MockHelperFactoryService();

    // Mock DdataCoreModule.InjectorInstance completely
    const mockInjector = {
      get: jasmine.createSpy('get').and.returnValue(mockActivatedRoute)
    };
    (DdataCoreModule as any).InjectorInstance = mockInjector;

    TestBed.configureTestingModule({
      declarations: [TestListComponent],
      providers: [
        Injector,
        { provide: 'type', useValue: TestModel },
        { provide: HelperFactoryService, useValue: mockHelperFactoryService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    // Patch the constructor to avoid dependency chain
    spyOn(HelperFactoryService.prototype, 'get').and.returnValue(mockHelperService);

    fixture = TestBed.createComponent(TestListComponent);
    component = fixture.componentInstance;
    
    // Prevent ngOnInit from calling load automatically
    spyOn(component, 'load').and.stub();
    
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture && fixture.debugElement) {
      const nativeElement = fixture.debugElement.nativeElement;
      if (nativeElement && nativeElement.parentNode) {
        nativeElement.parentNode.removeChild(nativeElement);
      }
    }
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have default property values', () => {
      expect(component.isModal).toBe(false);
      expect(component.isEmbed).toBe(false);
      expect(component.loadData).toBe(true);
      expect(component.models).toEqual([]);
      expect(component.filter).toEqual({});
      expect(component.transformToLowerCase).toBe(true);
      expect(component.currentPageNumber).toBe(0);
    });

    it('should initialize model and paginate on construction', () => {
      expect(component.model).toBeInstanceOf(TestModel);
      expect(component.paginate).toBeDefined();
      expect(component.helperService).toBeInstanceOf(MockHelperService);
      expect(component.activatedRoute).toBe(mockActivatedRoute);
    });

    it('should call load on ngOnInit', () => {
      // Reset the spy to actually test ngOnInit
      (component.load as jasmine.Spy).and.callThrough();
      spyOn(component, 'load');
      
      component.ngOnInit();
      
      expect(component.load).toHaveBeenCalled();
    });
  });

  describe('Input Properties', () => {
    it('should set isModal input property', () => {
      component.isModal = true;
      expect(component.isModal).toBe(true);
    });

    it('should set isEmbed input property', () => {
      component.isEmbed = true;
      expect(component.isEmbed).toBe(true);
    });

    it('should set loadData input property', () => {
      component.loadData = false;
      expect(component.loadData).toBe(false);
    });

    it('should set models input property', () => {
      const testModels = [new TestModel().init({ id: 1, name: 'Test' })];
      component.models = testModels;
      expect(component.models).toEqual(testModels);
    });

    it('should set filter input property', () => {
      const testFilter = { name: 'test', status: 'active' };
      component.filter = testFilter;
      expect(component.filter).toEqual(testFilter);
    });

    it('should set properties correctly from data input when data has values', () => {
      const testData = {
        isModal: true,
        isEmbed: true,
        filter: { name: 'test' },
        customProperty: 'test value',
        model: 'should not be set', // Should be excluded
        loadData: 'should not be set' // Should be excluded
      };

      component.data = testData;

      expect(component.isModal).toBe(true);
      expect(component.isEmbed).toBe(true);
      expect(component.filter).toEqual({ name: 'test' });
      expect((component as any).customProperty).toBe('test value');
    });

    it('should not set properties from data input when data values are null or undefined', () => {
      const originalIsModal = component.isModal;
      const originalIsEmbed = component.isEmbed;
      
      const testData = {
        isModal: null,
        isEmbed: undefined,
        emptyValue: ''
      };

      component.data = testData;

      expect(component.isModal).toBe(originalIsModal);
      expect(component.isEmbed).toBe(originalIsEmbed);
      expect((component as any).emptyValue).toBe('');
    });

    it('should handle null data input', () => {
      const originalIsModal = component.isModal;
      
      component.data = null;
      
      expect(component.isModal).toBe(originalIsModal);
    });

    it('should handle undefined data input', () => {
      const originalIsModal = component.isModal;
      
      component.data = undefined;
      
      expect(component.isModal).toBe(originalIsModal);
    });
  });

  describe('Output Events', () => {
    it('should have editModel event emitter', () => {
      expect(component.editModel).toBeInstanceOf(EventEmitter);
    });

    it('should have deleteModel event emitter', () => {
      expect(component.deleteModel).toBeInstanceOf(EventEmitter);
    });

    it('should have deleteMultipleModels event emitter', () => {
      expect(component.deleteMultipleModels).toBeInstanceOf(EventEmitter);
    });

    it('should have saveModel event emitter', () => {
      expect(component.saveModel).toBeInstanceOf(EventEmitter);
    });
  });

  describe('load method', () => {
    beforeEach(() => {
      (component.load as jasmine.Spy).and.callThrough();
    });

    it('should not load data when loadData is false', () => {
      component.loadData = false;
      spyOn(component as any, 'setGetRequest');
      
      component.load();
      
      expect((component as any).setGetRequest).not.toHaveBeenCalled();
    });

    it('should load data when loadData is true', () => {
      component.loadData = true;
      spyOn(component as any, 'setGetRequest').and.returnValue(of(mockPaginateWithData));
      
      component.load();
      
      expect((component as any).setGetRequest).toHaveBeenCalled();
      expect(component.paginate).toEqual(mockPaginateWithData);
      expect(component.models).toEqual(mockPaginateWithData.data);
    });
  });

  describe('setGetRequest method (private)', () => {
    it('should call helperService.getAll when filter is empty', () => {
      component.filter = {};
      spyOn(mockHelperService, 'getAll').and.returnValue(of(mockPaginateWithData));
      
      (component as any).setGetRequest().subscribe();
      
      expect(mockHelperService.getAll).toHaveBeenCalledWith(
        component.paginate,
        component.models,
        component.isModal,
        component.currentPageNumber
      );
    });

    it('should call helperService.search when filter has values', () => {
      const testFilter = { name: 'test' };
      component.filter = testFilter;
      spyOn(mockHelperService, 'search').and.returnValue(of(mockPaginateWithData));
      
      (component as any).setGetRequest().subscribe();
      
      expect(mockHelperService.search).toHaveBeenCalledWith(testFilter, component.currentPageNumber);
    });
  });

  describe('isEmptyObject method (private)', () => {
    it('should return true for empty object', () => {
      const result = (component as any).isEmptyObject({});
      expect(result).toBe(true);
    });

    it('should return false for object with properties', () => {
      const result = (component as any).isEmptyObject({ name: 'test' });
      expect(result).toBe(false);
    });

    it('should return false for non-object values', () => {
      const result = (component as any).isEmptyObject([]);
      expect(result).toBe(false);
    });

    it('should return false for object with nested properties', () => {
      const result = (component as any).isEmptyObject({ nested: { prop: 'value' } });
      expect(result).toBe(false);
    });
  });

  describe('toggleCheckbox method', () => {
    it('should call helperService.booleanChange and subscribe', () => {
      const testModel = new TestModel().init({ id: 1, name: 'Test' });
      const fieldName = 'isActive';
      spyOn(mockHelperService, 'booleanChange').and.returnValue(of(true));
      
      component.toggleCheckbox(testModel, fieldName);
      
      expect(mockHelperService.booleanChange).toHaveBeenCalledWith(testModel, fieldName);
    });
  });

  describe('edit method', () => {
    it('should call helperService.edit with model and component reference', () => {
      const testModel = new TestModel().init({ id: 1, name: 'Test' });
      spyOn(mockHelperService, 'edit');
      
      component.edit(testModel);
      
      expect(mockHelperService.edit).toHaveBeenCalledWith(testModel, component);
    });
  });

  describe('delete method', () => {
    it('should splice model from models array when isEmbed is true', () => {
      const testModel = new TestModel().init({ id: 1, name: 'Test' });
      component.models = [testModel];
      component.isEmbed = true;
      
      component.delete(testModel);
      
      expect(component.models).toEqual([]);
    });

    it('should call helperService.delete when isEmbed is false', () => {
      const testModel = new TestModel().init({ id: 1, name: 'Test' });
      component.isEmbed = false;
      spyOn(mockHelperService, 'delete').and.returnValue(of(true));
      
      component.delete(testModel);
      
      expect(mockHelperService.delete).toHaveBeenCalledWith(testModel, component);
    });

    it('should remove correct model from array when multiple models exist and isEmbed is true', () => {
      const model1 = new TestModel().init({ id: 1, name: 'Test1' });
      const model2 = new TestModel().init({ id: 2, name: 'Test2' });
      const model3 = new TestModel().init({ id: 3, name: 'Test3' });
      component.models = [model1, model2, model3];
      component.isEmbed = true;
      
      component.delete(model2);
      
      expect(component.models).toEqual([model1, model3]);
    });
  });

  describe('deleteMultiple method', () => {
    it('should call helperService.deleteMultiple and subscribe', () => {
      const testModels = [
        new TestModel().init({ id: 1, name: 'Test1' }),
        new TestModel().init({ id: 2, name: 'Test2' })
      ];
      spyOn(mockHelperService, 'deleteMultiple').and.returnValue(of(true));
      
      component.deleteMultiple(testModels);
      
      expect(mockHelperService.deleteMultiple).toHaveBeenCalledWith(testModels, component);
    });
  });

  describe('changePage method', () => {
    it('should update currentPageNumber and call setGetRequest', () => {
      const newPage = 3;
      spyOn(component as any, 'setGetRequest').and.returnValue(of(mockPaginateWithData));
      
      component.changePage(newPage);
      
      expect(component.currentPageNumber).toBe(newPage);
      expect((component as any).setGetRequest).toHaveBeenCalled();
    });
  });

  describe('save method', () => {
    it('should call helperService.save with correct parameters', () => {
      const testModel = new TestModel().init({ id: 1, name: 'Test' });
      component.isModal = true;
      spyOn(mockHelperService, 'save').and.returnValue(of(true));
      
      component.save(testModel);
      
      expect(mockHelperService.save).toHaveBeenCalledWith(testModel, component.isModal, component.saveModel);
    });

    it('should call helperService.save with isModal false', () => {
      const testModel = new TestModel().init({ id: 1, name: 'Test' });
      component.isModal = false;
      spyOn(mockHelperService, 'save').and.returnValue(of(true));
      
      component.save(testModel);
      
      expect(mockHelperService.save).toHaveBeenCalledWith(testModel, false, component.saveModel);
    });
  });

  describe('Event Emissions', () => {
    it('should emit editModel when edit is called through helper service', () => {
      const testModel = new TestModel().init({ id: 1, name: 'Test' });
      spyOn(component.editModel, 'emit');
      
      // Simulate the helper service calling the edit method
      mockHelperService.edit(testModel, component);
      
      expect(component.editModel.emit).toHaveBeenCalledWith(testModel);
    });

    it('should emit deleteModel when delete is called through helper service', () => {
      const testModel = new TestModel().init({ id: 1, name: 'Test' });
      component.isEmbed = false;
      spyOn(component.deleteModel, 'emit');
      
      component.delete(testModel);
      
      expect(component.deleteModel.emit).toHaveBeenCalledWith(testModel);
    });

    it('should emit deleteMultipleModels when deleteMultiple is called through helper service', () => {
      const testModels = [
        new TestModel().init({ id: 1, name: 'Test1' }),
        new TestModel().init({ id: 2, name: 'Test2' })
      ];
      spyOn(component.deleteMultipleModels, 'emit');
      
      component.deleteMultiple(testModels);
      
      expect(component.deleteMultipleModels.emit).toHaveBeenCalledWith(testModels);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete load cycle with empty filter', () => {
      (component.load as jasmine.Spy).and.callThrough();
      component.loadData = true;
      component.filter = {};
      spyOn(mockHelperService, 'getAll').and.returnValue(of(mockPaginateWithData));
      
      component.load();
      
      expect(mockHelperService.getAll).toHaveBeenCalled();
      expect(component.paginate).toEqual(mockPaginateWithData);
      expect(component.models).toEqual(mockPaginateWithData.data);
    });

    it('should handle complete load cycle with filter', () => {
      (component.load as jasmine.Spy).and.callThrough();
      component.loadData = true;
      component.filter = { name: 'test' };
      spyOn(mockHelperService, 'search').and.returnValue(of(mockPaginateWithData));
      
      component.load();
      
      expect(mockHelperService.search).toHaveBeenCalledWith({ name: 'test' }, 0);
      expect(component.paginate).toEqual(mockPaginateWithData);
      expect(component.models).toEqual(mockPaginateWithData.data);
    });

    it('should handle page change and reload data', () => {
      component.filter = { status: 'active' };
      spyOn(mockHelperService, 'search').and.returnValue(of(mockPaginateWithData));
      
      component.changePage(2);
      
      expect(component.currentPageNumber).toBe(2);
      expect(mockHelperService.search).toHaveBeenCalledWith({ status: 'active' }, 2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle delete when model is not in models array', () => {
      const testModel = new TestModel().init({ id: 1, name: 'Test' });
      const otherModel = new TestModel().init({ id: 2, name: 'Other' });
      component.models = [otherModel];
      component.isEmbed = true;
      
      component.delete(testModel);
      
      // Should not crash and models array should remain unchanged
      expect(component.models).toEqual([otherModel]);
    });

    it('should handle data setter with complex nested object', () => {
      const complexData = {
        isModal: true,
        nested: {
          deep: {
            value: 'test'
          }
        },
        array: [1, 2, 3],
        model: 'should not be set',
        loadData: 'should not be set'
      };

      component.data = complexData;

      expect(component.isModal).toBe(true);
      expect((component as any).nested).toEqual(complexData.nested);
      expect((component as any).array).toEqual(complexData.array);
    });

    it('should handle changePage with zero page number', () => {
      spyOn(component as any, 'setGetRequest').and.returnValue(of(mockPaginateWithData));
      
      component.changePage(0);
      
      expect(component.currentPageNumber).toBe(0);
      expect((component as any).setGetRequest).toHaveBeenCalled();
    });

    it('should handle changePage with negative page number', () => {
      spyOn(component as any, 'setGetRequest').and.returnValue(of(mockPaginateWithData));
      
      component.changePage(-1);
      
      expect(component.currentPageNumber).toBe(-1);
      expect((component as any).setGetRequest).toHaveBeenCalled();
    });
  });
});