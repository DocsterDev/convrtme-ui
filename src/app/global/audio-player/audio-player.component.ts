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
  public progress;
  public duration: string;
  public timer: string;

  private activeSound: Howler;

  public isLoading: boolean = false;
  public isPlaying: boolean = false;
  private videoServiceSub;
  private videoServiceLock: boolean = false;

  static formatTime (seconds) {
    if (seconds >= 3600) {
      return moment.utc(seconds * 1000).format('h:mm:ss');
    }
    return moment.utc(seconds * 1000).format('m:ss');
  }

  constructor(private audioPlayerService: AudioPlayerService,
              private youtubeDownloadService: YoutubeDownloadService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.progress = '0';
    this.audioPlayerService.triggerVideoEventEmitter$.subscribe((e) => {
      this.playMedia(e);
    });
    this.audioPlayerService.triggerTogglePlayingEmitter$.subscribe((e) => {
      this.isPlaying = e.toggle;
    });
    this.audioPlayerService.triggerToggleLoadingEmitter$.subscribe((e) => {
      this.isLoading = e.toggle;
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
    if (this.videoServiceLock === true) {
      console.log('Cant select another video right now');
      return;
    }
    this.videoServiceLock = true;
    this.showNowPlayingBar = false;
    this.progress = '0';
    if (this.activeSound) {
      this.activeSound.stop();
    }
    this.audioPlayerService.triggerToggleLoading({videoId: video.videoId, toggle: true});
    this.audioPlayerService.triggerTogglePlaying({videoId: video.videoId, toggle: false});
    this.videoServiceSub = this.youtubeDownloadService.downloadVideo(video).subscribe(
      (videoResponse) => {
        this.video = videoResponse;
        this.buildAudioObject(this.video);
        this.activeSound.play();
      },
      (error) => {
        this.showNowPlayingBar = false;
        this.videoServiceLock = false;
        this.audioPlayerService.triggerToggleLoading({videoId: video.videoId, toggle: false});
        this.audioPlayerService.triggerTogglePlaying({videoId: video.videoId, toggle: false});
      });
  }

  private buildAudioObject (video) {
    this.activeSound = new Howl({
      src: ['http://localhost:8080/api/stream/' + video.videoId],
      html5: true,
      onplay: () => {
        this.duration = AudioPlayerComponent.formatTime(video.duration);
        this.showNowPlayingBar = true;
        this.audioPlayerService.triggerTogglePlaying({videoId: video.videoId, toggle: true});
        this.videoServiceLock = false;
        requestAnimationFrame(this.step.bind(this));
      },
      onpause: () => {
        // Leave this as an exception
        this.isPlaying = false;
      },
      onplayerror: (e) => {
        console.log(e);
      },
      onloaderror: (e) => {
        console.log(e);
      },
      onend: () => {
        this.audioPlayerService.triggerTogglePlaying({videoId: video.videoId, toggle: false});
      },
      onload: () => {
        this.audioPlayerService.triggerToggleLoading({videoId: video.videoId, toggle: false});
      }
    });
  }

  private step () {
    const seek = this.activeSound.seek() || 0;
    this.timer = AudioPlayerComponent.formatTime(Math.round(seek));
    this.progress = (((seek / this.video.duration) * 100) || 0);

    if (this.activeSound.playing()) {
      requestAnimationFrame(this.step.bind(this));
    }
  }

}
