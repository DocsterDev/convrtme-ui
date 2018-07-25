import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  private host = 'ec2-54-153-119-154.us-west-1.compute.amazonaws.com';
  private port = '8083';



  constructor() { }

  public getAddress() {
    return 'http://' + this.host + ':' + this.port;
  }

}
