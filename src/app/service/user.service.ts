import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UserService {

  constructor(private http: HttpClient, private config: ConfigService) {
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
