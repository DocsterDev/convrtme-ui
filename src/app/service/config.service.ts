import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigService {

  // TODO A Build for prod: ng build --aot --prod --base-href=./

  private port = '8083';
  private streamPort = '8084';

  constructor() { }

  public getAddress() {
    return 'http://' + environment.apiUrl + ':' + this.port;
  }

  public getStreamAddress() {
    return 'http://' + environment.apiUrl + ':' + this.streamPort;
  }
}
