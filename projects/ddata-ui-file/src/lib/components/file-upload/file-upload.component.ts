import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { faCheckSquare, faCopy, faFolderOpen, faSquare, faTimes, faTrashAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FileUploadProcessInterface, ID, ProxyFactoryService, ProxyServiceInterface, SpinnerService, SpinnerServiceInterface } from 'ddata-core';
import { forkJoin, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DdataUiFileModule } from '../../ddata-ui-file.module';
import { fileText } from '../../i18n/file.lang';
import { FileModelInterface } from '../../models/file/file-model.interface';
import { FileModel } from '../../models/file/file.model';
import { ModuleConfiguration } from '../../models/module-configuration/module-configuration.interface';
import { FileAndFolderHelperService } from '../../services/file/file-and-folder-helper.service';

@Component({
    selector: 'dd-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css'],
    standalone: false
})
/**
 * @param {json} inputData JSON format data what will be send with every file as 'data' parameter in form
 */
export class DdataUiFileUploadComponent implements OnInit {
  @Inject('config') config: ModuleConfiguration = {lang: 'en'};
  i18n = fileText[this.config.lang];

  // tslint:disable-next-line: variable-name
  _inputData = {
    folder_id: 1 as ID,
  };
  @Input() set inputData(value: any) {
    this._inputData = value;
  }
  @Input() accpetedTypes = '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.pdf';
  @Output() changeFiles: EventEmitter<any> = new EventEmitter();
  @Output() fileUploadDone: EventEmitter<any> = new EventEmitter();
  @Output() saveModel: EventEmitter<FileModelInterface[]> = new EventEmitter();
  files: any;
  filesSet: Set<File> = new Set();
  fileData = [];
  fileselector: any;
  urls = [];
  isImage = [];
  fileTypes = [];
  uploadProgress = [];
  uploadIsDone = false;
  icon = {
    trash: faTrashAlt,
    files: faCopy,
    upload: faUpload,
    open: faFolderOpen,
    square: faSquare,
    check: faCheckSquare,
    times: faTimes,
  };
  progress = {};
  summaryProgressbar = 0;
  progresses = {};
  // fileService: ProxyServiceInterface<FileModelInterface> = new ProxyFactoryService<FileModelInterface>().get(FileModel);
  spinner: SpinnerServiceInterface = DdataUiFileModule.InjectorInstance.get<SpinnerServiceInterface>(SpinnerService);

  constructor(
    private helper: FileAndFolderHelperService,
  ) { }

  ngOnInit(): void {
  }

  getSum(total: number, num: number): number {
    return total + Math.round(num);
  }

  summarizeUploadProgress(): void {
    const reachLimit = this.urls.length * 100;
    let sum = 0;

    for (const value of Object.values(this.progress) ) {
      // tslint:disable-next-line: no-string-literal
      sum += value['percent'];
    }

    this.summaryProgressbar = sum / reachLimit * 100;
  }

  startUploadAll(): void {
    const allProgressObservables = [];

    // create observables for each files
    // this.fileService.sendFiles('upload', 0, this.filesSet, {}).forEach((observable: Observable<FileUploadProcessInterface>) => {
    //   allProgressObservables.push(
    //     observable.pipe(map((result: any) => Object.assign(this.progress, {[result.file]: result}) ))
    //   );
    // });

    // start upload, if done we emit the saveModel() and it closes the dialog
    this.spinner.on('file-upload');
    forkJoin(allProgressObservables).pipe(
      tap(() => {
        const uploadedFilesDatas: FileModelInterface[] = [];

        Object.keys(this.progress).forEach((element: string) => {
          uploadedFilesDatas.push(new FileModel().init(this.progress[element].file_on_server.file));
        });

        this.uploadIsDone = true;
        this.spinner.off('file-upload');
        this.saveModel.emit(uploadedFilesDatas);

      })
    ).subscribe();
  }

  readAndSetup(file: File): void {
    const reader = new FileReader();

    reader.onload = (event: any) => {
      this.urls.push( event.target.result );
      this.isImage.push(true);
      this.fileTypes.push('image');
      this.fileData.push(file);
    };

    if ( file.type.match(/^image\//) ) {
      reader.readAsDataURL(file);
    } else {
      // ezt a stringet a template dolgozza fel és ennek megfelelő ikont jelenít meg
      this.urls.push(file.type);
      this.isImage.push(false);
      this.fileTypes.push( this.helper.setFileType(file.type) );
      this.fileData.push(file);
    }
  }

  onSelectFile(files: FileList): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < Array.from(files).length; i++) {
      this.readAndSetup( Array.from(files)[i] );
      this.filesSet.add( Array.from(files)[i] );
      this.progress[ Array.from(files)[i].name ] = {progress: undefined, percent: 0};
    }
  }

  deleteFile(index: number): void {
    this.fileData.splice(index, 1);
    this.urls.splice(index, 1);
    this.isImage.splice(index, 1);
    this.fileTypes.splice(index, 1);
    this.uploadProgress.splice(index, 1);
  }

  close(): void {
    this.changeFiles.emit('close');
  }

}
