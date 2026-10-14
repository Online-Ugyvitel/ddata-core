import { AsyncPipe } from '@angular/common';
import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ID } from '@netdjw/ddata-core';
import { BehaviorSubject } from 'rxjs';
import {
  CasefileInterface,
  CasefileStatusInterface
} from '../../models/casefile/casefile.interface';
import { KanbanStatus } from '../../models/view/kanban/kanban-status.model';
import { ViewKanban } from '../../models/view/kanban/view-kanban.model';
import { ViewKanbanComponent } from './view-kanban.component';
const todo: CasefileStatusInterface = { id: 1 as ID, name: 'Teendő', color: '#ff0000' };
const doing: CasefileStatusInterface = { id: 2 as ID, name: 'Folyamatban', color: '#ffff00' };
const done: CasefileStatusInterface = { id: 3 as ID, name: 'Kész', color: '#00ff00' };

function dragEvent(type: string, dataTransfer?: Partial<DataTransfer>): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });

  if (dataTransfer) {
    Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
  }

  return event;
}

function keyEvent(key: string): KeyboardEvent {
  return new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
}

@Component({
  imports: [ViewKanbanComponent, AsyncPipe],
  template: `
    <dd-view-kanban [data]="data$ | async" [statuses]="statuses$ | async"></dd-view-kanban>
    <dd-view-kanban [data]="other" [statuses]="otherStatuses"></dd-view-kanban>
  `
})
class HostComponent {
  data$ = new BehaviorSubject<Array<CasefileInterface>>([{ id: 1 as ID, status_id: 1 as ID }]);
  statuses$ = new BehaviorSubject<Array<CasefileStatusInterface>>([todo]);
  other: Array<CasefileInterface> = [{ id: 2 as ID, status_id: 1 as ID }];
  otherStatuses = [todo, done];
}

describe('ViewKanbanComponent', () => {
  let component: ViewKanbanComponent;
  let fixture: ComponentFixture<ViewKanbanComponent>;
  let element: HTMLElement;
  let casefiles: Array<CasefileInterface>;
  let updated: Array<CasefileInterface>;
  let opened: Array<CasefileInterface>;
  const columns = (): Array<HTMLElement> => Array.from(element.querySelectorAll('.kanban-status'));
  const cards = (column: number): Array<HTMLElement> =>
    Array.from(columns()[column].querySelectorAll('.card'));
  const ids = (): Array<Array<number>> =>
    component.board().statuses.map((status) => status.casefiles.map((casefile) => casefile.id));
  const setInputs = (
    data: Array<CasefileInterface>,
    statuses: Array<CasefileStatusInterface>
  ): void => {
    fixture.componentRef.setInput('data', data);
    fixture.componentRef.setInput('statuses', statuses);
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ViewKanbanComponent] });
    fixture = TestBed.createComponent(ViewKanbanComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    casefiles = [
      { id: 10 as ID, name: 'First', status_id: 1 as ID, status: todo, estimated_time: '1:30:00' },
      { id: 11 as ID, name: 'Second', status_id: 1 as ID, status: todo, estimated_time: '2:15:00' },
      { id: 12 as ID, name: 'Third', status_id: 1 as ID, status: todo },
      { id: 20 as ID, name: 'Fourth', status_id: 2 as ID, status: doing }
    ];
    updated = [];
    opened = [];
    component.updateCasefile.subscribe((casefile) => updated.push(casefile));
    component.openCasefile.subscribe((casefile) => opened.push(casefile));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('grouping', () => {
    it('should group the casefiles by the statuses in the order of the statuses', () => {
      setInputs(casefiles, [done, doing, todo]);

      expect(component.board().statuses.map((status) => status.name)).toEqual([
        'Kész',
        'Folyamatban',
        'Teendő'
      ]);
      expect(ids()).toEqual([[], [20], [10, 11, 12]]);
    });

    it('should add a column for the unknown and the missing statuses after the known ones', () => {
      setInputs(
        [
          {
            id: 1 as ID,
            status_id: 9 as ID,
            status: { id: 9 as ID, name: 'Új', color: '#0000ff' }
          },
          { id: 2 as ID, status: { id: 1 as ID, name: 'Teendő', color: '' } },
          { id: 3 as ID },
          { id: 4 as ID, status_id: 8 as ID },
          { id: 5 as ID, status_id: 9 as ID },
          { id: 6 as ID, status_id: null, status: null }
        ],
        [todo]
      );
      const statuses = component.board().statuses;

      expect(statuses.map((status) => [status.id, status.name, status.color])).toEqual([
        [1, 'Teendő', '#ff0000'],
        [9, 'Új', '#0000ff'],
        [null, 'Státusz nélkül', ''],
        [8, '#8', '']
      ]);
      expect(ids()).toEqual([[2], [1, 5], [3, 6], [4]]);
      expect(statuses[0]).toBeInstanceOf(KanbanStatus);
    });

    it('should give the same result whichever input arrives first', () => {
      fixture.componentRef.setInput('data', casefiles);
      fixture.detectChanges();

      expect(ids()).toEqual([[10, 11, 12], [20]]);
      expect(component.board().statuses.map((status) => status.name)).toEqual([
        'Teendő',
        'Folyamatban'
      ]);

      fixture.componentRef.setInput('statuses', [doing, todo]);
      fixture.detectChanges();
      const dataLast = ids();
      const other = TestBed.createComponent(ViewKanbanComponent);

      other.componentRef.setInput('statuses', [doing, todo]);
      other.detectChanges();

      expect(other.componentInstance.board().statuses.map((status) => status.casefiles)).toEqual([
        [],
        []
      ]);

      other.componentRef.setInput('data', casefiles);
      other.detectChanges();

      expect(dataLast).toEqual([[20], [10, 11, 12]]);
      expect(
        other.componentInstance
          .board()
          .statuses.map((status) => status.casefiles.map((casefile) => casefile.id))
      ).toEqual(dataLast);
    });

    it('should accept null inputs, e.g. from the async pipe before the first value', () => {
      setInputs(null, null);

      expect(component.board().statuses).toEqual([]);
      expect(element.querySelector('dd-no-data')).not.toBeNull();
    });

    it('convertToKanban() should return a ViewKanban named after the title', () => {
      fixture.componentRef.setInput('title', 'Board');
      const kanban = component.convertToKanban(casefiles, [todo]);

      expect(kanban).toBeInstanceOf(ViewKanban);
      expect(kanban.name).toBe('Board');
      expect(kanban.statuses.length).toBe(2);
    });
  });

  describe('estimated times', () => {
    const sum = (...times: Array<string | undefined>): string =>
      component.getEstimatedTimes(
        new KanbanStatus().init({
          casefiles: times.map((time, index) => ({ id: index as ID, estimated_time: time }))
        })
      );

    it('should add the estimated times', () => {
      expect(sum('2:3:1', '3:2:1', '1:1:1')).toBe('6ó 6p');
      expect(sum('0:30:00', '0:30:00')).toBe('1ó');
      expect(sum('0:00:30', '0:00:30', '0:15:00')).toBe('16p');
    });

    it('should skip the missing, empty and invalid values', () => {
      expect(
        sum(undefined, '', '   ', 'abc', '1:30', '1:75:00', '1:00:75', '-1:00:00', '2:00:00')
      ).toBe('2ó');
      expect(sum()).toBe('');
      expect(sum('0:00:00')).toBe('');
    });

    it('should keep the days of a sum above 24 hours', () => {
      expect(sum('20:00:00', '10:30:00')).toBe('30ó 30p');
      expect(sum('100:00:00')).toBe('100ó');
    });

    it('should use the overridden units', () => {
      fixture.componentRef.setInput('texts', { hour: 'h', minute: 'm' });

      expect(sum('1:30:00')).toBe('1h 30m');
    });
  });

  describe('rendering', () => {
    it('should render the columns, the cards and the column headers', () => {
      setInputs(casefiles, [todo, doing, done]);

      expect(columns().length).toBe(3);
      expect(element.querySelectorAll('.card').length).toBe(4);
      expect(columns()[0].querySelector('header').textContent).toContain('3 db ügy');
      expect(columns()[0].querySelector('header').textContent).toContain('3ó 45p');
      expect(columns()[0].querySelector('header').style.backgroundColor).toBe('rgb(255, 0, 0)');
      expect(element.querySelector('h3').textContent).toBe('Kanban nézet');
    });

    it('should render the overridden title and texts', () => {
      fixture.componentRef.setInput('title', 'Board');
      fixture.componentRef.setInput('texts', { casefileCount: 'items' });
      setInputs(casefiles, [todo]);

      expect(element.querySelector('h3').textContent).toBe('Board');
      expect(columns()[0].querySelector('header').textContent).toContain('3 items');
    });

    it('should show the no data component without columns', () => {
      setInputs([], []);

      expect(element.querySelector('dd-no-data')).not.toBeNull();
      expect(element.querySelector('.kanban-status-container')).toBeNull();
      expect(element.querySelector('dd-no-data').textContent).toContain('kanban státusz');
    });

    it('should render a single column and many columns', () => {
      setInputs([], [todo]);

      expect(columns().length).toBe(1);
      expect(element.querySelector('dd-no-data')).toBeNull();
      const many = Array.from({ length: 30 }, (_, index) => ({
        id: index as ID,
        name: `Status ${index}`,
        color: ''
      }));

      setInputs(
        many.map((status) => ({ id: (100 + (status.id as number)) as ID, status_id: status.id })),
        many
      );

      expect(columns().length).toBe(30);
      expect(element.querySelectorAll('.card').length).toBe(30);
    });

    it('should render the user thumbnails only for the existing users', () => {
      setInputs(
        [
          {
            id: 1 as ID,
            status_id: 1 as ID,
            owner: { name: 'Owner' },
            responsible_user: { name: 'User' }
          },
          { id: 2 as ID, status_id: 1 as ID }
        ],
        [todo]
      );

      expect(cards(0)[0].querySelectorAll('dd-user-profile-thumbnail').length).toBe(2);
      expect(cards(0)[1].querySelectorAll('dd-user-profile-thumbnail').length).toBe(0);
    });

    it('should have accessible roles and labels', () => {
      setInputs(casefiles, [todo, doing]);
      const region = element.querySelector('[role="region"]');
      const card = cards(0)[0];
      const heading = element.querySelector(`#${columns()[1].getAttribute('aria-labelledby')}`);

      expect(region.getAttribute('aria-label')).toBe('Kanban nézet');
      expect(heading.textContent.trim()).toBe('Folyamatban');
      expect(columns()[0].querySelector('[role="list"]')).not.toBeNull();
      expect(card.getAttribute('tabindex')).toBe('0');
      expect(card.getAttribute('aria-label')).toBe('First');
      expect(
        element.querySelector(`#${card.getAttribute('aria-describedby')}`).textContent
      ).toContain('Enter');
      expect(card.querySelector('button').getAttribute('aria-label')).toBe('First megnyitása');
      expect(element.querySelector('[aria-live="polite"]')).not.toBeNull();
    });

    it('should give unique ids to the boards on the same page', () => {
      const other = TestBed.createComponent(ViewKanbanComponent);

      expect(other.componentInstance.helpId).not.toBe(component.helpId);
    });
  });

  describe('drag and drop', () => {
    beforeEach(() => {
      setInputs(casefiles, [todo, doing, done]);
    });

    it('should move a casefile to the end of another column', () => {
      const dataTransfer = {
        setData: vi.fn(),
        effectAllowed: 'none',
        dropEffect: 'none'
      } as Partial<DataTransfer>;

      cards(0)[0].dispatchEvent(dragEvent('dragstart', dataTransfer));
      fixture.detectChanges();

      expect(dataTransfer.effectAllowed).toBe('move');
      expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', '10');
      expect(columns().every((column) => column.classList.contains('drag-active'))).toBe(true);
      expect(cards(0)[0].classList).toContain('dragging');
      const dragover = dragEvent('dragover', dataTransfer);

      columns()[1].dispatchEvent(dragover);
      fixture.detectChanges();

      expect(dragover.defaultPrevented).toBe(true);
      expect(dataTransfer.dropEffect).toBe('move');
      expect(columns()[1].classList).toContain('drag-over');
      expect(columns()[0].classList).not.toContain('drag-over');
      const drop = dragEvent('drop');

      columns()[1].dispatchEvent(drop);
      cards(0)[0].dispatchEvent(dragEvent('dragend'));
      fixture.detectChanges();

      expect(drop.defaultPrevented).toBe(true);
      expect(ids()).toEqual([[11, 12], [20, 10], []]);
      expect(cards(1).map((card) => card.textContent)).toEqual([
        expect.stringContaining('Fourth'),
        expect.stringContaining('First')
      ]);
      expect(columns().some((column) => column.classList.contains('drag-active'))).toBe(false);
      expect(columns().some((column) => column.classList.contains('drag-over'))).toBe(false);
    });

    it('should emit the original casefile with the new status', () => {
      const original = casefiles[0];

      cards(0)[0].dispatchEvent(dragEvent('dragstart'));
      columns()[2].dispatchEvent(dragEvent('dragover'));
      columns()[2].dispatchEvent(dragEvent('drop'));

      expect(updated).toEqual([original]);
      expect(updated[0]).toBe(original);
      expect(original.status_id).toBe(3);
      expect(original.status).toEqual({ id: 3, name: 'Kész', color: '#00ff00' });
      expect(original.status).not.toBe(component.board().statuses[2]);
      // the status object shared with the other casefiles is not changed
      expect(casefiles[1].status).toBe(todo);
      expect(todo.name).toBe('Teendő');
    });

    it('should insert the casefile before the casefile it is dropped on', () => {
      cards(1)[0].dispatchEvent(dragEvent('dragstart'));
      cards(0)[1].dispatchEvent(dragEvent('dragover'));
      fixture.detectChanges();

      expect(columns()[0].classList).toContain('drag-over');

      cards(0)[1].dispatchEvent(dragEvent('drop'));

      expect(ids()).toEqual([[10, 20, 11, 12], [], []]);
      expect(updated).toEqual([casefiles[3]]);
      expect(casefiles[3].status_id).toBe(1);
    });

    it('should place the casefile to the end when it is dragged from a card to the empty part of the column', () => {
      cards(1)[0].dispatchEvent(dragEvent('dragstart'));
      cards(0)[0].dispatchEvent(dragEvent('dragover'));
      columns()[0].dispatchEvent(dragEvent('dragover'));
      columns()[0].dispatchEvent(dragEvent('drop'));

      expect(ids()).toEqual([[10, 11, 12, 20], [], []]);
    });

    it('should reorder the casefiles inside the same column without updating the casefile', () => {
      cards(0)[0].dispatchEvent(dragEvent('dragstart'));
      cards(0)[2].dispatchEvent(dragEvent('dragover'));
      cards(0)[2].dispatchEvent(dragEvent('drop'));

      expect(ids()[0]).toEqual([11, 10, 12]);

      fixture.detectChanges();
      cards(0)[2].dispatchEvent(dragEvent('dragstart'));
      cards(0)[0].dispatchEvent(dragEvent('dragover'));
      cards(0)[0].dispatchEvent(dragEvent('drop'));

      expect(ids()[0]).toEqual([12, 11, 10]);

      fixture.detectChanges();
      cards(0)[0].dispatchEvent(dragEvent('dragstart'));
      columns()[0].dispatchEvent(dragEvent('dragover'));
      columns()[0].dispatchEvent(dragEvent('drop'));

      expect(ids()[0]).toEqual([11, 10, 12]);
      expect(updated).toEqual([]);
      expect(casefiles[0].status).toBe(todo);
    });

    it('should not move a casefile dropped on itself', () => {
      const board = component.board();

      cards(0)[1].dispatchEvent(dragEvent('dragstart'));
      cards(0)[1].dispatchEvent(dragEvent('dragover'));
      cards(0)[1].dispatchEvent(dragEvent('drop'));

      expect(component.board()).toBe(board);
      expect(updated).toEqual([]);
    });

    it('should not change anything when the drag is cancelled without a drop', () => {
      cards(0)[0].dispatchEvent(dragEvent('dragstart'));
      columns()[1].dispatchEvent(dragEvent('dragover'));
      fixture.detectChanges();

      expect(() => cards(0)[0].dispatchEvent(dragEvent('dragend'))).not.toThrow();
      fixture.detectChanges();

      expect(ids()).toEqual([[10, 11, 12], [20], []]);
      expect(updated).toEqual([]);
      expect(casefiles[0].status_id).toBe(1);
      expect(component.dragged()).toBeNull();
      expect(component.dropTarget()).toBeNull();
      expect(columns().some((column) => column.classList.contains('drag-active'))).toBe(false);
    });

    it('should not throw on a dragend or a drop without a drag', () => {
      expect(() => cards(0)[0].dispatchEvent(dragEvent('dragend'))).not.toThrow();
      expect(() => columns()[1].dispatchEvent(dragEvent('drop'))).not.toThrow();
      expect(ids()).toEqual([[10, 11, 12], [20], []]);
    });

    it('should not move the casefile when it is dropped before any dragover', () => {
      cards(0)[0].dispatchEvent(dragEvent('dragstart'));
      columns()[1].dispatchEvent(dragEvent('drop'));

      expect(ids()).toEqual([[10, 11, 12], [20], []]);
      expect(component.dragged()).toBeNull();
    });

    it('should not accept a drag what was not started on this board', () => {
      const dragover = dragEvent('dragover');

      columns()[1].dispatchEvent(dragover);
      fixture.detectChanges();

      expect(dragover.defaultPrevented).toBe(false);
      expect(columns()[1].classList).not.toContain('drag-over');
    });

    it('should set the drop target only when it changes', () => {
      cards(0)[0].dispatchEvent(dragEvent('dragstart'));
      columns()[1].dispatchEvent(dragEvent('dragover'));
      const target = component.dropTarget();

      columns()[1].dispatchEvent(dragEvent('dragover'));

      expect(component.dropTarget()).toBe(target);

      cards(0)[1].dispatchEvent(dragEvent('dragover'));
      const cardTarget = component.dropTarget();

      cards(0)[1].dispatchEvent(dragEvent('dragover'));

      expect(component.dropTarget()).toBe(cardTarget);
      expect(cardTarget.before).toBe(casefiles[1]);
    });

    it('should move a casefile into the column of the casefiles without status', () => {
      setInputs([...casefiles, { id: 30 as ID, name: 'No status' }], [todo]);

      cards(0)[0].dispatchEvent(dragEvent('dragstart'));
      columns()[2].dispatchEvent(dragEvent('dragover'));
      columns()[2].dispatchEvent(dragEvent('drop'));

      expect(updated).toEqual([casefiles[0]]);
      expect(casefiles[0].status_id).toBeNull();
      expect(casefiles[0].status).toBeNull();
      expect(ids()).toEqual([[11, 12], [20], [30, 10]]);
    });

    it('move() should ignore a column or a casefile what is not on the board', () => {
      const board = component.board();

      component.move(casefiles[0], new KanbanStatus().init({ id: 1 as ID }), null);
      component.move({ id: 99 as ID }, board.statuses[1], null);

      expect(component.board()).toBe(board);
      expect(updated).toEqual([]);
    });

    it('should keep the boards on the same page independent', () => {
      const host = TestBed.createComponent(HostComponent);

      host.detectChanges();
      const boards: Array<HTMLElement> = Array.from(
        host.nativeElement.querySelectorAll('dd-view-kanban')
      );

      boards[0].querySelector('.card').dispatchEvent(dragEvent('dragstart'));
      host.detectChanges();

      expect(boards[0].querySelector('.kanban-status').classList).toContain('drag-active');
      expect(boards[1].querySelector('.kanban-status').classList).not.toContain('drag-active');
      // a card of the first board can not be dropped on the second one
      const dragover = dragEvent('dragover');

      boards[1].querySelectorAll('.kanban-status')[1].dispatchEvent(dragover);
      boards[1].querySelectorAll('.kanban-status')[1].dispatchEvent(dragEvent('drop'));

      expect(dragover.defaultPrevented).toBe(false);
      expect(host.componentInstance.other.map((casefile) => casefile.status_id)).toEqual([1]);
    });

    it('should reset the moves when the inputs change', () => {
      cards(0)[0].dispatchEvent(dragEvent('dragstart'));
      columns()[1].dispatchEvent(dragEvent('dragover'));
      columns()[1].dispatchEvent(dragEvent('drop'));
      setInputs([...casefiles], [todo, doing, done]);

      // the moved casefile has the new status, so it stays in the new column
      expect(ids()).toEqual([[11, 12], [10, 20], []]);
    });
  });

  describe('opening a casefile', () => {
    beforeEach(() => {
      setInputs(casefiles, [todo, doing]);
    });

    it('should emit the original casefile on a click on the title', () => {
      cards(0)[1].querySelector('button').click();

      expect(opened).toEqual([casefiles[1]]);
      expect(opened[0]).toBe(casefiles[1]);
    });

    it('open() should find the original casefile by its id', () => {
      component.open({ id: 20 as ID });

      expect(opened[0]).toBe(casefiles[3]);
    });

    it('open() should not emit for an unknown casefile', () => {
      component.open({ id: 99 as ID });

      expect(opened).toEqual([]);
    });

    it('open() should not emit without data', () => {
      setInputs(null, [todo]);
      component.open({ id: 10 as ID });

      expect(opened).toEqual([]);
    });

    it('should label the open button of a casefile without name', () => {
      expect(component.openLabel({ id: 1 as ID })).toBe(' megnyitása');
    });
  });

  describe('keyboard', () => {
    beforeEach(() => {
      setInputs(casefiles, [todo, doing, done]);
    });

    it('should open the casefile with Enter and Space', () => {
      const enter = keyEvent('Enter');

      cards(0)[0].dispatchEvent(enter);
      cards(0)[1].dispatchEvent(keyEvent(' '));

      expect(enter.defaultPrevented).toBe(true);
      expect(opened).toEqual([casefiles[0], casefiles[1]]);
    });

    it('should leave the keys of the buttons inside the card to the buttons', () => {
      const event = keyEvent('ArrowRight');

      cards(0)[0].querySelector('button').dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);
      expect(ids()).toEqual([[10, 11, 12], [20], []]);
    });

    it('should move the casefile to the next and the previous column with the arrow keys', async () => {
      const right = keyEvent('ArrowRight');

      cards(0)[0].dispatchEvent(right);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(right.defaultPrevented).toBe(true);
      expect(ids()).toEqual([[11, 12], [20, 10], []]);
      expect(updated).toEqual([casefiles[0]]);
      expect(casefiles[0].status_id).toBe(2);
      expect(document.activeElement).toBe(cards(1)[1]);
      expect(element.querySelector('[aria-live="polite"]').textContent.trim()).toBe(
        'First áthelyezve: Folyamatban, 2. hely'
      );

      cards(1)[1].dispatchEvent(keyEvent('ArrowLeft'));
      fixture.detectChanges();
      await fixture.whenStable();

      expect(ids()).toEqual([[11, 12, 10], [20], []]);
      expect(casefiles[0].status_id).toBe(1);
      expect(document.activeElement).toBe(cards(0)[2]);
    });

    it('should move the casefile inside the column with the up and down arrow keys', () => {
      cards(0)[0].dispatchEvent(keyEvent('ArrowDown'));
      fixture.detectChanges();

      expect(ids()[0]).toEqual([11, 10, 12]);

      cards(0)[1].dispatchEvent(keyEvent('ArrowDown'));
      fixture.detectChanges();

      expect(ids()[0]).toEqual([11, 12, 10]);

      cards(0)[2].dispatchEvent(keyEvent('ArrowUp'));
      fixture.detectChanges();

      expect(ids()[0]).toEqual([11, 10, 12]);
      expect(updated).toEqual([]);
      expect(component.announcement()).toBe('First áthelyezve: Teendő, 2. hely');
    });

    it('should not move the casefile out of the board', () => {
      const events = [keyEvent('ArrowLeft'), keyEvent('ArrowUp')];

      events.forEach((event) => cards(0)[0].dispatchEvent(event));
      const down = keyEvent('ArrowDown');

      cards(0)[2].dispatchEvent(down);
      const right = keyEvent('ArrowRight');

      setInputs(casefiles, [todo]);
      cards(1)[0].dispatchEvent(right);

      expect([...events, down, right].map((event) => event.defaultPrevented)).toEqual([
        false,
        false,
        false,
        false
      ]);
      expect(updated).toEqual([]);
    });

    it('should ignore the other keys', () => {
      const event = keyEvent('a');

      cards(0)[0].dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);
      expect(opened).toEqual([]);
    });

    it('should announce the move with the overridden text', () => {
      fixture.componentRef.setInput('texts', { moved: '{casefile} -> {status} #{position}' });
      setInputs([{ id: 1 as ID, status_id: 1 as ID }], [todo, doing]);

      cards(0)[0].dispatchEvent(keyEvent('ArrowRight'));

      expect(component.announcement()).toBe(' -> Folyamatban #1');
    });
  });

  describe('height', () => {
    it('should fit the board to the window and follow the resize', () => {
      const clientHeight = vi
        .spyOn(document.documentElement, 'clientHeight', 'get')
        .mockReturnValue(800);
      const resized = TestBed.createComponent(ViewKanbanComponent);

      resized.componentRef.setInput('statuses', [todo]);
      resized.detectChanges();
      const container: HTMLElement = resized.nativeElement.querySelector(
        '.kanban-status-container'
      );

      expect(container.style.height).toBe('611px');

      clientHeight.mockReturnValue(1000);
      window.dispatchEvent(new Event('resize'));
      resized.detectChanges();

      expect(container.style.height).toBe('811px');

      resized.componentRef.setInput('heightOffset', 100);
      resized.detectChanges();

      expect(container.style.height).toBe('900px');

      clientHeight.mockReturnValue(50);
      window.dispatchEvent(new Event('resize'));
      resized.detectChanges();

      expect(container.style.height).toBe('0px');

      resized.componentRef.setInput('heightOffset', null);
      resized.detectChanges();

      expect(container.style.height).toBe('');
    });

    it('should not set a height outside of the browser', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [ViewKanbanComponent],
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }]
      });
      const server = TestBed.createComponent(ViewKanbanComponent);

      server.componentRef.setInput('statuses', [todo]);
      server.detectChanges();
      server.componentInstance.viewportHeight.update();

      expect(server.componentInstance.viewportHeight.height()).toBeNull();
      expect(server.nativeElement.querySelector('.kanban-status-container').style.height).toBe('');
    });
  });

  describe('subscriptions', () => {
    it('should not keep a subscription after the board is destroyed', () => {
      const host = TestBed.createComponent(HostComponent);

      host.detectChanges();
      const { data$, statuses$ } = host.componentInstance;

      expect(data$.observed).toBe(true);
      expect(statuses$.observed).toBe(true);

      data$.next([
        { id: 5 as ID, status_id: 1 as ID },
        { id: 6 as ID, status_id: 1 as ID }
      ]);
      host.detectChanges();

      expect(
        host.nativeElement.querySelectorAll('dd-view-kanban')[0].querySelectorAll('.card').length
      ).toBe(2);

      host.destroy();

      expect(data$.observed).toBe(false);
      expect(statuses$.observed).toBe(false);
      expect(() => data$.next([])).not.toThrow();
    });
  });
});
