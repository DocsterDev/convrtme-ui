import {AudioComponent} from './audio/audio.component';
import {Routes} from '@angular/router';
import {VideoComponent} from './video/video.component';
import {YoutubeComponent} from './youtube/youtube.component';

export const contentRoutes: Routes = [
  {path: 'audio', component: AudioComponent},
  {path: 'video', component: VideoComponent},
  {path: 'youtube', component: YoutubeComponent}
];
