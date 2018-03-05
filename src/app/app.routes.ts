import {Routes} from '@angular/router';
import {AudioComponent} from './container/content/audio/audio.component';
import {VideoComponent} from './container/content/video/video.component';

export const appRoutes: Routes = [
  {path: 'app/convert/audio', component: AudioComponent},
  {path: 'app/convert/video', component: VideoComponent},
  // {path: 'app/convert/youtube', component: MainComponent}
];
