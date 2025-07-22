import 'zone.js/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DdataUiConfirmDialogComponent } from './confirm-dialog.component';
import { DialogType } from '../../models/dialog/dialog.interface';

describe('DdataUiConfirmDialogComponent', () => {
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
      imports: [FontAwesomeModule]
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

  describe('Component Initialization', () => {
    it('should have default input values', () => {
      expect(component.title).toBe('');
      expect(component.content).toBe('');
      expect(component.type).toBe('message');
      expect(component.showDialog).toBe(false);
      expect(component.overlayClickCloseDialog).toBe(true);
      expect(component.successButtonText).toBe('OK');
      expect(component.cancelButtonText).toBe('Cancel');
      expect(component.closeButtonText).toBe('Close');
    });

    it('should have confirmed property set to false', () => {
      expect(component.confirmed).toBe(false);
    });

    it('should have icon object with expected FontAwesome icons', () => {
      expect(component.icon).toBeDefined();
      expect(component.icon.close).toBeDefined();
      expect(component.icon.info).toBeDefined();
      expect(component.icon.alert).toBeDefined();
    });
  });

  describe('Input Properties', () => {
    it('should accept title input', () => {
      const testTitle = 'Test Dialog Title';
      component.title = testTitle;
      expect(component.title).toBe(testTitle);
    });

    it('should accept content input', () => {
      const testContent = 'Test dialog content message';
      component.content = testContent;
      expect(component.content).toBe(testContent);
    });

    it('should accept type input', () => {
      const testType: DialogType = 'delete';
      component.type = testType;
      expect(component.type).toBe(testType);
    });

    it('should accept showDialog input', () => {
      component.showDialog = true;
      expect(component.showDialog).toBe(true);
    });

    it('should accept overlayClickCloseDialog input', () => {
      component.overlayClickCloseDialog = false;
      expect(component.overlayClickCloseDialog).toBe(false);
    });

    it('should accept successButtonText input', () => {
      const testText = 'Confirm';
      component.successButtonText = testText;
      expect(component.successButtonText).toBe(testText);
    });

    it('should accept cancelButtonText input', () => {
      const testText = 'Decline';
      component.cancelButtonText = testText;
      expect(component.cancelButtonText).toBe(testText);
    });

    it('should accept closeButtonText input', () => {
      const testText = 'Exit';
      component.closeButtonText = testText;
      expect(component.closeButtonText).toBe(testText);
    });
  });

  describe('ngOnInit', () => {
    it('should execute without error', () => {
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('cancel method', () => {
    it('should set showDialog to false', () => {
      component.showDialog = true;
      component.cancel();
      expect(component.showDialog).toBe(false);
    });

    it('should emit pressed event with false', () => {
      spyOn(component.pressed, 'emit');
      component.cancel();
      expect(component.pressed.emit).toHaveBeenCalledWith(false);
    });

    it('should set showDialog to false and emit pressed with false in one call', () => {
      component.showDialog = true;
      spyOn(component.pressed, 'emit');
      
      component.cancel();
      
      expect(component.showDialog).toBe(false);
      expect(component.pressed.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('confirmModal method', () => {
    it('should emit pressed event with true', () => {
      spyOn(component.pressed, 'emit');
      component.confirmModal();
      expect(component.pressed.emit).toHaveBeenCalledWith(true);
    });

    it('should set showDialog to false', () => {
      component.showDialog = true;
      component.confirmModal();
      expect(component.showDialog).toBe(false);
    });

    it('should emit confirm event', () => {
      spyOn(component.confirm, 'emit');
      component.confirmModal();
      expect(component.confirm.emit).toHaveBeenCalled();
    });

    it('should emit pressed, set showDialog false, and emit confirm in one call', () => {
      component.showDialog = true;
      spyOn(component.pressed, 'emit');
      spyOn(component.confirm, 'emit');
      
      component.confirmModal();
      
      expect(component.pressed.emit).toHaveBeenCalledWith(true);
      expect(component.showDialog).toBe(false);
      expect(component.confirm.emit).toHaveBeenCalled();
    });
  });

  describe('clickOnOverlay method', () => {
    it('should call cancel when overlayClickCloseDialog is true', () => {
      component.overlayClickCloseDialog = true;
      spyOn(component, 'cancel');
      
      component.clickOnOverlay();
      
      expect(component.cancel).toHaveBeenCalled();
    });

    it('should not call cancel when overlayClickCloseDialog is false', () => {
      component.overlayClickCloseDialog = false;
      spyOn(component, 'cancel');
      
      component.clickOnOverlay();
      
      expect(component.cancel).not.toHaveBeenCalled();
    });

    it('should emit pressed with false when overlayClickCloseDialog is true', () => {
      component.overlayClickCloseDialog = true;
      spyOn(component.pressed, 'emit');
      
      component.clickOnOverlay();
      
      expect(component.pressed.emit).toHaveBeenCalledWith(false);
    });

    it('should not emit any events when overlayClickCloseDialog is false', () => {
      component.overlayClickCloseDialog = false;
      spyOn(component.pressed, 'emit');
      spyOn(component.confirm, 'emit');
      
      component.clickOnOverlay();
      
      expect(component.pressed.emit).not.toHaveBeenCalled();
      expect(component.confirm.emit).not.toHaveBeenCalled();
    });
  });

  describe('Event Emitters', () => {
    it('should have confirm output EventEmitter', () => {
      expect(component.confirm).toBeDefined();
      expect(component.confirm.emit).toEqual(jasmine.any(Function));
    });

    it('should have pressed output EventEmitter', () => {
      expect(component.pressed).toBeDefined();
      expect(component.pressed.emit).toEqual(jasmine.any(Function));
    });
  });

  describe('Integration scenarios', () => {
    it('should handle full dialog confirmation flow', () => {
      spyOn(component.pressed, 'emit');
      spyOn(component.confirm, 'emit');
      
      // Setup dialog
      component.showDialog = true;
      component.title = 'Confirm Action';
      component.content = 'Are you sure?';
      
      // User confirms
      component.confirmModal();
      
      expect(component.showDialog).toBe(false);
      expect(component.pressed.emit).toHaveBeenCalledWith(true);
      expect(component.confirm.emit).toHaveBeenCalled();
    });

    it('should handle dialog cancellation flow', () => {
      spyOn(component.pressed, 'emit');
      spyOn(component.confirm, 'emit');
      
      // Setup dialog
      component.showDialog = true;
      component.title = 'Confirm Action';
      component.content = 'Are you sure?';
      
      // User cancels
      component.cancel();
      
      expect(component.showDialog).toBe(false);
      expect(component.pressed.emit).toHaveBeenCalledWith(false);
      expect(component.confirm.emit).not.toHaveBeenCalled();
    });

    it('should handle overlay click when enabled', () => {
      spyOn(component.pressed, 'emit');
      
      // Setup dialog with overlay click enabled
      component.showDialog = true;
      component.overlayClickCloseDialog = true;
      
      // User clicks overlay
      component.clickOnOverlay();
      
      expect(component.showDialog).toBe(false);
      expect(component.pressed.emit).toHaveBeenCalledWith(false);
    });

    it('should ignore overlay click when disabled', () => {
      spyOn(component.pressed, 'emit');
      
      // Setup dialog with overlay click disabled
      component.showDialog = true;
      component.overlayClickCloseDialog = false;
      
      // User clicks overlay
      component.clickOnOverlay();
      
      expect(component.showDialog).toBe(true);
      expect(component.pressed.emit).not.toHaveBeenCalled();
    });
  });
});
