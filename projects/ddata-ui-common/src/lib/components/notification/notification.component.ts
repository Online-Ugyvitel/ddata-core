import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { NotificationInterface, NotificationService } from 'ddata-core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dd-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DdataUiNotificationComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  // tslint:disable-next-line: variable-name
  _notifications: Array<NotificationInterface> = [];
  @Input() set notifications(notifications: Array<NotificationInterface>) {
    this._notifications = notifications;
  }

  constructor(
    private readonly notificationService: NotificationService,
    private readonly ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.notificationService
      .watch()
      .pipe(
        map((result: Array<NotificationInterface>) => {
          this._notifications = result;
          this.ref.detectChanges();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  close(index: number): void {
    this.notificationService.delete(index);
  }
}
