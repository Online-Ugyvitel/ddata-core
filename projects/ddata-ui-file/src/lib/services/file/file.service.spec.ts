import { HttpErrorResponse, HttpEventType, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DdataCoreModule, FileUploadProcessInterface, Paginate } from '@netdjw/ddata-core';
import { FileModel } from '../../models/file/file.model';
import { FileService } from './file.service';

describe('FileService', () => {
  const apiUrl = 'http://api.test';
  const remoteFile = {
    id: 7,
    folder_id: 2,
    name: 'árvíztűrő tükörfúrógép.pdf',
    file_name_and_path: '/files/arvizturo-tukorfurogep.pdf',
    file_name_slug: 'arvizturo-tukorfurogep-pdf',
    size: 2048,
    mimetype: 'application/pdf',
    is_primary: false
  };
  let service: FileService;
  let httpMock: HttpTestingController;
  const upload = (
    files: Array<File>,
    data?: Record<string, unknown>
  ): {
    results: Array<FileUploadProcessInterface>;
    errors: Array<HttpErrorResponse>;
  } => {
    const results: Array<FileUploadProcessInterface> = [];
    const errors: Array<HttpErrorResponse> = [];

    service.sendFiles('/upload', 0, new Set(files), data).forEach((request) =>
      request.subscribe({
        next: (result: FileUploadProcessInterface) => results.push(result),
        error: (error: HttpErrorResponse) => errors.push(error)
      })
    );

    return { results, errors };
  };

  beforeEach(() => {
    localStorage.setItem('token', 'file-token');
    TestBed.configureTestingModule({
      imports: [DdataCoreModule.forRoot({ apiUrl })],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    // the core module sets up the injector what the remote data service uses
    TestBed.inject(DdataCoreModule);
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FileService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('token');
  });

  it('should be provided in the root injector as a single instance', () => {
    expect(service).toBeInstanceOf(FileService);
    expect(TestBed.inject(FileService)).toBe(service);
  });

  it('getOne() should load a file by its ID and return an initialized FileModel', () => {
    let loaded: FileModel | undefined;

    service.getOne(7).subscribe((result) => (loaded = result as unknown as FileModel));
    const request = httpMock.expectOne(`${apiUrl}/file/7`);

    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe('Bearer file-token');
    request.flush(remoteFile);

    expect(loaded).toBeInstanceOf(FileModel);
    expect(loaded?.name).toBe('árvíztűrő tükörfúrógép.pdf');
    expect(loaded?.size).toBe(2048);
    expect(loaded?.is_image).toBe(false);
  });

  it('getAllWithoutPaginate() should load every file of the list endpoint', () => {
    let loaded: Array<FileModel> = [];

    service
      .getAllWithoutPaginate()
      .subscribe((result) => (loaded = result as unknown as Array<FileModel>));

    httpMock
      .expectOne(`${apiUrl}/file/list`)
      .flush([remoteFile, { ...remoteFile, id: 8, mimetype: 'image/png', name: 'kép.png' }]);

    expect(loaded.map((file) => [file.id, file.name, file.is_image])).toEqual([
      [7, 'árvíztűrő tükörfúrógép.pdf', false],
      [8, 'kép.png', true]
    ]);
  });

  it('getAll() should return an empty paginate when the server has no file', () => {
    let loaded: Paginate | undefined;

    service.getAll().subscribe((result) => (loaded = result));

    httpMock
      .expectOne(`${apiUrl}/file`)
      .flush({ data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 });

    expect(loaded).toBeInstanceOf(Paginate);
    expect(loaded?.data).toEqual([]);
  });

  it('delete() should remove the file on the server and from the paginated list', () => {
    const file = new FileModel().init(remoteFile);
    const other = new FileModel().init({ ...remoteFile, id: 8 });
    const paginate = new Paginate(new FileModel());
    let result: Paginate | undefined;

    paginate.data = [file, other];
    service.delete(file, paginate).subscribe((value) => (result = value));
    const request = httpMock.expectOne(`${apiUrl}/file/7`);

    expect(request.request.method).toBe('DELETE');
    request.flush(1);

    expect(result?.data).toEqual([other]);
  });

  describe('sendFiles()', () => {
    it('should post every file in its own request with the additional data', () => {
      const files = [
        new File(['first'], 'first.txt', { type: 'text/plain' }),
        new File(['second'], 'second.pdf', { type: 'application/pdf' })
      ];
      const { results } = upload(files, { folder_id: 3 });
      const requests = httpMock.match(`${apiUrl}/file/upload`);

      expect(requests.length).toBe(2);
      requests.forEach((request, index) => {
        const body = request.request.body as FormData;

        expect(request.request.method).toBe('POST');
        expect(request.request.reportProgress).toBe(true);
        expect(request.request.headers.get('Authorization')).toBe('Bearer file-token');
        expect((body.get('file') as File).name).toBe(files[index].name);
        expect(body.get('data')).toBe(JSON.stringify({ folder_id: 3 }));
      });

      requests[0].flush(remoteFile);
      requests[1].flush({ ...remoteFile, id: 8 });

      expect(
        results.filter((result) => result.remoteFileDatas !== null).map((result) => result.file)
      ).toEqual(['first.txt', 'second.pdf']);
    });

    it('should send null as data when no additional data is given', () => {
      upload([new File([''], 'empty.txt', { type: 'text/plain' })]);
      const request = httpMock.expectOne(`${apiUrl}/file/upload`);

      expect((request.request.body as FormData).get('data')).toBe('null');
      expect(((request.request.body as FormData).get('file') as File).size).toBe(0);
      request.flush(remoteFile);
    });

    it('should not send any request when no file is given', () => {
      expect(service.sendFiles('/upload', 0, new Set(), {})).toEqual([]);
      httpMock.expectNone(`${apiUrl}/file/upload`);
    });

    it('should report the upload progress in percent', () => {
      const progress: Array<number> = [];
      const { results } = upload([new File(['12345'], 'progress.txt')]);
      const request = httpMock.expectOne(`${apiUrl}/file/upload`);

      // the first event of the request is the sent event, its progress observable reports the next events
      results[0].progress.subscribe((percent) => progress.push(percent));
      request.event({ type: HttpEventType.UploadProgress, loaded: 1, total: 4 });
      request.event({ type: HttpEventType.UploadProgress, loaded: 4, total: 4 });
      request.flush(remoteFile);

      expect(progress).toEqual([25, 100]);
    });

    it.each([
      [413, 'Payload Too Large'],
      [415, 'Unsupported Media Type'],
      [500, 'Internal Server Error'],
      [503, 'Service Unavailable']
    ])('should pass the %s error response to the subscriber', (status, statusText) => {
      const { errors } = upload([new File(['x'], 'big.zip')]);

      httpMock
        .expectOne(`${apiUrl}/file/upload`)
        .flush({ message: statusText }, { status, statusText });

      expect(errors.length).toBe(1);
      expect(errors[0].status).toBe(status);
      expect(errors[0].error).toEqual({ message: statusText });
    });

    it('should pass a network error to the subscriber', () => {
      const { errors } = upload([new File(['x'], 'offline.txt')]);

      httpMock.expectOne(`${apiUrl}/file/upload`).error(new ProgressEvent('error'));

      expect(errors.length).toBe(1);
      expect(errors[0].status).toBe(0);
    });
  });
});
