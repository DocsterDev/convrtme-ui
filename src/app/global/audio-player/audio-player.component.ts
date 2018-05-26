import { Component, OnInit } from '@angular/core';
import {AudioPlayerService} from './audio-player.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.sass']
})
export class AudioPlayerComponent implements OnInit {

  public showNowPlayingBar: boolean;
  public name: string;

  constructor(private audioPlayerService: AudioPlayerService) { }

  ngOnInit() {

    this.audioPlayerService.triggerNowPlayingEmitter$.subscribe((e) => {
      this.showNowPlayingBar = true;
      this.name = e;
    });

  }

}
