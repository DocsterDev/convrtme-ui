import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

  constructor(private http: HttpClient) { }

  downloadVideo(video: any) {
    // const videoInfo = {
    //   id: video.videoId,
    //   title: video.title.simpleText,
    //   owner: video.ownerText.runs[0].text,
    //   viewCount: video.shortViewCountText.simpleText,
    //   newUpload: YoutubeDownloadService.findNewBadge(video)
    // };
    const videoInfo = {
      id: '_jIoDZPQg_0',
      title: 'Test Video Title',
      owner: 'Jeff Sapia',
      viewCount: '12M',
      newUpload: true
    };
    return this.http.post('http://localhost:8080/api/youtube/videos/' + videoInfo.id + '/download', videoInfo);
  }



}
