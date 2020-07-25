import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { FileUploadProcessInterface } from '../../models/file/file-upload-process.interface';
import { PaginateInterface } from '../../models/paginate/paginate.interface';
import { Paginate } from '../../models/paginate/paginate.model';
import { DataServiceAbstract } from '../data/data-service.abstract';
import { LocalDataServiceInterface } from '../local-data/local-data-service.interface';
import { LocalDataService } from '../local-data/local-data.service';
import { NotificationServiceInterface } from '../notification/notification-service.interface';
import { NotificationService } from '../notification/notification.service';
import { RemoteDataServiceInterface } from '../remote-data/remote-data-service.interface';
import { RemoteDataService } from '../remote-data/remote-data.service';

// @dynamic
export class ProxyService<T extends BaseModelInterface<T>> extends DataServiceAbstract<T> {
  private notificationService: NotificationServiceInterface;
  private localStorageService: LocalDataServiceInterface<T>;
  private remoteStorageService: RemoteDataServiceInterface<T>;
  private type: new () => T;

  constructor(
    private instance: T,
  ) {
    super(instance);
    this.notificationService = new NotificationService();
    this.localStorageService = new LocalDataService(this.instance);
    this.remoteStorageService = new RemoteDataService(this.instance);
  }

  getOne(id: number): Observable<T> {
    if (this.instance.use_localstorage) {
      return of(this.localStorageService.findById(id));
    } else {
      return this.remoteStorageService.getOne(id).pipe(map((result: T) => result));
    }
  }

  getAll(pageNumber: number = 0): Observable<PaginateInterface> {
    if (this.instance.use_localstorage) {
      const paginate = new Paginate(this.instance);
      paginate.data = this.localStorageService.allFromLocal();

      return of(paginate);
    } else {
      return this.remoteStorageService.getAll(pageNumber).pipe(map((result: PaginateInterface) => result));
    }
  }

  getAllWithoutPaginate(): Observable<T[]> {
    if (this.instance.use_localstorage) {
      return of(this.localStorageService.allFromLocal());
    } else {
      return this.remoteStorageService.getAllWithoutPaginate().pipe(map((result: T[]) => result));
    }
  }

  getAllSortedBy(fieldName: string = 'name'): Observable<T[]> {
    if (this.instance.use_localstorage) {
      return of(this.localStorageService.allFromLocalSortedBy(fieldName));
    } else {
      return this.remoteStorageService.getAllWithoutPaginate().pipe(map((result: T[]) => result));
    }
  }

  getAllSortedByDesc(fieldName: string = 'name'): Observable<T[]> {
    if (this.instance.use_localstorage) {
      return of(this.localStorageService.allFromLocalSortedByDesc(fieldName));
    } else {
      return this.remoteStorageService.getAllWithoutPaginate().pipe(map((result: T[]) => result));
    }
  }

  getPage(pageNumber: number): Observable<PaginateInterface> {
    if (this.instance.use_localstorage) {
      // TODO meg kell csinálni, hogy itt is egy lapozót adjon vissza
    } else {
      return this.remoteStorageService.getPage(pageNumber).pipe(map( (resolve: PaginateInterface) => resolve));
    }
  }

  getUri(uri: string): Observable<any> {
    return this.remoteStorageService.getUri(uri).pipe(map((result: any) => result));
  }

  postUri(data: any, uri: string): Observable<any> {
    return this.remoteStorageService.postUri(data, uri).pipe(map((result: any) => result));
  }

  findById(id: number): Observable<T> {
    if (this.instance.use_localstorage) {
      return of(this.localStorageService.findById(id));
    } else {
      // TODO megcsinálni a remote-ra is
    }
  }

  findByField(fieldName: string, value: any): Observable<T> {
    if (this.instance.use_localstorage) {
      return of(this.localStorageService.findByField(fieldName, value));
    } else {
      // TODO megcsinálni a remote-ra is
    }
  }

  filterByField(fieldName: string, value: any): Observable<T[]> {
    if (this.instance.use_localstorage) {
      return of(this.localStorageService.filterByField(fieldName, value));
    } else {
      // TODO megcsinálni a remote-ra is
    }
  }

  search(data: any,  pageNumber?: number): Observable<PaginateInterface> {
    const uri = !!pageNumber ? `/search?page=${ pageNumber }` : '/search';

    return this.remoteStorageService.postUri(data, uri).pipe(map((result: PaginateInterface) =>
      this.getNewPaginateObject(this.type, result)));
  }

  searchWithoutPaginate(data: any): Observable<T[]> {
    const uri = '/search?paginate=off';

    return this.remoteStorageService.postUri(data, uri).pipe(map((result: T[]) => {
      result = this.setModels(result);
      return result;
    }));
  }

  save(model: T): Observable<number | Observable<number>> {
    if (!model) {
      return of(0);
    }

    if (model.use_localstorage) {
      return this.remoteStorageService.save(model).pipe(map( (resolve: number) => {
        this.localStorageService.save(model, resolve);
        this.successNotify();

        return resolve;
      }));
    } else {
      return this.remoteStorageService.save(model).pipe(map((resolve: number) => {
        this.successNotify();

        return resolve;
      }));
    }
  }

  private successNotify(): void {
    this.notificationService.add('Siker', 'A mentés sikeres', 'success');
  }

  delete(model: T, paginate: PaginateInterface): Observable<PaginateInterface> {
    if (!model) {
      return of(paginate);
    }

    const models = paginate.data;
    if (model.id === 0) {
      models.splice( models.indexOf(model), 1);
      return of(paginate);
    }

    if (model.use_localstorage) {
      return this.remoteStorageService.delete(model).pipe(
        map((resultDelete: number) => {
          if (resultDelete) {
            this.localStorageService.delete(model);
          }
        }),
        switchMap((): Observable<PaginateInterface> => this.remoteStorageService.getAll().pipe(
          map((resultGetAll: PaginateInterface): PaginateInterface => resultGetAll)
        ))
      );
    } else {
      return this.remoteStorageService.delete(model).pipe(map((result: number) => {
        if (result) {
          models.splice( models.indexOf(model), 1);
        }

        return paginate;
      }));
    }
  }

  deleteMultiple(models: T[], paginate: PaginateInterface): Observable<PaginateInterface | Observable<PaginateInterface>> {
    if (!models) {
      return of(paginate);
    }

    const modelsToShow = paginate.data;
    models.forEach((model: T) => {
      if (model.id === 0) {
        modelsToShow.splice( modelsToShow.indexOf(model), 1);
        return of(paginate);
      }

    });

    if (this.instance.use_localstorage) {
      return this.remoteStorageService.deleteMultiple(models).pipe(
        map((resultDelete: boolean) => {
          if (resultDelete) {
            models.forEach((model: T) => {
              this.localStorageService.delete(model);
            });
          }
        }),
        switchMap((): Observable<PaginateInterface> => this.remoteStorageService.getAll().pipe(
          map((resultGetAll: PaginateInterface): PaginateInterface => resultGetAll)
        ))
      );
    } else {
      return this.remoteStorageService.deleteMultiple(models).pipe(map((result: boolean) => {
        if (result) {
          models.forEach((model: T) => {
            modelsToShow.splice( modelsToShow.indexOf(model), 1);
          });
        }

        return paginate;
      }));
    }
  }

  watch(): Observable<boolean> {
    return this.localStorageService.watch().pipe(map((result: boolean) => result));
  }

  // TODO törölhető funkció
  registerObserver(target: T[], sortBy: string = 'name'): void {
    this.watch().subscribe((refresh: boolean) => {
      if (refresh) {
        this.getAllSortedBy(sortBy).subscribe((result: T[]) => {
          target = result;
        });
      }
    });
  }


  sendFiles(subUri: string, id: number, files: Set<File>, data?: any): Observable<FileUploadProcessInterface>[] {
    return this.remoteStorageService.sendFiles(subUri, id, files, !!data ? data : null);
  }
}
