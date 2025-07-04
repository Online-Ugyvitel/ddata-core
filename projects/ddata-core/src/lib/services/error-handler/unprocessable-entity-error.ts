import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

export class UnprocessableEntity extends DdataCoreError {

  constructor(
    originalError: any,
    notificationService: NotificationService,
  ) {
    super(originalError);
    console.error('Unprocessable Entry Error: ', originalError.error.message);
    
    // Try to extract specific error message from the response
    let errorMessage = 'Nem feldolgozható kérés'; // fallback message
    
    if (!!originalError.error) {
      if (!!originalError.error.message) {
        errorMessage = originalError.error.message;
      } else if (typeof originalError.error === 'string') {
        errorMessage = originalError.error;
      }
    }
    
    notificationService.add('Hiba', errorMessage, 'danger' as NotificationType);
  }

}
