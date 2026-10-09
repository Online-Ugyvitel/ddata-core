// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';
import { Injector } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import { DdataCoreModule } from './lib/ddata-core.module';
import { DdataInjectorModule } from './lib/ddata-injector.module';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  teardown: { destroyAfterEach: false }
});

// The services read their dependencies from these static injectors, so a spec must not see the injector of another one.
afterEach(() => {
  DdataCoreModule.InjectorInstance = undefined;
  DdataInjectorModule.InjectorInstance = undefined;
});
