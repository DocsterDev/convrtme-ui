import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.sass']
})
export class SearchCardComponent implements OnInit {

  @Input()
  video: any;

  @Input()
  nowPlaying: boolean;

  @Output()
  selected = new EventEmitter<any>();

  lastUpdated;

  constructor() {

  }

  ngOnInit() {
    this.lastUpdated = moment(this.video.timestamp);
  }

  /**
   * Fire event content selected to be added
   */
  selectContent(video) {
    this.nowPlaying = true;
    this.selected.emit(video);
  }

}
