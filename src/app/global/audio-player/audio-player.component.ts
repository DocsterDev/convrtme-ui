import {Component, OnInit} from '@angular/core';
import {AudioPlayerService} from './audio-player.service';
import {Howl, Howler} from 'howler';
import {YoutubeDownloadService} from '../../service/youtube-download.service';
import * as moment from 'moment';
import {NotificationService} from '../notification/notification.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.sass']
})
export class AudioPlayerComponent implements OnInit {

  public showNowPlayingBar: boolean;
  public video: any;
  public videoInfo = {};
  public isPlaying: boolean;
  public progress;
  public duration: string;
  public timer: string;

  private videoIdStr: string;

  private activeSound: Howler;

  public isLoading: boolean;
  private videoServiceSub;
  private videoServiceLock: boolean;

  static formatTime (seconds) {
    return moment.utc(seconds * 1000).format('m:ss');
  }

  constructor(private audioPlayerService: AudioPlayerService,
              private youtubeDownloadService: YoutubeDownloadService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.progress = '0';
    this.isPlaying = false;
    this.audioPlayerService.triggerNowPlayingEmitter$.subscribe(($event) => {
      this.playMedia($event);
    });
  }

  public toggle() {
    if (!this.isPlaying) {
      this.activeSound.play();
    } else {
      this.activeSound.pause();
    }
  }

  public seekNext() {
    // if (this.progress > 100) {
    //   return;
    // }
    // this.progress++;
  }

  public seekPrev() {
    // if (this.progress < 0) {
    //   return;
    // }
    // this.progress--;
  }

  public playMedia(video) {
    if (this.videoServiceSub && this.videoServiceLock === true) {
      this.videoServiceSub.unsubscribe();
      console.log('Cancelling current service call');
      return;
    }
    this.videoServiceLock = true;
    this.audioPlayerService.triggerToggleLoading({videoId: video.videoId, toggle: true});
    this.showNowPlayingBar = false;
    this.progress = '0';
    if (this.activeSound) {
      this.activeSound.stop();
    }
    this.isLoading = true;
    this.isPlaying = false;
    this.videoServiceSub = this.youtubeDownloadService.downloadVideo(video).subscribe((videoResponse) => {
      this.video = videoResponse;
      this.videoInfo = this.video.videoInfo;
      if (this.video.contentType && this.video.contentType.indexOf('video') > -1) {
        this.notificationService.showNotification({
          type: 'warn', message: 'This is not an audio only stream! File may be huge at ' + this.video.size + '!'
        });
      }
      // if (this.video.size && this.video.size > 10000000) {
      //   this.notificationService.showNotification({
      //     type: 'warn', message: 'This video is over 10MB! It is ' + this.video.size + ' bytes!'
      //   });
      // }
      this.activeSound = new Howl({
        src: [this.video.source],
        html5: true,
        onplay: () => {
          this.duration = AudioPlayerComponent.formatTime(this.activeSound.duration());
          this.isPlaying = true;
          this.showNowPlayingBar = true;
          this.isLoading = false;
          this.audioPlayerService.triggerToggleLoading({videoId: this.videoInfo.id, toggle: false});
          this.videoServiceLock = false;
          requestAnimationFrame(this.step.bind(this));
        },
        onpause: () => {
          this.isPlaying = false;
        },
        onplayerror: (e) => {
          console.log(e);
        },
        onloaderror: (e) => {
          console.log(e);
        },
        onend: () => {
          this.isPlaying = false;
        },
        onload: () => {
          this.isLoading = false;
        }
      });
      this.activeSound.play();
    }, () => { this.showNowPlayingBar = false; this.isLoading = false; }, () => {
      this.videoServiceLock = false;
    });
  }

  private step () {
    const seek = this.activeSound.seek() || 0;
    this.timer = AudioPlayerComponent.formatTime(Math.round(seek));
    this.progress = (((seek / this.activeSound.duration()) * 100) || 0);

    if (this.activeSound.playing()) {
      requestAnimationFrame(this.step.bind(this));
    }
  }

}
