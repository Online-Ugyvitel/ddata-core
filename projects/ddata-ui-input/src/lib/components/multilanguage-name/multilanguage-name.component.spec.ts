import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ID } from '@netdjw/ddata-core';
import { MultilanguageNameInterface, NameInterface } from '../../models/lang/lang.interface';
import { MultilanguageNameComponent } from './multilanguage-name.component';

describe('MultilanguageNameComponent', () => {
  let component: MultilanguageNameComponent;
  let fixture: ComponentFixture<MultilanguageNameComponent>;
  let model: MultilanguageNameInterface;
  const element = (): HTMLElement => fixture.nativeElement;
  const all = <T extends Element>(selector: string): Array<T> =>
    Array.from(element().querySelectorAll<T>(selector));
  const buttons = (): Array<HTMLButtonElement> => all<HTMLButtonElement>('button');
  const buttonByText = (text: string): HTMLButtonElement =>
    buttons().find((button) => button.textContent.includes(text));
  const render = async (): Promise<void> => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultilanguageNameComponent],
      imports: [FormsModule, FontAwesomeModule]
    }).compileComponents();
    fixture = TestBed.createComponent(MultilanguageNameComponent);
    component = fixture.componentInstance;
    model = { names: [{ lang_id: 1 as ID, name: 'Alma' }] };
    fixture.componentRef.setInput('model', model);
    fixture.componentRef.setInput('langs', [
      { id: 1 as ID, name: 'magyar' },
      { id: 2 as ID, name: 'angol' }
    ]);
  });

  it('should list the languages', async () => {
    await render();
    const options = all<HTMLOptionElement>('option').map((option) => option.textContent.trim());

    expect(options).toEqual(['magyar', 'angol']);
  });

  it('should bind the language and the name in both directions', async () => {
    await render();
    const select = element().querySelector('select');
    const input = element().querySelector<HTMLInputElement>('input');

    expect(select.selectedIndex).toBe(0);
    expect(input.value).toBe('Alma');

    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));
    input.value = 'Apple';
    input.dispatchEvent(new Event('input'));

    // the language id keeps its type
    expect(model.names[0]).toEqual({ lang_id: 2, name: 'Apple' });

    model.names[0].name = 'Körte';
    fixture.componentRef.setInput('model', { names: [...model.names] });
    await render();

    expect(element().querySelector<HTMLInputElement>('input').value).toBe('Körte');
  });

  it('should render unique ids, names and labels for every row', async () => {
    model.names.push({ lang_id: 2 as ID, name: 'Apple' });
    await render();
    const ids = all('select, input').map((field) => field.id);
    const names = all('select, input').map((field) => field.getAttribute('name'));
    const labels = all<HTMLLabelElement>('label').map((label) => label.htmlFor);

    expect(new Set(ids).size).toBe(4);
    expect(names).toEqual(ids);
    expect(labels).toEqual(ids);
    expect(all('label').map((label) => label.textContent.trim())).toEqual([
      'Nyelv',
      'Név',
      'Nyelv',
      'Név'
    ]);
  });

  it('should render different ids in two instances', async () => {
    await render();
    const other = TestBed.createComponent(MultilanguageNameComponent);

    other.componentRef.setInput('model', { names: [{ lang_id: 1 as ID, name: '' }] });
    other.detectChanges();

    expect(other.nativeElement.querySelector('input').id).not.toBe(
      element().querySelector('input').id
    );
  });

  it('addName() should add a name with the default language as a new array', async () => {
    const original = model.names;
    const emitted: Array<Array<NameInterface>> = [];

    component.namesChange.subscribe((names) => emitted.push(names));
    await render();

    buttonByText('Új nyelv hozzáadása').click();
    fixture.componentRef.setInput('defaultLangId', 2);
    component.addName();
    await render();

    expect(model.names).not.toBe(original);
    expect(original.length).toBe(1);
    expect(model.names.map((name) => name.lang_id)).toEqual([1, 1, 2]);
    expect(model.names[1].name).toBe('');
    expect(emitted.length).toBe(2);
    expect(emitted[1]).toBe(model.names);
    expect(all('input').length).toBe(3);
  });

  it('should not render a delete button for the first name', async () => {
    model.names.push({ lang_id: 2 as ID, name: 'Apple' });
    await render();

    expect(all('button[title="Név törlése"]').length).toBe(1);
  });

  it('should delete the selected name only after confirmation', async () => {
    const apple: NameInterface = { lang_id: 2 as ID, name: 'Apple' };
    const pear: NameInterface = { lang_id: 2 as ID, name: 'Pear' };

    model.names.push(apple, pear);
    await render();

    all<HTMLButtonElement>('button[title="Név törlése"]')[0].click();
    await render();

    expect(component.nameToDelete).toBe(apple);
    expect(element().querySelector('[role="alert"]').textContent).toContain(
      'Biztos törölni szeretné a nevet?'
    );
    expect(model.names.length).toBe(3);

    buttonByText('Törlés').click();
    await render();

    expect(model.names).toEqual([{ lang_id: 1, name: 'Alma' }, pear]);
    expect(component.nameToDelete).toBeNull();
    expect(element().querySelector('[role="alert"]')).toBeNull();
    expect(all('input').map((input: HTMLInputElement) => input.value)).toEqual(['Alma', 'Pear']);
  });

  it('should not change anything when the deletion is cancelled', async () => {
    const apple: NameInterface = { lang_id: 2 as ID, name: 'Apple' };

    model.names.push(apple);
    await render();

    all<HTMLButtonElement>('button[title="Név törlése"]')[0].click();
    await render();
    buttonByText('Mégsem').click();
    await render();

    expect(model.names.length).toBe(2);
    expect(component.nameToDelete).toBeNull();
  });

  it('deleteName() should delete only the given one from the same named names', () => {
    const first: NameInterface = { lang_id: 2 as ID, name: 'Apple' };
    const second: NameInterface = { lang_id: 2 as ID, name: 'Apple' };

    model.names.push(first, second);
    component.deleteName(second);

    expect(model.names.length).toBe(2);
    expect(model.names[1]).toBe(first);
  });

  it('deleteName() should not delete the first name or a name not in the list', () => {
    const emitted = vi.fn();

    component.namesChange.subscribe(emitted);
    component.deleteName(model.names[0]);
    component.deleteName({ lang_id: 1 as ID, name: 'Other' });
    component.deleteName(null);

    expect(model.names.length).toBe(1);
    expect(emitted).not.toHaveBeenCalled();
  });

  it('should hide and show the additional names', async () => {
    model.names.push({ lang_id: 2 as ID, name: 'Apple' }, { lang_id: 2 as ID, name: 'Pear' });
    await render();
    const toggle = buttonByText('Nyelvek elrejtése');

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(all('input').length).toBe(3);

    toggle.click();
    await render();

    expect(all('input').length).toBe(1);
    expect(toggle.textContent.trim()).toBe('További elérhető nyelvek száma: 2');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    await render();

    expect(all('input').length).toBe(3);
  });

  it('should not render the toggle button for one name', async () => {
    await render();

    expect(buttons().length).toBe(1);
  });

  it('getTotal() should return the number of the additional names', () => {
    expect(component.getTotal()).toBe(0);

    component.addName();
    component.addName();

    expect(component.getTotal()).toBe(2);

    model.names = [];

    expect(component.getTotal()).toBe(0);
  });

  it('should render many names', async () => {
    model.names = Array.from({ length: 30 }, (_, index) => ({
      lang_id: 1 as ID,
      name: `Name ${index}`
    }));
    await render();

    expect(all('input').length).toBe(30);
    expect(all('button[title="Név törlése"]').length).toBe(29);
    expect(buttonByText('Nyelvek elrejtése')).toBeTruthy();
  });

  it('should handle an empty names array', async () => {
    model.names = [];
    await render();

    expect(all('input').length).toBe(0);

    buttonByText('Új nyelv hozzáadása').click();
    await render();

    expect(model.names).toEqual([{ lang_id: 1, name: '' }]);
    expect(all('input').length).toBe(1);
  });

  it('should handle a null model', async () => {
    fixture.componentRef.setInput('model', null);
    await render();

    expect(component.names).toEqual([]);
    expect(buttonByText('Új nyelv hozzáadása').disabled).toBe(true);

    component.addName();

    expect(component.names).toEqual([]);
  });

  it('should handle an empty language list and an unknown language id', async () => {
    fixture.componentRef.setInput('langs', []);
    model.names[0].lang_id = 99 as ID;
    await render();

    expect(all('option').length).toBe(0);
    expect(element().querySelector<HTMLInputElement>('input').value).toBe('Alma');
    expect(model.names[0].lang_id).toBe(99);
  });
});
