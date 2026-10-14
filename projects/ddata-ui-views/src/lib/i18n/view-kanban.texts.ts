/**
 * The overridable texts of the kanban view. The `{name}` placeholders are replaced.
 */
export interface ViewKanbanTextsInterface {
  /** After the number of the casefiles in the column header. */
  casefileCount: string;
  /** Unit of the hours in the sum of the estimated times. */
  hour: string;
  /** Unit of the minutes in the sum of the estimated times. */
  minute: string;
  /** The `text` of the no data component when there is no column. */
  noData: string;
  /** Name of the column of the casefiles without status. */
  noStatus: string;
  /** Label of the button what opens a casefile, `{casefile}` is the name of the casefile. */
  openCasefile: string;
  /** Keyboard usage of a card, read by the screen readers. */
  keyboardHelp: string;
  /** Announcement after a move, with `{casefile}`, `{status}` and `{position}` placeholders. */
  moved: string;
}

export const viewKanbanTexts: ViewKanbanTextsInterface = {
  casefileCount: 'db ügy',
  hour: 'ó',
  minute: 'p',
  noData: 'kanban státusz',
  noStatus: 'Státusz nélkül',
  openCasefile: '{casefile} megnyitása',
  keyboardHelp:
    'Enter: megnyitás. Balra és jobbra nyíl: áthelyezés a szomszédos oszlopba. Fel és le nyíl: áthelyezés az oszlopon belül.',
  moved: '{casefile} áthelyezve: {status}, {position}. hely'
};
