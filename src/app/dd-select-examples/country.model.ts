import { BaseModel } from '../../../projects/ddata-core/src/public-api';
import { CountryInterface } from './country.interface';

export class Country extends BaseModel implements CountryInterface {
  readonly api_endpoint = '/api/country';

  readonly model_name = 'Country';

  name: string;

  is_selected = false;

  init(data?: Partial<CountryInterface>): CountryInterface {
    const incoming = data ?? {};

    this.initAsNumberWithDefaults(['id'], incoming);

    this.initAsStringWithDefaults(['name'], incoming);

    return this;
  }
}
