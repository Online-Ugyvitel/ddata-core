
import { Component, ElementRef, HostListener, Input, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
// tslint:disable-next-line: max-line-length
import { DdataCoreModule, Paginate, PaginateInterface, ProxyFactoryService, ProxyServiceInterface, SpinnerService, SpinnerServiceInterface } from 'ddata-core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { IconSetInterface } from '../../models/icon-set/icon-set.interface';
import { BaseSearch } from '../../models/search/base-search.model';
import { BaseSearchResult } from '../../models/search/result/base-search-result.model';
import { SearchResultInterface } from '../../models/search/result/search-result.interface';
import { SearchInterface } from '../../models/search/search.interface';

@Component({
    selector: 'dd-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    standalone: false
})
export class DdataInputSearchComponent implements OnDestroy {
  @Input() model: SearchInterface = new BaseSearch().init();
  @Input() pageNumber = 0;
  @Input() service: ProxyServiceInterface<SearchInterface> = new ProxyFactoryService<SearchInterface>().get(BaseSearch);

  icon: IconSetInterface = {
    search: faSearch,
  };
  isActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  models: SearchResultInterface[] = [];
  paginate: PaginateInterface = new Paginate(BaseSearchResult);
  spinner: SpinnerServiceInterface = DdataCoreModule.InjectorInstance.get<SpinnerServiceInterface>(SpinnerService);

  @ViewChild('searchInput') searchInput: ElementRef;

  @HostListener('document:click', ['$event']) clickout(event: any): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // click out of component
      this.close();
    }
  }

  constructor(
    private elementRef: ElementRef,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    this.isActive.next(false);
  }

  close(): void {
    this.models = [];
    this.isActive.next(false);
  }

  search(): Observable<any> {
    // don't run if search string is empty, but reset models & close previous connection
    if (this.model.searchText === '') {
      this.isActive.next(false);
      this.models = [];

      return;
    }

    // close previous connection
    this.isActive.next(false);

    return fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      // run after 500 ms of last keyup
      debounceTime(500),

      // run only if value is changed
      distinctUntilChanged(),

      // run only if search input is still active and value is not empty string
      takeUntil(this.isActive),

      // switch on spinner
      tap(() => this.spinner.on('search')),

      // run search method
      switchMap(() => this.service.search(this.model.prepareToSave(), this.pageNumber).pipe(
        map((result: PaginateInterface) => {
          this.setResult(result);

          return result;
        })
      )),

      // switch off spinner
      finalize(() => this.spinner.off('search')),

    );
  }

  changePage(turnToPage: number): void {
    this.service.getPage(turnToPage).pipe(
      // run only if search input is still active and value is not empty string
      takeUntil(this.isActive),

      // take only last result
      take(1),

      // switch on spinner
      tap(() => this.spinner.on('global-search-change-page')),

      // set result
      map((result: PaginateInterface) => {
        this.setResult(result);

        return result;
      }),

      // switch off spinner
      finalize(() => this.spinner.off('global-search-change-page')),

    ).subscribe();
  }

  go(model: SearchInterface): void {
    const url = model.url + '/edit/' + model.id;

    this.close();
    this.router.navigateByUrl(url);
  }

  private setResult(result: PaginateInterface): void {
    this.paginate = result;
    this.models = [];

    result.data.forEach((item: SearchResultInterface) => {
      const model = new BaseSearchResult().init(item);
      this.models.push(model);
    });
  }
}
