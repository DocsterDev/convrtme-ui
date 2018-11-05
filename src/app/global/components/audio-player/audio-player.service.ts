import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class AudioPlayerService {

  public triggerTogglePlayingEmitter$: EventEmitter<any>;
  public triggerToggleLoadingEmitter$: EventEmitter<any>;
  public triggerHiddenEmitter$: EventEmitter<any>;
  public triggerVideoEventEmitter$: EventEmitter<any>;
  public triggerPlaylistActionEventEmitter$: EventEmitter<any>;
  public triggerPlaylistUpdateEventEmitter$: EventEmitter<any>;
  public triggerUpNextVideoEmitter$: EventEmitter<any>;
  public triggerNowPlayingVideoEmitter$: EventEmitter<any>;

  public video: any = {};

  constructor() {
    this.triggerTogglePlayingEmitter$ = new EventEmitter();
    this.triggerToggleLoadingEmitter$ = new EventEmitter();
    this.triggerHiddenEmitter$ = new EventEmitter();
    this.triggerVideoEventEmitter$ = new EventEmitter();
    this.triggerUpNextVideoEmitter$ = new EventEmitter();
    this.triggerPlaylistActionEventEmitter$ = new EventEmitter();
    this.triggerPlaylistUpdateEventEmitter$ = new EventEmitter();
    this.triggerNowPlayingVideoEmitter$ = new EventEmitter();
  }

  public triggerTogglePlaying(playingConfig: any): void {
    this.triggerTogglePlayingEmitter$.emit(playingConfig)
  }

  public triggerToggleLoading(loadingConfig: any): void {
    this.triggerToggleLoadingEmitter$.emit(loadingConfig);
  }

  public triggerHidden(hiddenConfig: any): void {
    this.triggerHiddenEmitter$.emit(hiddenConfig);
  }

  public triggerNextUpVideoEvent(video: any) {
    this.triggerUpNextVideoEmitter$.emit(video);
  }

  public triggerNowPlayingVideoEvent(video: any) {
    this.triggerNowPlayingVideoEmitter$.emit(video);
  }

  public triggerVideoEvent(video: any) {
    this.triggerVideoEventEmitter$.emit(video);
  }

  public triggerPlaylistActionEvent(action: any) {
    this.triggerPlaylistActionEventEmitter$.emit(action);
  }

  public triggerPlaylistUpdateEvent(playlist: any) {
    this.triggerPlaylistUpdateEventEmitter$.emit(playlist);
  }

  public getPlayingVideo() {
    return this.video ? this.video : {};
  };

  public setPlaylingVideo(video: any) {
    this.video = video;
  }

}
