import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class MetadataService {

  constructor(private http: HttpClient) {
  }

  public addMetadata(user: string, metadata: any) {
    return this.http.post('http://jeff-staging.mynetgear.com:8080/users/' + user + '/metadata', metadata);
  }

  public getMetadata(user: string) {
    return this.http.get('http://jeff-staging.mynetgear.com:8080/users/' + user + '/metadata');
  }

  public updateMetadata(user: string, metadata: any) {
    return this.http.put('http://jeff-staging.mynetgear.com:8080/users/' + user + '/metadata/' + metadata.uuid, metadata);
  }

  public deleteMetadata(user: string, uuid: string) {
    this.http.delete('http://jeff-staging.mynetgear.com:8080/users/' + user + '/metadata/' + uuid);
  }

}
