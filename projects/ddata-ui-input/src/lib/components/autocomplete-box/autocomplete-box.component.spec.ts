import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BaseModel, DdataCoreModule, ProxyServiceInterface } from '@netdjw/ddata-core';
import { InputHelperService } from '../../services/input/helper/input-helper.service';
import { Subject, of, throwError } from 'rxjs';
import { AutocompleteBoxComponent, AutocompleteSuggestion } from './autocomplete-box.component';

class Tag extends BaseModel {
  name = '';
  is_inactive = false;

  constructor() {
    super();
    this.validationRules = { name: ['required', 'string'], is_inactive: ['boolean'] };
    this.fields = {
      name: { label: 'Címke neve', title: 'Címke címe', placeholder: 'Címke...', append: 'db' },
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
  let model: Tag;
  let service: { searchWithoutPaginate: ReturnType<typeof vi.fn> };
  const suggestions = (): Array<Tag> => [
    new Tag().init({ name: 'Alma' }),
    new Tag().init({ name: 'Almás' })
  ];
  const element = (): HTMLElement => fixture.nativeElement;
  const input = (): HTMLInputElement => element().querySelector('input');
  const options = (): Array<HTMLElement> =>
    Array.from(element().querySelectorAll<HTMLElement>('[role="option"]'));
  const key = (value: string): KeyboardEvent =>
    new KeyboardEvent('keydown', { key: value, cancelable: true });
  const press = (value: string): KeyboardEvent => {
    const event = key(value);

    input().dispatchEvent(event);
    fixture.detectChanges();

    return event;
  };
  const type = (value: string): void => {
    input().value = value;
    input().dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  const setInputs = (inputs: Record<string, unknown>): void => {
    Object.entries(inputs).forEach(([name, value]) => fixture.componentRef.setInput(name, value));
  };
  const createAutocomplete = (inputs: Record<string, unknown> = {}): void => {
    setInputs({
      autocomplete: true,
      autocompleteService: service,
      field: 'name',
      model,
      ...inputs
    });
    fixture.detectChanges();
  };
  const search = (value: string): void => {
    type(value);
    vi.advanceTimersByTime(300);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    // the pure helpers of the real service, they do not use `this`
    const helperService = {
      getErrorText: InputHelperService.prototype.getErrorText,
      buildDescribedBy: InputHelperService.prototype.buildDescribedBy
    };

    DdataCoreModule.InjectorInstance = {
      get: (token: unknown) =>
        token === InputHelperService ? helperService : TestBed.inject(token as never)
    } as never;
    await TestBed.configureTestingModule({
      declarations: [AutocompleteBoxComponent],
      imports: [FormsModule, FontAwesomeModule]
    }).compileComponents();
    fixture = TestBed.createComponent(AutocompleteBoxComponent);
    component = fixture.componentInstance;
    model = new Tag().init();
    service = { searchWithoutPaginate: vi.fn().mockReturnValue(of(suggestions())) };
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('inputs', () => {
    it('should create with the default values', () => {
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(component.model).toBeNull();
      expect(input()).toBeNull();
    });

    it('model should give the texts and the required flag of the field', () => {
      setInputs({ field: 'name', model });

      expect(component._title).toBe('Címke címe');
      expect(component._label).toBe('Címke neve');
      expect(component._placeholder).toBe('Címke...');
      expect(component._append).toBe('db');
      expect(component._prepend).toBe('');
      expect(component._is_required).toBe(true);

      setInputs({ field: 'is_inactive' });

      expect(component._label).toBe('Inaktív');
      expect(component._prepend).toBe('#');
      expect(component._append).toBe('');
      expect(component._is_required).toBe(false);
    });

    it('should not depend on the order of the model and field inputs', () => {
      setInputs({ model, field: 'name' });

      expect(component._label).toBe('Címke neve');
    });

    it('should render the texts of the field', () => {
      createAutocomplete();
      const label = element().querySelector('label');

      expect(label.textContent).toContain('Címke neve');
      expect(label.textContent).toContain('*');
      expect(label.htmlFor).toBe(input().id);
      expect(input().placeholder).toBe('Címke...');
      expect(input().title).toBe('Címke címe');
      expect(input().getAttribute('autocomplete')).toBe('off');
      expect(input().getAttribute('aria-required')).toBe('true');
      expect(element().querySelectorAll('.dd-control-affix')[0].textContent.trim()).toBe('db');
      expect(element().querySelectorAll('.dd-control-affix').length).toBe(1);
    });

    it('should render the prepend text', () => {
      createAutocomplete({ prepend: '#' });

      expect(element().querySelectorAll('.dd-control-affix')[0].textContent.trim()).toBe('#');
    });

    it('should hide the label', () => {
      createAutocomplete({ showLabel: false });

      expect(element().querySelector('label')).toBeNull();
    });

    it('should accept a null model and fields without texts', () => {
      setInputs({ field: 'missing', model: null });
      fixture.detectChanges();

      expect(component.model).toBeNull();
      expect(component._label).toBe('');
      expect(component._is_required).toBe(false);
      expect(component.isInvalid).toBe(false);
      expect(() => component.validateField()).not.toThrow();

      setInputs({ model });

      expect(component._label).toBe('');
      expect(component._prepend).toBe('');
    });

    it("field setter should replace 'undefined' with 'isValid'", () => {
      component.field = 'undefined';

      expect(component._field).toBe('isValid');

      component.field = 'something';

      expect(component._field).toBe('something');
    });

    it('append and prepend inputs should override the texts of the field', () => {
      setInputs({ field: 'name', model, append: 'kg', prepend: '$' });

      expect(component._append).toBe('kg');
      expect(component._prepend).toBe('$');

      setInputs({ append: 'undefined', prepend: 'undefined' });

      expect(component._append).toBe('');
      expect(component._prepend).toBe('');
    });

    it('should render different ids in two instances', () => {
      const other = TestBed.createComponent(AutocompleteBoxComponent);

      expect(other.componentInstance.id).not.toBe(component.id);
    });

    it('should disable the input', async () => {
      createAutocomplete({ disabled: true });
      await fixture.whenStable();

      expect(input().disabled).toBe(true);
    });

    it('should focus the input with autoFocus', () => {
      createAutocomplete({ autoFocus: true });

      expect(document.activeElement).toBe(input());
    });

    it('should not focus the input without autoFocus', () => {
      createAutocomplete();

      expect(document.activeElement).not.toBe(input());
    });
  });

  describe('validation', () => {
    it('should add and remove the field from the validation errors while typing', () => {
      setInputs({ field: 'name', model });
      fixture.detectChanges();

      type('');

      expect(model.validationErrors).toEqual(['name']);
      expect(input().getAttribute('aria-invalid')).toBe('true');
      expect(input().getAttribute('aria-invalid')).toBe('true');

      type('');

      expect(model.validationErrors).toEqual(['name']);

      type('Valid');

      expect(model.name).toBe('Valid');
      expect(model.validationErrors).toEqual([]);
      expect(input().hasAttribute('aria-invalid')).toBe(false);

      type('Still valid');

      expect(model.validationErrors).toEqual([]);
    });

    it('should log an error for a field without validation rule', () => {
      const spy = vi.spyOn(console, 'error').mockReturnValue(undefined);

      setInputs({ field: 'missing', model });
      component.validateField();

      expect(spy).toHaveBeenCalledWith('Missing validation rule:missing from model: Tag');
      expect(model.validationErrors).toEqual([]);
    });

    it('should not search without autocomplete', () => {
      setInputs({ field: 'name', model, autocompleteService: service });
      fixture.detectChanges();
      vi.useFakeTimers();

      type('Al');
      press('ArrowDown');
      vi.advanceTimersByTime(300);

      expect(service.searchWithoutPaginate).not.toHaveBeenCalled();
      expect(input().getAttribute('role')).toBeNull();
    });
  });

  describe('search', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should search once after 300 ms', () => {
      createAutocomplete();

      type('A');
      type('Al');
      vi.advanceTimersByTime(299);

      expect(service.searchWithoutPaginate).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      fixture.detectChanges();

      expect(service.searchWithoutPaginate).toHaveBeenCalledTimes(1);
      expect(service.searchWithoutPaginate).toHaveBeenCalledWith({ term: 'Al' });
      expect(options().map((option) => option.textContent.trim())).toEqual(['Alma', 'Almás']);
      expect(input().getAttribute('aria-expanded')).toBe('true');
      expect(component.autocompleteLoading()).toBe(false);
    });

    it('should not search again for the same value', () => {
      createAutocomplete();

      search('Al');
      search('Al');

      expect(service.searchWithoutPaginate).toHaveBeenCalledTimes(1);
    });

    it('should show the loading state and only the result of the last request', () => {
      const first = new Subject<Array<Tag>>();
      const second = new Subject<Array<Tag>>();

      service.searchWithoutPaginate.mockReturnValueOnce(first).mockReturnValueOnce(second);
      createAutocomplete();

      search('Al');

      expect(component.autocompleteLoading()).toBe(true);
      expect(element().querySelector('[role="status"]').textContent).toContain('Betöltés...');
      expect(input().getAttribute('aria-busy')).toBe('true');

      search('Alm');
      first.next([new Tag().init({ name: 'Old' })]);
      fixture.detectChanges();

      expect(options().length).toBe(0);

      second.next([new Tag().init({ name: 'Almafa' })]);
      fixture.detectChanges();

      expect(options().map((option) => option.textContent.trim())).toEqual(['Almafa']);
      expect(element().querySelector('[role="status"]')).toBeNull();
    });

    it('should keep the list closed for an empty result', () => {
      service.searchWithoutPaginate.mockReturnValue(of([]));
      createAutocomplete();

      search('Xyz');

      expect(options().length).toBe(0);
      expect(input().getAttribute('aria-expanded')).toBe('false');
      expect(component.autocompleteLoading()).toBe(false);
    });

    it('should handle a null result', () => {
      service.searchWithoutPaginate.mockReturnValue(of(null));
      createAutocomplete();

      search('Xyz');

      expect(component.autocompleteSuggestions()).toEqual([]);
    });

    it('should handle an error response and keep searching', () => {
      const spy = vi.spyOn(console, 'error').mockReturnValue(undefined);
      const error = new Error('Server error');

      service.searchWithoutPaginate.mockReturnValueOnce(throwError(() => error));
      createAutocomplete();

      search('Al');

      expect(spy).toHaveBeenCalledWith(error);
      expect(options().length).toBe(0);
      expect(component.autocompleteLoading()).toBe(false);

      search('Alm');

      expect(options().length).toBe(2);
    });

    it('should log an error when autocomplete is on without a service', () => {
      const spy = vi.spyOn(console, 'error').mockReturnValue(undefined);

      createAutocomplete({ autocompleteService: null });
      type('Al');
      vi.advanceTimersByTime(300);

      expect(spy).toHaveBeenCalledWith(
        "Autocomplete is on the 'name' field, but autocompleteService isn't defined."
      );
    });

    it('should stop searching when the component is destroyed', () => {
      createAutocomplete();
      type('Al');
      fixture.destroy();
      vi.advanceTimersByTime(300);

      expect(service.searchWithoutPaginate).not.toHaveBeenCalled();
    });
  });

  describe('keyboard', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      createAutocomplete();
      search('Al');
    });

    it('should move the cursor inside the list with the arrow keys', () => {
      const down = press('ArrowDown');

      expect(down.defaultPrevented).toBe(true);
      expect(component.autocompleteCursor()).toBe(0);
      expect(model.name).toBe('Alma');
      expect(input().getAttribute('aria-activedescendant')).toBe(options()[0].id);
      expect(options()[0].getAttribute('aria-selected')).toBe('true');
      expect(options()[0].classList).toContain('active');

      press('ArrowDown');
      press('ArrowDown');

      expect(component.autocompleteCursor()).toBe(1);
      expect(model.name).toBe('Almás');

      press('ArrowUp');
      const up = press('ArrowUp');

      expect(up.defaultPrevented).toBe(true);
      expect(component.autocompleteCursor()).toBe(0);
      expect(model.name).toBe('Alma');
    });

    it('should select the highlighted suggestion with Enter', () => {
      const changes = vi.fn();
      const selected = vi.fn();

      component.modelChange.subscribe(changes);
      component.selected.subscribe(selected);
      press('ArrowDown');
      const enter = press('Enter');

      expect(enter.defaultPrevented).toBe(true);
      expect((component.model as Tag).name).toBe('Alma');
      expect(component.model).not.toBe(model);
      expect(changes).toHaveBeenCalledWith(component.model);
      expect(selected).toHaveBeenCalledWith(component.model);
      expect(component.autocompleteSuggestions()).toEqual([]);
      expect(component.autocompleteCursor()).toBe(-1);
      expect(input().getAttribute('aria-activedescendant')).toBeNull();
    });

    it('should keep the default Enter behavior without a highlighted suggestion', () => {
      const changes = vi.fn();

      component.modelChange.subscribe(changes);
      const enter = press('Enter');

      expect(enter.defaultPrevented).toBe(false);
      expect(changes).not.toHaveBeenCalled();
      expect(component.model).toBe(model);
    });

    it('should clear the suggestions with Escape', () => {
      press('ArrowDown');
      press('Escape');

      expect(options().length).toBe(0);
      expect(component.autocompleteCursor()).toBe(-1);
      expect(input().getAttribute('aria-expanded')).toBe('false');
    });

    it.each(['Tab', 'Shift', 'F5', 'ArrowLeft', 'ArrowRight', 'Control'])(
      '%s should not start a search',
      (value) => {
        const event = press(value);

        vi.advanceTimersByTime(300);

        expect(event.defaultPrevented).toBe(false);
        expect(service.searchWithoutPaginate).toHaveBeenCalledTimes(1);
        expect(options().length).toBe(2);
      }
    );

    it('should use an empty text for a suggestion without name', () => {
      service.searchWithoutPaginate.mockReturnValue(of([new BaseModel()]));
      search('Alm');
      press('ArrowDown');

      expect(model.name).toBe('');
    });

    it('arrow keys should do nothing without suggestions', () => {
      press('Escape');
      press('ArrowDown');
      press('ArrowUp');

      expect(component.autocompleteCursor()).toBe(-1);
      expect(model.name).toBe('Al');
    });

    it('typing should reset the cursor', () => {
      press('ArrowDown');
      type('Alm');

      expect(component.autocompleteCursor()).toBe(-1);
    });
  });

  describe('mouse', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      createAutocomplete();
      search('Al');
    });

    it('should select a suggestion with a click and keep the focus on mousedown', () => {
      const mousedown = new MouseEvent('mousedown', { cancelable: true });

      options()[1].dispatchEvent(mousedown);
      options()[1].click();
      fixture.detectChanges();

      expect(mousedown.defaultPrevented).toBe(true);
      expect((component.model as Tag).name).toBe('Almás');
      expect(options().length).toBe(0);
    });

    it('should close the list on blur', () => {
      input().dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(options().length).toBe(0);
    });

    it('should close the list on a click outside of the component', () => {
      document.body.click();
      fixture.detectChanges();

      expect(options().length).toBe(0);
    });

    it('should keep the list on a click inside of the component', () => {
      element().querySelector('label').click();
      fixture.detectChanges();

      expect(options().length).toBe(2);
    });

    it('should ignore an outside click without autocomplete', () => {
      fixture.componentRef.setInput('autocomplete', false);
      document.body.click();

      expect(component.autocompleteSuggestions().length).toBe(2);
    });

    it('setContent() should do nothing without a suggestion', () => {
      component.setContent();

      expect(component.model).toBe(model);
    });
  });

  describe('form field skeleton', () => {
    const FIELD = 'name';
    const buildModel = (options: {
      errors: Array<string>;
      help?: string;
      message?: string;
    }): BaseModel => {
      const model = new Tag();

      model.fields = {
        name: { label: 'Címke neve', title: 'Címke', placeholder: '', help: options.help }
      };

      model.validationErrors = options.errors;
      model.getFieldErrorMessage = options.message ? () => options.message : undefined;

      return model;
    };
    const query = (selector: string): HTMLElement => fixture.nativeElement.querySelector(selector);
    const render = (extra: Record<string, unknown> = {}): void => {
      Object.entries({ field: FIELD, model: buildModel({ errors: [] }), ...extra }).forEach(
        ([key, value]) => fixture.componentRef.setInput(key, value)
      );
      fixture.detectChanges();
    };
    const describedBy = (): Array<string> =>
      (query('input').getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);

    it('should render the label above the .dd-control without a colon', () => {
      render({});

      expect(query('.dd-field > .dd-field-label-row > label.form-label')).not.toBeNull();
      expect(query('label').textContent).not.toContain(':');
      expect(query('.dd-field-control .dd-control input')).not.toBeNull();
      expect(query('.dd-required').getAttribute('aria-hidden')).toBe('true');
    });

    it('should render no label row without a label', () => {
      render({ showLabel: false });

      expect(query('label')).toBeNull();
      expect(query('.dd-field-label-row')).toBeNull();
    });

    it('should render the help of the model and let helpText override it', () => {
      render({ model: buildModel({ errors: [], help: 'Súgó a modellből' }) });

      expect(query('.form-text').textContent.trim()).toBe('Súgó a modellből');
      expect(describedBy()).toEqual([query('.form-text').id]);

      fixture.componentRef.setInput('helpText', 'Súgó a sablonból');
      fixture.detectChanges();

      expect(query('.form-text').textContent.trim()).toBe('Súgó a sablonból');
    });

    it('should render the error message with the suggestion and the aria attributes', () => {
      render({
        model: buildModel({ errors: [FIELD], message: 'Hibás érték.' }),
        errorSuggestion: 'Javítsd ki.'
      });
      const error = query('.invalid-feedback.d-flex');

      expect(error.querySelector('span').textContent).toBe('Hibás érték. Javítsd ki.');
      expect(error.querySelector('fa-icon').getAttribute('aria-hidden')).toBe('true');
      expect(query('.dd-control').classList).toContain('is-invalid');
      expect(query('input').getAttribute('aria-invalid')).toBe('true');
      expect(describedBy()).toEqual([error.id]);

      fixture.componentRef.setInput('errorText', 'Saját üzenet');
      fixture.detectChanges();

      expect(query('.invalid-feedback span').textContent).toBe('Saját üzenet Javítsd ki.');
    });

    it('should only mark the border when the model has no message', () => {
      render({ model: buildModel({ errors: [FIELD] }) });

      expect(query('.invalid-feedback')).toBeNull();
      expect(query('.dd-control').classList).toContain('is-invalid');
    });

    it('should render nothing about errors and help for a valid field', () => {
      render({ errorText: 'Nem látszhat' });

      expect(query('.invalid-feedback')).toBeNull();
      expect(query('.form-text')).toBeNull();
      expect(query('input').hasAttribute('aria-invalid')).toBe(false);
      expect(query('input').hasAttribute('aria-describedby')).toBe(false);
    });

    it('should render the size, the layout and the disabled state', () => {
      render({ size: 'sm', layout: 'inline', disabled: true });

      expect(query('.dd-control').classList).toContain('dd-control-sm');
      expect(query('.dd-control').classList).toContain('is-disabled');
      expect(query('.dd-field').classList).toContain('dd-field-inline');
    });

    it('should apply the overridden legacy classes', () => {
      render({ wrapperClass: 'my-wrapper', labelClass: 'my-label', inputBlockClass: 'my-block' });

      expect(query('.my-wrapper label.my-label')).not.toBeNull();
      expect(query('.my-wrapper .my-block .dd-control')).not.toBeNull();
    });

    it('should keep the suggestions below the control box', () => {
      render({ autocomplete: true, autocompleteService: service });

      expect(query('.dd-control .autocomplete-box')).not.toBeNull();
    });
  });
});
