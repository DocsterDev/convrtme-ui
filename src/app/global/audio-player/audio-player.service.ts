import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class AudioPlayerService {

  public triggerNowPlayingEmitter$: EventEmitter<any>;
  public triggerHideEmitter$: EventEmitter<any>;

  constructor() {
    this.triggerNowPlayingEmitter$ = new EventEmitter();
    this.triggerHideEmitter$ = new EventEmitter();
  }

  public triggerNowPlaying(video: any): void {
    this.triggerNowPlayingEmitter$.emit(video);
  }

  public triggerHide(): void {
    this.triggerHideEmitter$.emit();
  }

}
