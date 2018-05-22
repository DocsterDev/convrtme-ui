import {Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {YoutubeSearchService} from "../../../service/youtube-search.service";
import {YoutubeDownloadService} from "../../../service/youtube-download.service";
import {AutoCompleteService} from "../../../service/autocomplete.service";
import {Howl, Howler} from 'howler';

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

  public showLoader;
  public videoList = [];
  subscription: Subscription;
  private timeout;
  private sound;

  @ViewChild('queryInput')
  queryInput: ElementRef;

  constructor(private autoCompleteService: AutoCompleteService,
              private viewService: YoutubeSearchService,
              private youtubeDownloadService: YoutubeDownloadService) {}

  ngOnInit() {

    this.viewService.search('sandman mgtow');

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
    this.youtubeDownloadService.downloadUserVideo($event.videoId).subscribe((response) => {
      const body = response.json();
      console.log(JSON.stringify(body.url));
      // Setup the new Howl.
      if (this.sound) {
        this.sound.stop();
      }
      this.sound = new Howl({
        src: [body.url],
        html5: true
      });
      this.sound.play();
    }, (error) => {
      console.error(JSON.stringify(error));
    });
  }

  /**
   * Handle query input text change
   */
  handleQueryLookup() {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.autoCompleteService.getAutoComplete(this.searchQuery).subscribe((response) => {
          const searchResults = response.json();
          if (response.ok && this.searchQuery !== '') {
            this.queryItems = [];
            searchResults.forEach((e) => this.queryItems.push(e));
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
    this.searchQuery = '';
  }

  /**
   * Handle submitted search
   */
  handleSubmitSearch() {
    this.videoList = [];
    this.toggleQueryContainer = false;
    this.viewService.search(this.searchQuery);
    this.searchQuery = '';
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }

}
