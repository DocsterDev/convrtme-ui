import {ErrorHandler, Injectable} from '@angular/core';

@Injectable()
export class NotificationService {

  public showNotificationHeader = false;
  public message: string;

  constructor() { }

}
