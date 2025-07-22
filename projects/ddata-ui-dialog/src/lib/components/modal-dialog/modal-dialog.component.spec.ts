import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, ComponentFactoryResolver, ViewContainerRef, Component } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseModel } from 'ddata-core';
import { DdataUiNoDataComponent } from 'ddata-ui-common';

import { DdataUiModalDialogComponent } from './modal-dialog.component';
import { DialogContentItem } from '../../models/dialog/content/dialog-content-item';

// Mock component for testing
@Component({
  template: '<div>Mock Component</div>'
})
class MockDialogComponent {
  data: any;
  isModal = false;
  multipleSelectEnabled = false;
  isSelectionList = false;
  loadData = true;
  filter = {};
  models: any[] = [];
  selectedElements: any[] = [];
  saveModel = new EventEmitter<any>();
  select = new EventEmitter<any[]>();
}

// Mock component without select observable
@Component({
  template: '<div>Mock Component Without Select</div>'
})
class MockDialogComponentWithoutSelect {
  data: any;
  isModal = false;
  multipleSelectEnabled = false;
  isSelectionList = false;
  loadData = true;
  filter = {};
  models: any[] = [];
  selectedElements: any[] = [];
  saveModel = new EventEmitter<any>();
}

describe('DdataUiModalDialogComponent', () => {
  let component: DdataUiModalDialogComponent;
  let fixture: ComponentFixture<DdataUiModalDialogComponent>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  let mockComponentFactoryResolver: jasmine.SpyObj<ComponentFactoryResolver>;
  let mockViewContainerRef: jasmine.SpyObj<ViewContainerRef>;
  let mockComponentRef: any;
  let mockComponentFactory: any;

  beforeEach(async () => {
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    mockComponentFactoryResolver = jasmine.createSpyObj('ComponentFactoryResolver', ['resolveComponentFactory']);
    mockViewContainerRef = jasmine.createSpyObj('ViewContainerRef', ['clear', 'createComponent']);
    
    mockComponentRef = {
      instance: new MockDialogComponent()
    };
    
    mockComponentFactory = jasmine.createSpyObj('ComponentFactory', []);
    mockComponentFactoryResolver.resolveComponentFactory.and.returnValue(mockComponentFactory);
    mockViewContainerRef.createComponent.and.returnValue(mockComponentRef);

    await TestBed.configureTestingModule({
      declarations: [DdataUiModalDialogComponent, MockDialogComponent, MockDialogComponentWithoutSelect],
      providers: [
        { provide: ComponentFactoryResolver, useValue: mockComponentFactoryResolver },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DdataUiModalDialogComponent);
    component = fixture.componentInstance;
    
    // Mock the ViewChild
    component.dialogHost = mockViewContainerRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isModalVisible).toBe(false);
    expect(component.title).toBe('');
    expect(component.model).toEqual(new BaseModel());
    expect(component.dialogContent).toEqual(new DialogContentItem(DdataUiNoDataComponent, {}));
    expect(component.overlayClickCloseDialog).toBe(true);
    expect(component.closeButtonText).toBe('Close');
    expect(component.icon.close).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should call ngOnInit without errors', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('showDialog setter', () => {
    it('should call showModal when value is truthy', () => {
      spyOn(component, 'showModal');
      component.showDialog = true;
      expect(component.showModal).toHaveBeenCalled();
    });

    it('should call close when value is falsy', () => {
      spyOn(component, 'close');
      component.showDialog = false;
      expect(component.close).toHaveBeenCalled();
    });

    it('should call showModal when value is truthy string', () => {
      spyOn(component, 'showModal');
      component.showDialog = 'true' as any;
      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    beforeEach(() => {
      spyOn(component, 'changeModalStatus' as any);
    });

    it('should call changeModalStatus with false', () => {
      component.close();
      expect((component as any).changeModalStatus).toHaveBeenCalledWith(false);
    });

    it('should unsubscribe from componentSubscription if it exists', () => {
      const mockSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component.componentSubscription = mockSubscription;
      
      component.close();
      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should not throw error if componentSubscription is undefined', () => {
      component.componentSubscription = undefined as any;
      expect(() => component.close()).not.toThrow();
    });

    it('should emit fail event when emit is true (default)', () => {
      spyOn(component.fail, 'emit');
      component.close();
      expect(component.fail.emit).toHaveBeenCalledWith('close');
    });

    it('should emit fail event when emit is explicitly true', () => {
      spyOn(component.fail, 'emit');
      component.close(true);
      expect(component.fail.emit).toHaveBeenCalledWith('close');
    });

    it('should not emit fail event when emit is false', () => {
      spyOn(component.fail, 'emit');
      component.close(false);
      expect(component.fail.emit).not.toHaveBeenCalled();
    });
  });

  describe('closeWithoutEmit', () => {
    it('should call close with false parameter', () => {
      spyOn(component, 'close');
      component.closeWithoutEmit();
      expect(component.close).toHaveBeenCalledWith(false);
    });
  });

  describe('showModal', () => {
    beforeEach(() => {
      spyOn(component, 'changeModalStatus' as any);
      spyOn(component, 'renderComponent');
    });

    it('should call changeModalStatus with true', () => {
      component.showModal();
      expect((component as any).changeModalStatus).toHaveBeenCalledWith(true);
    });

    it('should call renderComponent', () => {
      component.showModal();
      expect(component.renderComponent).toHaveBeenCalled();
    });
  });

  describe('changeModalStatus', () => {
    it('should set isModalVisible to provided value', () => {
      (component as any).changeModalStatus(true);
      expect(component.isModalVisible).toBe(true);
      
      (component as any).changeModalStatus(false);
      expect(component.isModalVisible).toBe(false);
    });

    it('should default to false when no parameter provided', () => {
      component.isModalVisible = true;
      (component as any).changeModalStatus();
      expect(component.isModalVisible).toBe(false);
    });

    it('should call detectChanges on ChangeDetectorRef', () => {
      (component as any).changeModalStatus(true);
      expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
    });
  });

  describe('renderComponent', () => {
    beforeEach(() => {
      component.dialogContent = new DialogContentItem(MockDialogComponent, {});
    });

    it('should return early if dialogContent is null', () => {
      component.dialogContent = null as any;
      component.renderComponent();
      expect(mockComponentFactoryResolver.resolveComponentFactory).not.toHaveBeenCalled();
    });

    it('should return early if dialogContent is undefined', () => {
      component.dialogContent = undefined as any;
      component.renderComponent();
      expect(mockComponentFactoryResolver.resolveComponentFactory).not.toHaveBeenCalled();
    });

    it('should resolve component factory and create component', () => {
      component.renderComponent();
      
      expect(mockComponentFactoryResolver.resolveComponentFactory).toHaveBeenCalledWith(MockDialogComponent);
      expect(mockViewContainerRef.clear).toHaveBeenCalled();
      expect(mockViewContainerRef.createComponent).toHaveBeenCalledWith(mockComponentFactory);
    });

    it('should set model on component instance if data.model exists', () => {
      const testModel = new BaseModel().init();
      component.dialogContent = new DialogContentItem(MockDialogComponent, { model: testModel });
      
      component.renderComponent();
      
      expect((mockComponentRef.instance as any).model).toBe(testModel);
    });

    it('should set basic properties on component instance', () => {
      const testData = { someProperty: 'testValue' };
      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);
      
      component.renderComponent();
      
      expect(mockComponentRef.instance.data).toBe(testData);
      expect(mockComponentRef.instance.isModal).toBe(true);
    });

    it('should subscribe to saveModel observable if it exists', () => {
      const mockSaveModel = new EventEmitter<any>();
      spyOn(mockSaveModel, 'subscribe').and.returnValue({ unsubscribe: () => {} } as any);
      mockComponentRef.instance.saveModel = mockSaveModel;
      spyOn(component, 'save');
      
      component.renderComponent();
      
      expect(mockSaveModel.subscribe).toHaveBeenCalled();
    });

    it('should set dialog properties when data exists', () => {
      const testData = {
        multipleSelectEnabled: true,
        isSelectionList: true,
        loadData: false,
        filter: { testFilter: 'value' }
      };
      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);
      
      component.renderComponent();
      
      expect(mockComponentRef.instance.isModal).toBe(true);
      expect(mockComponentRef.instance.multipleSelectEnabled).toBe(true);
      expect(mockComponentRef.instance.isSelectionList).toBe(true);
      expect(mockComponentRef.instance.loadData).toBe(false);
      expect(mockComponentRef.instance.filter).toEqual({ testFilter: 'value' });
    });

    it('should set models when loadData is false and models exist', () => {
      const testModels = [{ id: 1 }, { id: 2 }];
      const testData = {
        loadData: false,
        models: testModels
      };
      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);
      
      component.renderComponent();
      
      expect(mockComponentRef.instance.models).toBe(testModels);
    });

    it('should set selectedElements when they exist', () => {
      const selectedElements = [{ id: 1 }, { id: 2 }];
      const testData = {
        selectedElements: selectedElements
      };
      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);
      
      component.renderComponent();
      
      expect(mockComponentRef.instance.selectedElements).toEqual(selectedElements);
    });

    it('should return early if component does not have select observable', () => {
      mockComponentRef.instance = new MockDialogComponentWithoutSelect();
      const testData = { someData: 'test' };
      component.dialogContent = new DialogContentItem(MockDialogComponentWithoutSelect, testData);
      
      expect(() => component.renderComponent()).not.toThrow();
    });

    it('should subscribe to select observable and handle events', () => {
      const testModels = [{ id: 1 }, { id: 2 }];
      const mockSelect = of(testModels);
      mockComponentRef.instance.select = mockSelect;
      spyOn(component.success, 'emit');
      spyOn(component, 'close');
      
      const testData = { someData: 'test' };
      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);
      
      component.renderComponent();
      
      expect(component.success.emit).toHaveBeenCalledWith({ id: 1 });
      expect(component.success.emit).toHaveBeenCalledWith({ id: 2 });
      expect(component.close).toHaveBeenCalled();
    });

    it('should handle empty filter object', () => {
      const testData = {
        filter: undefined
      };
      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);
      
      component.renderComponent();
      
      expect(mockComponentRef.instance.filter).toEqual({});
    });
  });

  describe('save', () => {
    it('should emit success event with provided model', () => {
      const testModel = { id: 1, name: 'test' };
      spyOn(component.success, 'emit');
      spyOn(component, 'closeWithoutEmit');
      
      component.save(testModel);
      
      expect(component.success.emit).toHaveBeenCalledWith(testModel);
    });

    it('should call closeWithoutEmit', () => {
      const testModel = { id: 1, name: 'test' };
      spyOn(component, 'closeWithoutEmit');
      
      component.save(testModel);
      
      expect(component.closeWithoutEmit).toHaveBeenCalled();
    });
  });

  describe('clickOnOverlay', () => {
    it('should call closeWithoutEmit when overlayClickCloseDialog is true', () => {
      component.overlayClickCloseDialog = true;
      spyOn(component, 'closeWithoutEmit');
      
      component.clickOnOverlay();
      
      expect(component.closeWithoutEmit).toHaveBeenCalled();
    });

    it('should not call closeWithoutEmit when overlayClickCloseDialog is false', () => {
      component.overlayClickCloseDialog = false;
      spyOn(component, 'closeWithoutEmit');
      
      component.clickOnOverlay();
      
      expect(component.closeWithoutEmit).not.toHaveBeenCalled();
    });
  });

  describe('Output events', () => {
    it('should have success EventEmitter', () => {
      expect(component.success).toBeInstanceOf(EventEmitter);
    });

    it('should have fail EventEmitter', () => {
      expect(component.fail).toBeInstanceOf(EventEmitter);
    });

    it('should emit success event through save method', () => {
      const testModel = { id: 1 };
      let emittedValue: any;
      
      component.success.subscribe(value => emittedValue = value);
      component.save(testModel);
      
      expect(emittedValue).toBe(testModel);
    });

    it('should emit fail event through close method', () => {
      let emittedValue: any;
      
      component.fail.subscribe(value => emittedValue = value);
      component.close();
      
      expect(emittedValue).toBe('close');
    });
  });

  describe('Edge cases and additional coverage', () => {
    it('should handle null/undefined saveModel observable', () => {
      mockComponentRef.instance.saveModel = null;
      const testData = { someData: 'test' };
      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);
      
      expect(() => component.renderComponent()).not.toThrow();
    });

    it('should handle undefined saveModel observable', () => {
      mockComponentRef.instance.saveModel = undefined;
      const testData = { someData: 'test' };
      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);
      
      expect(() => component.renderComponent()).not.toThrow();
    });

    it('should handle component instance that does not implement DialogContentInterface fully', () => {
      const minimalInstance = {};
      mockComponentRef.instance = minimalInstance;
      const testData = { someData: 'test' };
      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);
      
      expect(() => component.renderComponent()).not.toThrow();
    });

    it('should handle empty selectedElements array', () => {
      const testData = {
        selectedElements: []
      };
      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);
      
      component.renderComponent();
      
      expect(mockComponentRef.instance.selectedElements).toEqual([]);
    });

    it('should handle null selectedElements', () => {
      const testData = {
        selectedElements: null
      };
      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);
      
      component.renderComponent();
      
      // Should not set selectedElements if it's null
      expect(mockComponentRef.instance.selectedElements).toEqual([]);
    });

    it('should handle multiple save() calls', () => {
      const testModel1 = { id: 1, name: 'test1' };
      const testModel2 = { id: 2, name: 'test2' };
      spyOn(component.success, 'emit');
      spyOn(component, 'closeWithoutEmit');
      
      component.save(testModel1);
      component.save(testModel2);
      
      expect(component.success.emit).toHaveBeenCalledWith(testModel1);
      expect(component.success.emit).toHaveBeenCalledWith(testModel2);
      expect(component.closeWithoutEmit).toHaveBeenCalledTimes(2);
    });

    it('should handle renderComponent when dialogContent.data is null', () => {
      component.dialogContent = new DialogContentItem(MockDialogComponent, null);
      
      expect(() => component.renderComponent()).not.toThrow();
    });

    it('should handle renderComponent when dialogContent.data is undefined', () => {
      component.dialogContent = new DialogContentItem(MockDialogComponent, undefined);
      
      expect(() => component.renderComponent()).not.toThrow();
    });
  });

  describe('Integration tests', () => {
    it('should handle complete show and hide cycle', () => {
      spyOn(component, 'renderComponent');
      
      // Show modal
      component.showDialog = true;
      expect(component.isModalVisible).toBe(true);
      expect(component.renderComponent).toHaveBeenCalled();
      
      // Hide modal
      component.showDialog = false;
      expect(component.isModalVisible).toBe(false);
    });

    it('should handle component with saveModel subscription', () => {
      const testModel = { id: 1, name: 'test' };
      const saveModelEmitter = new EventEmitter<any>();
      mockComponentRef.instance.saveModel = saveModelEmitter;
      
      spyOn(component, 'save');
      
      component.renderComponent();
      
      // Trigger saveModel event
      saveModelEmitter.emit(testModel);
      
      expect(component.save).toHaveBeenCalledWith(testModel);
    });

    it('should properly unsubscribe when modal is closed after subscription', () => {
      const saveModelEmitter = new EventEmitter<any>();
      mockComponentRef.instance.saveModel = saveModelEmitter;
      
      component.renderComponent();
      
      expect(component.componentSubscription).toBeDefined();
      
      spyOn(component.componentSubscription, 'unsubscribe');
      component.close();
      
      expect(component.componentSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should handle complex dialog flow with select observable', () => {
      const testModels = [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }];
      const selectEmitter = new EventEmitter<any[]>();
      mockComponentRef.instance.select = selectEmitter;
      
      spyOn(component.success, 'emit');
      spyOn(component, 'close');
      
      const testData = { someData: 'test' };
      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);
      
      component.renderComponent();
      
      // Trigger select event
      selectEmitter.emit(testModels);
      
      expect(component.success.emit).toHaveBeenCalledTimes(2);
      expect(component.success.emit).toHaveBeenCalledWith({ id: 1, name: 'test1' });
      expect(component.success.emit).toHaveBeenCalledWith({ id: 2, name: 'test2' });
      expect(component.close).toHaveBeenCalled();
    });
  });
});
