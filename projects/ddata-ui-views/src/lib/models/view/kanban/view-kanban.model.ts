import { KanbanStatusInterface } from './kanban-status.model';

export interface ViewKanbanInterface {
  name: string;
  statuses: Array<KanbanStatusInterface>;

  init(data?: Partial<ViewKanbanInterface>): ViewKanbanInterface;
}

export class ViewKanban implements ViewKanbanInterface {
  name = '';
  statuses: Array<KanbanStatusInterface> = [];

  init(data: Partial<ViewKanbanInterface> = {}): ViewKanbanInterface {
    this.name = data.name ?? '';
    this.statuses = data.statuses ?? [];

    return this;
  }
}
