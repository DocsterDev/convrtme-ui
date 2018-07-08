import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from "./config.service";

@Injectable()
export class ContextService {

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  authenticate() {
    return this.http.post(this.config.getAddress() + '/api/context/authenticate', null);
  }

}
