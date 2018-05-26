import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class YoutubeDownloadService {

  constructor(private http: HttpClient) { }

  downloadUserVideo(videoId: string) {
    return this.http.get('http://localhost:8080/api/youtube/videos/' + videoId + '/download').catch((error: Response) => { console.error(error); return Observable.throw(error); });
  }

}
