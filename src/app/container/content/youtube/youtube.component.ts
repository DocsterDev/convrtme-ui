import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Howl, Howler} from 'howler';
import {YoutubeSearchService} from '../../../service/youtube-search.service';
import {YoutubeAutoCompleteService} from '../../../service/youtube-autocomplete.service';
import {AudioPlayerService} from '../../../global/audio-player/audio-player.service';
import {YoutubeRecommendedService} from "../../../service/youtube-recommended.service";

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.sass']
})
export class YoutubeComponent implements OnInit, OnDestroy {

  public showPredictionsContainer: boolean;
  public predictions: Array<string>;
  public searchQuery: string;
  public videoList = [];
  public recommendedList = [];

  private searchResultsSubscription: Subscription;
  private recommendedResultsSubscription: Subscription;
  private predictionsTimeout;

  @ViewChild('searchInput')
  public searchInput: ElementRef;

  static updateComponent(component, index, list) {
    component.index = index;
    list.push(component);
  }

  constructor(private youtubeAutoCompleteService: YoutubeAutoCompleteService,
              private youtubeSearchService: YoutubeSearchService,
              private youtubeRecommendedService: YoutubeRecommendedService,
              private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.youtubeSearchService.search('joe rogan');
    this.searchResultsSubscription = this.youtubeSearchService.getResultList().subscribe((searchResults) => {
      this.loadIncrementally(searchResults, this.videoList);
    });
    this.youtubeRecommendedService.recommended('iZ0ln8gKvDI');
    this.recommendedResultsSubscription = this.youtubeRecommendedService.getResultList().subscribe((recommendedResults) => {
      this.loadIncrementally(recommendedResults, this.recommendedList);
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
        });
    });
  }

  public handleVideoSelect($video) {
    this.audioPlayerService.triggerVideoEvent($video);
    this.audioPlayerService.triggerToggleLoading({video: $video.videoId, toggle: true});
  }

  public handleRecommendedVideoSelect($video) {
    this.audioPlayerService.triggerVideoEvent($video);
    this.audioPlayerService.triggerToggleLoading({video: $video.videoId, toggle: true});
  }

  public handleSubmitSearch(searchQuery) {
    this.videoList = [];
    this.showPredictionsContainer = false;
    this.youtubeSearchService.search(searchQuery);
    this.searchQuery = '';
  }

  private loadIncrementally(data, list) {
    data.forEach((e, index) => {
      const delay = Math.floor((Math.random() * 1400));
      setTimeout(YoutubeComponent.updateComponent, delay, e, index, list);
    });
  }

  @HostListener('window:click') onClick() {
    if (this.showPredictionsContainer && this.searchInput.nativeElement !== document.activeElement) {
      this.showPredictionsContainer = false;
    }
  }

  ngOnDestroy() {
    this.searchResultsSubscription.unsubscribe();
  }

}
