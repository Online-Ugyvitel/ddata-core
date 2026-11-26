import { InjectionToken } from '@angular/core';

/**
 * The automatic deletion delay of a notification when neither `NOTIFICATION_CONFIG` nor the `add()` options
 * give one; it keeps the behaviour of the earlier releases.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const DEFAULT_NOTIFICATION_AUTO_DELETE_MS = 7000;

export interface NotificationConfigInterface {
  /**
   * Milliseconds after which a notification is deleted automatically; `null` or `0` keeps it until it is removed.
   */
  autoDeleteMs: number | null;
}

/**
 * Application-wide notification settings, e.g. `{ provide: NOTIFICATION_CONFIG, useValue: { autoDeleteMs: null } }`.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const NOTIFICATION_CONFIG = new InjectionToken<NotificationConfigInterface>(
  'NOTIFICATION_CONFIG',
  {
    providedIn: 'root',
    factory: (): NotificationConfigInterface => ({
      autoDeleteMs: DEFAULT_NOTIFICATION_AUTO_DELETE_MS
    })
  }
);
