import { ID } from '@netdjw/ddata-core';

export interface LangInterface {
  id: ID;
  name: string;
}

export interface NameInterface {
  lang_id: ID;
  name: string;
}

export interface MultilanguageNameInterface {
  names: Array<NameInterface>;
}
