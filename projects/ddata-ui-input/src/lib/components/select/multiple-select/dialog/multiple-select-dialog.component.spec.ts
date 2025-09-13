import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, ViewContainerRef, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DdataMultipleSelectDialogComponent } from './multiple-select-dialog.component';
import { ComponentRendererService } from '../../../../services/select/component-renderer.service';
import { DialogContentWithOptionsInterface } from '../../../../models/dialog/content/dialog-content.interface';

describe('DdataMultipleSelectDialogComponent', () => {
  let component: DdataMultipleSelectDialogComponent;
  let fixture: ComponentFixture<DdataMultipleSelectDialogComponent>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  let mockComponentRendererService: jasmine.SpyObj<ComponentRendererService>;
  let mockViewContainerRef: jasmine.SpyObj<ViewContainerRef>;

  // Mock component instance for dialog content
  const mockComponentInstance = {
    saveModel: new EventEmitter<any>(),
    select: new EventEmitter<any[]>(),
    selectedElements: [],
    multipleSelectEnabled: false,
    isSelectionList: false,
    loadData: false,
    filter: {},
    models: [],
    datasArrived: new BehaviorSubject<number>(0),
    isModal: false
  };

  // Mock settings
  const mockSettings: DialogContentWithOptionsInterface = {
    listComponent: jasmine.createSpy('MockListComponent'),
    listOptions: {
      multipleSelectEnabled: true,
      isSelectionList: true,
      loadData: false,
      selectedElements: [],
      models: []
    },
    createEditComponent: jasmine.createSpy('MockCreateEditComponent'),
    createEditOptions: {
      saveModel: of({}),
      select: of([])
    }
  };

  // Mock model
  const mockModel = {
    id: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
    tag_id: { id: 1, name: 'Selected Tag' },
    fields: {},
    fieldAsBoolean: jasmine.createSpy('fieldAsBoolean'),
    fieldAsNumber: jasmine.createSpy('fieldAsNumber'),
    fieldAsString: jasmine.createSpy('fieldAsString'),
    initModelOrNull: jasmine.createSpy('initModelOrNull'),
    initAsBoolean: jasmine.createSpy('initAsBoolean')
  };

  beforeEach(async () => {
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    mockViewContainerRef = jasmine.createSpyObj('ViewContainerRef', ['clear', 'createComponent']);
    
    mockComponentRendererService = jasmine.createSpyObj('ComponentRendererService', [
      'setMethod',
      'setSettings', 
      'setDialogHost',
      'setComponentRef',
      'render',
      'getSelectedModels',
      'setSelectedModels',
      'resetSelectedModels'
    ]);

    // Chain methods for fluent interface
    mockComponentRendererService.setMethod.and.returnValue(mockComponentRendererService);
    mockComponentRendererService.setSettings.and.returnValue(mockComponentRendererService);
    mockComponentRendererService.setDialogHost.and.returnValue(mockComponentRendererService);
    mockComponentRendererService.setComponentRef.and.returnValue(mockComponentRendererService);
    mockComponentRendererService.render.and.returnValue(mockComponentInstance);
    mockComponentRendererService.getSelectedModels.and.returnValue([]);
    mockComponentRendererService.setSelectedModels.and.returnValue(mockComponentRendererService);
    mockComponentRendererService.resetSelectedModels.and.returnValue(mockComponentRendererService);

    await TestBed.configureTestingModule({
      declarations: [DdataMultipleSelectDialogComponent],
      providers: [
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DdataMultipleSelectDialogComponent);
    component = fixture.componentInstance;

    // Override the service creation in constructor
    (component as any).componentRendererService = mockComponentRendererService;

    // Set up ViewChild mock
    component.dialogHost = mockViewContainerRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Constructor', () => {
    it('should initialize componentRendererService', () => {
      expect((component as any).componentRendererService).toBeDefined();
    });

    it('should initialize subscription', () => {
      expect((component as any).subscription).toBeDefined();
      expect((component as any).subscription.closed).toBeFalse();
    });

    it('should initialize private properties', () => {
      expect((component as any).componentRef).toBeUndefined();
      expect((component as any).selectedModel).toBeUndefined();
    });
  });

  describe('Input Properties', () => {
    it('should have default values for inputs', () => {
      expect(component.method).toBe('list');
      expect(component.mode).toBe('multiple');
      expect(component.field).toBe('id');
      expect(component.text).toBe('name');
      expect(component.valueField).toBe('id');
      expect(component.items).toEqual([]);
      expect(component.modalTitle).toBe('Dialog');
    });

    it('should accept settings input', () => {
      component.settings = mockSettings;
      expect(component.settings).toBe(mockSettings);
    });

    it('should accept method input', () => {
      component.method = 'create-edit';
      expect(component.method).toBe('create-edit');
    });

    it('should accept mode input', () => {
      component.mode = 'single';
      expect(component.mode).toBe('single');
    });

    it('should accept model input', () => {
      component.model = mockModel;
      expect(component.model).toBe(mockModel);
    });

    it('should accept field input', () => {
      component.field = 'tag_id';
      expect(component.field).toBe('tag_id');
    });

    it('should accept text input', () => {
      component.text = 'label';
      expect(component.text).toBe('label');
    });

    it('should accept valueField input', () => {
      component.valueField = 'value';
      expect(component.valueField).toBe('value');
    });

    it('should accept items input', () => {
      const items = [{ id: 1, name: 'Test' }];
      component.items = items;
      expect(component.items).toBe(items);
    });

    it('should accept modalTitle input', () => {
      component.modalTitle = 'Custom Title';
      expect(component.modalTitle).toBe('Custom Title');
    });
  });

  describe('Output Events', () => {
    it('should have selectionFinished event emitter', () => {
      expect(component.selectionFinished).toBeInstanceOf(EventEmitter);
    });

    it('should have selected event emitter', () => {
      expect(component.selected).toBeInstanceOf(EventEmitter);
    });

    it('should have selectModel event emitter', () => {
      expect(component.selectModel).toBeInstanceOf(EventEmitter);
    });
  });

  describe('ngOnInit', () => {
    it('should call getSelectedItems', () => {
      spyOn(component as any, 'getSelectedItems');
      component.ngOnInit();
      expect((component as any).getSelectedItems).toHaveBeenCalled();
    });

    it('should set selectedModel when mode is single', () => {
      component.mode = 'single';
      component.model = mockModel;
      component.field = 'tag_id';
      component.ngOnInit();
      expect((component as any).selectedModel).toBe(mockModel.tag_id);
    });

    it('should not set selectedModel when mode is not single', () => {
      component.mode = 'multiple';
      component.model = mockModel;
      component.ngOnInit();
      expect((component as any).selectedModel).toBeUndefined();
    });
  });

  describe('ngAfterViewInit', () => {
    beforeEach(() => {
      component.settings = mockSettings;
      component.model = mockModel;
    });

    it('should render component through componentRendererService', () => {
      component.ngAfterViewInit();

      expect(mockComponentRendererService.setMethod).toHaveBeenCalledWith('list');
      expect(mockComponentRendererService.setSettings).toHaveBeenCalledWith(mockSettings);
      expect(mockComponentRendererService.setDialogHost).toHaveBeenCalledWith(mockViewContainerRef);
      expect(mockComponentRendererService.setComponentRef).toHaveBeenCalledWith(undefined);
      expect(mockComponentRendererService.render).toHaveBeenCalled();
    });

    it('should log error and return when instance is null', () => {
      spyOn(console, 'error');
      mockComponentRendererService.render.and.returnValue(null);

      component.ngAfterViewInit();

      expect(console.error).toHaveBeenCalledWith('Component for dialog is not defined');
    });

    it('should handle single mode with selected model', () => {
      component.mode = 'single';
      component.field = 'tag_id';
      
      component.ngAfterViewInit();

      expect(mockComponentRendererService.setSelectedModels).toHaveBeenCalledWith([mockModel.tag_id]);
    });

    it('should handle single mode without selected model', () => {
      component.mode = 'single';
      component.field = 'nonexistent_field';
      
      component.ngAfterViewInit();

      expect(mockComponentRendererService.setSelectedModels).not.toHaveBeenCalled();
    });

    it('should handle single mode with null selected model', () => {
      component.mode = 'single';
      component.model = { ...mockModel, tag_id: null };
      component.field = 'tag_id';
      
      component.ngAfterViewInit();

      expect(mockComponentRendererService.setSelectedModels).not.toHaveBeenCalled();
    });

    it('should handle single mode with falsy selected model', () => {
      component.mode = 'single';
      component.model = { ...mockModel, tag_id: undefined };
      component.field = 'tag_id';
      
      component.ngAfterViewInit();

      expect(mockComponentRendererService.setSelectedModels).not.toHaveBeenCalled();
    });

    it('should handle multiple mode', () => {
      component.mode = 'multiple';
      component.field = 'id';
      
      component.ngAfterViewInit();

      expect(mockComponentRendererService.setSelectedModels).toHaveBeenCalledWith(mockModel.id);
    });

    it('should subscribe to saveModel', () => {
      spyOn(component as any, 'setModel');
      const testModel = { id: 1, name: 'Test' };

      component.ngAfterViewInit();
      mockComponentInstance.saveModel.emit(testModel);

      expect((component as any).setModel).toHaveBeenCalledWith(testModel);
    });

    it('should subscribe to select and handle multiple mode', () => {
      component.mode = 'multiple';
      component.field = 'id';
      component.settings = {
        ...mockSettings,
        listOptions: {
          ...mockSettings.listOptions,
          selectedElements: [{ id: 1 }]
        }
      };
      spyOn(component as any, 'emitEvents');

      component.ngAfterViewInit();
      const testModels = [{ id: 1, name: 'Test' }];
      mockComponentInstance.select.emit(testModels);

      expect(component.model.id).toEqual([]);
      expect(component.settings.listOptions.selectedElements).toEqual([]);
      expect((component as any).emitEvents).toHaveBeenCalledWith(testModels);
    });

    it('should handle null models in select subscription', () => {
      spyOn(component as any, 'emitEvents');

      component.ngAfterViewInit();
      mockComponentInstance.select.emit(null);

      expect((component as any).emitEvents).not.toHaveBeenCalled();
    });

    it('should not reset model fields in single mode', () => {
      component.mode = 'single';
      component.field = 'tag_id';
      component.settings = mockSettings;
      const originalModel = { ...mockModel };
      
      component.ngAfterViewInit();
      const testModels = [{ id: 1, name: 'Test' }];
      mockComponentInstance.select.emit(testModels);

      // In single mode, model fields should not be reset
      expect(component.model.id).toEqual(originalModel.id);
    });
  });

  describe('HostListener - onKeydownHandler', () => {
    it('should emit selectionFinished on ESC key', () => {
      spyOn(component.selectionFinished, 'emit');
      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      component.onKeydownHandler(event);

      expect(component.selectionFinished.emit).toHaveBeenCalled();
    });
  });

  describe('hideModal', () => {
    it('should get selected elements and emit events', () => {
      const selectedElements = [{ id: 1, name: 'Test' }];
      mockComponentRendererService.getSelectedModels.and.returnValue(selectedElements);
      spyOn(component as any, 'emitEvents');

      component.hideModal();

      expect(mockComponentRendererService.getSelectedModels).toHaveBeenCalled();
      expect((component as any).emitEvents).toHaveBeenCalledWith(selectedElements);
      expect(mockComponentRendererService.resetSelectedModels).toHaveBeenCalled();
    });
  });

  describe('emitEvents', () => {
    it('should emit selectModel for each model and selectionFinished with all models', () => {
      const models = [{ id: 1, name: 'Test1' }, { id: 2, name: 'Test2' }];
      spyOn(component.selectModel, 'emit');
      spyOn(component.selectionFinished, 'emit');

      (component as any).emitEvents(models);

      expect(component.selectModel.emit).toHaveBeenCalledTimes(2);
      expect(component.selectModel.emit).toHaveBeenCalledWith(models[0]);
      expect(component.selectModel.emit).toHaveBeenCalledWith(models[1]);
      expect(component.selectionFinished.emit).toHaveBeenCalledWith(models);
    });

    it('should handle empty models array', () => {
      spyOn(component.selectModel, 'emit');
      spyOn(component.selectionFinished, 'emit');

      (component as any).emitEvents([]);

      expect(component.selectModel.emit).not.toHaveBeenCalled();
      expect(component.selectionFinished.emit).toHaveBeenCalledWith([]);
    });
  });

  describe('getObjectFieldName', () => {
    it('should remove _id suffix from field name', () => {
      component.field = 'tag_id';
      const result = (component as any).getObjectFieldName();
      expect(result).toBe('tag');
    });

    it('should return field name as is if no _id suffix', () => {
      component.field = 'category';
      const result = (component as any).getObjectFieldName();
      expect(result).toBe('category');
    });

    it('should handle field with multiple _id occurrences', () => {
      component.field = 'parent_tag_id';
      const result = (component as any).getObjectFieldName();
      expect(result).toBe('parent_tag');
    });

    it('should handle empty field name', () => {
      component.field = '';
      const result = (component as any).getObjectFieldName();
      expect(result).toBe('');
    });

    it('should handle field ending with just _id', () => {
      component.field = '_id';
      const result = (component as any).getObjectFieldName();
      expect(result).toBe('');
    });
  });

  describe('setModel', () => {
    it('should exist as a method', () => {
      expect(typeof (component as any).setModel).toBe('function');
    });

    it('should handle model parameter', () => {
      const testModel = { id: 1, name: 'Test' };
      // Method currently has no implementation (TODO comment)
      expect(() => (component as any).setModel(testModel)).not.toThrow();
    });
  });

  describe('getSelectedItems', () => {
    it('should set selectedModel when mode is single', () => {
      component.mode = 'single';
      component.model = mockModel;
      component.field = 'tag_id';

      (component as any).getSelectedItems();

      expect((component as any).selectedModel).toBe(mockModel.tag_id);
    });

    it('should not set selectedModel when mode is not single', () => {
      component.mode = 'multiple';
      component.model = mockModel;
      component.field = 'id';

      (component as any).getSelectedItems();

      expect((component as any).selectedModel).toBeUndefined();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined dialogHost', () => {
      component.dialogHost = undefined;
      spyOn(console, 'error');
      
      mockComponentRendererService.setDialogHost.and.returnValue(mockComponentRendererService);
      
      component.ngAfterViewInit();
      
      expect(mockComponentRendererService.setDialogHost).toHaveBeenCalledWith(undefined);
    });

    it('should handle different method types', () => {
      component.method = 'create-edit';
      component.settings = mockSettings;
      
      component.ngAfterViewInit();
      
      expect(mockComponentRendererService.setMethod).toHaveBeenCalledWith('create-edit');
    });

    it('should handle undefined model', () => {
      component.model = undefined;
      component.mode = 'single';
      
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });

    it('should handle undefined settings', () => {
      component.settings = undefined;
      
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });

    it('should handle undefined componentRef in ngAfterViewInit', () => {
      component.settings = mockSettings;
      (component as any).componentRef = undefined;
      
      expect(() => component.ngAfterViewInit()).not.toThrow();
      expect(mockComponentRendererService.setComponentRef).toHaveBeenCalledWith(undefined);
    });

    it('should handle model without requested field in single mode', () => {
      component.mode = 'single';
      component.model = { otherField: 'value' };
      component.field = 'missing_field_id';
      component.settings = mockSettings;
      
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });

    it('should handle model without requested field in multiple mode', () => {
      component.mode = 'multiple';
      component.model = { otherField: 'value' };
      component.field = 'missing_field';
      component.settings = mockSettings;
      
      expect(() => component.ngAfterViewInit()).not.toThrow();
      expect(mockComponentRendererService.setSelectedModels).toHaveBeenCalledWith(undefined);
    });

    it('should handle settings without listOptions', () => {
      component.mode = 'multiple';
      component.field = 'id';
      component.settings = {
        listComponent: jasmine.createSpy('MockListComponent'),
        createEditComponent: jasmine.createSpy('MockCreateEditComponent')
      };
      
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });
  });

  describe('Subscription Management', () => {
    it('should create subscription in ngAfterViewInit', () => {
      component.settings = mockSettings;
      
      component.ngAfterViewInit();
      
      expect((component as any).subscription).toBeDefined();
    });

    it('should handle multiple subscriptions', () => {
      component.settings = mockSettings;
      
      component.ngAfterViewInit();
      
      // Verify subscription was added by checking it has observers
      expect((component as any).subscription.closed).toBeFalse();
    });
  });

  describe('Component Integration', () => {
    it('should work with all inputs configured', () => {
      component.settings = mockSettings;
      component.method = 'create-edit';
      component.mode = 'single';
      component.model = mockModel;
      component.field = 'tag_id';
      component.text = 'label';
      component.valueField = 'value';
      component.items = [{ id: 1, name: 'Test' }];
      component.modalTitle = 'Test Dialog';

      expect(() => {
        component.ngOnInit();
        component.ngAfterViewInit();
      }).not.toThrow();
    });

    it('should handle complete workflow for multiple mode', () => {
      component.settings = mockSettings;
      component.mode = 'multiple';
      component.model = mockModel;
      component.field = 'id';
      
      spyOn(component.selectionFinished, 'emit');
      spyOn(component.selectModel, 'emit');

      component.ngOnInit();
      component.ngAfterViewInit();

      // Simulate selection
      const selectedModels = [{ id: 1, name: 'Test' }];
      mockComponentRendererService.getSelectedModels.and.returnValue(selectedModels);
      
      component.hideModal();

      expect(component.selectModel.emit).toHaveBeenCalledWith(selectedModels[0]);
      expect(component.selectionFinished.emit).toHaveBeenCalledWith(selectedModels);
    });

    it('should handle complete workflow for single mode', () => {
      component.settings = mockSettings;
      component.mode = 'single';
      component.model = mockModel;
      component.field = 'tag_id';
      
      spyOn(component.selectionFinished, 'emit');
      spyOn(component.selectModel, 'emit');

      component.ngOnInit();
      component.ngAfterViewInit();

      // Verify single mode setup
      expect(mockComponentRendererService.setSelectedModels).toHaveBeenCalledWith([mockModel.tag_id]);
    });
  });
});