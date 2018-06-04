import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from "./config.service";

@Injectable()
export class VideoService {
  constructor(private http: HttpClient, private config: ConfigService) {
  }

  /**
   * Get current videos of user on startup
   */
  getUserVideos(userId: string) {
    return this.http.get(this.config.getAddress() + '/api/users/' + userId + '/videos');
  }

  /**
   * Add video by user
   */
  addUserVideo(userId: string, video: any) {
    this.http.post(this.config.getAddress() + '/api/users/' + userId + '/videos', video).subscribe((response) => {
      console.log('Video successfully added for user');
      // TODO: Potential failure points are if the video is restricted and or if it cant find it for some reason
    }, (error) => {
      // TODO Remove added video if this fails
      console.log(JSON.stringify(error));
    });
  }

  /**
   * Delete video by user
   */
  deleteUserVideo(userId: string, videoId: string) {
    this.http.delete(this.config.getAddress() + '/api/users/' + userId + '/videos/' + videoId).subscribe((response) => {
      console.log('Video successfully deleted for user');
      // TODO: Potential failure points are if the video is restricted and or if it cant find it for some reason
    }, (error) => {
      // TODO Remove added video if this fails
      console.log(JSON.stringify(error));
    });
  }

}
