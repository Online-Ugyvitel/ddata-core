# ProxyService: custom URI requests

`ProxyService` forwards custom URI requests to `RemoteDataService`, including any optional headers.
These methods always use HTTP, even when the model uses local storage.

| Method | HTTP method | URL |
| --- | --- | --- |
| `getUri(uri, headers?)` | GET | `environment.apiUrl + uri` |
| `postUri(data, uri, headers?)` | POST | `environment.apiUrl + model.api_endpoint + uri` |
| `putUri(data, uri, headers?)` | PUT | `environment.apiUrl + model.api_endpoint + uri` |

POST and PUT serialize `data` as JSON. All three methods return an observable of the unmodified response.
Pass a leading slash in `uri` when separating path segments, as with the existing methods.

The optional `RequestHeaders` type, exported by `ddata-core`, accepts either Angular `HttpHeaders`
or an object whose values are strings or arrays of strings. Custom headers are merged over the default
headers for that request only; matching header names are overridden case-insensitively. Unspecified
defaults, including authentication, remain in place. Neither the supplied headers nor subsequent
requests are modified. Existing calls without headers continue to work.

```typescript
const headers = { 'X-Request-Id': 'request-42' };

proxy.getUri('/users/active', headers).subscribe();
proxy.postUri({ active: true }, '/filter', headers).subscribe();
proxy.putUri({ name: 'Updated name' }, '/42', headers).subscribe();
```

See [RemoteDataService](service-remote-data.md) for details and `HttpHeaders` examples.
