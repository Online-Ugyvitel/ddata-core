import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { BaseModel, ProxyServiceInterface, ValidatorService } from '@netdjw/ddata-core';
import { Observable, Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

export type AutocompleteSuggestion = BaseModel & { name?: string };
let nextId = 0;

/**
 * Text input with server side suggestions. While the user types (300 ms debounce) the
 * `autocompleteService.searchWithoutPaginate({ term })` gives the suggestions. The selected
 * suggestion replaces the model (`modelChange`, `selected`).
 *
 * Unlike `dd-autocomplete-select`, which filters a local `items` list and stores the id of the
 * selected item, this component keeps free text in the field and asks the server for suggestions.
 */
@Component({
  selector: 'dd-autocomplete-box',
  templateUrl: './autocomplete-box.component.html',
  styleUrls: ['./autocomplete-box.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteBoxComponent implements OnInit, AfterViewInit {
  @Input() disabled = false;
  @Input() type = 'text';
  @Input() inputClass = 'form-control';
  @Input() labelClass = 'col-12 col-md-3 px-0 col-form-label';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() showLabel = true;
  @Input() autoFocus = false;
  @Input() autocomplete = false;
  @Input() autocompleteService: ProxyServiceInterface<AutocompleteSuggestion> | null = null;
  @Input() loadingText = 'Betöltés...';

  @Output() readonly modelChange: EventEmitter<BaseModel> = new EventEmitter();
  @Output() readonly selected: EventEmitter<AutocompleteSuggestion> = new EventEmitter();

  @ViewChild('inputBox') inputBox: ElementRef<HTMLInputElement>;

  private readonly validatorService = inject(ValidatorService);
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly inputValue: Subject<string> = new Subject();

  private internalModel: BaseModel | null = null;
  private internalField = '';
  private internalAppend: string | null = null;
  private internalPrepend: string | null = null;

  readonly id = `dd-autocomplete-box-${nextId++}`;
  readonly listboxId = `${this.id}_listbox`;
  readonly spinner = faSpinner;
  readonly autocompleteSuggestions = signal<Array<AutocompleteSuggestion>>([]);
  readonly autocompleteCursor = signal(-1);
  readonly autocompleteLoading = signal(false);

  @Input() set model(value: BaseModel | null) {
    this.internalModel = value;
  }

  get model(): BaseModel | null {
    return this.internalModel;
  }

  @Input() set field(value: string) {
    this.internalField = value === 'undefined' ? 'isValid' : value;
  }

  @Input() set append(value: string) {
    this.internalAppend = value === 'undefined' ? '' : value;
  }

  @Input() set prepend(value: string) {
    this.internalPrepend = value === 'undefined' ? '' : value;
  }

  get _field(): string {
    return this.internalField;
  }

  get _label(): string {
    return this.getFieldText('label');
  }

  get _title(): string {
    return this.getFieldText('title');
  }

  get _placeholder(): string {
    return this.getFieldText('placeholder');
  }

  get _prepend(): string {
    return this.internalPrepend ?? this.getFieldText('prepend');
  }

  get _append(): string {
    return this.internalAppend ?? this.getFieldText('append');
  }

  get _is_required(): boolean {
    return !!this.model?.validationRules?.[this.internalField]?.includes('required');
  }

  get isInvalid(): boolean {
    return !!this.model?.validationErrors?.includes(this.internalField);
  }

  get isOpen(): boolean {
    return this.autocompleteSuggestions().length > 0;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (this.autocomplete && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.clearSuggestions();
    }
  }

  ngOnInit(): void {
    this.registerAutocompleteSearch();
  }

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.inputBox?.nativeElement.focus();
    }
  }

  getOptionId(index: number): string {
    return `${this.listboxId}_option_${index}`;
  }

  getActiveDescendant(): string | null {
    const cursor = this.autocompleteCursor();

    return this.isOpen && cursor > -1 ? this.getOptionId(cursor) : null;
  }

  onValueChange(value: string): void {
    this.model[this.internalField] = value;
    this.validateField();

    if (this.autocomplete) {
      this.autocompleteCursor.set(-1);
      this.inputValue.next(value);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.autocomplete) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveCursor(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveCursor(-1);
        break;
      case 'Enter':
        // without a highlighted suggestion the Enter keeps its default behavior (ex. form submit)
        if (this.autocompleteCursor() > -1) {
          event.preventDefault();
          this.setContent();
        }

        break;
      case 'Escape':
        this.clearSuggestions();
        break;
      default:
        break;
    }
  }

  setContent(
    content: AutocompleteSuggestion = this.autocompleteSuggestions()[this.autocompleteCursor()]
  ): void {
    if (!content) {
      return;
    }

    this.model = content;
    this.clearSuggestions();
    this.validateField();
    this.modelChange.emit(content);
    this.selected.emit(content);
  }

  clearSuggestions(): void {
    this.autocompleteCursor.set(-1);
    this.autocompleteSuggestions.set([]);
  }

  validateField(): void {
    const model = this.model;

    if (!model) {
      return;
    }
    const rules = model.validationRules?.[this.internalField];

    if (!rules) {
      console.error(
        `Missing validation rule:${this.internalField} from model: ${model.constructor.name}`
      );

      return;
    }
    const errors = model.validationErrors;
    const index = errors.indexOf(this.internalField);
    const isValid = this.validatorService.validate(model[this.internalField], rules);

    if (!isValid && index === -1) {
      errors.push(this.internalField);
    } else if (isValid && index > -1) {
      errors.splice(index, 1);
    }
  }

  registerAutocompleteSearch(): void {
    if (!this.autocomplete) {
      return;
    }

    if (!this.autocompleteService) {
      console.error(
        `Autocomplete is on the '${this.internalField}' field, but autocompleteService isn't defined.`
      );

      return;
    }

    this.inputValue
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.autocompleteLoading.set(true)),
        // a new term cancels the previous request, only the last result is shown
        switchMap((term) => this.search(term)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((result) => {
        this.autocompleteSuggestions.set(result ?? []);
        this.autocompleteCursor.set(-1);
        this.autocompleteLoading.set(false);
      });
  }

  private search(term: string): Observable<Array<AutocompleteSuggestion>> {
    return this.autocompleteService.searchWithoutPaginate({ term }).pipe(
      catchError((error: unknown) => {
        console.error(error);

        return of([]);
      })
    );
  }

  private moveCursor(step: number): void {
    const last = this.autocompleteSuggestions().length - 1;
    const cursor = Math.min(Math.max(this.autocompleteCursor() + step, 0), last);

    if (cursor < 0) {
      return;
    }

    this.autocompleteCursor.set(cursor);
    this.model[this.internalField] = this.autocompleteSuggestions()[cursor].name ?? '';
  }

  private getFieldText(key: 'label' | 'title' | 'placeholder' | 'prepend' | 'append'): string {
    return this.model?.fields?.[this.internalField]?.[key] ?? '';
  }
}
