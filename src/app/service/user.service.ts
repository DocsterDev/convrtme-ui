import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeaderService} from './header.service';
import {environment} from '../../environments/environment';

@Injectable()
export class UserService {

  public validUser: boolean = false;
  public userSignedInEmitter$: EventEmitter<any>;

  constructor(private http: HttpClient, private headerService: HeaderService) {
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
    return this.http.post(environment.apiUrl + '/api/user/register', user);
  }

  public authenticate() {
    return this.http.post(environment.apiUrl + '/api/context/authenticate', null, this.headerService.getTokenHeader());
  }

}
