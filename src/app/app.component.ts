import {Component, OnDestroy, OnInit} from '@angular/core';
import {LocalStorageService} from 'ngx-webstorage';
import {UserService} from './service/user.service';
import {UtilsService} from './service/utils.service';
import {Subscription} from 'rxjs/Subscription';
import {IpService} from './service/ip.service';
import {Meta} from "@angular/platform-browser";

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

  constructor(
    private localStorage: LocalStorageService,
    private userService: UserService,
    private ipService: IpService) {
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
