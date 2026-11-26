import { NotificationActionInterface } from '../../models/notification/notification.interface';

export interface NotificationOptionsInterface {
  /**
   * Overrides the configured automatic deletion delay for this notification; `null` or `0` disables it.
   */
  autoDeleteMs?: number | null;
  /**
   * An action button that the presentation layer shows and runs; the service never calls the handler.
   */
  action?: NotificationActionInterface;
}
