import {Component, OnDestroy, OnInit} from '@angular/core';
import {AudioPlayerService} from './audio-player.service';
import {Howl} from 'howler';
import {NotificationService} from '../notification/notification.service';
import {VideoRecommendedService} from '../../../service/video-recommended.service';
import {UtilsService} from '../../../service/utils.service';
import {Subscription} from 'rxjs/Subscription';
import {Title} from '@angular/platform-browser';
import {environment} from '../../../../environments/environment';
import {StreamValidatorService} from '../../../service/stream-validator.service';

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
  public timer: string;

  private activeSound: Howl;

  public isLoading = false;
  public isPlaying = false;
  private videoServiceLock = false;

  private currentPlaylist: any = [];
  private playlistIndex: number;

  private isPlaylist = false;

  private retryCount: number = 0;

  private videoEventSubscription: Subscription;
  private videoPlayingEventSubscription: Subscription;
  private videoLoadingEventSubscription: Subscription;
  private playlistUpdateEventSubscription: Subscription;
  private streamValidatorSubscription: Subscription;

  constructor(private audioPlayerService: AudioPlayerService,
              private notificationService: NotificationService,
              private videoRecommendedService: VideoRecommendedService,
              private titleService: Title,
              private streamValidator: StreamValidatorService) {
  }

  ngOnInit() {
    Howl.autoSuspend = false;
    this.progress = '0';
    this.videoEventSubscription = this.audioPlayerService.triggerVideoEventEmitter$.subscribe((e) => {
      this.isPlaylist = e.isPlaylist;
      this.playMedia(e);
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
    this.audioPlayerService.triggerPlaylistActionEvent({action: 'next', isPlaylist: this.isPlaylist});
    this.playNextVideo();
  }

  public seekPrev() {
    this.audioPlayerService.triggerPlaylistActionEvent({action: 'prev', isPlaylist: this.isPlaylist});
    if (this.playlistIndex === 0) {
      console.log('Cant go to previous');
    } else {
      this.playlistIndex = this.playlistIndex - 1;
      this.audioPlayerService.triggerVideoEvent(this.currentPlaylist[this.playlistIndex]);
    }
  }

  private playNextVideo() {
    if (this.isPlaylist === true) {
      if ((this.currentPlaylist.length - 1) === this.playlistIndex) {
        console.log('Playlist has reached the end');
      } else {
        this.playlistIndex = this.playlistIndex + 1;
        this.audioPlayerService.triggerVideoEvent(this.currentPlaylist[this.playlistIndex]);
      }
    }
  }

  public playMedia(video) {
    if (this.videoServiceLock) {
      console.log('Cant select another video right now');
      return;
    }
    if (video.isPlaylist === true) {
      this.isPlaylist = true;
    }
    this.videoServiceLock = true;
    this.showNowPlayingBar = false;
    this.progress = '0';
    if (this.activeSound) {
      this.activeSound.stop();
      this.titleService.setTitle('moup.io');
    }
    this.audioPlayerService.triggerToggleLoading({id: video.id, toggle: true});
    this.audioPlayerService.triggerTogglePlaying({id: video.id, toggle: false});
    this.retryCount = 0;
    this.video = video; // THIS IS NEW - KEEP AN EYE ON THIS
    this.buildAudioObject();
  }

  private buildAudioObject() {
    const streamUrl = environment.streamUrl + '/stream?v=' + this.video.id;
    this.activeSound = new Howl({
      src: [streamUrl],
      format: ['webm'],
      html5: true,
      buffer: true,
      preload: true,
      autoplay: false,
      onplay: () => {
        this.duration = this.video.duration;
        this.showNowPlayingBar = true;
        this.audioPlayerService.triggerTogglePlaying({id: this.video.id, toggle: true});
        // this.video = video;
        this.audioPlayerService.setPlaylingVideo(this.video);
        this.titleService.setTitle(this.video.title + ' - ' + this.video.owner);
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
        this.streamValidatorSubscription = this.streamValidator.validateMediaStream(this.video.id).subscribe((response) => {
          let resp: any = response;
          if (resp.valid) {
            // FAKE ERROR
            const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
            const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            if (!isSafari && !iOS) {
              this.handleError();
            }
          } else {
            // ERROR SECTION
            this.handleError();
            }
        }, (error) => {
          console.log(JSON.stringify(error));
        });
      },
      onend: () => {
        this.audioPlayerService.triggerTogglePlaying({id: this.video.id, toggle: false});
          this.playNextVideo();
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

  private handleError() {
    this.retryCount = this.retryCount + 1;
    if (this.retryCount > 1) {
      this.audioPlayerService.triggerToggleLoading({id: this.video.id, toggle: false});
      this.notificationService.showNotification({type: 'error', message: 'Sorry :( There was an error loading this video.'});
      this.videoServiceLock = false;
      return;
    }
    console.log('Received error in fetching video stream. Retry attempt ' + this.retryCount);
    this.buildAudioObject();
  }

  private step() {
    const seek = this.activeSound.seek() || 0;
    this.timer = UtilsService.formatTime(Math.round(seek));
    this.progress = (((seek / UtilsService.formatDuration(this.audioPlayerService.getPlayingVideo().duration)) * 100) || 0);

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
  }

}
