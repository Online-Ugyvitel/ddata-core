# DdataLib

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Vitest](https://vitest.dev) (`ng test <project> --no-watch` for a single run).

### Coverage

Run `npm run test:coverage` to test every package with coverage, or `ng test <project> --no-watch --coverage` for a single package. The report is written to `coverage/<project>/` (open `index.html` for the per-file view).

Coverage is measured on the package's own source only (`projects/<project>/src/**/*.ts`), without specs, `test-setup.ts`, test helpers, `public-api.ts` and the type-only `*.interface.ts` / `*.type.ts` files. Packages imported from `dist/` are not counted.

The required minimum is **98%** for statements, branches, functions and lines in every package, and the goal is 100%. The thresholds are set per package in the `test` target of `angular.json` (`coverageThresholds`); the CI runs the package tests with `--coverage`, so a package below its threshold fails the build. Thresholds may only be raised, never lowered.

The number alone is not the goal: a test must prove that the code works correctly.

- Test the behaviour, not the implementation: assert on what the caller observes (return values, emitted events, rendered DOM, HTTP requests), not on private fields or which internal method was called.
- Edge cases are required: empty, `null` and `undefined` inputs, boundary values, error responses, and repeated or concurrent calls.
- Use precise assertions (`toBe`, `toEqual`, `toHaveBeenCalledWith`); `toBeTruthy()` alone proves almost nothing.
- Do not skip or exclude specs (`xit`, `it.skip`, the `exclude` option of the test target): a spec either works or is deleted with a reason.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
