/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
/* eslint-disable max-lines */
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DdataInjectorModule } from '../../ddata-injector.module';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { FileUploadProcessInterface } from '../../models/file/file-upload-process.interface';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { DataServiceAbstract } from '../data/data-service.abstract';
import { EnvService } from '../env/env.service';
import { DdataCoreError } from '../error-handler/ddata-core-error';
import { RemoteDataServiceInterface } from './remote-data-service.interface';

// @dynamic
export class RemoteDataService<T extends BaseModelInterface<T>>
  extends DataServiceAbstract<T>
  implements RemoteDataServiceInterface<T>
{
  /**
   * Application environment variable from the root application
   */
  private readonly appEnv = DdataInjectorModule.InjectorInstance.get(EnvService);

  /**
   * Application URL
   */
  url = this.appEnv.environment.apiUrl;

  /**
   * Headers to all requests
   */
  headers: any;

  /**
   * Options to all requests
   */
  options: any;

  /**
   * Angular HttpClient
   */
  private readonly http: HttpClient;

  /**
   * Model's data type
   */
  type: new () => T;

  // @Inject('DdataInjectorModule') private data: DdataInjectorModule;

  constructor(model: T) {
    super(model);
    this.setupHeaders();

    this.http = DdataInjectorModule.InjectorInstance.get(HttpClient);
  }

  /**
   * Set up the HTTP headers what can use every requests.
   */
  setupHeaders(): void {
    this.headers = new HttpHeaders({
      // tslint:disable-next-line: object-literal-key-quotes
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
      'Accepted-Encoding': 'application/json'
    });

    this.options = {
      headers: this.headers,
      responseType: 'json'
    };
  }

  /**
   * Send HTTP GET request to the API endpoint where can get the all items of requested resource in a PaginateInterface.
   * PaginateInterface is based on Laravel 6.x's pagination.
   *
   * The requested URL will be constructed like this: {environment.apiUrl}/{model.api_endpoint}
   *
   * If the ApiUrl is "http://www.yourdomain.com/api" and the API endpoint of the model is "post", then your url will be
   * "http://www.yourdomain.com/api/post"
   *
   * @returns Observable, PaginateInterface with initialized `T` type objects
   *
   * @example
   * constructor(
   *   private myRemoteStorageService: RemoteStorageService<Post>,
   * ) {}
   *
   * load() {
   *   this.myRemotStorageService.getAll().subscribe();
   * }
   */
  getAll(pageNumber: number = 0): Observable<PaginateInterface> {
    this.setupHeaders();
    const url = this.url + this.model.api_endpoint + (!!pageNumber ? `?page=${pageNumber}` : '');

    if (!!this.appEnv.environment.debug) {
      console.log('URL - getAll()', url);
    }

    return this.http
      .get(url, this.options)
      .pipe(map((result: any) => this.getNewPaginateObject(this.type, result)));
  }

  /**
   * Send a HTTP GET request to the API endpoint to get a PaginateInterface object belongs to the model.
   *
   * The requested URL will be constructed like this: {environment.apiUrl}/{model.api_endpoint}/{uniqueUri}/{pageNumber}
   *
   * If the ApiUrl is "http://www.yourdomain.com/api" and the API endpoint of the model is "post", and you want to get the
   * 2nd page (and unique Uri is empty - optional) then your url will be
   * "http://www.yourdomain.com/api/post/?page=2"
   *
   * @param pageNumber Number of the page
   * @param uniqueUrl Optional parameter what'll be put into the URL
   * @returns Observable, PaginateInterface with initialized `T` type objects
   *
   * @example
   * constructor(
   *   private myRemoteStorageService: RemoteStorageService<Post>,
   * ) {}
   *
   * load() {
   *   // pageNumber: 2
   *   // URL: http://www.yourdomain.com/api/post/?page=2
   *   this.myRemotStorageService.getPage(pageNumber).subscribe();
   *   // or
   *   // pageNumber: 2
   *   // uniqueUri: 'get-page/'
   *   // URL: http://www.yourdomain.com/api/post/get-page/?page=2
   *   this.myRemotStorageService.getPage(pageNumber, 'get-page/').subscribe();
   * }
   */
  getPage(pageNumber: number, uniqueUri: string = ''): Observable<PaginateInterface> {
    this.setupHeaders();
    const url = `${this.url + this.model.api_endpoint + uniqueUri}?page=${pageNumber}`;

    if (!!this.appEnv.environment.debug) {
      console.log('URL - getPaginatePage()', url);
    }

    return this.http
      .get(url, this.options)
      .pipe(map((result: any) => this.getNewPaginateObject(this.type, result)));
  }

  /**
   * Send HTTP GET request to the API endpoint where can get the all items of requested resource without PaginateInterface.
   * In Laravel 6.x you need to create a new resurce in the ResourceRegistrar.
   *
   * The requested URL will be constructed like this: {environment.apiUrl}/{model.api_endpoint}/list
   *
   * If the ApiUrl is "http://www.yourdomain.com/api" and the API endpoint of the model is "post", then your url will be
   * "http://www.yourdomain.com/api/post/list"
   *
   * @returns Observable, array of initialized `T` type objects
   *
   * @example
   * constructor(
   *   private myRemoteStorageService: RemoteStorageService<Post>,
   * ) {}
   *
   * load() {
   *   this.myRemotStorageService.getAllWithoutPaginate().subscribe();
   * }
   */
  getAllWithoutPaginate(): Observable<Array<T>> {
    this.setupHeaders();
    const url = `${this.url + this.model.api_endpoint}/list`;

    if (!!this.appEnv.environment.debug) {
      console.log('URL - getAllWithoutPaginate()', url);
    }

    return this.http.get(url, this.options).pipe(map((result: any) => this.hydrateArray(result)));
  }

  /**
   * Send HTTP GET request to the API endpoint where can get one instance of requested resource.
   *
   * The requested URL will be constructed like this: {environment.apiUrl}/{model.api_endpoint}/{id}
   *
   * If the ApiUrl is "http://www.yourdomain.com/api" and the API endpoint of the model is "post" and ID is 42, then your
   * url will be "http://www.yourdomain.com/api/post/42"
   *
   * @param id unique ID of instance
   * @returns Observable, initialized model of `T` type object
   *
   * @example
   * constructor(
   *   private myRemoteStorageService: RemoteStorageService<Post>,
   * ) {}
   *
   * load() {
   *   const id = 42;
   *   this.myRemotStorageService.getOne(id).subscribe();
   * }
   */
  getOne(id: number): Observable<T> {
    this.setupHeaders();
    const url = `${this.url + this.model.api_endpoint}/${id}`;

    if (!!this.appEnv.environment.debug) {
      console.log('URL - getOne()', url);
    }

    return this.http
      .get(url, this.options)
      .pipe(map((result: any) => this.hydrate(this.model, this.model).init(result)));
  }

  /**
   * Send HTTP GET request to the API endpoint's unique URI
   *
   * The requested URL will be constructed like this: {environment.apiUrl}/{uri}
   *
   * If the ApiUrl is "http://www.yourdomain.com/api" and the custom URI is "my/custom/uri", then your
   * url will be "http://www.yourdomain.com/api/my/custom/uri"
   *
   * @param uri unique URI string
   * @returns Observabe, any
   *
   * @example
   * constructor(
   *   private myRemoteStorageService: RemoteStorageService<Post>,
   * ) {}
   *
   * load() {
   *   const uri = '/filter/by/user/42';
   *   this.myRemotStorageService.getUri(uri).subscribe();
   * }
   */
  getUri(uri: string): Observable<any> {
    this.setupHeaders();
    const url = this.url + uri;

    if (!!this.appEnv.environment.debug) {
      console.log('URL - getUri()', url);
    }

    return this.http.get(url, this.options).pipe(map((result: any) => result));
  }

  /**
   * Send HTTP POST request to the API endpoint's unique URI
   *
   * The requested URL will be constructed like this: {environment.apiUrl}/{uri}
   *
   * If the ApiUrl is "http://www.yourdomain.com/api" and the custom URI is "my/custom/uri", then your
   * url will be "http://www.yourdomain.com/api/my/custom/uri"
   *
   * @param resource any data
   * @param uri unique URI string
   * @returns Observabe, any
   *
   * @example
   * constructor(
   *   private myRemoteStorageService: RemoteStorageService<Post>,
   * ) {}
   *
   * load() {
   *   const uri = '/filter/by/user/42';
   *   this.myRemotStorageService.getUri(uri).subscribe();
   * }
   */
  postUri(resource: any, uri: string): Observable<any> {
    this.setupHeaders();
    const url = this.url + this.model.api_endpoint + uri;

    if (!!this.appEnv.environment.debug) {
      console.log('URL - uniquePost()', url);
    }

    return this.http
      .post(url, JSON.stringify(resource), this.options)
      .pipe(map((result: any) => result));
  }

  /**
   * Send HTTP POST or PUT request to the API endpoint to create a new instance or update an existing one.
   *
   * Create or update depends on the model has `id` field and it's `0` or not.
   * If it's undefined, null or `0` there will be run a create (POST request), otherwise update (PUT request).
   *
   * Before send the create or update the model will be validated on it's custom validaton rules if defined.
   * You can read more about validation in BaseModel section.
   *
   * If the ApiUrl is "http://www.yourdomain.com/api" and the API endpoint of the model is "post", then your
   * url will be "http://www.yourdomain.com/api/post"
   *
   * @param model resource any kind of JSON object, what API can handle. Of course you should give a living model.
   *
   * @returns Observabe, number or boolean, depends on backend's settings. If it's a number, then it's the ID of
   * the saved instance.
   *
   * @example
   * constructor(
   *   private myRemoteStorageService: RemoteStorageService<Post>,
   * ) {}
   *
   * load() {
   *   const myPost = new Post().init();
   *   this.myRemotStorageService.save(myPost).subscribe();
   * }
   */
  save(model: T): Observable<number | boolean> {
    this.setupHeaders();

    try {
      model.validate();
    } catch (error) {
      return new Observable(() => {
        throw error;
      });
    }
    const preparedData = model.prepareToSave();

    if (!model.id) {
      // create
      const url = this.url + model.api_endpoint;

      if (!!this.appEnv.environment.debug) {
        console.log('URL - create()', url, preparedData);
      }

      return this.http.post(url, JSON.stringify(preparedData), this.options).pipe(
        map((result: any) => result.id),
        catchError((err) => of(this.handleValidatioErrorFeedback(err, model)))
      );
    } else {
      // update
      const url = `${this.url + model.api_endpoint}/${model.id}`;

      if (!!this.appEnv.environment.debug) {
        console.log('URL - update()', url, preparedData);
      }

      return this.http.put(url, JSON.stringify(preparedData), this.options).pipe(
        map((result: any) => result.id),
        catchError((err) => of(this.handleValidatioErrorFeedback(err, model)))
      );
    }
  }

  /**
   * Send HTTP DELETE request to the API endpoint to delete an instance.
   *
   * If the ApiUrl is "http://www.yourdomain.com/api" and the API endpoint of the model is "post" with ID 42, then your
   * url will be "http://www.yourdomain.com/api/post/42"
   *
   * @param model a living model, what you want to delete
   *
   * @returns Observabe, number with HTTP code of delete result
   *
   * @example
   * constructor(
   *   private myRemoteStorageService: RemoteStorageService<Post>,
   * ) {}
   *
   * load() {
   *   const myPost = new Post().init();
   *   this.myRemotStorageService.delete(myPost).subscribe();
   * }
   */
  delete(model: T): Observable<number> {
    const url = `${this.url + this.model.api_endpoint}/${model.id}`;

    if (!!this.appEnv.environment.debug) {
      console.log('URL - delete()', url);
    }

    return this.http.delete(url, this.options).pipe(map((result: any) => result));
  }

  /**
   * Send HTTP POST request to the API endpoint to delete multiple instances
   *
   * If the ApiUrl is "http://www.yourdomain.com/api" and the API endpoint of the model is "post", then your
   * url will be "http://www.yourdomain.com/api/post/multiple/delete"
   *
   * The IDs what you want to delete will be send in the request body as an object with this stucture:
   *
   * `{data: [1, 2, 4, 42, 69]}`
   *
   * @param models array of models what you want to delete
   *
   * @returns Observabe, any
   *
   * @example
   * constructor(
   *   private myRemoteStorageService: RemoteStorageService<Post>,
   * ) {}
   *
   * load() {
   *   const posts: Post[] = [new Post().init({id: 42}), new Post.init({id: 69})];
   *   this.myRemotStorageService.deleteMultiple(posts).subscribe();
   * }
   */
  deleteMultiple(models: Array<T>): Observable<{}> {
    const idsForDelete: Array<number> = [];
    const url = `${this.url + this.model.api_endpoint}/multiple/delete`;

    models.forEach((model: T) => {
      idsForDelete.push(model.id);
    });
    const preparedData = JSON.stringify({ data: idsForDelete });

    if (!!this.appEnv.environment.debug) {
      console.log('URL - deleteMultiple()', url, preparedData);
    }

    return this.http.post(url, preparedData, this.options).pipe(catchError(this.handleError));
  }

  /**
   * You can send one or more files to the backend with this function.
   *
   * Send files with HTTP POST as form data.
   *
   * You can send files with additional datas in the `data` parameter. This is optional parameter, where you can
   * send addition datas. For example folder ID, file descriptions, etc. It will be stringified befor sending and
   * will be attached for every file.
   *
   * If the ApiUrl is "http://www.yourdomain.com/api" and the API endpoint of the model is "post" and the `uri` is
   * `file`, then your url will be "http://www.yourdomain.com/api/post/file"
   *
   * @param uri the uri where you want to send the file
   * @param files Set of JavaScript File instances
   * @param data optional JSON object for additional datas
   *
   * @returns Observabe array, contains FileUploadProcessInterface instances.
   *
   * @example
   * // send files to http://www.yourdomain.com/api/post/file URL
   * constructor(
   *   private myRemoteStorageService: RemoteStorageService<Post>,
   * ) {}
   *
   * load() {
   *   const files: Set<File>;
   *   const datas = {
   *     folder_id: 99,
   *     description: 'Lorem ipsum',
   *   };
   *   this.myRemotStorageService.deleteMultiple('/file', files, datas).subscribe();
   * }
   */
  sendFiles(
    uri: string,
    id: number,
    files: Set<File>,
    data?: any
  ): Array<Observable<FileUploadProcessInterface>> {
    // set up custom headers to post
    const customHeaders = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Accepted-Encoding': 'application/json'
    });
    // set up options to report progress in file uploading
    const customOptions = {
      headers: customHeaders,
      reportProgress: true
    };
    // create statuses array to contain observables of file uploading
    const statuses: Array<Observable<FileUploadProcessInterface>> = [];

    files.forEach((file) => {
      // create URL
      const url = this.url + this.model.api_endpoint + uri;
      // create FormData object
      const formData: FormData = new FormData();

      // add file with file name to FormData
      formData.append('file', file, file.name);
      // add data to FormData object
      formData.append('data', JSON.stringify(data));
      // create a new HttpRequest object for the post of FormData
      const req = new HttpRequest('POST', url, formData, customOptions);
      // create a subject to follow the upload progress
      const progress = new Subject<number>();
      // create a variable to store the current progress in percent
      let percent = 0;

      if (!!this.appEnv.environment.debug) {
        console.log('URL - sendFiles()', url, file, formData);
      }
      const requestPipe = this.http.request(req).pipe(
        map((event: HttpEvent<any>) => {
          // variable to store the file name on the remote storage
          let remoteFileDatas: string = null;

          if (event.type === HttpEventType.UploadProgress) {
            // while the upload is in progress we just calculate & update the upload progress percent
            const percentDone = Math.round((100 * event.loaded) / event.total);

            percent = percentDone;
            progress.next(percentDone);
          } else if (event instanceof HttpResponse) {
            // if the upload is done we catch the remote file datas
            remoteFileDatas = event.body ? (event.body as string) : null;
            progress.complete();
          }
          const fileUploadProcessInterface: FileUploadProcessInterface = {
            // remote file datas - null until upload isn't done
            remoteFileDatas,
            // the original file name
            file: file.name,
            // observable upload progress percent
            progress: progress.asObservable()
          };

          return fileUploadProcessInterface;
        })
      );

      statuses.push(requestPipe);
    });

    return statuses;
  }

  /**
   * Handle errors with custom error handlers.
   *
   * @param error HTTP Error Response
   */
  handleError = (error: HttpErrorResponse) => throwError(new DdataCoreError(error));

  /**
   * Handle validation error feedback.
   *
   * @param err Error message
   * @param model Model of `T` type
   */
  private handleValidatioErrorFeedback(err: any, model: T): void {
    if (!!this.appEnv.environment.debug) {
      console.log(err);
    }

    if (err.status === 480) {
      model.validationErrors = Object.keys(err.error.errors);
    }

    throw err;
  }
}
