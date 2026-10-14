# Date Component

A date input UI form element with date picker.


## Usage

```html
<dd-input-date [model]="my_custom_model" field="is_inactive" [moment]="moment"></dd-input-date>
```


## API

| Parameter name | Type | Required | Default value | Description |
|----------------|------|----------|---------------|-------------|
| `model` | `BaseModelInterface<any> & FieldsInterface<any>` | yes | `new BaseModel()` | The model what you want to handle. |
| `field` | `string` | yes | `isValid` | The model's field what you want to handle. |
| `moment` | moment.js instance | yes | `moment` | You need to send in a moment.js instance with your preconfigured settings. |
| `append` | `string` | no | `''` | Text in input's append `div` |
| `prepend` | `string` | no | `''` | Text in input's prepend `div` |
| `labelText` | `string` | no | `''` | Text in `label` |
| `disabled` | `boolean` | no | `false` | Input is diabled or not. |
| `inputClass` | `string` | no | `form-control` | Class of `input` element. |
| `labelClass` | `string` | no | `col-12 col-md-3 px-0 col-form-label` | Class of `label` element. |
| `inputBlockClass` | `string` | no | `col-12 d-flex px-0` | Class of input block<sup>[1]</sup> element. |
| `inputBlockExtraClass` | `string` | no | `col-md-9` | Apply this classes n input block when `showLabel` is `true`. |
| `showLabel` | `boolean` | no | `true` | Label is visible or not. |
| `showIcon` | `boolean` | no | `true` | Calendar icon is visible or not. |
| `autoApply` | `boolean` | no | `true` | Apply clicked date automatic on click. |
| `autoFocus` | `boolean` | no | `false` | Set autofocus on the element. |
| `singleDatePicker` | `boolean` | no | `true` | If `true` it will show as single datepicker. If `false` it will show a date range picker. |
| `isViewOnly` | `boolean` | no | `false` | If `true` the component show only a `div` element instead of `input`. |
| `viewOnlyClass` | `string` | no | `form-control border-0 bg-light` | The `div` element's class what shown if `isViewOnly` is `true`. |
| `buttonClass` | `string` | no | `input-group-prepend btn btn-light mb-0` | Class of the button with calendar icon. |
| `wrapperClass` | `string` | no | `d-flex flex-wrap` | Class of the wrapper `div` element. It contains the `label` and the `div.input-group` elements. |
| `format` | `string` | no | `YYYY-MM-DD` | Date format, [details here](https://github.com/fetrarij/ngx-daterangepicker-material) |
| `min` | `Date \| string \| null` | no | `null` | Earliest allowed date (inclusive). A string is parsed in `format`. Earlier dates can't be picked; a typed earlier date is not written to the model and the field is marked invalid. An invalid value is ignored with a console warning. |
| `max` | `Date \| string \| null` | no | `null` | Latest allowed date (inclusive), works the same way as `min`. |
| `separator` | `string` | no | `-` | Data separator string. |
| `labelApply` | `string` | no | `OK` | Label of "apply" button on datepicker. |
| `labelCancel` | `string` | no | `Cancel` | Label of "cancel" button on datepicker. |
| `position` | `string` | no | `center` | Position the calendar from the input element. Possible values: `left`, `center`, `right`. |
| `direction` | `string` | no | `down` | Position the calendar to the up or down of the calendar. Possible values: `up`, `down`. |
| `locale` | [`LocaleConfig`](https://github.com/fetrarij/ngx-daterangepicker-material#locale) | no | | Configure localization. If you don't set this property, it will be generated based on this properties: `format`, `separator`, `cancelLabel`, `applyLabel`, `moment` and your moment.js settings. |


### Output

| Parameter name | Type | Description |
|----------------|------|-------------|
| `changed` | `boolean` | Fire when `field` is changed inside the component. |


### Notes

The component prevent the browser's autosuggestion / autofill feature.

The `changed` output fires only when the input value is valid.

If you don't want to do anything - just update your model's field value - you don't need to catch the `changed` event. The
component receive only a refrence to your data model, and when user changes the input it's cause the model field updates via
˙ngModel` two-way binding.


## See also

- [Ngx DateRangePicker MD](https://github.com/fetrarij/ngx-daterangepicker-material)
- [moment.js](https://momentjs.com/)
- Validator Service
- `iso_date` validation rule
