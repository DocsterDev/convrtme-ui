import {Component, OnInit} from '@angular/core';
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  public loading: boolean;
  public user: any = {};

  public navOptions = [];

  // public navOptions = [{display: 'Community', index: 0}, {display: 'Library', index: 1}, {display: 'Premium', index: 2}];

  public navOptionsMobile = [
    {display: 'Audio', icon: 'ic-volume-mute.svg', activeIcon: 'ic-volume-mute-active.svg', value: 'app/audio'},
    {display: 'Video', icon: 'ic-videocam.svg', activeIcon: 'ic-videocam-active.svg', value: 'app/video'},
    {display: 'YouTube', icon: 'ic-video-youtube.svg', activeIcon: 'ic-video-youtube-active.svg', value: 'app/youtube'}
  ];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.loading = true;
    this.userService.userSignedInEmitter$.subscribe((user) => {
      this.user = user;
      this.loading = false;
    });
  }

  public navigate(index) {
    console.log('Navigating to: ' + index);
  }

  public onSignUp() {
    console.log('On Sign Up');
  }

  public onLogIn() {
    console.log('On Log In');
  }

}
