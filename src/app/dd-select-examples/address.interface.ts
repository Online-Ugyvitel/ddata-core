import { BaseModelInterface, ID } from '../../../projects/ddata-core/src/public-api';
import { CountryInterface } from './country.interface';
import { TagInterface } from './tag.interface';

export interface AddressUIFieldsInterface {
  zip: string;
  settlement: string;
  street: string;
  country_id: number;
  tag_id: number; // for single select demo
  tags: TagInterface[]; // for multiple select demo
}

export interface AddressInterface
  extends
    AddressUIFieldsInterface,
    BaseModelInterface<AddressInterface> {
      id: ID;
      country: CountryInterface;
      tag: TagInterface; // for single select demo
    }
