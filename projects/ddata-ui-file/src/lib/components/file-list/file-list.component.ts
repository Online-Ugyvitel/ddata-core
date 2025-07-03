import { Component, Inject, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { DialogContentItem } from 'ddata-ui-input';
import { fileText } from '../../i18n/file.lang';
import { FileModelInterface } from '../../models/file/file-model.interface';
import { Global } from '../../models/global.model';
import { ModuleConfiguration } from '../../models/module-configuration/module-configuration.interface';
import { FileAndFolderHelperServiceInterface } from '../../services/file/file-and-folder-helper-service.interface';
import { FileAndFolderHelperService } from '../../services/file/file-and-folder-helper.service';
import { DdataUiFileUploadComponent } from '../file-upload/file-upload.component';

interface HasFileModel {
  files: FileModelInterface[];
}

@Component({
    selector: 'dd-file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.css'],
    standalone: false
})
export class DdataUiFileListComponent implements OnInit {
  @Inject('config') private config: ModuleConfiguration = {lang: 'en'};
  i18n = fileText[this.config.lang];

  @Input() model: HasFileModel = {files: []};
  @Input() showNoData = true;

  fileUploadDialogContent: DialogContentItem = new DialogContentItem(DdataUiFileUploadComponent, {});
  showDialog = false;
  icon = new Global().icon;
  token = localStorage.getItem('token');
  private helper: FileAndFolderHelperServiceInterface = new FileAndFolderHelperService();

  constructor() {}

  ngOnInit(): void {
  }

  delete(file: FileModelInterface): void {
    this.model.files.splice(this.model.files.findIndex(obj => obj === file), 1);
  }

  fileuploadSuccess(files: FileModelInterface[]): void {
    this.model.files = [...this.model.files, ...files];
    this.showDialog = false;
  }

  openDialog(): void {
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
  }

  setPrimaryImage(file: FileModelInterface): void {
    this.model.files.forEach((fileModel: FileModelInterface) => {
      fileModel.is_primary = false;
    });

    // tslint:disable-next-line: variable-name
    const found = this.model.files.find((_file: FileModelInterface) => _file.file_name_slug === file.file_name_slug);

    if (!!found) {
      found.is_primary = true;
    }
  }

  fileType(file: FileModelInterface): IconDefinition {
    return this.helper.setFileType(file.mimetype);
  }
}
