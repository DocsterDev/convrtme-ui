import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {HeaderService} from "./header.service";

@Injectable()
export class VideoService {

  constructor(private http: HttpClient, private config: ConfigService, private headerService: HeaderService) { }

  updateVideoMetadata(video: any) {
    return this.http.put(this.config.getAddress() + '/api/videos/' + video.id + '/metadata', video, this.headerService.getTokenHeader());
  }

}
