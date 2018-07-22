import {EventEmitter, Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UserService {

  public validUser: boolean = false;
  public userSignedInEmitter$: EventEmitter<any>;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.userSignedInEmitter$ = new EventEmitter();
  }

  public triggerUserSignedInEvent(user): void {
    this.userSignedInEmitter$.emit(user);
  }

  public setUserValid(valid) {
    this.validUser = valid;
  }

  public register(email: string, pin: string, ip: string, city: string, region: string) {
    const user = {
      email: email,
      pin: pin,
      ip: ip,
      city: city,
      region: region
    };
    return this.http.post(this.config.getAddress() + '/api/user/register', user);
  }

  public authenticate() {
    return this.http.post(this.config.getAddress() + '/api/context/authenticate', null);
  }

}
