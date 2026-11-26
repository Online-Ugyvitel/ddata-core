import { NotificationType } from '../base/base-data.type';

export interface NotificationActionInterface {
  label: string;
  handler: () => void;
}

export interface NotificationInterface {
  /**
   * Unique, increasing identifier, always set by `Notification`; optional so that existing object literals of
   * this interface stay valid.
   */
  id?: number;
  text: string;
  title: string;
  type: NotificationType;
  createdTime: Date;
  action?: NotificationActionInterface;
  /**
   * The effective automatic deletion delay in milliseconds; `null` when the notification stays until removed.
   */
  autoDeleteMs?: number | null;
}
