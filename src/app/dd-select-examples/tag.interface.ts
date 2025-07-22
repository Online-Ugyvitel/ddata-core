import {
  BaseModelInterface,
  ID,
  SelectableInterface
} from '../../../projects/ddata-core/src/public-api';

export interface TagUIFieldsInterface {
  name: string;
}

export interface TagInterface
  extends TagUIFieldsInterface,
    BaseModelInterface<TagInterface>,
    SelectableInterface {
  id: ID;
}
