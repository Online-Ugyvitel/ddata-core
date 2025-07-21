import { Observable } from 'rxjs';
import { NotificationInterface } from '../../models/notification/notification.interface';

export interface NotificationServiceInterface {
  watch(): Observable<Array<NotificationInterface>>;

  add(title: string, text: string, type: string): void;

  delete(index: number): void;

  showValidationError(fields: any): void;
}
