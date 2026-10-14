import { CasefileInterface } from '../../casefile/casefile.interface';

export interface ViewDateSeparatedListInterface {
  name: string;
  /**
   * The calendar day of the group in `YYYY-MM-DD` format, empty for the casefiles without deadline.
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
