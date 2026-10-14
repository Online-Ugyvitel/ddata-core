import { ID } from '@netdjw/ddata-core';
import { ViewDateSeparatedList } from './date-separated-list/view-date-separated-list.model';
import { KanbanStatus } from './kanban/kanban-status.model';
import { ViewKanban } from './kanban/view-kanban.model';

describe('view models', () => {
  it('KanbanStatus should have defaults and take the given values', () => {
    expect({ ...new KanbanStatus().init() }).toEqual({
      id: null,
      name: '',
      color: '',
      casefiles: []
    });
    const casefiles = [{ id: 1 as ID }];
    const status = new KanbanStatus().init({ id: 2 as ID, name: 'A', color: '#fff', casefiles });

    expect(status).toBeInstanceOf(KanbanStatus);
    expect({ ...status }).toEqual({ id: 2, name: 'A', color: '#fff', casefiles });
  });

  it('ViewKanban should have defaults and take the given values', () => {
    expect({ ...new ViewKanban().init() }).toEqual({ name: '', statuses: [] });
    const statuses = [new KanbanStatus().init()];

    expect({ ...new ViewKanban().init({ name: 'Board', statuses }) }).toEqual({
      name: 'Board',
      statuses
    });
  });

  it('ViewDateSeparatedList should have defaults and take the given values', () => {
    expect({ ...new ViewDateSeparatedList().init() }).toEqual({
      name: '',
      date: '',
      casefiles: []
    });
    const casefiles = [{ id: 1 as ID }];

    expect({
      ...new ViewDateSeparatedList().init({ name: 'ma', date: '2026-01-15', casefiles })
    }).toEqual({
      name: 'ma',
      date: '2026-01-15',
      casefiles
    });
  });
});
