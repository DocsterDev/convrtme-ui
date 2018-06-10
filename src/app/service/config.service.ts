import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  //private host = 'jeff-staging.mynetgear.com';
  private host = '192.168.0.15';
  private port = '8080';

  constructor() { }

  public getAddress() {
    return 'http://' + this.host + ':' + this.port;
  }

}
