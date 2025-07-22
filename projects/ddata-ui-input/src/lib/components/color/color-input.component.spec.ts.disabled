import 'zone.js/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { AppModule } from 'src/app/app.module';
import { DdataInputColorComponent } from './color-input.component';
import { BaseModel, ValidatorService } from 'ddata-core';
import { DdataUiInputModule } from 'ddata-ui-input';

xdescribe('DdataInputColorComponent', () => {
  let component: DdataInputColorComponent;
  let fixture: ComponentFixture<DdataInputColorComponent>;
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
      declarations: [DdataInputColorComponent],
      providers: [
        Injector,
        ValidatorService,
        BaseModel
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    // DdataUiInputModule.inje = TestBed;
    fixture = TestBed.createComponent(DdataInputColorComponent);
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

  it('model property should set _model to be null', () => {
    component.model = null;
    expect(component._model).toBe(null);
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

  // it('randChars() method should return a String which\'s lenght is 50', () => {
  //   expect(component.randChars()).toBeTruthy();
  //   expect(component.randChars()).toBeInstanceOf(String);
  //   expect(component.randChars().length).toBe(50);

  // });

});
