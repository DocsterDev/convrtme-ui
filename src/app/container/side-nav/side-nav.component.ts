import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.sass']
})
export class SideNavComponent implements OnInit {

  public navOptions = [
    {display: 'Audio', value: 'app/audio'},
    {display: 'Video', value: 'app/video'},
    {display: 'YouTube', value: 'app/youtube'}
  ];

  constructor() {
  }

  ngOnInit() {

  }

}
