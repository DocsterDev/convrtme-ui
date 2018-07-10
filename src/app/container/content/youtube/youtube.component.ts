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
  public currentPlaylist: any = {id: ''};

  public playlistLoading = false;

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
      if ( searchResults != null ) { this.videoRecommendedService.recommended(searchResults[0].id); }
      this.videoList = [];
      this.loadIncrementally(searchResults, this.videoList);
    });
    this.recommendedResultsSubscription = this.videoRecommendedService.getResultList().subscribe((recommendedResults) => {
      this.recommendedList = [];
      this.loadIncrementally(recommendedResults, this.recommendedList);
    });
    this.userService.userSignedInEmitter$.subscribe((response) => {
      const user: any = response;
      if (user.valid) {
        this.playlistService.getPlaylists().subscribe((response) => {
          this.playlists = response;
        });
      }
    });
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
    this.audioPlayerService.triggerToggleLoading({video: $video.id, toggle: true});
  }

  public handleRecommendedVideoSelect($video) {
    this.audioPlayerService.triggerVideoEvent($video);
    this.audioPlayerService.triggerToggleLoading({video: $video.id, toggle: true});
  }

  public handleSubmitSearch(searchQuery) {
    this.showPredictionsContainer = false;
    this.videoSearchService.search(searchQuery);
    this.searchQuery = '';
  }

  public handleAddToCurrentPlaylist($video) {
    this.currentPlaylist.videos.push($video);
    this.playlistService.updateVideos(this.currentPlaylist.uuid, this.currentPlaylist.videos).subscribe((response) => {
      const resp: any = response;
      this.currentPlaylist = resp;
    });
  }

  public handleRemoveFromPlaylist($video) {
    this.currentPlaylist.videos = this.currentPlaylist.videos.filter(video => video.id !== $video.id);
    this.playlistService.updateVideos(this.currentPlaylist.uuid, this.currentPlaylist.videos).subscribe((response) => {
      const resp: any = response;
      this.currentPlaylist = resp;
    });
  }

  public clearPlaylist() {
    this.currentPlaylist.videos = [];
    this.playlistService.updateVideos(this.currentPlaylist.uuid, this.currentPlaylist.videos).subscribe((response) => {
      const resp: any = response;
      this.currentPlaylist = resp;
    });
  }

  public setPlaylistActive(playlist) {
    this.playlistLoading = true;
    this.playlistService.getPlaylist(playlist.uuid).subscribe((response) => {
      const resp: any = response;
      this.currentPlaylist =  resp;
    });
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
