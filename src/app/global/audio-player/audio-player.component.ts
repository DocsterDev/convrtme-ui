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

  constructor(private audioPlayerService: AudioPlayerService,
              private youtubeDownloadService: YoutubeDownloadService) {
  }

  ngOnInit() {

    this.progress = '1';
    this.isPlaying = false

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
    let self = this;
    if (this.video) {
      this.showNowPlayingBar = false;
    } else {
      this.showNowPlayingBar = true;
    }
    if (this.activeSound) {
      this.activeSound.stop();
    }
    this.youtubeDownloadService.downloadVideo(video).subscribe((videoResponse) => {
      this.video = videoResponse;
      this.videoInfo = this.video.videoInfo;
      this.activeSound = new Howl({
        src: [this.video.source],
        html5: true,
        onplay: () => {
          this.isPlaying = true;
          this.duration = this.formatTime(this.activeSound.duration());
          requestAnimationFrame(self.step.bind(self));
          this.showNowPlayingBar = true;
        },
        onpause: () => {
          this.isPlaying = false;
        }
      });
      this.activeSound.play();
    });
  }

  private formatTime (seconds) {
    //return moment.utc(seconds*1000).format('HH:mm:ss');
    return moment.utc(seconds*1000).format('mm:ss');
  }

  private step () {
    const self = this;

    // Determine our current seek position.
    let seek = this.activeSound.seek() || 0;
    this.timer = self.formatTime(Math.round(seek));
    this.progress = (((seek / this.activeSound.duration()) * 100) || 0);

    // If the sound is still playing, continue stepping.
    if (this.activeSound.playing()) {
      requestAnimationFrame(self.step.bind(self));
    }
  }

}
