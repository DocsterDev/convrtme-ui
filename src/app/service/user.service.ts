import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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

  public register(email: string, pin: string, userLocation: any) {
    return this.http.post(environment.apiUrl + '/api/user/register?email=' + email + '&pin=' + pin, userLocation);
  }

  public authenticate(userLocation: any) {
    return this.http.post(environment.apiUrl + '/api/user/authenticate', userLocation, this.headerService.getTokenHeader());
  }

  public login(email: string, pin: string, userLocation: any) {
    const header = {
      headers: new HttpHeaders({
        'email': email,
        'pin': pin
      })
    };
    return this.http.post(environment.apiUrl + '/api/user/login', userLocation, header);
  }

}
