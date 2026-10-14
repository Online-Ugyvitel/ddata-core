/**
 * The overridable texts of the date separated list view. The `{name}` placeholders are replaced.
 */
export interface ViewDateSeparatedListTextsInterface {
  /** After the number of the casefiles in the group header. */
  casefileCount: string;
  /** Column headers. */
  partner: string;
  casefile: string;
  status: string;
  responsible: string;
  /** Labels of the row buttons, `{casefile}` is the name of the casefile. */
  open: string;
  delete: string;
  /** The `text` of the no data component when there is no casefile. */
  noData: string;
}

export const viewDateSeparatedListTexts: ViewDateSeparatedListTextsInterface = {
  casefileCount: 'ügy',
  partner: 'Partner',
  casefile: 'Ügy',
  status: 'Státusz',
  responsible: 'Felelős',
  open: '{casefile} megnyitása',
  delete: '{casefile} törlése',
  noData: 'ügy'
};
