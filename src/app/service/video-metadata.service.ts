import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {HeaderService} from "./header.service";

@Injectable()
export class VideoMetadataService {

  constructor(private http: HttpClient, private config: ConfigService, private headerService: HeaderService) { }

  getVideo(video: any) {
    return this.http.post(this.config.getAddress() + '/api/videos/' + video.id + '/metadata', video, this.headerService.getTokenHeader());
  }



}
