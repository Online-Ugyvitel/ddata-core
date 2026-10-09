import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ProxyFactoryService } from 'ddata-core';
import { DdataUiFileModule } from '../../ddata-ui-file.module';
import { FileAndFolderHelperService } from '../../services/file/file-and-folder-helper.service';
import { DdataUiFileUploadComponent } from './file-upload.component';

describe('DdataUiFileUploadComponent', () => {
  let component: DdataUiFileUploadComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProxyFactoryService, HttpClient, HttpHandler, FileAndFolderHelperService]
    });

    DdataUiFileModule.InjectorInstance = {
      get: (token: never) => TestBed.inject(token)
    };

    // The template needs inputs of the host component, so only the class is tested here.
    component = TestBed.runInInjectionContext(
      () => new DdataUiFileUploadComponent(TestBed.inject(FileAndFolderHelperService))
    );
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('getSum() should return the sum of parameters', () => {
    expect(component.getSum(1000, 111)).toBe(1111);
  });

  it('getSum() should round the second parameter', () => {
    expect(component.getSum(1000, 111.6)).toBe(1112);
  });
});
