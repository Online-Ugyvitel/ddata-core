import { CommonModule } from '@angular/common';
import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DdataCoreModule } from 'ddata-core';
import { DdataUiCommonModule } from 'ddata-ui-common';
// import { DdataUiFileListComponent } from './c  omponents/file-list/file-list.component';
// import { DdataUiFileUploadComponent } from './components/file-upload/file-upload.component';
import { FileModel } from './models/file/file.model';
import { ModuleConfigurationInterface } from './models/module-configuration/module-configuration.interface';

@NgModule({
  declarations: [
    // DdataUiFileListComponent,
    // DdataUiFileUploadComponent,
  ],
  imports: [CommonModule, FormsModule, FontAwesomeModule, DdataCoreModule, DdataUiCommonModule],
  exports: [
    // DdataUiFileListComponent,
    // DdataUiFileUploadComponent,
  ]
})
export class DdataUiFileModule {
  static InjectorInstance: Injector;

  constructor(injector: Injector) {
    DdataUiFileModule.InjectorInstance = injector;
  }

  static forRoot(config: ModuleConfigurationInterface): ModuleWithProviders<DdataUiFileModule> {
    return {
      ngModule: DdataUiFileModule,
      providers: [FileModel, { provide: 'config', useValue: config }]
    };
  }
}
