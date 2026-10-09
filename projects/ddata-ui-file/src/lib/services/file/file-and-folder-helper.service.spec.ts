import { TestBed, inject } from '@angular/core/testing';

import { FileAndFolderHelperService } from './file-and-folder-helper.service';

describe('FileAndFolderHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileAndFolderHelperService]
    });
  });

  it('should be created', inject(
    [FileAndFolderHelperService],
    (service: FileAndFolderHelperService) => {
      expect(service).toBeTruthy();
    }
  ));
});
