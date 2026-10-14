import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  inject,
  Input,
  OnDestroy,
  Optional,
  Output
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
import {
  FileUploadProcessInterface,
  SpinnerService,
  SpinnerServiceInterface
} from '@netdjw/ddata-core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { last, tap } from 'rxjs/operators';
import { fileText } from '../../i18n/file.lang';
import { FileModelInterface } from '../../models/file/file-model.interface';
import { FileModel } from '../../models/file/file.model';
import { ModuleConfigurationInterface } from '../../models/module-configuration/module-configuration.interface';
import { FileAndFolderHelperService } from '../../services/file/file-and-folder-helper.service';
import { FileService } from '../../services/file/file.service';

export interface FileUploadProgressInterface {
  /**
   * observable upload progress of the file, set when its upload has been started
   */
  progress?: Observable<number>;

  /**
   * upload progress of the file in percent
   */
  percent: number;
}

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
export class DdataUiFileUploadComponent implements OnDestroy {
  @Input() accpetedTypes = '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.pdf';

  @Input() set inputData(value: Record<string, unknown>) {
    this._inputData = value;
  }

  @Output() readonly changeFiles: EventEmitter<Array<FileModelInterface>> = new EventEmitter();
  @Output() readonly fileUploadDone: EventEmitter<Array<FileModelInterface>> = new EventEmitter();
  @Output() readonly saveModel: EventEmitter<Array<FileModelInterface>> = new EventEmitter();
  @Output() readonly uploadFailed: EventEmitter<HttpErrorResponse> = new EventEmitter();

  private readonly fileService = inject(FileService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private uploadSubscription: Subscription | null = null;

  config: ModuleConfigurationInterface;

  // tslint:disable-next-line: variable-name
  _inputData: Record<string, unknown> = {
    folder_id: 1
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  i18n: Record<string, any>;
  filesSet: Set<File> = new Set();
  fileData: Array<File> = [];
  urls: Array<string> = [];
  isImage: Array<boolean> = [];
  fileTypes: Array<string> = [];
  fileIcons: Array<IconDefinition> = [];
  uploadIsDone = false;
  hasUploadError = false;
  icon = {
    trash: faTrashAlt,
    files: faCopy,
    upload: faUpload,
    open: faFolderOpen,
    square: faSquare,
    check: faCheckSquare,
    times: faTimes
  };

  progress: Record<string, FileUploadProgressInterface> = {};
  summaryProgressbar = 0;

  spinner: SpinnerServiceInterface = inject(SpinnerService);

  constructor(
    private readonly helper: FileAndFolderHelperService,
    @Optional() @Inject('config') config?: ModuleConfigurationInterface | null
  ) {
    this.config = config ?? { lang: 'en' };
    this.i18n = fileText[this.config.lang];
  }

  get isUploading(): boolean {
    return this.uploadSubscription !== null;
  }

  getSum(total: number, num: number): number {
    return total + Math.round(num);
  }

  summarizeUploadProgress(): void {
    const values = Object.values(this.progress);

    if (values.length === 0) {
      this.summaryProgressbar = 0;

      return;
    }
    const sum = values.reduce(
      (total: number, item: FileUploadProgressInterface) => total + item.percent,
      0
    );

    this.summaryProgressbar = (sum / (values.length * 100)) * 100;
  }

  startUploadAll(): void {
    if (this.filesSet.size === 0 || this.isUploading) {
      return;
    }
    // every file is uploaded in its own request, the last event of a request is the response of the server
    const uploads = this.fileService
      .sendFiles('/upload', 0, this.filesSet, this._inputData)
      .map((upload: Observable<FileUploadProcessInterface>) =>
        upload.pipe(
          tap((result: FileUploadProcessInterface) => this.trackProgress(result)),
          last()
        )
      );

    this.hasUploadError = false;
    this.uploadIsDone = false;
    this.spinner.on('file-upload');

    // if every file is uploaded we emit the saveModel() and it closes the dialog
    this.uploadSubscription = forkJoin(uploads).subscribe({
      next: (results: Array<FileUploadProcessInterface>) => {
        const uploadedFilesDatas: Array<FileModelInterface> = results.map(
          (result: FileUploadProcessInterface) => new FileModel().init(result.remoteFileDatas)
        );

        this.uploadIsDone = true;
        this.finishUpload();
        this.fileUploadDone.emit(uploadedFilesDatas);
        this.saveModel.emit(uploadedFilesDatas);
      },
      error: (error: HttpErrorResponse) => {
        this.hasUploadError = true;
        this.resetProgress();
        this.finishUpload();
        this.uploadFailed.emit(error);
      }
    });
  }

  cancelUpload(): void {
    if (!this.uploadSubscription) {
      return;
    }

    this.uploadSubscription.unsubscribe();
    this.resetProgress();
    this.finishUpload();
  }

  readAndSetup(file: File): void {
    if (file.type.match(/^image\//)) {
      const reader = new FileReader();

      reader.onload = (): void => {
        // the file could be removed from the list while it was read
        if (this.filesSet.has(file)) {
          this.addToList(file, reader.result as string, true);
          this.changeDetector.markForCheck();
        }
      };

      reader.readAsDataURL(file);
    } else {
      // the template shows an icon by the type of the file instead of a preview
      this.addToList(file, file.type, false);
    }
  }

  onSelectFile(files: FileList | Array<File> | null): void {
    // the list can not be changed while its files are uploading
    if (this.isUploading) {
      return;
    }

    Array.from(files ?? []).forEach((file: File) => {
      // the progress is tracked by the file name, so a file with the same name replaces the previous one
      this.removeFileByName(file.name);
      this.filesSet.add(file);
      this.progress[file.name] = { percent: 0 };
      this.readAndSetup(file);
    });
  }

  deleteFile(index: number): void {
    if (this.isUploading || index < 0 || index >= this.fileData.length) {
      return;
    }
    const [file] = this.fileData.splice(index, 1);

    this.urls.splice(index, 1);
    this.isImage.splice(index, 1);
    this.fileTypes.splice(index, 1);
    this.fileIcons.splice(index, 1);
    this.filesSet.delete(file);
    delete this.progress[file.name];
  }

  close(): void {
    this.cancelUpload();
    this.changeFiles.emit([]);
  }

  ngOnDestroy(): void {
    this.cancelUpload();
  }

  private addToList(file: File, url: string, isImage: boolean): void {
    this.urls.push(url);
    this.isImage.push(isImage);
    this.fileTypes.push(isImage ? 'image' : file.type);
    this.fileIcons.push(this.helper.setFileType(file.type));
    this.fileData.push(file);
  }

  private removeFileByName(name: string): void {
    this.filesSet.forEach((file: File) => {
      if (file.name === name) {
        this.filesSet.delete(file);
      }
    });
    delete this.progress[name];
    this.deleteFile(this.fileData.findIndex((file: File) => file.name === name));
  }

  private trackProgress(result: FileUploadProcessInterface): void {
    const item = this.progress[result.file];

    // every event of a request carries the same progress observable, so it is watched only once
    if (!item.progress) {
      item.progress = result.progress;
      result.progress.subscribe((percent: number) => {
        item.percent = percent;
        this.summarizeUploadProgress();
        this.changeDetector.markForCheck();
      });
    }

    if (result.remoteFileDatas !== null) {
      item.percent = 100;
      this.summarizeUploadProgress();
    }
  }

  private resetProgress(): void {
    Object.values(this.progress).forEach((item: FileUploadProgressInterface) => {
      item.progress = undefined;
      item.percent = 0;
    });
    this.summaryProgressbar = 0;
  }

  private finishUpload(): void {
    this.uploadSubscription = null;
    this.spinner.off('file-upload');
    this.changeDetector.markForCheck();
  }
}
