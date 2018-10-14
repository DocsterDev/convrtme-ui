import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class EventBusService {

  public notificationCenterEvent$: EventEmitter<any>;
  public deviceListenerEvent$: EventEmitter<any>;
  public searchModeEvent$: EventEmitter<any>;

  constructor() {
    this.notificationCenterEvent$ = new EventEmitter();
    this.deviceListenerEvent$ = new EventEmitter();
    this.searchModeEvent$ = new EventEmitter();
  }

  public triggerNotificationCenterEvent(isNotificationCenterModeEnabled: boolean): void {
    this.notificationCenterEvent$.emit(isNotificationCenterModeEnabled);
  }

  public triggerDeviceListener(isMobile: boolean): void {
    this.deviceListenerEvent$.emit(isMobile);
  }

  public triggerSearchModeEvent(isSearchMode: boolean): void {
    this.searchModeEvent$.emit(isSearchMode);
  }

  public isDeviceMobile() {
    return window.innerWidth < 768;
  }
}
