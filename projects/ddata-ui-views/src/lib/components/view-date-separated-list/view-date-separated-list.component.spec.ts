import { AsyncPipe } from '@angular/common';
import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ID } from '@netdjw/ddata-core';
import { BehaviorSubject } from 'rxjs';
import { CasefileInterface } from '../../models/casefile/casefile.interface';
import { ViewDateSeparatedList } from '../../models/view/date-separated-list/view-date-separated-list.model';
import {
  ddataViewsNow,
  ViewDateSeparatedListComponent
} from './view-date-separated-list.component';

@Component({
  imports: [ViewDateSeparatedListComponent, AsyncPipe],
  template: `<dd-view-date-separated-list
    [data]="data$ | async"
    now="2026-01-15T12:00:00Z"
  ></dd-view-date-separated-list>`
})
class HostComponent {
  data$ = new BehaviorSubject<Array<CasefileInterface>>([{ id: 1 as ID }]);
}

describe('ViewDateSeparatedListComponent', () => {
  let component: ViewDateSeparatedListComponent;
  let fixture: ComponentFixture<ViewDateSeparatedListComponent>;
  let element: HTMLElement;
  let opened: Array<CasefileInterface>;
  let deleted: Array<CasefileInterface>;
  const create = (now?: string): void => {
    fixture = TestBed.createComponent(ViewDateSeparatedListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    opened = [];
    deleted = [];
    component.openCasefile.subscribe((casefile) => opened.push(casefile));
    component.deleteCasefile.subscribe((casefile) => deleted.push(casefile));

    if (now) {
      fixture.componentRef.setInput('now', now);
    }

    fixture.componentRef.setInput('timeZone', 'Europe/Budapest');
  };
  const setData = (data: Array<CasefileInterface> | null): void => {
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();
  };
  const names = (): Array<string> => component.lists().map((list) => list.name);
  const ids = (): Array<Array<number>> =>
    component.lists().map((list) => list.casefiles.map((casefile) => casefile.id));
  const rows = (): Array<HTMLElement> => Array.from(element.querySelectorAll('.list-item'));

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ViewDateSeparatedListComponent] });
    create('2026-01-15T12:00:00Z');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('grouping', () => {
    it('should group the casefiles by the calendar day in chronological order', () => {
      setData([
        { id: 1 as ID, deadline: '2026-06-15T12:00:00Z' },
        { id: 2 as ID, deadline: '2026-01-16T15:00:00Z' },
        { id: 3 as ID },
        { id: 4 as ID, deadline: '2026-01-16T08:00:00Z' },
        { id: 5 as ID, deadline: '2026-01-12T12:00:00Z' },
        { id: 6 as ID, deadline: '2026-06-20T12:00:00Z' },
        { id: 7 as ID, deadline: '2026-01-15' }
      ]);

      expect(names()).toEqual([
        '3 nappal ezelőtt',
        'ma',
        'holnap',
        '5 hónap múlva',
        '5 hónap múlva',
        'Határidő nélküli feladatok'
      ]);
      expect(component.lists().map((list) => list.date)).toEqual([
        '2026-01-12',
        '2026-01-15',
        '2026-01-16',
        '2026-06-15',
        '2026-06-20',
        ''
      ]);
      // the same relative name does not merge different days, inside a day the earlier deadline is the first
      expect(ids()).toEqual([[5], [7], [4, 2], [1], [6], [3]]);
      expect(component.lists()[0]).toBeInstanceOf(ViewDateSeparatedList);
    });

    it('should keep the order of the casefiles with the same deadline', () => {
      setData([
        { id: 1 as ID, deadline: '2026-01-16T12:00:00Z' },
        { id: 2 as ID },
        { id: 3 as ID, deadline: '2026-01-16T12:00:00Z' },
        { id: 4 as ID, deadline: null }
      ]);

      expect(ids()).toEqual([
        [1, 3],
        [2, 4]
      ]);
    });

    it('should put the missing, empty and invalid deadlines into the no deadline group', () => {
      setData([
        { id: 1 as ID, deadline: '' },
        { id: 2 as ID, deadline: '   ' },
        { id: 3 as ID, deadline: 'not a date' },
        { id: 4 as ID, deadline: '2026-02-30' },
        { id: 5 as ID, deadline: null },
        { id: 6 as ID }
      ]);

      expect(names()).toEqual(['Határidő nélküli feladatok']);
      expect(ids()).toEqual([[1, 2, 3, 4, 5, 6]]);
    });

    it('should use the overridden no deadline text', () => {
      fixture.componentRef.setInput('noDeadlineText', 'No deadline');
      setData([{ id: 1 as ID }]);

      expect(names()).toEqual(['No deadline']);
      expect(element.querySelector('h6').textContent.trim()).toBe('No deadline');
      expect(element.querySelector('.list-date')).toBeNull();
    });

    it('should name the groups in the given locale', () => {
      fixture.componentRef.setInput('locale', 'en');
      setData([
        { id: 1 as ID, deadline: '2026-01-29T12:00:00Z' },
        { id: 2 as ID, deadline: '2026-01-14T12:00:00Z' }
      ]);

      expect(names()).toEqual(['yesterday', 'in 2 weeks']);
      expect(element.querySelector('.list-date').textContent).toBe('Jan 14, 2026');
    });

    it('should accept null data, e.g. from the async pipe before the first value', () => {
      setData(null);

      expect(component.lists()).toEqual([]);
      expect(element.querySelector('dd-no-data')).not.toBeNull();
    });

    it('should follow the changes of the data', () => {
      setData([{ id: 1 as ID }]);
      setData([{ id: 2 as ID, deadline: '2026-01-15T20:00:00Z' }]);

      expect(names()).toEqual(['ma']);
      expect(rows().length).toBe(1);
    });
  });

  describe('time zones', () => {
    it('should group by the local calendar day around midnight', () => {
      // Budapest is UTC+1 in winter: 22:59 UTC is 23:59, 23:00 UTC is 00:00 of the next day
      setData([
        { id: 1 as ID, deadline: '2026-01-15T22:59:00Z' },
        { id: 2 as ID, deadline: '2026-01-15T23:00:00Z' }
      ]);

      expect(component.lists().map((list) => list.date)).toEqual(['2026-01-15', '2026-01-16']);
      expect(names()).toEqual(['ma', 'holnap']);
    });

    it('should group the same moments by the day of another time zone', () => {
      fixture.componentRef.setInput('timeZone', 'America/New_York');
      setData([
        { id: 1 as ID, deadline: '2026-01-15T22:59:00Z' },
        { id: 2 as ID, deadline: '2026-01-15T23:00:00Z' },
        { id: 3 as ID, deadline: '2026-01-16T05:00:00Z' }
      ]);

      expect(component.lists().map((list) => list.date)).toEqual(['2026-01-15', '2026-01-16']);
      expect(ids()).toEqual([[1, 2], [3]]);
    });

    it('should calculate today in the time zone', () => {
      // 23:30 UTC is already the next day in Budapest, but still the same day in New York
      fixture.componentRef.setInput('now', '2026-01-15T23:30:00Z');
      setData([{ id: 1 as ID, deadline: '2026-01-16T12:00:00Z' }]);

      expect(names()).toEqual(['ma']);

      fixture.componentRef.setInput('timeZone', 'America/New_York');
      fixture.detectChanges();

      expect(names()).toEqual(['holnap']);
    });

    it('should count the days correctly over the daylight saving time change', () => {
      // Budapest changes from UTC+1 to UTC+2 on 2026-03-29
      fixture.componentRef.setInput('now', '2026-03-28T23:30:00Z');
      setData([
        { id: 1 as ID, deadline: '2026-03-29T21:59:00Z' },
        { id: 2 as ID, deadline: '2026-03-29T22:00:00Z' },
        { id: 3 as ID, deadline: '2026-03-28T22:30:00Z' }
      ]);

      expect(component.lists().map((list) => list.date)).toEqual([
        '2026-03-28',
        '2026-03-29',
        '2026-03-30'
      ]);
      expect(names()).toEqual(['tegnap', 'ma', 'holnap']);
    });

    it('should not shift a date without time into the previous day west of UTC', () => {
      fixture.componentRef.setInput('timeZone', 'America/Los_Angeles');
      fixture.componentRef.setInput('now', '2026-01-15T20:00:00Z');
      setData([{ id: 1 as ID, deadline: '2026-01-16' }]);

      expect(component.lists()[0].date).toBe('2026-01-16');
      expect(names()).toEqual(['holnap']);
    });

    it('should use the local time zone of the user by default', () => {
      fixture.componentRef.setInput('timeZone', undefined);
      const deadline = new Date(2026, 0, 16, 0, 30);

      setData([{ id: 1 as ID, deadline: deadline.toISOString() }]);

      expect(component.lists()[0].date).toBe('2026-01-16');
    });
  });

  describe('current time', () => {
    it('should take the current time from the ddataViewsNow token by default', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [ViewDateSeparatedListComponent],
        providers: [{ provide: ddataViewsNow, useValue: () => new Date('2026-01-15T12:00:00Z') }]
      });
      create();
      setData([{ id: 1 as ID, deadline: '2026-01-16T12:00:00Z' }]);

      expect(names()).toEqual(['holnap']);
    });

    it('should use the real current time without the input and the token', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ imports: [ViewDateSeparatedListComponent] });
      vi.useFakeTimers({ now: new Date('2026-01-15T12:00:00Z'), toFake: ['Date'] });
      create();
      setData([{ id: 1 as ID, deadline: '2026-01-14T12:00:00Z' }]);
      vi.useRealTimers();

      expect(names()).toEqual(['tegnap']);
    });

    it('should accept the current time as a Date or a timestamp', () => {
      fixture.componentRef.setInput('now', new Date('2026-01-16T12:00:00Z'));
      setData([{ id: 1 as ID, deadline: '2026-01-16T12:00:00Z' }]);

      expect(names()).toEqual(['ma']);

      fixture.componentRef.setInput('now', Date.parse('2026-01-17T12:00:00Z'));
      fixture.detectChanges();

      expect(names()).toEqual(['tegnap']);
    });
  });

  describe('rendering', () => {
    const full: CasefileInterface = {
      id: 7 as ID,
      name: 'Casefile',
      description: 'Description',
      deadline: '2026-01-16T12:00:00Z',
      priority: { color: '#ff0000' },
      company: { name: 'Company', phone: '+361', email: 'info@example.com' },
      status: { id: 1 as ID, name: 'Open', color: '#ffffff' },
      responsible_user: { name: 'User' }
    };

    it('should render the groups and the casefiles', () => {
      setData([full, { id: 8 as ID, deadline: '2026-01-16T13:00:00Z' }]);
      const row = rows()[0];

      expect(element.querySelector('h3').textContent).toBe('Dátum szerint csoportosított nézet');
      expect(element.querySelector('h6').textContent).toContain('holnap');
      expect(element.querySelector('.list-date').textContent).toBe('2026. jan. 16.');
      expect(element.querySelector('header').textContent).toContain('2 ügy');
      expect(row.textContent).toContain('Company');
      expect(row.textContent).toContain('Casefile');
      expect(row.textContent).toContain('User');
      expect(row.textContent).toContain('Description');
      expect(row.querySelector('.list-status').textContent.trim()).toBe('Open');
      expect(row.style.borderLeftColor).toBe('rgb(255, 0, 0)');
      expect(row.querySelector('a[href="tel:+361"]').textContent).toBe('+361');
      expect(row.querySelector('a[href="mailto:info@example.com"]').textContent).toBe(
        'info@example.com'
      );
      expect(row.querySelector('.list-contacts').textContent).toContain(',');
    });

    it('should render a casefile without the optional fields', () => {
      setData([{ id: 1 as ID }]);
      const row = rows()[0];

      expect(row).toBeDefined();
      expect(row.querySelector('.list-status')).toBeNull();
      expect(row.querySelectorAll('a').length).toBe(0);
      expect(row.querySelector('.list-contacts').textContent.trim()).toBe('');
      expect(row.querySelector('.list-open').getAttribute('aria-label')).toBe(' megnyitása');
    });

    it('should render only the existing contacts without separator', () => {
      setData([
        { id: 1 as ID, company: { name: 'Phone', phone: '+361' } },
        { id: 2 as ID, company: { name: 'Email', email: 'a@b.hu' } }
      ]);

      expect(rows()[0].querySelector('.list-contacts').textContent.trim()).toBe('+361');
      expect(rows()[1].querySelector('.list-contacts').textContent.trim()).toBe('a@b.hu');
    });

    it('should show the no data component without casefiles', () => {
      setData([]);

      expect(element.querySelector('dd-no-data')).not.toBeNull();
      expect(element.querySelector('dd-no-data').textContent).toContain('ügy');
      expect(element.querySelector('.list-container')).toBeNull();
    });

    it('should render the overridden title and texts', () => {
      fixture.componentRef.setInput('title', 'Deadlines');
      fixture.componentRef.setInput('texts', {
        casefileCount: 'casefiles',
        partner: 'Partner X',
        casefile: 'Casefile X',
        status: 'Status X',
        responsible: 'Responsible X',
        open: 'Open {casefile}',
        delete: 'Delete {casefile}'
      });
      setData([full]);
      const header = element.querySelector('header').textContent;

      expect(element.querySelector('h3').textContent).toBe('Deadlines');
      ['1 casefiles', 'Partner X', 'Casefile X', 'Status X', 'Responsible X'].forEach((text) =>
        expect(header).toContain(text)
      );
      expect(rows()[0].querySelector('.list-open').getAttribute('aria-label')).toBe(
        'Open Casefile'
      );
      expect(rows()[0].querySelector('.list-delete').getAttribute('title')).toBe('Delete Casefile');
    });

    it('should have accessible roles and labels', () => {
      setData([full]);
      const section = element.querySelector('section');

      expect(element.querySelector('[role="region"]').getAttribute('aria-label')).toBe(
        'Dátum szerint csoportosított nézet'
      );
      expect(
        element.querySelector(`#${section.getAttribute('aria-labelledby')}`).textContent
      ).toContain('holnap');
      expect(rows()[0].querySelector('.list-open').getAttribute('aria-label')).toBe(
        'Casefile megnyitása'
      );
      expect(rows()[0].querySelector('.list-delete').getAttribute('aria-label')).toBe(
        'Casefile törlése'
      );
    });
  });

  describe('events', () => {
    let casefiles: Array<CasefileInterface>;

    beforeEach(() => {
      casefiles = [
        { id: 1 as ID, name: 'First', deadline: '2026-01-16T12:00:00Z', company: { name: 'A' } },
        { id: 2 as ID, name: 'Second' }
      ];
      setData(casefiles);
    });

    it('should emit the original casefile on open', () => {
      rows()[0].querySelector<HTMLButtonElement>('.list-open').click();
      rows()[1].querySelector<HTMLElement>('.list-name').click();
      rows()[0].querySelector<HTMLElement>('.list-company').click();
      rows()[1].querySelector<HTMLElement>('.card-description').click();

      expect(opened).toEqual([casefiles[0], casefiles[1], casefiles[0], casefiles[1]]);
      expect(opened[0]).toBe(casefiles[0]);
    });

    it('should emit the original casefile on delete', () => {
      rows()[1].querySelector<HTMLButtonElement>('.list-delete').click();

      expect(deleted).toEqual([casefiles[1]]);
      expect(deleted[0]).toBe(casefiles[1]);
    });

    it('should find the original casefile by its id', () => {
      component.open({ id: 2 as ID });
      component.delete({ id: 1 as ID });

      expect(opened[0]).toBe(casefiles[1]);
      expect(deleted[0]).toBe(casefiles[0]);
    });

    it('should not emit for an unknown casefile', () => {
      component.open({ id: 99 as ID });
      component.delete({ id: 99 as ID });

      expect(opened).toEqual([]);
      expect(deleted).toEqual([]);
    });

    it('should not emit without data', () => {
      setData(null);
      component.open({ id: 1 as ID });
      component.delete({ id: 1 as ID });

      expect(opened).toEqual([]);
      expect(deleted).toEqual([]);
    });
  });

  describe('height', () => {
    it('should fit the list to the window and follow the resize', () => {
      const clientHeight = vi
        .spyOn(document.documentElement, 'clientHeight', 'get')
        .mockReturnValue(800);

      create('2026-01-15T12:00:00Z');
      setData([{ id: 1 as ID }]);
      const container: HTMLElement = element.querySelector('.list-container');

      expect(container.style.height).toBe('611px');

      clientHeight.mockReturnValue(1000);
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();

      expect(container.style.height).toBe('811px');

      fixture.componentRef.setInput('heightOffset', null);
      fixture.detectChanges();

      expect(container.style.height).toBe('');
    });

    it('should not set a height outside of the browser', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [ViewDateSeparatedListComponent],
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }]
      });
      create('2026-01-15T12:00:00Z');
      setData([{ id: 1 as ID }]);

      expect(element.querySelector<HTMLElement>('.list-container').style.height).toBe('');
    });
  });

  describe('subscriptions', () => {
    it('should not keep a subscription after the list is destroyed', () => {
      const host = TestBed.createComponent(HostComponent);

      host.detectChanges();
      const { data$ } = host.componentInstance;

      expect(data$.observed).toBe(true);

      data$.next([{ id: 1 as ID }, { id: 2 as ID, deadline: '2026-01-16' }]);
      host.detectChanges();

      expect(host.nativeElement.querySelectorAll('.list-item').length).toBe(2);
      expect(host.nativeElement.textContent).toContain('holnap');

      host.destroy();

      expect(data$.observed).toBe(false);
      expect(() => data$.next([])).not.toThrow();
    });
  });
});
