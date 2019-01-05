import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {HeaderService} from './header.service';

@Injectable()
export class StreamPrefetchService {

  constructor(private http: HttpClient, private headerService: HeaderService) {
  }

  prefetchStreamUrl(videoId: string) {
    return this.http.get(environment.apiUrl + '/api/videos/' + videoId + '/stream', this.headerService.getTokenHeader());
  }

  updateVideoWatched(videoId: string) {
    return this.http.put(environment.apiUrl + '/api/videos/' + videoId + '/metadata', null, this.headerService.getTokenHeader());
  }

  updateVideoPosition(videoId: string, position: number) {
    return this.http.put(environment.apiUrl + '/api/videos/' + videoId + '/position?position=' + position, null, this.headerService.getTokenHeader());
  }
}
