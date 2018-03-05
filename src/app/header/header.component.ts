import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {


  public navOptions = [{display: 'Community', index: 0}, {display: 'Library', index: 1}, {display: 'Premium', index: 2}];

  constructor() {
  }

  ngOnInit() {
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
