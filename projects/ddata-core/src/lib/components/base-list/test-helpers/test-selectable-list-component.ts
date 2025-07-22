import { Component, Inject } from '@angular/core';
import { SelectableListComponent } from '../selectable-list.component';
import { TestModel } from './test-model';

// Concrete implementation of SelectableListComponent for testing
@Component({
  template: '<div></div>',
  standalone: false
})
export class TestSelectableListComponent extends SelectableListComponent<TestModel> {
  constructor(@Inject('type') type: new () => TestModel) {
    super(type);
  }
}