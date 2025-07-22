import 'zone.js/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { DdataUiLoadingOverlayComponent } from './loading-overlay.component';
import { SpinnerServiceInterface } from 'ddata-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DdataUiCommonModule } from '../../ddata-ui-common.module';

describe('DdataUiLoadingOverlayComponent', () => {
  let component: DdataUiLoadingOverlayComponent;
  let fixture: ComponentFixture<DdataUiLoadingOverlayComponent>;
  let mockSpinnerService: jasmine.SpyObj<SpinnerServiceInterface>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
    });
  });

  beforeEach(async () => {
    // Create mock spinner service
    mockSpinnerService = jasmine.createSpyObj('SpinnerService', ['watch']);
    mockSpinnerService.watch.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      declarations: [DdataUiLoadingOverlayComponent],
      providers: [
        Injector
      ]
    }).compileComponents();

    DdataUiCommonModule.InjectorInstance = TestBed;
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
    expect(component.spinner$.value).toBeFalse();
    expect(component.loadingInProgress$.value).toBeFalse();
    expect(component.icon.spinner).toEqual(faSpinner);
  });

  it('should set loadingInProgress through input setter', () => {
    // Test setting true
    component.loadingInProgress = true;
    expect(component.loadingInProgress$.value).toBeTrue();

    // Test setting false
    component.loadingInProgress = false;
    expect(component.loadingInProgress$.value).toBeFalse();

    // Test setting truthy value
    component.loadingInProgress = 'truthy' as any;
    expect(component.loadingInProgress$.value).toBeTrue();

    // Test setting falsy value
    component.loadingInProgress = null as any;
    expect(component.loadingInProgress$.value).toBeFalse();
  });

  it('should set spinner through input setter', () => {
    // Test setting true
    component.spinner = true;
    expect(component.spinner$.value).toBeTrue();

    // Test setting false
    component.spinner = false;
    expect(component.spinner$.value).toBeFalse();
  });

  it('should subscribe to spinner service on ngOnInit', () => {
    const mockLoadingValue = true;
    mockSpinnerService.watch.and.returnValue(of(mockLoadingValue));

    component.ngOnInit();

    expect(mockSpinnerService.watch).toHaveBeenCalled();
    expect(component.loadingInProgress$.value).toBe(mockLoadingValue);
  });

  it('should handle spinner service subscription with different values', () => {
    // Test with false value
    mockSpinnerService.watch.and.returnValue(of(false));
    component.ngOnInit();
    expect(component.loadingInProgress$.value).toBeFalse();

    // Reset component for next test
    component.ngOnDestroy();
    component.subscriptions = new Subscription();

    // Test with true value
    mockSpinnerService.watch.and.returnValue(of(true));
    component.ngOnInit();
    expect(component.loadingInProgress$.value).toBeTrue();
  });

  it('should add subscription to subscriptions collection', () => {
    spyOn(component.subscriptions, 'add').and.callThrough();
    
    component.ngOnInit();
    
    expect(component.subscriptions.add).toHaveBeenCalled();
  });

  it('should unsubscribe on ngOnDestroy', () => {
    spyOn(component.subscriptions, 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(component.subscriptions.unsubscribe).toHaveBeenCalled();
  });

  it('should maintain subscription state through lifecycle', () => {
    // Initialize subscriptions
    component.ngOnInit();
    
    // Check that subscription is active
    expect(component.subscriptions.closed).toBeFalse();
    
    // Destroy component
    component.ngOnDestroy();
    
    // Check that subscription is closed
    expect(component.subscriptions.closed).toBeTrue();
  });

  it('should have icon property with spinner icon', () => {
    expect(component.icon).toBeDefined();
    expect(component.icon.spinner).toEqual(faSpinner);
  });

  it('should update loadingInProgress$ when spinner service emits', () => {
    const loadingSubject = new BehaviorSubject<boolean>(false);
    mockSpinnerService.watch.and.returnValue(loadingSubject.asObservable());

    component.ngOnInit();

    // Initial value should be false
    expect(component.loadingInProgress$.value).toBeFalse();

    // Emit true
    loadingSubject.next(true);
    expect(component.loadingInProgress$.value).toBeTrue();

    // Emit false
    loadingSubject.next(false);
    expect(component.loadingInProgress$.value).toBeFalse();
  });

  it('should handle multiple subscription cleanup properly', () => {
    // Add an additional subscription to test proper cleanup
    const additionalSubscription = of(true).subscribe();
    component.subscriptions.add(additionalSubscription);

    component.ngOnInit();
    
    expect(component.subscriptions.closed).toBeFalse();
    
    component.ngOnDestroy();
    
    expect(component.subscriptions.closed).toBeTrue();
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
    // Create a new component instance without mocking the service
    const newComponent = new DdataUiLoadingOverlayComponent();
    
    // The spinnerService should be set to the default injected value
    expect(newComponent.spinnerService).toBeDefined();
    expect(newComponent.subscriptions).toBeInstanceOf(Subscription);
    expect(newComponent.spinner$).toBeInstanceOf(BehaviorSubject);
    expect(newComponent.loadingInProgress$).toBeInstanceOf(BehaviorSubject);
  });

  it('should handle falsy values correctly in loadingInProgress setter', () => {
    // Test various falsy values
    component.loadingInProgress = 0 as any;
    expect(component.loadingInProgress$.value).toBeFalse();

    component.loadingInProgress = '' as any;
    expect(component.loadingInProgress$.value).toBeFalse();

    component.loadingInProgress = undefined as any;
    expect(component.loadingInProgress$.value).toBeFalse();

    component.loadingInProgress = NaN as any;
    expect(component.loadingInProgress$.value).toBeFalse();
  });

  it('should handle truthy values correctly in loadingInProgress setter', () => {
    // Test various truthy values
    component.loadingInProgress = 1 as any;
    expect(component.loadingInProgress$.value).toBeTrue();

    component.loadingInProgress = 'string' as any;
    expect(component.loadingInProgress$.value).toBeTrue();

    component.loadingInProgress = {} as any;
    expect(component.loadingInProgress$.value).toBeTrue();

    component.loadingInProgress = [] as any;
    expect(component.loadingInProgress$.value).toBeTrue();
  });

  it('should properly handle subscription lifecycle', () => {
    // Verify subscription starts empty
    expect(component.subscriptions.closed).toBeFalse();
    
    // Initialize component
    component.ngOnInit();
    
    // Verify subscription is active
    expect(component.subscriptions.closed).toBeFalse();
    
    // Verify cleanup
    component.ngOnDestroy();
    expect(component.subscriptions.closed).toBeTrue();
  });

  it('should handle spinner service observable properly', () => {
    const loadingSubject = new BehaviorSubject<boolean>(true);
    mockSpinnerService.watch.and.returnValue(loadingSubject.asObservable());

    // Start with false
    expect(component.loadingInProgress$.value).toBeFalse();

    // Initialize - should update to true
    component.ngOnInit();
    expect(component.loadingInProgress$.value).toBeTrue();

    // Change to false
    loadingSubject.next(false);
    expect(component.loadingInProgress$.value).toBeFalse();

    // Change back to true
    loadingSubject.next(true);
    expect(component.loadingInProgress$.value).toBeTrue();
  });

  it('should have the correct icon configuration', () => {
    expect(component.icon).toEqual({ spinner: faSpinner });
    expect(component.icon.spinner).toBe(faSpinner);
  });
});
