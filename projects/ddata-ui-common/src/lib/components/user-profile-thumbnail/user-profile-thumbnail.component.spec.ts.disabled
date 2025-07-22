import 'zone.js/testing';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DdataUiCommonModule } from '../../ddata-ui-common.module';
import { DdataUiUserThumbnailComponent } from './user-profile-thumbnail.component';

xdescribe('DdataUiUserThumbnailComponent', () => {
  let component: DdataUiUserThumbnailComponent;
  let fixture: ComponentFixture<DdataUiUserThumbnailComponent>;
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
      declarations: [DdataUiUserThumbnailComponent],
      providers: [
        Injector
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    DdataUiCommonModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(DdataUiUserThumbnailComponent);
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

  it('getThumbnailContent() method should call getFirstLetter', () => {
    const fakeSpy = spyOn((component as any), 'getFirstLetter');
    expect(fakeSpy).toHaveBeenCalled();
  });

  it('getFirstLetter() method should return with the user name\'s first letter  ', () => {
    const fakeSpy = spyOn((String.prototype as any), 'split').and.callThrough();
    const fakeSpy2 = spyOn((String.prototype as any), 'toUpperCase').and.callThrough();
    expect((component as any).getFirstLetter()).toBe('X');
    expect(fakeSpy).toHaveBeenCalled();
    expect(fakeSpy2).toHaveBeenCalled();

    const fakeModel = {name: 'Anybody'};
    component.user = fakeModel;
    expect((component as any).getFirstLetter()).toBe('A');
  });
});
