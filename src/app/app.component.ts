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
      this.userRegisterSubscription = this.userService.register(UtilsService.generateUUID() + '@gmail.com', '1234', this.userInfo.query, this.userInfo.city, this.userInfo.region).subscribe((response2) => {
        const resp: any = response2;
        this.localStorage.store('token', resp.token);
        this.handleSuccess(resp.user);
      }, (error) => {
        console.log('ERROR' + JSON.stringify(error));
        this.handleError();
      });
    } else {
      this.userAuthenticateSubscription = this.userService.authenticate().subscribe((response3) => {
        const resp: any = response3;
        this.handleSuccess(resp.user);
      }, (error) => {
        console.log('ERROR' + JSON.stringify(error));
        this.handleError();
      });
    }
  }

  private handleSuccess(user) {
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
  }

  ngOnDestroy() {
    this.userRegisterSubscription.unsubscribe();
    this.userAuthenticateSubscription.unsubscribe();
    this.ipSubscription.unsubscribe();
  }

}
