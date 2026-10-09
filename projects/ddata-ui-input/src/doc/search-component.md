# Search Component

A complex search input UI form element.

With this component you can put a beautiful search input into your application with a multi-data search function. It gives your users a feeling like using a global search function.


## Usage

```html
<dd-search></dd-search>
```


## API

| Parameter name | Type | Required | Default value | Description |
|----------------|------|----------|---------------|-------------|
| `model` | `SearchInterface<any> & FieldsInterface<any>` | yes | `new BaseModel()` | The model what you want to handle. |
| `pageNumber` | `number` | no | `0` | Starter page on search results. |
| `service` | `ProxyServiceInterface<SearchInterface>` | no | [see below](#Service) | A proxy service set up with your custom `Search` model. |

### Search model & interface

This library contains a `SearchInterface` and a `Search` model as an abstract class. The reason is an abstract class is that you MUST be define your custom data types and icons for it.

Here is what you need to do to implement your custom `Search` model:

```typescript
export class CustomSearch extends Search implements SearchInterface {
  icons: IconSetInterface = {
    cog: faCog,
    file: faFile,
    user: faUser,
    // more icon definition here...
  };
}
```

The `icons` field MUST have `cog` property. Other things are optional.

The important thing with `icons` field's properties is this: you need to name your icons exactly same as it's called the type of data at your backend's type property on the result.

If you need to your backend, you can overwrite the `prepareToSave()` method too.

In basic situation the `preapreToSave()` method will provide this JSON object to your backend:

```JSON
{
  "term": "your intput field's content"
}
```


### Service

The `service` MUST be an instance of `ProxyServiceInterface<SearchInterface>`, which means you need to have a `Search` model what based on `SearchInterface`. The `ProxyServiceInterface` is defined in `@netdjw/ddata-core` library.

This service will handle your requests and results with backend.

Results MUST be coming as a `PaginateInterface`, which is defined in `@netdjw/ddata-core` library.

The `PaginateInterface` MUST contains a `data` filed with the results. The result MUST be an instance of `SearchResultInterface`.

### SearchResult model & interface

This library contains a `SearchResultInterface` and a `SearchResult` model as an abstract class. The reason is an abstract class is that you MUST be define your custom data types and icons for it.

Here is what you need to do to implement your custom `SearchResult` model:

```typescript
export class CustomSearchResult extends SearchResult implements SearchResultInterface {
  icons: IconSetInterface = {
    cog: faCog,
    file: faFile,
    user: faUser,
    // more icon definition here...
  };
}
```

The `icons` field MUST have `cog` property. Other things are optional.

The important thing with `icons` field's properties is this: you need to name your icons exactly same as it's called the type of data at your backend's type property on the result.

### What kind of datas should return from backend after search?

The `SearchResultInterface` define this fields to your result:

| Name | Type | Description |
|---|---|---|
| `id` | `number` | Your unique ID of your found data item. |
| `name` | `string` | The name of the found data. If there isn't a `name` filed, you must fill this field with any other uniqueish data, what the user will see. |
| `description` | `string` | You can put here any string or special string what the [`description` pipe](#Description_pipe) can parse. |
| `type` | `string` | This type define the type of your data instance. This string must be exactly the same as one of the property name of `icons` field. |
| `found_model_name` | `string` | The name of your TypeScript model names. For example if you're using a `CompanyShop` model in your application, this could be `CompanyShop` as string. |
| `url` | `string` | The URL where your frontend will navigate when user clicks the result. |


# Description pipe

The `DescriptionPipe` can handle plain text descriptions or some specific cases. You can extend the capability of this pipe if you overwrite it.

The description pipe can handle this structure of the result:

```
some text|tel:+36123456789|email:custom@domain.test|url:https://domain.test|description:my fancy description|other plain text
```

In this case the Description pipe will transform the text to this code:

```html
some text
<a href="tel:+36123456789" class="mr-3">+36123456789</a>
<a href="mailto:custom@domain.test" class="mr-3">custom@domain.test</a>
<a href="https://domain.test" class="mr-3" target="_blank">https://domain.test</a>
<span class="description">my fancy description</span>
other plain text
```

The result will be in a single line, separated by spaces.

# Example of search and result

## Search

In this example you search the string "Coding". This will be send to your backend:

```JSON
{
  "term": "Coding"
}
```

### Result

In this example you get a result with two companies, one employee and one note.

```JSON
[
  {
    "id": 1,
    "name": "The Best Coding Company",
    "description": "tel:+36456789123|email:info@best-coding-comapany.com|description:They are the bests in Angular",
    "type": "company",
    "found_model_name": "Company",
    "url": "http://my-project.test/company/edit/1"
  },
  {
    "id": 42,
    "name": "PHP Coding Team",
    "description": "tel:+421456789123|email:info@php-coding-team.com|url:http://php-coding-team.example.com",
    "type": "company",
    "found_model_name": "Company",
    "url": "http://my-project.test/company/edit/42"
  },
  {
    "id": 42,
    "name": "Coding Joe",
    "description": "tel:+1456555654|email:joe@coding-example.com",
    "type": "employee",
    "found_model_name": "Employee",
    "url": "http://my-project.test/employee/edit/42"
  },
  {
    "id": 1,
    "name": "Coding tools",
    "description": "In this note collected the best coding tools.",
    "type": "note",
    "found_model_name": "Note",
    "url": "http://my-project.test/note/edit/1"
  }
]
```
