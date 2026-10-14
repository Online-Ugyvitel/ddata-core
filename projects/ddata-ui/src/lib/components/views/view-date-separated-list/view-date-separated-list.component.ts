import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  Renderer2,
  AfterViewInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CasefileInterface } from '../../../models/casefile/casefile.interface';
import { Global } from '../../../models/global.model';
import {
  ViewDateSeparatedList,
  ViewDateSeparatedListInterface
} from '../../../models/view/date-separated-list/view-date-separated-list.model';
// the largest unit what fits into the time difference is displayed, in seconds
const relativeTimeUnits: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
  ['second', 1]
];

@Component({
  selector: 'dd-view-date-separated-list',
  templateUrl: './view-date-separated-list.component.html',
  styleUrls: ['./view-date-separated-list.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewDateSeparatedListComponent implements AfterViewInit {
  @Input() set data(data: BehaviorSubject<Array<CasefileInterface>>) {
    data.subscribe((models: Array<CasefileInterface>) => {
      this.originalData = models;
      this.dateSeparatedListData = [];
      this.dateSeparatedListData.push(...this.convertToDateSeparatedList(models));
    });
  }

  @Input() title = 'Dátum szerint csoportosított nézet';
  @Input() locale = 'hu';
  @Input() noDeadlineText = 'Határidő nélküli feladatok';
  @Output() readonly openCasefile: EventEmitter<CasefileInterface> = new EventEmitter();
  @Output() readonly deleteCasefile: EventEmitter<CasefileInterface> = new EventEmitter();
  @ViewChild('listContainer') listContainer: ElementRef;
  dateSeparatedListData: Array<ViewDateSeparatedListInterface> = [];
  originalData: Array<CasefileInterface> = [];
  icon = new Global().icon;

  constructor(private readonly renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.setHeight();
  }

  setHeight(): void {
    if (!!this.listContainer) {
      const newHeight = document.documentElement.clientHeight - 189;

      this.renderer.setStyle(this.listContainer.nativeElement, 'height', `${newHeight}px`);
    }
  }

  convertToDateSeparatedList(
    data: Array<CasefileInterface>
  ): Array<ViewDateSeparatedListInterface> {
    const dateSeparatedListData: Array<ViewDateSeparatedListInterface> = [];

    data.forEach((item: CasefileInterface) => {
      let casefilesByDate = dateSeparatedListData.find(
        (dateGroup) => dateGroup.name === this.setListItemName(item.deadline)
      );

      if (!casefilesByDate) {
        casefilesByDate = new ViewDateSeparatedList().init({
          name: this.setListItemName(item.deadline),
          date: item.deadline
        });

        dateSeparatedListData.push(casefilesByDate);
      }

      casefilesByDate.casefiles.push(item);
    });

    this.setListsName(dateSeparatedListData);

    return dateSeparatedListData;
  }

  setListsName(dateSeparatedListData: Array<ViewDateSeparatedListInterface>): void {
    dateSeparatedListData.forEach((item: ViewDateSeparatedListInterface) => {
      if (!item.name) {
        item.name = this.setListItemName(item.date);
      }
    });
  }

  setListItemName(deadline: string, now: Date = new Date()): string {
    const date = new Date(deadline ?? '');

    if (!deadline || isNaN(date.getTime())) {
      return this.noDeadlineText;
    }
    const seconds = (date.getTime() - now.getTime()) / 1000;
    const [unit, unitSeconds] = relativeTimeUnits.find(([, size]) => Math.abs(seconds) >= size) ?? [
      'second',
      1
    ];

    return new Intl.RelativeTimeFormat(this.locale, { numeric: 'auto' }).format(
      Math.round(seconds / unitSeconds),
      unit
    );
  }

  open(casefile: CasefileInterface): void {
    this.openCasefile.emit(this.findData(casefile));
  }

  delete(casefile: CasefileInterface): void {
    this.deleteCasefile.emit(this.findData(casefile));
  }

  private findData(casefile: CasefileInterface): CasefileInterface {
    return this.originalData.find((item) => item.id === casefile.id);
  }
}
