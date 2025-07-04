import { BaseModelInterface, ID, SelectableInterface } from '../../../projects/ddata-core/src/public-api';

export interface CountryUIFieldsInterface {
  name: string;
}

export interface CountryInterface
  extends
    CountryUIFieldsInterface,
    BaseModelInterface<CountryInterface>,
    SelectableInterface {
      id: ID;
    }
