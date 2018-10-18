import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class StreamPrefetchService {

  constructor(private http: HttpClient) {
  }

  prefetchStreamUrl(videoId: string) {
    return this.http.get(environment.apiUrl + '/api/videos/' + videoId + '/metadata/prefetch');
  }
}
