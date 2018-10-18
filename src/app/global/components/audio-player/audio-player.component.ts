import {Component, OnDestroy, OnInit} from '@angular/core';
import {AudioPlayerService} from './audio-player.service';
import {Howl} from 'howler';
import {NotificationService} from '../notification/notification.service';
import {VideoRecommendedService} from '../../../service/video-recommended.service';
import {UtilsService} from '../../../service/utils.service';
import {Subscription} from 'rxjs/Subscription';
import {Title} from '@angular/platform-browser';
import {environment} from '../../../../environments/environment';
import {HeaderService} from '../../../service/header.service';
import {EventBusService} from '../../../service/event-bus.service';
import {StreamPrefetchService} from '../../../service/stream-prefetch.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.sass']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  public showNowPlayingBar: boolean;
  public video: any = {};
  public progress;
  public duration: string;
  public elapsed: string;
  public seekTimer: string;
  private seek: number;

  private activeSound: Howl;

  public isLoading = false;
  public isPlaying = false;
  private videoServiceLock = false;

  private hasPrefetched: boolean;

  private currentPlaylist: any = [];
  private currentPlaylistIndex: number;
  private playlistIndex: number;

  private isPlaylist = false;

  private retryCount = 0;

  private isMobile: boolean;
  private isSearchModeEnabled: boolean;
  private savedShowNowPlayingBar: any;
  private prevIsScrolling: boolean;

  public seekBarHandlePosX: number;
  public seekBarHandleEnabled: boolean;

  private videoEventSubscription: Subscription;
  private videoPlayingEventSubscription: Subscription;
  private videoLoadingEventSubscription: Subscription;
  private playlistUpdateEventSubscription: Subscription;
  private streamValidatorSubscription: Subscription;
  private eventBusSubscription: Subscription;
  private playlistActionSubscription: Subscription;
  private streamPrefetchSubscription: Subscription;

  constructor(private audioPlayerService: AudioPlayerService,
              private notificationService: NotificationService,
              private videoRecommendedService: VideoRecommendedService,
              private titleService: Title,
              private headerService: HeaderService,
              private eventBusService: EventBusService,
              private streamPrefetchService: StreamPrefetchService) {
  }

  ngOnInit() {
    Howl.autoSuspend = false;
    this.progress = '0';
    this.videoEventSubscription = this.audioPlayerService.triggerVideoEventEmitter$.subscribe((e) => {
      this.currentPlaylist = e.playlist;
      this.currentPlaylistIndex = e.index;
      this.playMedia(this.currentPlaylist[this.currentPlaylistIndex]);
    });
    this.playlistActionSubscription = this.audioPlayerService.triggerPlaylistActionEventEmitter$.subscribe((e) => {
      switch(e.action) {
        case 'prev':
          this.goToPrevious();
          break;
        case 'next':
          this.goToNext();
          break;
      }
    });
    this.videoPlayingEventSubscription = this.audioPlayerService.triggerTogglePlayingEmitter$.subscribe((e) => {
      this.isPlaying = e.toggle;
    });
    this.videoLoadingEventSubscription = this.audioPlayerService.triggerToggleLoadingEmitter$.subscribe((e) => {
      this.isLoading = e.toggle;
    });
    this.playlistUpdateEventSubscription = this.audioPlayerService.triggerPlaylistUpdateEventEmitter$.subscribe((e) => {
      this.currentPlaylist = e.playlist;
      this.checkCurrentPlaylist();
    });
    this.isMobile = this.eventBusService.isDeviceMobile();
    this.eventBusSubscription = this.eventBusService.deviceListenerEvent$.subscribe((isMobile) => this.isMobile = isMobile);
    this.eventBusSubscription = this.eventBusService.searchModeEvent$.subscribe((isSearchModeEnabled) => {
      this.isSearchModeEnabled = isSearchModeEnabled;
      if (this.isMobile) {
        if (this.isSearchModeEnabled) {
          this.savedShowNowPlayingBar = this.showNowPlayingBar;
          this.showNowPlayingBar = false;
        } else {
          this.showNowPlayingBar = this.savedShowNowPlayingBar;
        }
      }
    });
    this.eventBusSubscription = this.eventBusService.scrollEvent$.subscribe((isScrolling) => {
      // if (isScrolling) {
      //   this.prevIsScrolling = this.showNowPlayingBar;
      // }
      // this.showNowPlayingBar = isScrolling ? false : this.prevIsScrolling;
    });
  }

  private goToNext() {
    if (this.currentPlaylist.length === (this.currentPlaylistIndex + 1)) {
      console.log('Last video in the playlist cannot continue');
      return;
    }
    this.currentPlaylistIndex++;
    this.audioPlayerService.triggerVideoEvent({index: this.currentPlaylistIndex, playlist: this.currentPlaylist});
  }

  private goToPrevious() {
    if (this.currentPlaylistIndex === 0) {
      console.log('Cant go to previous');
      return;
    }
    this.currentPlaylistIndex--;
    this.audioPlayerService.triggerVideoEvent({index: this.currentPlaylistIndex, playlist: this.currentPlaylist});
  }

  private checkCurrentPlaylist() {
    for (let i = 0; i < this.currentPlaylist.length; i++) {
      const video = this.currentPlaylist[i];
      if (video.id === this.audioPlayerService.getPlayingVideo().id) {
        this.playlistIndex = i;
        break;
      }
    }
  }

  public toggle() {
    if (!this.isPlaying) {
      this.activeSound.play();
    } else {
      this.activeSound.pause();
    }
  }

  public seekNext() {
    this.audioPlayerService.triggerPlaylistActionEvent({action: 'next'});
  }

  public seekPrev() {
    this.audioPlayerService.triggerPlaylistActionEvent({action: 'prev'});
  }

  public bindMouseMoveSeekBar($event, elementWidth, duration) {
    if (this.activeSound) {
      this.seekBarHandlePosX = ($event.offsetX / elementWidth) * 100;
      const seconds = UtilsService.formatDuration(duration);
      const seekPosition = seconds * (this.seekBarHandlePosX / 100);
      this.seekTimer = UtilsService.formatTime(seekPosition);
      $event.stopPropagation();
    }
  }

  public seekToPosition($event, position, duration) {
    if (this.activeSound) {
      const seconds = UtilsService.formatDuration(duration);
      const seekPosition = Math.round(seconds * (position/100));
      if (this.activeSound && !this.activeSound.playing()) {
        this.activeSound.play();
      }
      this.activeSound.seek(seekPosition);
      $event.stopPropagation();
    }
  }

  public playMedia(video) {
    if (this.videoServiceLock) {
      console.log('Cant select another video right now');
      return;
    }
    this.videoServiceLock = true;
    this.audioPlayerService.triggerToggleLoading({id: video.id, toggle: true});
    this.audioPlayerService.triggerTogglePlaying({id: video.id, toggle: false});
    this.retryCount = 0;
    this.progress = '0';
    this.video = video; // THIS IS NEW - KEEP AN EYE ON THIS
    this.buildAudioObject();
  }

  private buildAudioObject() {
    this.showNowPlayingBar = false;
    if (this.activeSound) {
      this.activeSound.unload();
      this.titleService.setTitle('moup.io');
    }
    const streamUrl = environment.streamUrl + '/stream?v=' + this.video.id + (this.headerService.getToken() ? '&token=' + this.headerService.getToken() : '');
    this.activeSound = new Howl({
      src: [streamUrl],
      // format: ['webm'],
      html5: true,
      buffer: true,
      preload: false,
      autoplay: false,
      onplay: () => {
        this.duration = this.video.duration;
        this.showNowPlayingBar = true;
        this.audioPlayerService.triggerTogglePlaying({id: this.video.id, toggle: true});
        this.audioPlayerService.setPlaylingVideo(this.video);
        this.titleService.setTitle(this.video.title + ' - ' + this.video.owner);
        this.hasPrefetched = false;
        this.checkCurrentPlaylist();
        requestAnimationFrame(this.step.bind(this));
      },
      onpause: () => {
        // Leave this as an exception
        this.isPlaying = false;
      },
      onplayerror: (e) => {
        console.error(JSON.stringify(e));
        this.audioPlayerService.triggerToggleLoading({id: this.video.id, toggle: false});
        this.notificationService.showNotification({type: 'error', message: 'Sorry :( There was an error playing this video.'});
        this.videoServiceLock = false;
      },
      onloaderror: (e) => {
        console.log('Error Code: ' + e);
        setTimeout(() => {
          this.handleError();
        }, 1000);
      },
      onend: () => {
        this.audioPlayerService.triggerPlaylistActionEvent({action: 'next'});
      },
      onload: () => {
        if (this.video.isRecommended === false && this.video.isPlaylist === false) {
          this.videoRecommendedService.recommended(this.video.id);
        }
        this.audioPlayerService.triggerToggleLoading({id: this.video.id, toggle: false});
        this.videoServiceLock = false;
      }
    });
    this.activeSound.play();
  }

  private prefetchAudioStream() {
    if (this.currentPlaylist.length === (this.currentPlaylistIndex + 1)) {
      console.log('Last video in the playlist. Not pre-fetching media stream.');
      return;
    }
    const prefetchVideoId: string = this.currentPlaylist[this.currentPlaylistIndex + 1].id;
    this.streamPrefetchSubscription = this.streamPrefetchService.prefetchStreamUrl(prefetchVideoId).subscribe((resp) => {
      console.log('Successfully pre-fetched media url for video id ' + this.video.id);
    }, (error) => {
      console.error('Error prefetching stream url for video id ' + this.video.id);
    });
  }

  private handleError() {
    this.retryCount = this.retryCount + 1;
    if (this.retryCount > 1) {
      this.audioPlayerService.triggerToggleLoading({id: this.video.id, toggle: false});
      this.notificationService.showNotification({type: 'error', message: 'Sorry :( There was an error loading this video.'});
      this.videoServiceLock = false;
      return;
    }
    console.error('Received error in fetching video stream. Retry attempt ' + this.retryCount);
    this.buildAudioObject();
  }

  private step() {
    const seek: number = this.activeSound.seek() || 0;
    const duration: number = UtilsService.formatDuration(this.audioPlayerService.getPlayingVideo().duration);
    this.progress = (((seek / duration) * 100) || 0);
    this.elapsed = UtilsService.formatTime(Math.round(seek));
    if ((duration - Math.floor(seek)) === 15 && !this.hasPrefetched) {
      console.log('Prefetching next media stream');
      this.hasPrefetched = true;
      this.prefetchAudioStream();
    }
    if (this.activeSound.playing()) {
      requestAnimationFrame(this.step.bind(this));
    }
  }

  ngOnDestroy() {
    this.videoEventSubscription.unsubscribe();
    this.videoPlayingEventSubscription.unsubscribe();
    this.videoLoadingEventSubscription.unsubscribe();
    this.playlistUpdateEventSubscription.unsubscribe();
    this.streamValidatorSubscription.unsubscribe();
    this.eventBusSubscription.unsubscribe();
    this.playlistActionSubscription.unsubscribe();
    this.streamPrefetchSubscription.unsubscribe();
  }

}
