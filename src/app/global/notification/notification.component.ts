import {Component, OnInit} from '@angular/core';
import {NotificationService} from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.sass']
})
export class NotificationComponent implements OnInit {

  public showNotificationHeader: boolean;
  public message: string;
  public type: string;
  private notificationTimeout;

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit() {

    this.notificationService.notificationEmitter$.subscribe((notification) => {
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

}
