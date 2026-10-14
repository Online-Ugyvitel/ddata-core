# Autocomplete Box Component

A text input that asks the server for suggestions while the user types.


## Usage

```html
<dd-autocomplete-box
  [(model)]="tag"
  field="name"
  [autocomplete]="true"
  [autocompleteService]="tagService"
  (selected)="onTagSelected($event)"
></dd-autocomplete-box>
```

`tagService` is a `ProxyServiceInterface` (for example from `ProxyFactoryService`). While the user
types, after 300 ms of silence the component calls `searchWithoutPaginate({ term })` once. The same
value doesn't start a new request, and a newer value cancels the running request, so only the result
of the last request is shown. A failed request is logged and shows no suggestions.

Keyboard: `ArrowDown` / `ArrowUp` moves in the list (and writes the suggestion's `name` into the
field), `Enter` selects the highlighted suggestion (and prevents the form submit only in this case),
`Escape` closes the list. A click on a suggestion selects it, blur or a click outside closes the list.

The selected suggestion replaces the model: it is emitted on `modelChange` (so `[(model)]` works) and
on `selected`.


## `dd-autocomplete-box` or `dd-autocomplete-select`?

The two components look similar, but they serve different purposes, so both are kept:

| | `dd-autocomplete-box` | `dd-autocomplete-select` |
|---|---|---|
| Source of the options | server, `autocompleteService.searchWithoutPaginate()` | local `items` array |
| Value of the field | the free text typed by the user | the `valueField` (id) of the selected item |
| Selection | replaces the whole model | sets the field only |

Use `dd-autocomplete-select` to pick one of a known list, use `dd-autocomplete-box` for a free text
field where existing records can be suggested (for example tags).


## API

| Parameter name | Type | Required | Default value | Description |
|----------------|------|----------|---------------|-------------|
| `model` | `BaseModel \| null` | yes | `null` | The model what you want to handle. Nothing is rendered without model. |
| `field` | `string` | yes | `''` | The model's field what you want to handle. |
| `autocomplete` | `boolean` | no | `false` | Turns on the suggestions. Without it the component is a simple validated input. |
| `autocompleteService` | `ProxyServiceInterface` | if `autocomplete` | `null` | The service that gives the suggestions. |
| `append` | `string` | no | field's `append` | Text in input's append `div` |
| `prepend` | `string` | no | field's `prepend` | Text in input's prepend `div` |
| `disabled` | `boolean` | no | `false` | Input is disabled or not. |
| `type` | `string` | no | `text` | Input field `type` property. |
| `inputClass` | `string` | no | `form-control` | Class of `input` element. |
| `labelClass` | `string` | no | `col-12 col-md-3 px-0 col-form-label` | Class of `label` element. |
| `inputBlockClass` | `string` | no | `col-12 d-flex px-0` | Class of input block element. |
| `inputBlockExtraClass` | `string` | no | `col-md-9` | Apply this classes on input block when `showLabel` is `true`. |
| `showLabel` | `boolean` | no | `true` | Label is visible or not. |
| `autoFocus` | `boolean` | no | `false` | Set focus on the input after render. |
| `loadingText` | `string` | no | `Betöltés...` | Screen reader text of the loading indicator. |


### Output

| Parameter name | Type | Description |
|----------------|------|-------------|
| `modelChange` | `BaseModel` | The selected suggestion, the new model. |
| `selected` | `AutocompleteSuggestion` | The selected suggestion. |


## Accessibility

With `autocomplete` the input is a `combobox` (`aria-autocomplete="list"`, `aria-expanded`,
`aria-controls`, `aria-activedescendant`), the list is a `listbox` with `option` items, and the
loading indicator is a `status` with a screen reader text.
