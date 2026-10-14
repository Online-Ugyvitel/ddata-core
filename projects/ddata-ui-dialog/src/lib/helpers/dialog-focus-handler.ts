const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[contenteditable="true"]',
  '[tabindex]'
].join(',');
// The open dialogs in opening order: only the last one (the topmost) reacts to the keyboard.
const openDialogs: Array<DialogFocusHandler> = [];

/**
 * Keyboard and focus handling shared by the dialogs: moves the focus into the dialog when it
 * opens, keeps Tab / Shift+Tab inside it, closes it on Escape and gives the focus back to the
 * previously focused element when it closes.
 */
export class DialogFocusHandler {
  private previouslyFocused: HTMLElement | null = null;

  constructor(private readonly document: Document) {}

  get isOpen(): boolean {
    return openDialogs.includes(this);
  }

  get isTopmost(): boolean {
    return openDialogs[openDialogs.length - 1] === this;
  }

  /** Remember the focused element; call it before the dialog is rendered. */
  open(): void {
    if (this.isOpen) {
      return;
    }

    this.previouslyFocused = this.document.activeElement as HTMLElement | null;
    openDialogs.push(this);
  }

  /** Move the focus to the first focusable element of the dialog, or to the dialog itself. */
  focusFirst(dialog: HTMLElement | undefined): void {
    if (!dialog) {
      return;
    }

    (this.focusableElements(dialog)[0] ?? dialog).focus();
  }

  /** Forget the dialog and give the focus back to the element that was focused before opening. */
  close(): void {
    if (!this.isOpen) {
      return;
    }

    openDialogs.splice(openDialogs.indexOf(this), 1);
    const previous = this.previouslyFocused;

    this.previouslyFocused = null;

    if (previous?.isConnected) {
      previous.focus();
    }
  }

  /**
   * Handle a document keydown for the dialog. Returns true when the event was an Escape that the
   * dialog has to answer by closing itself. Tab and Shift+Tab are kept inside the dialog.
   */
  handleKeydown(event: KeyboardEvent, dialog: HTMLElement | undefined): boolean {
    if (event.defaultPrevented || !this.isTopmost || !dialog) {
      return false;
    }

    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();

      return true;
    }

    if (event.key === 'Tab') {
      this.trapTab(event, dialog);
    }

    return false;
  }

  private trapTab(event: KeyboardEvent, dialog: HTMLElement): void {
    const focusable = this.focusableElements(dialog);
    const active = this.document.activeElement as HTMLElement | null;

    if (focusable.length === 0) {
      event.preventDefault();
      dialog.focus();

      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const isOutside = !active || !dialog.contains(active) || active === dialog;

    if (event.shiftKey && (isOutside || active === first)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (isOutside || active === last)) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusableElements(dialog: HTMLElement): Array<HTMLElement> {
    return Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
      (element) => element.getAttribute('tabindex') !== '-1'
    );
  }
}
