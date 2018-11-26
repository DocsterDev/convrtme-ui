import {Routes} from '@angular/router';
import {YoutubeComponent} from './container/content/youtube/youtube.component';
import {SignInComponent} from './container/content/sign-in/sign-in.component';

export const appRoutes: Routes = [
  {path: '', component: YoutubeComponent},
  {path: 'signin', component: SignInComponent}
];
