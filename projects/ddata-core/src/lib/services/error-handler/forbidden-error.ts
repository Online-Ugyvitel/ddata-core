import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

export class ForbiddenError extends DdataCoreError {
  constructor(originalError: any, notificationService: NotificationService) {
    super(originalError);

    console.error('403 - Forbidden Error: ', originalError.error.message, originalError);

    notificationService.add(
      'Hiba',
      'Nincs engedélyed ezt a műveletet végrehajtani.',
      'danger' as NotificationType
    );
  }
}
