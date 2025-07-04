import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DdataUiLoadingOverlayComponent } from './loading-overlay.component';

// Mock SpinnerService
const mockSpinnerService = {
  spinner$: { subscribe: jasmine.createSpy('subscribe') },
  loadingInProgress$: { subscribe: jasmine.createSpy('subscribe') }
};

xdescribe('DdataUiLoadingOverlayComponent', () => {
  let component: DdataUiLoadingOverlayComponent;
  let fixture: ComponentFixture<DdataUiLoadingOverlayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DdataUiLoadingOverlayComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ] // Allow fa-icon element
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiLoadingOverlayComponent);
    component = fixture.componentInstance;

    // Mock the spinnerService input to avoid InjectorInstance issues
    component.spinnerService = mockSpinnerService as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
