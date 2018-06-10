import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class AudioPlayerService {

  public triggerNowPlayingEmitter$: EventEmitter<any>;
  public triggerToggleLoadingEmitter$: EventEmitter<any>;

  constructor() {
    this.triggerNowPlayingEmitter$ = new EventEmitter();
    this.triggerToggleLoadingEmitter$ = new EventEmitter();
  }

  public triggerNowPlaying(video: any): void {
    this.triggerNowPlayingEmitter$.emit(video);
  }

  public triggerToggleLoading(video: any): void {
    this.triggerToggleLoadingEmitter$.emit(video);
  }

}
