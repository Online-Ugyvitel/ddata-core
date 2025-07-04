import 'zone.js/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DdataCoreModule, ValidatorService, BaseModel, BaseModelInterface, FieldsInterface, FieldContainerInterface } from 'ddata-core';
import { DdataInputComponent } from './input.component';

class FakeModel extends BaseModel implements BaseModelInterface<any>, FieldsInterface<HasTextField>, HasTextField {
  textField = 'Hello Dolly';
  fields: FieldContainerInterface<HasTextField> = {
    textField: {
      title: 'testField - test title',
      label: 'testField - test label',
      placeholder: 'testField - test placeholder'
    }
  };
}

interface HasTextField {
  textField: string;
}

xdescribe('InputBoxComponent', () => {
  let component: DdataInputComponent;
  let fixture: ComponentFixture<DdataInputComponent>;
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
      declarations: [DdataInputComponent],
      providers: [
        Injector,
        ValidatorService,
        BaseModel
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    DdataCoreModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(DdataInputComponent);
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
    expect(component._model).toEqual(new BaseModel());

    component._field = 'is_inactive';
    component._model = new BaseModel();
    component.model = new FakeModel();
    expect(component._model).toEqual(new FakeModel());
    expect(component._model.fields[component._field].title).toBe('Inaktív');
    expect(component._model.fields[component._field].placeholder).toBe('Inaktív');
    expect(component._model.fields[component._field].label).toBe('Inaktív');
    expect(component._isRequired).toBe(false);

    component._model = new BaseModel();
    component._field = 'name';
    component.model = new FakeModel();
    expect(component._model).toEqual(new FakeModel());
    expect(component._model.fields[component._field].title).toBe('Címke neve');
    expect(component._model.fields[component._field].placeholder).toBe('Címke neve');
    expect(component._model.fields[component._field].label).toBe('Címke neve');
    expect(component._isRequired).toBe(true);
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

  it('labelText property should set _label to be \'\' when it\'s undefined or refresh it\'s value', () => {
    component._label = '';
    component.labelText = 'undefined';
    expect(component._label).toBe('');

    component._label = '';
    component.labelText = undefined;
    expect(component._label).not.toBe('');

    component._label = '';
    component.labelText = 'something';
    expect(component._label).toBe('something');
  });


});
