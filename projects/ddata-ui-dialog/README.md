# DData UI Dialog

This module has two components for handle dialogs easier in `ddata` world.

## Modal dialog with component

If you want to show a component in dialog and then handle events in dialog, you should use this component.

### Usage

HTML
```html
<button (click)="showDialog = true">Show dialog</button>

<dd-modal-dialog
  title="My awesome dialog title"
  [model]="model"
  [dialogContent]="dialogContent"
  [(showDialog)]="showDialog"
  [overlayClickCloseDialog]="false"
  closeButtonText="Close"
  (success)="save()"
  (fail)="cancel()"
  ></dd-modal-dialog>
```

TypeScript
```typescript
@Component({
  selector: 'app-awesome-component',
  templateUrl: './awesome.component.html',
  styleUrls: ['./awesome.component.scss']
})
export class AwesomeComponent implements OnInit {
  model: BaseModelInterface = new BaseModel(); // your model definition
  showDialog = false;
  dialogContent: DialogContentInterface = {
    createEditComponent: ProductCreateEditComponent,
    createEditOptions: {
      // ...
    },
    listComponent: ProductListComponent,
    listOptions: {
      // ...
    },
  };

  ngOnInit(): void {
    // ...
  }

  save(): void {
    // ...
    this.showDialog = false;
  }

  cancel(): void {
    this.showDialog = false;
  }
}
```

### API

| Input                     | Type                                      | Default                                             | Description                                                                                |
|---------------------------|-------------------------------------------|-----------------------------------------------------|--------------------------------------------------------------------------------------------|
| `title`                   | `string`                                  | empty string                                        | Title of the dialog.                                                                       |
| `model`                   | `BaseModelWithoutTypeDefinitionInterface` | `new BaseModel()`                                   | Model of the dialog.                                                                     |
| `dialogContent`           | `DialogContentItem`                       | `new DialogContentItem(DdataUiNoDataComponent, {})` | Dialog type. Can be `message`, `delete`, `warning` or any other string.                    |
| `showDialog`              | `boolean`                                 | `false`                                             | Dialog is visible or not. Supports two-way binding: `[(showDialog)]`. Setting `false` on a dialog that is not open does nothing (no `fail` event). |
| `overlayClickCloseDialog` | `boolean`                                 | `true`                                              | The ovrelay div is clickable or not. If clickable it cause a `pressed` event with `false`. |
| `closeButtonText`         | `string`                                  | `Close`                                             | Title text of the close button.                                                            |
| `closeButtonClass`        | `string`                                  | `btn dd-btn-neutral close`                          | CSS classes of the close button. See [Colour mode](#colour-mode).                          |

| Output    | Type                    | Description                                                                                                                                      |
|-----------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `success` | `EventEmitter<BaseModelWithoutTypeDefinitionInterface>`     | Emit when user clicks on the success button (OK, Yes, Agree, Allow, etc.) in your component.                                                                       |
| `fail` | `EventEmitter<string>` | Emits `'close'` when an open dialog is closed with the close button, the Escape key, a `select` of the content or by the parent setting `showDialog` to `false`. |
| `showDialogChange` | `EventEmitter<boolean>` | Emits `false` whenever an open dialog closes, so `[(showDialog)]` keeps the parent's value in sync and setting it to `true` again reopens the dialog. |



### DialogContentInterface

| Name                    | Required | Type              | Default | Description                                                                                                                   |
|-------------------------|----------|-------------------|---------|-------------------------------------------------------------------------------------------------------------------------------|
| `saveModel`             | no       | `Observable<any>` | `null`  | You can define a custom observable what is emit when user click on your component's save button.                              |
| `select`                | no       | `Observable<any`> | `null`  | You can define a custom observable what is emit when user select an element in your list.                                     |
| `isModal`               | no       | `boolean`         | `false` | Set `true` if this is a modal dialog.                                                                                         |
| `multipleSelectEnabled` | no       | `boolean`         | `false` | If this is a list component, you can control single select or multiple select lists behavioir.                                |
| `isSelectionList`       | no       | `boolean`         | `false` | If this is a list component, you can control this is a selectable list component.                                             |
| `selectedElements`      | no       | `any[]`           | `[]`    | Define previously selected models.                                                                                            |
| `models`                | no       | `any[]`           | `[]`    | Define preloaded models.                                                                                                      |
| `loadData`              | no       | `boolean`         | `false` | Control data loading when your component is showed in the dialog. Set `false` if you have preloaded models to list component. |
| `filter`                | no       | `any`             | `{}`    | Control your search/filter parameters on the listed models.                                                                   |
| `datasArrived`          | no       | `number`          | `0`     | Set a random number is datas arrived from the backend on the parent component.                                                |


## Confirm dialog

If you wan to open a simple confirm or message dialog to the user, you should to use this component.

### Usage

HTML
```html
<dd-confirm-dialog
  title="Are you sure?"
  content="Are you sure to delete this element?"
  type="delete"
  successButtonText="Delete"
  cancelButtonText="Cancel"
  closeButtonText="Close"
  [(showDialog)]="showDeleteDialog"
  [overlayClickCloseDialog]="false"
  (confirm)="deleteIsConfirmed()"
  (pressed)="buttonPressedOnDialog($event)"
  ></dd-confirm-dialog>
```

TypeScript
```typescript
@Component({
  selector: 'app-awesome-component',
  templateUrl: './awesome.component.html',
  styleUrls: ['./awesome.component.scss']
})
export class AwesomeComponent implements OnInit {
  showDeleteDialog = false;

  ngOnInit(): void {
    // ...
  }

  deleteIsConfirmed(): void {
    // delete button pressed...
  }

  buttonPressedOnDialog(isConfirmed: boolean): void {
    if (isConfirmed) {
      // delete button pressed...
    } else {
      // cancel or close button pressed...
    }
  }
}
```

### API

| Input                     | Type         | Default      | Description                                                                                |
|---------------------------|--------------|--------------|--------------------------------------------------------------------------------------------|
| `title`                   | `string`     | empty string | Title of the dialog.                                                                       |
| `content`                 | `string`     | empty string | Content of the dialog.                                                                     |
| `type`                    | `DialogType` | `message`    | Dialog type. Can be `message`, `delete`, `warning` or any other string.                    |
| `showDialog`              | `boolean`    | `false`      | Dialog is visible or not. Supports two-way binding: `[(showDialog)]`.                      |
| `overlayClickCloseDialog` | `boolean`    | `true`       | The ovrelay div is clickable or not. If clickable it cause a `pressed` event with `false`. |
| `successButtonText`       | `string`     | `OK`         | Text on the success button.                                                                |
| `cancelButtonText`        | `string`     | `Cancel`     | Text on the cancel button.                                                                 |
| `closeButtonText`         | `string`     | `Close`      | Title text of the close button.                                                            |
| `closeButtonClass`        | `string`     | `btn dd-btn-neutral close` | CSS classes of the close button. See [Colour mode](#colour-mode).            |

| Output    | Type                    | Description                                                                                                                                      |
|-----------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `confirm` | `EventEmitter<any>`     | Emit when user clicks on the success button (OK, Yes, Agree, Allow, etc.)                                                                        |
| `pressed` | `EventEmitter<boolean>` | Emit when user clicks on any button. The emitted value is depends on user clicked on success button (value is `true`) or not (value is `false`). |
| `showDialogChange` | `EventEmitter<boolean>` | Emits `false` whenever the dialog closes itself (confirm, cancel, close button, Escape, overlay click). With a one-way `[showDialog]` binding the parent has to reset its own value (e.g. on `pressed`) before it can open the dialog again; `[(showDialog)]` does this automatically. |

## Keyboard, focus and accessibility

Both dialogs:

- are rendered with `role="dialog"`, `aria-modal="true"` and `aria-labelledby` pointing at the title,
- move the focus to their first focusable element (or the dialog itself) when they open, keep `Tab` / `Shift+Tab` inside the dialog while open, and give the focus back to the previously focused element when they close,
- close on `Escape` (the confirm dialog like its cancel button, the modal dialog like its close button). Only the topmost open dialog reacts; closed dialogs ignore the key,
- close on a click outside the dialog box when `overlayClickCloseDialog` is `true`.

## Colour mode

The dialogs follow the Bootstrap 5.3 colour mode (`data-bs-theme="light"` or `"dark"` on the
document root) without any TypeScript logic: the close button's default `dd-btn-neutral` class is
built from the Bootstrap colour variables, so switching the attribute restyles an open dialog
immediately. Its keyboard focus is shown by a 2px outline in `--bs-primary-text-emphasis`; set
`--dd-focus-ring-color` to use another colour. Pass your own classes in `closeButtonClass` to
replace the default look (the icon and the `aria-label` stay).
