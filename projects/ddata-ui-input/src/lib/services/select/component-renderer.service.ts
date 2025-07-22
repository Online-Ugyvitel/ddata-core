import { ChangeDetectorRef } from '@angular/core';
import { BaseModelInterface } from 'ddata-core';
import { DialogContentItem } from '../../models/dialog/content/dialog-content-item';
import {
  DialogContentInterface,
  DialogContentWithOptionsInterface
} from '../../models/dialog/content/dialog-content.interface';

export class ComponentRendererService {
  method: 'create-edit' | 'list' = 'list';
  settings: DialogContentWithOptionsInterface;
  dialogHost: unknown;
  componentRef: unknown;
  instance: DialogContentInterface;

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  setMethod(method: 'create-edit' | 'list' = 'list'): ComponentRendererService {
    this.method = method;

    return this;
  }

  setSettings(settings: DialogContentWithOptionsInterface): ComponentRendererService {
    this.settings = settings;

    return this;
  }

  setDialogHost(dialogHost: unknown): ComponentRendererService {
    if (!dialogHost) {
      console.error(`DialogHost can't be undefined. DialogHost is not set.`);

      return this;
    }

    this.dialogHost = dialogHost;

    return this;
  }

  setComponentRef(componentRef: unknown): ComponentRendererService {
    this.componentRef = componentRef;

    return this;
  }

  render(): DialogContentInterface {
    if (!this.dialogHost) {
      console.error('dialogHost is not set');

      return;
    }
    const dialogContent: DialogContentItem =
      this.method === 'create-edit'
        ? new DialogContentItem(
            this.settings?.createEditComponent,
            this.settings?.createEditOptions
          )
        : new DialogContentItem(this.settings?.listComponent, this.settings?.listOptions);

    this.changeDetector.detectChanges();

    this.dialogHost.clear();

    this.componentRef = this.dialogHost.createComponent(dialogContent.component);

    if (!this.componentRef) {
      console.error('componentRef is not set', this.componentRef);

      return;
    }

    this.componentRef.instance.model = dialogContent.data.model;

    this.instance = this.componentRef.instance as DialogContentInterface;

    if (this.method === 'list') {
      this.configureListComponent(dialogContent);
    }

    this.configureAnyComponent();

    return this.instance;
  }

  getSelectedModels(): Array<BaseModelInterface<unknown>> {
    if (!this.instance) {
      return [];
    }

    return this.instance.selectedElements || [];
  }

  setSelectedModels(selectedModels: Array<unknown>): ComponentRendererService {
    if (!this.instance) {
      return this;
    }

    this.changeDetector.detectChanges();

    this.instance.selectedElements = selectedModels ?? [];

    return this;
  }

  resetSelectedModels(): ComponentRendererService {
    if (!this.instance) {
      return this;
    }

    this.instance.selectedElements = [];

    return this;
  }

  private configureListComponent(dialogContent: DialogContentItem): void {
    if (!this.settings || !this.settings.listComponent) {
      return;
    }

    if (!dialogContent.data) {
      return;
    }

    if (!this.instance) {
      console.error('Component instance is not set.');

      return;
    }

    this.instance.multipleSelectEnabled = dialogContent.data.multipleSelectEnabled;
    this.instance.isSelectionList = dialogContent.data.isSelectionList;
    this.instance.loadData = dialogContent.data.loadData;
    this.instance.filter = dialogContent.data.filter ?? {};

    // if there is preset models
    if (!dialogContent.data.loadData && !!dialogContent.data.models) {
      // set preset models
      this.instance.models = dialogContent.data.models;

      // send a notification to the list component to update their material table and other things
      this.instance.datasArrived.next(Math.random());
    }
  }

  private configureAnyComponent(): void {
    this.instance.isModal = true;
  }
}
