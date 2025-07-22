import { BaseModel, BaseModelInterface } from '../../../models/base/base-model.model';
import { SelectableInterface } from '../../../models/selectable/selectable.interface';
import { ID } from '../../../models/base/base-data.type';

// Test model that implements both BaseModelInterface and SelectableInterface
export class TestModel extends BaseModel implements SelectableInterface {
  id: ID = 0 as ID;
  is_selected: boolean = false;
  api_endpoint = '/test';
  model_name = 'TestModel';

  init(data: any = {}): TestModel {
    this.id = (data.id || 0) as ID;
    this.is_selected = data.is_selected || false;

    return this;
  }

  prepareToSave(): any {
    return {
      id: this.id,
      is_selected: this.is_selected
    };
  }
}