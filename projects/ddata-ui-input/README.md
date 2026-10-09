# DData UI Input

DData UI Input module, components, models & services

## Install

`npm install @netdjw/ddata-ui-input --save`

## Why?

Almost every project needs to handle different types of input fields. For example basic text input, date
and time input, select fields, textareas. And of course if you use input, you need to validate them.

This package gives you a really easy way to create inputs with validation and some basic UI features.

If you are familiar with `@netdjw/ddata-core` package you have models, like this:

```typescript
export class Post extends BaseModel implements PostInterface {
  readonly api_endpoint = '/post';
  readonly model_name = 'Post';
  id: ID;
  title: string;
  lead: string;
  content: string;
  public_from_date: ISODate;
  public_from_time: Time;
  is_on_top: boolean;

  init(): PostInterface {
    // ...
  }

  prepareToSave(): any {
    return {
      // ...
    };
  }
}
```

Then you can use in your template this components:

```html
<dd-input [model]="model" field="title"></dd-input>

<dd-textarea [model]="model" field="lead"></dd-textarea>

<dd-textarea [model]="model" field="content"></dd-textarea>

<dd-date [model]="model" field="public_from_date"></dd-date>

<dd-time [model]="model" field="public_from_time"></dd-time>

<dd-checkbox [model]="model" field="is_on_top">
```

And in the `ts` file:

```typescript
export class MyAwesomeComponent extends BaseCreateEditComponent<PostInterface> implements OnInit {

  constructor() {
    super(Post);
  }
}
```

The `BaseCreateEditComponent` gives you a super preset for your component. The input components gives
you the simlicity, two-way binding, validateable fields and some basic UI features, like date picker
and time picker if you need.


## Documentation

- [Checkbox Component](src/doc/checbox-component)
- [Color Component](src/doc/color-component)
- [Date Component](src/doc/date-component)
- [Input Component](src/doc/input-component)
- [Search Component](src/doc/search-component)
- [Select Component](src/doc/select-component)
- [Textarea Component](src/doc/textarea-component)
- [Time Component](src/doc/time-component)
