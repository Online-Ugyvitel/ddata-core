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
    const spyEmit = vi.spyOn(component.emitSelected, 'emit');

    component.select();

    expect(spyEmit).toHaveBeenCalledWith();
  });

  it('create()', () => {
    const routerInstance = (
      component as unknown as {
        router: {
          navigateByUrl: () => void;
        };
      }
    ).router;
    const spy = vi.spyOn(routerInstance, 'navigateByUrl');
    const spyEmit = vi.spyOn(component.addNew, 'emit');

    component.create();

    expect(spy).toHaveBeenCalledWith();
    expect(spyEmit).not.toHaveBeenCalled();
  });

  it('delete()', () => {
    const spy = vi.spyOn(component.deleteSelected, 'emit');

    component.delete();

    expect(spy).toHaveBeenCalledWith();
  });
});
