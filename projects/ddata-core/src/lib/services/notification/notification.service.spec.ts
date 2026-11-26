import { TestBed } from '@angular/core/testing';
import { NotificationType } from '../../models/base/base-data.type';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { NotificationInterface } from '../../models/notification/notification.interface';
import { Notification } from '../../models/notification/notification.model';
import { NOTIFICATION_CONFIG, NotificationConfigInterface } from './notification-config.token';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  let service: NotificationService;
  let emissions: Array<Array<NotificationInterface>>;
  const success = 'success' as NotificationType;
  const warning = 'warning' as NotificationType;
  const lastEmission = (): Array<NotificationInterface> => emissions[emissions.length - 1];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
    emissions = [];
    // the service emits the same array instance, so every emission is stored as a snapshot
    service.watch().subscribe((notifications: Array<NotificationInterface>) => {
      emissions.push([...notifications]);
    });
  });

  it('should be created and expose an observable', () => {
    expect(typeof service.watch().subscribe).toBe('function');
  });

  describe('add()', () => {
    it('should add a notification with the given data', async () => {
      service.add('Title', 'Text', success);

      expect(emissions.length).toBe(1);
      expect(lastEmission().length).toBe(1);
      expect(lastEmission()[0]).toBeInstanceOf(Notification);
      expect(lastEmission()[0].title).toBe('Title');
      expect(lastEmission()[0].text).toBe('Text');
      expect(lastEmission()[0].type).toBe(success);
      expect(lastEmission()[0].createdTime).toBeInstanceOf(Date);
      await vi.advanceTimersByTimeAsync(7000);
    });

    it('should keep the order of multiple notifications', async () => {
      service.add('Title 1', 'Text 1', success);
      service.add('Title 2', 'Text 2', warning);

      expect(emissions.map((emission) => emission.length)).toEqual([1, 2]);
      expect(lastEmission().map((notification) => notification.title)).toEqual([
        'Title 1',
        'Title 2'
      ]);
      await vi.advanceTimersByTimeAsync(7000);
    });

    it('should remove the notification automatically after 7 seconds', async () => {
      service.add('Title', 'Text', success);

      await vi.advanceTimersByTimeAsync(6999);

      expect(lastEmission().length).toBe(1);

      await vi.advanceTimersByTimeAsync(1);

      expect(lastEmission().length).toBe(0);
    });

    it('should not remove another notification when one was already deleted manually', async () => {
      service.add('First', 'Text', success);
      service.add('Second', 'Text', success);
      service.delete(0);

      await vi.advanceTimersByTimeAsync(7000);

      // the first timeout must not delete anything, the second removes the remaining notification
      expect(lastEmission().length).toBe(0);
      expect(emissions.map((emission) => emission.length)).toEqual([1, 2, 1, 0]);
    });
  });

  describe('delete()', () => {
    const addThree = (): void => {
      service.add('Title 1', 'Text 1', success);
      service.add('Title 2', 'Text 2', success);
      service.add('Title 3', 'Text 3', success);
      emissions.length = 0;
    };

    it('should delete the notification at the given index and emit the rest', async () => {
      addThree();

      service.delete(1);

      expect(lastEmission().map((notification) => notification.title)).toEqual([
        'Title 1',
        'Title 3'
      ]);
      await vi.advanceTimersByTimeAsync(7000);
    });

    it('should ignore invalid indexes', async () => {
      addThree();

      service.delete(-1);
      service.delete(10);

      expect(emissions.length).toBe(0);
      await vi.advanceTimersByTimeAsync(7000);
    });
  });

  describe('remove()', () => {
    it('should delete the given notification by identity and emit the rest', () => {
      const first = service.add('First', 'Text', success);
      const second = service.add('Second', 'Text', success);

      service.remove(first);

      expect(lastEmission()).toEqual([second]);
      service.remove(second);

      expect(lastEmission()).toEqual([]);
    });

    it('should ignore a notification that is not in the list', () => {
      const first = service.add('First', 'Text', success);

      service.remove(first);
      const count = emissions.length;

      service.remove(first);
      service.remove(new Notification('Other', 'Other', success));

      expect(emissions.length).toBe(count);
    });

    it('should cancel the timer of a removed notification', async () => {
      const first = service.add('First', 'Text', success);

      service.remove(first);
      await vi.advanceTimersByTimeAsync(3000);
      const second = service.add('Second', 'Text', success);

      await vi.advanceTimersByTimeAsync(4000);

      // the cancelled 7 s timer of the first one must not touch the second one
      expect(lastEmission()).toEqual([second]);
      await vi.advanceTimersByTimeAsync(3000);

      expect(lastEmission()).toEqual([]);
    });
  });

  describe('added()', () => {
    it('should emit every notification exactly once', () => {
      const added: Array<NotificationInterface> = [];

      service.added().subscribe((notification: NotificationInterface) => added.push(notification));

      for (let index = 1; index <= 5; index++) {
        service.add(`Title ${index}`, 'Text', success);
      }

      service.delete(0);

      expect(added.map((notification) => notification.title)).toEqual([
        'Title 1',
        'Title 2',
        'Title 3',
        'Title 4',
        'Title 5'
      ]);
      expect(emissions.length).toBe(6);
    });

    it('should emit the notification that add() returns, with a unique increasing id', () => {
      const added: Array<NotificationInterface> = [];

      service.added().subscribe((notification: NotificationInterface) => added.push(notification));
      const first = service.add('First', 'Text', success);
      const second = service.add('Second', 'Text', success);

      expect(added).toEqual([first, second]);
      expect(second.id).toBeGreaterThan(first.id);
    });
  });

  describe('options', () => {
    it('should carry the action without running its handler', () => {
      const handler = vi.fn();
      const notification = service.add('Törölve', 'A bejegyzés törölve.', success, {
        action: { label: 'Visszavonás', handler }
      });

      expect(notification.action?.label).toBe('Visszavonás');
      expect(lastEmission()[0].action?.handler).toBe(handler);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should not set an action when none is given', () => {
      expect(service.add('Title', 'Text', success).action).toBeUndefined();
    });

    it('should use the per-notification delay instead of the default', async () => {
      const notification = service.add('Title', 'Text', success, { autoDeleteMs: 2000 });

      expect(notification.autoDeleteMs).toBe(2000);
      await vi.advanceTimersByTimeAsync(1999);

      expect(lastEmission().length).toBe(1);
      await vi.advanceTimersByTimeAsync(1);

      expect(lastEmission().length).toBe(0);
    });

    for (const autoDeleteMs of [null, 0, -1]) {
      it(`should keep the notification with autoDeleteMs ${autoDeleteMs}`, async () => {
        const notification = service.add('Title', 'Text', success, { autoDeleteMs });

        expect(notification.autoDeleteMs).toBeNull();
        await vi.advanceTimersByTimeAsync(60000);

        expect(lastEmission()).toEqual([notification]);
      });
    }

    it('should report the default delay on the notification', () => {
      expect(service.add('Title', 'Text', success).autoDeleteMs).toBe(7000);
    });
  });

  describe('showValidationError()', () => {
    const modelWith = (fields: Array<string>): BaseModelInterface<any> =>
      ({ getValidatedErrorFields: () => fields }) as unknown as BaseModelInterface<any>;

    it('should add a danger notification that lists the invalid fields', async () => {
      service.showValidationError(modelWith(['Field 1', 'Field 2', 'Field 3']));

      expect(lastEmission().length).toBe(1);
      expect(lastEmission()[0].type).toBe('danger');
      expect(lastEmission()[0].title).toBe('Hiba');
      expect(lastEmission()[0].text).toBe(
        'A következő mezők rosszul lettek kitöltve:<br>Field 1, Field 2, Field 3'
      );
      await vi.advanceTimersByTimeAsync(7000);
    });

    it('should handle an empty and a single field list', async () => {
      service.showValidationError(modelWith([]));
      service.showValidationError(modelWith(['Single Field']));

      expect(lastEmission()[0].text).toBe('A következő mezők rosszul lettek kitöltve:<br>');
      expect(lastEmission()[1].text).toBe(
        'A következő mezők rosszul lettek kitöltve:<br>Single Field'
      );
      await vi.advanceTimersByTimeAsync(7000);
    });
  });
});

describe('NotificationService configuration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  const success = 'success' as NotificationType;
  let current: Array<NotificationInterface>;
  const watched = (service: NotificationService): NotificationService => {
    current = [];
    service.watch().subscribe((notifications: Array<NotificationInterface>) => {
      current = [...notifications];
    });

    return service;
  };
  const serviceWith = (config: NotificationConfigInterface): NotificationService => {
    TestBed.configureTestingModule({
      providers: [{ provide: NOTIFICATION_CONFIG, useValue: config }]
    });

    return watched(TestBed.inject(NotificationService));
  };

  it('should delete after the configured delay', async () => {
    const service = serviceWith({ autoDeleteMs: 5000 });

    service.add('Title', 'Text', success);
    await vi.advanceTimersByTimeAsync(4999);

    expect(current.length).toBe(1);
    await vi.advanceTimersByTimeAsync(1);

    expect(current.length).toBe(0);
  });

  it('should let the option override the configured delay', async () => {
    const service = serviceWith({ autoDeleteMs: 5000 });
    const notification = service.add('Title', 'Text', success, { autoDeleteMs: 1000 });

    expect(notification.autoDeleteMs).toBe(1000);
    await vi.advanceTimersByTimeAsync(1000);

    expect(current.length).toBe(0);
  });

  it('should let the option enable deletion when the configuration disables it', async () => {
    const service = serviceWith({ autoDeleteMs: null });

    service.add('Title', 'Text', success, { autoDeleteMs: 1000 });
    await vi.advanceTimersByTimeAsync(1000);

    expect(current.length).toBe(0);
  });

  for (const autoDeleteMs of [null, 0]) {
    it(`should never delete with the configured autoDeleteMs ${autoDeleteMs}`, async () => {
      const service = serviceWith({ autoDeleteMs });
      const first = service.add('Siker', 'Mentve', success);

      await vi.advanceTimersByTimeAsync(60000);
      const second = service.add('Second', 'Text', success);

      await vi.advanceTimersByTimeAsync(60000);

      expect(first.autoDeleteMs).toBeNull();
      expect(current).toEqual([first, second]);
      service.remove(first);

      expect(current).toEqual([second]);
    });
  }

  it('should work without the injection token, with the 7 second default', async () => {
    watched(new NotificationService()).add('Title', 'Text', success);
    await vi.advanceTimersByTimeAsync(6999);

    expect(current.length).toBe(1);
    await vi.advanceTimersByTimeAsync(1);

    expect(current.length).toBe(0);
  });

  it('should provide the 7 second default from the root token factory', () => {
    TestBed.configureTestingModule({});

    expect(TestBed.inject(NOTIFICATION_CONFIG)).toEqual({ autoDeleteMs: 7000 });
  });
});
