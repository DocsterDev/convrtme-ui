import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class StreamValidatorService {

  constructor(private http: HttpClient) {
  }

  public validateMediaStream(videoId: string) {
    return this.http.get(environment.apiUrl + '/api/videos/' + videoId + '/validate');
  }

}
