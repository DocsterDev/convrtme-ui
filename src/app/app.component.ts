import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from 'ngx-webstorage';
import {UserService} from './service/user.service';
import {UtilsService} from './service/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {


  constructor(private localStorage: LocalStorageService, private userService: UserService) {
  }

  ngOnInit() {

    // On Init of this component, make sure user is signed in
    const avail = this.localStorage.isStorageAvailable();

    const token = this.localStorage.retrieve('token');
    if (!token) {
      this.userService.register(UtilsService.generateUUID() + '@gmail.com', '1234').subscribe((response) => {
        const resp: any = response;
        this.localStorage.store('token', resp.token);
        console.log('Email: ' + resp.user.email);
      }, (error) => {
        // console.log('BRO: ' + JSON.stringify(error));
      });
    } else {
      this.userService.authenticate().subscribe((response) => {
        const resp: any = response;
        console.log('Already Logged In: ' + resp.user.email);
      }, (error) => {
        console.log('INVALIDATING SESSION');
        this.localStorage.clear('token');
      });
    }

  }

}
