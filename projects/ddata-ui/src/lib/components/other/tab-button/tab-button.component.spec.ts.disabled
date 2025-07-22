import 'zone.js/testing';
import { Injector, Renderer2, ElementRef, RendererStyleFlags2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { AppModule } from 'src/app/app.module';
import { TabButtonComponent } from './tab-button.component';
import { TabService } from 'src/app/services/tab/tab.service';
import { TabsetComponent, TabsetConfig } from 'ngx-bootstrap/tabs';

class FakeRenderer2 extends Renderer2 {
  get data(): { [key: string]: any; } { return null; }
  destroy(): void {}
  createElement() {}
  createComment() {}
  createText() {}
  appendChild(): void {}
  insertBefore(): void {}
  removeChild(): void {}
  selectRootElement() {}
  parentNode() {}
  nextSibling() {}
  setAttribute(): void {}
  removeAttribute(): void {}
  addClass(): void {}
  removeClass(): void {}
  setStyle(): void {}
  removeStyle(): void {}
  setProperty(): void {}
  setValue(): void {}
  listen(): () => void { throw new Error('Method not implemented.'); }
}

xdescribe('TabButtonComponent', () => {
  let component: TabButtonComponent;
  let fixture: ComponentFixture<TabButtonComponent>;
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
      declarations: [TabButtonComponent],
      providers: [
        Injector,
        TabService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(TabButtonComponent);
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

  it('previousTab() method should call moveInTabsLeft and switchButtonName', () => {
    component.tabSetComponent = new TabsetComponent(new TabsetConfig(), new FakeRenderer2(), new ElementRef('something'));
    component.service = new TabService();

    const fakeSpy = spyOn(component.service, 'moveInTabsLeft');
    const fakeSpy2 = spyOn((component as any), 'switchButtonName');

    component.previousTab();
    expect(fakeSpy).toHaveBeenCalledWith(component.tabSetComponent);
    expect(fakeSpy2).toHaveBeenCalledWith(component.tabSetComponent);
  });

  it('nextTab() method should call moveInTabsRight and switchButtonName', () => {
    component.tabSetComponent = new TabsetComponent(new TabsetConfig(), new FakeRenderer2(), new ElementRef('something'));
    component.service = new TabService();

    const fakeSpy = spyOn(component.service, 'moveInTabsRight');
    const fakeSpy2 = spyOn((component as any), 'switchButtonName');

    component.nextTab();
    expect(fakeSpy).toHaveBeenCalledWith(component.tabSetComponent);
    expect(fakeSpy2).toHaveBeenCalledWith(component.tabSetComponent);
  });

  it('switchButtonName() method should do things', () => {
    const fakeTabset = new TabsetComponent(new TabsetConfig(), new FakeRenderer2(), new ElementRef('something'));
    component.service = new TabService();

    expect(component.lastTab).toBeUndefined();
    expect(component.currentTab).toBe(0);
    expect(component.tabLength).toBeUndefined();

    (component as any).switchButtonName(fakeTabset);

    expect(component.lastTab).toBe(true);
    expect(component.currentTab).toBe(-1);
    expect(component.tabLength).toBe(0);
  });
});
