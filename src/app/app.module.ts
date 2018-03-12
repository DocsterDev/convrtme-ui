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
import {FileUploadService} from './service/file-upload.service';
import {HttpClientModule} from '@angular/common/http';
import {ProgressHttpModule} from 'angular-progress-http';
import {HttpModule} from '@angular/http';


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
    TileComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NgCircleProgressModule.forRoot(),
    FileDropModule,
    HttpClientModule,
    HttpModule,
    ProgressHttpModule
  ],
  providers: [FileUploadService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
