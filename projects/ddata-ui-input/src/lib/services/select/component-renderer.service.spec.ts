import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ComponentRendererService } from './component-renderer.service';
import { DialogContentInterface, DialogContentWithOptionsInterface } from '../../models/dialog/content/dialog-content.interface';
import { BaseModelInterface } from 'ddata-core';

describe('ComponentRendererService', () => {
  let service: ComponentRendererService;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  let mockDialogHost: jasmine.SpyObj<any>;
  let mockComponentRef: jasmine.SpyObj<any>;
  let mockInstance: jasmine.SpyObj<DialogContentInterface>;

  beforeEach(() => {
    const changeDetectorSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    const dialogHostSpy = jasmine.createSpyObj('DialogHost', ['clear', 'createComponent']);
    const componentRefSpy = jasmine.createSpyObj('ComponentRef', [], {
      instance: {}
    });
    const instanceSpy = jasmine.createSpyObj('DialogContentInterface', [], {
      model: {},
      selectedElements: [],
      multipleSelectEnabled: false,
      isSelectionList: false,
      loadData: false,
      filter: {},
      models: [],
      datasArrived: new BehaviorSubject<number>(0),
      isModal: false
    });

    TestBed.configureTestingModule({
      providers: [
        ComponentRendererService,
        { provide: ChangeDetectorRef, useValue: changeDetectorSpy }
      ]
    });

    service = TestBed.inject(ComponentRendererService);
    mockChangeDetectorRef = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
    mockDialogHost = dialogHostSpy;
    mockComponentRef = componentRefSpy;
    mockInstance = instanceSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.method).toBe('list');
    expect(service.settings).toBeUndefined();
    expect(service.dialogHost).toBeUndefined();
    expect(service.componentRef).toBeUndefined();
    expect(service.instance).toBeUndefined();
  });

  describe('setMethod', () => {
    it('should set method to create-edit', () => {
      const result = service.setMethod('create-edit');
      expect(service.method).toBe('create-edit');
      expect(result).toBe(service);
    });

    it('should set method to list', () => {
      const result = service.setMethod('list');
      expect(service.method).toBe('list');
      expect(result).toBe(service);
    });

    it('should default to list when no parameter provided', () => {
      const result = service.setMethod();
      expect(service.method).toBe('list');
      expect(result).toBe(service);
    });
  });

  describe('setSettings', () => {
    it('should set settings', () => {
      const settings: DialogContentWithOptionsInterface = {
        createEditComponent: jasmine.createSpy('CreateEditComponent'),
        listComponent: jasmine.createSpy('ListComponent')
      };
      const result = service.setSettings(settings);
      expect(service.settings).toBe(settings);
      expect(result).toBe(service);
    });
  });

  describe('setDialogHost', () => {
    it('should set dialogHost when provided', () => {
      const result = service.setDialogHost(mockDialogHost);
      expect(service.dialogHost).toBe(mockDialogHost);
      expect(result).toBe(service);
    });

    it('should log error and return service when dialogHost is undefined', () => {
      spyOn(console, 'error');
      const result = service.setDialogHost(undefined);
      expect(console.error).toHaveBeenCalledWith(`DialogHost can't be undefined. DialogHost is not set.`);
      expect(service.dialogHost).toBeUndefined();
      expect(result).toBe(service);
    });

    it('should log error and return service when dialogHost is null', () => {
      spyOn(console, 'error');
      const result = service.setDialogHost(null);
      expect(console.error).toHaveBeenCalledWith(`DialogHost can't be undefined. DialogHost is not set.`);
      expect(service.dialogHost).toBeUndefined();
      expect(result).toBe(service);
    });
  });

  describe('setComponentRef', () => {
    it('should set componentRef', () => {
      const result = service.setComponentRef(mockComponentRef);
      expect(service.componentRef).toBe(mockComponentRef);
      expect(result).toBe(service);
    });
  });

  describe('render', () => {
    beforeEach(() => {
      service.setDialogHost(mockDialogHost);
      service.setSettings({
        createEditComponent: jasmine.createSpy('CreateEditComponent'),
        createEditOptions: { model: { id: 1 } },
        listComponent: jasmine.createSpy('ListComponent'),
        listOptions: { 
          model: { id: 2 }, 
          multipleSelectEnabled: true,
          isSelectionList: true,
          loadData: false,
          filter: { name: 'test' },
          models: [{ id: 1 }, { id: 2 }]
        }
      });
    });

    it('should log error and return undefined when dialogHost is not set', () => {
      service.setDialogHost(null);
      spyOn(console, 'error');
      
      const result = service.render();
      
      expect(console.error).toHaveBeenCalledWith('dialogHost is not set');
      expect(result).toBeUndefined();
    });

    it('should render create-edit component', () => {
      service.setMethod('create-edit');
      mockDialogHost.createComponent.and.returnValue(mockComponentRef);
      mockComponentRef.instance = mockInstance;
      
      const result = service.render();
      
      expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
      expect(mockDialogHost.clear).toHaveBeenCalled();
      expect(mockDialogHost.createComponent).toHaveBeenCalled();
      expect(mockComponentRef.instance.model).toBe(service.settings.createEditOptions.model);
      expect(service.instance).toBe(mockInstance);
      expect(mockInstance.isModal).toBe(true);
      expect(result).toBe(mockInstance);
    });

    it('should render list component', () => {
      service.setMethod('list');
      mockDialogHost.createComponent.and.returnValue(mockComponentRef);
      mockComponentRef.instance = mockInstance;
      
      const result = service.render();
      
      expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
      expect(mockDialogHost.clear).toHaveBeenCalled();
      expect(mockDialogHost.createComponent).toHaveBeenCalled();
      expect(mockComponentRef.instance.model).toBe(service.settings.listOptions.model);
      expect(service.instance).toBe(mockInstance);
      expect(mockInstance.isModal).toBe(true);
      expect(result).toBe(mockInstance);
    });

    it('should log error and return undefined when componentRef is not created', () => {
      mockDialogHost.createComponent.and.returnValue(null);
      spyOn(console, 'error');
      
      const result = service.render();
      
      expect(console.error).toHaveBeenCalledWith('componentRef is not set', null);
      expect(result).toBeUndefined();
    });

    it('should configure list component when method is list', () => {
      service.setMethod('list');
      mockDialogHost.createComponent.and.returnValue(mockComponentRef);
      mockComponentRef.instance = mockInstance;
      spyOn(mockInstance.datasArrived, 'next');
      
      service.render();
      
      expect(mockInstance.multipleSelectEnabled).toBe(true);
      expect(mockInstance.isSelectionList).toBe(true);
      expect(mockInstance.loadData).toBe(false);
      expect(mockInstance.filter).toEqual({ name: 'test' });
      expect(mockInstance.models).toEqual([{ id: 1 }, { id: 2 }]);
      expect(mockInstance.datasArrived.next).toHaveBeenCalledWith(jasmine.any(Number));
    });

    it('should handle list component configuration with loadData true', () => {
      service.setMethod('list');
      service.settings.listOptions.loadData = true;
      service.settings.listOptions.models = undefined;
      mockDialogHost.createComponent.and.returnValue(mockComponentRef);
      mockComponentRef.instance = mockInstance;
      spyOn(mockInstance.datasArrived, 'next');
      
      service.render();
      
      expect(mockInstance.loadData).toBe(true);
      expect(mockInstance.datasArrived.next).not.toHaveBeenCalled();
    });

    it('should handle list component configuration with no filter', () => {
      service.setMethod('list');
      service.settings.listOptions.filter = undefined;
      mockDialogHost.createComponent.and.returnValue(mockComponentRef);
      mockComponentRef.instance = mockInstance;
      
      service.render();
      
      expect(mockInstance.filter).toEqual({});
    });
  });

  describe('configureListComponent early return conditions', () => {
    beforeEach(() => {
      service.setDialogHost(mockDialogHost);
      mockDialogHost.createComponent.and.returnValue(mockComponentRef);
      mockComponentRef.instance = mockInstance;
    });

    it('should return early when settings is not set', () => {
      service.setMethod('list');
      service.setSettings(undefined);
      
      service.render();
      
      // Should not configure list component properties when settings is undefined
      expect(mockInstance.multipleSelectEnabled).toBeFalsy();
    });

    it('should return early when listComponent is not set', () => {
      service.setMethod('list');
      service.setSettings({ listComponent: undefined });
      
      service.render();
      
      // Should not configure list component properties when listComponent is undefined
      expect(mockInstance.multipleSelectEnabled).toBeFalsy();
    });

    it('should return early when data is not set', () => {
      service.setMethod('list');
      service.setSettings({ 
        listComponent: jasmine.createSpy('ListComponent'),
        listOptions: undefined 
      });
      
      service.render();
      
      // Should not configure list component properties when data is undefined
      expect(mockInstance.multipleSelectEnabled).toBeFalsy();
    });
  });

  describe('configureListComponent private method edge cases', () => {
    beforeEach(() => {
      service.setDialogHost(mockDialogHost);
      mockDialogHost.createComponent.and.returnValue(mockComponentRef);
    });

    it('should log error when instance is null during configureListComponent', () => {
      service.setMethod('list');
      service.setSettings({
        listComponent: jasmine.createSpy('ListComponent'),
        listOptions: { 
          model: { id: 1 },
          multipleSelectEnabled: true,
          isSelectionList: true,
          loadData: false,
          filter: { name: 'test' },
          models: [{ id: 1 }, { id: 2 }]
        }
      });
      
      // Create a mock componentRef that returns null instance to trigger line 121
      const nullInstanceComponentRef = jasmine.createSpyObj('ComponentRef', [], {
        instance: null
      });
      mockDialogHost.createComponent.and.returnValue(nullInstanceComponentRef);
      spyOn(console, 'error');
      
      const result = service.render();
      
      expect(console.error).toHaveBeenCalledWith('Component instance is not set.');
      expect(result).toBeUndefined();
    });

    it('should handle configureListComponent when all conditions are met', () => {
      service.setMethod('list');
      service.setSettings({
        listComponent: jasmine.createSpy('ListComponent'),
        listOptions: { 
          model: { id: 1 },
          multipleSelectEnabled: true,
          isSelectionList: true,
          loadData: false,
          filter: { name: 'test' },
          models: [{ id: 1 }, { id: 2 }],
          datasArrived: new BehaviorSubject<number>(0)
        }
      });
      
      mockComponentRef.instance = mockInstance;
      spyOn(mockInstance.datasArrived, 'next');
      
      service.render();
      
      expect(mockInstance.multipleSelectEnabled).toBe(true);
      expect(mockInstance.isSelectionList).toBe(true);
      expect(mockInstance.loadData).toBe(false);
      expect(mockInstance.filter).toEqual({ name: 'test' });
      expect(mockInstance.models).toEqual([{ id: 1 }, { id: 2 }]);
      expect(mockInstance.datasArrived.next).toHaveBeenCalledWith(jasmine.any(Number));
    });

    it('should log error and return undefined when componentRef creation fails', () => {
      service.setMethod('list');
      service.setSettings({
        listComponent: jasmine.createSpy('ListComponent'),
        listOptions: { model: { id: 1 } }
      });
      mockDialogHost.createComponent.and.returnValue(null);
      spyOn(console, 'error');
      
      const result = service.render();
      
      expect(console.error).toHaveBeenCalledWith('componentRef is not set', null);
      expect(result).toBeUndefined();
    });
  });

  describe('getSelectedModels', () => {
    it('should return selectedElements when instance exists', () => {
      const selectedElements: BaseModelInterface<any>[] = [{ id: 1 }, { id: 2 }] as any;
      service.instance = { selectedElements } as DialogContentInterface;
      
      const result = service.getSelectedModels();
      
      expect(result).toBe(selectedElements);
    });

    it('should return empty array when instance does not exist', () => {
      service.instance = undefined;
      
      const result = service.getSelectedModels();
      
      expect(result).toEqual([]);
    });
  });

  describe('setSelectedModels', () => {
    beforeEach(() => {
      service.instance = mockInstance;
    });

    it('should set selectedElements when instance exists', () => {
      const selectedModels: BaseModelInterface<any>[] = [{ id: 1 }, { id: 2 }] as any;
      
      const result = service.setSelectedModels(selectedModels);
      
      expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
      expect(mockInstance.selectedElements).toBe(selectedModels);
      expect(result).toBe(service);
    });

    it('should set empty array when selectedModels is null', () => {
      const result = service.setSelectedModels(null);
      
      expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
      expect(mockInstance.selectedElements).toEqual([]);
      expect(result).toBe(service);
    });

    it('should set empty array when selectedModels is undefined', () => {
      const result = service.setSelectedModels(undefined);
      
      expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
      expect(mockInstance.selectedElements).toEqual([]);
      expect(result).toBe(service);
    });

    it('should return service when instance does not exist', () => {
      service.instance = undefined;
      
      const result = service.setSelectedModels([{ id: 1 }] as any);
      
      expect(mockChangeDetectorRef.detectChanges).not.toHaveBeenCalled();
      expect(result).toBe(service);
    });
  });

  describe('resetSelectedModels', () => {
    it('should reset selectedElements to empty array when instance exists', () => {
      service.instance = mockInstance;
      
      const result = service.resetSelectedModels();
      
      expect(mockInstance.selectedElements).toEqual([]);
      expect(result).toBe(service);
    });

    it('should return service when instance does not exist', () => {
      service.instance = undefined;
      
      const result = service.resetSelectedModels();
      
      expect(result).toBe(service);
    });
  });
});