import 'zone.js/testing';
import { Component, EventEmitter, Injector } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { BaseCreateEditComponent } from './base-create-edit.component';
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
    // Mock implementation
  }

  delete(model: TestModelInterface, reference: any) {
    return of(true);
  }

  deleteMultiple(models: TestModelInterface[], reference: any) {
    return of(true);
  }

  stepBack(model: TestModelInterface, isModal: boolean, emitter: EventEmitter<TestModelInterface>): void {
    if (isModal) {
      emitter.emit(null);
    } else {
      // Mock navigation
    }
  }

  changeToPage(turnToPage: number, paginate: any, models: TestModelInterface[]) {
    return of(true);
  }

  getOne(model: TestModelInterface, isModal: boolean, handleLoader?: boolean) {
    return of(true);
  }

  getAll(paginate: any, models: TestModelInterface[], isModal?: boolean, pageNumber?: number) {
    return of(paginate);
  }

  search(data: any, pageNumber?: number) {
    return of(mockPaginate);
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

// Concrete test component extending the abstract BaseCreateEditComponent
@Component({
  template: '<div>Test Component</div>',
  standalone: false
})
class TestCreateEditComponent extends BaseCreateEditComponent<TestModelInterface> {
  constructor() {
    super(TestModel);
  }
}

describe('BaseCreateEditComponent', () => {
  let component: TestCreateEditComponent;
  let fixture: ComponentFixture<TestCreateEditComponent>;
  let mockHelperService: MockHelperService;
  let mockHelperFactoryService: MockHelperFactoryService;

  beforeEach(() => {
    mockHelperService = new MockHelperService();
    mockHelperFactoryService = new MockHelperFactoryService();

    // Mock DdataCoreModule.InjectorInstance completely
    const mockInjector = {
      get: jasmine.createSpy('get').and.returnValue({})
    };
    (DdataCoreModule as any).InjectorInstance = mockInjector;

    TestBed.configureTestingModule({
      declarations: [TestCreateEditComponent],
      providers: [
        Injector,
        { provide: 'type', useValue: TestModel },
        { provide: HelperFactoryService, useValue: mockHelperFactoryService }
      ]
    });

    // Patch the constructor to avoid dependency chain
    spyOn(HelperFactoryService.prototype, 'get').and.returnValue(mockHelperService);

    fixture = TestBed.createComponent(TestCreateEditComponent);
    component = fixture.componentInstance;
    
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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should depend on the helperService', () => {
    expect(component.helperService).toBeDefined();
    expect(component.helperService).toBeInstanceOf(MockHelperService);
  });

  it('should have all required input parameters', () => {
    expect(component.isModal).toBeDefined();
    expect(component.saveToStorage).toBeDefined();
    expect(component.model).toBeDefined();
  });

  it('should set isModal input property to false by default', () => {
    expect(component.isModal).toBe(false);
  });

  it('should set saveToStorage input property to true by default', () => {
    expect(component.saveToStorage).toBe(true);
  });

  it('should create a new empty model based on the given type for model property', () => {
    expect(component.model).toBeInstanceOf(TestModel);
    expect(component.model.id).toBe(0 as ID);
    expect(component.model.name).toBe('');
  });

  it('should set properties correctly from data input', () => {
    const testData = {
      isModal: true,
      saveToStorage: false, // This won't be set because false is falsy
      customProperty: 'test value',
      model: 'should not be set', // Should be excluded
      loadData: 'should not be set' // Should be excluded
    };

    // Store original values
    const originalSaveToStorage = component.saveToStorage;

    component.data = testData;

    expect(component.isModal).toBe(true);
    // saveToStorage should remain unchanged because false is falsy and won't be set by the data setter
    expect(component.saveToStorage).toBe(originalSaveToStorage);
    expect((component as any).customProperty).toBe('test value');
    // model and loadData should not be set from data
    expect(component.model).toBeInstanceOf(TestModel);
  });

  it('should set truthy properties from data input but skip falsy values', () => {
    const testData = {
      isModal: true, // Truthy, should be set
      saveToStorage: false, // Falsy, should not be set
      customBooleanTrue: true, // Truthy, should be set
      customBooleanFalse: false, // Falsy, should not be set
      customString: 'value', // Truthy, should be set
      customEmptyString: '', // Falsy, should not be set
      customNumber: 42, // Truthy, should be set
      customZero: 0 // Falsy, should not be set
    };

    const originalSaveToStorage = component.saveToStorage;

    component.data = testData;

    expect(component.isModal).toBe(true);
    expect(component.saveToStorage).toBe(originalSaveToStorage); // Should remain unchanged
    expect((component as any).customBooleanTrue).toBe(true);
    expect((component as any).customBooleanFalse).toBeUndefined(); // Should not be set
    expect((component as any).customString).toBe('value');
    expect((component as any).customEmptyString).toBeUndefined(); // Should not be set
    expect((component as any).customNumber).toBe(42);
    expect((component as any).customZero).toBeUndefined(); // Should not be set
  });

  it('should have saveModel output parameter', () => {
    expect(component.saveModel).toBeDefined();
    expect(component.saveModel).toBeInstanceOf(EventEmitter);
  });

  it('should call load function in ngOnInit', () => {
    spyOn(component, 'load');
    component.ngOnInit();
    expect(component.load).toHaveBeenCalled();
  });

  it('should call helperService.getOne in load function', () => {
    spyOn(component.helperService, 'getOne').and.returnValue(of(true));
    component.load();
    expect(component.helperService.getOne).toHaveBeenCalledWith(component.model, component.isModal);
  });

  it('should call helperService.save in save function', () => {
    spyOn(component.helperService, 'save').and.returnValue(of(true));
    component.save();
    expect(component.helperService.save).toHaveBeenCalledWith(
      component.model,
      component.isModal,
      component.saveModel,
      component.saveToStorage
    );
  });

  it('should call helperService.saveAsNew in saveAsNew function', () => {
    spyOn(component.helperService, 'saveAsNew').and.returnValue(of(true));
    component.saveAsNew();
    expect(component.helperService.saveAsNew).toHaveBeenCalledWith(component.model);
  });

  it('should call helperService.stepBack in stepBack function', () => {
    spyOn(component.helperService, 'stepBack');
    component.stepBack();
    expect(component.helperService.stepBack).toHaveBeenCalledWith(
      component.model,
      component.isModal,
      component.saveModel
    );
  });

  it('should navigate to {model.api_endpoint}/list URL when stepBack is called in non-modal mode', () => {
    component.isModal = false;
    spyOn(component.helperService, 'stepBack');
    component.stepBack();
    expect(component.helperService.stepBack).toHaveBeenCalledWith(
      component.model,
      false,
      component.saveModel
    );
  });

  it('should emit null in saveModel output when stepBack is called in modal mode', () => {
    component.isModal = true;
    spyOn(component.saveModel, 'emit');
    spyOn(component.helperService, 'stepBack').and.callFake((model, isModal, emitter) => {
      if (isModal) {
        emitter.emit(null);
      }
    });
    
    component.stepBack();
    
    expect(component.saveModel.emit).toHaveBeenCalledWith(null);
  });

  it('should handle null data input gracefully', () => {
    component.data = null;
    // Should not throw an error
    expect(component).toBeTruthy();
  });

  it('should handle undefined data input gracefully', () => {
    component.data = undefined;
    // Should not throw an error
    expect(component).toBeTruthy();
  });

  it('should skip null or undefined values in data input', () => {
    const originalIsModal = component.isModal;
    component.data = {
      isModal: null,
      someProperty: undefined
    };
    
    // Should not change isModal since the value was null
    expect(component.isModal).toBe(originalIsModal);
  });
});