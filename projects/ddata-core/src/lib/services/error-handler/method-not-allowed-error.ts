/* eslint-disable @typescript-eslint/no-explicit-any */
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

export class MethodNotAllowedError extends DdataCoreError {
  constructor(originalError: any, notificationService: NotificationService) {
    super(originalError);
    console.error('Method Not Allowed Error: ', originalError.error.message);
    notificationService.add('Hiba', 'A funkció nem érhető el.', 'danger' as NotificationType);
  }
}
