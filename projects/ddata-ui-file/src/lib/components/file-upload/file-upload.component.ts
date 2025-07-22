import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  faCheckSquare,
  faCopy,
  faFolderOpen,
  faSquare,
  faTimes,
  faTrashAlt,
  faUpload,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { ID, SpinnerService, SpinnerServiceInterface } from 'ddata-core';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DdataUiFileModule } from '../../ddata-ui-file.module';
import { fileText } from '../../i18n/file.lang';
import { FileModelInterface } from '../../models/file/file-model.interface';
import { FileModel } from '../../models/file/file.model';
import { ModuleConfigurationInterface } from '../../models/module-configuration/module-configuration.interface';
import { FileAndFolderHelperService } from '../../services/file/file-and-folder-helper.service';

@Component({
  selector: 'dd-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
/**
 * @param {json} inputData JSON format data what will be send with every file as 'data' parameter in form
 */
export class DdataUiFileUploadComponent {
  @Input() accpetedTypes = '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.pdf';

  @Input() set inputData(value: Record<string, unknown>) {
    this._inputData = value;
  }

  @Output() readonly changeFiles: EventEmitter<Array<FileModelInterface>> = new EventEmitter();
  @Output() readonly fileUploadDone: EventEmitter<Array<FileModelInterface>> = new EventEmitter();
  @Output() readonly saveModel: EventEmitter<Array<FileModelInterface>> = new EventEmitter();

  @Inject('config') config: ModuleConfigurationInterface = { lang: 'en' };

  // tslint:disable-next-line: variable-name
  _inputData: Record<string, unknown> = {
    folder_id: 1 as ID
  };

  i18n = fileText[this.config.lang];
  files: FileList | null = null;
  filesSet: Set<File> = new Set();
  fileData: Array<File> = [];
  fileselector: HTMLInputElement | null = null;
  urls: Array<string> = [];
  isImage: Array<boolean> = [];
  fileTypes: Array<string> = [];
  fileIcons: Array<IconDefinition> = [];
  uploadProgress: Array<number> = [];
  uploadIsDone = false;
  icon = {
    trash: faTrashAlt,
    files: faCopy,
    upload: faUpload,
    open: faFolderOpen,
    square: faSquare,
    check: faCheckSquare,
    times: faTimes
  };

  progress: Record<string, unknown> = {};
  summaryProgressbar = 0;
  progresses: Record<string, unknown> = {};

  spinner: SpinnerServiceInterface =
    DdataUiFileModule.InjectorInstance.get<SpinnerServiceInterface>(SpinnerService);

  constructor(private readonly helper: FileAndFolderHelperService) {}

  getSum(total: number, num: number): number {
    return total + Math.round(num);
  }

  summarizeUploadProgress(): void {
    const reachLimit = this.urls.length * 100;
    let sum = 0;

    for (const value of Object.values(this.progress)) {
      // tslint:disable-next-line: no-string-literal
      sum += value['percent'];
    }

    this.summaryProgressbar = (sum / reachLimit) * 100;
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
    forkJoin(allProgressObservables)
      .pipe(
        tap(() => {
          const uploadedFilesDatas: Array<FileModelInterface> = [];

          Object.keys(this.progress).forEach((element: string) => {
            const progressItem = this.progress[element] as {
              file_on_server: { file: unknown };
            };

            uploadedFilesDatas.push(new FileModel().init(progressItem.file_on_server.file));
          });

          this.uploadIsDone = true;
          this.spinner.off('file-upload');
          this.saveModel.emit(uploadedFilesDatas);
        })
      )
      .subscribe();
  }

  readAndSetup(file: File): void {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>): void => {
      if (event.target?.result && typeof event.target.result === 'string') {
        this.urls.push(event.target.result);
        this.isImage.push(true);
        this.fileTypes.push('image');
        this.fileData.push(file);
      }
    };

    if (file.type.match(/^image\//)) {
      reader.readAsDataURL(file);
    } else {
      // ezt a stringet a template dolgozza fel és ennek megfelelő ikont jelenít meg
      this.urls.push(file.type);
      this.isImage.push(false);
      this.fileTypes.push(file.type);
      this.fileIcons.push(this.helper.setFileType(file.type));
      this.fileData.push(file);
    }
  }

  onSelectFile(files: FileList): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < Array.from(files).length; i++) {
      this.readAndSetup(Array.from(files)[i]);
      this.filesSet.add(Array.from(files)[i]);
      this.progress[Array.from(files)[i].name] = { progress: undefined, percent: 0 };
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
    this.changeFiles.emit([]);
  }
}
