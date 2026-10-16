import { Component, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { DialogContentWithOptionsInterface } from '../../../../models/dialog/content/dialog-content.interface';
import { DdataMultipleSelectDialogComponent } from './multiple-select-dialog.component';

interface TagInterface {
  id: number;
  name: string;
}

@Component({
  selector: 'dd-test-list',
  template: '<div class="test-list">{{ models.length }} items</div>',
  standalone: false
})
class TestListComponent {
  readonly saveModel = new EventEmitter<unknown>();
  readonly select = new EventEmitter<Array<unknown> | null>();
  selectedElements: Array<unknown> = [];
  models: Array<unknown> = [];
  multipleSelectEnabled: boolean;
  isSelectionList: boolean;
  loadData: boolean;
  filter: unknown;
  isModal = false;
  datasArrived = new BehaviorSubject<number>(0);
}

@Component({
  selector: 'dd-test-edit',
  template: '<div class="test-edit">edit</div>',
  standalone: false
})
class TestEditComponent {
  readonly saveModel = new EventEmitter<unknown>();
  readonly select = new EventEmitter<Array<unknown> | null>();
  model: unknown = null;
  selectedElements: Array<unknown> = [];
  isModal = false;
}

describe('DdataMultipleSelectDialogComponent', () => {
  let fixture: ComponentFixture<DdataMultipleSelectDialogComponent>;
  let component: DdataMultipleSelectDialogComponent;
  const tag1: TagInterface = { id: 1, name: 'First' };
  const tag2: TagInterface = { id: 2, name: 'Second' };
  const tag3: TagInterface = { id: 3, name: 'Third' };
  const createSettings = (
    models: Array<unknown> = [tag1, tag2, tag3]
  ): DialogContentWithOptionsInterface => ({
    listComponent: TestListComponent,
    listOptions: {
      multipleSelectEnabled: true,
      isSelectionList: true,
      loadData: false,
      models,
      selectedElements: [tag1]
    },
    createEditComponent: TestEditComponent,
    createEditOptions: { model: { id: 99 } } as never
  });
  const listInstance = (): TestListComponent =>
    fixture.debugElement.query((el) => el.componentInstance instanceof TestListComponent)
      ?.componentInstance as TestListComponent;
  const setup = (inputs: Partial<DdataMultipleSelectDialogComponent>): void => {
    fixture = TestBed.createComponent(DdataMultipleSelectDialogComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DdataMultipleSelectDialogComponent, TestListComponent, TestEditComponent]
    }).compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('defaults', () => {
    it('should have list method, multiple mode and default field names', () => {
      fixture = TestBed.createComponent(DdataMultipleSelectDialogComponent);
      component = fixture.componentInstance;

      expect(component.method).toBe('list');
      expect(component.mode).toBe('multiple');
      expect(component.field).toBe('id');
      expect(component.text).toBe('name');
      expect(component.valueField).toBe('id');
      expect(component.items).toEqual([]);
      expect(component.modalTitle).toBe('Dialog');
    });
  });

  describe('rendering', () => {
    it('should render the title and the list component with the preset models', () => {
      setup({
        settings: createSettings(),
        model: { tags: [tag2] } as never,
        field: 'tags',
        modalTitle: 'Pick tags'
      });
      const element: HTMLElement = fixture.nativeElement;

      expect(element.querySelector('.modal-title').textContent.trim()).toBe('Pick tags');
      const list = listInstance();

      expect(list.models).toEqual([tag1, tag2, tag3]);
      expect(list.multipleSelectEnabled).toBe(true);
      expect(list.isSelectionList).toBe(true);
      expect(list.isModal).toBe(true);
      expect(list.filter).toEqual({});
    });

    it('should render an empty list', () => {
      setup({ settings: createSettings([]), model: { tags: [] } as never, field: 'tags' });
      fixture.detectChanges();

      expect(listInstance().models).toEqual([]);
      expect(fixture.nativeElement.querySelector('.test-list').textContent).toBe('0 items');
    });

    it('should render a very long list', () => {
      const many = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Tag ${i}` }));

      setup({ settings: createSettings(many), model: { tags: [] } as never, field: 'tags' });
      fixture.detectChanges();

      expect(listInstance().models.length).toBe(1000);
      expect(fixture.nativeElement.querySelector('.test-list').textContent).toBe('1000 items');
    });

    it('should render the create-edit component with its model', () => {
      setup({
        settings: createSettings(),
        method: 'create-edit',
        model: { tags: [] } as never,
        field: 'tags'
      });
      const edit = fixture.debugElement.query(
        (el) => el.componentInstance instanceof TestEditComponent
      ).componentInstance as TestEditComponent;

      expect(edit.model).toEqual({ id: 99 });
      expect(edit.isModal).toBe(true);
      expect(listInstance()).toBeUndefined();
    });

    it('should log an error when no component can be rendered', () => {
      const error = vi.spyOn(console, 'error').mockReturnValue(undefined);

      fixture = TestBed.createComponent(DdataMultipleSelectDialogComponent);
      component = fixture.componentInstance;
      component.settings = createSettings();
      component.model = { tags: [] } as never;
      component.field = 'tags';
      // simulate a missing dialog host
      Object.defineProperty(component, 'dialogHost', {
        get: (): undefined => undefined,
        set: (): void => undefined
      });
      fixture.detectChanges();

      expect(error).toHaveBeenCalledWith('Component for dialog is not defined');
      expect(listInstance()).toBeUndefined();
    });
  });

  describe('multiple mode', () => {
    it('should preselect the models of the given field', () => {
      setup({ settings: createSettings(), model: { tags: [tag2, tag3] } as never, field: 'tags' });

      expect(listInstance().selectedElements).toEqual([tag2, tag3]);
    });

    it('should preselect nothing when the field is empty', () => {
      setup({ settings: createSettings(), model: { tags: null } as never, field: 'tags' });

      expect(listInstance().selectedElements).toEqual([]);
    });

    it('should emit every selected model and finish the selection on select', () => {
      const model = { tags: [tag1] };
      const settings = createSettings();

      setup({ settings, model: model as never, field: 'tags' });
      const selectModel = vi.fn();
      const selectionFinished = vi.fn();

      component.selectModel.subscribe(selectModel);
      component.selectionFinished.subscribe(selectionFinished);

      listInstance().select.emit([tag2, tag3]);

      expect(model.tags).toEqual([]);
      expect(settings.listOptions.selectedElements).toEqual([]);
      expect(selectModel).toHaveBeenCalledTimes(2);
      expect(selectModel).toHaveBeenNthCalledWith(1, tag2);
      expect(selectModel).toHaveBeenNthCalledWith(2, tag3);
      expect(selectionFinished).toHaveBeenCalledExactlyOnceWith([tag2, tag3]);
    });

    it('should clear the selection when an empty selection is emitted', () => {
      const model = { tags: [tag1, tag2] };

      setup({ settings: createSettings(), model: model as never, field: 'tags' });
      const selectModel = vi.fn();
      const selectionFinished = vi.fn();

      component.selectModel.subscribe(selectModel);
      component.selectionFinished.subscribe(selectionFinished);

      listInstance().select.emit([]);

      expect(model.tags).toEqual([]);
      expect(selectModel).not.toHaveBeenCalled();
      expect(selectionFinished).toHaveBeenCalledExactlyOnceWith([]);
    });

    it('should not emit anything when the selection is null', () => {
      setup({ settings: createSettings(), model: { tags: [tag1] } as never, field: 'tags' });
      const selectionFinished = vi.fn();

      component.selectionFinished.subscribe(selectionFinished);

      listInstance().select.emit(null);

      expect(selectionFinished).not.toHaveBeenCalled();
    });

    it('should ignore saved models of the edit component', () => {
      setup({ settings: createSettings(), model: { tags: [tag1] } as never, field: 'tags' });
      const selectionFinished = vi.fn();

      component.selectionFinished.subscribe(selectionFinished);

      expect(() => listInstance().saveModel.emit({ id: 4 })).not.toThrow();
      expect(selectionFinished).not.toHaveBeenCalled();
    });
  });

  describe('single mode', () => {
    it('should preselect the related object of an `_id` field', () => {
      setup({
        settings: createSettings(),
        mode: 'single',
        model: { tag_id: 2, tag: tag2 } as never,
        field: 'tag_id'
      });

      expect(listInstance().selectedElements).toEqual([tag2]);
    });

    it('should not preselect a plain (non object) value', () => {
      setup({
        settings: createSettings(),
        mode: 'single',
        model: { tag: 2 } as never,
        field: 'tag'
      });

      expect(listInstance().selectedElements).toEqual([]);
    });

    it('should not preselect a missing related object', () => {
      setup({
        settings: createSettings(),
        mode: 'single',
        model: { tag_id: 5, tag: null } as never,
        field: 'tag_id'
      });

      expect(listInstance().selectedElements).toEqual([]);
    });

    it('should keep the model field and the settings on select', () => {
      const model = { tag_id: 1, tag: tag1 };
      const settings = createSettings();

      setup({ settings, mode: 'single', model: model as never, field: 'tag_id' });
      const selectModel = vi.fn();

      component.selectModel.subscribe(selectModel);

      listInstance().select.emit([tag3]);

      expect(model.tag_id).toBe(1);
      expect(settings.listOptions.selectedElements).toEqual([tag1]);
      expect(selectModel).toHaveBeenCalledExactlyOnceWith(tag3);
    });
  });

  describe('closing', () => {
    it('should cancel the selection without emitting models when the close button is clicked', () => {
      const model = { tags: [tag1, tag2] };

      setup({ settings: createSettings(), model: model as never, field: 'tags' });
      const selectModel = vi.fn();
      const selectionFinished = vi.fn();

      component.selectModel.subscribe(selectModel);
      component.selectionFinished.subscribe(selectionFinished);
      listInstance().selectedElements = [tag1, tag2, tag3];
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.close');

      expect(button.getAttribute('aria-label')).toBe('Bezárás');

      button.click();

      expect(selectModel).not.toHaveBeenCalled();
      expect(selectionFinished).toHaveBeenCalledExactlyOnceWith(undefined);
      expect(listInstance().selectedElements).toEqual([]);
      expect(model.tags).toEqual([tag1, tag2]);
    });

    it('should not duplicate the previously selected items when the close button is clicked', () => {
      const model = { tags: [tag1, tag2] };

      setup({ settings: createSettings(), model: model as never, field: 'tags' });
      // the same push the parent dd-select does on every emitted model in multiple mode
      component.selectModel.subscribe((selected: unknown) =>
        model.tags.push(selected as TagInterface)
      );

      component.hideModal();

      expect(model.tags).toEqual([tag1, tag2]);
    });

    it('should finish without a selection when nothing is selected', () => {
      setup({ settings: createSettings(), model: { tags: [] } as never, field: 'tags' });
      const selectionFinished = vi.fn();

      component.selectionFinished.subscribe(selectionFinished);
      component.hideModal();

      expect(selectionFinished).toHaveBeenCalledExactlyOnceWith(undefined);
    });

    it('should cancel the selection (without emitted models) on escape', () => {
      setup({ settings: createSettings(), model: { tags: [tag1] } as never, field: 'tags' });
      const selectModel = vi.fn();
      const selectionFinished = vi.fn();

      component.selectModel.subscribe(selectModel);
      component.selectionFinished.subscribe(selectionFinished);

      listInstance().selectedElements = [tag1, tag2];

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(selectionFinished).toHaveBeenCalledExactlyOnceWith(undefined);
      expect(selectModel).not.toHaveBeenCalled();
      expect(listInstance().selectedElements).toEqual([]);
    });

    it('should not react to other keys', () => {
      setup({ settings: createSettings(), model: { tags: [tag1] } as never, field: 'tags' });
      const selectionFinished = vi.fn();

      component.selectionFinished.subscribe(selectionFinished);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(selectionFinished).not.toHaveBeenCalled();
    });
  });
});
