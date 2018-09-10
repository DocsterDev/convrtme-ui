import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {ContainerComponent} from './container/container.component';
import {VideoComponent} from './container/content/video/video.component';
import {AudioComponent} from './container/content/audio/audio.component';
import {ContentComponent} from './container/content/content.component';
import {SideNavComponent} from './container/side-nav/side-nav.component';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app.routes';
import {TileComponent} from './common/tile/tile.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MetadataService} from './service/metadata.service';
import {UserService} from './service/user.service';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap';
import {YoutubeComponent} from './container/content/youtube/youtube.component';
import {UtilsService} from './service/utils.service';
import {LoaderComponent} from './common/loader/loader.component';
import {SearchCardComponent} from './container/content/youtube/search-card/search-card.component';
import {VideoService} from './service/video.service';
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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    SideNavComponent,
    ContainerComponent,
    VideoComponent,
    AudioComponent,
    TileComponent,
    YoutubeComponent,
    LoaderComponent,
    SearchCardComponent,
    PlaylistCardComponent,
    NotificationComponent,
    AudioPlayerComponent,
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
    MetadataService,
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
