import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ProxyFactoryService } from 'ddata-core';
import { DdataUiFileUploadComponent } from './file-upload.component';


xdescribe('DdataUiFileUploadComponent', () => {
  let component: DdataUiFileUploadComponent;
  let fixture: ComponentFixture<DdataUiFileUploadComponent>;

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
      declarations: [ DdataUiFileUploadComponent ],
      providers: [
        ProxyFactoryService,
        HttpClient,
        HttpHandler
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    // AppModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(DdataUiFileUploadComponent);
    fixture.detectChanges();
  });

  afterAll(() => {
    document.body.removeChild(fixture.debugElement.nativeElement);
  });

  // it('should be created', () => {
  //   component = new DdataUiFileUploadComponent(new FolderFromStorageService(), new FileAndFolderHelperService());
  //   expect(component).toBeTruthy();
  // });

  // it('getSum() should return the sum of parameters', () => {
  //   component = new DdataUiFileUploadComponent(new FolderFromStorageService(), new FileAndFolderHelperService());
  //   const sum = component.getSum(1000, 111);
  //   expect(sum).toBe(1111);
  // });

  // it('summarizeUploadProgress() should set the summarized progress', () => {
  //   component = new DdataUiFileUploadComponent(new FolderFromStorageService(), new FileAndFolderHelperService());
  //   const fakeProgress = {
  //     a: {percent: 10},
  //     b: {percent: 20}
  //   };
  //   component.urls = [
  //     '',
  //     ''
  //   ];
  //   component.progress = fakeProgress;
  //   component.summarizeUploadProgress();

  //   expect(component.summaryProgressbar).toBe(30 / (component.urls.length * 100) * 100);
  // });

  // it('startUploadAll() should start file upload to the server', () => {
  //   component = new DdataUiFileUploadComponent(new FolderFromStorageService(), new FileAndFolderHelperService());
  //   const serviceSpy = spyOn(component.fileService, 'sendFiles').and.callThrough();
  //   component.startUploadAll();
  //   expect(serviceSpy).toHaveBeenCalledWith('upload', 0, component.filesSet, {});
  // });

  // it('readAndSetup() should setup data for upload', () => {
  //   component = new DdataUiFileUploadComponent(new FolderFromStorageService(), new FileAndFolderHelperService());
  //   const fakeFile = new File([], 'test');

  //   component.readAndSetup(fakeFile);
  //   expect(component.urls.length).toBe(1);
  //   expect(component.isImage.length).toBe(1);
  //   expect(component.fileTypes.length).toBe(1);
  //   expect(component.fileData.length).toBe(1);
  // });

  // it('deleteFile() should delete file', () => {
  //   component = new DdataUiFileUploadComponent(new FolderFromStorageService(), new FileAndFolderHelperService());
  //   const fakeFile = new File([], 'test');

  //   component.readAndSetup(fakeFile);
  //   component.deleteFile(0);
  //   expect(component.urls.length).toBe(0);
  //   expect(component.isImage.length).toBe(0);
  //   expect(component.fileTypes.length).toBe(0);
  //   expect(component.fileData.length).toBe(0);
  // });

  // it('close() should emit', () => {
  //   component = new DdataUiFileUploadComponent(new FolderFromStorageService(), new FileAndFolderHelperService());
  //   const emitSpy = spyOn(component.changeFiles, 'emit').and.callThrough();
  //   component.close();
  //   expect(emitSpy).toHaveBeenCalled();
  // });

  // it('onSelectFile()', () => {
  //   component = new DdataUiFileUploadComponent(new FolderFromStorageService(), new FileAndFolderHelperService());

  //   let fakeFiles = [
  //     new File([], ''),
  //   ] as unknown as FileList;

  //   const emitSpy = spyOn(component, 'readAndSetup').and.callThrough();
  //   component.onSelectFile(fakeFiles);
  //   expect(emitSpy).toHaveBeenCalled();
  // });
});
