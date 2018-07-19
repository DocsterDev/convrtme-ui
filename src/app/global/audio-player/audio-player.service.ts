import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class AudioPlayerService {

  public triggerTogglePlayingEmitter$: EventEmitter<any>;
  public triggerToggleLoadingEmitter$: EventEmitter<any>;
  public triggerVideoEventEmitter$: EventEmitter<any>;

  constructor() {
    this.triggerTogglePlayingEmitter$ = new EventEmitter();
    this.triggerToggleLoadingEmitter$ = new EventEmitter();
    this.triggerVideoEventEmitter$ = new EventEmitter();
  }

  public triggerTogglePlaying(playingConfig: any): void {
    this.triggerTogglePlayingEmitter$.emit(playingConfig)
  }

  public triggerToggleLoading(loadingConfig: any): void {
    this.triggerToggleLoadingEmitter$.emit(loadingConfig);
  }

  public triggerVideoEvent(video: any) {
    this.triggerVideoEventEmitter$.emit(video);
  }

}
