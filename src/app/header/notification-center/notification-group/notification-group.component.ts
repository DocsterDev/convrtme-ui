import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AudioPlayerService} from '../../../global/components/audio-player/audio-player.service';

@Component({
  selector: 'app-notification-group',
  templateUrl: './notification-group.component.html',
  styleUrls: ['./notification-group.component.sass']
})
export class NotificationGroupComponent implements OnInit {

  @Input()
  public groupVideos: any = [];

  @Input()
  public groupTitle: string;

  @Output()
  public selected = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  public selectVideo(video) {
    this.selected.emit(video);
  }

}
