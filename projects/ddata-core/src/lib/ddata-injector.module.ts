import { NgModule, Injector } from '@angular/core';

// @dynamic
@NgModule({
  declarations: [],
  imports: [],
  providers: [],
  exports: []
})
export class DdataInjectorModule {
  static InjectorInstance: Injector;

  constructor(injector: Injector) {
    DdataInjectorModule.InjectorInstance = injector;
  }
}
