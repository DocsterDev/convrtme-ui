import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {VideoSearchService} from '../../../service/video-search.service';
import {VideoAutoCompleteService} from '../../../service/video-autocomplete.service';
import {AudioPlayerService} from '../../../global/audio-player/audio-player.service';
import {VideoRecommendedService} from '../../../service/video-recommended.service';
import {PlaylistService} from "../../../service/playlist.service";
import {UserService} from "../../../service/user.service";

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.sass']
})
export class YoutubeComponent implements OnInit, OnDestroy {

  public showPredictionsContainer: boolean;
  public predictions: Array<string>;
  public searchQuery: string;
  public videoList: any = [];
  public recommendedList: any = [];
  public playlists: any = [];

  private searchResultsSubscription: Subscription;
  private recommendedResultsSubscription: Subscription;
  private predictionsTimeout;

  @ViewChild('searchInput')
  public searchInput: ElementRef;

  static updateComponent(component, index, list) {
    component.index = index;
    list.push(component);
  }

  constructor(private videoAutoCompleteService: VideoAutoCompleteService,
              private videoSearchService: VideoSearchService,
              private videoRecommendedService: VideoRecommendedService,
              private audioPlayerService: AudioPlayerService,
              private playlistService: PlaylistService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.videoSearchService.search('sandman mgtow');
    this.searchResultsSubscription = this.videoSearchService.getResultList().subscribe((searchResults) => {
      if ( searchResults != null ) { this.videoRecommendedService.recommended(searchResults[0].videoId); }
      this.videoList = [];
      this.loadIncrementally(searchResults, this.videoList);
    });
    this.recommendedResultsSubscription = this.videoRecommendedService.getResultList().subscribe((recommendedResults) => {
      this.recommendedList = [];
      this.loadIncrementally(recommendedResults, this.recommendedList);
    });
    this.loadUserPlaylists();
  }

  public loadUserPlaylists(){
    setTimeout(() => {
      // TODO CREATE AN EVENT LISTENER FOR A WHEN A USER BECOMES VALID ON LOAD
      if (!this.userService.isUserValid()) {
        return;
      }
      // TODO Only load if user is logged in
      this.playlistService.getPlaylists().subscribe((response) => {
        this.playlists = response;
      });
    }, 500);

  }

  public handleAutoCompleteLookup(searchQuery) {
    clearTimeout(this.predictionsTimeout);
    if (searchQuery === '') {
      this.showPredictionsContainer = false;
      this.predictions = [];
      return;
    }
    this.predictionsTimeout = setTimeout(() => {
      this.videoAutoCompleteService.getAutoComplete(searchQuery).subscribe((autoCompleteResponse) => {
          this.predictions = [];
          autoCompleteResponse[1].forEach((e) => this.predictions.push(e));
          this.showPredictionsContainer = true;
        });
    });
  }

  public handleVideoSelect($video) {
    this.audioPlayerService.triggerVideoEvent($video);
    this.audioPlayerService.triggerToggleLoading({video: $video.videoId, toggle: true});
  }

  public handleRecommendedVideoSelect($video) {
    this.audioPlayerService.triggerVideoEvent($video);
    this.audioPlayerService.triggerToggleLoading({video: $video.videoId, toggle: true});
  }

  public handleSubmitSearch(searchQuery) {
    this.showPredictionsContainer = false;
    this.videoSearchService.search(searchQuery);
    this.searchQuery = '';
  }

  public handleAddPlaylist() {
    if (!this.userService.isUserValid()) {
      return;
    }
    console.log('Add Playlist');
    const playlist0 = {
      name: 'playlist_0',
      iconColor: 'F36262'
    };
    const playlist1 = {
      name: 'playlist_1',
      iconColor: 'F39E62'
    };
    const playlist2 = {
      name: 'playlist_2',
      iconColor: 'F7EE37'
    };
    const playlist3 = {
      name: 'playlist_3',
      iconColor: '8FDB49'
    };
    const playlist4 = {
      name: 'playlist_4',
      iconColor: '62BCF3'
    };
    const playlist5 = {
      name: 'playlist_5',
      iconColor: '668CDE'
    };
    this.playlistService.createPlaylist(playlist0).subscribe((response) => {

      this.playlistService.createPlaylist(playlist1).subscribe((response) => {

        this.playlistService.createPlaylist(playlist2).subscribe((response) => {

          this.playlistService.createPlaylist(playlist3).subscribe((response) => {

            this.playlistService.createPlaylist(playlist4).subscribe((response) => {

              this.playlistService.createPlaylist(playlist5).subscribe((response) => {

                this.loadUserPlaylists();

              });

            });

          });

        });

      });

    })

  }

  private loadIncrementally(data, list) {
    data.forEach((e, index) => {
      const delay = Math.floor((Math.random() * 1400));
      setTimeout(YoutubeComponent.updateComponent, delay, e, index, list);
    });
  }

  @HostListener('window:click') onClick() {
    if (this.showPredictionsContainer && this.searchInput.nativeElement !== document.activeElement) {
      this.showPredictionsContainer = false;
    }
  }

  ngOnDestroy() {
    this.searchResultsSubscription.unsubscribe();
  }

}
