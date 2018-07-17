import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {VideoSearchService} from '../../../service/video-search.service';
import {VideoAutoCompleteService} from '../../../service/video-autocomplete.service';
import {AudioPlayerService} from '../../../global/audio-player/audio-player.service';
import {VideoRecommendedService} from '../../../service/video-recommended.service';
import {PlaylistService} from "../../../service/playlist.service";
import {UserService} from "../../../service/user.service";
import {NotificationService} from "../../../global/notification/notification.service";
// import { ContainerComponent, DraggableComponent } from 'ngx-smooth-dnd';

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
  private playlistResultsSubscription: Subscription;
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
              private userService: UserService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.searchResultsSubscription = this.videoSearchService.getResultList().subscribe((searchResults) => {
      if ( searchResults != null ) { this.videoRecommendedService.recommended(searchResults[0].id); }
      this.videoList = [];
      this.loadIncrementally(searchResults, this.videoList);
    });
    this.recommendedResultsSubscription = this.videoRecommendedService.getResultList().subscribe((recommendedResults) => {
      this.recommendedList = [];
      this.loadIncrementally(recommendedResults, this.recommendedList);
    });
    this.playlistResultsSubscription = this.playlistService.getResultList().subscribe((playlistResults) => {
      this.currentPlaylist.videos = [];
      this.currentPlaylist.videos = playlistResults;
      // this.loadIncrementally(playlistResults, this.currentPlaylist.videos);
    });
    this.userService.userSignedInEmitter$.subscribe((response) => {
      const user: any = response;
      if (user.valid) {
        this.playlistService.getPlaylists().subscribe((response) => {
          this.playlists = response;
        });
        this.videoSearchService.search('sandman mgtow');
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

  public handleDndPlaylistSort(dropResult) {
    this.currentPlaylist.videos = this.applyDrag(this.currentPlaylist.videos, dropResult);
    const originalPlaylist = JSON.parse(JSON.stringify(this.currentPlaylist));
    this.playlistService.updateVideos(this.currentPlaylist.uuid, this.currentPlaylist.videos).subscribe((response) => {
      // const resp: any = response;
      // this.currentPlaylist.videos = resp;
    }, (error) => {
      console.log(JSON.stringify(error));
      this.currentPlaylist = originalPlaylist;
    });
  }

  public handleAddToCurrentPlaylist($video) {
    if (!this.currentPlaylist.videos) {
      console.log('No playlist is set to add to');
      return;
    }
    if (this.currentPlaylist.videos.length > 0) {
      for (const video of this.currentPlaylist.videos) {
        if (video.id === $video.id) {
          this.notificationService.showNotification({type: 'warn', message: 'Sorry, cant add the same video more than once: ' + $video.title});
          return;
        }
      }
    }
    const originalPlaylist = JSON.parse(JSON.stringify(this.currentPlaylist));
    this.currentPlaylist.videos.push($video);
    this.playlistService.updateVideos(this.currentPlaylist.uuid, this.currentPlaylist.videos).subscribe((response) => {
      // const resp: any = response;
      // this.currentPlaylist.videos = resp;
    }, (error) => {
      console.log(JSON.stringify(error));
      this.currentPlaylist = originalPlaylist;
    });
  }

  public handleRemoveFromPlaylist($event) {
    const originalPlaylist = JSON.parse(JSON.stringify(this.currentPlaylist));
    setTimeout(() => {
      this.currentPlaylist.videos = this.currentPlaylist.videos.filter(video => video.id !== $event.video.id);
      this.playlistService.deleteVideo(this.currentPlaylist.uuid, this.currentPlaylist.id).subscribe((response) => {
      const resp: any = response;
      // this.currentPlaylist.videos = resp;
    }, (error) => {
      console.log(JSON.stringify(error));
      this.currentPlaylist = originalPlaylist;
    });
    }, 100);
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
    this.playlistService.getPlaylistVideosEffect(playlist.uuid);
    // this.playlistService.getPlaylistVideos(playlist.uuid).subscribe((response) => {
      // const resp: any = response;
      this.currentPlaylist = JSON.parse(JSON.stringify(playlist));
      // this.currentPlaylist.videos =  resp;
    // });
  }

  private loadIncrementally(data, list) {
    data.forEach((e, index) => {
      const delay = Math.floor((Math.random() * 1100));
      const maxMillis = 500;
      const minMillis = 100;
      //const delay = Math.floor(Math.random() * (maxMillis - minMillis + 1)) + minMillis;
      setTimeout(YoutubeComponent.updateComponent, delay, e, index, list);
    });
  }

  // public onDrop(dropResult) {
  //   this.currentPlaylist.videos = applyDrag(this.currentPlaylist.videos, dropResult);
  // }

  private applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

  @HostListener('window:click') onClick() {
    if (this.showPredictionsContainer && this.searchInput.nativeElement !== document.activeElement) {
      this.showPredictionsContainer = false;
    }
  }

  ngOnDestroy() {
    this.searchResultsSubscription.unsubscribe();
  }

}
