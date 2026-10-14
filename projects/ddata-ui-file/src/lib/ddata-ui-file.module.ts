import { CommonModule } from '@angular/common';
import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DdataCoreModule } from '@netdjw/ddata-core';
import { DdataUiCommonModule } from '@netdjw/ddata-ui-common';
import { DdataUiDialogModule } from '@netdjw/ddata-ui-dialog';
import { DdataUiFileListComponent } from './components/file-list/file-list.component';
import { DdataUiFileUploadComponent } from './components/file-upload/file-upload.component';
import { FileModel } from './models/file/file.model';
import { ModuleConfigurationInterface } from './models/module-configuration/module-configuration.interface';
import { FilesizePipe } from './pipes/filesize/filesize.pipe';

@NgModule({
  declarations: [DdataUiFileListComponent, DdataUiFileUploadComponent, FilesizePipe],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    DdataCoreModule,
    DdataUiCommonModule,
    DdataUiDialogModule
  ],
  exports: [DdataUiFileListComponent, DdataUiFileUploadComponent, FilesizePipe]
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
