import 'zone.js/testing';
import { Component, Inject, Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { BehaviorSubject, of } from 'rxjs';
import { BaseModel, BaseModelInterface } from '../../models/base/base-model.model';
import { SelectableInterface } from '../../models/selectable/selectable.interface';
import { SelectableListComponent } from './selectable-list.component';
import { DdataCoreModule } from '../../ddata-core.module';
import { HelperServiceInterface } from '../../services/helper/helper-service.interface';
import { HelperFactoryService } from '../../services/helper/helper-service.factory';
import { ActivatedRoute } from '@angular/router';
import { ID } from '../../models/base/base-data.type';

// Test model that implements both BaseModelInterface and SelectableInterface
class TestModel extends BaseModel implements SelectableInterface {
  id: ID = 0 as ID;
  is_selected: boolean = false;
  api_endpoint = '/test';
  model_name = 'TestModel';

  init(data: any = {}): TestModel {
    this.id = (data.id || 0) as ID;
    this.is_selected = data.is_selected || false;
    return this;
  }

  prepareToSave(): any {
    return {
      id: this.id,
      is_selected: this.is_selected
    };
  }
}

// Mock HelperService for testing
class MockHelperService {
  getAll = jasmine.createSpy('getAll').and.returnValue(of({ data: [], total: 0 }));
  search = jasmine.createSpy('search').and.returnValue(of({ data: [], total: 0 }));
  booleanChange = jasmine.createSpy('booleanChange').and.returnValue(of(true));
  edit = jasmine.createSpy('edit');
  delete = jasmine.createSpy('delete').and.returnValue(of(true));
  deleteMultiple = jasmine.createSpy('deleteMultiple').and.returnValue(of(true));
  save = jasmine.createSpy('save').and.returnValue(of({}));
  saveAsNew = jasmine.createSpy('saveAsNew').and.returnValue(of({}));
  stepBack = jasmine.createSpy('stepBack');
  changeToPage = jasmine.createSpy('changeToPage').and.returnValue(of({}));
  getOne = jasmine.createSpy('getOne').and.returnValue(of({}));
  searchWithoutPaginate = jasmine.createSpy('searchWithoutPaginate').and.returnValue(of([]));
}

// Concrete implementation of SelectableListComponent for testing
@Component({
  template: '<div></div>',
  standalone: false
})
class TestSelectableListComponent extends SelectableListComponent<TestModel> {
  constructor(@Inject('type') type: new () => TestModel) {
    super(type);
  }
}

describe('SelectableListComponent', () => {
  let component: TestSelectableListComponent;
  let fixture: ComponentFixture<TestSelectableListComponent>;
  let testModel1: TestModel;
  let testModel2: TestModel;
  let testModel3: TestModel;
  let mockHelperService: MockHelperService;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(), {
        teardown: { destroyAfterEach: false }
      }
    );
  });

  beforeEach(async () => {
    mockHelperService = new MockHelperService();
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

    await TestBed.configureTestingModule({
      declarations: [TestSelectableListComponent],
      providers: [
        Injector,
        { provide: 'type', useValue: TestModel },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    // Mock DdataCoreModule.InjectorInstance
    DdataCoreModule.InjectorInstance = {
      get: jasmine.createSpy('get').and.callFake((token: any) => {
        if (token === ActivatedRoute) return mockActivatedRoute;
        return mockHelperService;
      })
    } as any;

    // Mock HelperFactoryService
    spyOn(HelperFactoryService.prototype, 'get').and.returnValue(mockHelperService);
    
    fixture = TestBed.createComponent(TestSelectableListComponent);
    component = fixture.componentInstance;

    // Create test models
    testModel1 = new TestModel().init({ id: 1, is_selected: false });
    testModel2 = new TestModel().init({ id: 2, is_selected: false });
    testModel3 = new TestModel().init({ id: 3, is_selected: false });

    // Initialize component models array
    component.models = [testModel1, testModel2, testModel3];
    component.loadData = false; // Prevent automatic loading in tests
  });

  afterEach(() => {
    if (fixture && fixture.nativeElement && fixture.nativeElement.parentNode) {
      fixture.nativeElement.parentNode.removeChild(fixture.nativeElement);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extend BaseListComponent', () => {
    expect(component instanceof SelectableListComponent).toBe(true);
    // Should have inherited properties from BaseListComponent
    expect(component.models).toBeDefined();
    expect(component.filter).toBeDefined();
    expect(component.editModel).toBeDefined();
    expect(component.deleteModel).toBeDefined();
  });

  it('should implement SelectableListComponentInterface', () => {
    // Verify all interface properties and methods exist
    expect(component.isModal).toBeDefined();
    expect(component.multipleSelectEnabled).toBeDefined();
    expect(component.isSelectionList).toBeDefined();
    expect(component.loadData).toBeDefined();
    expect(component.selectedElements).toBeDefined();
    expect(component.removeSelection).toBeDefined();
    expect(component.setSelection).toBeDefined();
    expect(component.emitSelected).toBeDefined();
    expect(component.datasArrived).toBeDefined();
    expect(component.select).toBeDefined();
    expect(typeof component.toggleSelect).toBe('function');
    expect(typeof component.chooseSelect).toBe('function');
  });

  describe('Properties initialization', () => {
    it('should initialize with default values', () => {
      expect(component._selectedElements).toEqual(new Set([]));
      expect(component.isModal).toBe(true);
      expect(component.multipleSelectEnabled).toBe(true);
      expect(component.isSelectionList).toBe(true);
      expect(component.loadData).toBe(false);
      expect(component.selectedElements).toEqual([]);
    });

    it('should initialize BehaviorSubjects', () => {
      expect(component.datasArrived).toBeInstanceOf(BehaviorSubject);
      expect(component.select).toBeInstanceOf(BehaviorSubject);
      expect(component.datasArrived.value).toBe(0);
      expect(component.select.value).toBe(null);
    });

    it('should initialize EventEmitters', () => {
      expect(component.removeSelection).toBeDefined();
      expect(component.setSelection).toBeDefined();
      expect(component.emitSelected).toBeDefined();
    });
  });

  describe('selectedElements setter and getter', () => {
    it('should set selectedElements correctly with empty array', () => {
      component.selectedElements = [];
      
      expect(component._selectedElements.size).toBe(0);
      expect(component.selectedElements).toEqual([]);
      expect(testModel1.is_selected).toBe(false);
      expect(testModel2.is_selected).toBe(false);
      expect(testModel3.is_selected).toBe(false);
    });

    it('should set selectedElements correctly with valid models', () => {
      component.selectedElements = [testModel1, testModel3];
      
      expect(component._selectedElements.size).toBe(2);
      expect(component.selectedElements).toEqual([testModel1, testModel3]);
      expect(testModel1.is_selected).toBe(true);
      expect(testModel2.is_selected).toBe(false);
      expect(testModel3.is_selected).toBe(true);
    });

    it('should reset all models is_selected to false before setting new selection', () => {
      // First set some models as selected
      testModel1.is_selected = true;
      testModel2.is_selected = true;
      
      // Then set different selection
      component.selectedElements = [testModel3];
      
      expect(testModel1.is_selected).toBe(false);
      expect(testModel2.is_selected).toBe(false);
      expect(testModel3.is_selected).toBe(true);
    });

    it('should handle selectedElements with models not in current models array', () => {
      const externalModel = new TestModel().init({ id: 99, is_selected: false });
      
      component.selectedElements = [testModel1, externalModel];
      
      expect(component._selectedElements.size).toBe(2);
      expect(testModel1.is_selected).toBe(true);
      expect(externalModel.is_selected).toBe(false); // Not in models array, so not updated
    });

    it('should handle null/undefined values in selectedElements', () => {
      // This tests the !!value.length check in the setter
      component.selectedElements = null as any;
      expect(component._selectedElements.size).toBe(0);
      expect(component.selectedElements).toEqual([]);
    });

    it('should return array from Set when getting selectedElements', () => {
      component._selectedElements.add(testModel1);
      component._selectedElements.add(testModel2);
      
      const result = component.selectedElements;
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain(testModel1);
      expect(result).toContain(testModel2);
    });
  });

  describe('toggleSelect method', () => {
    it('should add model to selection when not already selected', () => {
      spyOn(component.setSelection, 'emit');
      
      component.toggleSelect(testModel1);
      
      expect(component._selectedElements.has(testModel1)).toBe(true);
      expect(component.setSelection.emit).toHaveBeenCalledWith([testModel1]);
    });

    it('should remove model from selection when already selected', () => {
      // First add the model to selection
      component._selectedElements.add(testModel1);
      spyOn(component.removeSelection, 'emit');
      
      component.toggleSelect(testModel1);
      
      expect(component._selectedElements.has(testModel1)).toBe(false);
      expect(component.removeSelection.emit).toHaveBeenCalledWith([]);
    });

    it('should emit correct array when removing from multiple selected items', () => {
      // Add multiple items to selection
      component._selectedElements.add(testModel1);
      component._selectedElements.add(testModel2);
      spyOn(component.removeSelection, 'emit');
      
      component.toggleSelect(testModel1);
      
      expect(component._selectedElements.has(testModel1)).toBe(false);
      expect(component._selectedElements.has(testModel2)).toBe(true);
      expect(component.removeSelection.emit).toHaveBeenCalledWith([testModel2]);
    });

    it('should emit correct array when adding to existing selection', () => {
      // Add one item to selection
      component._selectedElements.add(testModel1);
      spyOn(component.setSelection, 'emit');
      
      component.toggleSelect(testModel2);
      
      expect(component._selectedElements.has(testModel2)).toBe(true);
      expect(component.setSelection.emit).toHaveBeenCalledWith(jasmine.arrayContaining([testModel1, testModel2]));
    });

    it('should handle the same model being toggled multiple times', () => {
      spyOn(component.setSelection, 'emit');
      spyOn(component.removeSelection, 'emit');
      
      // Toggle to add
      component.toggleSelect(testModel1);
      expect(component._selectedElements.has(testModel1)).toBe(true);
      expect(component.setSelection.emit).toHaveBeenCalledWith([testModel1]);
      
      // Toggle to remove
      component.toggleSelect(testModel1);
      expect(component._selectedElements.has(testModel1)).toBe(false);
      expect(component.removeSelection.emit).toHaveBeenCalledWith([]);
      
      // Toggle to add again
      component.toggleSelect(testModel1);
      expect(component._selectedElements.has(testModel1)).toBe(true);
      expect(component.setSelection.emit).toHaveBeenCalledWith([testModel1]);
    });
  });

  describe('chooseSelect method', () => {
    it('should emit empty array when no elements are selected', () => {
      spyOn(component.select, 'next');
      spyOn(component.emitSelected, 'emit');
      
      component.chooseSelect();
      
      expect(component.select.next).toHaveBeenCalledWith([]);
      expect(component.emitSelected.emit).toHaveBeenCalledWith([]);
    });

    it('should emit selected elements array when elements are selected', () => {
      component._selectedElements.add(testModel1);
      component._selectedElements.add(testModel3);
      spyOn(component.select, 'next');
      spyOn(component.emitSelected, 'emit');
      
      component.chooseSelect();
      
      expect(component.select.next).toHaveBeenCalledWith(jasmine.arrayContaining([testModel1, testModel3]));
      expect(component.emitSelected.emit).toHaveBeenCalledWith(jasmine.arrayContaining([testModel1, testModel3]));
    });

    it('should emit the same array to both select BehaviorSubject and emitSelected EventEmitter', () => {
      component._selectedElements.add(testModel2);
      spyOn(component.select, 'next');
      spyOn(component.emitSelected, 'emit');
      
      component.chooseSelect();
      
      const expectedArray = [testModel2];
      expect(component.select.next).toHaveBeenCalledWith(expectedArray);
      expect(component.emitSelected.emit).toHaveBeenCalledWith(expectedArray);
    });
  });

  describe('Input properties', () => {
    it('should accept isModal input', () => {
      component.isModal = false;
      expect(component.isModal).toBe(false);
    });

    it('should accept multipleSelectEnabled input', () => {
      component.multipleSelectEnabled = false;
      expect(component.multipleSelectEnabled).toBe(false);
    });

    it('should accept isSelectionList input', () => {
      component.isSelectionList = false;
      expect(component.isSelectionList).toBe(false);
    });

    it('should accept loadData input', () => {
      component.loadData = true;
      expect(component.loadData).toBe(true);
    });
  });

  describe('Integration tests', () => {
    it('should handle complete workflow: set selection, toggle, choose', () => {
      spyOn(component.setSelection, 'emit');
      spyOn(component.removeSelection, 'emit');
      spyOn(component.emitSelected, 'emit');
      spyOn(component.select, 'next');
      
      // Set initial selection
      component.selectedElements = [testModel1];
      expect(testModel1.is_selected).toBe(true);
      
      // Add another model via toggle
      component.toggleSelect(testModel2);
      expect(component.setSelection.emit).toHaveBeenCalledWith(jasmine.arrayContaining([testModel1, testModel2]));
      
      // Remove a model via toggle
      component.toggleSelect(testModel1);
      expect(component.removeSelection.emit).toHaveBeenCalledWith([testModel2]);
      
      // Choose final selection
      component.chooseSelect();
      expect(component.emitSelected.emit).toHaveBeenCalledWith([testModel2]);
      expect(component.select.next).toHaveBeenCalledWith([testModel2]);
    });

    it('should maintain consistency between _selectedElements Set and selectedElements getter', () => {
      component.selectedElements = [testModel1, testModel2];
      
      // Verify Set content matches getter
      expect(component._selectedElements.size).toBe(2);
      expect(component.selectedElements.length).toBe(2);
      expect(component._selectedElements.has(testModel1)).toBe(true);
      expect(component._selectedElements.has(testModel2)).toBe(true);
      
      // Toggle one off
      component.toggleSelect(testModel1);
      expect(component._selectedElements.size).toBe(1);
      expect(component.selectedElements.length).toBe(1);
      expect(component._selectedElements.has(testModel1)).toBe(false);
      expect(component._selectedElements.has(testModel2)).toBe(true);
    });
  });

  describe('Edge cases and error scenarios', () => {
    it('should handle models array being modified during selection', () => {
      component.selectedElements = [testModel1, testModel2];
      
      // Remove a model from the models array
      component.models = [testModel1, testModel3];
      
      // Set selection again - should handle missing model gracefully
      component.selectedElements = [testModel2]; // testModel2 no longer in models array
      
      expect(component._selectedElements.has(testModel2)).toBe(true);
      expect(testModel2.is_selected).toBe(false); // Not updated since not in models array
    });

    it('should handle empty models array', () => {
      component.models = [];
      
      // Should not throw error
      expect(() => {
        component.selectedElements = [testModel1];
      }).not.toThrow();
      
      expect(component._selectedElements.has(testModel1)).toBe(true);
    });

    it('should handle selectedElements with duplicate models', () => {
      component.selectedElements = [testModel1, testModel1, testModel2];
      
      // Set should deduplicate automatically
      expect(component._selectedElements.size).toBe(2);
      expect(component.selectedElements.length).toBe(2);
    });

    it('should handle selectedElements with null/undefined items in array', () => {
      // This tests forEach loop handling null items
      const arrayWithNulls = [testModel1, null, testModel2, undefined] as any[];
      
      expect(() => {
        component.selectedElements = arrayWithNulls;
      }).not.toThrow();
      
      // Should still add the valid models to the set
      expect(component._selectedElements.size).toBe(4); // Set includes null/undefined
      expect(testModel1.is_selected).toBe(true);
      expect(testModel2.is_selected).toBe(true);
    });

    it('should handle selectedElements with items having no id property', () => {
      const itemWithoutId = { is_selected: false } as any;
      
      expect(() => {
        component.selectedElements = [testModel1, itemWithoutId];
      }).not.toThrow();
      
      expect(component._selectedElements.size).toBe(2);
      expect(testModel1.is_selected).toBe(true);
    });

    it('should handle selectedElements with string ids matching numeric ids', () => {
      // Tests the == comparison (not ===) in line 26
      const modelWithStringId = { id: '1', is_selected: false } as any;
      
      component.selectedElements = [modelWithStringId];
      
      // Should match testModel1 (id: 1) due to == comparison
      expect(testModel1.is_selected).toBe(true);
      expect(component._selectedElements.has(modelWithStringId)).toBe(true);
    });

    it('should handle selectedElements with complex id types', () => {
      // Test edge case where ids are objects or other types
      const modelWithObjectId = { id: { value: 1 }, is_selected: false } as any;
      
      expect(() => {
        component.selectedElements = [modelWithObjectId];
      }).not.toThrow();
      
      // Should not match any existing model
      expect(testModel1.is_selected).toBe(false);
      expect(testModel2.is_selected).toBe(false);
      expect(testModel3.is_selected).toBe(false);
    });

    it('should reset is_selected to false for all models even when setting empty array', () => {
      // First set some models as selected
      testModel1.is_selected = true;
      testModel2.is_selected = true;
      testModel3.is_selected = true;
      
      // Set empty array - should still reset all
      component.selectedElements = [];
      
      expect(testModel1.is_selected).toBe(false);
      expect(testModel2.is_selected).toBe(false);
      expect(testModel3.is_selected).toBe(false);
    });

    it('should handle BehaviorSubject initial values correctly', () => {
      // Test that datasArrived starts with 0
      expect(component.datasArrived.value).toBe(0);
      
      // Test that select starts with null
      expect(component.select.value).toBe(null);
    });

    it('should maintain Set properties when toggling same model multiple times rapidly', () => {
      // Rapid toggle sequence
      component.toggleSelect(testModel1);
      expect(component._selectedElements.has(testModel1)).toBe(true);
      
      component.toggleSelect(testModel1);
      expect(component._selectedElements.has(testModel1)).toBe(false);
      
      component.toggleSelect(testModel1);
      expect(component._selectedElements.has(testModel1)).toBe(true);
      
      component.toggleSelect(testModel1);
      expect(component._selectedElements.has(testModel1)).toBe(false);
      
      // Final state should be empty
      expect(component._selectedElements.size).toBe(0);
    });
  });
});