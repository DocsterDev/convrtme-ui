import {Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer, ViewChild} from '@angular/core';
import {UserService} from '../service/user.service';
import {Subscription} from 'rxjs/Subscription';
import {VideoSearchService} from '../service/video-search.service';
import {VideoAutoCompleteService} from '../service/video-autocomplete.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationCenterService} from '../service/notification-center.service';
import {EventBusService} from '../service/event-bus.service';
import {AudioPlayerService} from '../global/components/audio-player/audio-player.service';

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
  private eventBusSubscription: Subscription;
  private videoPlayingSubscription: Subscription;
  private pollNotificationsSubscription: Subscription;

  public isFocused: boolean;
  public mobileSearchEnabled: boolean;
  public isNotificationCenterModeEnabled: boolean;
  public isSearchAutoCompleteOpen: boolean;

  public isMobile: boolean;
  public isSearchModeEnabled: boolean;
  public isPlaying: boolean;

  public notificationDirty: boolean;

  public numAlertNotifications = 0;

  @ViewChild('searchInputText')
  public searchInputText: ElementRef;

  constructor(
    private userService: UserService,
    private videoSearchService: VideoSearchService,
    private videoAutoCompleteService: VideoAutoCompleteService,
    private renderer: Renderer,
    private route: ActivatedRoute,
    private router: Router,
    private notificationCenterService: NotificationCenterService,
    private eventBusService: EventBusService,
    private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.loading = true;
    this.isMobile = this.eventBusService.isDeviceMobile();
    this.eventBusSubscription = this.eventBusService.deviceListenerEvent$.subscribe((isMobile) => {
      this.isMobile = isMobile;
      if (!this.isMobile) {
        this.handleSearchInputBlur(true);
      }
    });
    this.eventBusSubscription = this.eventBusService.searchModeEvent$.subscribe((isSearchModeEnabled) => this.isSearchModeEnabled = isSearchModeEnabled);
    this.eventBusSubscription = this.eventBusService.notificationCenterEvent$.subscribe((isNotificationCenterModeEnabled) => {
      this.isNotificationCenterModeEnabled = isNotificationCenterModeEnabled;
      this.notificationDirty = true;
    });
    this.userSignInSubscription = this.userService.userSignedInEmitter$.subscribe((user) => {
      this.user = user;
      this.loading = false;
      if (this.user.valid === true) {
        this.pollNotifications();
      }
    });
    this.videoPlayingSubscription = this.audioPlayerService.triggerTogglePlayingEmitter$.subscribe((e) => {
      this.isPlaying = e.toggle;
      if (this.isPlaying === true && this.isNotificationCenterModeEnabled === true) {
        this.eventBusService.triggerNotificationCenterEvent(false);
      }
    });
  }

  private pollNotifications() {
    this.pollNotificationsSubscription = this.notificationCenterService.pollNotifications().subscribe((response) => {
      const resp: any = response;
      this.numAlertNotifications = resp.count;
      this.notificationDirty = false;
        setTimeout(() => {
          this.pollNotifications(); // TODO - I only really need to poll when the notifications have been clicked
        }, 600000);
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
          this.predictions.push(autoCompleteResponse[0]);
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
      setTimeout(()=>{
        this.renderer.invokeElementMethod(this.searchInputText.nativeElement, 'blur', []);
      }, 5);
      this.mobileSearchEnabled = false;
    }
  }

  public handleSearchInputFocus(searchQuery) {
    this.eventBusService.triggerSearchModeEvent(true);
    this.isFocused = true;
    this.isSearchAutoCompleteOpen = true;
    this.handleAutoCompleteLookup(searchQuery);
  }

  public handleSearchInputBlur(allowNonNullSearchQuery: boolean) {
    if (allowNonNullSearchQuery || !this.searchQuery) {
      this.clearAutoSuggestions();
      this.isSearchAutoCompleteOpen = false;
      this.isFocused = false;
      setTimeout(()=>{
        this.renderer.invokeElementMethod(this.searchInputText.nativeElement, 'blur', []);
      }, 5);
      this.mobileSearchEnabled = false;
    }
    this.eventBusService.triggerSearchModeEvent(false);
  }

  public handleSubmitSearch(searchQuery) {
    this.searchQuery = '';
    if (!searchQuery) {
      this.clearAutoSuggestions();
      return;
    }
    this.clearAutoSuggestions();
    this.isFocused = false;
    setTimeout(()=>{
      this.renderer.invokeElementMethod(this.searchInputText.nativeElement, 'blur', []);
    }, 5);
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {q: searchQuery} });
    this.eventBusService.triggerSearchModeEvent(false);
  }

  public clearAutoSuggestions() {
    this.predictions = [];
  }

  public closeMode() {
    this.eventBusService.triggerSearchModeEvent(false);
    this.eventBusService.triggerNotificationCenterEvent(false);
    this.handleSearchInputBlur(true);
  }

  public focusSearchBar() {
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.searchInputText.nativeElement, 'focus', []);
    }, 5);
  }

  public toggleNotificationCenter() {
    this.eventBusService.triggerNotificationCenterEvent(!this.isNotificationCenterModeEnabled);
  }

  ngOnDestroy() {
    this.userSignInSubscription.unsubscribe();
    this.autoCompleteSubscription.unsubscribe();
    this.searchResultsSubscription.unsubscribe();
    this.eventBusSubscription.unsubscribe();
    this.pollNotificationsSubscription.unsubscribe();
    this.videoPlayingSubscription.unsubscribe();
  }
}
