import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {AudioPlayerService} from "../../../../global/audio-player/audio-player.service";

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
  public title: string;
  public thumbnail: string;
  public owner: string;
  public viewCount: string;
  public duration: string;
  public publishTimeAgo: string;

  public nowPlaying: boolean;
  public nowLoading: boolean;

  public lastUpdated;

  constructor(private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.lastUpdated = moment(this.video.timestamp);
    this.mapVideoInfo();
    this.audioPlayerService.triggerNowPlayingEmitter$.subscribe((e) => {
        if (e.videoId === this.videoId) {
          this.nowLoading = false;
          console.log('Boom video started playing videoId: ' + e.videoId);
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

  public mapVideoInfo() {
    this.videoId = this.video.videoId;
    this.title = this.video.title.simpleText;
    this.thumbnail = this.video.thumbnail.thumbnails[0].url;
    this.owner = this.video.shortBylineText.runs[0].text;
    this.viewCount = this.video.shortViewCountText.simpleText;
    this.duration = this.video.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer.text.simpleText;
    this.publishTimeAgo = this.video.publishedTimeText.simpleText;
  }

}
