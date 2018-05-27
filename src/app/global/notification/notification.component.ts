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
  private notificationTimeout;

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit() {

    this.notificationService.notificationEmitter$.subscribe((message) => {
      clearTimeout(this.notificationTimeout);
      this.showNotificationHeader = true;
      this.message = message;
      this.notificationTimeout = setTimeout(() => {
        this.showNotificationHeader = false;
        this.message = '';
      }, 3000);
    });

  }

}
