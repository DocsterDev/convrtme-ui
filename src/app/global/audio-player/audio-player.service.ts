import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class AudioPlayerService {

  public triggerNowPlayingEmitter$: EventEmitter<any>;

  constructor() {
    this.triggerNowPlayingEmitter$ = new EventEmitter();
  }

  public triggerNowPlaying(name: string): void {
    this.triggerNowPlayingEmitter$.emit(name);
  }

}
