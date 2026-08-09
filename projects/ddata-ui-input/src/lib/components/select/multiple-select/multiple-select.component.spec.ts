import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DdataMultipleSelectComponent } from './multiple-select.component';
import { DialogContentWithOptionsInterface } from '../../../models/dialog/content/dialog-content.interface';
import { InputHelperService } from '../../../services/input/helper/input-helper.service';
import { DdataCoreModule, BaseModelInterface, FieldsInterface } from 'ddata-core';

type MockModel = BaseModelInterface<unknown> & FieldsInterface<unknown>;

interface MockTagInterface {
  id: number;
  name: string;
  is_selected?: boolean;
  [key: string]: unknown;
}

interface MockModelWithSingleTagInterface {
  tag_id: number;
  tag: MockTagInterface | null;
  [key: string]: unknown;
}

describe('DdataMultipleSelectComponent', () => {
  let component: DdataMultipleSelectComponent;
  let fixture: ComponentFixture<DdataMultipleSelectComponent>;
  // Mock objects for testing
  const mockTag1: MockTagInterface = { id: 1, name: 'Test Tag 1' };
  const mockTag2: MockTagInterface = { id: 2, name: 'Test Tag 2' };
  const mockTag3: MockTagInterface = { id: 3, name: 'Test Tag 3' };
  const mockModel = {
    tags: [mockTag1, mockTag2],
    getObjectFieldName: (): string => 'tags',
    validationErrors: [] as Array<unknown>
  };
  const mockDialogSettings: DialogContentWithOptionsInterface = {
    createEditComponent: undefined,
    listComponent: null,
    listOptions: {
      isModal: true,
      multipleSelectEnabled: true,
      isSelectionList: true,
      selectedElements: [mockTag1, mockTag2],
      loadData: false
    }
  };

  beforeEach(async () => {
    // Mock injector service
    let randCharsCounter = 0;
    const mockInjector = {
      get: jasmine.createSpy('get').and.returnValue({
        validateFieldValue: jasmine.createSpy('validateFieldValue').and.returnValue([]),
        createUniqueId: jasmine.createSpy('createUniqueId').and.returnValue('test-id-123'),
        randChars: jasmine
          .createSpy('randChars')
          .and.callFake(() => `test-random-chars-${++randCharsCounter}`),
        getLabel: jasmine.createSpy('getLabel').and.returnValue('Test Label'),
        getPlaceholder: jasmine.createSpy('getPlaceholder').and.returnValue('Test Placeholder'),
        getPrepend: jasmine.createSpy('getPrepend').and.returnValue('Test Prepend'),
        getAppend: jasmine.createSpy('getAppend').and.returnValue('Test Append'),
        isRequired: jasmine.createSpy('isRequired').and.returnValue(true),
        validateField: jasmine.createSpy('validateField').and.returnValue(true)
      })
    };

    // Set up the mock injector before TestBed configuration
    Object.defineProperty(DdataCoreModule, 'InjectorInstance', {
      value: mockInjector,
      writable: true
    });

    await TestBed.configureTestingModule({
      declarations: [DdataMultipleSelectComponent],
      imports: [FormsModule],
      providers: [{ provide: InputHelperService, useValue: mockInjector.get() }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DdataMultipleSelectComponent);
    component = fixture.componentInstance;

    // Set up component with minimal mock data - don't call detectChanges yet
    component.model = mockModel as unknown as MockModel;
    component.field = 'tags';
    component.mode = 'multiple';
    component.dialogSettings = mockDialogSettings;

    // Don't call fixture.detectChanges() here - let individual tests handle it
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values for inputs', () => {
      const mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
      const newComponent = new DdataMultipleSelectComponent(mockChangeDetectorRef);

      expect(newComponent.wrapperClass).toBe('d-flex flex-wrap');
      expect(newComponent.inputBlockClass).toBe('col-12 d-flex px-0');
      expect(newComponent.inputBlockExtraClass).toBe('col-md-9');
      expect(newComponent.unselectedText).toBe('Válassz');
      expect(newComponent.mode).toBe('multiple');
      expect(newComponent.isRequired).toBe(false);
      expect(newComponent.disabledAppearance).toBe(false);
      expect(newComponent.disabled).toBe(false);
      expect(newComponent.addEmptyOption).toBe(true);
      expect(newComponent.field).toBe('id');
      expect(newComponent.text).toBe('name');
      expect(newComponent.valueField).toBe('id');
    });

    it('should generate unique id', () => {
      component.field = 'test_field';
      const id1 = component.id;
      const mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
      const newComponent = new DdataMultipleSelectComponent(mockChangeDetectorRef);

      newComponent.field = 'test_field';
      const id2 = newComponent.id;

      expect(id1).toContain('test_field_');
      expect(id2).toContain('test_field_');
      expect(id1).not.toBe(id2);
    });
  });

  describe('dialogSettings setter', () => {
    it('should set dialog settings when value is provided', () => {
      const settings = { ...mockDialogSettings };

      component.dialogSettings = settings;

      expect(component.dialogSettings).toBe(settings);
    });

    it('should log error when null value is provided', () => {
      // eslint-disable-next-line no-undef
      spyOn(console, 'error');

      component.dialogSettings = null;

      // eslint-disable-next-line no-undef
      expect(console.error).toHaveBeenCalledWith(
        'You try to use dd-select as multiple select, but not defined dialogSettings. Please define it.'
      );
    });

    it('should log error when undefined value is provided', () => {
      // eslint-disable-next-line no-undef
      spyOn(console, 'error');

      component.dialogSettings = undefined;

      // eslint-disable-next-line no-undef
      expect(console.error).toHaveBeenCalledWith(
        'You try to use dd-select as multiple select, but not defined dialogSettings. Please define it.'
      );
    });
  });

  describe('Modal Management', () => {
    it('should show modal and trigger change detection', () => {
      component.isModalVisible = false;
      // Get the actual change detector from the component
      const componentChangeDetector = (
        component as unknown as { changeDetector: ChangeDetectorRef }
      ).changeDetector;

      spyOn(componentChangeDetector, 'detectChanges');

      component.showModal();

      expect(component.isModalVisible).toBe(true);
      expect(componentChangeDetector.detectChanges).toHaveBeenCalledWith();
    });

    it('should hide modal', () => {
      component.isModalVisible = true;

      component.hideModal();

      expect(component.isModalVisible).toBe(false);
    });
  });

  describe('Event Emission', () => {
    it('should emit selected event', () => {
      spyOn(component.selected, 'emit');
      const testEvent = { test: 'data' };

      component.selectedEmit(testEvent);

      expect(component.selected.emit).toHaveBeenCalledWith(testEvent);
    });

    it('should emit selectModel event', () => {
      spyOn(component.selectModel, 'emit');
      const testEvent = { test: 'data' };

      component.selectModelEmit(testEvent);

      expect(component.selectModel.emit).toHaveBeenCalledWith(testEvent);
    });
  });

  describe('selectModelEmit for multiple mode', () => {
    beforeEach(() => {
      component.mode = 'multiple';
      component.model = { tags: [] } as unknown as MockModel;
      component.field = 'tags';
    });

    it('should set is_selected to true on event', () => {
      const event: MockTagInterface = { id: 4, name: 'New Tag' };

      spyOn(component.selectModel, 'emit');

      component.selectModelEmit(event);

      expect(event.is_selected).toBe(true);
    });

    it('should add event to model field array', () => {
      const event = { id: 4, name: 'New Tag' };

      spyOn(component.selectModel, 'emit');

      component.selectModelEmit(event);

      expect(component.model[component.field]).toContain(event);
    });

    it('should emit selectModel event for multiple mode', () => {
      const event = { id: 4, name: 'New Tag' };

      spyOn(component.selectModel, 'emit');

      component.selectModelEmit(event);

      expect(component.selectModel.emit).toHaveBeenCalledWith(event);
    });
  });

  describe('selectModelEmit for single mode', () => {
    beforeEach(() => {
      component.mode = 'single';
      component.model = { tag_id: 0, tag: null } as unknown as MockModel;
      component.field = 'tag_id';
    });

    it('should set object and id for single mode', () => {
      const event = { id: 5, name: 'Single Tag' };

      spyOn(component.selectModel, 'emit');

      component.selectModelEmit(event);

      expect((component.model as unknown as MockModelWithSingleTagInterface).tag).toBe(event);
      expect((component.model as unknown as MockModelWithSingleTagInterface).tag_id).toBe(5);
      expect(component.selectModel.emit).toHaveBeenCalledWith(event);
    });
  });

  describe('deleteFromMultipleSelectedList', () => {
    beforeEach(() => {
      // Set up model with tags
      component.model = {
        tags: [mockTag1, mockTag2, mockTag3]
      } as unknown as MockModel;
      component.field = 'tags';

      // Set up dialog settings with selected elements
      component.dialogSettings = {
        ...mockDialogSettings,
        listOptions: {
          ...mockDialogSettings.listOptions,
          selectedElements: [mockTag1, mockTag2, mockTag3]
        }
      };
    });

    it('should remove item from model field array', () => {
      component.deleteFromMultipleSelectedList(mockTag2 as unknown as MockModel);

      expect(component.model[component.field]).toEqual([mockTag1, mockTag3]);
      expect(component.model[component.field]).not.toContain(mockTag2);
    });

    it('should remove item from dialog selectedElements', () => {
      component.deleteFromMultipleSelectedList(mockTag2 as unknown as MockModel);

      expect(component.dialogSettings.listOptions.selectedElements).toEqual([mockTag1, mockTag3]);
      expect(component.dialogSettings.listOptions.selectedElements).not.toContain(mockTag2);
    });

    it('should handle removing first item', () => {
      component.deleteFromMultipleSelectedList(mockTag1 as unknown as MockModel);

      expect(component.model[component.field]).toEqual([mockTag2, mockTag3]);
      expect(component.dialogSettings.listOptions.selectedElements).toEqual([mockTag2, mockTag3]);
    });

    it('should handle removing last item', () => {
      component.deleteFromMultipleSelectedList(mockTag3 as unknown as MockModel);

      expect(component.model[component.field]).toEqual([mockTag1, mockTag2]);
      expect(component.dialogSettings.listOptions.selectedElements).toEqual([mockTag1, mockTag2]);
    });

    it('should handle removing non-existent item gracefully', () => {
      const originalModelArray = [...component.model[component.field]];
      const originalDialogArray = [...component.dialogSettings.listOptions.selectedElements];
      const nonExistentItem = { id: 999, name: 'Non-existent' };

      component.deleteFromMultipleSelectedList(nonExistentItem as unknown as MockModel);

      expect(component.model[component.field]).toEqual(originalModelArray);
      expect(component.dialogSettings.listOptions.selectedElements).toEqual(originalDialogArray);
    });

    it('should handle empty arrays gracefully', () => {
      component.model[component.field] = [];
      component.dialogSettings.listOptions.selectedElements = [];

      component.deleteFromMultipleSelectedList(mockTag1 as unknown as MockModel);

      expect(component.model[component.field]).toEqual([]);
      expect(component.dialogSettings.listOptions.selectedElements).toEqual([]);
    });

    it('should only remove one occurrence of duplicate items', () => {
      // Add duplicate
      component.model[component.field] = [mockTag1, mockTag2, mockTag1];
      component.dialogSettings.listOptions.selectedElements = [mockTag1, mockTag2, mockTag1];

      component.deleteFromMultipleSelectedList(mockTag1 as unknown as MockModel);

      // Should remove only first occurrence
      expect(component.model[component.field]).toEqual([mockTag2, mockTag1]);
      expect(component.dialogSettings.listOptions.selectedElements).toEqual([mockTag2, mockTag1]);
    });
  });

  describe('Required Field Asterisk Display', () => {
    it('should show asterisk when required then hide after toggled off', () => {
      component.model = {
        tags: [],
        validationErrors: [],
        getObjectFieldName: () => 'tags'
      } as unknown as MockModel;
      component.field = 'tags';
      component.showLabel = true;
      component.labelText = 'Tags';
      component.isRequired = true;

      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;

      expect(label).toBeTruthy();
      expect(label.textContent).toContain('Tags:');
      expect(label.textContent).toContain('*');
      expect(fixture.nativeElement.querySelector('label span[aria-hidden="true"]')).toBeTruthy();

      component.isRequired = false; // triggers setter => markForCheck
      fixture.detectChanges();
      const labelAfter = fixture.nativeElement.querySelector('label') as HTMLLabelElement;

      expect(labelAfter).toBeTruthy();
      expect(labelAfter.textContent).toContain('Tags:');
      expect(fixture.nativeElement.querySelector('label span[aria-hidden="true"]')).toBeFalsy();
      expect(labelAfter.textContent).not.toMatch(/\*\s*$/); // no trailing asterisk
    });
  });

  describe('Utility Methods and Edge Cases', () => {
    it('should call markForCheck when isRequired setter invoked', () => {
      // Access private changeDetector through casting
      const cdRef = (component as unknown as { changeDetector: ChangeDetectorRef }).changeDetector;

      spyOn(cdRef, 'markForCheck');

      component.isRequired = true;
      component.isRequired = false;

      expect(cdRef.markForCheck).toHaveBeenCalledTimes(2);
    });

    it('should derive object field name by stripping _id suffix', () => {
      component.field = 'tag_id';

      expect(component.getObjectFieldName()).toBe('tag');
    });

    it('should return full field when no _id suffix present', () => {
      component.field = 'category';

      expect(component.getObjectFieldName()).toBe('category');
    });

    it('trackByFn should return item when provided', () => {
      const item = { id: 123 };

      expect(component.trackByFn(0, item)).toBe(item);
    });

    it('trackByFn should fallback to index when item is null/undefined', () => {
      expect(component.trackByFn(5, null)).toBe(5);
      expect(component.trackByFn(7, undefined)).toBe(7);
    });

    it('should expose selectedModelName based on underlying object field', () => {
      component.field = 'tag_id';
      component.text = 'name';
      component.model = {
        tag_id: 1,
        tag: { id: 1, name: 'Primary Tag' }
      } as unknown as MockModel;

      expect(component.selectedModelName).toBe('Primary Tag');
    });

    it('showModal should log error and not open when dialogSettings missing', () => {
      // eslint-disable-next-line no-undef
      spyOn(console, 'error');
      // Force internal dialog settings to undefined
      (
        component as unknown as { internalDialogSettings?: DialogContentWithOptionsInterface }
      ).internalDialogSettings = undefined; // access private for test
      component.isModalVisible = false;

      component.showModal();

      // eslint-disable-next-line no-undef
      expect(console.error).toHaveBeenCalledWith(
        'dialogSettings is not defined. Cannot show modal.'
      );

      expect(component.isModalVisible).toBe(false);
    });

    it('deleteFromMultipleSelectedList should not throw without dialogSettings', () => {
      component.model = { tags: [mockTag1] } as unknown as MockModel;
      component.field = 'tags';
      // Force internal dialog settings removal
      (
        component as unknown as { internalDialogSettings?: DialogContentWithOptionsInterface }
      ).internalDialogSettings = undefined; // access private for test

      expect(() =>
        component.deleteFromMultipleSelectedList(mockTag1 as unknown as MockModel)
      ).not.toThrow();
    });
  });
});
