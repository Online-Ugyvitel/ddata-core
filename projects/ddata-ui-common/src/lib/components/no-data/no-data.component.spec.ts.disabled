import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DdataUiNoDataComponent } from './no-data.component';
import { DdataUiCommonModule } from '../../ddata-ui-common.module';

xdescribe('DdataUiNoDataComponent', () => {
  let component: DdataUiNoDataComponent;
  let fixture: ComponentFixture<DdataUiNoDataComponent>;
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
      declarations: [ DdataUiNoDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    DdataUiCommonModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(DdataUiNoDataComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
  });
  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('icons should contain the created component', () => {
    component = new DdataUiNoDataComponent();
    expect((component as any).icons).toContain(component.randomIcon);
  });
});
