import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.sass']
})
export class SideNavComponent implements OnInit {

  public active;

  public navOptions = [{display: 'Audio', value: 'audio'}, {display: 'Video', value: 'video'}, {display: 'YouTube', value: 'youtube'}];

  constructor(private router: Router) {
  }

  ngOnInit() {

  }

  public navigate(value) {
    console.log('Navigating to index: ' + value);
    // Navigate to target
    // this.active = value;
    this.active = value;
    this.router.navigate(['app', value]);
  }

}
