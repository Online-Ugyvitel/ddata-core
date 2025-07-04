import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { DdataMultipleSelectComponent } from './multiple-select.component';
import { DialogContentWithOptionsInterface } from '../../../models/dialog/content/dialog-content.interface';

describe('DdataMultipleSelectComponent', () => {
  let component: DdataMultipleSelectComponent;
  let fixture: ComponentFixture<DdataMultipleSelectComponent>;
  let changeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  // Mock objects for testing
  const mockTag1 = { id: 1, name: 'Test Tag 1' };
  const mockTag2 = { id: 2, name: 'Test Tag 2' };
  const mockTag3 = { id: 3, name: 'Test Tag 3' };
  const mockTags = [mockTag1, mockTag2, mockTag3];

  const mockModel = {
    tags: [mockTag1, mockTag2],
    getObjectFieldName: () => 'tags'
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
    const changeDetectorSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      declarations: [DdataMultipleSelectComponent],
      providers: [
        { provide: ChangeDetectorRef, useValue: changeDetectorSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DdataMultipleSelectComponent);
    component = fixture.componentInstance;
    changeDetectorRef = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;

    // Set up component with mock data
    component.model = mockModel as any;
    component.field = 'tags';
    component.mode = 'multiple';
    component.dialogSettings = mockDialogSettings;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values for inputs', () => {
      const newComponent = new DdataMultipleSelectComponent(changeDetectorRef);
      
      expect(newComponent.wrapperClass).toBe('d-flex flex-wrap');
      expect(newComponent.inputBlockClass).toBe('col-12 d-flex px-0');
      expect(newComponent.inputBlockExtraClass).toBe('col-md-9');
      expect(newComponent.unselectedText).toBe('Válassz');
      expect(newComponent.mode).toBe('multiple');
      expect(newComponent.isRequire).toBe(false);
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
      
      const newComponent = new DdataMultipleSelectComponent(changeDetectorRef);
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
      
      expect(component._dialogSettings).toBe(settings);
    });

    it('should log error when null value is provided', () => {
      spyOn(console, 'error');
      
      component.dialogSettings = null;
      
      expect(console.error).toHaveBeenCalledWith(
        'You try to use dd-select as multiple select, but not defined dialogSettings. Please define it.'
      );
    });

    it('should log error when undefined value is provided', () => {
      spyOn(console, 'error');
      
      component.dialogSettings = undefined;
      
      expect(console.error).toHaveBeenCalledWith(
        'You try to use dd-select as multiple select, but not defined dialogSettings. Please define it.'
      );
    });
  });

  describe('Modal Management', () => {
    it('should show modal and trigger change detection', () => {
      component.isModalVisible = false;
      
      component.showModal('list');
      
      expect(component.isModalVisible).toBe(true);
      expect(changeDetectorRef.detectChanges).toHaveBeenCalled();
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
      component.model = { tags: [] } as any;
      component.field = 'tags';
    });

    it('should set is_selected to true on event', () => {
      const event = { id: 4, name: 'New Tag' };
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

    it('should emit selectModel event', () => {
      const event = { id: 4, name: 'New Tag' };
      spyOn(component.selectModel, 'emit');
      
      component.selectModelEmit(event);
      
      expect(component.selectModel.emit).toHaveBeenCalledWith(event);
    });
  });

  describe('selectModelEmit for single mode', () => {
    beforeEach(() => {
      component.mode = 'single';
      component.model = { tag_id: 0, tag: null } as any;
      component.field = 'tag_id';
    });

    it('should set object and id for single mode', () => {
      const event = { id: 5, name: 'Single Tag' };
      spyOn(component.selectModel, 'emit');
      
      component.selectModelEmit(event);
      
      expect(component.model.tag).toBe(event);
      expect(component.model.tag_id).toBe(5);
      expect(component.selectModel.emit).toHaveBeenCalledWith(event);
    });
  });

  describe('deleteFromMultipleSelectedList', () => {
    beforeEach(() => {
      // Set up model with tags
      component.model = {
        tags: [mockTag1, mockTag2, mockTag3]
      } as any;
      component.field = 'tags';
      
      // Set up dialog settings with selected elements
      component._dialogSettings = {
        ...mockDialogSettings,
        listOptions: {
          ...mockDialogSettings.listOptions,
          selectedElements: [mockTag1, mockTag2, mockTag3]
        }
      };
    });

    it('should remove item from model field array', () => {
      component.deleteFromMultipleSelectedList(mockTag2);
      
      expect(component.model[component.field]).toEqual([mockTag1, mockTag3]);
      expect(component.model[component.field]).not.toContain(mockTag2);
    });

    it('should remove item from dialog selectedElements', () => {
      component.deleteFromMultipleSelectedList(mockTag2);
      
      expect(component._dialogSettings.listOptions.selectedElements).toEqual([mockTag1, mockTag3]);
      expect(component._dialogSettings.listOptions.selectedElements).not.toContain(mockTag2);
    });

    it('should handle removing first item', () => {
      component.deleteFromMultipleSelectedList(mockTag1);
      
      expect(component.model[component.field]).toEqual([mockTag2, mockTag3]);
      expect(component._dialogSettings.listOptions.selectedElements).toEqual([mockTag2, mockTag3]);
    });

    it('should handle removing last item', () => {
      component.deleteFromMultipleSelectedList(mockTag3);
      
      expect(component.model[component.field]).toEqual([mockTag1, mockTag2]);
      expect(component._dialogSettings.listOptions.selectedElements).toEqual([mockTag1, mockTag2]);
    });

    it('should handle removing non-existent item gracefully', () => {
      const originalModelArray = [...component.model[component.field]];
      const originalDialogArray = [...component._dialogSettings.listOptions.selectedElements];
      const nonExistentItem = { id: 999, name: 'Non-existent' };
      
      component.deleteFromMultipleSelectedList(nonExistentItem);
      
      expect(component.model[component.field]).toEqual(originalModelArray);
      expect(component._dialogSettings.listOptions.selectedElements).toEqual(originalDialogArray);
    });

    it('should handle empty arrays gracefully', () => {
      component.model[component.field] = [];
      component._dialogSettings.listOptions.selectedElements = [];
      
      component.deleteFromMultipleSelectedList(mockTag1);
      
      expect(component.model[component.field]).toEqual([]);
      expect(component._dialogSettings.listOptions.selectedElements).toEqual([]);
    });

    it('should only remove one occurrence of duplicate items', () => {
      // Add duplicate
      component.model[component.field] = [mockTag1, mockTag2, mockTag1];
      component._dialogSettings.listOptions.selectedElements = [mockTag1, mockTag2, mockTag1];
      
      component.deleteFromMultipleSelectedList(mockTag1);
      
      // Should remove only first occurrence
      expect(component.model[component.field]).toEqual([mockTag2, mockTag1]);
      expect(component._dialogSettings.listOptions.selectedElements).toEqual([mockTag2, mockTag1]);
    });
  });

  describe('getObjectFieldName', () => {
    it('should return field name without _id suffix', () => {
      component.field = 'tag_id';
      expect(component.getObjectFieldName()).toBe('tag');
    });

    it('should return same field name if no _id suffix', () => {
      component.field = 'tags';
      expect(component.getObjectFieldName()).toBe('tags');
    });

    it('should handle multiple _id occurrences correctly', () => {
      component.field = 'related_tag_id';
      expect(component.getObjectFieldName()).toBe('related_tag');
    });

    it('should handle empty field', () => {
      component.field = '';
      expect(component.getObjectFieldName()).toBe('');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null model gracefully', () => {
      component.model = null;
      
      expect(() => component.deleteFromMultipleSelectedList(mockTag1)).not.toThrow();
    });

    it('should handle missing field in model', () => {
      component.model = {} as any;
      component.field = 'nonexistent';
      
      expect(() => component.deleteFromMultipleSelectedList(mockTag1)).not.toThrow();
    });

    it('should handle null dialog settings', () => {
      component._dialogSettings = null;
      
      expect(() => component.deleteFromMultipleSelectedList(mockTag1)).not.toThrow();
    });

    it('should handle missing selectedElements in dialog settings', () => {
      component._dialogSettings = {
        createEditComponent: null,
        listComponent: null,
        listOptions: {} as any
      };
      
      expect(() => component.deleteFromMultipleSelectedList(mockTag1)).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should add and then remove items correctly', () => {
      // Start with empty arrays
      component.model = { tags: [] } as any;
      component.field = 'tags';
      component._dialogSettings.listOptions.selectedElements = [];
      
      // Add items
      component.selectModelEmit(mockTag1);
      component.selectModelEmit(mockTag2);
      
      expect(component.model.tags).toEqual([mockTag1, mockTag2]);
      
      // Remove one item
      component._dialogSettings.listOptions.selectedElements = [mockTag1, mockTag2];
      component.deleteFromMultipleSelectedList(mockTag1);
      
      expect(component.model.tags).toEqual([mockTag2]);
      expect(component._dialogSettings.listOptions.selectedElements).toEqual([mockTag2]);
    });

    it('should handle complex workflow with multiple operations', () => {
      component.model = { tags: [] } as any;
      component.field = 'tags';
      component._dialogSettings.listOptions.selectedElements = [];
      
      // Add multiple items
      [mockTag1, mockTag2, mockTag3].forEach(tag => {
        component.selectModelEmit(tag);
        component._dialogSettings.listOptions.selectedElements.push(tag);
      });
      
      expect(component.model.tags).toHaveLength(3);
      expect(component._dialogSettings.listOptions.selectedElements).toHaveLength(3);
      
      // Remove middle item
      component.deleteFromMultipleSelectedList(mockTag2);
      
      expect(component.model.tags).toEqual([mockTag1, mockTag3]);
      expect(component._dialogSettings.listOptions.selectedElements).toEqual([mockTag1, mockTag3]);
      
      // Remove remaining items
      component.deleteFromMultipleSelectedList(mockTag1);
      component.deleteFromMultipleSelectedList(mockTag3);
      
      expect(component.model.tags).toEqual([]);
      expect(component._dialogSettings.listOptions.selectedElements).toEqual([]);
    });
  });
});