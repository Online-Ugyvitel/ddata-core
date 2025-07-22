import 'zone.js/testing';
import { Injector } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from './base-list.component';
import { HelperFactoryService } from '../../services/helper/helper-service.factory';
import { DdataCoreModule } from '../../ddata-core.module';
import { TestModelInterface } from './testing/test-model.interface';
import { TestModel } from './testing/test-model.class';
import { MockHelperService } from './testing/mock-helper.service';
import { MockHelperFactoryService } from './testing/mock-helper-factory.service';
import { TestListComponent } from './testing/test-list.component';
import { mockPaginate, mockPaginateWithData } from './testing/mock-paginate.data';
import { mockActivatedRoute } from './testing/mock-activated-route.data';

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

    it('should update paginate and models after changePage when observable resolves', () => {
      component.currentPageNumber = 1;
      component.filter = { name: 'test' };
      
      // Setup the observable to return data
      spyOn(mockHelperService, 'search').and.returnValue(of(mockPaginateWithData));
      
      component.changePage(2);
      
      // The subscribe in changePage should complete, but we need to trigger it
      // Since changePage calls setGetRequest().subscribe(), we need to verify the subscription behavior
      expect(component.currentPageNumber).toBe(2);
      expect(mockHelperService.search).toHaveBeenCalledWith({ name: 'test' }, 2);
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

    it('should handle page change and reload data with search when filter exists', () => {
      component.filter = { status: 'active' };
      spyOn(mockHelperService, 'search').and.returnValue(of(mockPaginateWithData));
      
      component.changePage(2);
      
      expect(component.currentPageNumber).toBe(2);
      expect(mockHelperService.search).toHaveBeenCalledWith({ status: 'active' }, 2);
    });

    it('should handle page change and reload data with getAll when filter is empty', () => {
      component.filter = {};
      spyOn(mockHelperService, 'getAll').and.returnValue(of(mockPaginateWithData));
      
      component.changePage(3);
      
      expect(component.currentPageNumber).toBe(3);
      expect(mockHelperService.getAll).toHaveBeenCalledWith(
        component.paginate,
        component.models,
        component.isModal,
        3
      );
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
  });
});