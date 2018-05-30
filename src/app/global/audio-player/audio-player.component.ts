import {Component, OnInit} from '@angular/core';
import {AudioPlayerService} from './audio-player.service';
import {Howl, Howler} from 'howler';
import {YoutubeDownloadService} from '../../service/youtube-download.service';
import * as moment from 'moment';

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

  private activeSound: Howler;

  public isLoading: boolean;

  private responseTimeout;

  private timeoutActive: boolean;

  private videoServiceSub;
  private videoServiceLock: boolean;

  static formatTime (seconds) {
    // return moment.utc(seconds * 1000).format('HH:mm:ss');
    return moment.utc(seconds * 1000).format('m:ss');
  }

  constructor(private audioPlayerService: AudioPlayerService,
              private youtubeDownloadService: YoutubeDownloadService) {
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
      this.isPlaying = true;
      this.activeSound.play();
    } else {
      this.isPlaying = false;
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
    }
    this.showNowPlayingBar = false;
    this.progress = '0';
    if (this.video) {
      this.isPlaying = false;
    } else {
      this.isPlaying = true;
      this.showNowPlayingBar = true;
    }
    if (this.activeSound) {
      this.activeSound.stop();
    }
    this.timeoutActive = true;
    this.isLoading = true;
    this.videoServiceLock = true;
    this.videoServiceSub = this.youtubeDownloadService.downloadVideo(video).subscribe((videoResponse) => {
      this.video = videoResponse;
      this.videoInfo = this.video.videoInfo;
      this.isLoading = false;
      this.activeSound = new Howl({
        src: [this.video.source],
        html5: true,
        onplay: () => {
          this.duration = AudioPlayerComponent.formatTime(this.activeSound.duration());
          this.isPlaying = true;
          this.showNowPlayingBar = true;
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
        }
      });
      this.activeSound.play();
      this.showNowPlayingBar = true;
    }, () => { this.showNowPlayingBar = false; this.isLoading = false; },
      () => this.videoServiceLock = false);
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
