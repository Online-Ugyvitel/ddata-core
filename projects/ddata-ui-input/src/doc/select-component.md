# Select Component

A select UI form element with advanced options.


## Usage

```html
<dd-select [items]="my_selectable_elements_array" [model]="my_custom_model" field="is_inactive"></dd-select>
```


## API

| Parameter name | Type | Required | Default value | Description |
|----------------|------|----------|---------------|-------------|
| `model` | `BaseModelInterface<any> & FieldsInterface<any>` | yes | `new BaseModel()` | The model what you want to handle. |
| `field` | `string` | yes | `isValid` | The model's field what you want to handle. |


## Examples

### Multiple select usage

In component ts file:

```typescript
import { DialogContentWithOptionsInterface } from '@netdjw/ddata-ui-input';

@Component({
  selector: 'app-my-custom-create-edit',
  templateUrl: './my-custom-create-edit.component.html',
  styleUrls: ['./my-custom-create-edit.component.scss']
})
export class MyCustomCreateEditComponent extends BaseCreateEditComponent<MyCustomModelInterface> implements OnInit {
  products: ProductInterface[] = [];
  dialogSettings: DialogContentWithOptionsInterface = {
    createEditComponent: ProductCreateEditComponent,
    createEditOptions: {},
    listComponent: ProductListComponent,
    listOptions: {
      models: this.products,
      isModal: true,
      multipleSelectEnabled: true,
      isSelectionList: true,
      loadData: false,
      selectedElements: this.model.products,
    },
  };
```

And in html file:

```html
<dd-select
  [items]="products"
  [model]="model"
  field="products"
  [multipleSelect]="true"
  [dialogSettings]="dialogSettings"></dd-select>
```
