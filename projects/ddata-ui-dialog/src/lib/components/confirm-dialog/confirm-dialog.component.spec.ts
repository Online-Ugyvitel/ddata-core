// @ts-nocheck -- generated spec uses loosely typed mock models, events and private members
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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

  describe('cancel method', () => {
    it('should set showDialog to false', () => {
      component.showDialog = true;
      component.cancel();

      expect(component.showDialog).toBe(false);
    });

    it('should emit pressed event with false', () => {
      vi.spyOn(component.pressed, 'emit').mockReturnValue(undefined);
      component.cancel();

      expect(component.pressed.emit).toHaveBeenCalledWith(false);
    });

    it('should set showDialog to false and emit pressed with false in one call', () => {
      component.showDialog = true;
      vi.spyOn(component.pressed, 'emit').mockReturnValue(undefined);

      component.cancel();

      expect(component.showDialog).toBe(false);
      expect(component.pressed.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('confirmModal method', () => {
    it('should emit pressed event with true', () => {
      component.showDialog = true;
      vi.spyOn(component.pressed, 'emit').mockReturnValue(undefined);
      component.confirmModal();

      expect(component.pressed.emit).toHaveBeenCalledWith(true);
    });

    it('should set showDialog to false', () => {
      component.showDialog = true;
      component.confirmModal();

      expect(component.showDialog).toBe(false);
    });

    it('should emit confirm event', () => {
      component.showDialog = true;
      vi.spyOn(component.confirm, 'emit').mockReturnValue(undefined);
      component.confirmModal();

      expect(component.confirm.emit).toHaveBeenCalled();
    });

    it('should emit pressed, set showDialog false, and emit confirm in one call', () => {
      component.showDialog = true;
      vi.spyOn(component.pressed, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.confirm, 'emit').mockReturnValue(undefined);

      component.confirmModal();

      expect(component.pressed.emit).toHaveBeenCalledWith(true);
      expect(component.showDialog).toBe(false);
      expect(component.confirm.emit).toHaveBeenCalled();
    });
  });

  describe('clickOnOverlay method', () => {
    it('should call cancel when overlayClickCloseDialog is true', () => {
      component.overlayClickCloseDialog = true;
      vi.spyOn(component, 'cancel').mockReturnValue(undefined);

      component.clickOnOverlay();

      expect(component.cancel).toHaveBeenCalled();
    });

    it('should not call cancel when overlayClickCloseDialog is false', () => {
      component.overlayClickCloseDialog = false;
      vi.spyOn(component, 'cancel').mockReturnValue(undefined);

      component.clickOnOverlay();

      expect(component.cancel).not.toHaveBeenCalled();
    });

    it('should emit pressed with false when overlayClickCloseDialog is true', () => {
      component.overlayClickCloseDialog = true;
      vi.spyOn(component.pressed, 'emit').mockReturnValue(undefined);

      component.clickOnOverlay();

      expect(component.pressed.emit).toHaveBeenCalledWith(false);
    });

    it('should not emit any events when overlayClickCloseDialog is false', () => {
      component.overlayClickCloseDialog = false;
      vi.spyOn(component.pressed, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.confirm, 'emit').mockReturnValue(undefined);

      component.clickOnOverlay();

      expect(component.pressed.emit).not.toHaveBeenCalled();
      expect(component.confirm.emit).not.toHaveBeenCalled();
    });
  });

  describe('Event Emitters', () => {
    it('should have confirm output EventEmitter', () => {
      expect(component.confirm).toBeDefined();
      expect(component.confirm.emit).toEqual(expect.any(Function));
    });

    it('should have pressed output EventEmitter', () => {
      expect(component.pressed).toBeDefined();
      expect(component.pressed.emit).toEqual(expect.any(Function));
    });
  });

  describe('Integration scenarios', () => {
    it('should handle full dialog confirmation flow', () => {
      vi.spyOn(component.pressed, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.confirm, 'emit').mockReturnValue(undefined);

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
      vi.spyOn(component.pressed, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.confirm, 'emit').mockReturnValue(undefined);

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
      vi.spyOn(component.pressed, 'emit').mockReturnValue(undefined);

      // Setup dialog with overlay click enabled
      component.showDialog = true;
      component.overlayClickCloseDialog = true;

      // User clicks overlay
      component.clickOnOverlay();

      expect(component.showDialog).toBe(false);
      expect(component.pressed.emit).toHaveBeenCalledWith(false);
    });

    it('should ignore overlay click when disabled', () => {
      vi.spyOn(component.pressed, 'emit').mockReturnValue(undefined);

      // Setup dialog with overlay click disabled
      component.showDialog = true;
      component.overlayClickCloseDialog = false;

      // User clicks overlay
      component.clickOnOverlay();

      expect(component.showDialog).toBe(true);
      expect(component.pressed.emit).not.toHaveBeenCalled();
    });
  });

  describe('rendered dialog', () => {
    const open = (inputs: Record<string, unknown> = {}): void => {
      Object.entries({ showDialog: true, ...inputs }).forEach(([key, value]) =>
        fixture.componentRef.setInput(key, value)
      );
      fixture.detectChanges();
    };
    const query = (selector: string): HTMLElement | null => element.querySelector(selector);
    const footerButtons = (): Array<HTMLButtonElement> =>
      Array.from(element.querySelectorAll('.modal-footer button'));
    const overlay = (): HTMLElement => query('.modal-overlay');

    it('should not render the dialog and keep the overlay inactive while hidden', () => {
      expect(query('.modal')).toBeNull();
      expect(overlay().classList.contains('active')).toBe(false);
    });

    it('should render title, content and activate the overlay when shown', () => {
      open({ title: 'Delete item', content: 'Are you sure?' });

      expect(query('.modal-title').textContent.trim()).toBe('Delete item');
      expect(query('.content-container p').textContent.trim()).toBe('Are you sure?');
      expect(overlay().classList.contains('active')).toBe(true);
    });

    it('should render custom button labels', () => {
      open({ successButtonText: 'Yes', cancelButtonText: 'No', closeButtonText: 'Dismiss' });
      const [confirmButton, cancelButton] = footerButtons();

      expect(confirmButton.textContent.trim()).toBe('Yes');
      expect(cancelButton.textContent.trim()).toBe('No');
      expect(query('.modal-header button').getAttribute('aria-label')).toBe('Dismiss');
    });

    describe('type', () => {
      it.each([
        ['message', 'text-primary', 'btn-primary', true],
        ['warning', 'text-primary', 'btn-primary', false],
        ['delete', 'text-danger', 'btn-danger', true]
      ])(
        'should style a "%s" dialog with %s / %s and show the icon: %s',
        (type, iconClass, buttonClass, hasIcon) => {
          open({ type });
          const iconContainer = query('.icon-container');
          const [confirmButton, cancelButton] = footerButtons();

          expect(iconContainer.classList.contains(iconClass)).toBe(true);
          expect(confirmButton.classList.contains(buttonClass)).toBe(true);
          expect(!!iconContainer.querySelector('fa-icon')).toBe(hasIcon);
          expect(cancelButton.textContent.trim()).toBe('Cancel');
        }
      );

      it('should render only the confirm button without styling for an unknown type', () => {
        open({ type: 'custom' });
        const buttons = footerButtons();
        const iconContainer = query('.icon-container');

        expect(buttons.length).toBe(1);
        expect(buttons[0].className.trim()).toBe('btn');
        expect(iconContainer.classList.contains('text-primary')).toBe(false);
        expect(iconContainer.classList.contains('text-danger')).toBe(false);
        expect(iconContainer.querySelector('fa-icon')).toBeNull();
      });

      it.each([
        ['delete', 'alert'],
        ['message', 'info']
      ])('should render the %s dialog with the %s icon', (type, icon) => {
        open({ type });
        const svg = query('.icon-container fa-icon svg');

        expect(svg.getAttribute('data-icon')).toBe(component.icon[icon].iconName);
      });
    });

    it('should emit confirm once and close when the confirm button is clicked', () => {
      const confirmSpy = vi.fn();
      const pressedSpy = vi.fn();

      component.confirm.subscribe(confirmSpy);
      component.pressed.subscribe(pressedSpy);
      open();

      footerButtons()[0].click();
      fixture.detectChanges();

      expect(confirmSpy).toHaveBeenCalledTimes(1);
      expect(pressedSpy).toHaveBeenCalledExactlyOnceWith(true);
      expect(query('.modal')).toBeNull();
    });

    it('should emit confirm only once on a fast double click', () => {
      const confirmSpy = vi.fn();
      const pressedSpy = vi.fn();

      component.confirm.subscribe(confirmSpy);
      component.pressed.subscribe(pressedSpy);
      open();
      const confirmButton = footerButtons()[0];

      // both clicks land before change detection removes the button
      confirmButton.click();
      confirmButton.click();
      fixture.detectChanges();

      expect(confirmSpy).toHaveBeenCalledTimes(1);
      expect(pressedSpy).toHaveBeenCalledExactlyOnceWith(true);
    });

    it('should not emit confirm when confirmModal is called on a closed dialog', () => {
      const confirmSpy = vi.fn();
      const pressedSpy = vi.fn();

      component.confirm.subscribe(confirmSpy);
      component.pressed.subscribe(pressedSpy);

      component.confirmModal();

      expect(confirmSpy).not.toHaveBeenCalled();
      expect(pressedSpy).not.toHaveBeenCalled();
    });

    it('should confirm again after the dialog is reopened', () => {
      const confirmSpy = vi.fn();

      component.confirm.subscribe(confirmSpy);
      open();
      footerButtons()[0].click();
      fixture.detectChanges();

      // the parent resets its one-way binding (e.g. on `pressed`) and opens the dialog again
      fixture.componentRef.setInput('showDialog', false);
      open();
      footerButtons()[0].click();
      fixture.detectChanges();

      expect(confirmSpy).toHaveBeenCalledTimes(2);
    });

    it.each([
      ['cancel button', '.modal-footer .btn-secondary'],
      ['header close button', '.modal-header button']
    ])('should emit pressed(false) without confirm and close on the %s', (_name, selector) => {
      const confirmSpy = vi.fn();
      const pressedSpy = vi.fn();

      component.confirm.subscribe(confirmSpy);
      component.pressed.subscribe(pressedSpy);
      open();

      query(selector).click();
      fixture.detectChanges();

      expect(pressedSpy).toHaveBeenCalledExactlyOnceWith(false);
      expect(confirmSpy).not.toHaveBeenCalled();
      expect(query('.modal')).toBeNull();
      expect(overlay().classList.contains('active')).toBe(false);
    });

    it('should close on overlay click when overlayClickCloseDialog is on', () => {
      const pressedSpy = vi.fn();

      component.pressed.subscribe(pressedSpy);
      open({ overlayClickCloseDialog: true });

      overlay().click();
      fixture.detectChanges();

      expect(pressedSpy).toHaveBeenCalledExactlyOnceWith(false);
      expect(query('.modal')).toBeNull();
    });

    it('should stay open on overlay click when overlayClickCloseDialog is off', () => {
      const pressedSpy = vi.fn();

      component.pressed.subscribe(pressedSpy);
      open({ overlayClickCloseDialog: false });

      overlay().click();
      fixture.detectChanges();

      expect(pressedSpy).not.toHaveBeenCalled();
      expect(query('.modal')).not.toBeNull();
    });

    describe('accessibility', () => {
      it('should expose the dialog as a modal labelled by its title', () => {
        open({ title: 'Confirm action' });
        const dialog = query('[role="dialog"]');
        const labelId = dialog.getAttribute('aria-labelledby');

        expect(dialog.getAttribute('aria-modal')).toBe('true');
        expect(labelId).toBe(component.titleId);
        expect(element.querySelector(`#${labelId}`).textContent.trim()).toBe('Confirm action');
      });

      it('should give every dialog instance a unique title id', () => {
        const other = TestBed.createComponent(DdataUiConfirmDialogComponent).componentInstance;

        expect(other.titleId).not.toBe(component.titleId);
      });

      it('should label the icon-only close button', () => {
        open();

        expect(query('.modal-header button').getAttribute('aria-label')).toBe('Close');
      });
    });
  });
});
