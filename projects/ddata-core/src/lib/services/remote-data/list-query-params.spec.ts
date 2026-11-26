import { HttpParams } from '@angular/common/http';
import { toQueryParams } from './list-query-params';

describe('toQueryParams', () => {
  it('returns the given parameters unchanged without a query', () => {
    const params = new HttpParams().append('fields[]', 'lang_id');

    expect(toQueryParams().keys()).toEqual([]);
    expect(toQueryParams(undefined, params)).toBe(params);
    expect(toQueryParams({}, params).toString()).toBe(params.toString());
  });

  it('converts the term, view and sort', () => {
    const params = toQueryParams({
      term: 'kiállítás',
      view: 'active',
      sort: { field: 'published_at', direction: 'desc' }
    });

    expect(params.get('term')).toBe('kiállítás');
    expect(params.get('view')).toBe('active');
    expect(params.get('sort[field]')).toBe('published_at');
    expect(params.get('sort[direction]')).toBe('desc');
  });

  it('leaves out an empty term, view and sort field and a missing sort direction', () => {
    const params = toQueryParams({
      term: '',
      view: '',
      sort: { field: 'name' } as never
    });

    expect(params.keys()).toEqual(['sort[field]']);
    expect(toQueryParams({ sort: { field: '', direction: 'asc' } }).keys()).toEqual([]);
  });

  it('repeats a list filter per item and sends scalar filters once', () => {
    const params = toQueryParams({
      filters: { lang_id: [1, 2], title: 'news', category_id: 4 }
    });

    expect(params.getAll('filters[lang_id][]')).toEqual(['1', '2']);
    expect(params.getAll('filters[title]')).toEqual(['news']);
    expect(params.getAll('filters[category_id]')).toEqual(['4']);
  });

  it('sends booleans as 1 or 0 and null as an empty value, also inside a range', () => {
    const params = toQueryParams({
      filters: {
        is_inactive: true,
        is_featured: false,
        deleted_at: null,
        published_at: ['2026-01-01 00:00', null]
      }
    });

    expect(params.get('filters[is_inactive]')).toBe('1');
    expect(params.get('filters[is_featured]')).toBe('0');
    expect(params.get('filters[deleted_at]')).toBe('');
    expect(params.getAll('filters[published_at][]')).toEqual(['2026-01-01 00:00', '']);
  });

  it('skips undefined filter values and sends nothing for an empty list', () => {
    const params = toQueryParams({ filters: { lang_id: [], status: undefined } });

    expect(params.keys()).toEqual([]);
  });
});
