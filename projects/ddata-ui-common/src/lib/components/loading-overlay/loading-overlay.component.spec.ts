import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { DdataUiLoadingOverlayComponent } from './loading-overlay.component';
import { DdataCoreModule, SpinnerServiceInterface } from '@netdjw/ddata-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DdataUiCommonModule } from '../../ddata-ui-common.module';

describe('DdataUiLoadingOverlayComponent', () => {
  let component: DdataUiLoadingOverlayComponent;
  let fixture: ComponentFixture<DdataUiLoadingOverlayComponent>;
  let mockSpinnerService: any;

  beforeEach(async () => {
    // Create mock spinner service
    mockSpinnerService = {
      watch: vi.fn().mockName('SpinnerService.watch')
    };
    mockSpinnerService.watch.mockReturnValue(of(false));

    await TestBed.configureTestingModule({
      declarations: [DdataUiLoadingOverlayComponent],
      providers: [Injector]
    }).compileComponents();

    DdataUiCommonModule.InjectorInstance = {
      get: (token: never) => TestBed.inject(token)
    };
    fixture = TestBed.createComponent(DdataUiLoadingOverlayComponent);
    component = fixture.componentInstance;

    // Set up the mock spinner service
    component.spinnerService = mockSpinnerService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.subscriptions).toBeInstanceOf(Subscription);
    expect(component.spinner$).toBeInstanceOf(BehaviorSubject);
    expect(component.loadingInProgress$).toBeInstanceOf(BehaviorSubject);
    expect(component.spinner$.value).toBe(false);
    expect(component.loadingInProgress$.value).toBe(false);
    expect(component.icon.spinner).toEqual(faSpinner);
  });

  it('should set loadingInProgress through input setter', () => {
    // Test setting true
    component.loadingInProgress = true;

    expect(component.loadingInProgress$.value).toBe(true);

    // Test setting false
    component.loadingInProgress = false;

    expect(component.loadingInProgress$.value).toBe(false);

    // Test setting truthy value
    component.loadingInProgress = 'truthy' as any;

    expect(component.loadingInProgress$.value).toBe(true);

    // Test setting falsy value
    component.loadingInProgress = null;

    expect(component.loadingInProgress$.value).toBe(false);
  });

  it('should set spinner through input setter', () => {
    // Test setting true
    component.spinner = true;

    expect(component.spinner$.value).toBe(true);

    // Test setting false
    component.spinner = false;

    expect(component.spinner$.value).toBe(false);
  });

  it('should subscribe to spinner service on ngOnInit', () => {
    const mockLoadingValue = true;

    mockSpinnerService.watch.mockReturnValue(of(mockLoadingValue));

    component.ngOnInit();

    expect(mockSpinnerService.watch).toHaveBeenCalled();
    expect(component.loadingInProgress$.value).toBe(mockLoadingValue);
  });

  it('should handle spinner service subscription with different values', () => {
    // Test with false value
    mockSpinnerService.watch.mockReturnValue(of(false));
    component.ngOnInit();

    expect(component.loadingInProgress$.value).toBe(false);

    // Reset component for next test
    component.ngOnDestroy();
    component.subscriptions = new Subscription();

    // Test with true value
    mockSpinnerService.watch.mockReturnValue(of(true));
    component.ngOnInit();

    expect(component.loadingInProgress$.value).toBe(true);
  });

  it('should add subscription to subscriptions collection', () => {
    vi.spyOn(component.subscriptions, 'add');

    component.ngOnInit();

    expect(component.subscriptions.add).toHaveBeenCalled();
  });

  it('should unsubscribe on ngOnDestroy', () => {
    vi.spyOn(component.subscriptions, 'unsubscribe').mockReturnValue(undefined);

    component.ngOnDestroy();

    expect(component.subscriptions.unsubscribe).toHaveBeenCalled();
  });

  it('should maintain subscription state through lifecycle', () => {
    // Initialize subscriptions
    component.ngOnInit();

    // Check that subscription is active
    expect(component.subscriptions.closed).toBe(false);

    // Destroy component
    component.ngOnDestroy();

    // Check that subscription is closed
    expect(component.subscriptions.closed).toBe(true);
  });

  it('should have icon property with spinner icon', () => {
    expect(component.icon).toBeDefined();
    expect(component.icon.spinner).toEqual(faSpinner);
  });

  it('should update loadingInProgress$ when spinner service emits', () => {
    const loadingSubject = new BehaviorSubject<boolean>(false);

    mockSpinnerService.watch.mockReturnValue(loadingSubject.asObservable());

    component.ngOnInit();

    // Initial value should be false
    expect(component.loadingInProgress$.value).toBe(false);

    // Emit true
    loadingSubject.next(true);

    expect(component.loadingInProgress$.value).toBe(true);

    // Emit false
    loadingSubject.next(false);

    expect(component.loadingInProgress$.value).toBe(false);
  });

  it('should handle multiple subscription cleanup properly', () => {
    // Add an additional subscription to test proper cleanup
    const additionalSubscription = of(true).subscribe();

    component.subscriptions.add(additionalSubscription);

    component.ngOnInit();

    expect(component.subscriptions.closed).toBe(false);

    component.ngOnDestroy();

    expect(component.subscriptions.closed).toBe(true);
  });

  it('should have a constructor', () => {
    // Test that constructor can be called
    const newComponent = new DdataUiLoadingOverlayComponent();

    expect(newComponent).toBeTruthy();
    expect(newComponent.subscriptions).toBeInstanceOf(Subscription);
    expect(newComponent.spinner$).toBeInstanceOf(BehaviorSubject);
    expect(newComponent.loadingInProgress$).toBeInstanceOf(BehaviorSubject);
  });

  it('should work with default spinner service injection', () => {
    // The constructor reads the default spinner service from the injector of the core module
    const originalInjector = DdataCoreModule.InjectorInstance;

    DdataCoreModule.InjectorInstance = { get: () => mockSpinnerService };
    const newComponent = new DdataUiLoadingOverlayComponent();

    DdataCoreModule.InjectorInstance = originalInjector;

    // The spinnerService should be set to the default injected value
    expect(newComponent.spinnerService).toBeDefined();
    expect(newComponent.subscriptions).toBeInstanceOf(Subscription);
    expect(newComponent.spinner$).toBeInstanceOf(BehaviorSubject);
    expect(newComponent.loadingInProgress$).toBeInstanceOf(BehaviorSubject);
  });

  it('should handle falsy values correctly in loadingInProgress setter', () => {
    // Test various falsy values
    component.loadingInProgress = 0 as any;

    expect(component.loadingInProgress$.value).toBe(false);

    component.loadingInProgress = '' as any;

    expect(component.loadingInProgress$.value).toBe(false);

    component.loadingInProgress = undefined;

    expect(component.loadingInProgress$.value).toBe(false);

    component.loadingInProgress = NaN as any;

    expect(component.loadingInProgress$.value).toBe(false);
  });

  it('should handle truthy values correctly in loadingInProgress setter', () => {
    // Test various truthy values
    component.loadingInProgress = 1 as any;

    expect(component.loadingInProgress$.value).toBe(true);

    component.loadingInProgress = 'string' as any;

    expect(component.loadingInProgress$.value).toBe(true);

    component.loadingInProgress = {} as any;

    expect(component.loadingInProgress$.value).toBe(true);

    component.loadingInProgress = [] as any;

    expect(component.loadingInProgress$.value).toBe(true);
  });

  it('should properly handle subscription lifecycle', () => {
    // Verify subscription starts empty
    expect(component.subscriptions.closed).toBe(false);

    // Initialize component
    component.ngOnInit();

    // Verify subscription is active
    expect(component.subscriptions.closed).toBe(false);

    // Verify cleanup
    component.ngOnDestroy();

    expect(component.subscriptions.closed).toBe(true);
  });

  it('should handle spinner service observable properly', () => {
    const loadingSubject = new BehaviorSubject<boolean>(true);

    mockSpinnerService.watch.mockReturnValue(loadingSubject.asObservable());

    // Start with false
    expect(component.loadingInProgress$.value).toBe(false);

    // Initialize - should update to true
    component.ngOnInit();

    expect(component.loadingInProgress$.value).toBe(true);

    // Change to false
    loadingSubject.next(false);

    expect(component.loadingInProgress$.value).toBe(false);

    // Change back to true
    loadingSubject.next(true);

    expect(component.loadingInProgress$.value).toBe(true);
  });

  it('should have the correct icon configuration', () => {
    expect(component.icon).toEqual({ spinner: faSpinner });
    expect(component.icon.spinner).toBe(faSpinner);
  });
});
