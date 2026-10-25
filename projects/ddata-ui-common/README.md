# DdataUiCommon

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.2.

## Colour mode

`dd-tag` and `dd-user-profile-thumbnail` follow the Bootstrap 5.3 colour mode
(`data-bs-theme="light"` or `"dark"` on the document root) through CSS variables only:

- the tag's delete button uses the colour-mode-aware `dd-btn-neutral` style; its accessible name
  is `deleteButtonText` (default `Remove tag`) followed by the tag name, e.g. `Remove tag: News`.
  The focus outline is `--bs-primary-text-emphasis`, overridable with `--dd-focus-ring-color`,
- the thumbnail's initial letter is black on its yellow background in both modes.

## Code scaffolding

Run `ng generate component component-name --project ddata-ui-common` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project ddata-ui-common`.
> Note: Don't forget to add `--project ddata-ui-common` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build ddata-ui-common` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build ddata-ui-common`, go to the dist folder `cd dist/ddata-ui-common` and run `npm publish`.

## Running unit tests

Run `ng test ddata-ui-common` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
