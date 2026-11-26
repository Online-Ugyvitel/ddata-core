import { NotificationType } from '../base/base-data.type';
import { NotificationActionInterface, NotificationInterface } from './notification.interface';
// shared by every NotificationService instance, so an id is unique in the whole application
let lastId = 0;

export class Notification implements NotificationInterface {
  readonly id: number;
  text: string;
  title: string;
  type: NotificationType;
  createdTime: Date;
  action?: NotificationActionInterface;
  autoDeleteMs?: number | null;

  // types: warning, danger, success
  constructor(text: string, title: string, type: NotificationType, seconds: number = 5) {
    lastId += 1;
    this.id = lastId;
    this.text = text;
    this.title = title;
    this.type = type;
    this.createdTime = new Date();
    this.createdTime.setSeconds(this.createdTime.getSeconds() + seconds);
  }
}
