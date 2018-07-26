import {Component, OnDestroy, OnInit} from '@angular/core';
import {AudioPlayerService} from './audio-player.service';
import {Howl, Howler} from 'howler';
import {NotificationService} from '../notification/notification.service';
import {VideoRecommendedService} from '../../../service/video-recommended.service';
import {VideoMetadataService} from '../../../service/video-metadata.service';
import {ConfigService} from '../../../service/config.service';
import {UtilsService} from '../../../service/utils.service';
import {Subscription} from 'rxjs/Subscription';

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

  private activeSound: Howler;

  public isLoading = false;
  public isPlaying = false;
  private videoServiceLock = false;

  private currentPlaylist: any = [];
  private playlistIndex: number;

  private isPlaylist = false;

  private videoEventSubscription: Subscription;
  private videoPlayingEventSubscription: Subscription;
  private videoLoadingEventSubscription: Subscription;
  private playlistUpdateEventSubscription: Subscription;
  private videoServiceSubscription: Subscription;

  constructor(private audioPlayerService: AudioPlayerService,
              private videoMetadataService: VideoMetadataService,
              private notificationService: NotificationService,
              private videoRecommendedService: VideoRecommendedService,
              private config: ConfigService) {
  }

  ngOnInit() {
    this.progress = '0';
    this.videoEventSubscription = this.audioPlayerService.triggerVideoEventEmitter$.subscribe((e) => {
      console.log('BRO');
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

      if (this.isPlaying) {
        console.log('Currently Playing: ' + this.audioPlayerService.getPlayingVideo().title);
      }
      this.currentPlaylist = e.playlist;
      this.checkCurrentPlaylist();

    });
  }

  private checkCurrentPlaylist() {
    for (let i = 0; i < this.currentPlaylist.length; i++) {
      const video = this.currentPlaylist[i];
      if (video.id === this.audioPlayerService.getPlayingVideo().id) {
        console.log('Index set: ' + i);
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
    if (this.videoServiceLock === true) {
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
    }
    this.audioPlayerService.triggerToggleLoading({id: video.id, toggle: true});
    this.audioPlayerService.triggerTogglePlaying({id: video.id, toggle: false});
    this.videoServiceSubscription = this.videoMetadataService.getVideo(video).subscribe(
      (videoResponse) => {
        this.video = videoResponse;
        this.audioPlayerService.setPlaylingVideo(videoResponse);
        this.checkCurrentPlaylist();
        this.buildAudioObject(video);
        this.activeSound.play();
      },
      (error) => {
        this.showNowPlayingBar = false;
        this.videoServiceLock = false;
        this.audioPlayerService.triggerToggleLoading({id: video.id, toggle: false});
        this.audioPlayerService.triggerTogglePlaying({id: video.id, toggle: false});
      });
  }

  private buildAudioObject(video) {
    this.activeSound = new Howl({
      src: [this.config.getAddress() + '/api/stream/' + video.id],
      format: ['webm'],
      html5: true,
      buffer: true,

      onplay: () => {
        this.duration = video.duration;
        this.showNowPlayingBar = true;
        this.audioPlayerService.triggerTogglePlaying({id: video.id, toggle: true});
        requestAnimationFrame(this.step.bind(this));
      },
      onpause: () => {
        // Leave this as an exception
        this.isPlaying = false;
      },
      onplayerror: (e) => {
        this.audioPlayerService.triggerToggleLoading({id: video.id, toggle: false});
        this.notificationService.showNotification({type: 'error', message: 'Sorry :( There was an error playing this video.'});
        this.videoServiceLock = false;
      },
      onloaderror: (e) => {
        this.audioPlayerService.triggerToggleLoading({id: video.id, toggle: false});
        this.notificationService.showNotification({type: 'error', message: 'Sorry :( There was an error loading this video.'});
        this.videoServiceLock = false;
      },
      onend: () => {
        this.audioPlayerService.triggerTogglePlaying({id: video.id, toggle: false});
          this.playNextVideo();
      },
      onload: () => {
        if (video.isRecommended === false && video.isPlaylist === false) {
          this.videoRecommendedService.recommended(video.id);
        }
        this.audioPlayerService.triggerToggleLoading({id: video.id, toggle: false});
        this.videoServiceLock = false;
      }
    });
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
  }

}
