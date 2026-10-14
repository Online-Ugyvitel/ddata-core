import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ID } from '@netdjw/ddata-core';
import { ShowSearchParametersComponent } from './show-search-parameters.component';

describe('ShowSearchParametersComponent', () => {
  let component: ShowSearchParametersComponent;
  let fixture: ComponentFixture<ShowSearchParametersComponent>;
  const field = (label: string): { label: string; title: string; placeholder: string } => ({
    label,
    title: label,
    placeholder: label
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowSearchParametersComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ShowSearchParametersComponent);
    component = fixture.componentInstance;
  });

  it('should create without a model', () => {
    fixture.detectChanges();

    expect(component.datas).toEqual([]);
  });

  it('should list the filled search parameters', () => {
    component.langs = [{ id: 1 as ID, name: 'magyar' }];
    component.model = {
      fields: {
        name: field('Név'),
        empty: field('Üres'),
        tags: field('Címkék'),
        category_id: field('Kategória'),
        unit_id: field('Egység'),
        names: field('Nevek'),
        typeSettingSumma: field('Összesítés')
      },
      name: 'Alma',
      empty: '',
      tags: [],
      category_id: 3,
      category: { name: 'Gyümölcs' },
      unit_id: 0,
      names: [
        { lang_id: 1, name: 'Alma' },
        { lang_id: 9, name: 'Apple' },
        { lang_id: 1, name: '' }
      ],
      typeSettingSumma: 'skipped'
    } as never;
    fixture.detectChanges();

    expect(component.datas).toEqual([
      { name: 'Név', value: 'Alma' },
      { name: 'Kategória', value: 'Gyümölcs' },
      { name: 'Nevek', value: '(magyar) Alma' },
      { name: 'Nevek', value: '() Apple' }
    ]);
    expect(fixture.nativeElement.textContent).toContain('ÉS');
  });
});
