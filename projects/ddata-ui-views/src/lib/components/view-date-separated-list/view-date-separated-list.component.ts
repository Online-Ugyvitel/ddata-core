import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  InjectionToken,
  input,
  output
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFolderOpen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DdataUiCommonModule } from '@netdjw/ddata-ui-common';
import {
  viewDateSeparatedListTexts,
  ViewDateSeparatedListTextsInterface
} from '../../i18n/view-date-separated-list.texts';
import { CasefileInterface } from '../../models/casefile/casefile.interface';
import {
  ViewDateSeparatedList,
  ViewDateSeparatedListInterface
} from '../../models/view/date-separated-list/view-date-separated-list.model';
import { formatText } from '../../utils/format-text';
import {
  DeadlineInterface,
  formatDay,
  parseDeadline,
  relativeDay,
  toDayKey
} from '../../utils/relative-time';
import { ViewportHeight } from '../../utils/viewport-height';

/**
 * The current time of the views. Override it for deterministic tests or to use the server time.
 */
export const ddataViewsNow = new InjectionToken<() => Date>('ddataViewsNow', {
  providedIn: 'root',
  factory: (): (() => Date) => () => new Date()
});

@Component({
  selector: 'dd-view-date-separated-list',
  templateUrl: './view-date-separated-list.component.html',
  styleUrls: ['./view-date-separated-list.component.scss'],
  imports: [DdataUiCommonModule, FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'viewportHeight.update()'
  }
})
export class ViewDateSeparatedListComponent {
  private readonly clock = inject(ddataViewsNow);

  readonly data = input<Array<CasefileInterface> | null>([]);
  readonly title = input('Dátum szerint csoportosított nézet');
  readonly locale = input('hu');
  readonly noDeadlineText = input('Határidő nélküli feladatok');
  /**
   * IANA time zone of the grouping (e.g. `Europe/Budapest`), by default the user's local time zone.
   */
  readonly timeZone = input<string | undefined>(undefined);
  /**
   * The current time what the group names are relative to, by default the `ddataViewsNow` token.
   */
  readonly now = input<Date | string | number | null>(null);
  /**
   * The space above and below the list in pixels, the list fills the rest of the window.
   * `null` disables the fixed height.
   */
  readonly heightOffset = input<number | null>(189);
  readonly texts = input<Partial<ViewDateSeparatedListTextsInterface>>({});

  readonly openCasefile = output<CasefileInterface>();
  readonly deleteCasefile = output<CasefileInterface>();

  readonly i18n = computed<ViewDateSeparatedListTextsInterface>(() => ({
    ...viewDateSeparatedListTexts,
    ...this.texts()
  }));

  readonly lists = computed(() => this.convertToDateSeparatedList(this.data() ?? []));
  readonly viewportHeight = new ViewportHeight(this.heightOffset);
  readonly icon = { folder: faFolderOpen, trash: faTrashAlt };

  /**
   * Groups the casefiles by the calendar day of their deadline, in the user's local time zone (or `timeZone`).
   * The groups are in chronological order, the casefiles without a valid deadline are in the last group.
   * Inside a group the casefiles are ordered by their deadline.
   */
  convertToDateSeparatedList(
    data: Array<CasefileInterface>
  ): Array<ViewDateSeparatedListInterface> {
    const today = toDayKey(this.currentTime(), this.timeZone());
    const groups = new Map<string, Array<{ casefile: CasefileInterface; time: number }>>();

    data.forEach((casefile) => {
      const deadline: DeadlineInterface | null = parseDeadline(casefile.deadline, this.timeZone());
      const day = deadline?.day ?? '';

      if (!groups.has(day)) {
        groups.set(day, []);
      }

      groups.get(day).push({ casefile, time: deadline?.time ?? 0 });
    });

    return (
      [...groups.keys()]
        // the empty key of the casefiles without deadline goes to the end
        .sort((a, b) => (!a ? 1 : !b ? -1 : a.localeCompare(b)))
        .map((day) =>
          new ViewDateSeparatedList().init({
            name: day ? relativeDay(day, today, this.locale()) : this.noDeadlineText(),
            date: day,
            casefiles: groups
              .get(day)
              .sort((a, b) => a.time - b.time)
              .map((item) => item.casefile)
          })
        )
    );
  }

  formatDate(day: string): string {
    return formatDay(day, this.locale());
  }

  label(text: string, casefile: CasefileInterface): string {
    return formatText(text, { casefile: casefile.name ?? '' });
  }

  open(casefile: CasefileInterface): void {
    const original = this.findData(casefile);

    if (original) {
      this.openCasefile.emit(original);
    }
  }

  delete(casefile: CasefileInterface): void {
    const original = this.findData(casefile);

    if (original) {
      this.deleteCasefile.emit(original);
    }
  }

  private currentTime(): Date {
    const now = this.now();

    return now === null ? this.clock() : new Date(now);
  }

  private findData(casefile: CasefileInterface): CasefileInterface | undefined {
    const data = this.data() ?? [];

    return data.find((item) => item === casefile) ?? data.find((item) => item.id === casefile.id);
  }
}
