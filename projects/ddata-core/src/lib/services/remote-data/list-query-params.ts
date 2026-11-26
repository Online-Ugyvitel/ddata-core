import { HttpParams } from '@angular/common/http';
import { ListFilterValue, ListQueryInterface } from '../../models/list/list-query.interface';
/**
 * Query string form of a filter value: a boolean is sent as 1 or 0, a `null` as an empty value, which the
 * backend reads as `null` (an open end of a range).
 */
const toParamValue = (value: string | number | boolean | null): string => {
  if (value === null) {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }

  return String(value);
};
const appendFilter = (params: HttpParams, field: string, value: ListFilterValue): HttpParams => {
  if (value === undefined) {
    return params;
  }

  if (Array.isArray(value)) {
    return value.reduce(
      (result: HttpParams, item: string | number | null) =>
        result.append(`filters[${field}][]`, toParamValue(item)),
      params
    );
  }

  return params.append(`filters[${field}]`, toParamValue(value));
};

/**
 * Converts a list query into the query parameters of the GET list endpoints (`views`, `facets`, `neighbors`):
 * `term`, `view`, `sort[field]`, `sort[direction]`, `filters[<field>]` and, for a list value,
 * `filters[<field>][]` repeated per item. Missing and empty parts are left out.
 *
 * @param query the list query, may be undefined
 * @param params the parameters to extend
 */
export const toQueryParams = (
  query?: ListQueryInterface,
  params: HttpParams = new HttpParams()
): HttpParams => {
  let result = params;

  if (!query) {
    return result;
  }

  if (query.term) {
    result = result.append('term', query.term);
  }

  if (query.view) {
    result = result.append('view', query.view);
  }

  if (query.sort?.field) {
    result = result.append('sort[field]', query.sort.field);

    if (query.sort.direction) {
      result = result.append('sort[direction]', query.sort.direction);
    }
  }

  Object.keys(query.filters ?? {}).forEach((field: string) => {
    result = appendFilter(result, field, query.filters[field]);
  });

  return result;
};
