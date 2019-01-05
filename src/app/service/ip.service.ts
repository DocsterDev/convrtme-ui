import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class IpService {

  constructor(private http: HttpClient) {
  }

  getCurrentIp() {
    return this.http.get('http://ip-api.com/json');
  }

}
