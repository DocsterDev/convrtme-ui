import { Component, OnInit } from '@angular/core';
import {MetadataService} from '../../../service/metadata.service';
import {UserService} from '../../../service/user.service';
import {VideoService} from '../../../service/video.service';
import {Subscription} from 'rxjs/Subscription';
import {ViewService} from '../../../service/view.service';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.sass']
})
export class YoutubeComponent implements OnInit {

  public showLoader;
  public contentList = [];
  public videoList = [];
  subscription: Subscription;

  constructor(private metadataSvc: MetadataService,
              private userSvc: UserService,
              private videoService: VideoService,
              private viewService: ViewService) {}

  ngOnInit() {
    this.loadDashboard();

    // Subscribe to video list
    this.videoService.getUserVideos(this.userSvc.getCurrentUser()).subscribe((response) => {
      this.videoList = response.json();
    }, (error) => {
      console.log(JSON.stringify(error));
    });
    // Subscribe to the observable for the service response
    this.subscription = this.viewService.getResultList().subscribe((response) => {
      this.loadIncrementally(response.json(), this.contentList);
    }, (error) => {
      console.error(JSON.stringify(error));
    });
  }

  private loadIncrementally(data, list) {
    data.forEach((e, index) => {
      const delay = Math.floor((Math.random() * 1300));
      setTimeout(this.updateComponent, delay, e, index, list);
    });
  }

  private updateComponent(component, index, list) {
    component.index = index;
    list.push(component);

  }

  /**
   * Load the map with key of uuid
   */
  public loadDashboard() {
    this.showLoader = true;
    this.metadataSvc.getMetadata(this.userSvc.getCurrentUser()).subscribe((response) => {
      let list: any;
      list = response;
      this.showLoader = false;
    }, (error) => {
      console.error(JSON.stringify(error));
    });
  }

}
