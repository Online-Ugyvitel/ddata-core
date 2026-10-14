import { TestBed } from '@angular/core/testing';
import {
  faFile,
  faFileAlt,
  faFileArchive,
  faFileAudio,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFileUpload,
  faFileVideo,
  faFileWord,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { FileAndFolderHelperService } from './file-and-folder-helper.service';

describe('FileAndFolderHelperService', () => {
  let service: FileAndFolderHelperService;

  beforeEach(() => {
    service = TestBed.inject(FileAndFolderHelperService);
  });

  it('should be provided in the root injector as a single instance', () => {
    expect(service).toBeInstanceOf(FileAndFolderHelperService);
    expect(TestBed.inject(FileAndFolderHelperService)).toBe(service);
  });

  describe('setFileType()', () => {
    const cases: Array<[string, IconDefinition]> = [
      ['text/plain', faFileAlt],
      ['application/pdf', faFilePdf],
      ['application/x-msdownload', faFileUpload],
      ['application/x-zip-compressed', faFileArchive],
      ['application/zip', faFileArchive],
      ['application/x-rar', faFileArchive],
      ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', faFileExcel],
      ['application/vnd.ms-excel', faFileExcel],
      ['application/msword', faFileWord],
      ['text/rtf', faFileWord],
      ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', faFileWord],
      ['application/vnd.oasis.opendocument.text', faFileWord],
      ['application/vnd.oasis.opendocument.spreadsheet', faFileExcel],
      ['audio/mpeg', faFileAudio],
      ['audio/ogg', faFileAudio],
      ['video/mp4', faFileVideo],
      ['video/webm', faFileVideo],
      ['image/png', faFileImage],
      ['image/svg+xml', faFileImage]
    ];

    it.each(cases)('should return the matching icon for %s', (mimetype, icon) => {
      expect(service.setFileType(mimetype)).toBe(icon);
    });

    it.each(['application/json', 'text/html', 'application/octet-stream'])(
      'should return the unknown file icon for the not handled %s type',
      (mimetype) => {
        expect(service.setFileType(mimetype)).toBe(faFile);
      }
    );

    it('should return the unknown file icon for an empty type (the browser could not detect it)', () => {
      expect(service.setFileType('')).toBe(faFile);
    });

    it('should match the media type groups only at the beginning of the type', () => {
      expect(service.setFileType('application/audio/x')).toBe(faFile);
      expect(service.setFileType('x-image/png')).toBe(faFile);
    });

    it('should compare the exact types case sensitively', () => {
      expect(service.setFileType('APPLICATION/PDF')).toBe(faFile);
    });
  });

  it('should provide the icons of the file categories', () => {
    expect(service.icon).toEqual({
      file: faFile,
      document: faFileWord,
      excel: faFileExcel,
      spreadsheet: faFileExcel,
      pdf: faFilePdf,
      archive: faFileArchive,
      text: faFileAlt,
      exe: faFileUpload,
      audio: faFileAudio,
      video: faFileVideo,
      image: faFileImage,
      unknown: faFile
    });
  });
});
