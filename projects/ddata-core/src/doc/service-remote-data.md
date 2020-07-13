# Remote Data Service

The `RemoteDataService` created for communicate to the backend over HTTP. The Remote Data Service built for
Laravel based backend, but in real it doesn't matter what's run on your server. [Here you can read more about
the expectation for remote storage API.](expectations-for-backend.md)


## Responsibility

Responsibility of the `RemoteDataService`:
- communicate with backend
- convert incoming datas from plain JSON to models
- convert outgoing datas to plain JSON from models
- pass errors to DData Error Handler service

But what means JSON to models conversion and vica versa?


## Why we convert datas?

If you build a larger application, often you use `instanceof` to identify the objects, and you need to minimize
the most common `'something' is undefined property of` errors. To do this, you need to be sure the property is
defined and not `null` when you read it. So you need to initialize your object with default values of properties.

When you save a model the backend often require all fields of the model, but the models maybe contains much more
fields what you don't want to send to the backend. So you need to prepare your object before save.

[Here you can read more about models.](models.md)

So we convert the incoming datas to minimize errors and to use classes instead of plain objects. And we convert
our classes back to plain object to minimize data traffic and fix user-made mistakes.

All models needs to define the `api_endpoint` field where you can define the model's API endpoint URI.


## Reference

| Method's name                                                      | Result                                     | Description                                                                                                            |
|--------------------------------------------------------------------|--------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `setupHeaders()`                                                   | `void`                                     | Set up the HTTP headers what can use every requests.                                                                   |
| `getAll(pageNumber?: number)`                                      | `Observable<PaginateInterface>`            | Send HTTP GET request to the API endpoint where can get the all items of requested resource in a PaginateInterface.    |
| `getAllWithoutPaginate()`                                          | `Observable<T[]>`                          | Send HTTP GET request to the API endpoint where can get the all items of requested resource without PaginateInterface. |
| `getPage(pageNumber: number, uniqueUrl?: string)`                  | `Observable<PaginateInterface>`            | Send a HTTP GET request to the API endpoint to get a PaginateInterface object belongs to the model.                    |
| `getOne(id: number)`                                               | `Observable<T>`                            | Send HTTP GET request to the API endpoint where can get one instance of requested resource.                            |
| `getUri(uri: string)`                                              | `Observable<T>`                            | Send HTTP GET request to the API endpoint's unique URI.                                                                |
| `postUri(resource: any, uri: string)`                              | `Observable<any>`                          | Send HTTP POST request to the API endpoint's unique URI.                                                               |
| `save(data: T)`                                                    | `Observable<number | boolean>`             | Send HTTP POST or PUT request to the API endpoint to create a new instance or update an existing one.                  |
| `delete(model: T)`                                                 | `Observable<number>`                       | Send HTTP DELETE request to the API endpoint to delete an instance.                                                    |
| `deleteMultiple(models: T[])`                                      | `Observable<{}>`                           | Send HTTP POST request to the API endpoint to delete multiple instances.                                               |
| `sendFiles(uri: string, id: number, files: Set<File>, data?: any)` | `Observable<FileUploadProcessInterface>[]` | You can send one or more files to the backend with this function.                                                      |
| `handleError(error: HttpErrorResponse)`                            | `void`                                     | Handle errors with custom error handlers.                                                                              |


### `getAll()`

Send HTTP GET request to the API endpoint where can get the all items of requested resource in a PaginateInterface.
PaginateInterface is based on Laravel 6.x's pagination.

The requested URL will be constructed like this: `{environment.apiUrl}/{model.api_endpoint}`

If the ApiUrl is `http://www.yourdomain.com/api` and the API endpoint of the model is `post`, then your url will be
`http://www.yourdomain.com/api/post`

Returns Observable, PaginateInterface with initialized `T` type objects.

```typescript
  constructor(
    private myRemoteStorageService: RemoteStorageService<Post>,
  ) {}

  load() {
    this.myRemotStorageService.getAll().subscribe();
  }
```

### `getAllWithoutPaginate()`

Send HTTP GET request to the API endpoint where can get the all items of requested resource without PaginateInterface.
In Laravel 6.x you need to create a new resurce in the ResourceRegistrar.

The requested URL will be constructed like this: `{environment.apiUrl}/{model.api_endpoint}/list`

If the ApiUrl is `http://www.yourdomain.com/api` and the API endpoint of the model is `post`, then your url will be
`http://www.yourdomain.com/api/post/list`

Returns Observable, array of initialized `T` type objects.

```typescript
  constructor(
    private myRemoteStorageService: RemoteStorageService<Post>,
  ) {}

  load() {
    this.myRemotStorageService.getAllWithoutPaginate().subscribe();
  }
```


### `getPage()`

Send a HTTP GET request to the API endpoint to get a PaginateInterface object belongs to the model.

The requested URL will be constructed like this: `{environment.apiUrl}/{model.api_endpoint}/{uniqueUri}/{pageNumber}`

If the ApiUrl is `http://www.yourdomain.com/api` and the API endpoint of the model is `post`, and you want to get the
2nd page (and unique Uri is empty - optional) then your url will be `http://www.yourdomain.com/api/post/?page=2`

#### Parameters

| Name       | Type   | Description                                    |
|------------|--------|------------------------------------------------|
| pageNumber | number | Number of the page                             |
| uniqueUrl  | string | Optional parameter what'll be put into the URL |

Returns Observable, PaginateInterface with initialized `T` type objects.

```typescript
  constructor(
    private myRemoteStorageService: RemoteStorageService<Post>,
  ) {}

  load() {
    // URL: http://www.yourdomain.com/api/post/?page=2
    this.myRemotStorageService.getPage(2).subscribe();
  }
```
or:
```typescript
  constructor(
    private myRemoteStorageService: RemoteStorageService<Post>,
  ) {}

  load() {
    // URL: http://www.yourdomain.com/api/post/get-page/?page=2
    this.myRemotStorageService.getPage(2, 'get-page/').subscribe();
  }
```


### `getOne()`

Send HTTP GET request to the API endpoint where can get one instance of requested resource.

The requested URL will be constructed like this: `{environment.apiUrl}/{model.api_endpoint}/{id}`

If the ApiUrl is `http://www.yourdomain.com/api` and the API endpoint of the model is `post` and ID is 42, then your
url will be `http://www.yourdomain.com/api/post/42`

| Name | Type   | Description           |
|------|--------|-----------------------|
| id   | number | unique ID of instance |

Returns Observable, initialized model of `T` type object.

```typescript
  constructor(
    private myRemoteStorageService: RemoteStorageService<Post>,
  ) {}

  load() {
    const id = 42;
    this.myRemotStorageService.getOne(id).subscribe();
  }
```


### `getUri()`

Send HTTP GET request to the API endpoint's unique URI

The requested URL will be constructed like this: `{environment.apiUrl}/{uri}`

If the ApiUrl is `http://www.yourdomain.com/api` and the custom URI is "my/custom/uri", then your
url will be `http://www.yourdomain.com/api/my/custom/uri`

| Name | Type   | Description       |
|------|--------|-------------------|
| uri  | string | unique URI string |

Returns Observabe, any.

```typescript
  constructor(
    private myRemoteStorageService: RemoteStorageService<Post>,
  ) {}

  load() {
    const uri = '/filter/by/user/42';
    this.myRemotStorageService.getUri(uri).subscribe();
  }
```


### `postUri()`

Send HTTP POST request to the API endpoint's unique URI

The requested URL will be constructed like this: `{environment.apiUrl}/{uri}`

If the ApiUrl is `http://www.yourdomain.com/api` and the custom URI is `my/custom/uri`, then your
url will be `http://www.yourdomain.com/api/my/custom/uri`

| Name     | Type   | Description                    |
|----------|--------|--------------------------------|
| resource | object | any data what you want to send |
| uri      | string | unique URI string              |

Returns Observabe, any.

```typescript
  constructor(
    private myRemoteStorageService: RemoteStorageService<Post>,
  ) {}

  load() {
    const uri = '/filter/by/user/42';
    this.myRemotStorageService.getUri(uri).subscribe();
  }
```


### `save()`

Send HTTP POST or PUT request to the API endpoint to create a new instance or update an existing one.

Create or update depends on the model has `id` field and it's `0` or not.
If it's undefined, null or `0` there will be run a create (POST request), otherwise update (PUT request).

Before send the create or update the model will be validated on it's custom validaton rules if defined.
You can read more about validation in BaseModel section.

If the ApiUrl is `http://www.yourdomain.com/api` and the API endpoint of the model is `post`, then your
url will be `http://www.yourdomain.com/api/post`

| Name  | Type | Description                                                                                      |
|-------|------|--------------------------------------------------------------------------------------------------|
| model | `T`  | resource any kind of JSON object, what API can handle. Of course you should give a living model. |

Returns Observabe, number or boolean, depends on backend's settings. If it's a number, then it's the ID of
the saved instance.

```typescript
  constructor(
    private myRemoteStorageService: RemoteStorageService<Post>,
  ) {}

  load() {
    const myPost = new Post().init();
    this.myRemotStorageService.save(myPost).subscribe();
  }
```


### `delete()`

Send HTTP DELETE request to the API endpoint to delete an instance.

If the ApiUrl is `http://www.yourdomain.com/api` and the API endpoint of the model is `post` with ID 42, then your
url will be `http://www.yourdomain.com/api/post/42`

| Name  | Type | Description                             |
|-------|------|-----------------------------------------|
| model | `T`  | a living model, what you want to delete |

Returns Observabe, number with HTTP code of delete result.

```typescript
  constructor(
    private myRemoteStorageService: RemoteStorageService<Post>,
  ) {}

  load() {
    const myPost = new Post().init();
    this.myRemotStorageService.delete(myPost).subscribe();
  }
```


### `deleteMultiple()`

Send HTTP POST request to the API endpoint to delete multiple instances.

If the ApiUrl is `http://www.yourdomain.com/api` and the API endpoint of the model is `post`, then your
url will be `http://www.yourdomain.com/api/post/multiple/delete`

The IDs what you want to delete will be send in the request body as an object with this stucture:

`{data: [1, 2, 4, 42, 69]}`

| Name   | Type  | Description                             |
|--------|-------|-----------------------------------------|
| models | `T[]` | array of models what you want to delete |

Returns Observabe, any.

```typescript
  constructor(
    private myRemoteStorageService: RemoteStorageService<Post>,
  ) {}

  load() {
    const posts: Post[] = [
      new Post().init({id: 42}),
      new Post.init({id: 69})
    ];
    this.myRemotStorageService.deleteMultiple(posts).subscribe();
  }
```


### `sendFiles()`

You can send one or more files to the backend with this function.

Send files with HTTP POST as form data.

You can send files with additional datas in the `data` parameter. This is optional parameter, where you can
send addition datas. For example folder ID, file descriptions, etc. It will be stringified befor sending and
will be attached for every file.

If the ApiUrl is `http://www.yourdomain.com/api` and the API endpoint of the model is `post` and the `uri` is
`file`, then your url will be `http://www.yourdomain.com/api/post/file`

| Name  | Type        | Description                               |
|-------|-------------|-------------------------------------------|
| uri   | string      | the uri where you want to send the file   |
| files | `Set<File>` | Set of JavaScript File instances          |
| data  | object      | optional JSON object for additional datas |

Returns Observabe array, contains FileUploadProcessInterface instances.

```typescript
  // send files to http://www.yourdomain.com/api/post/file URL
  constructor(
    private myRemoteStorageService: RemoteStorageService<Post>,
  ) {}

  load() {
    const files: Set<File>;
    const datas = {
      folder_id: 99,
      description: 'Lorem ipsum',
    };
    this.myRemotStorageService.deleteMultiple('/file', files, datas).subscribe();
  }
```

# Expectations for remote storage API

This package has several expectations for remote storage API. You can [read more about this here](expectations-for-backend.md).
