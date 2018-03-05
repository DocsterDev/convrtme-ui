import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.sass']
})
export class SideNavComponent implements OnInit {

  public navOptions = [{display: 'Audio', index: 0}, {display: 'Video', index: 1}, {display: 'YouTube', index: 2}];

  constructor() {
  }

  ngOnInit() {
  }

  public navigate(index) {
    console.log('Navigating to index: ' + index);
  }

}
