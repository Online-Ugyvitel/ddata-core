// @ts-nocheck -- generated spec uses loosely typed mock models, events and private members
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ChangeDetectorRef,
  ViewContainerRef,
  Component,
  EventEmitter,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { NgFor } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { BaseModel } from '@netdjw/ddata-core';
import { DdataUiNoDataComponent } from '@netdjw/ddata-ui-common';

import { DdataUiModalDialogComponent } from './modal-dialog.component';
import { DialogContentItem } from '../../models/dialog/content/dialog-content-item';
import { DdataUiDialogModule } from '../../ddata-ui-dialog.module';

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
    expect(component.closeButtonClass).toBe('btn dd-btn-neutral close');
    expect(component.icon.close).toBeDefined();
  });

  describe('showDialog setter', () => {
    it('should call showModal when value is truthy', () => {
      vi.spyOn(component, 'showModal').mockReturnValue(undefined);
      component.showDialog = true;

      expect(component.showModal).toHaveBeenCalled();
    });

    it('should call close when value is falsy and the dialog is open', () => {
      component.isModalVisible = true;
      vi.spyOn(component, 'close').mockReturnValue(undefined);
      component.showDialog = false;

      expect(component.close).toHaveBeenCalled();
    });

    it('should not call close when value is falsy and the dialog is already closed', () => {
      vi.spyOn(component, 'close').mockReturnValue(undefined);
      component.showDialog = false;

      expect(component.close).not.toHaveBeenCalled();
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

// Content components rendered for real into the dialog host.
@Component({
  selector: 'dd-test-edit-content',
  template: '<p class="edit-content">{{ model?.name }}</p>'
})
class TestEditContentComponent {
  data: any;
  model: any;
  isModal = false;
  readonly saveModel = new EventEmitter<any>();
}

@Component({
  selector: 'dd-test-list-content',
  template: '<ul class="list-content"><li *ngFor="let item of models">{{ item.name }}</li></ul>',
  imports: [NgFor]
})
class TestListContentComponent {
  data: any;
  isModal = false;
  multipleSelectEnabled: any;
  isSelectionList: any;
  loadData: any;
  filter: any;
  models: Array<any> = [];
  selectedElements: Array<any> = [];
  readonly select = new EventEmitter<any>();
}

@Component({
  selector: 'dd-test-form-content',
  template: `<div class="form-content">
    <input name="first" />
    <input name="disabled" disabled />
    <input name="skipped" tabindex="-1" />
    <input name="last" />
  </div>`
})
class TestFormContentComponent {
  data: any;
  isModal = false;
}

@Component({
  selector: 'dd-test-host',
  imports: [DdataUiDialogModule],
  template: `<button type="button" class="opener">Open</button>
    <dd-modal-dialog
      [title]="title"
      [dialogContent]="content"
      [showDialog]="show"
      [overlayClickCloseDialog]="overlayClose"
      (showDialogChange)="show = $event; showChanges.push($event)"
      (success)="successes.push($event)"
      (fail)="fails.push($event)"
    ></dd-modal-dialog>`
})
class TestHostComponent {
  title = 'Edit item';
  content: DialogContentItem = new DialogContentItem(TestEditContentComponent, {
    model: { name: 'Initial' }
  });

  show = false;
  overlayClose = true;
  successes: Array<any> = [];
  fails: Array<string> = [];
  showChanges: Array<boolean> = [];
}

describe('DdataUiModalDialogComponent rendered in a host', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let element: HTMLElement;
  let dialog: DdataUiModalDialogComponent;
  const render = (changes: Partial<TestHostComponent> = {}): void => {
    Object.assign(host, changes);
    // the host is OnPush (the default): mark it dirty like an event handler or signal would
    hostFixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    hostFixture.detectChanges();
  };
  const query = (selector: string): HTMLElement | null => element.querySelector(selector);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent]
    });

    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
    element = hostFixture.nativeElement;
    hostFixture.detectChanges();
    dialog = hostFixture.debugElement.query(
      By.directive(DdataUiModalDialogComponent)
    ).componentInstance;
  });

  it('should not emit fail or showDialogChange for the initial hidden binding', () => {
    expect(host.fails).toEqual([]);
    expect(host.successes).toEqual([]);
    expect(host.showChanges).toEqual([]);
  });

  describe('after the initial render', () => {
    it('should render nothing while hidden', () => {
      expect(query('.modal')).toBeNull();
      expect(query('.modal-overlay').classList.contains('active')).toBe(false);
    });

    it('should render the dialog content component when shown', () => {
      render({ show: true });

      expect(query('.modal-title').textContent.trim()).toBe('Edit item');
      expect(query('.modal-overlay').classList.contains('active')).toBe(true);
      expect(query('.modal-body .edit-content').textContent.trim()).toBe('Initial');
    });

    it('should render the content when the dialog is open from the first render', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.componentInstance.show = true;
      hostFixture.detectChanges();

      expect(
        hostFixture.nativeElement.querySelector('.modal-body .edit-content').textContent.trim()
      ).toBe('Initial');
    });

    it('should pass data, model and modal flag to the content component', () => {
      const model = { name: 'Passed model' };
      const data = { model, extra: 42 };

      render({ content: new DialogContentItem(TestEditContentComponent, data), show: true });
      const instance = dialog.componentRef.instance as TestEditContentComponent;

      expect(instance).toBeInstanceOf(TestEditContentComponent);
      expect(instance.data).toBe(data);
      expect(instance.model).toBe(model);
      expect(instance.isModal).toBe(true);
    });

    it('should pass list settings, preloaded models and a copy of selected elements', () => {
      const selected = [{ id: 1, name: 'First' }];
      const models = [
        { id: 1, name: 'First' },
        { id: 2, name: 'Second' }
      ];

      render({
        content: new DialogContentItem(TestListContentComponent, {
          multipleSelectEnabled: true,
          isSelectionList: true,
          loadData: false,
          filter: { active: true },
          models,
          selectedElements: selected
        }),
        show: true
      });
      const instance = dialog.componentRef.instance as TestListContentComponent;

      hostFixture.detectChanges();

      expect(instance.multipleSelectEnabled).toBe(true);
      expect(instance.isSelectionList).toBe(true);
      expect(instance.loadData).toBe(false);
      expect(instance.filter).toEqual({ active: true });
      expect(instance.models).toBe(models);
      expect(instance.selectedElements).toEqual(selected);
      expect(instance.selectedElements).not.toBe(selected);
      expect(
        Array.from(element.querySelectorAll('.list-content li')).map((li) => li.textContent)
      ).toEqual(['First', 'Second']);
    });

    it('should not pass preloaded models when the content loads its own data', () => {
      render({
        content: new DialogContentItem(TestListContentComponent, {
          loadData: true,
          models: [{ id: 1 }]
        }),
        show: true
      });
      const instance = dialog.componentRef.instance as TestListContentComponent;

      expect(instance.models).toEqual([]);
      expect(instance.filter).toEqual({});
    });

    it('should open an empty dialog when there is no dialog content', () => {
      render({ content: null, show: true });

      expect(query('.modal')).not.toBeNull();
      expect(query('.modal-body').children.length).toBe(0);
    });

    it('should fail loudly for a content item without a component', () => {
      render({ content: new DialogContentItem(undefined, {}) });

      expect(() => render({ show: true })).toThrow();
    });

    it('should emit success and close without fail when the content saves a model', () => {
      render({ show: true });
      const saved = { id: 7 };

      (dialog.componentRef.instance as TestEditContentComponent).saveModel.emit(saved);
      hostFixture.detectChanges();

      expect(host.successes).toEqual([saved]);
      expect(host.fails).toEqual([]);
      expect(query('.modal')).toBeNull();
    });

    it('should emit success and fail("close") when the content selects a model', () => {
      render({ content: new DialogContentItem(TestListContentComponent, {}), show: true });
      const selected = { id: 3 };

      (dialog.componentRef.instance as TestListContentComponent).select.emit(selected);
      hostFixture.detectChanges();

      expect(host.successes).toEqual([selected]);
      expect(host.fails).toEqual(['close']);
      expect(query('.modal')).toBeNull();
    });

    it('should emit fail("close") and remove the content on the close button', () => {
      render({ show: true });

      (query('.modal-header button') as HTMLButtonElement).click();
      hostFixture.detectChanges();

      expect(host.fails).toEqual(['close']);
      expect(query('.modal')).toBeNull();
      expect(query('.edit-content')).toBeNull();
    });

    it('should close silently on overlay click when overlayClickCloseDialog is on', () => {
      render({ show: true });

      query('.modal-overlay').click();
      hostFixture.detectChanges();

      expect(query('.modal')).toBeNull();
      expect(host.fails).toEqual([]);
    });

    it('should stay open on overlay click when overlayClickCloseDialog is off', () => {
      render({ show: true, overlayClose: false });

      query('.modal-overlay').click();
      hostFixture.detectChanges();

      expect(query('.modal')).not.toBeNull();
      expect(host.fails).toEqual([]);
    });

    it('should render a fresh content instance after close and reopen', () => {
      render({ show: true });
      const first = dialog.componentRef.instance;

      render({ show: false });
      expect(query('.edit-content')).toBeNull();

      render({ show: true });

      expect(dialog.componentRef.instance).not.toBe(first);
      expect(element.querySelectorAll('.edit-content').length).toBe(1);
    });

    it('should stop forwarding events of a closed content component', () => {
      render({ show: true });
      const first = dialog.componentRef.instance as TestEditContentComponent;

      render({ show: false });
      first.saveModel.emit({ id: 1 });

      expect(host.successes).toEqual([]);
    });

    it('should show several different dialogs in a row', () => {
      render({ show: true });
      render({ show: false });

      render({
        title: 'Pick one',
        content: new DialogContentItem(TestListContentComponent, {
          loadData: false,
          models: [{ name: 'Only' }]
        }),
        show: true
      });
      hostFixture.detectChanges();

      expect(query('.modal-title').textContent.trim()).toBe('Pick one');
      expect(query('.edit-content')).toBeNull();
      expect(query('.list-content li').textContent).toBe('Only');

      (dialog.componentRef.instance as TestListContentComponent).select.emit({ name: 'Only' });
      render({ show: false });
      render({ title: 'Edit again', content: host.content, show: true });

      expect(host.successes).toEqual([{ name: 'Only' }]);
      expect(query('.modal-title').textContent.trim()).toBe('Edit again');
    });
  });

  describe('accessibility', () => {
    it('should expose the dialog as a modal labelled by its title', () => {
      render({ show: true });
      const dialogElement = query('[role="dialog"]');
      const labelId = dialogElement.getAttribute('aria-labelledby');

      expect(dialogElement.getAttribute('aria-modal')).toBe('true');
      expect(labelId).toBe(dialog.titleId);
      expect(element.querySelector(`#${labelId}`).textContent.trim()).toBe('Edit item');
    });

    it('should label the icon-only close button', () => {
      render({ show: true });

      expect(query('.modal-header button').getAttribute('aria-label')).toBe('Close');
    });

    it('should render the close button with the colour-mode-aware class', () => {
      render({ show: true });
      const close = query('.modal-header button');

      expect(Array.from(close.classList).sort()).toEqual(['btn', 'close', 'dd-btn-neutral']);
      expect(close.querySelector('fa-icon')).toBeTruthy();
    });

    it('should render the close button with the given closeButtonClass', () => {
      dialog.closeButtonClass = 'btn btn-close';
      render({ show: true });

      expect(Array.from(query('.modal-header button').classList).sort()).toEqual([
        'btn',
        'btn-close'
      ]);
      expect(query('.modal-header button').getAttribute('aria-label')).toBe('Close');
    });
  });

  describe('keyboard, focus and backdrop', () => {
    const keydown = (key: string, shiftKey = false): KeyboardEvent => {
      const event = new KeyboardEvent('keydown', {
        key,
        shiftKey,
        bubbles: true,
        cancelable: true
      });

      document.activeElement.dispatchEvent(event);
      hostFixture.detectChanges();

      return event;
    };
    const closeButton = (): HTMLElement => query('.modal-header button');
    const openWithForm = (): void => {
      query('.opener').focus();
      render({ content: new DialogContentItem(TestFormContentComponent, {}), show: true });
      hostFixture.detectChanges();
    };

    it('should close on Escape like the close button', () => {
      render({ show: true });
      const event = keydown('Escape');

      expect(event.defaultPrevented).toBe(true);
      expect(query('.modal')).toBeNull();
      expect(host.fails).toEqual(['close']);
      expect(host.showChanges).toEqual([false]);
      expect(host.show).toBe(false);
    });

    it('should accept the legacy "Esc" key name', () => {
      render({ show: true });

      keydown('Esc');

      expect(query('.modal')).toBeNull();
    });

    it('should ignore Escape while closed', () => {
      const event = keydown('Escape');

      expect(event.defaultPrevented).toBe(false);
      expect(host.fails).toEqual([]);
      expect(host.showChanges).toEqual([]);
    });

    it('should ignore other keys', () => {
      render({ show: true });
      const event = keydown('Enter');

      expect(event.defaultPrevented).toBe(false);
      expect(query('.modal')).not.toBeNull();
    });

    it('should reopen after an internal close because showDialogChange resets the parent value', () => {
      render({ show: true });
      keydown('Escape');

      render({ show: true });

      expect(query('.modal')).not.toBeNull();
      expect(query('.edit-content')).not.toBeNull();
    });

    it('should move the focus into the dialog on open and restore it on close', () => {
      const opener = query('.opener');

      opener.focus();
      render({ show: true });

      expect(document.activeElement).toBe(closeButton());

      closeButton().click();
      hostFixture.detectChanges();

      expect(document.activeElement).toBe(opener);
    });

    it('should restore the focus when the parent closes the dialog', () => {
      const opener = query('.opener');

      opener.focus();
      render({ show: true });
      render({ show: false });

      expect(document.activeElement).toBe(opener);
      expect(host.fails).toEqual(['close']);
    });

    it('should not move the focus when the dialog is opened again while open', () => {
      query('.opener').focus();
      render({ show: true });
      query('.modal').focus();

      dialog.showModal();

      expect(document.activeElement).toBe(closeButton());
      dialog.close();
      expect(document.activeElement).toBe(query('.opener'));
    });

    it('should wrap Tab from the last focusable element to the first', () => {
      openWithForm();
      const inputs = Array.from(element.querySelectorAll<HTMLElement>('.form-content input'));

      inputs[inputs.length - 1].focus();
      const event = keydown('Tab');

      expect(event.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(closeButton());
    });

    it('should wrap Shift+Tab from the first focusable element to the last', () => {
      openWithForm();
      const inputs = Array.from(element.querySelectorAll<HTMLElement>('.form-content input'));
      const event = keydown('Tab', true);

      expect(event.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(inputs[inputs.length - 1]);
    });

    it('should leave Tab between inner elements to the browser', () => {
      openWithForm();

      element.querySelector<HTMLElement>('.form-content input').focus();
      const forward = keydown('Tab');
      const backward = keydown('Tab', true);

      expect(forward.defaultPrevented).toBe(false);
      expect(backward.defaultPrevented).toBe(false);
    });

    it('should skip disabled and tabindex="-1" elements when trapping', () => {
      openWithForm();

      closeButton().focus();
      keydown('Tab', true);

      expect(document.activeElement.getAttribute('name')).toBe('last');
    });

    it('should pull the focus back into the dialog when it is outside', () => {
      openWithForm();

      query('.opener').focus();
      keydown('Tab');

      expect(document.activeElement).toBe(closeButton());
    });

    it('should close on a click on the backdrop area of the dialog', () => {
      render({ show: true });

      query('.modal').click();
      hostFixture.detectChanges();

      expect(query('.modal')).toBeNull();
      expect(host.fails).toEqual([]);
      expect(host.showChanges).toEqual([false]);
    });

    it('should stay open on a click inside the dialog box', () => {
      render({ show: true });

      query('.modal-content').click();
      hostFixture.detectChanges();

      expect(query('.modal')).not.toBeNull();
    });

    it('should stay open on a backdrop click when overlayClickCloseDialog is off', () => {
      render({ show: true, overlayClose: false });

      query('.modal').click();
      hostFixture.detectChanges();

      expect(query('.modal')).not.toBeNull();
    });

    it('should give the focus back when it is destroyed while open', () => {
      const outside = document.createElement('button');

      document.body.appendChild(outside);
      outside.focus();
      render({ show: true });

      expect(document.activeElement).toBe(closeButton());

      hostFixture.destroy();

      expect(document.activeElement).toBe(outside);
      outside.remove();
    });
  });
});
