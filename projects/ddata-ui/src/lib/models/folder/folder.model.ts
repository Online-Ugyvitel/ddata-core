import {
  BaseModel,
  BaseModelInterface,
  Description,
  FieldContainerInterface,
  ID,
  URI,
  ValidationRuleInterface
} from 'ddata-core';
import { FolderInterface, FolderUIFieldsInterface } from './folder.interface';
import {
  parent_id,
  name,
  description,
  is_highlighted,
  uri,
  title
} from '../../i18n/hu/folder.lang';

export class Folder
  extends BaseModel
  implements BaseModelInterface<FolderUIFieldsInterface>, FolderInterface
{
  readonly api_endpoint = '/folder';
  readonly model_name = 'Folder';
  id: ID;
  parent_id: ID;
  name: string;
  description: Description;
  is_highlighted: boolean;
  uri: URI;
  title: 'Mappa';

  validationRules: ValidationRuleInterface = {
    parent_id: ['required', 'integer'],
    name: ['required', 'string'],
    description: ['nullable', 'string'],
    is_highlighted: ['nullable'],
    uri: ['required', 'string']
  };

  fields: FieldContainerInterface<FolderUIFieldsInterface> = {
    parent_id,
    name,
    description,
    is_highlighted,
    uri,
    title
  };

  init(data: unknown): FolderInterface {
    const safeData = !!data ? (data as Record<string, unknown>) : {};

    this.id = safeData.id ? (safeData.id as ID) : (0 as ID);
    this.parent_id = safeData.parent_id ? (safeData.parent_id as ID) : (0 as ID);
    this.description = safeData.description
      ? (safeData.description as Description)
      : ('' as Description);
    this.name = safeData.name ? (safeData.name as string) : '';
    this.is_highlighted = safeData.is_highlighted ? true : false;
    this.uri = safeData.uri ? (safeData.uri as URI) : ('' as URI);

    return this;
  }

  prepareToSave(): Record<string, unknown> {
    return {
      id: this.id ? this.id : 0,
      parent_id: this.parent_id ? this.parent_id : 0,
      description: this.description ? this.description : '',
      name: this.name ? this.name : '',
      is_highlighted: this.is_highlighted ? true : false,
      uri: this.uri ? this.uri : ''
    };
  }
}
