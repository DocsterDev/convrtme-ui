import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import {ConfigService} from './config.service';
import {UtilsService} from './utils.service';

@Injectable()
export class VideoMetadataService {

  constructor(private http: HttpClient, private config: ConfigService, private utilsService: UtilsService) { }

  getVideo(video: any) {
    const videoMetadata = {
      videoId: video.videoId,
      title: video.title,
      owner: video.owner,
      viewCount: video.viewCount,
      publishedTimeAgo: video.publishedTimeAgo,
      duration: this.utilsService.formatDuration(video.duration),
      currentTime: moment(),
      newUpload: this.utilsService.findNewBadge(video)
    };
    return this.http.post(this.config.getAddress() + '/api/videos/' + videoMetadata.videoId + '/metadata', videoMetadata);
  }



}
