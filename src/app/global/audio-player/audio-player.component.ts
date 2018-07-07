import {Component, OnInit} from '@angular/core';
import {AudioPlayerService} from './audio-player.service';
import {Howl, Howler} from 'howler';
import {NotificationService} from '../notification/notification.service';
import {VideoRecommendedService} from '../../service/video-recommended.service';
import {VideoMetadataService} from '../../service/video-metadata.service';
import {ConfigService} from '../../service/config.service';
import {UtilsService} from '../../service/utils.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.sass']
})
export class AudioPlayerComponent implements OnInit {

  public showNowPlayingBar: boolean;
  public video: any = {};
  public progress;
  public duration: string;
  public timer: string;

  private activeSound: Howler;

  public isLoading = false;
  public isPlaying = false;
  private videoServiceSub;
  private videoServiceLock = false;

  constructor(private audioPlayerService: AudioPlayerService,
              private videoMetadataService: VideoMetadataService,
              private notificationService: NotificationService,
              private videoRecommendedService: VideoRecommendedService,
              private config: ConfigService,
              private utilsService: UtilsService) {
  }

  ngOnInit() {
    this.progress = '0';
    this.audioPlayerService.triggerVideoEventEmitter$.subscribe((e) => {
      this.playMedia(e);
    });
    this.audioPlayerService.triggerTogglePlayingEmitter$.subscribe((e) => {
      this.isPlaying = e.toggle;
    });
    this.audioPlayerService.triggerToggleLoadingEmitter$.subscribe((e) => {
      this.isLoading = e.toggle;
    });
  }

  public toggle() {
    if (!this.isPlaying) {
      this.activeSound.play();
    } else {
      this.activeSound.pause();
    }
  }

  public seekNext() {
    // if (this.progress > 100) {
    //   return;
    // }
    // this.progress++;
  }

  public seekPrev() {
    // if (this.progress < 0) {
    //   return;
    // }
    // this.progress--;
  }

  public playMedia(video) {
    if (this.videoServiceLock === true) {
      console.log('Cant select another video right now');
      return;
    }
    this.videoServiceLock = true;
    this.showNowPlayingBar = false;
    this.progress = '0';
    if (this.activeSound) {
      this.activeSound.stop();
    }
    this.audioPlayerService.triggerToggleLoading({videoId: video.videoId, toggle: true});
    this.audioPlayerService.triggerTogglePlaying({videoId: video.videoId, toggle: false});
    this.videoServiceSub = this.videoMetadataService.getVideo(video).subscribe(
      (videoResponse) => {
        this.video = videoResponse;
        this.buildAudioObject(this.video);
        this.activeSound.play();
      },
      (error) => {
        this.showNowPlayingBar = false;
        this.videoServiceLock = false;
        this.audioPlayerService.triggerToggleLoading({videoId: video.videoId, toggle: false});
        this.audioPlayerService.triggerTogglePlaying({videoId: video.videoId, toggle: false});
      });
  }

  private buildAudioObject (video) {
    this.activeSound = new Howl({
      src: [this.config.getAddress() + '/api/stream/' + video.videoId],
      format: ['webm'],
      html5: true,
      onplay: () => {
        this.duration = this.utilsService.formatTime(video.duration);
        this.showNowPlayingBar = true;
        this.audioPlayerService.triggerTogglePlaying({videoId: video.videoId, toggle: true});
        requestAnimationFrame(this.step.bind(this));
      },
      onpause: () => {
        // Leave this as an exception
        this.isPlaying = false;
      },
      onplayerror: (e) => {
        this.audioPlayerService.triggerToggleLoading({videoId: video.videoId, toggle: false});
        this.notificationService.showNotification({type: 'error', message: 'Sorry :( There was an error playing this video.'});
        this.videoServiceLock = false;
      },
      onloaderror: (e) => {
        this.audioPlayerService.triggerToggleLoading({videoId: video.videoId, toggle: false});
        this.notificationService.showNotification({type: 'error', message: 'Sorry :( There was an error loading this video.'});
        this.videoServiceLock = false;
      },
      onend: () => {
        this.audioPlayerService.triggerTogglePlaying({videoId: video.videoId, toggle: false});
      },
      onload: () => {
        this.videoRecommendedService.recommended(video.videoId);
        this.audioPlayerService.triggerToggleLoading({videoId: video.videoId, toggle: false});
        this.videoServiceLock = false;
      }
    });
  }

  private step () {
    const seek = this.activeSound.seek() || 0;
    this.timer = this.utilsService.formatTime(Math.round(seek));
    this.progress = (((seek / this.video.duration) * 100) || 0);

    if (this.activeSound.playing()) {
      requestAnimationFrame(this.step.bind(this));
    }
  }

}
