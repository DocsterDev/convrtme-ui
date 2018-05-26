import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class AudioPlayerService {

  public triggerNowPlayingEmitter$: EventEmitter<any>;
  public triggerHideEmitter$: EventEmitter<any>;

  constructor() {
    this.triggerNowPlayingEmitter$ = new EventEmitter();
    this.triggerHideEmitter$ = new EventEmitter();
  }

  public triggerNowPlaying(name: string): void {
    this.triggerNowPlayingEmitter$.emit(name);
  }

  public triggerHide(name: string): void {
    this.triggerHideEmitter$.emit(name);
  }

}
