import {Component, Input, OnInit} from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
