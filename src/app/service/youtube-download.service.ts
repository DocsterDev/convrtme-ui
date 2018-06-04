import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import moment = require('moment');
import {ConfigService} from "./config.service";

@Injectable()
export class YoutubeDownloadService {

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
    const duration = video.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer.text.simpleText;

    const videoInfo = {
      id: video.videoId,
      title: video.title.simpleText,
      owner: video.ownerText.runs[0].text,
      viewCount: video.shortViewCountText.simpleText,
      publishedTimeAgo: video.publishedTimeText.simpleText,
      duration: moment(duration, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'),
      currentTime: moment(),
      newUpload: YoutubeDownloadService.findNewBadge(video)
    };

    return this.http.post(this.config.getAddress() + '/api/youtube/videos/' + videoInfo.id + '/download', videoInfo);
  }



}
