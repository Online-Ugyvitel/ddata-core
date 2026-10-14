import { ErrorHandler, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DdataCoreModule } from './ddata-core.module';
import { DdataInjectorModule } from './ddata-injector.module';
import { EnvService } from './services/env/env.service';
import { DdataCoreErrorHandler } from './services/error-handler/app-error-handler';
import { SpinnerService } from './services/spinner/spinner.service';

describe('DdataCoreModule', () => {
  const environment = { apiUrl: 'http://module.test/api', debug: false };

  it('forRoot() should provide the environment and the EnvService', () => {
    const moduleWithProviders = DdataCoreModule.forRoot(environment);

    expect(moduleWithProviders.ngModule).toBe(DdataCoreModule);
    expect(moduleWithProviders.providers).toEqual([
      EnvService,
      { provide: 'env', useValue: environment }
    ]);
  });

  describe('imported with forRoot()', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [DdataCoreModule.forRoot(environment)] });
    });

    it('should store the root injector in both static injector holders', () => {
      TestBed.inject(DdataCoreModule);

      expect(DdataCoreModule.InjectorInstance).toBe(TestBed.inject(Injector));
      expect(DdataInjectorModule.InjectorInstance).toBe(TestBed.inject(Injector));
    });

    it('should give the environment to the EnvService', () => {
      expect(TestBed.inject(EnvService).environment).toBe(environment);
      expect(TestBed.inject('env' as never)).toBe(environment);
    });

    it('should provide the error handler and the spinner service', () => {
      expect(TestBed.inject(ErrorHandler)).toBeInstanceOf(DdataCoreErrorHandler);
      expect(TestBed.inject(SpinnerService)).toBeInstanceOf(SpinnerService);
    });
  });

  it('should need forRoot() for the EnvService, because only forRoot() provides the environment', () => {
    TestBed.configureTestingModule({ imports: [DdataCoreModule] });

    TestBed.inject(DdataCoreModule);

    expect(DdataCoreModule.InjectorInstance).toBe(TestBed.inject(Injector));
    expect(() => TestBed.inject(EnvService)).toThrow(/env/);
  });
});

describe('DdataInjectorModule', () => {
  it('should store the injector it is created with', () => {
    TestBed.configureTestingModule({ imports: [DdataInjectorModule] });

    TestBed.inject(DdataInjectorModule);

    expect(DdataInjectorModule.InjectorInstance).toBe(TestBed.inject(Injector));
    expect(DdataCoreModule.InjectorInstance).toBeUndefined();
  });
});
