import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { faCircle, faDotCircle, faFilePdf, faFileWord } from '@fortawesome/free-solid-svg-icons';
import { DdataCoreModule } from '@netdjw/ddata-core';
import { DdataUiNoDataComponent } from '@netdjw/ddata-ui-common';
import {
  DdataUiConfirmDialogComponent,
  DdataUiModalDialogComponent
} from '@netdjw/ddata-ui-dialog';
import { DdataUiFileModule } from '../../ddata-ui-file.module';
import { FileModelInterface } from '../../models/file/file-model.interface';
import { FileModel } from '../../models/file/file.model';
import { ModuleConfigurationInterface } from '../../models/module-configuration/module-configuration.interface';
import { DdataUiFileUploadComponent } from '../file-upload/file-upload.component';
import { DdataUiFileListComponent } from './file-list.component';

describe('DdataUiFileListComponent', () => {
  let fixture: ComponentFixture<DdataUiFileListComponent>;
  let component: DdataUiFileListComponent;
  let element: HTMLElement;
  const file = (data: Record<string, unknown>): FileModelInterface => new FileModel().init(data);
  const pdf = (): FileModelInterface =>
    file({
      id: 1,
      name: 'számla.pdf',
      file_name_slug: 'szamla-pdf',
      size: 2048,
      mimetype: 'application/pdf'
    });
  const image = (): FileModelInterface =>
    file({
      id: 2,
      name: 'kép.png',
      file_name_slug: 'kep-png',
      size: 1536,
      mimetype: 'image/png'
    });
  const create = (
    files: Array<FileModelInterface> = [],
    config?: ModuleConfigurationInterface
  ): void => {
    TestBed.configureTestingModule({
      imports: [DdataUiFileModule, DdataCoreModule.forRoot({ apiUrl: 'http://api.test' })],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ...(config ? [{ provide: 'config', useValue: config }] : [])
      ]
    });
    fixture = TestBed.createComponent(DdataUiFileListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.componentRef.setInput('model', { files });
    fixture.detectChanges();
  };
  const rows = (): Array<HTMLElement> =>
    Array.from(element.querySelectorAll<HTMLElement>('.row.py-3.border-bottom'));
  const modal = (): DdataUiModalDialogComponent =>
    fixture.debugElement.query(By.directive(DdataUiModalDialogComponent)).componentInstance;

  beforeEach(() => {
    localStorage.setItem('token', 'list-token');
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  describe('without files', () => {
    beforeEach(() => create());

    it('should show the english texts by default', () => {
      expect(element.querySelector('h3')?.textContent?.trim()).toBe('Files');
      expect(element.querySelector('.new-file button')?.textContent?.trim()).toBe(
        'Upload new files'
      );
    });

    it('should show the no data component instead of the file table', () => {
      const noData = fixture.debugElement.query(By.directive(DdataUiNoDataComponent));

      expect(rows()).toEqual([]);
      expect(noData).not.toBeNull();
      expect(noData.nativeElement.getAttribute('class')).toBe('w-100');
      expect((noData.componentInstance as DdataUiNoDataComponent)._text).toBe('file');
    });

    it('should hide the no data component when showNoData is false', () => {
      fixture.componentRef.setInput('showNoData', false);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.directive(DdataUiNoDataComponent))).toBeNull();
    });
  });

  it('should show the hungarian texts with hungarian configuration', () => {
    create([pdf()], { lang: 'hu' });

    expect(element.querySelector('h3')?.textContent?.trim()).toBe('Fájlok');
    expect(element.querySelector('.new-file button')?.textContent?.trim()).toBe('Új feltöltése');
  });

  describe('with files', () => {
    beforeEach(() => create([pdf(), image()]));

    it('should show a row for every file with its name, size and download link', () => {
      const [pdfRow, imageRow] = rows();

      expect(rows().length).toBe(2);
      expect(pdfRow.querySelector('a')?.textContent?.trim()).toBe('számla.pdf');
      expect(pdfRow.querySelector('a')?.getAttribute('href')).toBe(
        '/api/file/download/1?token=list-token'
      );
      expect(pdfRow.querySelector('.text-right')?.textContent?.trim()).toBe('2 KB');
      expect(imageRow.querySelector('.text-right')?.textContent?.trim()).toBe('1.5 KB');
      expect(fixture.debugElement.query(By.directive(DdataUiNoDataComponent))).toBeNull();
    });

    it('should show a preview for an image and an icon by the type for the other files', () => {
      const [pdfRow, imageRow] = rows();
      const img = imageRow.querySelector('img');

      expect(pdfRow.querySelector('img')).toBeNull();
      expect(pdfRow.querySelector('fa-icon svg')?.getAttribute('data-icon')).toBe(
        faFilePdf.iconName
      );
      expect(img?.getAttribute('src')).toBe('/api/file/image/2?token=list-token');
      expect(img?.getAttribute('alt')).toBe('kép.png');
    });

    it('should offer the primary image selection only for images', () => {
      const [pdfRow, imageRow] = rows();
      const primaryButton = imageRow.querySelector<HTMLButtonElement>('.col-1 button');

      expect(pdfRow.querySelector('.col-1 button')).toBeNull();
      expect(primaryButton?.querySelector('svg')?.getAttribute('data-icon')).toBe(
        faCircle.iconName
      );

      primaryButton?.click();
      fixture.detectChanges();

      expect(component.model.files.map((item) => item.is_primary)).toEqual([false, true]);
      expect(primaryButton?.querySelector('svg')?.getAttribute('data-icon')).toBe(
        faDotCircle.iconName
      );
    });

    it('should delete the file when its delete is confirmed', () => {
      const confirmDialogs = fixture.debugElement.queryAll(
        By.directive(DdataUiConfirmDialogComponent)
      );

      expect(confirmDialogs.length).toBe(2);
      (confirmDialogs[0].componentInstance as DdataUiConfirmDialogComponent).confirm.emit();
      fixture.detectChanges();

      expect(component.model.files.map((item) => item.name)).toEqual(['kép.png']);
      expect(rows().length).toBe(1);
    });

    it('should open the upload dialog and add the uploaded files to the list', () => {
      element.querySelector<HTMLButtonElement>('.new-file button')?.click();
      fixture.detectChanges();
      const upload = fixture.debugElement.query(By.directive(DdataUiFileUploadComponent));

      expect(component.showDialog).toBe(true);
      expect(modal().isModalVisible).toBe(true);
      expect(upload).not.toBeNull();

      (upload.componentInstance as DdataUiFileUploadComponent).saveModel.emit([
        file({ id: 3, name: 'új.docx', mimetype: 'application/msword', size: 10 })
      ]);
      fixture.detectChanges();

      expect(component.showDialog).toBe(false);
      expect(modal().isModalVisible).toBe(false);
      expect(component.model.files.map((item) => item.name)).toEqual([
        'számla.pdf',
        'kép.png',
        'új.docx'
      ]);
      expect(rows()[2].querySelector('fa-icon svg')?.getAttribute('data-icon')).toBe(
        faFileWord.iconName
      );
    });

    it('should close the upload dialog when it is closed without upload', () => {
      element.querySelector<HTMLButtonElement>('.new-file button')?.click();
      fixture.detectChanges();
      expect(modal().isModalVisible).toBe(true);

      element.querySelector<HTMLButtonElement>('.modal .close')?.click();
      fixture.detectChanges();

      expect(component.showDialog).toBe(false);
      expect(modal().isModalVisible).toBe(false);
      expect(component.model.files.length).toBe(2);
    });
  });

  describe('methods', () => {
    beforeEach(() => create());

    it('delete() should remove only the given file', () => {
      const first = pdf();
      const second = image();

      component.model.files = [first, second];
      component.delete(second);

      expect(component.model.files).toEqual([first]);
    });

    it('delete() should keep the list when the file is not in it', () => {
      const first = pdf();
      const second = image();

      component.model.files = [first, second];
      component.delete(pdf());

      expect(component.model.files).toEqual([first, second]);
    });

    it('delete() should keep the other file with the same name', () => {
      const first = pdf();
      const sameName = pdf();

      component.model.files = [first, sameName];
      component.delete(sameName);

      expect(component.model.files.length).toBe(1);
      expect(component.model.files[0]).toBe(first);
    });

    it('fileuploadSuccess() should append the files and close the dialog', () => {
      const existing = pdf();
      const uploaded = [image(), image()];

      component.model.files = [existing];
      component.openDialog();
      component.fileuploadSuccess(uploaded);

      expect(component.model.files).toEqual([existing, ...uploaded]);
      expect(component.showDialog).toBe(false);
    });

    it('fileuploadSuccess() should keep the list with an empty upload', () => {
      const existing = pdf();

      component.model.files = [existing];
      component.fileuploadSuccess([]);

      expect(component.model.files).toEqual([existing]);
    });

    it('openDialog() and closeDialog() should switch the dialog', () => {
      component.openDialog();
      expect(component.showDialog).toBe(true);

      component.closeDialog();
      expect(component.showDialog).toBe(false);
    });

    it('setPrimaryImage() should make only the file with the same slug primary', () => {
      component.model.files = [
        file({ file_name_slug: 'a', is_primary: true }),
        file({ file_name_slug: 'b' })
      ];
      component.setPrimaryImage(file({ file_name_slug: 'b' }));

      expect(component.model.files.map((item) => item.is_primary)).toEqual([false, true]);
    });

    it('setPrimaryImage() should clear the primary image when the slug is not in the list', () => {
      component.model.files = [file({ file_name_slug: 'a', is_primary: true })];
      component.setPrimaryImage(file({ file_name_slug: 'missing' }));

      expect(component.model.files.map((item) => item.is_primary)).toEqual([false]);
    });

    it('fileType() should return the icon of the file type', () => {
      expect(component.fileType(pdf())).toBe(faFilePdf);
    });
  });
});
