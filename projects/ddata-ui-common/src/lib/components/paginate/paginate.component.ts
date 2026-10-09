import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { PaginateInterface } from '@netdjw/ddata-core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dd-paginate',
  templateUrl: './paginate.component.html',
  styleUrls: ['./paginate.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DdataUiPaginateComponent implements OnInit {
  @Input() paginate: PaginateInterface;
  @Input() previousText = 'Previous';
  @Input() nextText = 'Next';
  @Input() paginatorText = 'Paginator';

  @Output() readonly changePage: EventEmitter<number> = new EventEmitter<number>();

  // tslint:disable-next-line: variable-name
  _paginate: Observable<PaginateInterface>;
  numbers: Observable<Array<number>>;
  currentPage = 0;

  constructor() {}

  ngOnInit(): void {
    this._paginate = this.paginate ? of(this.paginate) : undefined;
    this.numbers = of(this.paginate).pipe(
      map((result: PaginateInterface) => {
        this.currentPage = result?.current_page ?? 0;

        return Array(result?.last_page ?? 0)
          .fill(0)
          .map((x, i) => i + 1);
      })
    );
  }

  swithPage(direction: 'next' | 'prev'): void {
    this.changePage.emit(this.currentPage + (direction === 'next' ? 1 : -1));
  }
}
