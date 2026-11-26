/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NotificationType } from '../../models/base/base-data.type';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { NotificationInterface } from '../../models/notification/notification.interface';
import { Notification } from '../../models/notification/notification.model';
import {
  DEFAULT_NOTIFICATION_AUTO_DELETE_MS,
  NOTIFICATION_CONFIG,
  NotificationConfigInterface
} from './notification-config.token';
import { NotificationOptionsInterface } from './notification-options.interface';
import { NotificationServiceInterface } from './notification-service.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements NotificationServiceInterface {
  private readonly notifications: Array<NotificationInterface> = [];
  private readonly notificationSub: Subject<Array<NotificationInterface>> = new Subject<
    Array<NotificationInterface>
  >();

  private readonly addedSub: Subject<NotificationInterface> = new Subject<NotificationInterface>();
  private readonly timers = new Map<NotificationInterface, ReturnType<typeof setTimeout>>();

  constructor(
    @Optional()
    @Inject(NOTIFICATION_CONFIG)
    private readonly config: NotificationConfigInterface | null = null
  ) {}

  /**
   * Adds a notification. It is deleted automatically after `options.autoDeleteMs`, otherwise after the
   * `NOTIFICATION_CONFIG` delay (7000 ms without configuration); `null` or `0` keeps it until it is removed.
   */
  add(
    title: string,
    text: string,
    type: NotificationType,
    options: NotificationOptionsInterface = {}
  ): NotificationInterface {
    const notificationModel: NotificationInterface = new Notification(text, title, type);
    const autoDeleteMs = this.autoDeleteMs(options);

    notificationModel.autoDeleteMs = autoDeleteMs;

    if (options.action) {
      notificationModel.action = options.action;
    }

    if (autoDeleteMs !== null) {
      this.timers.set(
        notificationModel,
        setTimeout(() => this.remove(notificationModel), autoDeleteMs)
      );
    }

    this.notifications.push(notificationModel);
    this.notificationSub.next(this.notifications);
    this.addedSub.next(notificationModel);

    return notificationModel;
  }

  /**
   * @deprecated emits the whole, cumulated list after every change; use `added()` to get each notification once.
   */
  watch(): Observable<Array<NotificationInterface>> {
    return this.notificationSub.asObservable();
  }

  /**
   * Emits every added notification exactly once.
   */
  added(): Observable<NotificationInterface> {
    return this.addedSub.asObservable();
  }

  /**
   * Removes the notification by identity; an unknown notification is ignored.
   */
  remove(notification: NotificationInterface): void {
    this.delete(this.notifications.indexOf(notification));
  }

  delete(index: number): void {
    if (index < 0 || index >= this.notifications.length) {
      return;
    }
    const [removed] = this.notifications.splice(index, 1);

    clearTimeout(this.timers.get(removed));
    this.timers.delete(removed);
    this.notificationSub.next(this.notifications);
  }

  showValidationError(fields: BaseModelInterface<any>): void {
    const type: NotificationType = 'danger' as NotificationType;

    this.add(
      'Hiba',
      `A következő mezők rosszul lettek kitöltve:<br>${fields
        .getValidatedErrorFields()
        .join(', ')}`,
      type
    );
  }

  /**
   * The effective delay: the option, then the configuration, then the default; `null` when disabled.
   */
  private autoDeleteMs(options: NotificationOptionsInterface): number | null {
    const configured = this.config ? this.config.autoDeleteMs : DEFAULT_NOTIFICATION_AUTO_DELETE_MS;
    const delay = options.autoDeleteMs !== undefined ? options.autoDeleteMs : configured;

    return typeof delay === 'number' && delay > 0 ? delay : null;
  }
}
