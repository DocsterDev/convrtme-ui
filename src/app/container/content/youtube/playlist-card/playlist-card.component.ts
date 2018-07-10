import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {AudioPlayerService} from '../../../../global/audio-player/audio-player.service';

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.sass']
})
export class PlaylistCardComponent implements OnInit {

  @Input()
  public video: any;

  @Output()
  public selected = new EventEmitter<any>();
  @Output()
  public removed = new EventEmitter<any>();
  public duration: string;
  public nowPlaying: boolean;
  public nowLoading: boolean;

  public lastUpdated;

  constructor(
    private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.lastUpdated = moment(this.video.timestamp);
    this.audioPlayerService.triggerTogglePlayingEmitter$.subscribe((e) => {
      this.nowPlaying = false;
        if (e.toggle === false) {
        return;
      }
      if (e.id === this.video.id) {
        this.nowPlaying = true;
      }
    });
    this.audioPlayerService.triggerToggleLoadingEmitter$.subscribe((e) => {
      if (e.id === this.video.id) {
        this.nowLoading = e.toggle;
      }
    });
    this.duration = this.video.duration;
  }

  selectContent(video) {
    console.log(JSON.stringify(video));
    this.selected.emit(video);
  }

  removeContent(event, video) {
    event.stopPropagation();
    this.removed.emit(video);
  }

}
