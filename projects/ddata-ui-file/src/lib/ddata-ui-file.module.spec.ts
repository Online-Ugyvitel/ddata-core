import { Component, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DdataUiFileListComponent } from './components/file-list/file-list.component';
import { DdataUiFileUploadComponent } from './components/file-upload/file-upload.component';
import { DdataUiFileModule } from './ddata-ui-file.module';
import { FileModel } from './models/file/file.model';

@Component({
  template: `
    <dd-file-list [showNoData]="false"></dd-file-list>
    <span class="size">{{ 2048 | filesize: 'kb' : 0 }}</span>
  `,
  imports: [DdataUiFileModule]
})
class HostComponent {}

describe('DdataUiFileModule', () => {
  it('forRoot() should provide the FileModel and the given configuration', () => {
    const config = { lang: 'hu' as const };
    const moduleWithProviders = DdataUiFileModule.forRoot(config);

    expect(moduleWithProviders.ngModule).toBe(DdataUiFileModule);
    expect(moduleWithProviders.providers).toEqual([
      FileModel,
      { provide: 'config', useValue: config }
    ]);
  });

  it('should store the injector of the application when it is imported', () => {
    TestBed.configureTestingModule({ imports: [DdataUiFileModule] });

    TestBed.inject(DdataUiFileModule);

    expect(DdataUiFileModule.InjectorInstance).toBe(TestBed.inject(Injector));
  });

  it('should export the file components and the filesize pipe', () => {
    const fixture = TestBed.createComponent(HostComponent);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(DdataUiFileListComponent))).not.toBeNull();
    // the upload component is created by the modal dialog only when it is opened
    expect(fixture.debugElement.query(By.directive(DdataUiFileUploadComponent))).toBeNull();
    expect(fixture.nativeElement.querySelector('.size').textContent).toBe('2');
  });
});
