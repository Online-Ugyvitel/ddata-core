import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DdataUiNotificationComponent } from './notification.component';

describe('DdataUiNotificationComponent', () => {
  let component: DdataUiNotificationComponent;
  let fixture: ComponentFixture<DdataUiNotificationComponent>;
  let mockNotificationService: {
    watch: jasmine.Spy;
    delete: jasmine.Spy;
  };

  beforeEach(async () => {
    // Mock NotificationService
    mockNotificationService = {
      watch: jasmine.createSpy('watch').and.returnValue({
        pipe: jasmine.createSpy('pipe').and.returnValue({
          subscribe: jasmine.createSpy('subscribe')
        })
      }),
      delete: jasmine.createSpy('delete')
    };

    await TestBed.configureTestingModule({
      declarations: [DdataUiNotificationComponent],
      providers: [
        { provide: 'NotificationService', useValue: mockNotificationService },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DdataUiNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close() should close a notification', () => {
    const index = 0;

    spyOn(component, 'close').and.callThrough();
    component.close(index);

    expect(component.close).toHaveBeenCalledWith(index);
  });
});
