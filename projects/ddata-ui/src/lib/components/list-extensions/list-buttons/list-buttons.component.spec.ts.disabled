import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { AppModule } from 'src/app/app.module';
import { ListButtonsComponent } from './list-buttons.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('ListButtonsComponent', () => {
  let component: ListButtonsComponent;
  let fixture: ComponentFixture<ListButtonsComponent>;
  let router: Router;
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


  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ ListButtonsComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    AppModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(ListButtonsComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
  });
  afterEach(() => {
    document.body.removeChild(element);
  });

  it('select()', () => {
    const spyEmit = spyOn(component.emitSelected, 'emit').and.callThrough();
    component.select();
    expect(spyEmit).toHaveBeenCalled();
  });

  it('create()', () => {
    const spy = spyOn((component as any).router, 'navigateByUrl').and.callThrough();
    const spyEmit = spyOn(component.addNew, 'emit').and.callThrough();
    component.create();
    expect(spy).toHaveBeenCalled();
    expect(spyEmit).not.toHaveBeenCalled();
  });

  it('delete()', () => {
    const spy = spyOn(component.deleteSelected, 'emit').and.callThrough();
    component.delete();
    expect(spy).toHaveBeenCalled();
  });
});
