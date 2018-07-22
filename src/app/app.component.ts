import {Component, OnDestroy, OnInit} from '@angular/core';
import {LocalStorageService} from 'ngx-webstorage';
import {UserService} from './service/user.service';
import {UtilsService} from './service/utils.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {

  private userRegisterSubscription: Subscription;
  private userAuthenticateSubscription: Subscription;

  constructor(private localStorage: LocalStorageService, private userService: UserService) {
  }

  ngOnInit() {
    setTimeout(() => {
      const token = this.localStorage.retrieve('token');
      if (!token) {
        this.userRegisterSubscription = this.userService.register(UtilsService.generateUUID() + '@gmail.com', '1234').subscribe((response) => {
          const resp: any = response;
          this.localStorage.store('token', resp.token);
          this.handleSuccess(resp.user);
        }, (error) => {
          console.log('ERROR' + JSON.stringify(error));
          this.handleError();
        });
      } else {
        this.userAuthenticateSubscription = this.userService.authenticate().subscribe((response) => {
          const resp: any = response;
          this.handleSuccess(resp.user);
        }, (error) => {
          console.log('ERROR' + JSON.stringify(error));
          this.handleError();
        });
      }
    });
  }

  private handleSuccess(user) {
    this.userService.triggerUserSignedInEvent({email: user.email, valid: true});
    this.localStorage.store('email', user.email);
    this.userService.setUserValid(true);
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
  }

}
