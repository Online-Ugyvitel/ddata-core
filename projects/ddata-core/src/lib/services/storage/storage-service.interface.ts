/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';

export interface StorageServiceInterface {
  /**
   * Return a subject what represent a localstorage item. If you call StorageService's
   * `setItem()`, `removeItem()` or `clear()`, then localstorage item will be handled
   * and the observers will be notified too.
   */
  watchStorage(): Observable<any>;

  /**
   * Set an item in the localstorage and notifiy observers.
   *
   * @param key localstorage item's key
   * @param data localstorage item's data as string
   */
  setItem(key: string, data: any): void;

  /**
   * Remove an item from the localstorage and notifiy observers.
   *
   * @param key localstorage item's key
   */
  removeItem(key: any): void;

  /**
   * Clear localstorage and notifiy observers.
   */
  clear(): void;
}
