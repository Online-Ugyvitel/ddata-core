import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationInterface, NotificationService } from 'ddata-core';
import { of, Subject } from 'rxjs';
import { DdataUiNotificationComponent } from './notification.component';

describe('DdataUiNotificationComponent', () => {
  let component: DdataUiNotificationComponent;
  let fixture: ComponentFixture<DdataUiNotificationComponent>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  let notificationSubject: Subject<NotificationInterface[]>;

  const mockNotifications: NotificationInterface[] = [
    {
      text: 'Test notification 1',
      title: 'Test Title 1',
      type: 'success' as any,
      createdTime: new Date()
    },
    {
      text: 'Test notification 2',
      title: 'Test Title 2',
      type: 'danger' as any,
      createdTime: new Date()
    }
  ];

  beforeEach(() => {
    notificationSubject = new Subject<NotificationInterface[]>();
    
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['watch', 'delete']);
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    
    mockNotificationService.watch.and.returnValue(notificationSubject.asObservable());

    TestBed.configureTestingModule({
      declarations: [DdataUiNotificationComponent],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }
      ]
    });

    fixture = TestBed.createComponent(DdataUiNotificationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty notifications array', () => {
    expect(component._notifications).toEqual([]);
  });

  it('should set notifications via input setter', () => {
    component.notifications = mockNotifications;
    expect(component._notifications).toEqual(mockNotifications);
  });

  it('should subscribe to notification service on ngOnInit', () => {
    component.ngOnInit();
    
    expect(mockNotificationService.watch).toHaveBeenCalled();
    expect(component.subscription).toBeDefined();
  });

  it('should update notifications and trigger change detection when notification service emits', () => {
    component.ngOnInit();
    
    notificationSubject.next(mockNotifications);
    
    expect(component._notifications).toEqual(mockNotifications);
    expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
  });

  it('should unsubscribe on ngOnDestroy', () => {
    component.ngOnInit();
    const subscription = component.subscription;
    spyOn(subscription, 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should call notification service delete with correct index when close is called', () => {
    const index = 1;
    
    component.close(index);
    
    expect(mockNotificationService.delete).toHaveBeenCalledWith(index);
  });

  it('should handle multiple notification updates correctly', () => {
    component.ngOnInit();
    
    // First update
    notificationSubject.next([mockNotifications[0]]);
    expect(component._notifications).toEqual([mockNotifications[0]]);
    expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalledTimes(1);
    
    // Second update
    notificationSubject.next(mockNotifications);
    expect(component._notifications).toEqual(mockNotifications);
    expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalledTimes(2);
  });

  it('should handle empty notification array from service', () => {
    component.ngOnInit();
    
    notificationSubject.next([]);
    
    expect(component._notifications).toEqual([]);
    expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
  });
});
