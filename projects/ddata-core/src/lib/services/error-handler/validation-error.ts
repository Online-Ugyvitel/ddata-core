/* eslint-disable @typescript-eslint/no-explicit-any */
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

export class AppValidationError extends DdataCoreError {
  constructor(originalError: any, notificationService: NotificationService) {
    super(originalError);

    console.error('Validation Error: ', originalError.error);
    let str = 'Valamelyik adatmező nem a megfeleő formátumú';

    if (!!originalError.error.errors) {
      str = Object.values(originalError.error.errors).join('<br>');
    }

    if (!!originalError.error.invalids) {
      str = `A következő mezők rosszul lettek kitöltve:<br>${originalError.error.invalids.join(', ')}`;
    }

    notificationService.add('Hiba', str, 'danger' as NotificationType);
  }
}
