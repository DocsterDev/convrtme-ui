import { Component, OnInit } from '@angular/core';
import {AudioPlayerService} from './audio-player.service';

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

  constructor(private audioPlayerService: AudioPlayerService) { }

  ngOnInit() {

    this.progress = 1;

    this.audioPlayerService.triggerNowPlayingEmitter$.subscribe((e) => {
      this.showNowPlayingBar = true;
      this.video = e;
    });

    this.audioPlayerService.triggerHideEmitter$.subscribe(() => {
      this.showNowPlayingBar = false;
      this.video = null;
    });

  }

  public seekNext () {
    this.progress++;
  }

  public seekPrev () {
    this.progress--;
  }

}
