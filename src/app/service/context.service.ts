import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from "./config.service";

@Injectable()
export class MetadataService {

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  public addMetadata(user: string, metadata: any) {
    return this.http.post(this.config.getAddress() + '/users/' + user + '/metadata', metadata);
  }

  public getMetadata(user: string) {
    return this.http.get(this.config.getAddress() + '/users/' + user + '/metadata');
  }

  public updateMetadata(user: string, metadata: any) {
    return this.http.put(this.config.getAddress() + '/users/' + user + '/metadata/' + metadata.uuid, metadata);
  }

  public deleteMetadata(user: string, uuid: string) {
    this.http.delete(this.config.getAddress() + '/users/' + user + '/metadata/' + uuid);
  }

}
