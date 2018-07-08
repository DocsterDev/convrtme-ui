import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';

@Injectable()
export class PlaylistService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  createPlaylist(playlist: any) {
    return this.http.post(this.config.getAddress() + '/api/videos/playlists', playlist);
  }

  getPlaylist(playlistUuid: any) {
    return this.http.get(this.config.getAddress() + '/api/videos/playlists/' + playlistUuid);
  }

  getPlaylists() {
    return this.http.get(this.config.getAddress() + '/api/videos/playlists');
  }

  updatePlaylists(playlists: any) {
    return this.http.put(this.config.getAddress() + '/api/videos/playlists', playlists);
  }

  setActive(playlistUuid: any) {
    return this.http.put(this.config.getAddress() + '/api/videos/playlists/' + playlistUuid + '/active', null);
  }

  deletePlaylist(userUuid: string, playlistUuid: any) {
    return this.http.delete(this.config.getAddress() + '/api/playlists/' + playlistUuid);
  }

}
