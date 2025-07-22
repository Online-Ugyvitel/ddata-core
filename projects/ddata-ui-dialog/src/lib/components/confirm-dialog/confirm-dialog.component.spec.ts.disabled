import 'zone.js/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { BaseModel, DdataCoreModule, ValidatorService } from 'ddata-core';
import { DdataUiConfirmDialogComponent } from './confirm-dialog.component';

xdescribe('DdataUiConfirmDialogComponent', () => {
  let component: DdataUiConfirmDialogComponent;
  let fixture: ComponentFixture<DdataUiConfirmDialogComponent>;
  let debugElement;
  let element;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DdataUiConfirmDialogComponent],
      providers: [
        Injector,
        ValidatorService,
        BaseModel,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    DdataCoreModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(DdataUiConfirmDialogComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
  });
  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('showDialog() method should set isModalVisible to be true', () => {
    expect(component.isModalVisible).toBe(false);
    component.showDialog();
    expect(component.isModalVisible).toBe(true);

    component.isModalVisible = false;
    component.confirmed = true;
    expect(component.isModalVisible).toBe(false);
    component.showDialog();
    expect(component.isModalVisible).toBe(false);

  });

  it('cancel() method should set isModalVisible to be false', () => {
    component.isModalVisible = true;
    expect(component.isModalVisible).toBe(true);
    component.cancel();
    expect(component.isModalVisible).toBe(false);
  });

  it('confirmModal() method should set isModalVisible to be false', () => {
    component.isModalVisible = true;
    expect(component.isModalVisible).toBe(true);
    component.confirmModal();
    expect(component.isModalVisible).toBe(false);
  });

});
