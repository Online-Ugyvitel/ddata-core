import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PaginateInterface } from 'ddata-core';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'dd-paginate',
    templateUrl: './paginate.component.html',
    styleUrls: ['./paginate.component.css'],
    standalone: false
})
export class DdataUiPaginateComponent implements OnInit {
  @Input() paginate: Subject<PaginateInterface>;
  @Input() previousText = 'Previous';
  @Input() nextText = 'Next';
  @Input() paginatorText = 'Paginator';

  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();

  // tslint:disable-next-line: variable-name
  _paginate: Observable<PaginateInterface>;
  numbers: Observable<number[]>;
  currentPage = 0;

  constructor() { }

  ngOnInit(): void {
    this.numbers = this.paginate.pipe(
      map((result: PaginateInterface) => {
        this.currentPage = result.current_page;

        return Array(result.last_page).fill(0).map((x, i) => i + 1);
      })
    );
  }

  swithPage(direction: 'next' | 'prev'): void {
    this.changePage.emit(this.currentPage + (direction === 'next' ? 1 : -1));
  }

}
