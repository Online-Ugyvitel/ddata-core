import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { BaseModel } from 'ddata-core';
import 'zone.js/testing';
import { DdataUiTagComponent } from './tag.component';

describe('DdataUiTagComponent', () => {
  let component: DdataUiTagComponent;
  let fixture: ComponentFixture<DdataUiTagComponent>;
  let debugElement;
  let element;

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
      teardown: { destroyAfterEach: false }
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DdataUiTagComponent],
      providers: [Injector]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiTagComponent);
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

  it("class property should set _class to be the given value + ' tag'", () => {
    component._class = '';
    component.class = 'Valami';

    expect(component._class).toBe('Valami tag');
  });

  it("deleteTag() method should call the delete property's emit", () => {
    const fakeModel = new BaseModel().init();

    component.tag = fakeModel;
    const fakeSpy = spyOn(component.delete, 'emit');

    component.deleteTag();

    expect(fakeSpy).toHaveBeenCalledWith(fakeModel);
  });
});
