import { BaseModelInterface, FieldsInterface, ID } from 'ddata-core';
import { CountryInterface } from './country.interface';
import { TagInterface } from './tag.interface';

export interface AddressUIFieldsInterface {
  zip: string;
  settlement: string;
  street: string;
  country_id: number;
  tag_id: number; // for single select demo
  tags: Array<TagInterface>; // for multiple select demo
}

export interface AddressInterface
  extends AddressUIFieldsInterface,
    BaseModelInterface<AddressInterface>,
    FieldsInterface<AddressUIFieldsInterface> {
  id: ID;
  country: CountryInterface;
  tag: TagInterface; // for single select demo
}
