import { Component } from '@angular/core';
import { BaseListComponent } from '../base-list.component';
import { TestModelInterface } from './test-model.interface';
import { TestModel } from './test-model.class';

// Concrete test component extending the abstract BaseListComponent
@Component({
  template: '<div>Test List Component</div>',
  standalone: false
})
export class TestListComponent extends BaseListComponent<TestModelInterface> {
  constructor() {
    super(TestModel);
  }
}