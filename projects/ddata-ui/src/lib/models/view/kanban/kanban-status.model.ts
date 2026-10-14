import { ID } from '@netdjw/ddata-core';
import { CasefileInterface, CasefileStatusInterface } from '../../casefile/casefile.interface';

export interface KanbanStatusInterface extends CasefileStatusInterface {
  casefiles: Array<CasefileInterface>;
  is_drag_over: boolean;

  init(data?: Partial<KanbanStatusInterface>): KanbanStatusInterface;
}

export class KanbanStatus implements KanbanStatusInterface {
  id: ID = 0 as ID;
  name = '';
  color = '';
  casefiles: Array<CasefileInterface> = [];
  is_drag_over = false;

  init(data: Partial<KanbanStatusInterface> = {}): KanbanStatusInterface {
    this.id = data.id ?? (0 as ID);
    this.name = data.name ?? '';
    this.color = data.color ?? '';
    this.casefiles = data.casefiles ?? [];
    this.is_drag_over = data.is_drag_over ?? false;

    return this;
  }
}
