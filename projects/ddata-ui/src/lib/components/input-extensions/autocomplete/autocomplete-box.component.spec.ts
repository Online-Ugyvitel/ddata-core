import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseModel, ProxyServiceInterface } from '@netdjw/ddata-core';
import { of } from 'rxjs';
import { DdataUiModule } from '../../../ddata-ui.module';
import { AutocompleteBoxComponent } from './autocomplete-box.component';

class Tag extends BaseModel {
  name = '';
  is_inactive = false;

  constructor() {
    super();
    this.validationRules = { name: ['required', 'string'], is_inactive: ['boolean'] };
    this.fields = {
      name: { label: 'Címke neve', title: 'Címke neve', placeholder: 'Címke neve', append: 'db' },
      is_inactive: { label: 'Inaktív', title: 'Inaktív', placeholder: 'Inaktív', prepend: '#' }
    };
  }

  init(data: Partial<Tag> = {}): Tag {
    this.name = data.name ?? '';

    return this;
  }
}

describe('AutocompleteBoxComponent', () => {
  let component: AutocompleteBoxComponent;
  let fixture: ComponentFixture<AutocompleteBoxComponent>;
  const keyup = (keyCode: number): KeyboardEvent =>
    ({ keyCode, preventDefault: vi.fn() }) as unknown as KeyboardEvent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DdataUiModule]
    }).compileComponents();
    fixture = TestBed.createComponent(AutocompleteBoxComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('model setter should read the texts and the required flag of the field', () => {
    component.field = 'name';
    component.model = new Tag().init();

    expect(component._title).toBe('Címke neve');
    expect(component._label).toBe('Címke neve');
    expect(component._placeholder).toBe('Címke neve');
    expect(component._append).toBe('db');
    expect(component._prepend).toBe('');
    expect(component._is_required).toBe(true);

    component.field = 'is_inactive';
    component.model = new Tag().init();

    expect(component._label).toBe('Inaktív');
    expect(component._prepend).toBe('#');
    expect(component._is_required).toBe(false);
  });

  it('model setter should accept a null model', () => {
    component.model = null;

    expect(component.model).toBeNull();
  });

  it("field setter should replace 'undefined' with 'isValid'", () => {
    component.field = 'undefined';

    expect(component._field).toBe('isValid');

    component.field = 'something';

    expect(component._field).toBe('something');
  });

  it("append and prepend setters should replace 'undefined' with an empty string", () => {
    component.append = 'undefined';
    component.prepend = 'undefined';

    expect(component._append).toBe('');
    expect(component._prepend).toBe('');

    component.append = 'kg';
    component.prepend = '$';

    expect(component._append).toBe('kg');
    expect(component._prepend).toBe('$');
  });

  it('randChars() should return a random string of 50 characters', () => {
    const value = component.randChars();

    expect(value).toMatch(/^[A-Za-z0-9]{50}$/);
    expect(component.randChars()).not.toBe(value);
  });

  it('validateField() should add and remove the field from the validation errors', () => {
    const model = new Tag().init();

    component.field = 'name';
    component.model = model;

    component.validateField();

    expect(model.validationErrors).toEqual(['name']);

    model.name = 'Valid';
    component.validateField();

    expect(model.validationErrors).toEqual([]);
  });

  it('validateField() should log an error for a field without validation rule', () => {
    const spy = vi.spyOn(console, 'error').mockReturnValue(undefined);

    component.field = 'missing';
    component.model = new Tag().init();
    component.validateField();

    expect(spy).toHaveBeenCalledWith('Missing validation rule:missing from model: Tag');
  });

  it('enabledKeyCode() should enable only the keys what change the value', () => {
    expect(
      [8, 32, 48, 90, 96, 111, 160, 170, 186, 226, 231].every((code) =>
        component.enabledKeyCode(code)
      )
    ).toBe(true);
    expect([9, 16, 17, 37, 112, 300].some((code) => component.enabledKeyCode(code))).toBe(false);
  });

  it('should search for suggestions and handle the keyboard navigation', () => {
    vi.useFakeTimers();
    const suggestions = [new Tag().init({ name: 'Alma' }), new Tag().init({ name: 'Almás' })];
    const service = {
      searchWithoutPaginate: vi.fn().mockReturnValue(of(suggestions))
    } as unknown as ProxyServiceInterface<Tag>;
    const model = new Tag().init({ name: 'Al' });

    component.autocomplete = true;
    component.autocompleteService = service;
    component.field = 'name';
    component.model = model;
    fixture.detectChanges();
    component.inputBox.nativeElement.value = 'Al';

    component.keyup(keyup(65));
    vi.advanceTimersByTime(300);

    expect(service.searchWithoutPaginate).toHaveBeenCalledWith({ term: 'Al' });
    expect(component.autocompleteSuggestions).toEqual(suggestions);
    expect(component.autocompleteLoading).toBe(false);

    // DOWN, DOWN, DOWN (stays on the last item), UP
    [40, 40, 40, 38].forEach((code) => component.keyup(keyup(code)));

    expect(component.autocompleteCursor).toBe(0);
    expect(model.name).toBe('Alma');
    // ENTER
    const enter = keyup(13);

    component.keyup(enter);

    expect(enter.preventDefault).toHaveBeenCalled();
    expect(component.model).toBe(suggestions[0]);
    expect(component.autocompleteSuggestions).toEqual([]);
    expect(component.autocompleteCursor).toBe(-1);
  });

  it('ESC should clear the suggestions', () => {
    component.autocomplete = true;
    component.autocompleteSuggestions = [new Tag().init({ name: 'Alma' })];
    component.autocompleteCursor = 0;

    component.keyup(keyup(27));

    expect(component.autocompleteSuggestions).toEqual([]);
    expect(component.autocompleteCursor).toBe(-1);
  });

  it('should log an error when autocomplete is on without a service', () => {
    const spy = vi.spyOn(console, 'error').mockReturnValue(undefined);

    component.autocomplete = true;
    component.field = 'name';
    component.registerAutocompleteSearch();

    expect(spy).toHaveBeenCalledWith(
      "Autocomplete is on the 'name' field, but autocompleteService isn't defined."
    );
  });

  it('should clear the suggestions on a click outside of the component', () => {
    component.autocomplete = true;
    component.autocompleteSuggestions = [new Tag().init({ name: 'Alma' })];

    component.clickout({ target: document.body } as unknown as Event);

    expect(component.autocompleteSuggestions).toEqual([]);
  });
});
