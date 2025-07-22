/* eslint-disable @typescript-eslint/no-explicit-any */
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

export class NotFoundError extends DdataCoreError {
  constructor(originalError: any, notificationService: NotificationService) {
    super(originalError);
    console.error('Not Found Error: ', originalError.error.message);
    notificationService.add(
      'Hiba',
      'A keresett oldal nem található.',
      'danger' as NotificationType
    );
  }
}
