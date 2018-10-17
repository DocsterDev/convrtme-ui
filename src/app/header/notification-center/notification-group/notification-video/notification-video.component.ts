import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {AudioPlayerService} from '../../../../global/components/audio-player/audio-player.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-notification-video',
  templateUrl: './notification-video.component.html',
  styleUrls: ['./notification-video.component.sass']
})
export class NotificationVideoComponent implements OnInit, OnDestroy {

  @Input()
  public video: any;

  @Output()
  public selected = new EventEmitter<any>();
  @Output()
  public added = new EventEmitter<any>();
  public nowPlaying: boolean;
  public nowLoading: boolean;

  public lastUpdated;

  private videoPlayingSubscription: Subscription;
  private videoLoadingSubscription: Subscription;

  constructor(private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.lastUpdated = moment(this.video.timestamp);
    this.nowPlaying = this.audioPlayerService.getPlayingVideo().id === this.video.id;
    this.videoPlayingSubscription = this.audioPlayerService.triggerTogglePlayingEmitter$.subscribe((e) => {
      this.nowPlaying = false;
      if (e.toggle === false) {
        return;
      }
      if (e.id === this.video.id) {
        this.nowPlaying = true;
      }
    });
    this.videoLoadingSubscription = this.audioPlayerService.triggerToggleLoadingEmitter$.subscribe((e) => {
      if (e.id === this.video.id) {
        this.nowLoading = e.toggle;
      }
    });

  }

  selectContent(video) {
    video.isPlaylist = false;
    this.selected.emit(video);
  }

  addedContent(event, video) {
    event.stopPropagation();
    this.added.emit(video);
  }

  public formatDate(date) {
    if (date) {
      //return moment.utc(date).local().format('LLLL');
      return moment.utc(date).local().fromNow();
    }
    return '';
  }

  public isSameDay(date) {
    return moment.utc(date).local().isSame(moment().local(), 'day');
  }

  ngOnDestroy() {
    this.videoPlayingSubscription.unsubscribe();
    this.videoLoadingSubscription.unsubscribe();
  }

}
