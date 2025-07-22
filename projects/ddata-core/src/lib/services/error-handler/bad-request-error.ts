/* eslint-disable @typescript-eslint/no-explicit-any */
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

export class BadRequest extends DdataCoreError {
  constructor(originalError: any, notificationService: NotificationService) {
    super(originalError);
    console.error('Bad Request Error: ', originalError.error.message);
    notificationService.add(
      'Hiba',
      'Valami hiba történt a szerveren!<br>Kérlek próbáld meg később',
      'danger' as NotificationType
    );
  }
}
