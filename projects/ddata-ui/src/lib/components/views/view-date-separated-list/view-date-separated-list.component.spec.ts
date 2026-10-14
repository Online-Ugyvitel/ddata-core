import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ID } from '@netdjw/ddata-core';
import { BehaviorSubject } from 'rxjs';
import { DdataUiModule } from '../../../ddata-ui.module';
import { CasefileInterface } from '../../../models/casefile/casefile.interface';
import { ViewDateSeparatedList } from '../../../models/view/date-separated-list/view-date-separated-list.model';
import { ViewDateSeparatedListComponent } from './view-date-separated-list.component';

describe('ViewDateSeparatedListComponent', () => {
  let component: ViewDateSeparatedListComponent;
  let fixture: ComponentFixture<ViewDateSeparatedListComponent>;
  const now = new Date('2026-01-15T12:00:00Z');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DdataUiModule]
    }).compileComponents();
    fixture = TestBed.createComponent(ViewDateSeparatedListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should show the no data component without casefiles', () => {
    component.data = new BehaviorSubject([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('dd-no-data')).not.toBeNull();
  });

  it('setListItemName() should describe the deadline relative to now', () => {
    expect(component.setListItemName('2026-06-15T12:00:00Z', now)).toBe('5 hónap múlva');
    expect(component.setListItemName('2026-01-16T12:00:00Z', now)).toBe('holnap');
    expect(component.setListItemName('2026-01-12T12:00:00Z', now)).toBe('3 nappal ezelőtt');

    component.locale = 'en';

    expect(component.setListItemName('2026-01-29T12:00:00Z', now)).toBe('in 2 weeks');
  });

  it('setListItemName() should return the no deadline text without a valid deadline', () => {
    expect(component.setListItemName('')).toBe('Határidő nélküli feladatok');
    expect(component.setListItemName(undefined)).toBe('Határidő nélküli feladatok');
    expect(component.setListItemName('not a date')).toBe('Határidő nélküli feladatok');

    component.noDeadlineText = 'No deadline';

    expect(component.setListItemName('')).toBe('No deadline');
  });

  it('convertToDateSeparatedList() should group the casefiles by their deadline', () => {
    vi.useFakeTimers({ now, toFake: ['Date'] });
    const casefiles: Array<CasefileInterface> = [
      { id: 1 as ID, deadline: '2026-06-15T12:00:00Z' },
      { id: 2 as ID, deadline: '2026-06-15T13:00:00Z' },
      { id: 3 as ID },
      { id: 4 as ID, deadline: '2026-01-16T12:00:00Z' }
    ];
    const lists = component.convertToDateSeparatedList(casefiles);

    expect(lists.length).toBe(3);
    expect(lists[0]).toBeInstanceOf(ViewDateSeparatedList);
    expect(lists.map((list) => list.name)).toEqual([
      '5 hónap múlva',
      'Határidő nélküli feladatok',
      'holnap'
    ]);
    expect(lists.map((list) => list.casefiles.map((casefile) => casefile.id))).toEqual([
      [1, 2],
      [3],
      [4]
    ]);
  });

  it('setListsName() should name only the lists without a name', () => {
    vi.useFakeTimers({ now, toFake: ['Date'] });
    const lists = [
      new ViewDateSeparatedList().init({ name: 'Named', date: '2026-01-16T12:00:00Z' }),
      new ViewDateSeparatedList().init({ date: '2026-01-16T12:00:00Z' })
    ];

    component.setListsName(lists);

    expect(lists.map((list) => list.name)).toEqual(['Named', 'holnap']);
  });

  it('should render the casefiles and emit the open and delete events with the original casefile', () => {
    const casefile: CasefileInterface = {
      id: 7 as ID,
      name: 'Casefile',
      deadline: '2026-01-16T12:00:00Z',
      company: { name: 'Company', phone: '+361', email: 'info@example.com' },
      status: { id: 1 as ID, name: 'Open', color: '#ffffff' },
      responsible_user: { name: 'User' }
    };
    const open = vi.fn();
    const remove = vi.fn();

    component.data = new BehaviorSubject([casefile]);
    component.openCasefile.subscribe(open);
    component.deleteCasefile.subscribe(remove);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Company');
    expect(element.textContent).toContain('1 ügy');
    expect(element.querySelector('a[href="mailto:info@example.com"]')).not.toBeNull();

    component.open({ id: 7 as ID });
    component.delete({ id: 7 as ID });

    expect(open).toHaveBeenCalledWith(casefile);
    expect(remove).toHaveBeenCalledWith(casefile);
  });

  it('setHeight() should fit the container to the window', () => {
    vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(800);
    component.data = new BehaviorSubject([{ id: 1 as ID }]);
    fixture.detectChanges();

    expect(component.listContainer.nativeElement.style.height).toBe('611px');
  });
});
