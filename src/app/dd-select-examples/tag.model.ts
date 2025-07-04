import { BaseModel, TabInterface } from '../../../projects/ddata-core/src/public-api';
import { TagInterface } from './tag.interface';

export class Tag extends BaseModel implements TagInterface {
  readonly api_endpoint = '/api/tag';

  readonly model_name = 'Tag';

  name: string;

  is_selected = false;

  init(data: any): TagInterface {
    const incoming = !!data ? data : {};

    this.initAsNumberWithDefaults(['id'], incoming);

    this.initAsStringWithDefaults(['name'], incoming);

    return this;
  }
}
