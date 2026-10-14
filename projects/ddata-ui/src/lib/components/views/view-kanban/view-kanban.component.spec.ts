import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ID } from '@netdjw/ddata-core';
import { BehaviorSubject } from 'rxjs';
import { DdataUiModule } from '../../../ddata-ui.module';
import {
  CasefileInterface,
  CasefileStatusInterface
} from '../../../models/casefile/casefile.interface';
import { KanbanStatus } from '../../../models/view/kanban/kanban-status.model';
import { ViewKanbanComponent } from './view-kanban.component';

describe('ViewKanbanComponent', () => {
  let component: ViewKanbanComponent;
  let fixture: ComponentFixture<ViewKanbanComponent>;
  let todo: CasefileStatusInterface;
  let done: CasefileStatusInterface;
  let casefiles: Array<CasefileInterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DdataUiModule]
    }).compileComponents();
    fixture = TestBed.createComponent(ViewKanbanComponent);
    component = fixture.componentInstance;
    todo = { id: 1 as ID, name: 'Teendő', color: '#ff0000' };
    done = { id: 2 as ID, name: 'Kész', color: '#00ff00' };
    casefiles = [
      {
        id: 10 as ID,
        name: 'First',
        status_id: 1 as ID,
        status: { ...todo },
        estimated_time: '1:30:00'
      },
      {
        id: 11 as ID,
        name: 'Second',
        status_id: 1 as ID,
        status: { ...todo },
        estimated_time: '2:15:00'
      },
      {
        id: 12 as ID,
        name: 'Third',
        status_id: 3 as ID,
        status: { id: 3 as ID, name: 'Új', color: '#0000ff' }
      }
    ];
    component.statuses = new BehaviorSubject([todo, done]);
    component.data = new BehaviorSubject(casefiles);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should group the casefiles by status and add the unknown statuses', () => {
    expect(component.kanbanData.statuses.map((status) => status.name)).toEqual([
      'Teendő',
      'Kész',
      'Új'
    ]);
    expect(component.kanbanData.statuses.map((status) => status.casefiles.length)).toEqual([
      2, 0, 1
    ]);
  });

  it('should render the statuses and the casefiles', () => {
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelectorAll('.kanban-status').length).toBe(3);
    expect(element.querySelectorAll('.card').length).toBe(3);
    expect(element.textContent).toContain('3ó 45p');
  });

  it('should show the no data component without statuses', () => {
    component.statuses = new BehaviorSubject([]);
    component.data = new BehaviorSubject([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('dd-no-data')).not.toBeNull();
  });

  it('setHeight() should fit the container to the window', () => {
    vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(800);
    fixture.detectChanges();

    expect(component.kanbanStatusContainer.nativeElement.style.height).toBe('611px');
  });

  it('getEstimatedTimes() should sum the estimated times of the casefiles', () => {
    const status = new KanbanStatus().init({
      casefiles: [
        { id: 1 as ID, estimated_time: '2:3:1' },
        { id: 2 as ID, estimated_time: '3:2:1' },
        { id: 3 as ID, estimated_time: '1:1:1' },
        { id: 4 as ID }
      ]
    });

    expect(component.getEstimatedTimes(status)).toBe('6ó 6p');
  });

  it('open() should emit the original casefile', () => {
    const spy = vi.spyOn(component.openCasefile, 'emit');

    component.open({ id: 11 as ID });

    expect(spy).toHaveBeenCalledWith(casefiles[1]);
  });

  it('should move a casefile to another status with drag and drop', () => {
    fixture.detectChanges();
    const spy = vi.spyOn(component.updateCasefile, 'emit');
    const [todoStatus, doneStatus] = component.kanbanData.statuses;
    const casefile = todoStatus.casefiles[0];

    component.dragstart(casefile, todoStatus);

    expect(component.dragCasefile).toBe(casefile);
    expect(component.dragFromStatus).toBe(todoStatus);
    expect(fixture.nativeElement.querySelector('.kanban-status').classList).toContain(
      'drag-active'
    );

    component.dragover(todoStatus);
    component.dragover(doneStatus);

    expect(todoStatus.is_drag_over).toBe(false);
    expect(doneStatus.is_drag_over).toBe(true);

    component.dragend();

    expect(todoStatus.casefiles.map((item) => item.id)).toEqual([11]);
    expect(doneStatus.casefiles.map((item) => item.id)).toEqual([10]);
    expect(casefiles[0].status_id).toBe(2);
    expect(casefiles[0].status.name).toBe('Kész');
    expect(spy).toHaveBeenCalledWith(casefiles[0]);
    expect(fixture.nativeElement.querySelector('.kanban-status').classList).not.toContain(
      'drag-active'
    );
  });

  it('should insert the dragged casefile before the casefile it is dropped on', () => {
    const [todoStatus] = component.kanbanData.statuses;
    const third = component.kanbanData.statuses[2].casefiles[0];

    component.dragstart(third, component.kanbanData.statuses[2]);
    component.dragover(todoStatus);
    component.dragoverCasefile(todoStatus.casefiles[1]);

    expect(component.dragOverCasefileContainer).toBe(todoStatus.casefiles[1]);

    component.dragend();

    expect(todoStatus.casefiles.map((item) => item.id)).toEqual([10, 12, 11]);
    expect(component.kanbanData.statuses[2].casefiles).toEqual([]);
  });
});
