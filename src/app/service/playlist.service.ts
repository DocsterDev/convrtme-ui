import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';

@Injectable()
export class PlaylistService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getPlaylists() {
    return this.http.get(this.config.getAddress() + '/api/playlists');
  }

  getPlaylist(playlistUuid: string) {
    return this.http.get(this.config.getAddress() + '/api/playlists/' + playlistUuid);
  }

  updateVideos(playlistUuid: any, videos: any) {
    return this.http.put(this.config.getAddress() + '/api/playlists/' + playlistUuid + '/videos', videos);
  }

  deleteVideo(playlistUuid: any, videoId: any) {
    return this.http.delete(this.config.getAddress() + '/api/playlists/' + playlistUuid + '/videos/' + videoId);
  }

}
