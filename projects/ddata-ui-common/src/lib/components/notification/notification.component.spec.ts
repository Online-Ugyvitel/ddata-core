import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DdataUiNotificationComponent } from './notification.component';


xdescribe('DdataUiNotificationComponent', () => {
  let component: DdataUiNotificationComponent;
  let fixture: ComponentFixture<DdataUiNotificationComponent>;

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
      declarations: [ DdataUiNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('closeModal() should close a notification', () => {
    let ref;
    spyOn((component as any).notificationService, 'deleteNotification');
    component.closeModal(ref);
    expect((component as any).notificationService.deleteNotification).toHaveBeenCalled();
  });
});
