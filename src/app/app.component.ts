import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  constructor(private localStorage: LocalStorageService) {
  }

  ngOnInit() {

    // On Init of this component, make sure user is signed in
    const avail = this.localStorage.isStorageAvailable();
    console.log('Available: ' + avail);

    const token = this.localStorage.retrieve('token');

    console.log('Token Value: ' + token);

    if (!token) {

      // TODO Make sure attempt to generate a new token if a token does not exist

      // TODO And use this seciton to authorize every time the page is loaded


      console.log('Setting');
      this.localStorage.store('token', 'Bro this is a test');
    }

  }

}
