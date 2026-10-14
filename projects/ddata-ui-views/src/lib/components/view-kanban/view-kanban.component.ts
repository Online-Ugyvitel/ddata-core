import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  Injector,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChildren
} from '@angular/core';
import { DdataUiCommonModule } from '@netdjw/ddata-ui-common';
import { viewKanbanTexts, ViewKanbanTextsInterface } from '../../i18n/view-kanban.texts';
import {
  CasefileInterface,
  CasefileStatusInterface
} from '../../models/casefile/casefile.interface';
import { KanbanStatus, KanbanStatusInterface } from '../../models/view/kanban/kanban-status.model';
import { ViewKanban, ViewKanbanInterface } from '../../models/view/kanban/view-kanban.model';
import { formatText } from '../../utils/format-text';
import { ViewportHeight } from '../../utils/viewport-height';
const estimatedTimePattern = /^(\d+):(\d{1,2}):(\d{1,2})$/;
let nextId = 0;

interface DropTargetInterface {
  status: KanbanStatusInterface;
  /** The casefile what the dragged one is placed before, `null` places it to the end. */
  before: CasefileInterface | null;
}

@Component({
  selector: 'dd-view-kanban',
  templateUrl: './view-kanban.component.html',
  styleUrls: ['./view-kanban.component.scss'],
  imports: [DdataUiCommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'viewportHeight.update()'
  }
})
export class ViewKanbanComponent {
  private readonly injector = inject(Injector);
  private readonly cards = viewChildren<ElementRef<HTMLElement>>('card');

  readonly data = input<Array<CasefileInterface> | null>([]);
  readonly statuses = input<Array<CasefileStatusInterface> | null>([]);
  readonly title = input('Kanban nézet');
  /**
   * The space above and below the board in pixels, the board fills the rest of the window.
   * `null` disables the fixed height.
   */
  readonly heightOffset = input<number | null>(189);
  readonly texts = input<Partial<ViewKanbanTextsInterface>>({});

  readonly openCasefile = output<CasefileInterface>();
  /**
   * Emitted when a casefile is moved to another column. The original casefile is emitted with its new status.
   */
  readonly updateCasefile = output<CasefileInterface>();

  readonly i18n = computed<ViewKanbanTextsInterface>(() => ({
    ...viewKanbanTexts,
    ...this.texts()
  }));

  /**
   * The columns follow the order of the statuses, the unknown statuses are added after them.
   * A drag and drop or a keyboard move changes the board until the inputs change.
   */
  readonly board = linkedSignal<ViewKanbanInterface>(() =>
    this.convertToKanban(this.data() ?? [], this.statuses() ?? [])
  );

  readonly dragged = signal<CasefileInterface | null>(null);
  readonly dropTarget = signal<DropTargetInterface | null>(null);
  readonly announcement = signal('');
  readonly viewportHeight = new ViewportHeight(this.heightOffset);
  readonly helpId = `dd-view-kanban-help-${nextId++}`;

  convertToKanban(
    data: Array<CasefileInterface>,
    statuses: Array<CasefileStatusInterface>
  ): ViewKanbanInterface {
    const columns: Array<KanbanStatusInterface> = statuses.map((status) =>
      new KanbanStatus().init({ id: status.id, name: status.name, color: status.color })
    );

    data.forEach((casefile: CasefileInterface) => {
      const id = casefile.status_id ?? casefile.status?.id ?? null;
      let column = columns.find((item) => item.id === id);

      if (!column) {
        column = new KanbanStatus().init({
          id,
          name: casefile.status?.name ?? (id === null ? this.i18n().noStatus : `#${id}`),
          color: casefile.status?.color ?? ''
        });
        columns.push(column);
      }

      column.casefiles.push(casefile);
    });

    return new ViewKanban().init({ name: this.title(), statuses: columns });
  }

  getEstimatedTimes(status: KanbanStatusInterface): string {
    const totalSeconds = status.casefiles.reduce(
      (sum, casefile) => sum + this.toSeconds(casefile.estimated_time),
      0
    );
    // the sum is shown in hours even above 24 hours, so no day is lost
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const text: Array<string> = [];

    if (hours > 0) {
      text.push(`${hours}${this.i18n().hour}`);
    }

    if (minutes > 0) {
      text.push(`${minutes}${this.i18n().minute}`);
    }

    return text.join(' ');
  }

  open(casefile: CasefileInterface): void {
    const original = this.findData(casefile);

    if (original) {
      this.openCasefile.emit(original);
    }
  }

  openLabel(casefile: CasefileInterface): string {
    return formatText(this.i18n().openCasefile, { casefile: casefile.name ?? '' });
  }

  isDragOver(status: KanbanStatusInterface): boolean {
    return this.dropTarget()?.status === status;
  }

  dragstart(event: DragEvent, casefile: CasefileInterface): void {
    this.dragged.set(casefile);

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      // Firefox starts the drag only when some data is set
      event.dataTransfer.setData('text/plain', String(casefile.id));
    }
  }

  dragoverStatus(event: DragEvent, status: KanbanStatusInterface): void {
    this.allowDrop(event, { status, before: null });
  }

  dragoverCasefile(
    event: DragEvent,
    status: KanbanStatusInterface,
    casefile: CasefileInterface
  ): void {
    // the column must not override the target casefile
    event.stopPropagation();
    this.allowDrop(event, { status, before: casefile });
  }

  drop(event: DragEvent): void {
    const casefile = this.dragged();
    const target = this.dropTarget();

    event.preventDefault();

    if (casefile && target) {
      this.move(casefile, target.status, target.before);
    }

    this.dragend();
  }

  /**
   * The drag ended: after a drop, or cancelled by the Esc key or by releasing it outside of the board.
   */
  dragend(): void {
    this.dragged.set(null);
    this.dropTarget.set(null);
  }

  keydown(event: KeyboardEvent, casefile: CasefileInterface, status: KanbanStatusInterface): void {
    // the keys of the buttons inside the card are handled by the buttons
    if (event.target === event.currentTarget && this.handleKey(event.key, casefile, status)) {
      event.preventDefault();
    }
  }

  /**
   * Moves a casefile into a column before another casefile, or to the end of the column.
   * When the column changes, the status of the original casefile is updated and `updateCasefile` is emitted.
   */
  move(
    casefile: CasefileInterface,
    target: KanbanStatusInterface,
    before: CasefileInterface | null
  ): void {
    const board = this.board();
    const targetIndex = board.statuses.indexOf(target);
    const source = board.statuses.find((status) => status.casefiles.includes(casefile));

    if (targetIndex === -1 || !source || before === casefile) {
      return;
    }
    const statuses = board.statuses.map((status) =>
      new KanbanStatus().init({
        id: status.id,
        name: status.name,
        color: status.color,
        casefiles: status.casefiles.filter((item) => item !== casefile)
      })
    );
    const casefiles = statuses[targetIndex].casefiles;
    const beforeIndex = before ? casefiles.indexOf(before) : -1;

    casefiles.splice(beforeIndex === -1 ? casefiles.length : beforeIndex, 0, casefile);
    this.board.set(new ViewKanban().init({ name: board.name, statuses }));

    if (source.id !== target.id) {
      this.updateStatus(casefile, target);
    }
  }

  private allowDrop(event: DragEvent, target: DropTargetInterface): void {
    // a drag what was not started on this board (another board, a file, etc.) can not be dropped here
    if (!this.dragged()) {
      return;
    }

    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    const current = this.dropTarget();

    if (current?.status !== target.status || current?.before !== target.before) {
      this.dropTarget.set(target);
    }
  }

  /**
   * Returns whether the key was handled.
   */
  private handleKey(
    key: string,
    casefile: CasefileInterface,
    status: KanbanStatusInterface
  ): boolean {
    if (key === 'Enter' || key === ' ') {
      this.open(casefile);

      return true;
    }

    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const statuses = this.board().statuses;
      const target = statuses[statuses.indexOf(status) + (key === 'ArrowLeft' ? -1 : 1)];

      return !!target && this.moveWithKeyboard(casefile, target, null);
    }

    if (key === 'ArrowUp' || key === 'ArrowDown') {
      const index = status.casefiles.indexOf(casefile) + (key === 'ArrowUp' ? -1 : 1);

      if (index < 0 || index >= status.casefiles.length) {
        return false;
      }
      // moving down: place it before the casefile after the next one
      const before =
        key === 'ArrowUp' ? status.casefiles[index] : (status.casefiles[index + 1] ?? null);

      return this.moveWithKeyboard(casefile, status, before);
    }

    return false;
  }

  private moveWithKeyboard(
    casefile: CasefileInterface,
    target: KanbanStatusInterface,
    before: CasefileInterface | null
  ): boolean {
    this.move(casefile, target, before);
    const column = this.board().statuses.find((status) => status.casefiles.includes(casefile));

    this.announcement.set(
      formatText(this.i18n().moved, {
        casefile: casefile.name ?? '',
        status: column.name,
        position: column.casefiles.indexOf(casefile) + 1
      })
    );
    // the card is rendered again in its new place, so the focus has to be moved there
    afterNextRender(
      () =>
        this.cards()
          .find((card) => card.nativeElement.dataset['casefileId'] === String(casefile.id))
          ?.nativeElement.focus(),
      { injector: this.injector }
    );

    return true;
  }

  /**
   * The board holds the original casefiles of `data`, so the original casefile is updated and emitted.
   */
  private updateStatus(casefile: CasefileInterface, target: KanbanStatusInterface): void {
    casefile.status_id = target.id;
    // a new object, the previous status object can be shared with other casefiles
    casefile.status =
      target.id === null ? null : { id: target.id, name: target.name, color: target.color };
    this.updateCasefile.emit(casefile);
  }

  private findData(casefile: CasefileInterface): CasefileInterface | undefined {
    const data = this.data() ?? [];

    return data.find((item) => item === casefile) ?? data.find((item) => item.id === casefile.id);
  }

  private toSeconds(time?: string): number {
    const match = estimatedTimePattern.exec((time ?? '').trim());

    if (!match) {
      return 0;
    }
    const [, hours, minutes, seconds] = match.map(Number);

    if (minutes > 59 || seconds > 59) {
      return 0;
    }

    return hours * 3600 + minutes * 60 + seconds;
  }
}
