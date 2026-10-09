import 'zone.js/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { BaseModel, ValidatorService } from 'ddata-core';
import { DdataUiConfirmDialogComponent } from './confirm-dialog.component';
import { DialogType } from '../../models/dialog/dialog.interface';

describe('DdataUiConfirmDialogComponent', () => {
  let component: DdataUiConfirmDialogComponent;
  let fixture: ComponentFixture<DdataUiConfirmDialogComponent>;
  let debugElement;
  let element;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DdataUiConfirmDialogComponent],
      providers: [Injector, ValidatorService, BaseModel]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiConfirmDialogComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showDialog flag should toggle visibility logic', () => {
    expect(component.showDialog).toBe(false);
    component.showDialog = true;

    expect(component.showDialog).toBe(true);
    component.cancel();

    expect(component.showDialog).toBe(false);
  });

  it('cancel() method should set showDialog to false', () => {
    component.showDialog = true;

    expect(component.showDialog).toBe(true);
    component.cancel();

    expect(component.showDialog).toBe(false);
  });

  it('confirmModal() method should set showDialog to false', () => {
    component.showDialog = true;

    expect(component.showDialog).toBe(true);
    component.confirmModal();

    expect(component.showDialog).toBe(false);
  });
});
