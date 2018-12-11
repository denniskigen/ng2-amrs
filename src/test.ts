// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
// To test a single file, pass the file context(file path and name)
// const context = require.context('./', true, /app\/app\.component\.spec\.ts$/);
const context = require.context('./', true, /app\/program-manager\/program-manager\.service\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
