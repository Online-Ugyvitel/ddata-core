import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DdataUiModule } from '../../../ddata-ui.module';
import { FileModel } from './../../../models/file/file.model';
import { FileListComponent } from './file-list.component';


xdescribe('FileListComponent', () => {
  let component: FileListComponent;
  let fixture: ComponentFixture<FileListComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
    );
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Injector],
      declarations: [ FileListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    DdataUiModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(FileListComponent);
    component = fixture.nativeElement;
    document.body.appendChild(fixture.nativeElement);
  });
  afterEach(() => {
    document.body.removeChild(fixture.nativeElement);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('delete should delete a file', () => {
    component = new FileListComponent();
    component.model.files = [
      new FileModel().init({name: 'test'}),
      new FileModel().init({name: 'test2'})
    ];
    component.delete(component.model.files[0]);
    expect(component.model.files.length).toBe(1);
  });

  it('fileuploadSuccess() should update model', () => {
    component = new FileListComponent();
    const files = [
      new FileModel().init({name: 'test'}),
      new FileModel().init({name: 'test2'})
    ];
    component.fileuploadSuccess(files);
    expect(component.model.files.length).toBe(2);
  });

  it('openDialog() should set showDialog to true', () => {
    component = new FileListComponent();
    component.openDialog();
    expect(component.showDialog).toBeTruthy();
  });

  it('closeDialog() should set showDialog to false', () => {
    component = new FileListComponent();
    component.closeDialog();
    expect(component.showDialog).toBeFalsy();
  });

  it('setPrimaryImage() should set slug of a file', () => {
    component = new FileListComponent();
    component.model.files = [
      new FileModel().init({name: 'test', file_name_slug: 'a'}),
      new FileModel().init({name: 'test2', file_name_slug: 'b'})
    ];
    component.setPrimaryImage(new FileModel().init({file_name_slug: 'b'}));

    expect(component.model.files[1].is_primary).toBeTrue();
  });
});
