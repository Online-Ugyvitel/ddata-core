/* eslint-disable @typescript-eslint/no-explicit-any */
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

export class ThirdPartyError extends DdataCoreError {
  constructor(originalError: any, notificationService: NotificationService) {
    super(originalError);

    console.error('580 - API message: ', originalError.error);

    notificationService.add('Hiba', originalError.error, 'danger' as NotificationType);
  }
}
