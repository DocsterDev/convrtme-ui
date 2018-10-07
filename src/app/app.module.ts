import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {ContainerComponent} from './container/container.component';
import {ContentComponent} from './container/content/content.component';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app.routes';
import {TileComponent} from './common/tile/tile.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {UserService} from './service/user.service';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap';
import {YoutubeComponent} from './container/content/youtube/youtube.component';
import {UtilsService} from './service/utils.service';
import {LoaderComponent} from './common/loader/loader.component';
import {SearchCardComponent} from './container/content/youtube/search-card/search-card.component';
import {NotificationComponent} from './global/components/notification/notification.component';
import {GlobalInterceptor} from './global/services/global-interceptor';
import {NotificationService} from './global/components/notification/notification.service';
import {AudioPlayerComponent} from './global/components/audio-player/audio-player.component';
import {AudioPlayerService} from './global/components/audio-player/audio-player.service';
import {MomentModule} from 'angular2-moment';
import {PlaylistService} from './service/playlist.service';
import {VideoRecommendedService} from './service/video-recommended.service';
import {VideoAutoCompleteService} from './service/video-autocomplete.service';
import {VideoSearchService} from './service/video-search.service';
import {Ng2Webstorage} from 'ngx-webstorage';
import {PlaylistCardComponent} from './container/content/youtube/playlist-card/playlist-card.component';
import {NgxSmoothDnDModule} from 'ngx-smooth-dnd';
import {IpService} from './service/ip.service';
import {HeaderService} from './service/header.service';
import {StreamValidatorService} from './service/stream-validator.service';
import {NotificationCenterComponent} from './header/notification-center/notification-center.component';
import {ClickStopPropagationDirective} from './directives/click-stop-propagation.directive';
import {SearchAutoCompleteComponent} from './header/search-auto-complete/search-auto-complete.component';
import {ClickPreventDefaultDirective} from './directives/click-prevent-default.directive';
import {NotificationGroupComponent} from './header/notification-center/notification-group/notification-group.component';
import {NotificationVideoComponent} from './header/notification-center/notification-group/notification-video/notification-video.component';
import {NotificationCenterService} from './service/notification-center.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    ContainerComponent,
    TileComponent,
    YoutubeComponent,
    LoaderComponent,
    SearchCardComponent,
    PlaylistCardComponent,
    NotificationComponent,
    AudioPlayerComponent,
    NotificationCenterComponent,
    SearchAutoCompleteComponent,
    NotificationGroupComponent,
    NotificationVideoComponent,
    ClickStopPropagationDirective,
    ClickPreventDefaultDirective
  ],
  imports: [
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ModalModule.forRoot(),
    MomentModule,
    Ng2Webstorage,
    NgxSmoothDnDModule,
    BrowserAnimationsModule
  ],
  providers: [
    StreamValidatorService,
    UserService,
    UtilsService,
    VideoSearchService,
    VideoRecommendedService,
    VideoAutoCompleteService,
    NotificationService,
    AudioPlayerService,
    PlaylistService,
    IpService,
    HeaderService,
    NotificationCenterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
