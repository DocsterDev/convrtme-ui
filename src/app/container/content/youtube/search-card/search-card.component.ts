import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {AudioPlayerService} from '../../../../global/components/audio-player/audio-player.service';
import {Subscription} from 'rxjs/Subscription';
import {NotificationCenterService} from '../../../../service/notification-center.service';
import {NotificationService} from '../../../../global/components/notification/notification.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.sass']
})
export class SearchCardComponent implements OnInit, OnDestroy {

  @Input()
  public video: any;

  @Output()
  public selected = new EventEmitter<any>();
  @Output()
  public added = new EventEmitter<any>();
  public nowPlaying: boolean;
  public nowLoading: boolean;
  public hidden: boolean;

  public lastUpdated;

  public linkUrl: string;

  private videoPlayingSubscription: Subscription;
  private videoLoadingSubscription: Subscription;
  private notificationSubscription: Subscription;

  constructor(private audioPlayerService: AudioPlayerService,
              private notificationCenterService: NotificationCenterService,
              private notificationService: NotificationService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (!this.video) {
      this.video = {};
    } else {
      this.nowPlaying = this.audioPlayerService.getPlayingVideo().id === this.video.id;
    }
    this.lastUpdated = moment(this.video.timestamp);
    this.videoPlayingSubscription = this.audioPlayerService.triggerTogglePlayingEmitter$.subscribe((e) => {
      if (e.id === this.video.id) {
        this.nowPlaying = e.toggle;
        return;
      }
      this.nowPlaying = false;
    });
    this.videoLoadingSubscription = this.audioPlayerService.triggerToggleLoadingEmitter$.subscribe((e) => {
      if (e.id === this.video.id) {
        this.nowLoading = e.toggle;
        return;
      }
      this.nowLoading = false;
    });
    this.linkUrl = window.location.pathname;
  }

  selectContent() {
    this.selected.emit();
  }

  addedContent(event, video) {
    event.stopPropagation();
    this.added.emit(video);
  }

  public navigate($event, videoId: string) {
    $event.preventDefault();
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {v: videoId}, queryParamsHandling: "merge" });
  }

  public subscribe($event, channel, avatarUrl, channelId) {
    $event.stopPropagation();
    $event.preventDefault();
    this.notificationSubscription = this.notificationCenterService.addSubscription(channel, avatarUrl, channelId).subscribe((resp) => {
      const response: any = resp;
      this.notificationService.showNotification({type: 'success', message: 'Successfully added ' + response.channel.name + ' to subscriptions'});
    }, (error) => {
      console.error(error);
    });
  }

  ngOnDestroy() {
    if (this.videoPlayingSubscription)
      this.videoPlayingSubscription.unsubscribe();
    if (this.videoLoadingSubscription)
      this.videoLoadingSubscription.unsubscribe();
    if (this.notificationSubscription)
      this.notificationSubscription.unsubscribe();
  }
}
