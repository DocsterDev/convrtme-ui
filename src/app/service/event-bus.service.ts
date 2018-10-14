import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class EventBusService {

  public notificationCenterEvent$: EventEmitter<any>;
  public deviceListenerEvent$: EventEmitter<any>;
  public searchModeEvent$: EventEmitter<any>;
  public scrollEvent$: EventEmitter<any>;

  constructor() {
    this.notificationCenterEvent$ = new EventEmitter();
    this.deviceListenerEvent$ = new EventEmitter();
    this.searchModeEvent$ = new EventEmitter();
    this.scrollEvent$ = new EventEmitter();
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

  public triggerScrollEvent(isScrolling: boolean): void {
    this.scrollEvent$.emit(isScrolling);
  }

  public isDeviceMobile() {
    return window.innerWidth < 768;
  }
}
