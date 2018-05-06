import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-queue-card',
  templateUrl: './queue-card.component.html',
  styleUrls: ['./queue-card.component.sass']
})
export class QueueCardComponent implements OnInit, AfterViewInit {

  // https://stackoverflow.com/questions/38278853/how-to-add-sockjs-into-angular-2-project

  @Input()
  video: any;

  @Output()
  deleteVideo = new EventEmitter<any>();

  lastUpdated;

  constructor() {

  }

  ngOnInit() {
    this.lastUpdated = moment(this.video.createdDate);
  }

  ngAfterViewInit () {

  }

  select() {

  }

  delete() {
    this.deleteVideo.emit(this.video.videoId);
  }

}
