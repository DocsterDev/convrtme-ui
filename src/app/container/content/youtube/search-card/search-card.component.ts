import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {AudioPlayerService} from '../../../../global/components/audio-player/audio-player.service';
import {Subscription} from 'rxjs/Subscription';
import {ConfigService} from '../../../../service/config.service';

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

  public lastUpdated;

  private titleTextLength = 55;

  private videoPlayingSubscription: Subscription;
  private videoLoadingSubscription: Subscription;

  constructor(private audioPlayerService: AudioPlayerService, public configService: ConfigService) {
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

  }

  selectContent(video) {
    video.isPlaylist = false;
    this.selected.emit(video);
  }

  addedContent(event, video) {
    event.stopPropagation();
    this.added.emit(video);
  }

  truncateTitle(title: string) {
    if (title.length > this.titleTextLength) {
      const fmtTitle = title.substr(0, this.titleTextLength);
      return fmtTitle.substr(0, fmtTitle.lastIndexOf(' ')) + '...';
    }
    return title;
  }

  ngOnDestroy() {
    this.videoPlayingSubscription.unsubscribe();
    this.videoLoadingSubscription.unsubscribe();
  }

}
