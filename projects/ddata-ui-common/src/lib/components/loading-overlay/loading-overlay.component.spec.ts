import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DdataUiLoadingOverlayComponent } from './loading-overlay.component';
import { SpinnerServiceInterface } from 'ddata-core';

describe('DdataUiLoadingOverlayComponent', () => {
  let component: DdataUiLoadingOverlayComponent;
  let fixture: ComponentFixture<DdataUiLoadingOverlayComponent>;
  let mockSpinnerService: SpinnerServiceInterface;

  beforeEach(waitForAsync(() => {
    // Mock SpinnerService
    mockSpinnerService = {
      spinner$: { subscribe: jasmine.createSpy('subscribe') },
      loadingInProgress$: { subscribe: jasmine.createSpy('subscribe') },
      watch: jasmine.createSpy('watch'),
      on: jasmine.createSpy('on'),
      off: jasmine.createSpy('off'),
      getStatus: jasmine.createSpy('getStatus')
    } as unknown as SpinnerServiceInterface;

    TestBed.configureTestingModule({
      declarations: [DdataUiLoadingOverlayComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Allow fa-icon element
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiLoadingOverlayComponent);
    component = fixture.componentInstance;

    // Mock the spinnerService input to avoid InjectorInstance issues
    component.spinnerService = mockSpinnerService;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
