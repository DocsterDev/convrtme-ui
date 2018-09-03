import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  // TODO A Build for prod: ng build --aot --prod --base-href=./

  private host = 'ec2-52-53-165-205.us-west-1.compute.amazonaws.com';

  // private host = 'localhost';
  private port = '8083';
  private streamPort = '8084';

  constructor() { }

  public getAddress() {
    return 'http://' + this.host + ':' + this.port;
  }

  public getStreamAddress() {
    return 'http://' + this.host + ':' + this.streamPort;
  }
}
