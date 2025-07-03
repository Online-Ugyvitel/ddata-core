import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ModuleConfiguration } from './models/module-configuration/module-configuration.interface';

import { DdataUiLoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { DdataUiNoDataComponent } from './components/no-data/no-data.component';
import { DdataUiNotificationComponent } from './components/notification/notification.component';
import { DdataUiPaginateComponent } from './components/paginate/paginate.component';
import { DdataUiProgressbarComponent } from './components/progressbar/progressbar.component';
import { DdataUiTagComponent } from './components/tag/tag.component';
import { DdataUiUserThumbnailComponent } from './components/user-profile-thumbnail/user-profile-thumbnail.component';

// @dynamic
@NgModule({
  declarations: [
    DdataUiNoDataComponent,
    DdataUiNotificationComponent,
    DdataUiLoadingOverlayComponent,
    DdataUiPaginateComponent,
    DdataUiProgressbarComponent,
    DdataUiTagComponent,
    DdataUiUserThumbnailComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  exports: [
    DdataUiNoDataComponent,
    DdataUiNotificationComponent,
    DdataUiLoadingOverlayComponent,
    DdataUiProgressbarComponent,
    DdataUiTagComponent,
    DdataUiUserThumbnailComponent,
  ]
})
export class DdataUiCommonModule {
  static InjectorInstance: Injector;

  constructor(injector: Injector) {
    DdataUiCommonModule.InjectorInstance = injector;
  }

  static forRoot(config: ModuleConfiguration): ModuleWithProviders<any> {
    return {
      ngModule: DdataUiCommonModule,
    };
  }
}
