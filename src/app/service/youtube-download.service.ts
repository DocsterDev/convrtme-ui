import { Injectable } from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class YoutubeDownloadService {

  constructor(private http: Http) { }

  downloadUserVideo(videoId: string) {
    return this.http.get('http://localhost:8080/api/youtube/videos/' + videoId + '/download');
  }

}
