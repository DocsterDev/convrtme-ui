import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import moment = require('moment');
import {ConfigService} from './config.service';

@Injectable()
export class YoutubeDownloadService {

  static formatDuration (duration) {
    if (duration.length > 5) {
      return moment(duration, 'h:mm:ss').diff(moment().startOf('day'), 'seconds');
    }
    return moment(duration, 'm:ss').diff(moment().startOf('day'), 'seconds');
  }

  static findNewBadge(video: any) {
    if (video.badges && video.badges.length > 0) {
      video.badges.forEach((e) => {
        if (e.metadataBadgeRenderer.label === 'NEW') {
          return true;
        }
      });
    }
    return false;
  }

  constructor(private http: HttpClient, private config: ConfigService) { }

  downloadVideo(video: any) {
    const videoMetadata = {
      videoId: video.videoId,
      title: video.title,
      owner: video.owner,
      viewCount: video.viewCount,
      publishedTimeAgo: video.publishedTimeAgo,
      duration: YoutubeDownloadService.formatDuration(video.duration),
      currentTime: moment(),
      newUpload: YoutubeDownloadService.findNewBadge(video)
    };
    return this.http.post(this.config.getAddress() + '/api/youtube/videos/' + videoMetadata.videoId + '/download', videoMetadata);
  }



}
