import { Component, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DdataUiCommonModule } from './ddata-ui-common.module';

@Component({
  selector: 'dd-module-host',
  template: `
    <dd-tag [tag]="{ name: 'exported' }" [class]="'badge'"></dd-tag>
    <dd-user-profile-thumbnail [user]="{ name: 'module' }"></dd-user-profile-thumbnail>
  `,
  imports: [DdataUiCommonModule]
})
class ModuleHostComponent {}

describe('DdataUiCommonModule', () => {
  afterEach(() => {
    DdataUiCommonModule.InjectorInstance = undefined;
  });

  it('forRoot() should return the module without extra providers', () => {
    const moduleWithProviders = DdataUiCommonModule.forRoot();

    expect(moduleWithProviders).toEqual({ ngModule: DdataUiCommonModule });
    expect(moduleWithProviders.providers).toBeUndefined();
  });

  it('should store the injector in the static InjectorInstance when the module is instantiated', () => {
    DdataUiCommonModule.InjectorInstance = undefined;
    TestBed.configureTestingModule({ imports: [DdataUiCommonModule.forRoot()] });
    const moduleInstance = TestBed.inject(DdataUiCommonModule);
    const injector = DdataUiCommonModule.InjectorInstance;

    expect(moduleInstance).toBeInstanceOf(DdataUiCommonModule);
    expect(injector).toBeDefined();
    expect(injector.get(DdataUiCommonModule)).toBe(moduleInstance);
    expect(injector.get(Injector)).toBe(injector);
  });

  it('should export the components so they can be used in templates of an importing module', () => {
    TestBed.configureTestingModule({ imports: [ModuleHostComponent] });
    const fixture = TestBed.createComponent(ModuleHostComponent);

    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('dd-tag span.badge.tag').textContent.trim()).toBe('exported');
    expect(element.querySelector('.user-profile-thumbnail').textContent.trim()).toBe('M');
  });
});
