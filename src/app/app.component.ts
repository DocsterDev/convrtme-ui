import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {LocalStorageService} from 'ngx-webstorage';
import {UserService} from './service/user.service';
import {UtilsService} from './service/utils.service';
import {Subscription} from 'rxjs/Subscription';
import {IpService} from './service/ip.service';
import {EventBusService} from "./service/event-bus.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {

  private userRegisterSubscription: Subscription;
  private userAuthenticateSubscription: Subscription;
  private ipSubscription: Subscription;

  private userInfo: any = {};

  private isMobile: boolean;

  private scrollTimeout: any;
  private isScrolling: boolean;

  private retryCount: number = 0;

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    const isMobile = window.innerWidth < 768;
    if (isMobile !== this.isMobile) {
      this.isMobile = isMobile;
      this.eventBusService.triggerDeviceListener(this.isMobile);
    }
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => {
      if (this.isScrolling) {
        this.isScrolling = false;
        this.eventBusService.triggerScrollEvent(this.isScrolling);
      }
    }, 350);
    if (!this.isScrolling) {
      this.isScrolling = true;
      this.eventBusService.triggerScrollEvent(this.isScrolling);
    }
  }

  constructor(
    private localStorage: LocalStorageService,
    private userService: UserService,
    private ipService: IpService,
    private eventBusService: EventBusService) {
  }

  ngOnInit() {
    this.ipSubscription = this.ipService.getCurrentIp().subscribe((response1) => {
      this.userInfo = response1;
      this.initAuthentication();
    }, (error) => {
      console.error('Could not fetch IP address / city /region for current user');
      this.initAuthentication();
    });
  }

  private initAuthentication() {
    const token = this.localStorage.retrieve('token');
    if (!token) {
      const fakeEmail = UtilsService.generateUUID() + '@gmail.com';
      const fakePin = '1234'
      this.userRegisterSubscription = this.userService.register(fakeEmail, fakePin, this.userInfo).subscribe((resp) => {
        this.handleSuccess(resp);
      }, (error) => {
        console.error('AUTH REGISTRATION ERROR' + JSON.stringify(error));
        this.handleError();
      });
    } else {
      this.userAuthenticateSubscription = this.userService.authenticate(this.userInfo).subscribe((resp) => {
        this.handleSuccess(resp);
      }, (error) => {
        console.error('AUTH AUTHENTICATE ERROR' + JSON.stringify(error));
        this.handleError();
      });
    }
    // this.localStorage.clear('token');
    // this.localStorage.clear('email');
  }

  private handleSuccess(resp) {
    this.localStorage.store('token', resp.token);
    const user = resp.user;
    if (user) {
      this.userService.triggerUserSignedInEvent({email: user.email, valid: true});
      this.localStorage.store('email', user.email);
      this.userService.setUserValid(true);
    }
  }

  private handleError() {
    this.userService.triggerUserSignedInEvent({valid: false});
    this.localStorage.clear('token');
    this.localStorage.clear('email');
    this.userService.setUserValid(false);
    console.error('Authentication error. Retrying...');
    if (this.retryCount < 3) {
      this.initAuthentication();
      this.retryCount++;
    } else {
      console.error('Cannot authorize user and user context');
    }
  }

  ngOnDestroy() {
    this.userRegisterSubscription.unsubscribe();
    this.userAuthenticateSubscription.unsubscribe();
    this.ipSubscription.unsubscribe();
  }

}
