import { DialogFocusHandler } from './dialog-focus-handler';

describe('DialogFocusHandler', () => {
  let handlers: Array<DialogFocusHandler>;
  let dialog: HTMLElement;
  let outside: HTMLButtonElement;
  const create = (doc: Document = document): DialogFocusHandler => {
    const handler = new DialogFocusHandler(doc);

    handlers.push(handler);

    return handler;
  };
  const tab = (shiftKey = false): KeyboardEvent =>
    new KeyboardEvent('keydown', { key: 'Tab', shiftKey, cancelable: true });

  beforeEach(() => {
    handlers = [];
    outside = document.createElement('button');
    dialog = document.createElement('div');
    dialog.tabIndex = -1;
    document.body.append(outside, dialog);
  });

  afterEach(() => {
    handlers.forEach((handler) => handler.close());
    outside.remove();
    dialog.remove();
  });

  it('should focus the dialog itself when it has no focusable element', () => {
    const handler = create();

    handler.open();
    handler.focusFirst(dialog);

    expect(document.activeElement).toBe(dialog);
  });

  it('should keep Tab on the dialog itself when it has no focusable element', () => {
    const handler = create();
    const event = tab();

    handler.open();
    outside.focus();

    expect(handler.handleKeydown(event, dialog)).toBe(false);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(dialog);
  });

  it('should do nothing without a rendered dialog element', () => {
    const handler = create();
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });

    handler.open();
    outside.focus();
    handler.focusFirst(undefined);

    expect(handler.handleKeydown(event, undefined)).toBe(false);
    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(outside);
  });

  it('should ignore an Escape that another dialog has already handled', () => {
    const handler = create();
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });

    handler.open();
    event.preventDefault();

    expect(handler.handleKeydown(event, dialog)).toBe(false);
  });

  it('should only let the topmost open dialog react, then the one below it', () => {
    const lower = create();
    const upper = create();

    lower.open();
    upper.open();

    expect(lower.isTopmost).toBe(false);
    expect(upper.isTopmost).toBe(true);
    expect(lower.handleKeydown(new KeyboardEvent('keydown', { key: 'Escape' }), dialog)).toBe(
      false
    );

    upper.close();

    expect(lower.isTopmost).toBe(true);
    expect(upper.isOpen).toBe(false);
  });

  it('should register a dialog only once and close it only once', () => {
    const handler = create();
    const other = create();

    outside.focus();
    handler.open();
    dialog.focus();
    handler.open();
    other.open();

    handler.close();

    expect(document.activeElement).toBe(outside);
    expect(other.isTopmost).toBe(true);

    dialog.focus();
    handler.close();

    expect(document.activeElement).toBe(dialog);
  });

  it('should not restore the focus to an element that left the document', () => {
    const handler = create();

    outside.focus();
    handler.open();
    dialog.focus();
    outside.remove();
    handler.close();

    expect(document.activeElement).toBe(dialog);
  });

  it('should cope with a document without an active element', () => {
    const handler = create({ activeElement: null } as unknown as Document);

    handler.open();
    dialog.focus();
    handler.close();

    expect(handler.isOpen).toBe(false);
    expect(document.activeElement).toBe(dialog);
  });

  it('should pull the focus back into a dialog when nothing is focused', () => {
    const button = document.createElement('button');
    const handler = create({ activeElement: null } as unknown as Document);
    const event = tab(true);

    dialog.appendChild(button);
    handler.open();

    handler.handleKeydown(event, dialog);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(button);
  });
});
