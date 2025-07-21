import { ErrorHandler, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { DdataInjectorModule } from './ddata-injector.module';
import { EnvService } from './services/env/env.service';
import { DdataCoreErrorHandler } from './services/error-handler/app-error-handler';
import { SpinnerService } from './services/spinner/spinner.service';

// @dynamic
@NgModule({
  declarations: [],
  imports: [DdataInjectorModule],
  providers: [{ provide: ErrorHandler, useClass: DdataCoreErrorHandler }, SpinnerService],
  exports: []
})
export class DdataCoreModule {
  static InjectorInstance: Injector;

  constructor(injector: Injector) {
    DdataCoreModule.InjectorInstance = injector;
  }

  static forRoot(environment: unknown): ModuleWithProviders<DdataCoreModule> {
    return {
      ngModule: DdataCoreModule,
      providers: [
        EnvService,
        {
          provide: 'env', // you can also use InjectionToken
          useValue: environment
        }
      ]
    };
  }
}
