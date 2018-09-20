import {Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer, ViewChild} from '@angular/core';
import {UserService} from '../service/user.service';
import {Subscription} from 'rxjs/Subscription';
import {VideoSearchService} from '../service/video-search.service';
import {VideoAutoCompleteService} from '../service/video-autocomplete.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public loading: boolean;
  public user: any = {};

  public predictions: Array<string>;
  private predictionsTimeout;

  public searchQuery;

  private userSignInSubscription: Subscription;
  private autoCompleteSubscription: Subscription;
  private searchResultsSubscription: Subscription;

  public isFocused: boolean = false;
  public mobileSearchEnabled: boolean = false;

  @ViewChild('searchInput')
  public searchInput: ElementRef;

  public navOptionsMobile = [
    {display: 'Audio', icon: 'ic-volume-mute.svg', activeIcon: 'ic-volume-mute-active.svg', value: 'app/audio'},
    {display: 'Video', icon: 'ic-videocam.svg', activeIcon: 'ic-videocam-active.svg', value: 'app/video'},
    {display: 'YouTube', icon: 'ic-video-youtube.svg', activeIcon: 'ic-video-youtube-active.svg', value: 'app/youtube'}
  ];

  constructor(
    private userService: UserService,
    private videoSearchService: VideoSearchService,
    private videoAutoCompleteService: VideoAutoCompleteService,
    private renderer: Renderer,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    this.userSignInSubscription = this.userService.userSignedInEmitter$.subscribe((user) => {
      this.user = user;
      this.loading = false;
    });
    this.route.queryParams.subscribe(params => {
      // this.searchQuery = params.q ? params.q : '';
      // Set this to the "showing results for"
    });
  }

  public handleAutoCompleteLookup(searchQuery) {
    console.log('QUERY: ' + searchQuery);
    clearTimeout(this.predictionsTimeout);
    if (!searchQuery) {
      this.clearAutoSuggestions();
      return;
    }
    this.predictionsTimeout = setTimeout(() => {
      this.autoCompleteSubscription = this.videoAutoCompleteService.getAutoComplete(searchQuery).subscribe((autoCompleteResponse) => {
        this.clearAutoSuggestions();
        autoCompleteResponse[1].forEach((e) => this.predictions.push(e));
      });
    }, 25);
  }

  public handleSubmitSearch(searchQuery) {
    console.log('Search : ' + searchQuery);
    this.searchQuery = '';
    if (!searchQuery) {
      this.clearAutoSuggestions();
      return;
    }
    this.clearAutoSuggestions();
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'blur', []);
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {q: searchQuery} });
  }

  public clearAutoSuggestions() {
    this.predictions = [];
  }

  public focusSearchBar() {
    console.log('focus');
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus', []);
  }

  ngOnDestroy() {
    this.userSignInSubscription.unsubscribe();
    this.autoCompleteSubscription.unsubscribe();
    this.searchResultsSubscription.unsubscribe();
  }

}
