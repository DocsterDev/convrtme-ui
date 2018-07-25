import {Routes} from '@angular/router';
import {contentRoutes} from './container/content/content.routes';
import {ContentComponent} from './container/content/content.component';
import {YoutubeComponent} from './container/content/youtube/youtube.component';

export const appRoutes: Routes = [
  {path: '', component: YoutubeComponent},
  //{path: 'app', children: contentRoutes}
];
