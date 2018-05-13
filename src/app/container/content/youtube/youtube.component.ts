import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {YouTubeQueryService} from '../../../service/youtube-query.service';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.sass']
})
export class YoutubeComponent implements OnInit, OnDestroy {

  public showLoader;
  public contentList = [];
  public videoList = [];
  subscription: Subscription;

  constructor(private youtubeQueryService: YouTubeQueryService) {}

  ngOnInit() {

    // Subscribe to video list
    // this.videoService.getUserVideos(this.userSvc.getCurrentUser()).subscribe((response) => {
    //   this.videoList = response.json();
    // }, (error) => {
    //   console.log(JSON.stringify(error));
    // });

    // Subscribe to the observable for the service response
    // this.subscription = this.viewService.getResultList().subscribe((response) => {
    //   this.loadIncrementally(response.json(), this.contentList);
    // }, (error) => {
    //   console.error(JSON.stringify(error));
    // });
    /**
     * TESTING DEVELOPMENT ONLY
     */
    this.youtubeQueryService.getSearchResults('green day').subscribe((response) => {
      console.log(JSON.stringify(response));
      // const resp = response;
      this.videoList = response.json();
      this.loadIncrementally(response.json(), this.videoList);
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

  public onAddVideoEvent($event) {
    console.log('Adding Video ' + $event);
  }

  ngOnDestroy () {
    // this.youtubeQueryService.unsubscribe();
  }

}
