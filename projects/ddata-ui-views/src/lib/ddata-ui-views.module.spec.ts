import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DdataUiViewsModule } from './ddata-ui-views.module';

@Component({
  imports: [DdataUiViewsModule],
  template: `
    <dd-view-kanban></dd-view-kanban>
    <dd-view-date-separated-list></dd-view-date-separated-list>
  `
})
class HostComponent {}

describe('DdataUiViewsModule', () => {
  it('should provide the views for the NgModule based applications', () => {
    const fixture = TestBed.createComponent(HostComponent);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('dd-view-kanban h3').textContent).toBe(
      'Kanban nézet'
    );
    expect(fixture.nativeElement.querySelector('dd-view-date-separated-list h3').textContent).toBe(
      'Dátum szerint csoportosított nézet'
    );
  });
});
