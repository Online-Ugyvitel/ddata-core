import { DdataCoreModule } from './lib/ddata-core.module';
import { DdataInjectorModule } from './lib/ddata-injector.module';

// The services read their dependencies from these static injectors, so a spec must not see the injector of another one.
afterEach(() => {
  DdataCoreModule.InjectorInstance = undefined;
  DdataInjectorModule.InjectorInstance = undefined;
});
