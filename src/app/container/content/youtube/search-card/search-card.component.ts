import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.sass']
})
export class SearchCardComponent implements OnInit {

  @Input()
  content: any;

  @Output()
  addVideo = new EventEmitter<any>();

  lastUpdated;

  constructor() {

  }

  ngOnInit() {
    this.lastUpdated = moment(this.content.timestamp);
  }

  /**
   * Fire event content selected to be added
   */
  selectContent(content) {
    console.log(content.videoId);
    this.addVideo.emit(content);
  }

}
