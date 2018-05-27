import {Component, OnInit} from '@angular/core';
import {AudioPlayerService} from './audio-player.service';
import {Howl, Howler} from 'howler';
import {YoutubeDownloadService} from '../../service/youtube-download.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.sass']
})
export class AudioPlayerComponent implements OnInit {

  public showNowPlayingBar: boolean;
  public video: any;
  public isPlaying: boolean;
  public progress: number;

  private activeSound: Howler;

  constructor(private audioPlayerService: AudioPlayerService,
              private youtubeDownloadService: YoutubeDownloadService) {
  }

  ngOnInit() {

    this.progress = 1;
    this.isPlaying = true;

    this.audioPlayerService.triggerNowPlayingEmitter$.subscribe(($event) => {
      this.playMedia($event);
    });

  }

  public play() {

  }

  public pause() {

  }

  public seekNext() {
    if (this.progress > 100) {
      return;
    }
    this.progress++;
  }

  public seekPrev() {
    if (this.progress < 0) {
      return;
    }
    this.progress--;
  }

  public playMedia(video) {
    this.showNowPlayingBar = true;
    if (this.activeSound) {
      this.activeSound.stop();
    }
    this.youtubeDownloadService.downloadVideo(video).subscribe((videoResponse) => {
      this.video = videoResponse;
      console.log(JSON.stringify(this.video));
      this.activeSound = new Howl({
        src: [this.video.source],
        html5: true
      });
      this.showNowPlayingBar = true;
      this.activeSound.play();
    });
  }

}
