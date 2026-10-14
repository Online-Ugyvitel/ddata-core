// @ts-nocheck -- generated spec uses loosely typed mock models, events and private members
import { ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DdataUiConfirmDialogComponent } from './confirm-dialog.component';
import { DialogType } from '../../models/dialog/dialog.interface';
import { DdataUiDialogModule } from '../../ddata-ui-dialog.module';
import { DdataUiModalDialogComponent } from '../modal-dialog/modal-dialog.component';

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

@Component({
  selector: 'dd-test-confirm-host',
  imports: [DdataUiDialogModule],
  template: `<button type="button" class="opener">Delete</button>
    <dd-modal-dialog title="Parent" [showDialog]="showModal"></dd-modal-dialog>
    <dd-confirm-dialog
      title="Sure?"
      [(showDialog)]="show"
      [overlayClickCloseDialog]="overlayClose"
      (pressed)="pressed.push($event)"
      (confirm)="confirms = confirms + 1"
    ></dd-confirm-dialog>`
})
class TestConfirmHostComponent {
  show = false;
  showModal = false;
  overlayClose = true;
  pressed: Array<boolean> = [];
  confirms = 0;
}

describe('DdataUiConfirmDialogComponent rendered in a host', () => {
  let fixture: ComponentFixture<TestConfirmHostComponent>;
  let host: TestConfirmHostComponent;
  let element: HTMLElement;
  const render = (changes: Partial<TestConfirmHostComponent> = {}): void => {
    Object.assign(host, changes);
    fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();
  };
  const confirmElement = (): HTMLElement =>
    fixture.debugElement.query(By.directive(DdataUiConfirmDialogComponent)).nativeElement;
  const modalElement = (): HTMLElement =>
    fixture.debugElement.query(By.directive(DdataUiModalDialogComponent)).nativeElement;
  const confirmModal = (): HTMLElement | null => confirmElement().querySelector('.modal');
  const keydown = (key: string, shiftKey = false): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true });

    document.activeElement.dispatchEvent(event);
    fixture.detectChanges();

    return event;
  };
  const buttons = (): Array<HTMLElement> =>
    Array.from(confirmElement().querySelectorAll<HTMLElement>('.modal button'));

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestConfirmHostComponent] });
    fixture = TestBed.createComponent(TestConfirmHostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should close on Escape like the cancel button', () => {
    render({ show: true });
    const event = keydown('Escape');

    expect(event.defaultPrevented).toBe(true);
    expect(confirmModal()).toBeNull();
    expect(host.pressed).toEqual([false]);
    expect(host.confirms).toBe(0);
    expect(host.show).toBe(false);
  });

  it('should ignore Escape while closed', () => {
    const event = keydown('Escape');

    expect(event.defaultPrevented).toBe(false);
    expect(host.pressed).toEqual([]);
  });

  it('should close only the topmost dialog on Escape', () => {
    render({ showModal: true });
    render({ show: true });

    keydown('Escape');

    expect(confirmModal()).toBeNull();
    expect(modalElement().querySelector('.modal')).not.toBeNull();

    keydown('Escape');

    expect(modalElement().querySelector('.modal')).toBeNull();
    expect(host.pressed).toEqual([false]);
  });

  it.each([
    ['confirm', 1, true],
    ['cancel', 2, false]
  ])(
    'should reopen with [(showDialog)] after %s',
    (_name: string, buttonIndex: number, result: boolean) => {
      render({ show: true });
      buttons()[buttonIndex].click();
      fixture.detectChanges();

      expect(host.show).toBe(false);
      expect(confirmModal()).toBeNull();

      render({ show: true });

      expect(confirmModal()).not.toBeNull();
      expect(host.pressed).toEqual([result]);
    }
  );

  it('should keep the focus where it is when it is opened again while open', () => {
    const dialog = fixture.debugElement.query(
      By.directive(DdataUiConfirmDialogComponent)
    ).componentInstance;

    render({ show: true });
    buttons()[2].focus();

    dialog.showDialog = true;

    expect(document.activeElement).toBe(buttons()[2]);
    expect(confirmElement().querySelectorAll('.modal').length).toBe(1);
  });

  it('should not emit showDialogChange when the parent closes the dialog', () => {
    const dialog = fixture.debugElement.query(
      By.directive(DdataUiConfirmDialogComponent)
    ).componentInstance;
    const changes = vi.fn();

    dialog.showDialogChange.subscribe(changes);
    render({ show: true });
    render({ show: false });

    expect(confirmModal()).toBeNull();
    expect(changes).not.toHaveBeenCalled();
    expect(host.pressed).toEqual([]);
  });

  it('should move the focus into the dialog on open and restore it on close', () => {
    const opener = element.querySelector<HTMLElement>('.opener');

    opener.focus();
    render({ show: true });

    expect(document.activeElement).toBe(buttons()[0]);

    buttons()[2].click();
    fixture.detectChanges();

    expect(document.activeElement).toBe(opener);
  });

  it('should keep Tab and Shift+Tab inside the dialog', () => {
    render({ show: true });
    const [first, middle, last] = buttons();

    last.focus();
    expect(keydown('Tab').defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);

    expect(keydown('Tab', true).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);

    middle.focus();
    expect(keydown('Tab').defaultPrevented).toBe(false);
  });

  it('should close on a click on the backdrop area but not inside the dialog box', () => {
    render({ show: true });

    confirmElement().querySelector<HTMLElement>('.modal-content').click();
    fixture.detectChanges();

    expect(confirmModal()).not.toBeNull();

    confirmModal().click();
    fixture.detectChanges();

    expect(confirmModal()).toBeNull();
    expect(host.pressed).toEqual([false]);
    expect(host.show).toBe(false);
  });

  it('should stay open on a backdrop click when overlayClickCloseDialog is off', () => {
    render({ show: true, overlayClose: false });

    confirmModal().click();
    fixture.detectChanges();

    expect(confirmModal()).not.toBeNull();
    expect(host.pressed).toEqual([]);
  });

  it('should give the focus back when it is destroyed while open', () => {
    const outside = document.createElement('button');

    document.body.appendChild(outside);
    outside.focus();
    render({ show: true });
    fixture.destroy();

    expect(document.activeElement).toBe(outside);
    outside.remove();
  });
});
