import { ChangeDetectorRef, ComponentRef, Type, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DialogContentInterface } from '../../models/dialog/content/dialog-content.interface';
import { ComponentRendererService } from './component-renderer.service';

class DummyComponent {
  readonly name = 'dummy';
}

describe('ComponentRendererService', () => {
  let service: ComponentRendererService;
  let changeDetector: any;
  let dialogHost: any;
  let instance: Record<string, unknown>;
  const createComponentRef = (value: unknown): ComponentRef<DialogContentInterface> =>
    ({ instance: value }) as unknown as ComponentRef<DialogContentInterface>;

  beforeEach(() => {
    changeDetector = {
      detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges')
    };
    dialogHost = {
      clear: vi.fn().mockName('ViewContainerRef.clear'),
      createComponent: vi.fn().mockName('ViewContainerRef.createComponent')
    };
    instance = { model: null, datasArrived: new BehaviorSubject<number>(0) };
    dialogHost.createComponent.mockReturnValue(createComponentRef(instance));
    service = new ComponentRendererService(changeDetector);
    vi.spyOn(console, 'error').mockReturnValue(undefined);
  });

  it('should be created with the list method', () => {
    expect(service).toBeTruthy();
    expect(service.method).toBe('list');
  });

  it('should set the method, the settings, the dialog host and the component ref', () => {
    const settings = { listComponent: DummyComponent as Type<unknown> };
    const componentRef = createComponentRef(instance);

    expect(service.setMethod('create-edit')).toBe(service);
    expect(service.setSettings(settings)).toBe(service);
    expect(service.setDialogHost(dialogHost)).toBe(service);
    expect(service.setComponentRef(componentRef)).toBe(service);
    expect(service.method).toBe('create-edit');
    expect(service.settings).toBe(settings);
    expect(service.dialogHost).toBe(dialogHost);
    expect(service.componentRef).toBe(componentRef);
  });

  it('should default to the list method', () => {
    service.setMethod('create-edit').setMethod();

    expect(service.method).toBe('list');
  });

  it('should log an error when the dialog host is missing', () => {
    expect(service.setDialogHost(null)).toBe(service);
    expect(console.error).toHaveBeenCalledWith(
      `DialogHost can't be undefined. DialogHost is not set.`
    );

    expect(service.dialogHost).toBeUndefined();
  });

  describe('render', () => {
    it('should log an error and return nothing when the dialog host is not set', () => {
      expect(service.render()).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('dialogHost is not set');
    });

    it('should render the create-edit component with its model', () => {
      const model = { id: 1 };

      service
        .setDialogHost(dialogHost)
        .setMethod('create-edit')
        .setSettings({
          createEditComponent: DummyComponent,
          createEditOptions: { model } as never
        });
      const result = service.render();

      expect(dialogHost.clear).toHaveBeenCalled();
      expect(dialogHost.createComponent).toHaveBeenCalledWith(DummyComponent);
      expect(changeDetector.detectChanges).toHaveBeenCalled();
      expect(result).toBe(instance as unknown as DialogContentInterface);
      expect(instance['model']).toBe(model);
      expect(instance['isModal']).toBe(true);
    });

    it('should configure the list component from the list options', () => {
      const models = [{ id: 1 }, { id: 2 }];
      const datasArrived = instance['datasArrived'] as BehaviorSubject<number>;

      vi.spyOn(datasArrived, 'next').mockReturnValue(undefined);
      service
        .setDialogHost(dialogHost)
        .setMethod('list')
        .setSettings({
          listComponent: DummyComponent,
          listOptions: {
            multipleSelectEnabled: true,
            isSelectionList: true,
            loadData: false,
            filter: { name: 'test' },
            models
          }
        });

      service.render();

      expect(instance['multipleSelectEnabled']).toBe(true);
      expect(instance['isSelectionList']).toBe(true);
      expect(instance['loadData']).toBe(false);
      expect(instance['filter']).toEqual({ name: 'test' });
      expect(instance['models']).toBe(models);
      expect(datasArrived.next).toHaveBeenCalled();
    });

    it('should not set preset models when the data is loaded by the component', () => {
      service.setDialogHost(dialogHost).setSettings({
        listComponent: DummyComponent,
        listOptions: { loadData: true, models: [{ id: 1 }] }
      });

      service.render();

      expect(instance['models']).toBeUndefined();
      expect(instance['filter']).toEqual({});
    });

    it('should not configure the list component without settings', () => {
      service.setDialogHost(dialogHost);

      expect(() => service.render()).not.toThrow();
      expect(instance['isModal']).toBe(true);
      expect(instance['loadData']).toBeUndefined();
    });

    it('should log an error when the component could not be created', () => {
      dialogHost.createComponent.mockReturnValue(null);
      service.setDialogHost(dialogHost).setSettings({ listComponent: DummyComponent });

      expect(service.render()).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('componentRef is not set', null);
    });
  });

  describe('selected models', () => {
    it('should return an empty list and keep the service when there is no instance', () => {
      expect(service.getSelectedModels()).toEqual([]);
      expect(service.setSelectedModels([{ id: 1 }])).toBe(service);
      expect(service.resetSelectedModels()).toBe(service);
    });

    it('should set, get and reset the selected models of the instance', () => {
      service.instance = instance as unknown as DialogContentInterface;

      service.setSelectedModels([{ id: 1 }, { id: 2 }]);

      expect(changeDetector.detectChanges).toHaveBeenCalled();
      expect(service.getSelectedModels()).toEqual([{ id: 1 }, { id: 2 }] as never);

      service.resetSelectedModels();

      expect(service.getSelectedModels()).toEqual([]);
    });

    it('should set an empty selection for null and undefined', () => {
      service.instance = instance as unknown as DialogContentInterface;

      service.setSelectedModels(null);

      expect(instance['selectedElements']).toEqual([]);

      service.setSelectedModels(undefined);

      expect(instance['selectedElements']).toEqual([]);
    });
  });
});
