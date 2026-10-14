import { CasefileInterface } from '../../casefile/casefile.interface';

export interface ViewDateSeparatedListInterface {
  name: string;
  /**
   * ISO date string of the group.
   */
  date: string;
  casefiles: Array<CasefileInterface>;

  init(data?: Partial<ViewDateSeparatedListInterface>): ViewDateSeparatedListInterface;
}

export class ViewDateSeparatedList implements ViewDateSeparatedListInterface {
  name = '';
  date = '';
  casefiles: Array<CasefileInterface> = [];

  init(data: Partial<ViewDateSeparatedListInterface> = {}): ViewDateSeparatedListInterface {
    this.name = data.name ?? '';
    this.date = data.date ?? '';
    this.casefiles = data.casefiles ?? [];

    return this;
  }
}
