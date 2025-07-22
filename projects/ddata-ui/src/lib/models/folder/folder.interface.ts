import {
  BaseModelWithoutTypeDefinitionInterface,
  Description,
  FieldsInterface,
  ID,
  URI
} from 'ddata-core';

export interface FolderUIFieldsInterface {
  parent_id: ID;
  name: string;
  description: Description;
  is_highlighted: boolean;
  uri: URI;
  title: string;
}
export interface FolderInterface
  extends FolderUIFieldsInterface,
    BaseModelWithoutTypeDefinitionInterface,
    FieldsInterface<FolderUIFieldsInterface> {
  id: ID;
}
