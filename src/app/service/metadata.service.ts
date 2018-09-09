import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class MetadataService {

  constructor(private http: HttpClient) {
  }

  public addMetadata(user: string, metadata: any) {
    return this.http.post(environment.apiUrl + '/users/' + user + '/metadata', metadata);
  }

  public getMetadata(user: string) {
    return this.http.get(environment.apiUrl + '/users/' + user + '/metadata');
  }

  public updateMetadata(user: string, metadata: any) {
    return this.http.put(environment.apiUrl + '/users/' + user + '/metadata/' + metadata.uuid, metadata);
  }

  public deleteMetadata(user: string, uuid: string) {
    this.http.delete(environment.apiUrl + '/users/' + user + '/metadata/' + uuid);
  }

}
