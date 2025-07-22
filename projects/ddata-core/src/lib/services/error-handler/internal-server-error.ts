/* eslint-disable @typescript-eslint/no-explicit-any */
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

export class InternalServerError extends DdataCoreError {
  constructor(originalError: any, notificationService: NotificationService) {
    super(originalError);
    console.error('Internal Server Error: ', originalError.error.message);
    notificationService.add('Hiba', 'Szerver hiba történt', 'danger' as NotificationType);
  }
}
