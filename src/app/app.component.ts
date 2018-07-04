import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from 'ngx-webstorage';
import {UserService} from "./service/user.service";
import {UtilsService} from "./service/utils.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  private resp: any;

  constructor(private localStorage: LocalStorageService, private userService: UserService) {
  }

  ngOnInit() {

    // On Init of this component, make sure user is signed in
    const avail = this.localStorage.isStorageAvailable();

    const token = this.localStorage.retrieve('token');
    if (!token) {
      this.userService.register(UtilsService.generateUUID() + '@gmail.com', '1234').subscribe((response) => {
        this.resp = response;
        this.localStorage.store('token', this.resp.token);
        console.log('Email: ' + this.resp.user.email);
      });
    }

  }

}
