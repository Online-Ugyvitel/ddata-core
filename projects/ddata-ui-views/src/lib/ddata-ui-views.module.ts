import { NgModule } from '@angular/core';
import { ViewDateSeparatedListComponent } from './components/view-date-separated-list/view-date-separated-list.component';
import { ViewKanbanComponent } from './components/view-kanban/view-kanban.component';
const components = [ViewDateSeparatedListComponent, ViewKanbanComponent];

/**
 * The views are standalone components, this module is for the NgModule based applications.
 */
@NgModule({
  imports: components,
  exports: components
})
export class DdataUiViewsModule {}
