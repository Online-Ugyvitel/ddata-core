import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  Renderer2,
  AfterViewInit
} from '@angular/core';
import { CasefileInterface } from 'src/app/models/casefile/casefile.interface';
import { ViewDateSeparatedListInterface } from 'src/app/models/view/date/separated/list/view-date-separated-list.interface';
import { ViewDateSeparatedList } from 'src/app/models/view/date/separated/list/view-date-spearated-list.interface';
import * as moment from 'moment';
import { Global } from 'src/app/models/global.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dd-view-date-separated-list',
  templateUrl: './view-date-separated-list.component.html',
  styleUrls: ['./view-date-separated-list.component.scss'],
  standalone: false
})
export class ViewDateSeparatedListComponent implements OnInit, AfterViewInit {
  @Input() set data(data: BehaviorSubject<Array<CasefileInterface>>) {
    data.subscribe((models: Array<CasefileInterface>) => {
      this.originalData = models;
      this.dateSeparatedListData = [];
      this.dateSeparatedListData.push(...this.convertToDateSeparatedList(models));
    });
  }

  @Input() title = 'Dátum szerint csoportosított nézet';
  @Output() openCasefile: EventEmitter<CasefileInterface> = new EventEmitter();
  @Output() deleteCasefile: EventEmitter<CasefileInterface> = new EventEmitter();
  @ViewChild('listContainer') listContainer: ElementRef;
  dateSeparatedListData: Array<ViewDateSeparatedListInterface> = [];
  originalData: Array<CasefileInterface> = [];
  moment = moment;
  icon = this.global.icon;

  constructor(
    private readonly renderer: Renderer2,
    private readonly global: Global
  ) {
    this.moment.locale('hu');
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.setHeight();
  }

  setHeight() {
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
        (_dateGroup) => _dateGroup.name === this.setListItemName(item.deadline)
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

  setListItemName(deadline: string): string {
    if (!deadline) {
      return 'Határidő nélküli feladatok';
    }

    return this.moment(deadline).fromNow();
  }

  open(casefile: CasefileInterface) {
    this.openCasefile.emit(this.findData(casefile));
  }

  delete(casefile: CasefileInterface) {
    this.deleteCasefile.emit(this.findData(casefile));
  }

  private findData(casefile: CasefileInterface): CasefileInterface {
    return this.originalData.find((item) => item.id === casefile.id);
  }
}
