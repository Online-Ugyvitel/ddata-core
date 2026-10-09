/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationType } from '../../models/base/base-data.type';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { NotificationInterface } from '../../models/notification/notification.interface';
import { Notification } from '../../models/notification/notification.model';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
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
    expect(service).toBeTruthy();
    expect(typeof service.watch().subscribe).toBe('function');
  });

  describe('add()', () => {
    it('should add a notification with the given data', fakeAsync(() => {
      service.add('Title', 'Text', success);

      expect(emissions.length).toBe(1);
      expect(lastEmission().length).toBe(1);
      expect(lastEmission()[0]).toBeInstanceOf(Notification);
      expect(lastEmission()[0].title).toBe('Title');
      expect(lastEmission()[0].text).toBe('Text');
      expect(lastEmission()[0].type).toBe(success);
      expect(lastEmission()[0].createdTime).toBeInstanceOf(Date);
      tick(7000);
    }));

    it('should keep the order of multiple notifications', fakeAsync(() => {
      service.add('Title 1', 'Text 1', success);
      service.add('Title 2', 'Text 2', warning);

      expect(emissions.map((emission) => emission.length)).toEqual([1, 2]);
      expect(lastEmission().map((notification) => notification.title)).toEqual(['Title 1', 'Title 2']);
      tick(7000);
    }));

    it('should remove the notification automatically after 7 seconds', fakeAsync(() => {
      service.add('Title', 'Text', success);

      tick(6999);

      expect(lastEmission().length).toBe(1);

      tick(1);

      expect(lastEmission().length).toBe(0);
    }));

    it('should not remove another notification when one was already deleted manually', fakeAsync(() => {
      service.add('First', 'Text', success);
      service.add('Second', 'Text', success);
      service.delete(0);

      tick(7000);

      // the first timeout must not delete anything, the second removes the remaining notification
      expect(lastEmission().length).toBe(0);
      expect(emissions.map((emission) => emission.length)).toEqual([1, 2, 1, 0]);
    }));
  });

  describe('delete()', () => {
    const addThree = (): void => {
      service.add('Title 1', 'Text 1', success);
      service.add('Title 2', 'Text 2', success);
      service.add('Title 3', 'Text 3', success);
      emissions.length = 0;
    };

    it('should delete the notification at the given index and emit the rest', fakeAsync(() => {
      addThree();

      service.delete(1);

      expect(lastEmission().map((notification) => notification.title)).toEqual(['Title 1', 'Title 3']);
      tick(7000);
    }));

    it('should ignore invalid indexes', fakeAsync(() => {
      addThree();

      service.delete(-1);
      service.delete(10);

      expect(emissions.length).toBe(0);
      tick(7000);
    }));
  });

  describe('showValidationError()', () => {
    const modelWith = (fields: Array<string>): BaseModelInterface<any> =>
      ({ getValidatedErrorFields: () => fields }) as unknown as BaseModelInterface<any>;

    it('should add a danger notification that lists the invalid fields', fakeAsync(() => {
      service.showValidationError(modelWith(['Field 1', 'Field 2', 'Field 3']));

      expect(lastEmission().length).toBe(1);
      expect(lastEmission()[0].type).toBe('danger');
      expect(lastEmission()[0].title).toBe('Hiba');
      expect(lastEmission()[0].text).toBe(
        'A következő mezők rosszul lettek kitöltve:<br>Field 1, Field 2, Field 3'
      );
      tick(7000);
    }));

    it('should handle an empty and a single field list', fakeAsync(() => {
      service.showValidationError(modelWith([]));
      service.showValidationError(modelWith(['Single Field']));

      expect(lastEmission()[0].text).toBe('A következő mezők rosszul lettek kitöltve:<br>');
      expect(lastEmission()[1].text).toBe('A következő mezők rosszul lettek kitöltve:<br>Single Field');
      tick(7000);
    }));
  });
});
