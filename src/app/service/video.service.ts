import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeaderService} from './header.service';
import {environment} from '../../environments/environment';

@Injectable()
export class VideoService {

  constructor(private http: HttpClient, private headerService: HeaderService) { }

  updateVideoMetadata(video: any) {
    return this.http.put(environment.apiUrl + '/api/videos/' + video.id + '/metadata', video, this.headerService.getTokenHeader());
  }

}
