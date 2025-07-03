// tslint:disable: deprecation
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { BaseModel, BaseModelInterface } from 'src/app/models/base-model/base-model.model';
import { ProxyServiceInterface } from 'src/app/services/proxy/proxy-service.interface';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { AppModule } from 'src/app/app.module';

interface AutocompleteResult extends BaseModelInterface<any> {
  name: string;
  fields: [];
  getValidatedErrorFields(): any[];
}

@Component({
    selector: 'app-autocomplete-box',
    templateUrl: './autocomplete-box.component.html',
    styleUrls: ['./autocomplete-box.component.scss'],
    standalone: false
})
export class AutocompleteBoxComponent implements OnInit, AfterViewInit {
  _field = '';
  _title = '';
  _label = '';
  _placeholder = '';
  _prepend = '';
  _append = '';
  _is_required = false;
  _model: BaseModel = new BaseModel();
  @Input() set model(value: BaseModel) {
    this._model = value;
    if (!!this._model && !!this._model.fields[this._field]) {
      this._title = this._model.fields[this._field].title ?? '';
      this._label = this._model.fields[this._field].label ?? '';
      this._placeholder = this._model.fields[this._field].placeholder ?? '';
      this._prepend = this.getPrepend();
      this._append = this.getAppend();
    }
    if (!!this._model && !!this._model.validationRules[this._field]) {
      this._is_required = this.model.validationRules[this._field].includes('required');
    }
  }
  get model() {
    return this._model;
  }
  @Input() set field(value: string) {
    if (value === 'undefined') {
      value = 'isValid';
    }

    this._field = value;
  }
  @Input() set append(value: string) {
    if (value === 'undefined') {
      value = '';
    }

    this._append = value;
  }
  @Input() set prepend(value: string) {
    if (value === 'undefined') {
      value = '';
    }

    this._prepend = value;
  }
  @Input() disabled: boolean;
  @Input() type = 'text';
  @Input() inputClass = 'form-control';
  @Input() labelClass = 'col-12 col-md-3 px-0 col-form-label';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() showLabel = true;
  @Input() autoFocus = false;
  @Input() autocomplete = false;
  @Input() autocompleteService: ProxyServiceInterface<any> = null;
  @ViewChild('inputBox') inputBox: ElementRef;
  autocompleteSuggestions: AutocompleteResult[] = [];
  autocompleteCursor = -1;
  random: string = this.randChars();
  inputValue: Subject<string> = new Subject();
  spinner = faSpinner;
  autocompleteLoading = false;
  validatorService: ValidatorService = AppModule.InjectorInstance.get<ValidatorService>(ValidatorService);

  @HostListener('document:click', ['$event']) clickout(event: any) {
    if (this.autocomplete && !this.elementRef.nativeElement.contains(event.target)) {
      this.clearSuggestions();
    }
  }

  constructor(
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    this.registerAutocompleteSearch();
  }

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.inputBox.nativeElement.focus();
    }
  }

  setContent(content: AutocompleteResult = this.autocompleteSuggestions[this.autocompleteCursor]) {
    this.model = content;
    this.clearSuggestions();
    this.validateField();
  }

  setName() {
    if (this.autocompleteCursor > -1) {
      this.model[this._field] = this.autocompleteSuggestions[this.autocompleteCursor].name;
    }
  }

  clearCursor() {
    this.autocompleteCursor = -1;
  }

  clearSuggestions() {
    this.clearCursor();
    this.autocompleteSuggestions = [];
  }

  keyup(event: KeyboardEvent) {
    if (!this.autocomplete) {
      this.validateField();

      return;
    }

    this.autocompleteKeyControl(event);
  }

  autocompleteKeyControl(event: KeyboardEvent) {
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
    if (keyCode >= 186 && keyCode <= 226 || keyCode === 231) {
      return true;
    }

    return false;
  }

  randChars(): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < 50; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  validateField() {
    if (!this.model.validationRules[this._field]) {
      console.error('Missing validation rule:' + this._field + ' from model: ' + this.model.constructor.name);
    } else {
      if (!this.validatorService.validate(this.model[this._field], this.model.validationRules[this._field])) {
        if (!this.model.validationErrors.includes(this._field)) {
          this.model.validationErrors.push(this._field);
        }
      } else {
        if (this.model.validationErrors.includes(this._field)) {
          this.model.validationErrors.splice( this.model.validationErrors.indexOf(this._field), 1);
        }
      }
    }
  }

  getPrepend() {
    if (!this.model || !this.model.fields[this._field] || !this.model.fields[this._field].prepend) {
      return '';
    }

    return this.model.fields[this._field].prepend;
  }

  getAppend() {
    if (!this.model || !this.model.fields[this._field] || !this.model.fields[this._field].append) {
      return '';
    }

    return this.model.fields[this._field].append;
  }

  registerAutocompleteSearch() {
    if (!this.autocomplete) {
      return;
    }

    if (!this.autocompleteService) {
      console.error(`Autocomplete is on the '${this._field}' field, but autocompleteService isn't defined.`);
      return;
    }

    this.inputValue
      .pipe(
        map((e: any) => this.inputBox.nativeElement.value),
        // wait 300 ms to start
        debounceTime(300),
        // if value is the same, ignore
        distinctUntilChanged(),
        // start connection
        switchMap(term => {
          this.autocompleteLoading = true;
          return this.autocompleteService.searchWithoutPaginate({term: this.model[this._field]});
        }),
      ).subscribe((result: AutocompleteResult[]) => {
        this.autocompleteSuggestions = result;
        this.autocompleteLoading = false;
      });
  }
}
