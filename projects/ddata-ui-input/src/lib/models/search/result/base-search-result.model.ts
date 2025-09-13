import { SearchResult } from './search-result-concrete.model';
import { SearchResultInterface } from './search-result.interface';

export class BaseSearchResult extends SearchResult implements SearchResultInterface {
  // only for prevent undefined values
}
