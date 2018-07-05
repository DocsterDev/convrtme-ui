import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';

@Injectable()
export class PlaylistService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  createPlaylist(playlist: any) {
    return this.http.post(this.config.getAddress() + '/api/videos/playlists', playlist);
  }

  getPlaylist(userUuid: string, playlistUuid: any) {
    return this.http.get(this.config.getAddress() + '/api/playlists/' + playlistUuid);
  }

  getPlaylists(userUuid: string) {
    return this.http.get(this.config.getAddress() + '/api/playlists');
  }

  updatePlaylist(userUuid: string, playlistUuid: any, playlist: any) {
    return this.http.put(this.config.getAddress() + '/api/playlists/' + playlistUuid, playlist);
  }

  deletePlaylist(userUuid: string, playlistUuid: any) {
    return this.http.delete(this.config.getAddress() + '/api/playlists/' + playlistUuid);
  }

}
