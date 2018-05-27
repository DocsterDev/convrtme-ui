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

  public lastUpdated;

  constructor() {
  }

  ngOnInit() {
    this.lastUpdated = moment(this.video.timestamp);
  }

  selectContent(video) {
    this.selected.emit(video);
  }

}
