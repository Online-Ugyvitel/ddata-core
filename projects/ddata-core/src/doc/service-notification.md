# Notification Service

The `NotificationService` created for handle in-app notifications - especially, but not just error messages.

## How to use?

In your **app.module.ts**:

```typescript
import { Injector, NgModule } from '@angular/core';
import { DdataCoreModule, NotificationService } from '@netdjw/ddata-core';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    DdataCoreModule.forRoot(environment),
  ],
  providers: [
    NotificationService,
  ],
})
export class AppModule {
    static InjectorInstance: Injector;

  constructor(private injector: Injector) {
    AppModule.InjectorInstance = injector;
  }
}
```

Then in your service or component TypeScript file:
```typescript
export class MyClass {
  notificationService: NotificationServiceInterface = AppModule.InjectorInstance.get(NotificationService);

  myMethod() {
    // create notification instance
    const notification: NotificationInterface = new Notification({
      title: 'Huston!',
      text: 'We have a problem!',
      type: 'danger'
    });

    // add notification to queue
    this.notificationService.add(notification);
  }
}
```

## Notification options

| Name | Type | Default value | Description |
|------|------|---------------|---|
| `title` | `string` | | Title of the notification. |
| `text`  | `string` | | Message body of the notification. |
| `type`  | `NotificationType` | | Type of the message. For example: success, warning, info, danger. |
| `seconds` | `number` | `5` | Seconds while the message will disappear. |

Type possible values (based on Bootstrap):

- primary
- secondary
- success
- danger
- warning
- info
- light
- dark

## Notification service methods

### `add()`

You can add a new notifications to the service:

```typescript
this.notificationService.add(new Notification({title: '...', text: '...', type: 'danger'}));
```

### `delete()`

You can delete a notification from the queue by index:

```typescript
this.notificationService.delete(5);
```

### `watch()`

You can watch the notifications:

```typescript
this.notificationService.watch().pipe(
  map((notification: NotificationInterface) => {
    // ...
  })
).subscribe();
```

## See also

If you want to use a fully-implemented notifiaction component based on this service, check the `@netdjw/ddata-ui-common` package.
