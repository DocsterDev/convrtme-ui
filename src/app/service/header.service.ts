import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorageService} from "ngx-webstorage";
import {RequestOptions} from "@angular/http";

@Injectable()
export class HeaderService {

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {

  }

  public getTokenHeader() {
    const token = this.localStorage.retrieve('token');
    console.log('TOKEN: ' + token);
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
