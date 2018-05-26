import {Routes} from '@angular/router';
import {contentRoutes} from './container/content/content.routes';
import {ContentComponent} from './container/content/content.component';

export const appRoutes: Routes = [
  {path: 'app', component: ContentComponent},
  {path: 'app', children: contentRoutes}
];
