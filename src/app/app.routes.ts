import {Routes} from '@angular/router';
import {AudioComponent} from './container/content/audio/audio.component';
import {VideoComponent} from './container/content/video/video.component';
import {contentRoutes} from './container/content/content.routes';
import {ContainerComponent} from './container/container.component';
import {ContentComponent} from './container/content/content.component';

export const appRoutes: Routes = [
  {path: 'app', component: ContentComponent},
  {path: 'app', children: contentRoutes}
];
