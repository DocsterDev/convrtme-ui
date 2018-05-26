import {Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {YoutubeDownloadService} from "../../../service/youtube-download.service";
import {AutoCompleteService} from "../../../service/autocomplete.service";
import {Howl, Howler} from 'howler';
import {YoutubeSearchService} from "../../../service/youtube-search.service";

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.sass']
})
export class YoutubeComponent implements OnInit, OnDestroy {

  @Input()
  searchQuery;

  @Input()
  queryItems = [];

  @Input()
  toggleQueryContainer = false;

  public togglePlayFooter = false;

  public showLoader;
  public videoList = [];
  private subscription: Subscription;
  private timeout;
  private sound;
  public activeComponent: number = null;

  public showNotificationHeader = false;
  public message: string;

  @ViewChild('queryInput')
  queryInput: ElementRef;

  constructor(private autoCompleteService: AutoCompleteService,
              private youtubeSearchService: YoutubeSearchService,
              private youtubeDownloadService: YoutubeDownloadService) {}

  ngOnInit() {
    this.youtubeSearchService.search('sandman mgtow');
    // Subscribe to the observable for the service response
    this.subscription = this.youtubeSearchService.getResultList().subscribe((response) => {
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

  public handleSelect($event, index: number) {
    this.showNotificationHeader = false;
    this.togglePlayFooter = false;
    this.activeComponent = index;
    if (this.sound) {
      this.sound.stop();
    }
    this.youtubeDownloadService.downloadUserVideo($event.videoId).subscribe((response) => {
      const body = response.json();
      this.togglePlayFooter = true;
      this.showNotificationHeader = false;
      this.message = '';
      this.sound = new Howl({
        src: [body.url],
        html5: true
      });
      this.sound.play();
    }, (error) => {
      this.showNotificationHeader = true;
      this.message = error.json().message;
    });
  }

  /**
   * Handle query input text change
   */
  handleQueryLookup() {
    clearTimeout(this.timeout);
    if (this.searchQuery === '') {
      this.toggleQueryContainer = false;
      this.queryItems = [];
      return;
    }
    this.timeout = setTimeout(() => {
      this.autoCompleteService.getAutoComplete(this.searchQuery).subscribe((response) => {
          const searchResults = response.json();
          if (response.ok) {
            this.queryItems = [];
            searchResults[1].forEach((e) => this.queryItems.push(e));
            this.toggleQueryContainer = true;
          } else {
            this.toggleQueryContainer = false;
          }
        }, (error) =>
          console.error(JSON.stringify(error))
      );
    });
  }

  /**
   * Close search item container on outside click
   */
  @HostListener('window:click') onClick() {
    if (this.toggleQueryContainer && this.queryInput.nativeElement !== document.activeElement) {
      this.toggleQueryContainer = false;
    }
  }

  /**
   * Handle query item clicked
   */
  handleQueryItemClick(item) {
    this.toggleQueryContainer = false;
    this.searchQuery = item;
  }

  /**
   * Handle submitted search
   */
  handleSubmitSearch() {
    this.videoList = [];
    this.toggleQueryContainer = false;
    this.youtubeSearchService.search(this.searchQuery);
    this.searchQuery = '';
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }

}
