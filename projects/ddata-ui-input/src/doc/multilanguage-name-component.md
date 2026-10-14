# Multilanguage Name Component

Edits the `names` array of a model: every name has a language and a text.


## Usage

```typescript
import { LangInterface, MultilanguageNameInterface } from '@netdjw/ddata-ui-input';

langs: Array<LangInterface> = [
  { id: 1, name: 'magyar' },
  { id: 2, name: 'angol' }
];
product: MultilanguageNameInterface = { names: [{ lang_id: 1, name: 'Alma' }] };
```

```html
<dd-multilanguage-name [model]="product" [langs]="langs" [defaultLangId]="1"></dd-multilanguage-name>
```

- The first name is always visible and it can't be deleted.
- New names get the `defaultLangId` language.
- The additional names can be hidden, then the button shows their number.
- Deleting a name needs confirmation. The confirmation is shown inline in the row, so the package
  doesn't depend on `@netdjw/ddata-ui-dialog`.
- The `names` array is never mutated: after an add or a delete a new array is set on the model and
  emitted on `namesChange`.
- Every row has unique `id` / `name` attributes and (visually hidden) labels.


## API

| Parameter name | Type | Required | Default value | Description |
|----------------|------|----------|---------------|-------------|
| `model` | `MultilanguageNameInterface \| null` | yes | `null` | The model with the `names` array. |
| `langs` | `Array<LangInterface>` | yes | `[]` | The selectable languages. |
| `defaultLangId` | `ID` | no | `1` | The language of a new name. |
| `placeholder` | `string` | no | `Név` | Placeholder of the name inputs. |
| `title` | `string` | no | `Név` | Title and label of the name inputs. |
| `langLabel` | `string` | no | `Nyelv` | Label of the language selects. |
| `addButtonText` | `string` | no | `Új nyelv hozzáadása` | |
| `hideButtonText` | `string` | no | `Nyelvek elrejtése` | |
| `showButtonText` | `string` | no | `További elérhető nyelvek száma` | |
| `deleteButtonText` | `string` | no | `Név törlése` | |
| `confirmText` | `string` | no | `Biztos törölni szeretné a nevet?` | |
| `confirmButtonText` | `string` | no | `Törlés` | |
| `cancelButtonText` | `string` | no | `Mégsem` | |


### Output

| Parameter name | Type | Description |
|----------------|------|-------------|
| `namesChange` | `Array<NameInterface>` | The new `names` array after an add or a delete. |
