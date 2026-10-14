import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ID } from '@netdjw/ddata-core';
import { DdataUiModule } from '../../../ddata-ui.module';
import { MultilanguageNameInterface, NameInterface } from '../../../models/lang/lang.interface';
import { MultilanguageNameComponent } from './multilanguage-name.component';

describe('MultilanguageNameComponent', () => {
  let component: MultilanguageNameComponent;
  let fixture: ComponentFixture<MultilanguageNameComponent>;
  let model: MultilanguageNameInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DdataUiModule]
    }).compileComponents();
    fixture = TestBed.createComponent(MultilanguageNameComponent);
    component = fixture.componentInstance;
    model = { names: [{ lang_id: 1 as ID, name: 'Alma' }] };
    component.model = model;
    component.langs = [
      { id: 1 as ID, name: 'magyar' },
      { id: 2 as ID, name: 'angol' }
    ];
  });

  it('should list the languages', () => {
    fixture.detectChanges();
    const options = Array.from(fixture.nativeElement.querySelectorAll('option')).map(
      (option: HTMLOptionElement) => option.textContent.trim()
    );

    expect(options).toEqual(['magyar', 'angol']);
  });

  it('addName() should add a name with the default language', () => {
    component.addName();
    component.defaultLangId = 2 as ID;
    component.addName();

    expect(model.names.map((name) => name.lang_id)).toEqual([1, 1, 2]);
    expect(model.names[1].name).toBe('');
  });

  it('deleteName() should delete only the given name', () => {
    const apple: NameInterface = { lang_id: 2 as ID, name: 'Apple' };
    const pear: NameInterface = { lang_id: 2 as ID, name: 'Pear' };

    model.names.push(apple, pear);

    component.deleteName(apple);

    expect(model.names.map((name) => name.name)).toEqual(['Alma', 'Pear']);
  });

  it('deleteName() should not delete anything when the name is not in the list', () => {
    component.deleteName({ lang_id: 1 as ID, name: 'Other' });
    component.deleteName(null);

    expect(model.names.length).toBe(1);
  });

  it('confirmDelete() should delete the selected name only after confirmation', () => {
    const apple: NameInterface = { lang_id: 2 as ID, name: 'Apple' };

    model.names.push(apple);
    component.nameToDelete = apple;
    component.confirmDelete(false);

    expect(model.names.length).toBe(2);
    expect(component.nameToDelete).toBeNull();

    component.nameToDelete = apple;
    component.confirmDelete(true);

    expect(model.names).toEqual([{ lang_id: 1, name: 'Alma' }]);
    expect(component.nameToDelete).toBeNull();
  });

  it('getTotal() should return the number of the additional names', () => {
    expect(component.getTotal()).toBe(0);

    component.addName();
    component.addName();

    expect(component.getTotal()).toBe(2);
  });
});
