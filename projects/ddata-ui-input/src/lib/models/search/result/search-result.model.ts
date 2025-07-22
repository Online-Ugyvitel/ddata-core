import { SearchModelFunctions } from '../search-model-functions';
import { SearchResultInterface } from './search-result.interface';

export abstract class SearchResultAbstract
  extends SearchModelFunctions
  implements SearchResultInterface
{
  init(data?: unknown): SearchResultInterface {
    super.init(data);

    return this;
  }
}
