/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';
import { NotificationInterface } from '../../models/notification/notification.interface';
import { NotificationOptionsInterface } from './notification-options.interface';

export interface NotificationServiceInterface {
  /**
   * @deprecated emits the whole, cumulated list after every change; use `added()` to get each notification once.
   */
  watch(): Observable<Array<NotificationInterface>>;

  added(): Observable<NotificationInterface>;

  add(
    title: string,
    text: string,
    type: string,
    options?: NotificationOptionsInterface
  ): NotificationInterface;

  remove(notification: NotificationInterface): void;

  delete(index: number): void;

  showValidationError(fields: any): void;
}
