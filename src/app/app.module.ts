import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {ContainerComponent} from './container/container.component';
import {AdComponent} from './container/ad/ad.component';
import {PlaylistComponent} from './container/playlist/playlist.component';
import {VideoComponent} from './container/content/video/video.component';
import {AudioComponent} from './container/content/audio/audio.component';
import {ContentComponent} from './container/content/content.component';
import {SideNavComponent} from './container/side-nav/side-nav.component';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app.routes';
import {TileComponent} from './common/tile/tile.component';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {FileDropModule} from 'ngx-file-drop';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ProgressHttpModule} from 'angular-progress-http';
import {MetadataService} from './service/metadata.service';
import {UserService} from './service/user.service';
import {FormsModule} from '@angular/forms';
import {DropdownModule} from 'ng-custom-select';
import {ModalModule} from 'ngx-bootstrap';
import {YoutubeComponent} from './container/content/youtube/youtube.component';
import {StompService} from 'ng2-stomp-service';
import {UtilsService} from './service/utils.service';
import {LoaderComponent} from './common/loader/loader.component';
import {SearchCardComponent} from './container/content/youtube/search-card/search-card.component';
import {VideoService} from './service/video.service';
import {YoutubeSearchService} from './service/youtube-search.service';
import {YoutubeDownloadService} from './service/youtube-download.service';
import {NotificationComponent} from './global/notification/notification.component';
import {YoutubeAutoCompleteService} from './service/youtube-autocomplete.service';
import {GlobalHttpInterceptor} from './global/http-interceptor/global-http-interceptor';
import {HttpModule} from '@angular/http';
import {NotificationService} from './global/notification/notification.service';
import { AudioPlayerComponent } from './global/audio-player/audio-player.component';
import {AudioPlayerService} from "./global/audio-player/audio-player.service";
import {MomentModule} from "angular2-moment";
import {ConfigService} from "./service/config.service";
import {YoutubeRecommendedService} from "./service/youtube-recommended.service";
import {PlaylistService} from "./service/playlist.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    SideNavComponent,
    ContainerComponent,
    AdComponent,
    PlaylistComponent,
    VideoComponent,
    AudioComponent,
    TileComponent,
    YoutubeComponent,
    LoaderComponent,
    SearchCardComponent,
    NotificationComponent,
    AudioPlayerComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NgCircleProgressModule.forRoot(),
    FileDropModule,
    HttpClientModule,
    HttpModule,
    ProgressHttpModule,
    DropdownModule,
    ModalModule.forRoot(),
    MomentModule
  ],
  providers: [
    MetadataService,
    UserService,
    StompService,
    UtilsService,
    VideoService,
    YoutubeSearchService,
    YoutubeRecommendedService,
    YoutubeDownloadService,
    YoutubeAutoCompleteService,
    NotificationService,
    AudioPlayerService,
    ConfigService,
    PlaylistService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
