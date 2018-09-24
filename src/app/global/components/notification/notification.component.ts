import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotificationService} from './notification.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.sass']
})
export class NotificationComponent implements OnInit, OnDestroy {

  public showNotificationHeader: boolean;
  public message: string;
  public type: string;
  private notificationTimeout;

  private notificationSubscription: Subscription;

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.notificationSubscription = this.notificationService.notificationEmitter$.subscribe((notification) => {
      clearTimeout(this.notificationTimeout);
      this.showNotificationHeader = true;
      this.message = notification.message;
      this.type = notification.type;
      this.notificationTimeout = setTimeout(() => {
        this.showNotificationHeader = false;
        this.message = '';
      }, 3000);
    });
  }

  ngOnDestroy() {
    this.notificationSubscription.unsubscribe();
  }

}
