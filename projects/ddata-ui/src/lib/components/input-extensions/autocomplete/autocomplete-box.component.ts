// tslint:disable: deprecation
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { BaseModel, ProxyServiceInterface, ValidatorService } from 'ddata-core';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'dd-autocomplete-box',
  templateUrl: './autocomplete-box.component.html',
  styleUrls: ['./autocomplete-box.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteBoxComponent implements OnInit, AfterViewInit {
  // Input properties
  @Input() disabled: boolean;
  @Input() type = 'text';
  @Input() inputClass = 'form-control';
  @Input() labelClass = 'col-12 col-md-3 px-0 col-form-label';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() showLabel = true;
  @Input() autoFocus = false;
  @Input() autocomplete = false;
  @Input() autocompleteService: ProxyServiceInterface<unknown> = null;

  @ViewChild('inputBox') inputBox: ElementRef;

  // Private properties
  private internalField = '';
  private internalTitle = '';
  private internalLabel = '';
  private internalPlaceholder = '';
  private internalPrepend = '';
  private internalAppend = '';
  private internalIsRequired = false;
  private internalModel: BaseModel = new BaseModel();

  // Public properties
  autocompleteSuggestions: Array<unknown> = [];
  autocompleteCursor = -1;
  random: string = this.randChars();
  inputValue: Subject<string> = new Subject();
  spinner = faSpinner;
  autocompleteLoading = false;
  validatorService: ValidatorService =
    AppModule.InjectorInstance.get<ValidatorService>(ValidatorService);

  constructor(private readonly elementRef: ElementRef) {}

  get _field(): string {
    return this.internalField;
  }

  get _label(): string {
    return this.internalLabel;
  }

  get _title(): string {
    return this.internalTitle;
  }

  get _placeholder(): string {
    return this.internalPlaceholder;
  }

  get _prepend(): string {
    return this.internalPrepend;
  }

  get _append(): string {
    return this.internalAppend;
  }

  get _is_required(): boolean {
    return this.internalIsRequired;
  }

  @Input() set model(value: BaseModel) {
    this.internalModel = value;

    if (!!this.internalModel && !!this.internalModel.fields[this.internalField]) {
      this.internalTitle = this.internalModel.fields[this.internalField].title ?? '';
      this.internalLabel = this.internalModel.fields[this.internalField].label ?? '';
      this.internalPlaceholder = this.internalModel.fields[this.internalField].placeholder ?? '';
      this.internalPrepend = this.getPrepend();
      this.internalAppend = this.getAppend();
    }

    if (!!this.internalModel && !!this.internalModel.validationRules[this.internalField]) {
      this.internalIsRequired = this.model.validationRules[this.internalField].includes('required');
    }
  }

  get model(): BaseModel {
    return this.internalModel;
  }

  @Input() set field(value: string) {
    let fieldValue = value;

    if (fieldValue === 'undefined') {
      fieldValue = 'isValid';
    }

    this.internalField = fieldValue;
  }

  @Input() set append(value: string) {
    let appendValue = value;

    if (appendValue === 'undefined') {
      appendValue = '';
    }

    this.internalAppend = appendValue;
  }

  @Input() set prepend(value: string) {
    let prependValue = value;

    if (prependValue === 'undefined') {
      prependValue = '';
    }

    this.internalPrepend = prependValue;
  }

  @HostListener('document:click', ['$event']) clickout(event: Event): void {
    if (this.autocomplete && !this.elementRef.nativeElement.contains(event.target)) {
      this.clearSuggestions();
    }
  }

  ngOnInit(): void {
    this.registerAutocompleteSearch();
  }

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.inputBox.nativeElement.focus();
    }
  }

  setContent(content: unknown = this.autocompleteSuggestions[this.autocompleteCursor]): void {
    this.model = content;
    this.clearSuggestions();
    this.validateField();
  }

  setName(): void {
    if (this.autocompleteCursor > -1) {
      const suggestion = this.autocompleteSuggestions[this.autocompleteCursor] as { name?: string };

      this.model[this.internalField] = suggestion?.name || '';
    }
  }

  clearCursor(): void {
    this.autocompleteCursor = -1;
  }

  clearSuggestions(): void {
    this.clearCursor();
    this.autocompleteSuggestions = [];
  }

  keyup(event: KeyboardEvent): void {
    if (!this.autocomplete) {
      this.validateField();

      return;
    }

    this.autocompleteKeyControl(event);
  }

  autocompleteKeyControl(event: KeyboardEvent): void {
    if (event.keyCode === 40) {
      // DOWN arrow key
      if (this.autocompleteCursor < this.autocompleteSuggestions.length - 1) {
        ++this.autocompleteCursor;
      }

      this.setName();
    } else if (event.keyCode === 38) {
      // UP arrow key
      if (this.autocompleteCursor > 0) {
        --this.autocompleteCursor;
      }

      this.setName();
    } else if (event.keyCode === 13) {
      // ENTER key
      event.preventDefault();
      this.setContent();
    } else if (event.keyCode === 27) {
      // ESC key
      this.clearSuggestions();
    } else if (!this.enabledKeyCode(event.keyCode)) {
      // diabled keys, do nothing
      return;
    } else {
      this.clearCursor();
      this.inputValue.next(this.inputBox.nativeElement.value);
    }
  }

  enabledKeyCode(keyCode: number): boolean {
    // backspace
    if (keyCode === 8) {
      return true;
    }

    // space
    if (keyCode === 32) {
      return true;
    }

    if (keyCode >= 48 && keyCode <= 90) {
      return true;
    }

    // numpad numbers
    if (keyCode >= 96 && keyCode <= 111) {
      return true;
    }

    // special chars
    if (keyCode >= 160 && keyCode <= 165) {
      return true;
    }

    if (keyCode >= 170 && keyCode <= 171) {
      return true;
    }

    if ((keyCode >= 186 && keyCode <= 226) || keyCode === 231) {
      return true;
    }

    return false;
  }

  randChars(): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < 50; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  validateField(): void {
    if (!this.model.validationRules[this.internalField]) {
      console.error(
        `Missing validation rule:${this.internalField} from model: ${this.model.constructor.name}`
      );
    } else {
      if (
        !this.validatorService.validate(
          this.model[this.internalField],
          this.model.validationRules[this.internalField]
        )
      ) {
        if (!this.model.validationErrors.includes(this.internalField)) {
          this.model.validationErrors.push(this.internalField);
        }
      } else {
        if (this.model.validationErrors.includes(this.internalField)) {
          this.model.validationErrors.splice(
            this.model.validationErrors.indexOf(this.internalField),
            1
          );
        }
      }
    }
  }

  getPrepend(): string {
    if (
      !this.model ||
      !this.model.fields[this.internalField] ||
      !this.model.fields[this.internalField].prepend
    ) {
      return '';
    }

    return this.model.fields[this.internalField].prepend;
  }

  getAppend(): string {
    if (
      !this.model ||
      !this.model.fields[this.internalField] ||
      !this.model.fields[this.internalField].append
    ) {
      return '';
    }

    return this.model.fields[this.internalField].append;
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
        map(() => this.inputBox.nativeElement.value),
        // wait 300 ms to start
        debounceTime(300),
        // if value is the same, ignore
        distinctUntilChanged(),
        // start connection
        switchMap(() => {
          this.autocompleteLoading = true;

          return this.autocompleteService.searchWithoutPaginate({
            term: this.model[this.internalField]
          });
        })
      )
      .subscribe((result: Array<unknown>) => {
        this.autocompleteSuggestions = result;
        this.autocompleteLoading = false;
      });
  }
}
