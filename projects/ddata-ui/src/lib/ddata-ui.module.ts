import { CommonModule } from '@angular/common';
import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DdataUiCommonModule } from '@netdjw/ddata-ui-common';
import { DdataUiDialogModule } from '@netdjw/ddata-ui-dialog';

// module configuration
import { ModuleConfigurationInterface } from './models/module-configuration/module-configuration.interface';

// components
import { CharacterCounterComponent } from './components/input-extensions/character-counter/character-counter.component';
import { XlsButtonExportComponent } from './components/list-extensions/download-buttons/xls-button-export.component';
import { ListButtonsComponent } from './components/list-extensions/list-buttons/list-buttons.component';
import { ListDropdownDeleteConfirmComponent } from './components/list-extensions/list-dropdown/list-dropdown-delete-confirm/list-dropdown-delete-confirm.component';
import { ListDropdownComponent } from './components/list-extensions/list-dropdown/list-dropdown.component';
import { ShowSearchParametersComponent } from './components/other/show-search-parameters/show-search-parameters.component';
import { TabButtonComponent } from './components/other/tab-button/tab-button.component';
const components = [
  CharacterCounterComponent,
  XlsButtonExportComponent,
  ListButtonsComponent,
  ListDropdownDeleteConfirmComponent,
  ListDropdownComponent,
  ShowSearchParametersComponent,
  TabButtonComponent
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatMenuModule,
    FontAwesomeModule,
    DdataUiCommonModule,
    DdataUiDialogModule
  ],
  exports: components
})
export class DdataUiModule {
  static InjectorInstance: Injector;

  constructor(injector: Injector) {
    DdataUiModule.InjectorInstance = injector;
  }

  static forRoot(config: ModuleConfigurationInterface): ModuleWithProviders<DdataUiModule> {
    return {
      ngModule: DdataUiModule,
      providers: [{ provide: 'config', useValue: config }]
    };
  }
}
