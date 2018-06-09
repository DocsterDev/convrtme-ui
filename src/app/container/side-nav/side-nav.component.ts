import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.sass']
})
export class SideNavComponent implements OnInit {

  public navOptions = [
    {display: 'Audio', icon: 'ic-volume-mute.svg', activeIcon: 'ic-volume-mute-active.svg', value: 'app/audio'},
    {display: 'Video', icon: 'ic-videocam.svg', activeIcon: 'ic-videocam-active.svg', value: 'app/video'},
    {display: 'YouTube', icon: 'ic-video-youtube.svg', activeIcon: 'ic-video-youtube-active.svg', value: 'app/youtube'}
  ];

  constructor() {
  }

  ngOnInit() {

  }

}
