import { ID } from '@netdjw/ddata-core';
import { CasefileInterface } from '../../casefile/casefile.interface';

/**
 * A column of the kanban view. The column of the casefiles without status has `null` id.
 */
export interface KanbanStatusInterface {
  id: ID | null;
  name: string;
  color: string;
  casefiles: Array<CasefileInterface>;

  init(data?: Partial<KanbanStatusInterface>): KanbanStatusInterface;
}

export class KanbanStatus implements KanbanStatusInterface {
  id: ID | null = null;
  name = '';
  color = '';
  casefiles: Array<CasefileInterface> = [];

  init(data: Partial<KanbanStatusInterface> = {}): KanbanStatusInterface {
    this.id = data.id ?? null;
    this.name = data.name ?? '';
    this.color = data.color ?? '';
    this.casefiles = data.casefiles ?? [];

    return this;
  }
}
