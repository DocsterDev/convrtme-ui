import {Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer, ViewChild} from '@angular/core';
import {UserService} from '../service/user.service';
import {Subscription} from 'rxjs/Subscription';
import {VideoSearchService} from '../service/video-search.service';
import {VideoAutoCompleteService} from '../service/video-autocomplete.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationCenterService} from '../service/notification-center.service';

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
  public isSearchAutoCompleteOpen = false;
  public isMobile = false;

  public numAlertNotifications = 0;
  public notificaitonsOpened = false; // TODO - have it so when you click on the notifications icon it turns off the dot - and then start polling for new subscriptions. When the dot is on do not poll for new subscriptions

  @ViewChild('searchInputText')
  public searchInputText: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = window.innerWidth < 768;
  }

  constructor(
    private userService: UserService,
    private videoSearchService: VideoSearchService,
    private videoAutoCompleteService: VideoAutoCompleteService,
    private renderer: Renderer,
    private route: ActivatedRoute,
    private router: Router,
    private notificationCenterService: NotificationCenterService) {
  }

  ngOnInit() {
    this.isMobile = window.innerWidth < 768;
    this.loading = true;
    this.userSignInSubscription = this.userService.userSignedInEmitter$.subscribe((user) => {
      this.user = user;
      this.loading = false;
    });
    this.route.queryParams.subscribe(params => {
      // this.searchQuery = params.q ? params.q : '';
      // Set this to the "showing results for"
    });
    this.pollNotificiations(); // TODO Figure out how to only poll when there are no notifications
  }

  private pollNotificiations() {
    this.notificationCenterService.pollNotifications().subscribe((response) => {
      const resp:any = response;
      this.numAlertNotifications = resp.count;
        setTimeout(() => {
          this.pollNotificiations(); // TODO - I only really need to poll when the notifications have been clicked
        }, 1800000);
    }, (error) => {
      console.error(JSON.stringify(error));
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

  public handleAutoCompleteClose() {
    if (this.searchQuery) {
      this.clearAutoSuggestions();
      this.isSearchAutoCompleteOpen = false;
      this.isFocused = false;
      this.renderer.invokeElementMethod(this.searchInputText.nativeElement, 'blur', []);
      this.mobileSearchEnabled = false;
    }
  }

  public handleSearchInputBlur() {
    if (!this.searchQuery) {
      this.clearAutoSuggestions();
      this.isSearchAutoCompleteOpen = false;
      this.isFocused = false;
      this.renderer.invokeElementMethod(this.searchInputText.nativeElement, 'blur', []);
      this.mobileSearchEnabled = false;
    }
  }

  public handleSubmitSearch(searchQuery) {
    this.searchQuery = '';
    if (!searchQuery) {
      this.clearAutoSuggestions();
      return;
    }
    this.clearAutoSuggestions();
    this.isFocused = false;
    this.renderer.invokeElementMethod(this.searchInputText.nativeElement, 'blur', []);
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {q: searchQuery} });
  }

  public clearAutoSuggestions() {
    this.predictions = [];
  }

  public focusSearchBar() {
    // if (!this.mobileSearchEnabled) {
    //   return;
    // }
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.searchInputText.nativeElement, 'focus', []);
    });
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
