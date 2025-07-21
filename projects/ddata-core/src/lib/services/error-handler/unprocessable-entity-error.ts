/* eslint-disable @typescript-eslint/no-explicit-any */
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

export class UnprocessableEntity extends DdataCoreError {
  constructor(originalError: any, notificationService: NotificationService) {
    super(originalError);
    console.error('Unprocessable Entry Error: ', originalError.error.message);
    notificationService.add('Hiba', 'Nem feldolgozható kérés', 'danger' as NotificationType);
  }
}
