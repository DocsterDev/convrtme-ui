import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UserService {

  public currentUser: any = null;

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  clearCurrentUser() {
    this.currentUser = null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  isUserValid(){
    return this.currentUser !== null;
  }

  register(email: string, pin: string) {
    const user = {
      email: email,
      pin: pin
    };
    return this.http.post(this.config.getAddress() + '/api/context/register', user);
  }

  authenticate() {
    return this.http.post(this.config.getAddress() + '/api/context/authenticate', null);
  }

}
