import { Component } from '@angular/core';
import { DialogContentWithOptions } from './dialog-content-with-options';

@Component({ selector: 'dd-test', template: '', standalone: false })
class TestComponent {}

describe('DialogContentWithOptions', () => {
  it('should hold the given component and options', () => {
    const options = { isModal: true, loadData: false };
    const content = new DialogContentWithOptions(TestComponent, options);

    expect(content.component).toBe(TestComponent);
    expect(content.options).toBe(options);
  });

  it('should accept missing component and options', () => {
    const content = new DialogContentWithOptions(undefined, null);

    expect(content.component).toBeUndefined();
    expect(content.options).toBeNull();
  });
});
