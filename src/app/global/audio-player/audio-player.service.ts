import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class AudioPlayerService {

  public triggerNowPlayingEmitter$: EventEmitter<any>;
  public triggerToggleLoadingEmitter$: EventEmitter<string>;

  constructor() {
    this.triggerNowPlayingEmitter$ = new EventEmitter();
    this.triggerToggleLoadingEmitter$ = new EventEmitter();
  }

  public triggerNowPlaying(video: any): void {
    this.triggerNowPlayingEmitter$.emit(video);
  }

  public triggerToggleLoading(videoId: string): void {
    this.triggerToggleLoadingEmitter$.emit(videoId);
  }

}
