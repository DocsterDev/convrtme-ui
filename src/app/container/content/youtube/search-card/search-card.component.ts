import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {AudioPlayerService} from '../../../../global/components/audio-player/audio-player.service';
import {Subscription} from 'rxjs/Subscription';
import {NotificationCenterService} from '../../../../service/notification-center.service';
import {NotificationService} from '../../../../global/components/notification/notification.service';

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

  private videoPlayingSubscription: Subscription;
  private videoLoadingSubscription: Subscription;
  private hiddenSubscription: Subscription;
  private notificationSubscription: Subscription;

  constructor(private audioPlayerService: AudioPlayerService,
              private notificationCenterService: NotificationCenterService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.lastUpdated = moment(this.video.timestamp);
    this.nowPlaying = this.audioPlayerService.getPlayingVideo().id === this.video.id;
    this.videoPlayingSubscription = this.audioPlayerService.triggerTogglePlayingEmitter$.subscribe((e) => {
      this.nowPlaying = false;
      // if (e.toggle === false) {
      //   return;
      // }
      // if (e.id === this.video.id) {
      //   this.nowPlaying = true;
      // }
    });
    this.videoLoadingSubscription = this.audioPlayerService.triggerToggleLoadingEmitter$.subscribe((e) => {
      if (e.id === this.video.id) {
        this.nowLoading = e.toggle;
      }
    });
    this.hiddenSubscription = this.audioPlayerService.triggerHiddenEmitter$.subscribe((e) => {
      if (e.id === this.video.id) {
        this.hidden = true;
      }
    });
  }

  selectContent() {
    this.selected.emit();
  }

  addedContent(event, video) {
    event.stopPropagation();
    this.added.emit(video);
  }

  public subscribe($event, channel, avatarUrl) {
    $event.stopPropagation();
    this.notificationSubscription = this.notificationCenterService.addSubscription(channel, avatarUrl).subscribe((resp) => {
      const response: any = resp;
      this.notificationService.showNotification({type: 'success', message: 'Successfully added ' + response.channel.name + ' to Subcriptions.'});
    }, (error) => {
      console.error(error);
    });
  }

  ngOnDestroy() {
    this.videoPlayingSubscription.unsubscribe();
    this.videoLoadingSubscription.unsubscribe();
    this.hiddenSubscription.unsubscribe();
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

}
