import 'zone.js/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DdataInputCheckboxComponent } from './checkbox.component';
import { DdataCoreModule, BaseModel } from 'ddata-core';

xdescribe('DdataInputCheckboxComponent', () => {
  let component: DdataInputCheckboxComponent;
  let fixture: ComponentFixture<DdataInputCheckboxComponent>;

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
      declarations: [DdataInputCheckboxComponent],
      providers: [
        Injector,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    DdataCoreModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(DdataInputCheckboxComponent);
  });

  it('should create', () => {
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('ngOnInit() method should set iterable tobe not 0', () => {
    component = fixture.componentInstance;
    component.ngOnInit();
    expect(component.iterable).toBeGreaterThanOrEqual(0);
    expect(component.iterable).toBeLessThanOrEqual(100);
  });

  it('model property should set model to be Instance if Basemodel when it\'s null or refresh it\'s value', () => {
    component = fixture.componentInstance;
    component._model = null;
    component.model = null;
    expect(component._model).toBeInstanceOf(BaseModel);
  });

  it('field property should set field to be \'isValid\' when it\'s undefined or refresh it\'s value', () => {
    component = fixture.componentInstance;
    component._field = '';
    component.field = 'undefined';
    expect(component._field).toBe('isValid');

    component = fixture.componentInstance;
    component._field = '';
    component.field = undefined;
    expect(component._field).not.toBe('');

    component = fixture.componentInstance;
    component._field = '';
    component.field = 'something';
    expect(component._field).toBe('something');
  });

  it('getIcon() method should return faCheckSquare or faSquare', () => {
    component = fixture.componentInstance;
    expect(component.getIcon()).toBeTruthy();
    expect(component.getIcon()).toEqual((component as any).faSquare);

    component.model.isValid = true;
    expect(component.getIcon()).toBeTruthy();
    expect(component.getIcon()).toEqual((component as any).faCheckSquare);
  });

  it('clicked() method should change the isValid if it\'s not disabled', () => {
    component = fixture.componentInstance;
    component.disabled = false;
    component.model.isValid = false;
    component.clicked();
    expect(component.model.isValid).toBe(true);

    component.disabled = true;
    component.model.isValid = false;
    component.clicked();
    expect(component.model.isValid).toBe(false);

  });
});
