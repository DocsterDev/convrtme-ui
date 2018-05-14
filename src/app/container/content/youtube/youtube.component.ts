import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {YoutubeAutoCompleteService} from '../../../service/youtube-auto-complete.service';
import {YoutubeSearchService} from '../../../service/youtube-search.service';
import {YoutubeDownloadService} from '../../../service/youtube-download.service';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.sass']
})
export class YoutubeComponent implements OnInit, OnDestroy {

  public showLoader;
  public videoList = [];
  subscription: Subscription;

  constructor(private youtubeQueryService: YoutubeAutoCompleteService,
              private viewService: YoutubeSearchService,
              private youtubeDownloadService: YoutubeDownloadService) {}

  ngOnInit() {

    this.viewService.search('green day');

    // Subscribe to the observable for the service response
    this.subscription = this.viewService.getResultList().subscribe((response) => {
      this.loadIncrementally(response.json(), this.videoList);
    }, (error) => {
      console.error(JSON.stringify(error));
    });

  }

  private loadIncrementally(data, list) {
    data.forEach((e, index) => {
      const delay = Math.floor((Math.random() * 1400));
      setTimeout(this.updateComponent, delay, e, index, list);
    });
  }

  private updateComponent(component, index, list) {
    component.index = index;
    list.push(component);
  }

  public handleSelect($event) {
    console.log('Downloading video ' + $event);
    this.youtubeDownloadService.downloadUserVideo($event.videoId).subscribe((response) => {
      console.log(JSON.stringify(response));
    }, (error) => {
      console.error(JSON.stringify(error));
    });
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }

}
