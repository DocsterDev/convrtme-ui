import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {AudioPlayerService} from '../../../../global/audio-player/audio-player.service';
import {UtilsService} from "../../../../service/utils.service";

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
  public added = new EventEmitter<any>();
  public duration: string;
  public nowPlaying: boolean;
  public nowLoading: boolean;

  public lastUpdated;

  constructor(
    private audioPlayerService: AudioPlayerService,
    private utilsService: UtilsService) {
  }

  ngOnInit() {
    this.lastUpdated = moment(this.video.timestamp);
    this.audioPlayerService.triggerTogglePlayingEmitter$.subscribe((e) => {
      this.nowPlaying = false;
        if (e.toggle === false) {
        return;
      }
      if (e.videoId === this.video.videoId) {
        this.nowPlaying = true;
      }
    });
    this.audioPlayerService.triggerToggleLoadingEmitter$.subscribe((e) => {
      if (e.videoId === this.video.videoId) {
        this.nowLoading = e.toggle;
      }
    });
    this.duration = this.utilsService.formatTime(this.video.playDuration);
  }

  selectContent(video) {
    this.selected.emit(video);
  }

  addedContent(event, video) {
    event.stopPropagation();
    console.log(JSON.stringify(video));

    this.added.emit(video);
  }

}
