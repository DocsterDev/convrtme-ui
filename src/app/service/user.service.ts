import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UserService {

  private currentUser = 'c5cf388e-261f-46d9-aa83-3d9764e36983';

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  register(email: string, pin: string) {



    const headers = new Headers();
    headers.append('email', 'jeffreysapia@gmail.com');
    headers.append('pin', '1234');
    return this.http.post(this.config.getAddress() + '/api/context/register', headers);

  }

  authenticate() {
    return this.http.post(this.config.getAddress() + '/api/context/authenticate', null);
  }

}
