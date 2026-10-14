import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationInterface, NotificationService } from '@netdjw/ddata-core';
import { Subject } from 'rxjs';
import { DdataUiNotificationComponent } from './notification.component';

describe('DdataUiNotificationComponent', () => {
  let component: DdataUiNotificationComponent;
  let fixture: ComponentFixture<DdataUiNotificationComponent>;
  let mockNotificationService: any;
  let mockChangeDetectorRef: any;
  let notificationSubject: Subject<Array<NotificationInterface>>;
  const mockNotifications: Array<NotificationInterface> = [
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
    notificationSubject = new Subject<Array<NotificationInterface>>();

    mockNotificationService = {
      watch: vi.fn().mockName('NotificationService.watch'),
      delete: vi.fn().mockName('NotificationService.delete')
    };

    mockNotificationService.watch.mockReturnValue(notificationSubject.asObservable());

    TestBed.configureTestingModule({
      declarations: [DdataUiNotificationComponent],
      providers: [{ provide: NotificationService, useValue: mockNotificationService }]
    });

    fixture = TestBed.createComponent(DdataUiNotificationComponent);
    component = fixture.componentInstance;
    // the component receives the change detector of its own view, so the method is spied on that instance
    mockChangeDetectorRef = (
      component as unknown as {
        ref: any;
      }
    ).ref;
    vi.spyOn(mockChangeDetectorRef, 'detectChanges').mockReturnValue(undefined);
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

    vi.spyOn(subscription, 'unsubscribe').mockReturnValue(undefined);

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

describe('DdataUiNotificationComponent rendering', () => {
  let fixture: ComponentFixture<DdataUiNotificationComponent>;
  let service: NotificationService;
  let element: HTMLElement;
  const type = (value: string): NotificationInterface['type'] =>
    value as NotificationInterface['type'];
  const alerts = (): Array<HTMLElement> =>
    Array.from(element.querySelectorAll<HTMLElement>('.notification.alert'));
  const titles = (): Array<string> =>
    alerts().map((alert: HTMLElement) => alert.querySelector('strong').textContent.trim());

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      declarations: [DdataUiNotificationComponent],
      providers: [NotificationService]
    });

    service = TestBed.inject(NotificationService);
    fixture = TestBed.createComponent(DdataUiNotificationComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render nothing while there is no notification', () => {
    expect(element.querySelector('.notification-container')).not.toBeNull();
    expect(alerts()).toEqual([]);
  });

  it.each(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'])(
    'should render a %s notification with only its own alert class',
    (notificationType: string) => {
      service.add('Title', 'Body', type(notificationType));
      const [alert] = alerts();
      const alertClasses = Array.from(alert.classList).filter((name: string) =>
        name.startsWith('alert-')
      );

      expect(alertClasses).toEqual([`alert-${notificationType}`]);
      expect(alert.getAttribute('role')).toBe('alert');
      expect(alert.getAttribute('aria-live')).toBe('assertive');
    }
  );

  it('should not add any alert type class for an unknown type', () => {
    service.add('Title', 'Body', type('unknown'));
    const [alert] = alerts();

    expect(Array.from(alert.classList).filter((name: string) => name.startsWith('alert-'))).toEqual(
      []
    );
  });

  it('should render the title as text and the body as HTML', () => {
    service.add('<b>Title</b>', 'Line 1<br><em>Line 2</em>', type('info'));
    const [alert] = alerts();

    expect(alert.querySelector('strong').textContent.trim()).toBe('<b>Title</b>');
    expect(alert.querySelector('.notification-body em').textContent).toBe('Line 2');
    expect(alert.querySelector('.notification-body br')).not.toBeNull();
  });

  it('should render several notifications at once in the order they were added', () => {
    service.add('First', 'a', type('success'));
    service.add('Second', 'b', type('danger'));
    service.add('Third', 'c', type('warning'));

    expect(titles()).toEqual(['First', 'Second', 'Third']);
  });

  it('should remove only the clicked notification when its close button is clicked', () => {
    service.add('First', 'a', type('success'));
    service.add('Second', 'b', type('danger'));
    service.add('Third', 'c', type('warning'));

    alerts()[1].querySelector<HTMLButtonElement>('button.close').click();

    expect(titles()).toEqual(['First', 'Third']);

    alerts()[0].querySelector<HTMLButtonElement>('button.close').click();

    expect(titles()).toEqual(['Third']);
  });

  it('should dismiss every notification automatically after 7 seconds', () => {
    service.add('First', 'a', type('success'));
    vi.advanceTimersByTime(3000);
    service.add('Second', 'b', type('danger'));

    vi.advanceTimersByTime(3999);

    expect(titles()).toEqual(['First', 'Second']);

    vi.advanceTimersByTime(1);

    expect(titles()).toEqual(['Second']);

    vi.advanceTimersByTime(3000);

    expect(titles()).toEqual([]);
  });

  it('should keep the other notifications when a closed one would have been auto-dismissed', () => {
    service.add('First', 'a', type('success'));
    service.add('Second', 'b', type('danger'));

    alerts()[0].querySelector<HTMLButtonElement>('button.close').click();
    vi.advanceTimersByTime(6999);

    expect(titles()).toEqual(['Second']);

    vi.advanceTimersByTime(1);

    expect(titles()).toEqual([]);
  });

  it('should render notifications given through the input', () => {
    fixture.componentRef.setInput('notifications', [
      { title: 'From input', text: 'text', type: type('light'), createdTime: new Date() }
    ]);
    fixture.detectChanges();

    expect(titles()).toEqual(['From input']);
    expect(alerts()[0].classList).toContain('alert-light');
  });

  it('should stop rendering service updates after it is destroyed', () => {
    const component = fixture.componentInstance;

    fixture.destroy();
    service.add('Late', 'text', type('info'));

    expect(component._notifications).toEqual([]);
  });

  it('should not fail when destroyed before ngOnInit ran', () => {
    const notInitialized = TestBed.createComponent(DdataUiNotificationComponent);

    expect(() => notInitialized.componentInstance.ngOnDestroy()).not.toThrow();
  });
});
