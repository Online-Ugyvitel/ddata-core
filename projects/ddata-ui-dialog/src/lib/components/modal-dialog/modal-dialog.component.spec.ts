// @ts-nocheck -- generated spec uses loosely typed mock models, events and private members
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ChangeDetectorRef,
  ViewContainerRef,
  Component,
  EventEmitter,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseModel } from '@netdjw/ddata-core';
import { DdataUiNoDataComponent } from '@netdjw/ddata-ui-common';

import { DdataUiModalDialogComponent } from './modal-dialog.component';
import { DialogContentItem } from '../../models/dialog/content/dialog-content-item';

// Mock component for testing
@Component({
  standalone: false,
  template: '<div>Mock Component</div>'
})
class MockDialogComponent {
  data: any;
  isModal = false;
  multipleSelectEnabled = false;
  isSelectionList = false;
  loadData = true;
  filter = {};
  models: Array<any> = [];
  selectedElements: Array<any> = [];
  saveModel = new EventEmitter<any>();
  select = new EventEmitter<Array<any>>();
}

// Mock component without select observable
@Component({
  standalone: false,
  template: '<div>Mock Component Without Select</div>'
})
class MockDialogComponentWithoutSelect {
  data: any;
  isModal = false;
  multipleSelectEnabled = false;
  isSelectionList = false;
  loadData = true;
  filter = {};
  models: Array<any> = [];
  selectedElements: Array<any> = [];
  saveModel = new EventEmitter<any>();
}

describe('DdataUiModalDialogComponent', () => {
  let component: DdataUiModalDialogComponent;
  let fixture: ComponentFixture<DdataUiModalDialogComponent>;
  let mockChangeDetectorRef: any;
  let mockViewContainerRef: any;
  let mockComponentRef: any;
  let mockComponentFactory: any;

  beforeEach(async () => {
    mockChangeDetectorRef = {
      detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges')
    };
    mockViewContainerRef = {
      clear: vi.fn().mockName('ViewContainerRef.clear'),
      createComponent: vi.fn().mockName('ViewContainerRef.createComponent')
    };

    mockComponentRef = {
      instance: new MockDialogComponent()
    };

    mockComponentFactory = {};
    mockViewContainerRef.createComponent.mockReturnValue(mockComponentRef);

    await TestBed.configureTestingModule({
      declarations: [
        DdataUiModalDialogComponent,
        MockDialogComponent,
        MockDialogComponentWithoutSelect
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }]
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

  describe('showDialog setter', () => {
    it('should call showModal when value is truthy', () => {
      vi.spyOn(component, 'showModal').mockReturnValue(undefined);
      component.showDialog = true;

      expect(component.showModal).toHaveBeenCalled();
    });

    it('should call close when value is falsy', () => {
      vi.spyOn(component, 'close').mockReturnValue(undefined);
      component.showDialog = false;

      expect(component.close).toHaveBeenCalled();
    });

    it('should call showModal when value is truthy string', () => {
      vi.spyOn(component, 'showModal').mockReturnValue(undefined);
      component.showDialog = 'true' as any;

      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    beforeEach(() => {
      vi.spyOn(component, 'changeModalStatus' as any).mockReturnValue(undefined);
    });

    it('should call changeModalStatus with false', () => {
      component.close();

      expect((component as any).changeModalStatus).toHaveBeenCalledWith(false);
    });

    it('should unsubscribe from componentSubscription if it exists', () => {
      const mockSubscription = {
        unsubscribe: vi.fn().mockName('Subscription.unsubscribe')
      };

      component.componentSubscription = mockSubscription;

      component.close();

      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should not throw error if componentSubscription is undefined', () => {
      component.componentSubscription = undefined;

      expect(() => component.close()).not.toThrow();
    });

    it('should emit fail event when emit is true (default)', () => {
      vi.spyOn(component.fail, 'emit').mockReturnValue(undefined);
      component.close();

      expect(component.fail.emit).toHaveBeenCalledWith('close');
    });

    it('should emit fail event when emit is explicitly true', () => {
      vi.spyOn(component.fail, 'emit').mockReturnValue(undefined);
      component.close(true);

      expect(component.fail.emit).toHaveBeenCalledWith('close');
    });

    it('should not emit fail event when emit is false', () => {
      vi.spyOn(component.fail, 'emit').mockReturnValue(undefined);
      component.close(false);

      expect(component.fail.emit).not.toHaveBeenCalled();
    });
  });

  describe('closeWithoutEmit', () => {
    it('should call close with false parameter', () => {
      vi.spyOn(component, 'close').mockReturnValue(undefined);
      component.closeWithoutEmit();

      expect(component.close).toHaveBeenCalledWith(false);
    });
  });

  describe('showModal', () => {
    beforeEach(() => {
      vi.spyOn(component, 'changeModalStatus' as any).mockReturnValue(undefined);
      vi.spyOn(component, 'renderComponent').mockReturnValue(undefined);
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
      // the component receives the change detector of its own view
      const detectChanges = vi
        .spyOn((component as any).changeDetector, 'detectChanges')
        .mockReturnValue(undefined);

      (component as any).changeModalStatus(true);

      expect(detectChanges).toHaveBeenCalled();
    });
  });

  describe('renderComponent', () => {
    beforeEach(() => {
      component.dialogContent = new DialogContentItem(MockDialogComponent, {});
    });

    it('should return early if dialogContent is null', () => {
      component.dialogContent = null;
      component.renderComponent();

      expect(mockViewContainerRef.createComponent).not.toHaveBeenCalled();
    });

    it('should return early if dialogContent is undefined', () => {
      component.dialogContent = undefined;
      component.renderComponent();

      expect(mockViewContainerRef.createComponent).not.toHaveBeenCalled();
    });

    it('should create the dialog component', () => {
      component.renderComponent();

      expect(mockViewContainerRef.createComponent).toHaveBeenCalledWith(MockDialogComponent);
      expect(mockViewContainerRef.clear).toHaveBeenCalled();
    });

    it('should set model on component instance if data.model exists', () => {
      const testModel = { id: 1 } as any;

      component.dialogContent = new DialogContentItem(MockDialogComponent, { model: testModel });

      component.renderComponent();

      expect(mockComponentRef.instance.model).toBe(testModel);
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

      vi.spyOn(mockSaveModel, 'subscribe').mockReturnValue({ unsubscribe: () => {} } as any);
      mockComponentRef.instance.saveModel = mockSaveModel;
      vi.spyOn(component, 'save').mockReturnValue(undefined);

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
      vi.spyOn(component.success, 'emit').mockReturnValue(undefined);
      vi.spyOn(component, 'close').mockReturnValue(undefined);
      const testData = { someData: 'test' };

      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);

      component.renderComponent();

      expect(component.success.emit).toHaveBeenCalledWith(testModels);
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

      vi.spyOn(component.success, 'emit').mockReturnValue(undefined);
      vi.spyOn(component, 'closeWithoutEmit').mockReturnValue(undefined);

      component.save(testModel);

      expect(component.success.emit).toHaveBeenCalledWith(testModel);
    });

    it('should call closeWithoutEmit', () => {
      const testModel = { id: 1, name: 'test' };

      vi.spyOn(component, 'closeWithoutEmit').mockReturnValue(undefined);

      component.save(testModel);

      expect(component.closeWithoutEmit).toHaveBeenCalled();
    });
  });

  describe('clickOnOverlay', () => {
    it('should call closeWithoutEmit when overlayClickCloseDialog is true', () => {
      component.overlayClickCloseDialog = true;
      vi.spyOn(component, 'closeWithoutEmit').mockReturnValue(undefined);

      component.clickOnOverlay();

      expect(component.closeWithoutEmit).toHaveBeenCalled();
    });

    it('should not call closeWithoutEmit when overlayClickCloseDialog is false', () => {
      component.overlayClickCloseDialog = false;
      vi.spyOn(component, 'closeWithoutEmit').mockReturnValue(undefined);

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

      component.success.subscribe((value) => (emittedValue = value));
      component.save(testModel);

      expect(emittedValue).toBe(testModel);
    });

    it('should emit fail event through close method', () => {
      let emittedValue: any;

      component.fail.subscribe((value) => (emittedValue = value));
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

      vi.spyOn(component.success, 'emit').mockReturnValue(undefined);
      vi.spyOn(component, 'closeWithoutEmit').mockReturnValue(undefined);

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
      vi.spyOn(component, 'renderComponent').mockReturnValue(undefined);

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

      vi.spyOn(component, 'save').mockReturnValue(undefined);

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

      vi.spyOn(component.componentSubscription, 'unsubscribe').mockReturnValue(undefined);
      component.close();

      expect(component.componentSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should handle complex dialog flow with select observable', () => {
      const testModels = [
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' }
      ];
      const selectEmitter = new EventEmitter<Array<any>>();

      mockComponentRef.instance.select = selectEmitter;

      vi.spyOn(component.success, 'emit').mockReturnValue(undefined);
      vi.spyOn(component, 'close').mockReturnValue(undefined);
      const testData = { someData: 'test' };

      component.dialogContent = new DialogContentItem(MockDialogComponent, testData);

      component.renderComponent();

      // Trigger select event
      selectEmitter.emit(testModels);

      expect(component.success.emit).toHaveBeenCalledTimes(1);
      expect(component.success.emit).toHaveBeenCalledWith(testModels);
      expect(component.close).toHaveBeenCalled();
    });
  });
});
