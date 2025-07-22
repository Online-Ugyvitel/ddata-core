import 'zone.js/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { AppModule } from 'src/app/app.module';
import { AutocompleteBoxComponent } from './autocomplete-box.component';
import { BaseModel } from 'src/app/models/base-model/base-model.model';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { Tag } from 'src/app/models/tag/tag.model';

xdescribe('AutocompleteBoxComponent', () => {
  let component: AutocompleteBoxComponent;
  let fixture: ComponentFixture<AutocompleteBoxComponent>;
  let debugElement;
  let element;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutocompleteBoxComponent],
      providers: [
        Injector,
        ValidatorService,
        BaseModel
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(AutocompleteBoxComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('model property should not change anything if the value is null', () => {
    component._model = new BaseModel();
    component.model = null;
    expect(component._model).toEqual(null);

    component._field = 'is_inactive';
    component._model = new BaseModel();
    component.model = new Tag().init();
    expect(component._model).toEqual(new Tag().init());
    expect(component._model.fields[component._field].title).toBe('Inaktív');
    expect(component._model.fields[component._field].placeholder).toBe('Inaktív');
    expect(component._model.fields[component._field].label).toBe('Inaktív');
    expect(component._is_required).toBe(false);

    component._model = new BaseModel();
    component._field = 'name';
    component.model = new Tag().init();
    expect(component._model).toEqual(new Tag().init());
    expect(component._model.fields[component._field].title).toBe('Címke neve');
    expect(component._model.fields[component._field].placeholder).toBe('Címke neve');
    expect(component._model.fields[component._field].label).toBe('Címke neve');
    expect(component._is_required).toBe(true);
  });

  it('field property should set _field to be \'isValid\' when it\'s undefined or refresh it\'s value', () => {
    component._field = '';
    component.field = 'undefined';
    expect(component._field).toBe('isValid');

    component._field = '';
    component.field = undefined;
    expect(component._field).not.toBe('');

    component._field = '';
    component.field = 'something';
    expect(component._field).toBe('something');
  });

  it('append property should set _append to be \'\' when it\'s undefined or refresh it\'s value', () => {
    component._append = '';
    component.append = 'undefined';
    expect(component._append).toBe('');

    component._append = '';
    component.append = undefined;
    expect(component._append).not.toBe('');

    component._append = '';
    component.append = 'something';
    expect(component._append).toBe('something');
  });

  it('prepend property should set _prepend to be \'\' when it\'s undefined or refresh it\'s value', () => {
    component._prepend = '';
    component.prepend = 'undefined';
    expect(component._prepend).toBe('');

    component._prepend = '';
    component.prepend = undefined;
    expect(component._prepend).not.toBe('');

    component._prepend = '';
    component.prepend = 'something';
    expect(component._prepend).toBe('something');
  });

  it('randChars() method should return a String which\'s lenght is 50', () => {
    expect(component.randChars()).toBeTruthy();
    expect(component.randChars()).toBeInstanceOf(String);
    expect(component.randChars().length).toBe(50);
  });
});
