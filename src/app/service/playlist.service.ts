import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {HeaderService} from "./header.service";

@Injectable()
export class PlaylistService {

  private resultList = new Subject<any>();

  constructor(private http: HttpClient, private config: ConfigService, private headerService: HeaderService) { }

  getPlaylists() {
    return this.http.get(this.config.getAddress() + '/api/playlists', this.headerService.getTokenHeader());
  }

  getPlaylist(playlistUuid: string) {
    return this.http.get(this.config.getAddress() + '/api/playlists/' + playlistUuid);
  }

  getPlaylistVideos(playlistUuid: string) {
    return this.http.get(this.config.getAddress() + '/api/playlists/' + playlistUuid + '/videos', this.headerService.getTokenHeader());
  }

  updateVideos(playlistUuid: any, videos: any) {
    return this.http.put(this.config.getAddress() + '/api/playlists/' + playlistUuid + '/videos', videos, this.headerService.getTokenHeader());
  }

  deleteVideo(playlistUuid: any, videoId: any) {
    return this.http.delete(this.config.getAddress() + '/api/playlists/' + playlistUuid + '/videos/' + videoId);
  }

  getResultList(): Observable<any> {
    return this.resultList.asObservable();
  }

  // public getPlaylistVideosEffect(videoId: string) {
  //   if (!videoId) {
  //     return;
  //   }
  //   this.getPlaylistVideos(videoId).subscribe((response) => {
  //     this.resultList.next(response);
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }
}
