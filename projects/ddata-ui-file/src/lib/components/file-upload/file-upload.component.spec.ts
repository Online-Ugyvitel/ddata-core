import { HttpErrorResponse, HttpEventType, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { faFileImage, faFilePdf, faFileWord, faFile } from '@fortawesome/free-solid-svg-icons';
import { DdataCoreModule, SpinnerService } from '@netdjw/ddata-core';
import { DdataUiFileModule } from '../../ddata-ui-file.module';
import { FileModelInterface } from '../../models/file/file-model.interface';
import { FileModel } from '../../models/file/file.model';
import { ModuleConfigurationInterface } from '../../models/module-configuration/module-configuration.interface';
import { DdataUiFileUploadComponent } from './file-upload.component';

describe('DdataUiFileUploadComponent', () => {
  const apiUrl = 'http://api.test';
  const uploadUrl = `${apiUrl}/file/upload`;
  let fixture: ComponentFixture<DdataUiFileUploadComponent>;
  let component: DdataUiFileUploadComponent;
  let element: HTMLElement;
  let httpMock: HttpTestingController;
  let spinnerStates: Array<boolean>;
  let saved: Array<Array<FileModelInterface>>;
  let done: Array<Array<FileModelInterface>>;
  let failed: Array<HttpErrorResponse>;
  const create = (config?: ModuleConfigurationInterface): void => {
    TestBed.configureTestingModule({
      imports: [DdataUiFileModule, DdataCoreModule.forRoot({ apiUrl })],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ...(config ? [{ provide: 'config', useValue: config }] : [])
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    spinnerStates = [];
    TestBed.inject(SpinnerService)
      .watch()
      .subscribe((state: boolean) => spinnerStates.push(state));
    fixture = TestBed.createComponent(DdataUiFileUploadComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    saved = [];
    done = [];
    failed = [];
    component.saveModel.subscribe((files) => saved.push(files));
    component.fileUploadDone.subscribe((files) => done.push(files));
    component.uploadFailed.subscribe((error) => failed.push(error));
    fixture.detectChanges();
  };
  const fileInput = (): HTMLInputElement =>
    element.querySelector<HTMLInputElement>('input[type="file"]');
  const uploadButton = (): HTMLButtonElement =>
    element.querySelector<HTMLButtonElement>('.btn-secondary');
  const listedNames = (): Array<string> =>
    Array.from(element.querySelectorAll('h6')).map((title) => title.textContent?.trim() ?? '');
  const dropZone = (): HTMLElement => element.querySelector<HTMLElement>('.drop-zone');
  const rejectedText = (): string | undefined =>
    element.querySelector('.rejected-files')?.textContent?.trim();
  /** jsdom has no DataTransfer, so the drag events get a minimal one */
  const drag = (
    type: 'dragenter' | 'dragover' | 'dragleave' | 'drop',
    files: Array<File> = [],
    types: Array<string> = files.length > 0 ? ['Files'] : [],
    target: Element = dropZone()
  ): Event & { dataTransfer: { files: Array<File>; types: Array<string>; dropEffect: string } } => {
    const event = new Event(type, { bubbles: true, cancelable: true }) as Event & {
      dataTransfer: { files: Array<File>; types: Array<string>; dropEffect: string };
    };

    Object.defineProperty(event, 'dataTransfer', {
      value: { files, types, dropEffect: 'none' }
    });
    target.dispatchEvent(event);
    fixture.detectChanges();

    return event;
  };
  const deleteButtons = (): Array<HTMLButtonElement> =>
    Array.from(element.querySelectorAll<HTMLButtonElement>('button[title]'));
  /** select files like the browser does: set the files of the input and fire its change event */
  const select = (files: Array<File>): void => {
    Object.defineProperty(fileInput(), 'files', { value: files, configurable: true });
    fileInput().dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };
  const selectAndRead = async (files: Array<File>, expectedLength: number): Promise<void> => {
    select(files);
    await vi.waitFor(() => expect(component.fileData.length).toBe(expectedLength));
    fixture.detectChanges();
  };
  const pdf = (name = 'számla.pdf', content = 'pdf content'): File =>
    new File([content], name, { type: 'application/pdf' });
  const png = (name = 'kép.png'): File => new File(['png'], name, { type: 'image/png' });
  const startUpload = (): Array<TestRequest> => {
    uploadButton().click();
    fixture.detectChanges();

    return httpMock.match(uploadUrl);
  };
  const remote = (id: number, name: string): Record<string, unknown> => ({
    id,
    name,
    file_name_and_path: `/files/${name}`,
    size: 11,
    mimetype: 'application/pdf'
  });

  afterEach(() => {
    httpMock.verify({ ignoreCancelled: true });
  });

  describe('texts', () => {
    it('should show the english texts by default', () => {
      create();

      expect(element.querySelector('h1')?.textContent?.trim()).toBe('Upload files');
      expect(Array.from(element.querySelectorAll('h5')).map((h) => h.textContent?.trim())).toEqual([
        'Step 1',
        'Step 2'
      ]);
      expect(uploadButton().textContent?.trim()).toBe('Upload');
    });

    it('should show the hungarian texts with hungarian configuration', () => {
      create({ lang: 'hu' });

      expect(element.querySelector('h1')?.textContent?.trim()).toBe('Fájlok feltöltése');
      expect(Array.from(element.querySelectorAll('h5')).map((h) => h.textContent?.trim())).toEqual([
        '1. lépés',
        '2. lépés'
      ]);
    });
  });

  describe('file selection', () => {
    beforeEach(() => create());

    it('should accept the configured file types in the multiple file selector', () => {
      expect(fileInput().multiple).toBe(true);
      expect(fileInput().accept).toBe(component.accpetedTypes);

      fixture.componentRef.setInput('accpetedTypes', '.pdf');
      fixture.detectChanges();

      expect(fileInput().accept).toBe('.pdf');
    });

    it('should open the file selector of the browser by clicking the drop zone', () => {
      const click = vi.spyOn(fileInput(), 'click').mockImplementation(() => undefined);

      dropZone().click();

      expect(click).toHaveBeenCalledTimes(1);
    });

    it.each(['Enter', ' '])(
      'should open the file selector with the %j key on the focused drop zone',
      (key) => {
        const click = vi.spyOn(fileInput(), 'click').mockImplementation(() => undefined);
        const keydown = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });

        dropZone().dispatchEvent(keydown);

        expect(click).toHaveBeenCalledTimes(1);
        // the page must not scroll by the space key
        expect(keydown.defaultPrevented).toBe(true);
      }
    );

    it('should make the drop zone reachable and described for keyboard and screen reader users', () => {
      expect(dropZone().getAttribute('role')).toBe('button');
      expect(dropZone().getAttribute('tabindex')).toBe('0');
      expect(dropZone().getAttribute('aria-label')).toBe('Drag files here or browse');
      expect(dropZone().querySelector('.drop-zone-text')?.textContent?.trim()).toBe(
        'Drag files here or browse'
      );
      // there is no other interactive element in the zone
      expect(dropZone().querySelector('button, input, a')).toBeNull();
    });

    it('should disable the upload button until a file is selected', () => {
      expect(uploadButton().disabled).toBe(true);

      select([pdf()]);

      expect(uploadButton().disabled).toBe(false);
    });

    it('should list the selected files with their size and type icon', () => {
      select([
        pdf('számla.pdf', 'x'.repeat(1024 * 1024)),
        new File(['doc'], 'levél.docx', { type: 'application/msword' })
      ]);

      expect(listedNames()).toEqual(['számla.pdf', 'levél.docx']);
      expect(element.querySelector('.col-sm-8 .text-muted')?.textContent?.trim()).toBe(
        'Size: 1 MB'
      );
      expect(
        Array.from(element.querySelectorAll('fa-icon[size="3x"] svg')).map((svg) =>
          svg.getAttribute('data-icon')
        )
      ).toEqual([faFilePdf.iconName, faFileWord.iconName]);
      expect(component.fileIcons).toEqual([faFilePdf, faFileWord]);
      expect(component.isImage).toEqual([false, false]);
      expect(component.filesSet.size).toBe(2);
      expect(component.progress).toEqual({
        'számla.pdf': { percent: 0 },
        'levél.docx': { percent: 0 }
      });
    });

    it('should reset the file selector so the same file can be selected again', () => {
      select([pdf()]);

      expect(fileInput().value).toBe('');
    });

    it('should show a preview of the selected images', async () => {
      await selectAndRead([png()], 1);
      const img = element.querySelector('img');

      expect(img?.getAttribute('src')).toBe(`data:image/png;base64,${btoa('png')}`);
      expect(img?.getAttribute('alt')).toBe('kép.png');
      expect(component.isImage).toEqual([true]);
      expect(component.fileTypes).toEqual(['image']);
      expect(component.fileIcons).toEqual([faFileImage]);
    });

    it('should handle images and other files selected together', async () => {
      await selectAndRead([png('a.png'), pdf('b.pdf'), png('c.png')], 3);

      // the images are listed when the browser has read them
      expect(listedNames().sort()).toEqual(['a.png', 'b.pdf', 'c.png']);
      expect(element.querySelectorAll('img').length).toBe(2);
      expect(component.filesSet.size).toBe(3);
    });

    it('should do nothing when no file is selected', () => {
      select([]);
      component.onSelectFile(null);
      fixture.detectChanges();

      expect(listedNames()).toEqual([]);
      expect(component.filesSet.size).toBe(0);
      expect(uploadButton().disabled).toBe(true);
    });

    it('should list an empty file without size', () => {
      select([new File([], 'üres.pdf', { type: 'application/pdf' })]);

      expect(listedNames()).toEqual(['üres.pdf']);
      expect(element.querySelector('.col-sm-8 .text-muted')?.textContent?.trim()).toBe('Size:  MB');
    });

    it('should show the unknown file icon when the browser could not detect the type', () => {
      // without accepted types every file is allowed
      fixture.componentRef.setInput('accpetedTypes', '');
      select([new File(['?'], 'README')]);

      expect(component.fileIcons).toEqual([faFile]);
      expect(component.fileTypes).toEqual(['']);
    });

    it('should list a very long and accented file name as it is', () => {
      const name = `${'árvíztűrő tükörfúrógép '.repeat(10)}.pdf`;

      select([pdf(name)]);

      expect(listedNames()).toEqual([name.trim()]);
      expect(component.progress[name]).toEqual({ percent: 0 });
    });

    it('should replace the previously selected file with the same name', () => {
      const first = pdf('same.pdf', 'first');
      const second = pdf('same.pdf', 'second version');

      select([first]);
      select([pdf('other.pdf'), second]);

      expect(listedNames()).toEqual(['other.pdf', 'same.pdf']);
      expect(component.fileData[1]).toBe(second);
      expect(Array.from(component.filesSet)).toEqual([component.fileData[0], second]);
      expect(Object.keys(component.progress)).toEqual(['other.pdf', 'same.pdf']);
    });

    it('should not list a replaced image when its reading finishes later', async () => {
      const first = png('same.png');
      const second = png('same.png');

      select([first]);
      await selectAndRead([second], 1);
      // wait for the reader of the replaced file too
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(component.fileData).toEqual([second]);
      expect(component.urls.length).toBe(1);
    });

    it('should remove a file from the list with its delete button', () => {
      select([pdf('a.pdf'), pdf('b.pdf'), pdf('c.pdf')]);

      deleteButtons()[1].click();
      fixture.detectChanges();

      expect(listedNames()).toEqual(['a.pdf', 'c.pdf']);
      expect(Array.from(component.filesSet).map((file) => file.name)).toEqual(['a.pdf', 'c.pdf']);
      expect(Object.keys(component.progress)).toEqual(['a.pdf', 'c.pdf']);
      expect(component.urls.length).toBe(2);
      expect(component.fileIcons.length).toBe(2);
    });

    it('deleteFile() should ignore an index out of the list', () => {
      select([pdf('a.pdf')]);

      component.deleteFile(-1);
      component.deleteFile(1);

      expect(component.fileData.map((file) => file.name)).toEqual(['a.pdf']);
      expect(component.filesSet.size).toBe(1);
    });
  });

  describe('drag and drop', () => {
    beforeEach(() => create());

    it('should show the hungarian drop zone text with hungarian configuration', () => {
      TestBed.resetTestingModule();
      create({ lang: 'hu' });

      expect(dropZone().getAttribute('aria-label')).toBe(
        'Húzd ide a fájlokat vagy válaszd ki őket'
      );
    });

    it('should activate the drop zone while files are dragged over it', () => {
      const enter = drag('dragenter', [pdf()]);

      expect(enter.defaultPrevented).toBe(true);
      expect(component.dragOver).toBe(true);
      expect(dropZone().classList).toContain('drop-zone-active');
      const over = drag('dragover', [pdf()]);

      expect(over.defaultPrevented).toBe(true);
      expect(over.dataTransfer.dropEffect).toBe('copy');
      expect(dropZone().classList).toContain('drop-zone-active');
      const leave = drag('dragleave', [pdf()]);

      expect(leave.defaultPrevented).toBe(true);
      expect(component.dragOver).toBe(false);
      expect(dropZone().classList).not.toContain('drop-zone-active');
    });

    it('should keep the drop zone active while the drag moves over its children', () => {
      const child = dropZone().querySelector('.drop-zone-text');

      drag('dragenter', [pdf()]);
      // entering a child fires its enter before the leave of the zone
      drag('dragenter', [pdf()], ['Files'], child);
      drag('dragleave', [pdf()], ['Files']);

      expect(dropZone().classList).toContain('drop-zone-active');

      drag('dragleave', [pdf()], ['Files'], child);

      expect(dropZone().classList).not.toContain('drop-zone-active');
    });

    it('should ignore a leave without an active drag', () => {
      const leave = drag('dragleave', [pdf()]);

      expect(leave.defaultPrevented).toBe(false);
      expect(component.dragOver).toBe(false);
    });

    it('should activate the zone by dragover too when the enter was missed', () => {
      drag('dragover', [pdf()]);

      expect(dropZone().classList).toContain('drop-zone-active');

      drag('dragleave', [pdf()]);

      expect(dropZone().classList).not.toContain('drop-zone-active');
    });

    it('should not allow to drop a dragged text or link', () => {
      const enter = drag('dragenter', [], ['text/plain', 'text/uri-list']);
      const over = drag('dragover', [], ['text/plain']);

      expect(enter.defaultPrevented).toBe(false);
      expect(over.defaultPrevented).toBe(false);
      expect(over.dataTransfer.dropEffect).toBe('none');
      expect(component.dragOver).toBe(false);
    });

    it('should not allow a drag without data transfer', () => {
      const event = new Event('dragenter', { bubbles: true, cancelable: true });

      dropZone().dispatchEvent(event);
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(false);
      expect(component.dragOver).toBe(false);
    });

    it('should add a dropped file to the list like a selected one', () => {
      drag('dragenter', [pdf()]);
      const drop = drag('drop', [pdf('dropped.pdf')]);

      expect(drop.defaultPrevented).toBe(true);
      expect(dropZone().classList).not.toContain('drop-zone-active');
      expect(listedNames()).toEqual(['dropped.pdf']);
      expect(component.filesSet.size).toBe(1);
      expect(component.progress).toEqual({ 'dropped.pdf': { percent: 0 } });
      expect(uploadButton().disabled).toBe(false);
    });

    it('should add several dropped files with image preview', async () => {
      drag('drop', [pdf('a.pdf'), png('b.png'), pdf('c.pdf')]);
      await vi.waitFor(() => expect(component.fileData.length).toBe(3));
      fixture.detectChanges();

      expect(listedNames().sort()).toEqual(['a.pdf', 'b.png', 'c.pdf']);
      expect(element.querySelectorAll('img').length).toBe(1);
    });

    it('should reset the nested drag state after a drop', () => {
      const child = dropZone().querySelector('.drop-zone-text');

      drag('dragenter', [pdf()]);
      drag('dragenter', [pdf()], ['Files'], child);
      drag('drop', [pdf()], ['Files'], child);

      expect(component.dragOver).toBe(false);

      // a new drag starts from zero
      drag('dragenter', [pdf()]);
      drag('dragleave', [pdf()]);

      expect(component.dragOver).toBe(false);
    });

    it('should ignore a drop without files', () => {
      select([pdf('a.pdf')]);
      const drop = drag('drop', [], ['text/plain']);

      // the browser must not open the dropped content
      expect(drop.defaultPrevented).toBe(true);
      expect(listedNames()).toEqual(['a.pdf']);
      expect(rejectedText()).toBeUndefined();
    });

    it('should ignore a drop with the files type but an empty file list', () => {
      drag('drop', [], ['Files']);

      expect(listedNames()).toEqual([]);
      expect(component.filesSet.size).toBe(0);
    });

    it('should replace a listed file with a dropped file of the same name', () => {
      const dropped = pdf('same.pdf', 'new content');

      select([pdf('same.pdf', 'old content')]);
      drag('drop', [dropped]);

      expect(listedNames()).toEqual(['same.pdf']);
      expect(Array.from(component.filesSet)).toEqual([dropped]);
    });

    it('should ignore the drag and drop while the files are uploading', () => {
      select([pdf('a.pdf')]);
      const [request] = startUpload();
      const enter = drag('dragenter', [pdf('b.pdf')]);
      const drop = drag('drop', [pdf('b.pdf')]);

      expect(enter.defaultPrevented).toBe(false);
      expect(component.dragOver).toBe(false);
      expect(drop.defaultPrevented).toBe(true);
      expect(listedNames()).toEqual(['a.pdf']);
      expect(Array.from(component.filesSet).map((file) => file.name)).toEqual(['a.pdf']);
      request.flush(remote(1, 'a.pdf'));
    });

    it('should not add the dropped files of a not accepted type', () => {
      drag('drop', [pdf('a.pdf'), new File(['x'], 'run.exe'), new File(['t'], 'notes.txt')]);

      expect(listedNames()).toEqual(['a.pdf']);
      expect(component.rejectedFiles.map((file) => file.name)).toEqual(['run.exe', 'notes.txt']);
      expect(rejectedText()).toBe('Not accepted file types: run.exe, notes.txt');

      // the next accepted selection clears the message
      drag('drop', [pdf('b.pdf')]);

      expect(rejectedText()).toBeUndefined();
      expect(listedNames()).toEqual(['a.pdf', 'b.pdf']);
    });

    it('should filter the selected files by the accepted types too', () => {
      select([new File(['t'], 'notes.txt', { type: 'text/plain' }), pdf('a.pdf')]);

      expect(listedNames()).toEqual(['a.pdf']);
      expect(rejectedText()).toBe('Not accepted file types: notes.txt');
    });

    it.each([
      ['.PDF', 'SZÁMLA.pdf', 'application/pdf', true],
      ['.pdf', 'scan.PDF', 'application/pdf', true],
      ['.pdf', 'pdf', 'application/pdf', false],
      ['application/pdf', 'scan', 'application/pdf', true],
      ['application/pdf', 'scan.pdf', 'application/x-pdf', false],
      ['image/*', 'photo.heic', 'image/heic', true],
      ['image/*', 'photo.heic', 'video/mp4', false],
      [' .doc , image/png ', 'kép.png', 'image/png', true],
      [' , ', 'anything.bin', '', true]
    ])(
      'should match the accepted types %j against %s (%s): %s',
      (accepted, name, type, isAccepted) => {
        fixture.componentRef.setInput('accpetedTypes', accepted);
        drag('drop', [new File(['x'], name, { type })]);

        // an image is listed only when it has been read, but it is in the upload set at once
        expect(Array.from(component.filesSet).map((file) => file.name)).toEqual(
          isAccepted ? [name] : []
        );
      }
    );
  });

  describe('upload', () => {
    beforeEach(() => create());

    it('should not send anything without selected files', () => {
      component.startUploadAll();

      httpMock.expectNone(uploadUrl);
      expect(spinnerStates).toEqual([]);
      expect(component.isUploading).toBe(false);
    });

    it('should upload every file with the input data and emit the uploaded files', () => {
      fixture.componentRef.setInput('inputData', { folder_id: 42 });
      select([pdf('a.pdf'), pdf('b.pdf')]);
      const requests = startUpload();

      expect(requests.length).toBe(2);
      expect(requests.map((request) => request.request.method)).toEqual(['POST', 'POST']);
      expect(
        requests.map((request) => ((request.request.body as FormData).get('file') as File).name)
      ).toEqual(['a.pdf', 'b.pdf']);
      expect((requests[0].request.body as FormData).get('data')).toBe('{"folder_id":42}');
      expect(component.isUploading).toBe(true);
      expect(uploadButton().disabled).toBe(true);
      expect(spinnerStates).toEqual([true]);

      requests[0].flush(remote(1, 'a.pdf'));
      expect(saved).toEqual([]);
      requests[1].flush(remote(2, 'b.pdf'));
      fixture.detectChanges();

      expect(saved.length).toBe(1);
      expect(saved[0].map((file) => file instanceof FileModel)).toEqual([true, true]);
      expect(saved[0].map((file) => [file.id, file.name])).toEqual([
        [1, 'a.pdf'],
        [2, 'b.pdf']
      ]);
      expect(done).toEqual(saved);
      expect(component.uploadIsDone).toBe(true);
      expect(component.isUploading).toBe(false);
      expect(spinnerStates).toEqual([true, false]);
      expect(component.summaryProgressbar).toBe(100);
      expect(element.querySelectorAll('.text-success').length).toBe(2);
      expect(deleteButtons()).toEqual([]);
    });

    it('should send the default folder without input data', () => {
      select([pdf()]);
      const [request] = startUpload();

      expect((request.request.body as FormData).get('data')).toBe('{"folder_id":1}');
      request.flush(remote(1, 'számla.pdf'));
    });

    it('should upload an empty file', () => {
      select([new File([], 'empty.pdf', { type: 'application/pdf' })]);
      const [request] = startUpload();

      expect(((request.request.body as FormData).get('file') as File).size).toBe(0);
      request.flush(remote(5, 'empty.pdf'));

      expect(saved[0][0].name).toBe('empty.pdf');
    });

    it('should upload a file with a very long and accented name', () => {
      const name = `${'ő'.repeat(250)}.pdf`;

      select([pdf(name)]);
      const [request] = startUpload();

      expect(((request.request.body as FormData).get('file') as File).name).toBe(name);
      request.flush(remote(6, name));

      expect(saved[0][0].name).toBe(name);
    });

    it('should show the upload progress of the files', () => {
      select([pdf('a.pdf'), pdf('b.pdf')]);
      const requests = startUpload();

      requests[0].event({ type: HttpEventType.UploadProgress, loaded: 1, total: 2 });
      fixture.detectChanges();

      expect(component.progress['a.pdf'].percent).toBe(50);
      expect(component.summaryProgressbar).toBe(25);
      expect(element.querySelector('.upload-percent')?.textContent?.trim()).toBe('50%');

      requests[1].event({ type: HttpEventType.UploadProgress, loaded: 3, total: 4 });
      requests[0].flush(remote(1, 'a.pdf'));
      fixture.detectChanges();

      expect(component.summaryProgressbar).toBe(87.5);
      expect(element.querySelectorAll('.text-success').length).toBe(1);

      requests[1].flush(remote(2, 'b.pdf'));
    });

    it('should start the upload only once while it is running', () => {
      select([pdf()]);
      const [request] = startUpload();

      component.startUploadAll();

      httpMock.expectNone(uploadUrl);
      request.flush(remote(1, 'számla.pdf'));
      expect(saved.length).toBe(1);
    });

    it('should not change the list while the files are uploading', () => {
      select([pdf('a.pdf')]);
      const [request] = startUpload();

      component.onSelectFile([pdf('b.pdf')]);
      component.deleteFile(0);

      expect(component.fileData.map((file) => file.name)).toEqual(['a.pdf']);
      request.flush(remote(1, 'a.pdf'));
    });

    it.each([
      [413, 'Payload Too Large'],
      [415, 'Unsupported Media Type'],
      [500, 'Internal Server Error'],
      [502, 'Bad Gateway']
    ])('should report the %s error response and allow to retry', (status, statusText) => {
      select([pdf('a.pdf'), pdf('b.pdf')]);
      const requests = startUpload();

      requests[1].event({ type: HttpEventType.UploadProgress, loaded: 1, total: 2 });
      requests[0].flush({ message: statusText }, { status, statusText });
      fixture.detectChanges();

      expect(failed.length).toBe(1);
      expect(failed[0].status).toBe(status);
      expect(failed[0].error).toEqual({ message: statusText });
      // the other uploads are cancelled
      expect(requests[1].cancelled).toBe(true);
      expect(saved).toEqual([]);
      expect(component.uploadIsDone).toBe(false);
      expect(component.isUploading).toBe(false);
      expect(component.hasUploadError).toBe(true);
      expect(spinnerStates).toEqual([true, false]);
      expect(component.summaryProgressbar).toBe(0);
      expect(Object.values(component.progress)).toEqual([
        { percent: 0, progress: undefined },
        { percent: 0, progress: undefined }
      ]);
      expect(element.querySelector('.upload-error')?.textContent?.trim()).toBe(
        'The upload failed, please try again.'
      );
      expect(deleteButtons().length).toBe(2);
      expect(uploadButton().disabled).toBe(false);
      // retry
      const retried = startUpload();

      expect(component.hasUploadError).toBe(false);
      retried[0].event({ type: HttpEventType.UploadProgress, loaded: 1, total: 4 });
      expect(component.progress['a.pdf'].percent).toBe(25);
      retried.forEach((request, index) => request.flush(remote(index + 1, `${index}.pdf`)));
      fixture.detectChanges();

      expect(saved.length).toBe(1);
      expect(element.querySelector('.upload-error')).toBeNull();
    });

    it('should report a network error', () => {
      select([pdf()]);
      const [request] = startUpload();

      request.error(new ProgressEvent('error'));

      expect(failed.length).toBe(1);
      expect(failed[0].status).toBe(0);
      expect(component.hasUploadError).toBe(true);
      expect(spinnerStates).toEqual([true, false]);
    });

    it('cancelUpload() should cancel the running uploads', () => {
      select([pdf('a.pdf'), pdf('b.pdf')]);
      const requests = startUpload();

      requests[0].event({ type: HttpEventType.UploadProgress, loaded: 1, total: 2 });
      component.cancelUpload();
      fixture.detectChanges();

      expect(requests.map((request) => request.cancelled)).toEqual([true, true]);
      expect(component.isUploading).toBe(false);
      expect(component.progress['a.pdf'].percent).toBe(0);
      expect(spinnerStates).toEqual([true, false]);
      expect(saved).toEqual([]);
      expect(failed).toEqual([]);
      expect(component.hasUploadError).toBe(false);
      expect(deleteButtons().length).toBe(2);
    });

    it('cancelUpload() should do nothing without running upload', () => {
      component.cancelUpload();

      expect(spinnerStates).toEqual([]);
    });

    it('close() should cancel the upload and emit an empty file list', () => {
      const changes: Array<Array<FileModelInterface>> = [];

      component.changeFiles.subscribe((files) => changes.push(files));
      select([pdf()]);
      const [request] = startUpload();

      component.close();

      expect(request.cancelled).toBe(true);
      expect(changes).toEqual([[]]);
    });

    it('should cancel the upload when the component is destroyed', () => {
      select([pdf()]);
      const [request] = startUpload();

      fixture.destroy();

      expect(request.cancelled).toBe(true);
      expect(spinnerStates).toEqual([true, false]);
    });
  });

  describe('helpers', () => {
    beforeEach(() => create());

    it('getSum() should return the sum of parameters', () => {
      expect(component.getSum(1000, 111)).toBe(1111);
    });

    it('getSum() should round the second parameter', () => {
      expect(component.getSum(1000, 111.6)).toBe(1112);
    });

    it('summarizeUploadProgress() should be 0 without files', () => {
      component.summaryProgressbar = 50;
      component.summarizeUploadProgress();

      expect(component.summaryProgressbar).toBe(0);
    });
  });
});
