import { NgModule, ModuleWithProviders, Injector } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// services
import { ProxyService } from 'ddata-core';

// module configuration
import { ModuleConfigurationInterface } from './models/module-configuration/module-configuration.interface';

// models
import { FileModel } from 'projects/ddata-ui-file/src/lib/models/file/file.model';

// components
import { CommonModule } from '@angular/common';
import { DdataUiFileListComponent } from 'projects/ddata-ui-file/src/lib/components/file-list/file-list.component';
import { DdataUiFileUploadComponent } from 'projects/ddata-ui-file/src/lib/components/file-upload/file-upload.component';
import { DdataUiNoDataComponent } from 'ddata-ui-common';

@NgModule({
  declarations: [DdataUiFileListComponent, DdataUiFileUploadComponent, DdataUiNoDataComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [DdataUiFileListComponent, DdataUiFileUploadComponent, DdataUiNoDataComponent],
  providers: [ProxyService]
})
export class DdataUiModule {
  static InjectorInstance: Injector;

  constructor(injector: Injector) {
    DdataUiModule.InjectorInstance = injector;
  }

  static forRoot(config: ModuleConfigurationInterface): ModuleWithProviders<DdataUiModule> {
    return {
      ngModule: DdataUiModule,
      providers: [FileModel, { provide: 'config', useValue: config }]
    };
  }
}
