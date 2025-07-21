import { SearchModelFunctions } from './search-model-functions';
import { SearchInterface } from './search.interface';

export abstract class SearchAbstract extends SearchModelFunctions implements SearchInterface {
  // tslint:disable: variable-name
  readonly api_endpoint = '/search';
  readonly model_name = 'Search';
  searchText: string;

  init(data?: unknown): SearchInterface {
    const searchData = !!data ? data : {};

    super.init(searchData);

    this.initAsStringWithDefaults(['searchText'], data);

    return this;
  }

  prepareToSave(): unknown {
    return {
      term: !!this.searchText ? this.searchText : ''
    };
  }
}
