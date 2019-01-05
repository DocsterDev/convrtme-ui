import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {Subscription} from 'rxjs/Subscription';
import {IpService} from '../../../service/ip.service';
import {LocalStorageService} from 'ngx-webstorage';
import {NotificationService} from '../../../global/components/notification/notification.service';
import {Router} from '@angular/router';
import {EventBusService} from '../../../service/event-bus.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit, OnDestroy {

  public email: string;
  public password: string;

  public emailFocused: boolean;
  public passwordFocused: boolean;

  private ipSubscription: Subscription;
  private eventBusSubscription1: Subscription;
  private eventBusSubscription2: Subscription;

  public buttonLock: boolean;

  public isMobile: boolean;
  public isSearchModeEnabled: boolean;

  constructor(private userService:UserService,
              private ipService: IpService,
              private localStorage: LocalStorageService,
              private notificationService: NotificationService,
              private router: Router,
              private eventBusService: EventBusService) { }

  ngOnInit() {
    this.isMobile = this.eventBusService.isDeviceMobile();
    this.eventBusSubscription1 = this.eventBusService.deviceListenerEvent$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
    this.eventBusSubscription2 = this.eventBusService.searchModeEvent$.subscribe((isSearchModeEnabled) => this.isSearchModeEnabled = isSearchModeEnabled);
  }

  private login(ipInfo:any) {
    this.userService.login(this.email, this.password, ipInfo).subscribe((credential:any) => {
      this.localStorage.store('token', credential.token);
      this.localStorage.store('user', 'true');
      this.router.navigate(['.'], { queryParams: {} });
      this.buttonLock = false;
    }, (error) => {
      console.error(JSON.stringify(error.error.message));
      this.notificationService.showNotification({type: 'error', message: error.error.message});
      this.buttonLock = false;
    });
  }

  public onSubmit() {
    if (this.buttonLock) {
      return;
    }
    if (!this.email || !this.password) {
      this.notificationService.showNotification({type: 'error', message: 'Credential fields cannot be empty'});
      return;
    }
    this.buttonLock = true;
    this.ipSubscription = this.ipService.getCurrentIp().subscribe((ipInfo:any) => {
      this.login(ipInfo);
    }, (error) => {
      console.error('Could not fetch IP address / city /region for current user');
      this.login({});
    });
  }

  ngOnDestroy() {
    if(this.ipSubscription)
      this.ipSubscription.unsubscribe();
    this.eventBusSubscription1.unsubscribe();
    this.eventBusSubscription2.unsubscribe();
  }

}
