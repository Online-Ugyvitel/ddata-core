import { Search } from './search-concrete.model';
import { SearchInterface } from './search.interface';

export class BaseSearch extends Search implements SearchInterface {
  // only for prevent undefined values
}
