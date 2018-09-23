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

  public isFocused = false;
  public mobileSearchEnabled = false;
  public isNotificationBodyOpen = false;

  @ViewChild('searchInput')
  public searchInput: ElementRef;

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
    clearTimeout(this.predictionsTimeout);
    if (!searchQuery) {
      this.clearAutoSuggestions();
      return;
    }
    this.predictionsTimeout = setTimeout(() => {
      this.autoCompleteSubscription = this.videoAutoCompleteService.getAutoComplete(searchQuery).subscribe((autoCompleteResponse) => {
        if (autoCompleteResponse && autoCompleteResponse[1]) {
          this.clearAutoSuggestions();
          autoCompleteResponse[1].forEach((e) => this.predictions.push(e));
        }
      });
    });
  }

  public handleSubmitSearch(searchQuery) {
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
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus', []);
  }

  public openNotificationBody() {
    this.isNotificationBodyOpen = !this.isNotificationBodyOpen;
  }

  ngOnDestroy() {
    this.userSignInSubscription.unsubscribe();
    this.autoCompleteSubscription.unsubscribe();
    this.searchResultsSubscription.unsubscribe();
  }

}
