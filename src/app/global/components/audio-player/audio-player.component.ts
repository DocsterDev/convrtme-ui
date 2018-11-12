import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AudioPlayerService} from './audio-player.service';
import {Howl} from 'howler';
import {NotificationService} from '../notification/notification.service';
import {VideoRecommendedService} from '../../../service/video-recommended.service';
import {UtilsService} from '../../../service/utils.service';
import {Title} from '@angular/platform-browser';
import {environment} from '../../../../environments/environment';
import {HeaderService} from '../../../service/header.service';
import {EventBusService} from '../../../service/event-bus.service';
import {StreamPrefetchService} from '../../../service/stream-prefetch.service';
import {VideoSearchService} from '../../../service/video-search.service';
import {forkJoin, Subscription} from 'rxjs';
import 'rxjs/Rx';
import * as moment from 'moment';


@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.sass']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  public showNowPlayingBar: boolean;
  public video: any;
  public videoPrevious: any;
  public videoNext: any;

  private tempRecommendedResults: any;
  private tempNowPlayingVideo: any;
  private tempUpNextVideo: any;


  public progress;
  public duration: number;
  public elapsed: string;
  public seekTimer: string;
  private seek: number;

  private activeSound: Howl;

  public isLoading = false;
  public isPlaying = false;
  private videoServiceLock = false;

  private hasPrefetched: boolean;

  private retryCount = 0;

  private isMobile: boolean;
  private isSearchModeEnabled: boolean;
  private savedShowNowPlayingBar: any;

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
  private streamRecPrefetchSubscription: Subscription;
  private upNextVideoEventSubscription: Subscription;
  private recommendedResultsSubscription: Subscription;
  private nowPlayingVideoSubscription: Subscription;

  private forkJoinSubscription: Subscription;

  private fetchedStreamUrl: any;
  private isChrome: boolean;
  private videoCount = 0;

  private dataLoaded:boolean = false;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === ' ') {
      if (!this.isSearchModeEnabled) {
        this.toggle();
        event.preventDefault();
      }
    }
  }

  constructor(private audioPlayerService: AudioPlayerService,
              private notificationService: NotificationService,
              private videoRecommendedService: VideoRecommendedService,
              private videoSearchService: VideoSearchService,
              private titleService: Title,
              private headerService: HeaderService,
              private eventBusService: EventBusService,
              private streamPrefetchService: StreamPrefetchService) {
  }

  ngOnInit() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Chrome') !== -1) {
      this.isChrome = true;
    }
    Howl.autoSuspend = false;
    this.progress = '0';
    this.videoEventSubscription = this.audioPlayerService.triggerVideoEventEmitter$.subscribe((videoId) => {
      this.video = null;
      this.tempNowPlayingVideo = {};
      this.tempUpNextVideo = {};
      this.audioPlayerService.triggerNowPlayingVideoEvent(false);
      this.audioPlayerService.triggerNextUpVideoEvent(false);
      this.dataLoaded = false;
      this.fetchAudioStream(videoId);
      this.playMedia(videoId);
      this.fetchRecommendedVideos(videoId);
    });
    this.playlistActionSubscription = this.audioPlayerService.triggerPlaylistActionEventEmitter$.subscribe((e) => {
      switch (e.action) {
        case 'prev':
          this.goToPrevious();
          break;
        case 'next':
          this.goToUpNextVideo();
          break;
      }
    });
    this.videoPlayingEventSubscription = this.audioPlayerService.triggerTogglePlayingEmitter$.subscribe((e) => {
      this.isPlaying = e.toggle;
    });
    this.videoLoadingEventSubscription = this.audioPlayerService.triggerToggleLoadingEmitter$.subscribe((e) => {
      this.isLoading = e.toggle;
    });
    this.isMobile = this.eventBusService.isDeviceMobile();
    this.eventBusSubscription = this.eventBusService.deviceListenerEvent$.subscribe((isMobile) => this.isMobile = isMobile);
    this.eventBusSubscription = this.eventBusService.searchModeEvent$.subscribe((isSearchModeEnabled) => {
      this.isSearchModeEnabled = isSearchModeEnabled;
      this.showNowPlayingBar = this.isPlaying && !this.isSearchModeEnabled;
    });
    this.eventBusSubscription = this.eventBusService.scrollEvent$.subscribe((isScrolling) => {
      if (isScrolling) {
      }
    });
    this.upNextVideoEventSubscription = this.audioPlayerService.triggerUpNextVideoEmitter$.subscribe((videoNext) => {
      this.videoNext = videoNext;
    });
    this.nowPlayingVideoSubscription = this.audioPlayerService.triggerNowPlayingVideoEmitter$.subscribe((e) => {
      this.video = e;
      this.audioPlayerService.setPlaylingVideo(this.video);
    });
  }

  private goToUpNextVideo() {
    if (this.videoNext)
      this.audioPlayerService.triggerVideoEvent(this.videoNext.id);
  }

  private goToPrevious() {
    if (this.isPlaying && this.video && this.seek > 5) {
      this.audioPlayerService.triggerVideoEvent(this.video.id);
      return;
    }
    if (this.isPlaying && this.videoPrevious && this.seek <= 5) {
      this.audioPlayerService.triggerVideoEvent(this.videoPrevious.id);
      return;
    }
  }

  public toggle() {
    if (this.activeSound) {
      if (this.activeSound.playing()) {
        this.activeSound.pause();
      } else {
        this.activeSound.play();
      }
    }
  }

  public seekNext() {
    this.audioPlayerService.triggerPlaylistActionEvent({action: 'next'});
  }

  public seekPrev() {
    this.audioPlayerService.triggerPlaylistActionEvent({action: 'prev'});
  }

  public bindMouseMoveSeekBar($event, elementWidth) {
    if (this.activeSound) {
      this.seekBarHandlePosX = ($event.offsetX / elementWidth) * 100;
      const seconds = UtilsService.formatDuration(this.duration);
      const seekPosition = seconds * (this.seekBarHandlePosX / 100);
      this.seekTimer = UtilsService.formatTime(seekPosition);
      $event.stopPropagation();
    }
  }

  public seekToPosition($event, position) {
    if (this.activeSound) {
      const seconds = UtilsService.formatDuration(this.duration);
      const seekPosition = Math.round(seconds * (position / 100));
      if (this.activeSound && !this.activeSound.playing()) {
        this.activeSound.play();
      }
      this.activeSound.seek(seekPosition);
      $event.stopPropagation();
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private fetchAudioStream(videoId: string) {
    this.streamPrefetchSubscription = this.streamPrefetchService.prefetchStreamUrl(videoId).subscribe((resp: any) => {
      this.fetchedStreamUrl = resp;
      setTimeout(()=>{
        this.dataLoaded = true;
      });
    }, (error) => {
      console.error(error);
      this.showLoadingError(videoId);
    });
  }

  private fetchRecommendedVideos(videoId: string) {
    this.recommendedResultsSubscription = this.videoRecommendedService.getServiceObservable(videoId).subscribe((resp: any)=> {
      this.tempRecommendedResults = resp;
    }, (error) => {
      console.error(error);
      this.showLoadingError(videoId);
    });
  }

  async playMedia(videoId) {
    if (this.videoServiceLock) {
      console.log('Cant select a video right now');
      return;
    }
    this.videoServiceLock = true;
    this.audioPlayerService.triggerToggleLoading({id: videoId, toggle: true});
    this.audioPlayerService.triggerTogglePlaying({id: videoId, toggle: false});
    this.retryCount = 0;
    this.progress = '0';
    this.clearAudio();
    if (this.videoCount === 0 && !this.isChrome) {
      this.fetchedStreamUrl = {};
      this.fetchedStreamUrl.success = false;
      this.buildAudioObject(videoId);
      this.videoCount++;
      return;
    }
    let count = 0;
    do {
      await this.sleep(125);
      if (count > 80) {
        console.error('Unable to retrieve stream URL');
        this.fetchedStreamUrl = {success: false};
        this.showLoadingError(videoId);
      }
      count++;
    }
    while (this.dataLoaded === false)
    this.buildAudioObject(videoId);
  }

  private showLoadingError(videoId: string) {
    this.clearAudio();
    this.forkJoinSubscription.unsubscribe();
    this.dataLoaded = true;
    this.audioPlayerService.triggerToggleLoading({id: videoId, toggle: false});
    this.notificationService.showNotification({type: 'error', message: 'Sorry :( There was an error loading this video.'});
    this.videoServiceLock = false;
  }

  private buildAudioObject(videoId: string) {
    let streamUrl: string;
    if (this.fetchedStreamUrl && this.fetchedStreamUrl.success === true) {
      streamUrl = (this.fetchedStreamUrl.audioOnly && this.fetchedStreamUrl.matchesExtension) ? this.fetchedStreamUrl.streamUrl : (environment.streamUrl + '/stream/' + btoa(this.fetchedStreamUrl.streamUrl));
    } else {
      streamUrl = environment.streamUrl + '/stream/videos/' + videoId;
    }

    this.activeSound = new Howl({
      src: [streamUrl],
      html5: true,
      buffer: true,
      preload: false,
      autoplay: false,
      onplay: () => {
        this.audioPlayerService.triggerNowPlayingVideoEvent(this.buildNowPlayingVideo());
        this.audioPlayerService.triggerNextUpVideoEvent(this.tempRecommendedResults.nextUpVideo);
        this.videoRecommendedService.triggerVideoLoad(this.tempRecommendedResults);
        this.showNowPlayingBar = true;
        this.hasPrefetched = false;
        this.titleService.setTitle(this.video.title + ' - ' + this.video.owner);
        this.audioPlayerService.triggerTogglePlaying({id: videoId, toggle: true});
        requestAnimationFrame(this.step.bind(this));
      },
      onpause: () => {
        this.isPlaying = false;
      },
      onplayerror: (e) => {
        console.error(e);
        this.showLoadingError(videoId);
      },
      onloaderror: (e) => {
        console.error(e);
        this.showLoadingError(videoId);
      },
      onend: () => {
        this.goToUpNextVideo();
      },
      onload: () => {
        this.videoServiceLock = false;
        this.audioPlayerService.triggerToggleLoading({id: videoId, toggle: false});
        this.streamPrefetchService.updateVideoWatched(videoId).subscribe(() => {
          console.log('Successfully updated video as watched on load of video');
        });
      }
    });
    this.activeSound.play();
  }

  private buildNowPlayingVideo(){
    const stream = this.fetchedStreamUrl;
    this.duration = stream.duration;
    return {
      id: stream.id,
      title: stream.title,
      duration: UtilsService.formatTime(stream.duration),
      owner: stream.owner,
      thumbnailUrl: 'http://i.ytimg.com/vi/' + stream.id + '/mqdefault.jpg',
      publishedTimeAgo: 'Uploaded on ' + moment(stream.uploadDate, 'YYYY-MM-DD').format('ddd, MMMM Do YYYY')
    };
  }

  private clearAudio() {
    this.audioPlayerService.triggerNowPlayingVideoEvent(false);
    this.audioPlayerService.triggerNextUpVideoEvent(false);
    this.fetchedStreamUrl = null;
    this.showNowPlayingBar = false;
    if (this.activeSound) {
      this.activeSound.unload();
      this.titleService.setTitle('moup.io');
    }
  }

  private prefetchAudioStream() {
    this.streamPrefetchSubscription = this.streamPrefetchService.prefetchStreamUrl(this.videoNext.id).subscribe((resp) => {

      }, (error) => {
      console.error('Error prefetching stream url for video id ' + this.videoNext.id);
    });
  }

  private step() {
    if (this.activeSound) {
      this.seek = this.activeSound ? this.activeSound.seek() : 0;
      this.progress = (((this.seek / this.duration) * 100) || 0);
      this.elapsed = UtilsService.formatTime(Math.round(this.seek));
      if ((this.duration - Math.floor(this.seek)) === 15 && !this.hasPrefetched) {
        this.hasPrefetched = true;
        this.prefetchAudioStream();
      }
      if (this.activeSound.playing()) {
        requestAnimationFrame(this.step.bind(this));
      }
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
    this.streamRecPrefetchSubscription.unsubscribe();
    this.upNextVideoEventSubscription.unsubscribe();
    this.recommendedResultsSubscription.unsubscribe();
    this.nowPlayingVideoSubscription.unsubscribe();
    this.forkJoinSubscription.unsubscribe();
  }
}
