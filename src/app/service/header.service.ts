import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorageService} from "ngx-webstorage";

@Injectable()
export class HeaderService {

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {

  }

  public getTokenHeader() {
    const token = this.localStorage.retrieve('token');

    if (token) {
      return {
        headers: new HttpHeaders({
          'token':  token
        })
      };
    } else {
      return null;
    }
  }

}
