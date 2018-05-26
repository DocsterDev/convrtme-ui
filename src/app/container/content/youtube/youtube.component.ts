import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {YoutubeDownloadService} from '../../../service/youtube-download.service';
import {Howl, Howler} from 'howler';
import {YoutubeSearchService} from '../../../service/youtube-search.service';
import {YoutubeAutoCompleteService} from '../../../service/youtube-autocomplete.service';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.sass']
})
export class YoutubeComponent implements OnInit, OnDestroy {

  public showPredictionsContainer: boolean;
  public predictions: Array<string>;
  public searchQuery: string;
  public togglePlayFooter = false;
  public showLoader: boolean;
  public videoList = [];

  private searchResultsSubscription: Subscription;
  private predictionsTimeout;
  private activeSound: Howler;
  private activeSoundComponent: number = null;

  @ViewChild('searchInput')
  public searchInput: ElementRef;

  static updateComponent(component, index, list) {
    component.index = index;
    list.push(component);
  }

  constructor(private youtubeAutoCompleteService: YoutubeAutoCompleteService,
              private youtubeSearchService: YoutubeSearchService,
              private youtubeDownloadService: YoutubeDownloadService) {
  }

  ngOnInit() {
    this.youtubeSearchService.search('mgtow');
    this.searchResultsSubscription = this.youtubeSearchService.getResultList().subscribe((searchResults) => {
      this.loadIncrementally(searchResults, this.videoList);
    }, (error) => {
      console.error(JSON.stringify(error));
    });

  }

  private loadIncrementally(data, list) {
    data.forEach((e, index) => {
      const delay = Math.floor((Math.random() * 1400));
      setTimeout(YoutubeComponent.updateComponent, delay, e, index, list);
    });
  }

  public handlePredictionSelect($event, index: number) {
    this.togglePlayFooter = false;
    this.activeSoundComponent = index;
    if (this.activeSound) {
      this.activeSound.stop();
    }
    this.youtubeDownloadService.downloadUserVideo($event.videoId).subscribe((response) => {
      this.togglePlayFooter = true;
      console.log('Is audio file only: ' + response.audioOnly);
      this.activeSound = new Howl({
        src: [response.url],
        html5: true
      });
      this.activeSound.play();
    }, (error) => {
      console.log(error.message);
    });
  }

  public handleAutoCompleteLookup(searchQuery) {
    clearTimeout(this.predictionsTimeout);
    if (searchQuery === '') {
      this.showPredictionsContainer = false;
      this.predictions = [];
      return;
    }
    this.predictionsTimeout = setTimeout(() => {
      this.youtubeAutoCompleteService.getAutoComplete(searchQuery).subscribe((autoCompleteResponse) => {
          this.predictions = [];
          autoCompleteResponse[1].forEach((e) => this.predictions.push(e));
          this.showPredictionsContainer = true;
        }, (error) =>
          console.error(JSON.stringify(error))
      );
    });
  }

  @HostListener('window:click') onClick() {
    if (this.showPredictionsContainer && this.searchInput.nativeElement !== document.activeElement) {
      this.showPredictionsContainer = false;
    }
  }

  public handleSubmitSearch(searchQuery) {
    this.videoList = [];
    console.log('Search query: ' + searchQuery);
    this.showPredictionsContainer = false;
    this.youtubeSearchService.search(searchQuery);
    this.searchQuery = '';
  }

  ngOnDestroy() {
    this.searchResultsSubscription.unsubscribe();
  }

}
