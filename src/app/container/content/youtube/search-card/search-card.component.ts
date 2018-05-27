import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.sass']
})
export class SearchCardComponent implements OnInit {

  @Input()
  public video: any;

  @Input()
  public nowPlaying: boolean;

  @Output()
  public selected = new EventEmitter<any>();

  public title: string;
  public thumbnail: string;
  public owner: string;
  public viewCount: string;
  public duration: string;
  public publishTimeAgo: string;

  public lastUpdated;

  constructor() {
  }

  ngOnInit() {
    this.lastUpdated = moment(this.video.timestamp);
    this.mapVideoInfo();
  }

  selectContent(video) {
    this.selected.emit(video);
  }

  public mapVideoInfo() {
    this.title = this.video.title.simpleText;
    this.thumbnail = this.video.thumbnail.thumbnails[0].url;
    this.owner = this.video.ownerText.runs[0].text;
    this.viewCount = this.video.shortViewCountText.simpleText;
    this.duration = this.video.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer.text.simpleText;
    this.publishTimeAgo = this.video.publishedTimeText.simpleText;
  }

}
