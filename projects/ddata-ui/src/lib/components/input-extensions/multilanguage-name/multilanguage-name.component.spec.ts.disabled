import 'zone.js/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { AppModule } from 'src/app/app.module';
import { MultilanguageNameComponent } from './multilanguage-name.component';
import { BaseModel } from 'src/app/models/base-model/base-model.model';
import { LangService } from 'src/app/services/lang/lang.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Name, MultilanguageNameInterface } from 'src/app/models/name/name.model';
import { ID } from 'src/app/models/base-model/base-data-type.model';

class FakeNameClass implements MultilanguageNameInterface {
  names: import ('../../models/name/name.interface').NameInterface[] = [];
}

xdescribe('MultilanguageNameComponent', () => {
  let component: MultilanguageNameComponent;
  let fixture: ComponentFixture<MultilanguageNameComponent>;
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
      declarations: [MultilanguageNameComponent],
      providers: [
        Injector,
        BaseModel,
        LangService,
        HttpClient,
        HttpHandler
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(MultilanguageNameComponent);
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

  it('addName() method should push the Name into te model', () => {
    component.model = new FakeNameClass();
    expect(component.model.names.length).toBe(0);
    component.addName();
    expect(component.model.names.length).toBe(1);
    expect(component.model.names[0].lang_id).toBe(1 as ID);
    component.addName();
    expect(component.model.names.length).toBe(2);
    expect(component.model.names[1].lang_id).toBe(1 as ID);
  });

  it('deleteName() method should delete the Name Object from the Class', () => {
    component.model = new FakeNameClass();
    const forDelete = new Name().init({lang_id: 13});

    expect(component.model.names.length).toBe(0);
    component.addName();
    component.addName();

    component.deleteName(null);
    expect(component.model.names.length).toBe(2);

    component.deleteName(new Name());
    expect(component.model.names.length).toBe(1);

    component.addName();
    component.model.names.push(forDelete); // Azért így van, mert így középen lesz ez az elem.
    component.addName();

    expect(component.model.names[2].lang_id).toBe(13 as ID);
    expect(component.model.names.length).toBe(4);

    component.deleteName((forDelete as Name));
    expect(component.model.names.length).toBe(3);
    expect(component.model.names[0].lang_id).toBe(1 as ID);
    expect(component.model.names[1].lang_id).toBe(1 as ID); // Kitörölte középről a megadott elemet.
    expect(component.model.names[2].lang_id).toBe(1 as ID);

    // Ha tovább törölnék, akkor még ha nem is talál pontos találatot, az utolsó elemet törölni fogja.

    // component.deleteName((forDelete as Name));
    // expect(component.model.names.length).toBe(7);
  });

  it('getTotal() method should give back the (arrays length)-1', () => {
    component.model = new FakeNameClass();
    expect(component.getTotal()).toBe(component.model.names.length - 1);
    expect(component.getTotal()).toBe(-1);
    component.addName();
    component.addName();
    expect(component.getTotal()).toBe(component.model.names.length - 1);
    expect(component.getTotal()).toBe(1);
  });

});
