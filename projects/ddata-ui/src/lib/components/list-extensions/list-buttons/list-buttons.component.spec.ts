import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ListButtonsComponent } from './list-buttons.component';

describe('ListButtonsComponent', () => {
  let component: ListButtonsComponent;
  let fixture: ComponentFixture<ListButtonsComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
      teardown: { destroyAfterEach: false }
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListButtonsComponent],
      imports: [RouterTestingModule.withRoutes([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListButtonsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('select()', () => {
    const spyEmit = spyOn(component.emitSelected, 'emit').and.callThrough();

    component.select();

    expect(spyEmit).toHaveBeenCalledWith();
  });

  it('create()', () => {
    const routerInstance = (component as unknown as { router: { navigateByUrl: () => void } })
      .router;
    const spy = spyOn(routerInstance, 'navigateByUrl').and.callThrough();
    const spyEmit = spyOn(component.addNew, 'emit').and.callThrough();

    component.create();

    expect(spy).toHaveBeenCalledWith();
    expect(spyEmit).not.toHaveBeenCalled();
  });

  it('delete()', () => {
    const spy = spyOn(component.deleteSelected, 'emit').and.callThrough();

    component.delete();

    expect(spy).toHaveBeenCalledWith();
  });
});
