import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {AudioPlayerService} from '../../../../global/audio-player/audio-player.service';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.sass']
})
export class SearchCardComponent implements OnInit {

  @Input()
  public video: any;

  @Output()
  public selected = new EventEmitter<any>();

  private videoId: string;

  public nowPlaying: boolean;
  public nowLoading: boolean;

  public lastUpdated;

  constructor(private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.lastUpdated = moment(this.video.timestamp);
    this.audioPlayerService.triggerNowPlayingEmitter$.subscribe((e) => {
        if (e.videoId === this.videoId) {
          this.nowLoading = false;
          this.nowPlaying = true;
        } else {
          this.nowPlaying = false;
        }
    });

  }

  selectContent(video) {
    this.nowLoading = true;
    this.selected.emit(video);
  }

}
