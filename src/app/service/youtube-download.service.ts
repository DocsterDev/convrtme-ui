import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class YoutubeDownloadService {

  static findNewBadge(video: any) {
    video.badges.forEach((e) => {
      if (e.metadataBadgeRenderer.label === 'NEW') {
        return true;
      }
    });
    return false;
  }

  constructor(private http: HttpClient) { }

  downloadVideo(videoId: string, video: any) {
    console.log(JSON.stringify(video));
    const videoInfo = {
      id: videoId,
      title: video.title.simpleText,
      owner: video.ownerText.runs[0].text,
      viewCount: video.shortViewCountText.simpleText,
      newUpload: YoutubeDownloadService.findNewBadge(video)
    }
    return this.http.post('http://localhost:8080/api/youtube/videos/' + videoId + '/download', videoInfo);
  }



}
