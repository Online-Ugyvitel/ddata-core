// tslint:disable: variable-name
import { faCog, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { BaseModel, ID } from 'ddata-core';
import { IconSetInterface } from '../icon-set/icon-set.interface';

export class SearchModelFunctions extends BaseModel {
  id: ID;
  name: string;
  description: string;
  type: string;
  found_model_name: string;
  icon: IconDefinition;
  url: string;
  icons: IconSetInterface = {
    cog: faCog
  };

  init(data?: unknown): unknown {
    const searchData = !!data ? data : {};

    this.initAsNumberWithDefaults(['id'], searchData);

    this.initAsStringWithDefaults(['name', 'description', 'type', 'found_model_name'], searchData);

    this.icon = this.setIcon(this.type);

    this.url = this.setUrl(this.type);

    return this;
  }

  protected setUrl(type: string): string {
    return type.replace(new RegExp(/_/, 'g'), '/');
  }

  protected setIcon(type: string): IconDefinition {
    if (!type) {
      return this.icons.cog;
    }

    return this.icons[type] ?? this.icons.cog;
  }
}
