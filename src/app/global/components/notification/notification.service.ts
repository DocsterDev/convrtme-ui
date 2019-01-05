import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class NotificationService {

  public notificationEmitter$: EventEmitter<any>;

  constructor() {
    this.notificationEmitter$ = new EventEmitter();
  }

  public showNotification (notification): void {
    this.notificationEmitter$.emit(notification);
  }

}
