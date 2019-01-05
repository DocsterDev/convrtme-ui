import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {AudioPlayerService} from '../../../../global/components/audio-player/audio-player.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.sass']
})
export class PlaylistCardComponent implements OnInit, OnDestroy {

  @Input()
  public video: any;
  @Input()
  public color: any;

  @Output()
  public selected = new EventEmitter<any>();
  @Output()
  public removed = new EventEmitter<any>();
  public duration: string;
  public nowPlaying: boolean;
  public nowLoading: boolean;
  public fadeIn = false;

  public lastUpdated;

  private videoPlayingSubscription: Subscription;
  private videoLoadingSubscription: Subscription;

  constructor(
    private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.lastUpdated = moment(this.video.timestamp);
    this.nowPlaying = false;
    if (this.audioPlayerService.getPlayingVideo().id === this.video.id) {
      this.nowPlaying = true;
    }
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
    this.duration = this.video.duration;
    setTimeout(() => {
      this.fadeIn = true;
    });
  }

  selectContent(video) {
    video.isRecommended = false;
    video.isPlaylist = true;
    this.selected.emit(video);
  }

  removeContent(event, video) {
    event.stopPropagation();
    this.removed.emit({event: event, video: video});
  }

  ngOnDestroy() {
    this.videoPlayingSubscription.unsubscribe();
    this.videoLoadingSubscription.unsubscribe();
  }

}
