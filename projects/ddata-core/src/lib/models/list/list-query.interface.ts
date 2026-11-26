import { ID } from '../base/base-data.type';

export type ListSortDirection = 'asc' | 'desc';

/**
 * A filter value of a list query: a scalar (equality or like), a list of scalars (IN condition) or a
 * `[from, to]` range where an open end is `null`.
 */
export type ListFilterValue = string | number | boolean | null | Array<string | number | null>;

export interface ListSortInterface {
  field: string;
  direction: ListSortDirection;
}

/**
 * The body of `POST {resource}/search` and the query of the views, facets and neighbors endpoints.
 */
export interface ListQueryInterface {
  term?: string;
  filters?: { [field: string]: ListFilterValue };
  view?: string;
  sort?: ListSortInterface;
}

export interface ListViewInterface {
  key: string;
  label: string;
  count: number;
}

export interface ListFacetValueInterface {
  value: string | number;
  label: string;
  count: number;
}

export interface ListFacetsInterface {
  [field: string]: Array<ListFacetValueInterface>;
}

export interface ListNeighborsInterface {
  previous_id: ID | null;
  next_id: ID | null;
  position: number | null;
  total: number;
}

export interface BulkUpdateValuesInterface {
  [field: string]: unknown;
}
