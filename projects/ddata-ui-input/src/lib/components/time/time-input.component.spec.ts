import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { DdataCoreModule } from 'ddata-core';
import { DdataInputTimeComponent } from './time-input.component';

declare const document: Document;

describe('NoDataComponent', () => {
  let component: DdataInputTimeComponent;
  let fixture: ComponentFixture<DdataInputTimeComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let debugElement: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let element: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
      teardown: { destroyAfterEach: false }
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DdataInputTimeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    DdataCoreModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(DdataInputTimeComponent);
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

  it('should set the time', () => {
    component.field = 'api_endpoint';
    const fakeparameter = 'test';

    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component.model as any).api_endpoint
    ).toBe('you/must/be/define/api_endpoint/in/your/model');
    component.setTime(fakeparameter);

    expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component.model as any).api_endpoint
    ).toBe(fakeparameter);
  });
});
