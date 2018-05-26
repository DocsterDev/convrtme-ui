import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {YoutubeDownloadService} from '../../../service/youtube-download.service';
import {Howl, Howler} from 'howler';
import {YoutubeSearchService} from '../../../service/youtube-search.service';
import {YoutubeAutoCompleteService} from '../../../service/youtube-autocomplete.service';
import {AudioPlayerService} from '../../../global/audio-player/audio-player.service';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.sass']
})
export class YoutubeComponent implements OnInit, OnDestroy {

  public showPredictionsContainer: boolean;
  public predictions: Array<string>;
  public searchQuery: string;
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
              private youtubeDownloadService: YoutubeDownloadService,
              private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.youtubeSearchService.search('mgtow');
    this.searchResultsSubscription = this.youtubeSearchService.getResultList().subscribe((searchResults) => {
      this.loadIncrementally(searchResults, this.videoList);
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

  public handlePredictionSelect($event, index: number) {
    this.audioPlayerService.triggerHide();
    this.activeSoundComponent = index;
    if (this.activeSound) {
      this.activeSound.stop();
    }
    this.youtubeDownloadService.downloadVideo($event.videoId, $event).subscribe((videoResponse) => {
      this.audioPlayerService.triggerNowPlaying(videoResponse.videoInfo.title);
      this.activeSound = new Howl({
        src: [videoResponse.source],
        html5: true
      });
      this.activeSound.play();
    });
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
