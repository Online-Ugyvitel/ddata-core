import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CasefileInterface } from 'src/app/models/casefile/casefile.interface';
import { CasefileStatusInterface } from 'src/app/models/casefile/status/casefile-status.interface';
import { KanbanCasefileInterface } from 'src/app/models/kanban/casefile/kanban-casefile.interface';
import { KanbanStatusInterface } from 'src/app/models/kanban/status/kanban-status.interface';
import { KanbanStatus } from 'src/app/models/kanban/status/kanban-status.model';
import { ViewKanbanInterface } from 'src/app/models/view/kanban/view-kanban.interface';
import { ViewKanban } from 'src/app/models/view/kanban/view-kanban.model';

@Component({
  selector: 'dd-view-kanban',
  templateUrl: './view-kanban.component.html',
  styleUrls: ['./view-kanban.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewKanbanComponent implements AfterViewInit {
  @Input() set data(data: BehaviorSubject<Array<CasefileInterface>>) {
    data.subscribe((models: Array<CasefileInterface>) => {
      this.originalData = models;
      this.kanbanData = this.convertToKanban(this.originalData);
    });
  }

  @Input() title = 'Kanban nézet';
  @Input() set statuses(subject: BehaviorSubject<Array<CasefileStatusInterface>>) {
    subject.subscribe((statuses: Array<CasefileStatusInterface>) => {
      this.statusList = statuses;
      this.kanbanData = this.convertToKanban(this.originalData);
    });
  }

  @Output() readonly openCasefile: EventEmitter<CasefileInterface> = new EventEmitter();
  @Output() readonly updateCasefile: EventEmitter<CasefileInterface> = new EventEmitter();
  @ViewChild('kanbanStatusContainer') kanbanStatusContainer: ElementRef;
  statusList: Array<CasefileStatusInterface> = [];
  kanbanData: ViewKanbanInterface;
  originalData: Array<CasefileInterface> = [];
  dragFromStatus: KanbanStatusInterface = null;
  dragOverStatus: KanbanStatusInterface = null;
  dragOverCasefileContainer: KanbanCasefileInterface = null;
  dragCasefile: CasefileInterface = null;

  constructor(private readonly renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.setHeight();
  }

  setHeight(): void {
    if (!!this.kanbanStatusContainer) {
      const newHeight = document.documentElement.clientHeight - 189;

      this.renderer.setStyle(this.kanbanStatusContainer.nativeElement, 'height', `${newHeight}px`);
    }
  }

  convertToKanban(data: Array<CasefileInterface>): ViewKanbanInterface {
    const kanbanDataSet = new ViewKanban().init({ name: this.title });

    // set statuses
    this.statusList.forEach((status: KanbanStatusInterface) => {
      kanbanDataSet.statuses.push(
        new KanbanStatus().init({
          id: status.id,
          name: status.name,
          color: status.color,
          casefiles: []
        })
      );
    });

    data.forEach((item: CasefileInterface) => {
      // find status
      const status = kanbanDataSet.statuses.find((statusItem) => statusItem.id === item.status_id);

      if (!status) {
        // if status doesn't exists, create it and add the item
        kanbanDataSet.statuses.push(
          new KanbanStatus().init({
            id: item.status.id,
            name: item.status.name,
            color: item.status.color,
            casefiles: [item]
          })
        );

        return;
      }

      status.casefiles.push(item);
    });

    return kanbanDataSet;
  }

  open(casefile: CasefileInterface): void {
    this.openCasefile.emit(this.findData(casefile));
  }

  dragstart(casefile: CasefileInterface, status: KanbanStatusInterface): void {
    this.dragCasefile = casefile;
    this.dragFromStatus = status;
    const statuses = Array.from(document.getElementsByClassName('kanban-status'));

    statuses.forEach((statusElement: HTMLElement) => {
      statusElement.classList.add('drag-active');
    });
  }

  dragend(): void {
    // set casefile's status & status_id
    this.dragCasefile.status_id = this.dragOverStatus.id;
    this.dragCasefile.status = this.dragOverStatus;

    // add to new status
    if (!!this.dragOverCasefileContainer) {
      const index = this.dragOverStatus.casefiles.indexOf(this.dragOverCasefileContainer);

      if (index !== -1) {
        this.dragOverStatus.casefiles.splice(index, 0, this.dragCasefile);
      } else {
        this.dragOverStatus.casefiles.push(this.dragCasefile);
      }
    } else {
      this.dragOverStatus.casefiles.push(this.dragCasefile);
    }

    // remove from old status
    this.dragFromStatus.casefiles.splice(
      this.dragFromStatus.casefiles.indexOf(this.dragCasefile),
      1
    );
    // clean up CSS classes
    const statuses = Array.from(document.getElementsByClassName('kanban-status'));

    statuses.forEach((status: HTMLElement) => {
      status.classList.remove('drag-active');
    });
    // find original casefile
    const casefile = this.findData(this.dragCasefile);

    // set new status on original casefile
    casefile.status.id = this.dragCasefile.status.id;
    casefile.status.name = this.dragCasefile.status.name;
    casefile.status.color = this.dragCasefile.status.color;

    // emit the updateCasefile event
    this.updateCasefile.emit(casefile);
  }

  dragover(status: KanbanStatusInterface): void {
    this.kanbanData.statuses.forEach(
      (statusItem: KanbanStatusInterface) => (statusItem.is_drag_over = false)
    );
    status.is_drag_over = true;
    this.dragOverStatus = status;
  }

  dragoverCasefile(casefile: KanbanCasefileInterface): void {
    this.dragOverCasefileContainer = casefile;
  }

  getEstimatedTimes(status: KanbanStatusInterface): string {
    let allMiliseconds = 0;

    status.casefiles.forEach((casefile: KanbanCasefileInterface) => {
      allMiliseconds += this.convertToMiliseconds(casefile.estimated_time);
    });

    return this.convertToTime(allMiliseconds);
  }

  private findData(casefile: KanbanCasefileInterface): CasefileInterface {
    return this.originalData.find((item) => item.id === casefile.id);
  }

  private convertToMiliseconds(time: string): number {
    if (time.length === 0) {
      return 0;
    }

    return (
      (Number(time.split(':')[0]) * 60 * 60 +
        Number(time.split(':')[1]) * 60 +
        Number(time.split(':')[2])) *
      1000
    );
  }

  private convertToTime(miliseconds: number): string {
    const minutes = Math.floor((miliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((miliseconds / (1000 * 60 * 60)) % 24);

    return this.setTimeString(hours.toString(), minutes.toString());
  }

  private setTimeString(hoursString: string, minutesString: string): string {
    const text = [];

    if (hoursString !== '0') {
      text.push(`${hoursString}ó`);
    }

    if (minutesString !== '0') {
      text.push(`${minutesString}p`);
    }

    return text.join(' ');
  }

  // /**
  //  * Moves an item one index in an array to another.
  //  * @param array Array in which to move the item.
  //  * @param fromIndex Starting index of the item.
  //  * @param toIndex Index to which the item should be moved.
  //  */
  // moveItemInArray<T = any>(array: T[], fromIndex: number, toIndex: number): void {
  //   const from = this.clamp(fromIndex, array.length - 1);
  //   const to = this.clamp(toIndex, array.length - 1);

  //   if (from === to) {
  //     return;
  //   }

  //   const target = array[from];
  //   const delta = to < from ? -1 : 1;

  //   for (let i = from; i !== to; i += delta) {
  //     array[i] = array[i + delta];
  //   }

  //   array[to] = target;
  // }

  // /** Clamps a number between zero and a maximum. */
  // clamp(value: number, max: number): number {
  //   return Math.max(0, Math.min(max, value));
  // }
}
