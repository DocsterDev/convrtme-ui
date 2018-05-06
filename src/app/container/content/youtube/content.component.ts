import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {ViewService} from "../../services/view.service";
import {VideoService} from "../../services/video.service";
import {UserService} from "../../services/user.service";
import {WebSocketService} from '../../services/web-socket.service';
import { Howl } from 'howler';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass']
})
export class ContentComponent implements OnInit, OnDestroy {

  public contentList = [];
  public videoList = [];
  subscription: Subscription;

  constructor(private viewService: ViewService, private videoService: VideoService, private userService: UserService,
              private webSocketService: WebSocketService) {

  }

  ngOnInit() {

    // Connect to web socket
    this.webSocketService.connect();

    // Subscribe to video list
    this.videoService.getUserVideos(this.userService.getCurrentUser()).subscribe((response) => {
      this.videoList = response.json();
    }, (error) => {
      console.log(JSON.stringify(error));
    });
    // Subscribe to the observable for the service response
    this.subscription = this.viewService.getResultList().subscribe((response) => {
      this.loadIncrementally(response.json(), this.contentList);
    }, (error) => {
      console.error(JSON.stringify(error));
    });
  }

  private loadIncrementally(data, list) {
    data.forEach((e, index) => {
      const delay = Math.floor((Math.random() * 1300));
      setTimeout(this.updateComponent, delay, e, index, list);
    });
  }

  private updateComponent(component, index, list) {
    component.index = index;
    list.push(component);
  }


  /**
   * Video added event
   */
  onAddVideoEvent($event) {
    let contains = false;
    this.videoList.forEach((e) => {
      if (e.videoId === $event.videoId) {
        contains = true;
        return;
      }
    });
    if (contains === false) {
      const video = {
        uuid: $event.videoId,
        videoId: $event.videoId,
        title: $event.title.simpleText,
        owner: $event.ownerText.runs[0].text
      }
      setTimeout(() => this.videoList.push(video));
      // Add video to user video list
      this.videoService.addUserVideo(this.userService.getCurrentUser(), video);

      // Begin download of video
      this.videoService.downloadUserVideo(video.videoId).subscribe((response) => {
       console.log('Video download started for ' + response.json().downloadUrl);

        setTimeout(function (){
          Howler.mobileAutoEnable = true;
          Howler.usingWebAudio = true;
          const sound = new Howl({
            src: [response.json().downloadUrl],
            //src: ['assets/audio/greendayminority.webm'],
            html5: false,

            format: ['webm']
          });
          sound.play();
        });

      }, (error) => {
        console.log(JSON.stringify(error));
      });
    }
  }

  /**
   * Video deleted event
   */
  onDeleteVideoEvent($event) {
    this.videoList.forEach((e, index) => {
      if (e.videoId === $event) {
        this.videoList.splice(index, 1);
        return;
      }
    });
    this.videoService.deleteUserVideo(this.userService.getCurrentUser(), $event);
  }

  /*
   * Video downloading event (Connect to web socket)
   */
  onDownloadVideoEvent($event) {



  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
