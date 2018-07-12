import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  //private host = 'jeff-staging.mynetgear.com';
  private host = 'localhost';
  private port = '8083';



  constructor() { }

  public getAddress() {
    return 'http://' + this.host + ':' + this.port;
  }

}
