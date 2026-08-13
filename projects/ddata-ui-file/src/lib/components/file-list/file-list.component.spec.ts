import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { FileModel } from '../../models/file/file.model';
import { FileModelInterface } from '../../models/file/file-model.interface';
import { DdataUiFileListComponent } from './file-list.component';

describe('DdataUiFileListComponent', () => {
  let component: DdataUiFileListComponent;
  let fixture: ComponentFixture<DdataUiFileListComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
      teardown: { destroyAfterEach: false }
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Injector],
      declarations: [DdataUiFileListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('delete should delete a file', () => {
    component = new DdataUiFileListComponent();
    component.model.files = [
      new FileModel().init({ name: 'test' } as unknown as Partial<FileModelInterface>),
      new FileModel().init({ name: 'test2' } as unknown as Partial<FileModelInterface>)
    ];
    component.delete(component.model.files[0]);

    expect(component.model.files.length).toBe(1);
  });

  it('fileuploadSuccess() should update model', () => {
    component = new DdataUiFileListComponent();
    const files = [
      new FileModel().init({ name: 'test' } as unknown as Partial<FileModelInterface>),
      new FileModel().init({ name: 'test2' } as unknown as Partial<FileModelInterface>)
    ];

    component.fileuploadSuccess(files);

    expect(component.model.files.length).toBe(2);
  });

  it('openDialog() should set showDialog to true', () => {
    component = new DdataUiFileListComponent();
    component.openDialog();

    expect(component.showDialog).toBeTruthy();
  });

  it('closeDialog() should set showDialog to false', () => {
    component = new DdataUiFileListComponent();
    component.closeDialog();

    expect(component.showDialog).toBeFalsy();
  });

  it('setPrimaryImage() should set slug of a file', () => {
    component = new DdataUiFileListComponent();
    component.model.files = [
      new FileModel().init({
        name: 'test',
        file_name_slug: 'a'
      } as unknown as Partial<FileModelInterface>),
      new FileModel().init({
        name: 'test2',
        file_name_slug: 'b'
      } as unknown as Partial<FileModelInterface>)
    ];
    component.setPrimaryImage(
      new FileModel().init({ file_name_slug: 'b' } as unknown as Partial<FileModelInterface>)
    );

    expect(component.model.files[1].is_primary).toBeTrue();
  });
});
